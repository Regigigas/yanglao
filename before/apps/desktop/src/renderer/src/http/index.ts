// apps/desktop/src/renderer/src/http/index.ts
// App 级 axios 实例 — 与 naive-ui message 集成，注入 token 管理
//
// 设计原则：
//   - packages/core 的 createHttp 是纯逻辑层（无 UI 依赖）
//   - 此文件是 UI 集成层：只在渲染进程使用
//   - 错误提示通过 naive-ui 的 useMessage 显示
//   - Token 从 Pinia useAuthStore 读取（预留接口，无 auth 时返回 null）

import { createHttp, cancelManager } from '@yanglao/core';
import type { HttpConfig } from '@yanglao/core';
import { createDiscreteApi } from 'naive-ui';

// ─── naive-ui 离散 API（在 setup 外使用 message/notification） ──
// 注意：须在 NConfigProvider 挂载后才能正确继承主题
const { message, notification } = createDiscreteApi(['message', 'notification']);

// ─── Token 存储（对接 Pinia；无鉴权需求时返回 null 即可） ───────
let _getToken: () => string | null = () => null;
let _refreshToken: (() => Promise<string | null>) | undefined;
let _onUnauthorized: (() => void) | undefined;

/**
 * 初始化 http 实例的鉴权钩子
 * 在 App.vue 的 setup 或 store 初始化后调用一次
 *
 * @example
 * // 无鉴权项目可跳过此调用
 * setupHttpAuth({
 *   getToken: () => authStore.token,
 *   refreshToken: () => authStore.refresh(),
 *   onUnauthorized: () => router.push('/login'),
 * })
 */
export function setupHttpAuth(opts: {
  getToken: () => string | null;
  refreshToken?: () => Promise<string | null>;
  onUnauthorized?: () => void;
}): void {
  _getToken = opts.getToken;
  _refreshToken = opts.refreshToken;
  _onUnauthorized = opts.onUnauthorized;
}

// ─── 实例配置 ──────────────────────────────────────────────────
const httpConfig: HttpConfig = {
  // baseURL 从环境变量注入；Electron 中可通过 import.meta.env.VITE_API_BASE_URL 配置
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  // 默认超时 10s（单位 ms）
  timeoutMs: Number(import.meta.env.VITE_REQUEST_TIMEOUT_MS ?? 10_000),
  // 成功 code：后端返回 0 或 200 均视为成功
  successCodes: [0, 200],
  // 服务端 5xx 最多重试 1 次，间隔 1000ms
  maxRetries: 1,
  retryDelayMs: 1_000,

  getToken: () => _getToken(),
  refreshToken: () => _refreshToken?.() ?? Promise.resolve(null),
  onUnauthorized: () => _onUnauthorized?.(),

  // ── 业务 / HTTP 错误统一提示 ──────────────────────────────
  onBizError: (_code, msg) => {
    message.error(msg || '操作失败', { duration: 4_000, keepAliveOnHover: true });
  },

  // ── 网络 / 超时错误提示 ───────────────────────────────────
  onNetworkError: (msg) => {
    notification.error({
      title: '网络异常',
      content: msg,
      duration: 6_000,
      keepAliveOnHover: true,
    });
  },
};

/** App 级 HTTP 实例（渲染进程使用此实例发起所有业务请求） */
export const http = createHttp(httpConfig);

/** 取消指定 key 的请求 */
export const cancelRequest = (key: string): void => cancelManager.abort(key);

/** 取消全部请求（路由切换时使用） */
export const cancelAllRequests = (): void => cancelManager.abortAll();

// ─── 便捷请求方法（含类型推导） ────────────────────────────────
export const get = <T = unknown>(
  url: string,
  params?: Record<string, unknown>,
  options?: import('@yanglao/core').RequestOptions,
) =>
  http.get<import('@yanglao/core').ApiResponse<T>>(url, {
    params,
    ...({ _options: options } as object),
  });

export const post = <T = unknown>(
  url: string,
  data?: unknown,
  options?: import('@yanglao/core').RequestOptions,
) =>
  http.post<import('@yanglao/core').ApiResponse<T>>(url, data, {
    ...({ _options: options } as object),
  });

export const put = <T = unknown>(
  url: string,
  data?: unknown,
  options?: import('@yanglao/core').RequestOptions,
) =>
  http.put<import('@yanglao/core').ApiResponse<T>>(url, data, {
    ...({ _options: options } as object),
  });

export const patch = <T = unknown>(
  url: string,
  data?: unknown,
  options?: import('@yanglao/core').RequestOptions,
) =>
  http.patch<import('@yanglao/core').ApiResponse<T>>(url, data, {
    ...({ _options: options } as object),
  });

export const del = <T = unknown>(
  url: string,
  options?: import('@yanglao/core').RequestOptions,
) =>
  http.delete<import('@yanglao/core').ApiResponse<T>>(url, {
    ...({ _options: options } as object),
  });
