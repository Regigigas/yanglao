import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { DatabaseService, affected, success, table, type DataRecord, type PageQuery } from '@app/common';
import { DICT_DATA_RESOURCE, DICT_TYPE_RESOURCE } from '../../domain/resources';
import { currentUsername, ids, sendCsv } from '../../shared/http.helpers';

@Controller('dict')
export class DictionaryController {
  constructor(private readonly database: DatabaseService) {}

  @Get('type/list')
  async typeList(@Query() query: PageQuery): Promise<DataRecord> {
    const result = await this.database.list(DICT_TYPE_RESOURCE, query);
    return table(result.rows, result.total);
  }

  @Get('data/list')
  async dataList(@Query() query: PageQuery): Promise<DataRecord> {
    const result = await this.database.list(DICT_DATA_RESOURCE, query);
    return table(result.rows, result.total);
  }

  @Post('type/export')
  async exportTypes(@Body() query: PageQuery, @Res() response: Response): Promise<void> {
    const result = await this.database.list(DICT_TYPE_RESOURCE, { ...query, pageNum: 1, pageSize: 500 });
    sendCsv(response, DICT_TYPE_RESOURCE, result.rows);
  }

  @Post('data/export')
  async exportData(@Body() query: PageQuery, @Res() response: Response): Promise<void> {
    const result = await this.database.list(DICT_DATA_RESOURCE, { ...query, pageNum: 1, pageSize: 500 });
    sendCsv(response, DICT_DATA_RESOURCE, result.rows);
  }

  @Get('data/type/:dictType')
  async dictByType(@Param('dictType') dictType: string): Promise<DataRecord> {
    return success(await this.database.query("SELECT * FROM sys_dict_data WHERE dict_type=? AND status='0' ORDER BY dict_sort", [dictType]));
  }

  @Get('type/optionselect')
  async options(): Promise<DataRecord> {
    return success(await this.database.query('SELECT * FROM sys_dict_type ORDER BY dict_id'));
  }

  @Delete('type/refreshCache')
  refreshCache(): DataRecord {
    return success();
  }

  @Get('type/:id')
  async getType(@Param('id') id: string): Promise<DataRecord> {
    return success(await this.database.get(DICT_TYPE_RESOURCE, id));
  }

  @Get('data/:id')
  async getData(@Param('id') id: string): Promise<DataRecord> {
    return success(await this.database.get(DICT_DATA_RESOURCE, id));
  }

  @Post('type')
  async createType(@Req() request: Request, @Body() body: DataRecord): Promise<DataRecord> {
    return affected((await this.database.insert(DICT_TYPE_RESOURCE, body, currentUsername(request))).affectedRows);
  }

  @Post('data')
  async createData(@Req() request: Request, @Body() body: DataRecord): Promise<DataRecord> {
    return affected((await this.database.insert(DICT_DATA_RESOURCE, body, currentUsername(request))).affectedRows);
  }

  @Put('type')
  async updateType(@Req() request: Request, @Body() body: DataRecord): Promise<DataRecord> {
    return affected((await this.database.update(DICT_TYPE_RESOURCE, body, currentUsername(request))).affectedRows);
  }

  @Put('data')
  async updateData(@Req() request: Request, @Body() body: DataRecord): Promise<DataRecord> {
    return affected((await this.database.update(DICT_DATA_RESOURCE, body, currentUsername(request))).affectedRows);
  }

  @Delete('type/:ids')
  async removeType(@Param('ids') idsText: string): Promise<DataRecord> {
    return affected((await this.database.remove(DICT_TYPE_RESOURCE, ids(idsText))).affectedRows);
  }

  @Delete('data/:ids')
  async removeData(@Param('ids') idsText: string): Promise<DataRecord> {
    return affected((await this.database.remove(DICT_DATA_RESOURCE, ids(idsText))).affectedRows);
  }
}
