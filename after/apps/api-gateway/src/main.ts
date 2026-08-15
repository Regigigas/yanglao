import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';
import * as jwt from 'jsonwebtoken';
import Redis from 'ioredis';
import type { NextFunction, Request, Response } from 'express';
import { RuntimeConfig } from '@app/config';
import { createMathCaptcha, hasPermission, requiredPermission } from '@app/security';
import { GatewayModule } from './app.module';

const publicPaths = new Set(['/auth/login', '/auth/register', '/auth/logout', '/code', '/health']);
const redis = new Redis({ host: process.env.REDIS_HOST ?? '127.0.0.1', port: Number(process.env.REDIS_PORT ?? 6379), password: process.env.REDIS_PASSWORD || undefined, lazyConnect: true, enableOfflineQueue: false, maxRetriesPerRequest: 1, connectTimeout: 1_500, retryStrategy: () => null });
redis.on('error', () => undefined);
let redisConnected = false;
const logger = new Logger('GatewayAuth');

function isPublic(path: string): boolean {
  return publicPaths.has(path) || path.startsWith('/file/statics/') || path.endsWith('/v3/api-docs') || path.includes('/docs');
}

function matchesPattern(value: string, pattern: string): boolean {
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replaceAll('*', '.*');
  return new RegExp(`^${escaped}$`).test(value);
}

async function sessionIsValid(userKey: string): Promise<boolean> {
  try {
    if (!redisConnected) { await redis.connect(); redisConnected = true; }
    return (await redis.exists(`login_tokens:${userKey}`)) === 1;
  } catch {
    redisConnected = false;
    return String(process.env.REDIS_REQUIRED).toLowerCase() !== 'true';
  }
}

async function authentication(request: Request, response: Response, next: NextFunction): Promise<void> {
  const blocked = RuntimeConfig.list('BLACKLIST_URLS');
  if (blocked.some((pattern) => matchesPattern(request.path, pattern))) {
    response.status(403).json({ code: 403, msg: '请求地址已被安全策略禁止' });
    return;
  }
  if (request.method === 'OPTIONS' || isPublic(request.path)) {
    next();
    return;
  }
  const token = request.header('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) {
    response.status(401).json({ code: 401, msg: '令牌不能为空' });
    return;
  }
  try {
    const claims = jwt.verify(token, process.env.JWT_SECRET ?? 'abcdefghijklmnopqrstuvwxyz', { algorithms: ['HS512'] });
    if (typeof claims !== 'object' || !claims.user_id || !claims.username) throw new Error('invalid claims');
    if (!(await sessionIsValid(String(claims.user_key ?? '')))) {
      response.status(401).json({ code: 401, msg: '登录状态已过期' });
      return;
    }
    request.headers.user_key = encodeURIComponent(String(claims.user_key ?? ''));
    request.headers.user_id = String(claims.user_id);
    request.headers.username = encodeURIComponent(String(claims.username));
    if (Array.isArray(claims.roles)) request.headers.roles = encodeURIComponent(JSON.stringify(claims.roles));
    if (Array.isArray(claims.permissions)) request.headers.permissions = encodeURIComponent(JSON.stringify(claims.permissions));
    const required = requiredPermission(request.method, request.path);
    const permissions = Array.isArray(claims.permissions) ? claims.permissions.map(String) : [];
    if (required && !hasPermission(permissions, required)) {
      response.status(403).json({ code: 403, msg: `没有访问权限: ${required}` });
      return;
    }
    delete request.headers['from-source'];
    next();
  } catch (error) {
    logger.warn(`Token validation failed: ${error instanceof Error ? error.message : String(error)}`);
    response.status(401).json({ code: 401, msg: '令牌已过期或验证不正确' });
  }
}

async function bootstrap(): Promise<void> {
  RuntimeConfig.validateProduction();
  const app = await NestFactory.create(GatewayModule, { cors: true });
  app.use(authentication);
  const express = app.getHttpAdapter().getInstance();
  express.get('/code', async (_request: Request, response: Response) => {
    const captchaEnabled = RuntimeConfig.boolean('CAPTCHA_ENABLED', false);
    if (!captchaEnabled) {
      response.json({ code: 200, msg: '操作成功', captchaEnabled: false, uuid: '', img: '' });
      return;
    }
    try {
      if (!redisConnected) { await redis.connect(); redisConnected = true; }
      const challenge = createMathCaptcha();
      await redis.set(`captcha_codes:${challenge.uuid}`, JSON.stringify(challenge.answer), 'EX', RuntimeConfig.number('CAPTCHA_TTL_SECONDS', 120));
      response.json({ code: 200, msg: '操作成功', captchaEnabled: true, uuid: challenge.uuid, img: challenge.image });
    } catch (error) {
      redisConnected = false;
      logger.error(`Captcha storage failed: ${error instanceof Error ? error.message : String(error)}`);
      response.status(503).json({ code: 503, msg: '验证码服务暂不可用' });
    }
  });
  const proxies: Array<[string, string]> = [
    ['/auth', process.env.AUTH_SERVICE_URL ?? 'http://127.0.0.1:9200'],
    ['/system', process.env.SYSTEM_SERVICE_URL ?? 'http://127.0.0.1:9201'],
    ['/code', process.env.GENERATOR_SERVICE_URL ?? 'http://127.0.0.1:9202'],
    ['/schedule', process.env.SCHEDULER_SERVICE_URL ?? 'http://127.0.0.1:9203'],
    ['/file', process.env.FILE_SERVICE_URL ?? 'http://127.0.0.1:9300'],
  ];
  for (const [prefix, target] of proxies) {
    app.use(prefix, createProxyMiddleware({
      target,
      changeOrigin: true,
      xfwd: true,
      proxyTimeout: 30_000,
      on: {
        error(error, _request, response) {
          const outgoing = response as Response;
          if (!outgoing.headersSent) outgoing.status(503).json({ code: 503, msg: `服务暂不可用: ${error.message}` });
        },
      },
    }));
  }
  app.enableShutdownHooks();
  await app.listen(Number(process.env.GATEWAY_PORT ?? 8080), '0.0.0.0');
}

void bootstrap();
