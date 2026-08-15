import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { affected, success, table, type DataRecord, type PageQuery } from '@app/common';
import { SchedulerService } from './scheduler.service';

@Controller()
export class SchedulerController {
  constructor(private readonly scheduler: SchedulerService) {}
  @Get('job/list') async list(@Query() query: PageQuery): Promise<DataRecord> { const result = await this.scheduler.list(query); return table(result.rows, result.total); }
  @Post('job/export') async exportJobs(@Query() query: PageQuery): Promise<DataRecord> { const result = await this.scheduler.list({ ...query, pageSize: 500 }); return success(result.rows); }
  @Get('job/log/list') async logs(@Query() query: PageQuery): Promise<DataRecord> { const result = await this.scheduler.logs(query); return table(result.rows, result.total); }
  @Post('job/log/export') async exportLogs(@Query() query: PageQuery): Promise<DataRecord> { const result = await this.scheduler.logs({ ...query, pageSize: 500 }); return success(result.rows); }
  @Delete('job/log/clean') async clean(): Promise<DataRecord> { await this.scheduler.cleanLogs(); return success(); }
  @Get('job/log/:id') async log(@Param('id') id: string): Promise<DataRecord> { return success(await this.scheduler.getLog(Number(id))); }
  @Delete('job/log/:ids') async removeLogs(@Param('ids') ids: string): Promise<DataRecord> { return affected(await this.scheduler.removeLogs(this.ids(ids))); }
  @Get('job/:id') async get(@Param('id') id: string): Promise<DataRecord> { return success(await this.scheduler.get(Number(id))); }
  @Post('job') async create(@Body() body: DataRecord, @Req() request: Request): Promise<DataRecord> { return affected(await this.scheduler.create(body, this.username(request))); }
  @Put('job') async update(@Body() body: DataRecord, @Req() request: Request): Promise<DataRecord> { return affected(await this.scheduler.update(body, this.username(request))); }
  @Put('job/changeStatus') async status(@Body() body: DataRecord): Promise<DataRecord> { return affected(await this.scheduler.changeStatus(body)); }
  @Put('job/run') async run(@Body() body: DataRecord): Promise<DataRecord> { await this.scheduler.run(Number(body.jobId)); return success(); }
  @Delete('job/:ids') async remove(@Param('ids') ids: string): Promise<DataRecord> { return affected(await this.scheduler.remove(this.ids(ids))); }
  private ids(value: string): number[] { return value.split(',').map(Number).filter(Boolean); }
  private username(request: Request): string { return decodeURIComponent(String(request.headers.username ?? 'system')); }
}
