// packages/core/src/http/types.ts

import type { AxiosRequestConfig, AxiosResponse } from 'axios';
// ApiResponse 由 types/index.ts 统一定义，此处直接复用
export type { ApiResponse } from '../types/index';

/** Http 实例工厂配置 */
export interface HttpConfig {
  /** 基础 URL */
  baseURL: string;
  /** 请求超时（ms），默认 10000ms */
  timeoutMs?: number;
  /** 自定义请求头 */
  headers?: Record<string, string>;
  /** 获取 Token 的函数（每次请求前调用） */
  getToken?: () => string | null | undefined;
  /** 刷新 Token 的函数，返回新 Token；返回 null 表示刷新失败 */
  refreshToken?: () => Promise<string | null>;
  /** 业务 code 非成功值时的回调 */
  onBizError?: (code: number, message: string, config: AxiosRequestConfig) => void;
  /** 401 且刷新失败时的回调（一般用于跳转登录） */
  onUnauthorized?: () => void;
  /** 网络/超时错误回调 */
  onNetworkError?: (message: string) => void;
  /** 成功 code 列表，默认 [0, 200] */
  successCodes?: number[];
  /** 请求失败最大重试次数（默认 0，不重试）*/
  maxRetries?: number;
  /** 重试间隔（ms），默认 1000ms */
  retryDelayMs?: number;
}

/** 单次请求附加选项（通过 config.params._options 透传） */
export interface RequestOptions {
  /** 是否跳过业务错误拦截（默认 false） */
  skipBizCheck?: boolean;
  /** 是否跳过全局错误提示（默认 false） */
  silent?: boolean;
  /** 取消请求的 key（同 key 的新请求会取消上一个） */
  cancelKey?: string;
  /** 自定义超时（ms），覆盖实例默认值 */
  timeoutMs?: number;
}

/** 扩展 AxiosRequestConfig，携带内部元数据 */
export interface InternalRequestConfig extends AxiosRequestConfig {
  _options?: RequestOptions;
  /** 已重试次数 */
  _retryCount?: number;
  /** 是否正在刷新 Token（防止循环） */
  _isRetryingToken?: boolean;
}

export type { AxiosResponse };
