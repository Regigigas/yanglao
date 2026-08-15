import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { resolve } from 'node:path';
import { FileModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(FileModule, { cors: true });
  app.useStaticAssets(resolve(process.env.UPLOAD_DIR ?? './uploads'), { prefix: '/statics/' });
  app.enableShutdownHooks();
  await app.listen(Number(process.env.FILE_PORT ?? 9300), '0.0.0.0');
}
void bootstrap();
