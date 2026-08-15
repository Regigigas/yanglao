import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly client: Redis;
  private connected = false;

  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST ?? '127.0.0.1',
      port: Number(process.env.REDIS_PORT ?? 6379),
      password: process.env.REDIS_PASSWORD || undefined,
      lazyConnect: true,
      enableOfflineQueue: false,
      maxRetriesPerRequest: 1,
      connectTimeout: 1_500,
      retryStrategy: () => null,
    });
    this.client.on('error', () => undefined);
  }

  async available(): Promise<boolean> {
    try {
      if (!this.connected) { await this.client.connect(); this.connected = true; }
      return (await this.client.ping()) === 'PONG';
    } catch (error) {
      this.connected = false;
      this.logger.debug(`Redis unavailable: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }

  async setJson(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    if (await this.available()) await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    else if (this.required()) throw new Error('Redis不可用');
  }

  async getJson<T>(key: string): Promise<T | null> {
    if (!(await this.available())) return null;
    const value = await this.client.get(key);
    return value ? JSON.parse(value) as T : null;
  }

  async expire(key: string, ttlSeconds: number): Promise<boolean> {
    return (await this.available()) ? (await this.client.expire(key, ttlSeconds)) === 1 : !this.required();
  }

  async delete(key: string): Promise<void> {
    if (await this.available()) await this.client.del(key);
  }

  async keys(pattern: string): Promise<string[]> {
    if (!(await this.available())) return [];
    const result: string[] = []; let cursor = '0';
    do {
      const [next, keys] = await this.client.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
      cursor = next; result.push(...keys);
    } while (cursor !== '0');
    return result;
  }

  private required(): boolean { return String(process.env.REDIS_REQUIRED).toLowerCase() === 'true'; }

  async onModuleDestroy(): Promise<void> {
    if (this.connected) await this.client.quit();
  }
}
