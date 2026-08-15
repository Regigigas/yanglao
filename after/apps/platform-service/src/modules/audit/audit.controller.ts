import { Body, Controller, Delete, Get, Param, Post, Query, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { DatabaseService, affected, success, table, type CrudResource, type DataRecord, type PageQuery } from '@app/common';
import { LOGIN_INFO_RESOURCE, OPER_LOG_RESOURCE } from '../../domain/resources';
import { currentUsername, ids, sendCsv } from '../../shared/http.helpers';

const RESOURCE_MAP: Record<string, CrudResource> = {
  operlog: OPER_LOG_RESOURCE,
  logininfor: LOGIN_INFO_RESOURCE,
};

@Controller()
export class AuditController {
  constructor(private readonly database: DatabaseService) {}

  @Get(['operlog/list', 'logininfor/list'])
  async list(@Req() request: Request, @Query() query: PageQuery): Promise<DataRecord> {
    const result = await this.database.list(this.resource(request), query);
    return table(result.rows, result.total);
  }

  @Post(['operlog/export', 'logininfor/export'])
  async export(@Req() request: Request, @Body() query: PageQuery, @Res() response: Response): Promise<void> {
    const resource = this.resource(request);
    const result = await this.database.list(resource, { ...query, pageNum: 1, pageSize: 500 });
    sendCsv(response, resource, result.rows);
  }

  @Delete(['operlog/clean', 'logininfor/clean'])
  async clean(@Req() request: Request): Promise<DataRecord> {
    await this.database.execute(`TRUNCATE TABLE \`${this.resource(request).table}\``);
    return affected(1);
  }

  @Post(['operlog', 'logininfor'])
  async create(@Req() request: Request, @Body() body: DataRecord): Promise<DataRecord> {
    return affected((await this.database.insert(this.resource(request), body, currentUsername(request))).affectedRows);
  }

  @Delete(['operlog/:ids', 'logininfor/:ids'])
  async remove(@Req() request: Request, @Param('ids') idsText: string): Promise<DataRecord> {
    return affected((await this.database.remove(this.resource(request), ids(idsText))).affectedRows);
  }

  @Get('logininfor/unlock/:userName')
  unlock(@Param('userName') _userName: string): DataRecord {
    return success();
  }

  private resource(request: Request): CrudResource {
    const key = request.path.replace(/^\//, '').split('/')[0];
    const resource = RESOURCE_MAP[key];
    if (!resource) throw new Error(`鏈厤缃祫婧? ${request.path}`);
    return resource;
  }
}
