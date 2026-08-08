// packages/core/src/http/error.ts
// 错误分类体系：让调用方能精确区分错误类型，而不是一律 catch Error

/** 业务错误：HTTP 成功但 code 非 0/200 */
export class BizError extends Error {
  readonly type = 'BizError' as const;
  constructor(
    public readonly code: number,
    message: string,
  ) {
    super(message);
    this.name = 'BizError';
  }
}

/** HTTP 错误：4xx / 5xx */
export class HttpError extends Error {
  readonly type = 'HttpError' as const;
  constructor(
    public readonly status: number,
    message: string,
    public readonly data?: unknown,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

/** 网络错误：无网络 / DNS 失败 / CORS */
export class NetworkError extends Error {
  readonly type = 'NetworkError' as const;
  constructor(message = '网络连接失败，请检查网络设置') {
    super(message);
    this.name = 'NetworkError';
  }
}

/** 超时错误 */
export class TimeoutError extends Error {
  readonly type = 'TimeoutError' as const;
  constructor(public readonly timeoutMs: number) {
    super(`请求超时（${timeoutMs}ms）`);
    this.name = 'TimeoutError';
  }
}

/** 请求被主动取消 */
export class CancelError extends Error {
  readonly type = 'CancelError' as const;
  constructor(message = '请求已取消') {
    super(message);
    this.name = 'CancelError';
  }
}

export type AppError =
  | BizError
  | HttpError
  | NetworkError
  | TimeoutError
  | CancelError;

/** 类型守卫 */
export const isBizError = (e: unknown): e is BizError =>
  e instanceof BizError;
export const isHttpError = (e: unknown): e is HttpError =>
  e instanceof HttpError;
export const isNetworkError = (e: unknown): e is NetworkError =>
  e instanceof NetworkError;
export const isTimeoutError = (e: unknown): e is TimeoutError =>
  e instanceof TimeoutError;
export const isCancelError = (e: unknown): e is CancelError =>
  e instanceof CancelError;

/** 从任意错误中提取可读信息 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof BizError) return error.message;
  if (error instanceof HttpError) return `服务器错误 (${error.status})`;
  if (error instanceof NetworkError) return error.message;
  if (error instanceof TimeoutError) return error.message;
  if (error instanceof CancelError) return error.message;
  if (error instanceof Error) return error.message;
  return '未知错误';
}
