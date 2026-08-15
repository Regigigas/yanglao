import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { DatabaseService, affected, success, table, type DataRecord, type PageQuery, type Primitive } from '@app/common';
import { POST_RESOURCE } from './resources';

@Controller('post')
export class PostController {
  constructor(private readonly database: DatabaseService) {}

  @Get('list')
  async list(@Query() query: PageQuery): Promise<DataRecord> {
    const result = await this.database.list(POST_RESOURCE, query);
    return table(result.rows, result.total);
  }

  @Post('export')
  async export(@Body() query: PageQuery, @Res() response: Response): Promise<void> {
    const result = await this.database.list(POST_RESOURCE, { ...query, pageNum: 1, pageSize: 500 });
    const columns = POST_RESOURCE.columns;
    const escape = (value: unknown): string => `"${String(value ?? '').replaceAll('"', '""')}"`;
    const csv = [`\uFEFF${columns.join(',')}`, ...result.rows.map((row) => columns.map((column) => escape(row[column])).join(','))].join('\r\n');
    response.setHeader('Content-Type', 'text/csv; charset=utf-8');
    response.setHeader('Content-Disposition', 'attachment; filename=sys_post.csv');
    response.send(csv);
  }

  @Get('optionselect')
  async options(): Promise<DataRecord> {
    return success(await this.database.query("SELECT * FROM sys_post WHERE status='0' ORDER BY post_sort"));
  }

  @Get(':id')
  async get(@Param('id') id: string): Promise<DataRecord> {
    return success(await this.database.get(POST_RESOURCE, id));
  }

  @Post()
  async create(@Req() request: Request, @Body() body: DataRecord): Promise<DataRecord> {
    return affected((await this.database.insert(POST_RESOURCE, body, this.username(request))).affectedRows);
  }

  @Put()
  async update(@Req() request: Request, @Body() body: DataRecord): Promise<DataRecord> {
    return affected((await this.database.update(POST_RESOURCE, body, this.username(request))).affectedRows);
  }

  @Delete(':ids')
  async remove(@Param('ids') idsText: string): Promise<DataRecord> {
    const ids: Primitive[] = idsText.split(',').map((id) => id.trim()).filter(Boolean);
    return affected((await this.database.remove(POST_RESOURCE, ids)).affectedRows);
  }

  private username(request: Request): string {
    return decodeURIComponent(String(request.headers.username ?? 'system'));
  }
}
