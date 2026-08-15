import type { Type } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { XssInterceptor } from './xss.interceptor';

export async function bootstrapService(moduleType: Type<unknown>, serviceName: string, defaultPort: number): Promise<void> {
  const app = await NestFactory.create(moduleType, { cors: true });
  app.useGlobalInterceptors(new XssInterceptor());
  app.enableShutdownHooks();
  const envName = `${serviceName.toUpperCase()}_PORT`;
  await app.listen(Number(process.env[envName] ?? defaultPort), '0.0.0.0');
}
