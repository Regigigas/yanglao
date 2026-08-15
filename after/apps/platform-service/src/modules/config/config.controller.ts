import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { DatabaseService, affected, success, table, type DataRecord, type PageQuery } from '@app/common';
import { CONFIG_RESOURCE } from '../../domain/resources';
import { currentUsername, ids, sendCsv } from '../../shared/http.helpers';

@Controller('config')
export class ConfigController {
  constructor(private readonly database: DatabaseService) {}

  @Get('list')
  async list(@Query() query: PageQuery): Promise<DataRecord> {
    const result = await this.database.list(CONFIG_RESOURCE, query);
    return table(result.rows, result.total);
  }

  @Post('export')
  async export(@Body() query: PageQuery, @Res() response: Response): Promise<void> {
    const result = await this.database.list(CONFIG_RESOURCE, { ...query, pageNum: 1, pageSize: 500 });
    sendCsv(response, CONFIG_RESOURCE, result.rows);
  }

  @Get('configKey/:configKey')
  async configByKey(@Param('configKey') configKey: string): Promise<DataRecord> {
    const rows = await this.database.query<{ configValue: string }>('SELECT config_value FROM sys_config WHERE config_key=? LIMIT 1', [configKey]);
    return success(rows[0]?.configValue ?? '');
  }

  @Delete('refreshCache')
  refreshCache(): DataRecord {
    return success();
  }

  @Get(':id')
  async get(@Param('id') id: string): Promise<DataRecord> {
    return success(await this.database.get(CONFIG_RESOURCE, id));
  }

  @Post()
  async create(@Req() request: Request, @Body() body: DataRecord): Promise<DataRecord> {
    return affected((await this.database.insert(CONFIG_RESOURCE, body, currentUsername(request))).affectedRows);
  }

  @Put()
  async update(@Req() request: Request, @Body() body: DataRecord): Promise<DataRecord> {
    return affected((await this.database.update(CONFIG_RESOURCE, body, currentUsername(request))).affectedRows);
  }

  @Delete(':ids')
  async remove(@Param('ids') idsText: string): Promise<DataRecord> {
    return affected((await this.database.remove(CONFIG_RESOURCE, ids(idsText))).affectedRows);
  }
}
