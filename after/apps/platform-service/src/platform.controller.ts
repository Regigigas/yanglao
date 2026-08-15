import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import {
  DatabaseService, RedisService, affected, success, table,
  type CrudResource, type DataRecord, type PageQuery, type Primitive,
} from '@app/common';
import {
  CONFIG_RESOURCE, DICT_DATA_RESOURCE, DICT_TYPE_RESOURCE,
  LOGIN_INFO_RESOURCE, NOTICE_RESOURCE, OPER_LOG_RESOURCE,
} from './resources';

const RESOURCE_MAP: Record<string, CrudResource> = {
  config: CONFIG_RESOURCE,
  'dict/type': DICT_TYPE_RESOURCE,
  'dict/data': DICT_DATA_RESOURCE,
  notice: NOTICE_RESOURCE,
  operlog: OPER_LOG_RESOURCE,
  logininfor: LOGIN_INFO_RESOURCE,
};

@Controller()
export class PlatformController {
  constructor(
    private readonly database: DatabaseService,
    private readonly redis: RedisService,
  ) {}

  @Get('health')
  async health(): Promise<DataRecord> {
    return { status: (await this.database.ping()) ? 'ok' : 'degraded', service: 'platform-service', timestamp: new Date().toISOString() };
  }

  @Get(['config/list', 'dict/type/list', 'dict/data/list', 'notice/list', 'operlog/list', 'logininfor/list'])
  async list(@Req() request: Request, @Query() query: PageQuery): Promise<DataRecord> {
    const result = await this.database.list(this.resource(request), query);
    return table(result.rows, result.total);
  }

  @Post(['config/export', 'dict/type/export', 'dict/data/export', 'operlog/export', 'logininfor/export'])
  async export(@Req() request: Request, @Body() query: PageQuery, @Res() response: Response): Promise<void> {
    const resource = this.resource(request);
    const result = await this.database.list(resource, { ...query, pageNum: 1, pageSize: 500 });
    const columns = resource.columns;
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
    return success(await this.database.query("SELECT * FROM sys_dict_data WHERE dict_type=? AND status='0' ORDER BY dict_sort", [dictType]));
  }

  @Get('dict/type/optionselect')
  async options(): Promise<DataRecord> {
    return success(await this.database.query('SELECT * FROM sys_dict_type ORDER BY dict_id'));
  }

  @Delete(['config/refreshCache', 'dict/type/refreshCache'])
  refreshCache(): DataRecord {
    return success();
  }

  @Delete(['operlog/clean', 'logininfor/clean'])
  async clean(@Req() request: Request): Promise<DataRecord> {
    await this.database.execute(`TRUNCATE TABLE \`${this.resource(request).table}\``);
    return affected(1);
  }

  @Get('notice/listTop')
  async topNotices(@Req() request: Request): Promise<DataRecord> {
    const rows = await this.database.query(
      `SELECT n.*, CASE WHEN nr.user_id IS NULL THEN 0 ELSE 1 END AS read_flag
       FROM sys_notice n LEFT JOIN sys_notice_read nr ON nr.notice_id=n.notice_id AND nr.user_id=?
       WHERE n.status='0' ORDER BY n.create_time DESC LIMIT 10`,
      [this.userId(request)],
    );
    return success(rows);
  }

  @Post('notice/markRead')
  async markNoticeRead(@Req() request: Request, @Query('noticeId') noticeId: string): Promise<DataRecord> {
    await this.database.execute('INSERT INTO sys_notice_read(notice_id,user_id,read_time) VALUES(?,?,NOW()) ON DUPLICATE KEY UPDATE read_time=NOW()', [Number(noticeId), this.userId(request)]);
    return success();
  }

  @Post('notice/markReadAll')
  async markAllNoticesRead(@Req() request: Request, @Query('ids') idsText: string): Promise<DataRecord> {
    for (const id of this.ids(idsText)) {
      await this.database.execute('INSERT INTO sys_notice_read(notice_id,user_id,read_time) VALUES(?,?,NOW()) ON DUPLICATE KEY UPDATE read_time=NOW()', [id, this.userId(request)]);
    }
    return success();
  }

  @Get('notice/readUsers/list')
  async noticeReaders(@Query() query: PageQuery): Promise<DataRecord> {
    const search = String(query.searchValue ?? '').trim();
    const rows = await this.database.query(
      `SELECT u.user_id,u.user_name,u.nick_name,d.dept_name,nr.read_time
       FROM sys_notice_read nr JOIN sys_user u ON u.user_id=nr.user_id
       LEFT JOIN sys_dept d ON d.dept_id=u.dept_id
       WHERE nr.notice_id=? AND (?='' OR u.user_name LIKE ? OR u.nick_name LIKE ?)
       ORDER BY nr.read_time DESC`,
      [Number(query.noticeId ?? 0), search, `%${search}%`, `%${search}%`],
    );
    return table(rows, rows.length);
  }

