import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import {
  DatabaseService,
  affected,
  success,
  table,
  type CrudResource,
  type DataRecord,
  type PageQuery,
  type Primitive,
} from '@app/common';
import {
  CONFIG_RESOURCE,
  DICT_DATA_RESOURCE,
  DICT_TYPE_RESOURCE,
  LOGIN_INFO_RESOURCE,
  NOTICE_RESOURCE,
  OPER_LOG_RESOURCE,
  POST_RESOURCE,
  SUPPLIER_RESOURCE,
} from './resources';

const RESOURCE_MAP: Record<string, CrudResource> = {
  post: POST_RESOURCE,
  config: CONFIG_RESOURCE,
  'dict/type': DICT_TYPE_RESOURCE,
  'dict/data': DICT_DATA_RESOURCE,
  notice: NOTICE_RESOURCE,
  operlog: OPER_LOG_RESOURCE,
  logininfor: LOGIN_INFO_RESOURCE,
  'purchase/supplier': SUPPLIER_RESOURCE,
};

@Controller()
export class ResourceController {
  constructor(private readonly database: DatabaseService) {}

  @Get(['post/list', 'config/list', 'dict/type/list', 'dict/data/list', 'notice/list', 'operlog/list', 'logininfor/list', 'purchase/supplier/list'])
  async list(@Req() request: Request, @Query() query: PageQuery): Promise<DataRecord> {
    const result = await this.database.list(this.resource(request), query);
    return table(result.rows, result.total);
  }

  @Post(['post/export', 'config/export', 'dict/type/export', 'dict/data/export', 'operlog/export', 'logininfor/export'])
  async export(@Req() request: Request, @Body() query: PageQuery, @Res() response: Response): Promise<void> {
    const resource = this.resource(request);
    const result = await this.database.list(resource, { ...query, pageNum: 1, pageSize: 500 });
    const columns = resource.columns.filter((column) => !['password'].includes(column));
    const escape = (value: unknown): string => `"${String(value ?? '').replaceAll('"', '""')}"`;
    const csv = [`\uFEFF${columns.join(',')}`, ...result.rows.map((row) => columns.map((column) => escape(row[column])).join(','))].join('\r\n');
    response.setHeader('Content-Type', 'text/csv; charset=utf-8');
    response.setHeader('Content-Disposition', `attachment; filename=${resource.table}.csv`);
    response.send(csv);
  }

  @Get('config/configKey/:configKey')
  async configByKey(@Param('configKey') configKey: string): Promise<DataRecord> {
    const rows = await this.database.query<{ configValue: string }>('SELECT config_value FROM sys_config WHERE config_key=? LIMIT 1', [configKey]);
    return success(rows[0]?.configValue ?? '');
  }

  @Get('dict/data/type/:dictType')
  async dictByType(@Param('dictType') dictType: string): Promise<DataRecord> {
    const rows = await this.database.query(
      "SELECT * FROM sys_dict_data WHERE dict_type=? AND status='0' ORDER BY dict_sort",
      [dictType],
    );
    return success(rows);
  }

  @Get(['post/optionselect', 'dict/type/optionselect'])
  async options(@Req() request: Request): Promise<DataRecord> {
    const resource = this.resource(request);
    const where = resource === POST_RESOURCE ? " WHERE status='0'" : '';
    return success(await this.database.query(`SELECT * FROM \`${resource.table}\`${where} ORDER BY \`${resource.defaultOrder ?? resource.id}\``));
  }

  @Delete(['config/refreshCache', 'dict/type/refreshCache'])
  refreshCache(): DataRecord {
    return success();
  }

  @Delete(['operlog/clean', 'logininfor/clean'])
  async clean(@Req() request: Request): Promise<DataRecord> {
    const result = await this.database.execute(`TRUNCATE TABLE \`${this.resource(request).table}\``);
    return affected(result.affectedRows || 1);
  }

  @Get(['notice/listTop'])
  async topNotices(@Req() request: Request): Promise<DataRecord> {
    const userId = this.userId(request);
    const rows = await this.database.query(
      `SELECT n.*, CASE WHEN nr.user_id IS NULL THEN 0 ELSE 1 END AS read_flag
       FROM sys_notice n LEFT JOIN sys_notice_read nr ON nr.notice_id=n.notice_id AND nr.user_id=?
       WHERE n.status='0' ORDER BY n.create_time DESC LIMIT 10`,
      [userId],
    );
    return success(rows);
  }

