import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { DatabaseService, success, type DataRecord } from '@app/common';
import { SyncService } from './sync.service';

@Controller()
export class SyncController {
  constructor(
    private readonly database: DatabaseService,
    private readonly sync: SyncService,
  ) {}

  @Get('health')
  async health(): Promise<DataRecord> {
    return { status: (await this.database.ping()) ? 'ok' : 'degraded', service: 'sync-service', timestamp: new Date().toISOString() };
  }

  @Post('sync/upload')
  async upload(@Body() body: DataRecord, @Req() request: Request): Promise<DataRecord> {
    return success(await this.sync.upload(body, this.userId(request)));
  }

  @Post('sync/download')
  async download(@Body() body: DataRecord, @Req() request: Request): Promise<DataRecord> {
    return success(await this.sync.download(body, this.userId(request)));
  }

  private userId(request: Request): number {
    return Number(request.headers.user_id ?? 0);
  }
}