  @Get(['config/:id', 'dict/type/:id', 'dict/data/:id', 'notice/:id'])
  async get(@Req() request: Request, @Param('id') id: string): Promise<DataRecord> {
    return success(await this.database.get(this.resource(request), id));
  }

  @Post(['config', 'dict/type', 'dict/data', 'notice', 'operlog', 'logininfor'])
  async create(@Req() request: Request, @Body() body: DataRecord): Promise<DataRecord> {
    const resource = this.resource(request);
    if (resource === NOTICE_RESOURCE && body.status === undefined) body.status = '0';
    return affected((await this.database.insert(resource, body, this.username(request))).affectedRows);
  }

  @Put(['config', 'dict/type', 'dict/data', 'notice'])
  async update(@Req() request: Request, @Body() body: DataRecord): Promise<DataRecord> {
    return affected((await this.database.update(this.resource(request), body, this.username(request))).affectedRows);
  }

  @Delete(['config/:ids', 'dict/type/:ids', 'dict/data/:ids', 'notice/:ids', 'operlog/:ids', 'logininfor/:ids'])
  async remove(@Req() request: Request, @Param('ids') idsText: string): Promise<DataRecord> {
    return affected((await this.database.remove(this.resource(request), this.ids(idsText))).affectedRows);
  }

  @Get('logininfor/unlock/:userName')
  unlock(@Param('userName') _userName: string): DataRecord {
    return success();
  }

  @Get('online/list')
  async online(@Query() query: PageQuery): Promise<DataRecord> {
    const keyword = String(query.userName ?? '');
    const rows: DataRecord[] = [];
    for (const key of await this.redis.keys('login_tokens:*')) {
      const session = await this.redis.getJson<DataRecord>(key);
      if (!session || (keyword && !String(session.username ?? '').includes(keyword))) continue;
      rows.push({ tokenId: key.slice('login_tokens:'.length), userName: session.username, ipaddr: session.ipaddr, loginTime: session.loginTime });
    }
    return table(rows, rows.length);
  }

  @Delete('online/:tokenId')
  async forceLogout(@Param('tokenId') tokenId: string): Promise<DataRecord> {
    await this.redis.delete(`login_tokens:${tokenId}`);
    return success();
  }

  @Get('app-update/latest')
  appUpdate(@Query() query: PageQuery): DataRecord {
    const platform = String(query.platform ?? '').toLowerCase();
    const prefix = platform === 'ios' ? 'APP_UPDATE_IOS_' : platform === 'android' ? 'APP_UPDATE_ANDROID_' : 'APP_UPDATE_';
    const env = (name: string): string => String(process.env[`${prefix}${name}`] ?? process.env[`APP_UPDATE_${name}`] ?? '').trim();
    const type = ['wgt', 'store'].includes(env('TYPE')) ? env('TYPE') : 'apk';
    const versionName = env('VERSION_NAME');
    const versionCode = Math.max(0, Number(env('VERSION_CODE')) || 0);
    const downloadUrl = env('PACKAGE_URL') || (type === 'store' ? env('STORE_URL') : '');
    const sha256 = env('SHA256').toLowerCase();
    const configured = Boolean(versionName && downloadUrl && (type === 'store' || /^[a-f0-9]{64}$/.test(sha256)) && (type === 'wgt' || versionCode > 0));
    const available = type === 'wgt' ? this.compareVersions(versionName, String(query.wgtVersion ?? '0')) > 0 : versionCode > Math.max(0, Number(query.versionCode ?? 0));
    if (!configured || !available) return success({ available: false, message: configured ? '当前已是最新版本' : '当前暂无可用更新' });
    return success({ available: true, type, versionName, versionCode, title: env('TITLE') || `养老护理终端 ${versionName}`, description: env('DESCRIPTION').replaceAll('\\n', '\n'), downloadUrl, storeUrl: env('STORE_URL'), size: Number(env('SIZE')) || 0, sha256, mandatory: ['1', 'true', 'yes', 'on'].includes(env('MANDATORY').toLowerCase()), publishedAt: env('PUBLISHED_AT') });
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

  private compareVersions(left: string, right: string): number {
    const a = left.split(/[.-]/); const b = right.split(/[.-]/); const length = Math.max(a.length, b.length);
    for (let index = 0; index < length; index += 1) {
      const x = a[index] ?? '0'; const y = b[index] ?? '0'; const numeric = /^\d+$/.test(x) && /^\d+$/.test(y);
      const result = numeric ? Number(x) - Number(y) : x.localeCompare(y, undefined, { sensitivity: 'base' });
      if (result) return result;
    }
    return 0;
  }
}
