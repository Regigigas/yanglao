// packages/core/src/http/client.ts
// Axios 实例工厂 — 完整配置版
// 包含：Token 注入、Token 刷新队列、请求 ID、请求取消、重试、错误分类

import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import {
  BizError,
  HttpError,
  NetworkError,
  TimeoutError,
  CancelError,
} from './error';
import type { HttpConfig, InternalRequestConfig } from './types';

// ─── 请求取消管理器 ────────────────────────────────────────────

class CancelManager {
  private controllers = new Map<string, AbortController>();

  /** 注册请求，返回 signal；若 key 已存在则先取消旧请求 */
  register(key: string): AbortSignal {
    this.abort(key);
    const controller = new AbortController();
    this.controllers.set(key, controller);
    return controller.signal;
  }

  /** 取消指定 key 的请求 */
  abort(key: string): void {
    const ctrl = this.controllers.get(key);
    if (ctrl) {
      ctrl.abort();
      this.controllers.delete(key);
    }
  }

  /** 取消全部请求 */
  abortAll(): void {
    this.controllers.forEach((ctrl) => ctrl.abort());
    this.controllers.clear();
  }

  remove(key: string): void {
    this.controllers.delete(key);
  }
}

export const cancelManager = new CancelManager();

// ─── Token 刷新队列 ────────────────────────────────────────────
// 401 时只发一次刷新请求，其余并发请求排队等待结果

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

function subscribeRefresh(cb: (token: string | null) => void): void {
  refreshQueue.push(cb);
}

function resolveRefreshQueue(token: string | null): void {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
}

// ─── 工厂函数 ──────────────────────────────────────────────────

export function createHttp(config: HttpConfig): AxiosInstance {
  const successCodes = config.successCodes ?? [0, 200];
  const maxRetries = config.maxRetries ?? 0;
  const retryDelayMs = config.retryDelayMs ?? 1000;

  const instance = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeoutMs ?? 10000,
    headers: {
      'Content-Type': 'application/json',
      ...config.headers,
    },
  });

  // ── 请求拦截器 ────────────────────────────────────────────────
  instance.interceptors.request.use(
    (req: InternalAxiosRequestConfig) => {
      const cfg = req as InternalRequestConfig;

      // 1. 注入 Authorization Token
      const token = config.getToken?.();
      if (token && req.headers) {
        req.headers['Authorization'] = `Bearer ${token}`;
      }

      // 2. 注入请求 ID（方便后端日志追踪）
      const requestId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      if (req.headers) {
        req.headers['X-Request-Id'] = requestId;
        req.headers['X-Client-Time'] = String(Date.now());
      }

      // 3. 自定义超时覆盖
      if (cfg._options?.timeoutMs) {
        req.timeout = cfg._options.timeoutMs;
      }

      // 4. 请求取消（同 key 的新请求取消上一个）
      const cancelKey = cfg._options?.cancelKey;
      if (cancelKey) {
        req.signal = cancelManager.register(cancelKey);
      }

      return req;
    },
    (error: unknown) => Promise.reject(error),
  );

  // ── 响应拦截器 ────────────────────────────────────────────────
  instance.interceptors.response.use(
    (res) => {
      const cfg = res.config as InternalRequestConfig;
      const data = res.data;

      // 清理取消控制器
      if (cfg._options?.cancelKey) {
        cancelManager.remove(cfg._options.cancelKey);
      }

      // 跳过业务 code 检查（如文件下载等直接返回 blob 的接口）
      if (cfg._options?.skipBizCheck) {
        return res;
      }

      // 业务 code 校验
      if (data && typeof data === 'object' && 'code' in data) {
        const { code, message } = data as { code: number; message: string };
        if (!successCodes.includes(code)) {
          const bizErr = new BizError(code, message ?? '业务处理失败');
          if (!cfg._options?.silent) {
            config.onBizError?.(code, message, cfg);
          }
          return Promise.reject(bizErr);
        }
      }

      return res;
    },

    async (error: unknown) => {
      // 请求被取消 — 不做任何提示，直接透传
      if (axios.isCancel(error)) {
        return Promise.reject(new CancelError());
      }

      if (!axios.isAxiosError(error)) {
        return Promise.reject(error);
      }

      const cfg = (error.config ?? {}) as InternalRequestConfig;

      // 超时
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        const err = new TimeoutError(cfg.timeout ?? 10000);
        if (!cfg._options?.silent) {
          config.onNetworkError?.(err.message);
        }
        return Promise.reject(err);
      }

      // 无响应（网络错误）
      if (!error.response) {
        const err = new NetworkError();
        if (!cfg._options?.silent) {
          config.onNetworkError?.(err.message);
        }
        return Promise.reject(err);
      }

      const { status } = error.response;

      // ── 401：尝试刷新 Token ───────────────────────────────────
      if (
        status === 401 &&
        !cfg._isRetryingToken &&
        config.refreshToken
      ) {
        if (isRefreshing) {
          // 其他请求正在刷新，排队等待新 Token
          return new Promise((resolve, reject) => {
            subscribeRefresh((newToken) => {
              if (!newToken) {
                reject(new HttpError(401, '登录已过期'));
                return;
              }
              if (cfg.headers) {
                cfg.headers['Authorization'] = `Bearer ${newToken}`;
              }
              resolve(instance(cfg));
            });
          });
        }

        isRefreshing = true;
        cfg._isRetryingToken = true;

        try {
          const newToken = await config.refreshToken();
          isRefreshing = false;
          resolveRefreshQueue(newToken);

          if (!newToken) {
            config.onUnauthorized?.();
            return Promise.reject(new HttpError(401, '登录已过期'));
          }

          if (cfg.headers) {
            cfg.headers['Authorization'] = `Bearer ${newToken}`;
          }
          return instance(cfg);
        } catch {
          isRefreshing = false;
          resolveRefreshQueue(null);
          config.onUnauthorized?.();
          return Promise.reject(new HttpError(401, '登录已过期'));
        }
      }

      if (status === 401) {
        config.onUnauthorized?.();
        return Promise.reject(new HttpError(401, '登录已过期'));
      }

      // ── 重试逻辑（5xx 或网络抖动） ───────────────────────────
      const retryCount = cfg._retryCount ?? 0;
      const shouldRetry =
        maxRetries > 0 &&
        retryCount < maxRetries &&
        (status >= 500 || !error.response);

      if (shouldRetry) {
        cfg._retryCount = retryCount + 1;
        await new Promise((r) => setTimeout(r, retryDelayMs * cfg._retryCount!));
        return instance(cfg);
      }

      // ── 其他 HTTP 错误 ────────────────────────────────────────
      const httpErr = new HttpError(
        status,
        error.response.data?.message ??
          HTTP_STATUS_TEXT[status] ??
          `服务器错误 (${status})`,
        error.response.data,
      );

      if (!cfg._options?.silent) {
        config.onBizError?.(status, httpErr.message, cfg);
      }

      return Promise.reject(httpErr);
    },
  );

  return instance;
}

// ─── 常用 HTTP 状态码文案 ──────────────────────────────────────
const HTTP_STATUS_TEXT: Record<number, string> = {
  400: '请求参数有误',
  403: '无权限访问',
  404: '请求的资源不存在',
  405: '请求方法不允许',
  408: '请求超时',
  409: '数据冲突',
  422: '数据验证失败',
  429: '请求过于频繁，请稍后再试',
  500: '服务器内部错误',
  502: '网关错误',
  503: '服务暂时不可用',
  504: '网关超时',
};
