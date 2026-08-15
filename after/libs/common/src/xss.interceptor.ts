import { BadRequestException, type CallHandler, type ExecutionContext, Injectable, type NestInterceptor } from '@nestjs/common';
import type { Observable } from 'rxjs';

@Injectable()
export class XssInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (String(process.env.XSS_ENABLED ?? 'true').toLowerCase() !== 'true') return next.handle();
    const request = context.switchToHttp().getRequest<{ path?: string; body?: unknown; query?: unknown }>();
    const excludes = String(process.env.XSS_EXCLUDE_PATHS ?? '/notice').split(',').map((path) => path.trim()).filter(Boolean);
    if (excludes.some((path) => String(request.path ?? '').startsWith(path))) return next.handle();
    if (this.containsUnsafeMarkup(request.body) || this.containsUnsafeMarkup(request.query)) {
      throw new BadRequestException('请求内容包含不安全的脚本或事件属性');
    }
    return next.handle();
  }

  private containsUnsafeMarkup(value: unknown): boolean {
    if (typeof value === 'string') return /<\s*script\b|javascript\s*:|on(?:error|load|click|mouseover)\s*=/i.test(value);
    if (Array.isArray(value)) return value.some((item) => this.containsUnsafeMarkup(item));
    if (value && typeof value === 'object') return Object.values(value as Record<string, unknown>).some((item) => this.containsUnsafeMarkup(item));
    return false;
  }
}
