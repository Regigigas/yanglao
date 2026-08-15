import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { DatabaseService, affected, success, successWith, table, type DataRecord, type PageQuery } from '@app/common';
import { IdentityService } from '../../domain/identity.service';
import { ROLE_RESOURCE } from '../../domain/resources';
import { currentUserId, currentUsername, numberIds, sendWorkbook } from '../../shared/http.helpers';

@Controller('role')
export class RolesController {
  constructor(
    private readonly database: DatabaseService,
    private readonly identity: IdentityService,
  ) {}

  @Get('list')
  async roles(@Query() query: PageQuery, @Req() request: Request): Promise<DataRecord> {
    const result = await this.identity.listRoles(query, currentUserId(request));
    return table(result.rows, result.total);
  }

  @Post('export')
  async exportRoles(@Body() query: PageQuery, @Res() response: Response, @Req() request: Request): Promise<void> {
    const result = await this.identity.listRoles({ ...query, pageNum: 1, pageSize: 500 }, currentUserId(request));
    await sendWorkbook(response, '瑙掕壊鏁版嵁', ['roleId', 'roleName', 'roleKey', 'roleSort', 'dataScope', 'status'], result.rows);
  }

  @Get('optionselect')
  async roleOptions(@Req() request: Request): Promise<DataRecord> {
    return success((await this.identity.listRoles({ pageSize: 500, status: '0' }, currentUserId(request))).rows);
  }

  @Get('authUser/allocatedList')
  async allocated(@Query() query: PageQuery): Promise<DataRecord> {
    const result = await this.identity.roleUsers(Number(query.roleId), true, query);
    return table(result.rows, result.total);
  }

  @Get('authUser/unallocatedList')
  async unallocated(@Query() query: PageQuery): Promise<DataRecord> {
    const result = await this.identity.roleUsers(Number(query.roleId), false, query);
    return table(result.rows, result.total);
  }

  @Put('authUser/cancel')
  async cancelRoleUser(@Body() body: DataRecord): Promise<DataRecord> {
    const result = await this.database.execute('DELETE FROM sys_user_role WHERE user_id=? AND role_id=?', [Number(body.userId), Number(body.roleId)]);
    return affected(result.affectedRows);
  }

  @Put('authUser/cancelAll')
  async cancelRoleUsers(@Query('roleId') roleId: string, @Query('userIds') userIds: string): Promise<DataRecord> {
    const ids = numberIds(userIds);
    if (!ids.length) return success();
    const result = await this.database.execute(`DELETE FROM sys_user_role WHERE role_id=? AND user_id IN (${ids.map(() => '?').join(',')})`, [Number(roleId), ...ids]);
    return affected(result.affectedRows);
  }

  @Put('authUser/selectAll')
  async selectRoleUsers(@Query('roleId') roleId: string, @Query('userIds') userIds: string): Promise<DataRecord> {
    for (const id of numberIds(userIds)) await this.database.execute('INSERT IGNORE INTO sys_user_role(user_id,role_id) VALUES(?,?)', [id, Number(roleId)]);
    return success();
  }

  @Get('deptTree/:roleId')
  async roleDeptTree(@Param('roleId') id: string, @Req() request: Request): Promise<DataRecord> {
    const depts = await this.identity.listDepartments({}, currentUserId(request));
    const checked = await this.database.query<{ deptId: number }>('SELECT dept_id FROM sys_role_dept WHERE role_id=?', [Number(id)]);
    return successWith({ checkedKeys: checked.map((row) => row.deptId), depts: this.identity.buildTreeSelect(depts) });
  }

  @Get(':roleId')
  async role(@Param('roleId') id: string): Promise<DataRecord> {
    return success(await this.identity.roleDetail(Number(id)));
  }

  @Post()
  async addRole(@Body() body: DataRecord, @Req() request: Request): Promise<DataRecord> {
    return affected(await this.identity.saveRole(body, currentUsername(request), true));
  }

  @Put(['', 'dataScope'])
  async editRole(@Body() body: DataRecord, @Req() request: Request): Promise<DataRecord> {
    return affected(await this.identity.saveRole(body, currentUsername(request), false));
  }

  @Put('changeStatus')
  async roleStatus(@Body() body: DataRecord): Promise<DataRecord> {
    return affected((await this.database.execute('UPDATE sys_role SET status=? WHERE role_id=?', [String(body.status), Number(body.roleId)])).affectedRows);
  }

  @Delete(':ids')
  async deleteRoles(@Param('ids') ids: string): Promise<DataRecord> {
    return affected((await this.database.remove(ROLE_RESOURCE, numberIds(ids))).affectedRows);
  }
}