  @Post('notice/markRead')
  async markNoticeRead(@Req() request: Request, @Query('noticeId') noticeId: string): Promise<DataRecord> {
    await this.database.execute(
      'INSERT INTO sys_notice_read(notice_id,user_id,read_time) VALUES(?,?,NOW()) ON DUPLICATE KEY UPDATE read_time=NOW()',
      [Number(noticeId), this.userId(request)],
    );
    return success();
  }

  @Post('notice/markReadAll')
  async markAllNoticesRead(@Req() request: Request, @Query('ids') idsText: string): Promise<DataRecord> {
    const ids = this.ids(idsText);
    for (const id of ids) {
      await this.database.execute(
        'INSERT INTO sys_notice_read(notice_id,user_id,read_time) VALUES(?,?,NOW()) ON DUPLICATE KEY UPDATE read_time=NOW()',
        [id, this.userId(request)],
      );
    }
    return success();
  }

  @Get('notice/readUsers/list')
  async noticeReaders(@Query() query: PageQuery): Promise<DataRecord> {
    const noticeId = Number(query.noticeId ?? 0);
    const search = String(query.searchValue ?? '').trim();
    const rows = await this.database.query(
      `SELECT u.user_id,u.user_name,u.nick_name,d.dept_name,nr.read_time
       FROM sys_notice_read nr JOIN sys_user u ON u.user_id=nr.user_id
       LEFT JOIN sys_dept d ON d.dept_id=u.dept_id
       WHERE nr.notice_id=? AND (?='' OR u.user_name LIKE ? OR u.nick_name LIKE ?)
       ORDER BY nr.read_time DESC`,
      [noticeId, search, `%${search}%`, `%${search}%`],
    );
    return table(rows, rows.length);
  }

  @Get(['post/:id', 'config/:id', 'dict/type/:id', 'dict/data/:id', 'notice/:id', 'purchase/supplier/:id'])
  async get(@Req() request: Request, @Param('id') id: string): Promise<DataRecord> {
    return success(await this.database.get(this.resource(request), id));
  }

  @Post(['post', 'config', 'dict/type', 'dict/data', 'notice', 'operlog', 'logininfor', 'purchase/supplier'])
  async create(@Req() request: Request, @Body() body: DataRecord): Promise<DataRecord> {
    const resource = this.resource(request);
    if (resource === SUPPLIER_RESOURCE && !body.id) body.id = randomUUID();
    if (resource === NOTICE_RESOURCE && body.status === undefined) body.status = '0';
    const result = await this.database.insert(resource, body, this.username(request));
    return affected(result.affectedRows);
  }

  @Put(['post', 'config', 'dict/type', 'dict/data', 'notice', 'purchase/supplier'])
  async update(@Req() request: Request, @Body() body: DataRecord): Promise<DataRecord> {
    const result = await this.database.update(this.resource(request), body, this.username(request));
    return affected(result.affectedRows);
  }

  @Delete(['post/:ids', 'config/:ids', 'dict/type/:ids', 'dict/data/:ids', 'notice/:ids', 'operlog/:ids', 'logininfor/:ids', 'purchase/supplier/:ids'])
  async remove(@Req() request: Request, @Param('ids') idsText: string): Promise<DataRecord> {
    const result = await this.database.remove(this.resource(request), this.ids(idsText));
    return affected(result.affectedRows);
  }

  @Get('logininfor/unlock/:userName')
  unlock(@Param('userName') _userName: string): DataRecord {
    return success();
  }

  private resource(request: Request): CrudResource {
    const path = request.path.replace(/^\//, '');
    const key = Object.keys(RESOURCE_MAP).sort((left, right) => right.length - left.length).find((candidate) => path === candidate || path.startsWith(`${candidate}/`));
    if (!key) throw new Error(`未配置资源: ${path}`);
    return RESOURCE_MAP[key];
  }

  private ids(value: string): Primitive[] {
    return String(value ?? '').split(',').map((id) => id.trim()).filter(Boolean);
  }

  private username(request: Request): string {
    return decodeURIComponent(String(request.headers.username ?? 'system'));
  }

  private userId(request: Request): number {
    return Number(request.headers.user_id ?? 0);
  }
}
