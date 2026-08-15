import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { DatabaseService, affected, success, table, type DataRecord, type PageQuery } from '@app/common';
import { NOTICE_RESOURCE } from '../../domain/resources';
import { currentUserId, currentUsername, ids } from '../../shared/http.helpers';

@Controller('notice')
export class NoticesController {
  constructor(private readonly database: DatabaseService) {}

  @Get('list')
  async list(@Query() query: PageQuery): Promise<DataRecord> {
    const result = await this.database.list(NOTICE_RESOURCE, query);
    return table(result.rows, result.total);
  }

  @Get('listTop')
  async topNotices(@Req() request: Request): Promise<DataRecord> {
    const rows = await this.database.query(
      `SELECT n.*, CASE WHEN nr.user_id IS NULL THEN 0 ELSE 1 END AS read_flag
       FROM sys_notice n LEFT JOIN sys_notice_read nr ON nr.notice_id=n.notice_id AND nr.user_id=?
       WHERE n.status='0' ORDER BY n.create_time DESC LIMIT 10`,
      [currentUserId(request)],
    );
    return success(rows);
  }

  @Post('markRead')
  async markNoticeRead(@Req() request: Request, @Query('noticeId') noticeId: string): Promise<DataRecord> {
    await this.database.execute('INSERT INTO sys_notice_read(notice_id,user_id,read_time) VALUES(?,?,NOW()) ON DUPLICATE KEY UPDATE read_time=NOW()', [Number(noticeId), currentUserId(request)]);
    return success();
  }

  @Post('markReadAll')
  async markAllNoticesRead(@Req() request: Request, @Query('ids') idsText: string): Promise<DataRecord> {
    for (const id of ids(idsText)) {
      await this.database.execute('INSERT INTO sys_notice_read(notice_id,user_id,read_time) VALUES(?,?,NOW()) ON DUPLICATE KEY UPDATE read_time=NOW()', [id, currentUserId(request)]);
    }
    return success();
  }

  @Get('readUsers/list')
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

  @Get(':id')
  async get(@Param('id') id: string): Promise<DataRecord> {
    return success(await this.database.get(NOTICE_RESOURCE, id));
  }

  @Post()
  async create(@Req() request: Request, @Body() body: DataRecord): Promise<DataRecord> {
    if (body.status === undefined) body.status = '0';
    return affected((await this.database.insert(NOTICE_RESOURCE, body, currentUsername(request))).affectedRows);
  }

  @Put()
  async update(@Req() request: Request, @Body() body: DataRecord): Promise<DataRecord> {
    return affected((await this.database.update(NOTICE_RESOURCE, body, currentUsername(request))).affectedRows);
  }

  @Delete(':ids')
  async remove(@Param('ids') idsText: string): Promise<DataRecord> {
    return affected((await this.database.remove(NOTICE_RESOURCE, ids(idsText))).affectedRows);
  }
}
