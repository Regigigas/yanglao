import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { mkdir, writeFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import type { Request, Response } from 'express';
import * as ExcelJS from 'exceljs';
import { DatabaseService, affected, success, successWith, table, type DataRecord, type PageQuery } from '@app/common';
import { IdentityService } from './identity.service';
import { DEPT_RESOURCE, MENU_RESOURCE, ROLE_RESOURCE } from './resources';

@Controller()
export class IdentityController {
  constructor(
    private readonly database: DatabaseService,
    private readonly system: IdentityService,
  ) {}

  @Get('health')
  async health(): Promise<DataRecord> {
    return { status: (await this.database.ping()) ? 'ok' : 'degraded', service: 'identity-service', timestamp: new Date().toISOString() };
  }

  @Get('user/list')
  async users(@Query() query: PageQuery, @Req() request: Request): Promise<DataRecord> {
    const result = await this.system.listUsers(query, this.userId(request));
    return table(result.rows, result.total);
  }

  @Post('user/export')
  async exportUsers(@Body() query: PageQuery, @Res() response: Response, @Req() request: Request): Promise<void> {
    const result = await this.system.listUsers({ ...query, pageNum: 1, pageSize: 500 }, this.userId(request));
    await this.sendWorkbook(response, '用户数据', ['userId', 'userName', 'nickName', 'deptId', 'email', 'phonenumber', 'sex', 'status'], result.rows);
  }

  @Post('user/importTemplate')
  async userTemplate(@Res() response: Response): Promise<void> {
    await this.sendWorkbook(response, '用户导入模板', ['userName', 'nickName', 'deptId', 'email', 'phonenumber', 'sex', 'status', 'password'], []);
  }

  @Post('user/importData')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }))
  async importUsers(@UploadedFile() file: Express.Multer.File, @Query('updateSupport') updateSupport: string, @Req() request: Request): Promise<DataRecord> {
    if (!file) return { code: 500, msg: '请选择导入文件' };
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file.buffer as unknown as ExcelJS.Buffer);
    const sheet = workbook.worksheets[0];
    if (!sheet) return { code: 500, msg: '工作簿没有可用工作表' };
    const headers = (sheet.getRow(1).values as unknown[]).slice(1).map(String);
    let successCount = 0;
    const errors: string[] = [];
    for (let index = 2; index <= sheet.rowCount; index += 1) {
      const values = (sheet.getRow(index).values as unknown[]).slice(1);
      const input = Object.fromEntries(headers.map((header, column) => [header, values[column] ?? ''])) as DataRecord;
      if (!String(input.userName ?? '').trim()) continue;
      try {
        const existing = await this.database.query<{ userId: number }>('SELECT user_id FROM sys_user WHERE user_name=? LIMIT 1', [String(input.userName)]);
        if (existing.length && String(updateSupport).toLowerCase() === 'true') {
          input.userId = existing[0].userId; await this.system.updateUser(input, this.username(request));
        } else if (!existing.length) {
          await this.system.createUser(input, this.username(request));
        } else throw new Error('账号已存在');
        successCount += 1;
      } catch (error) { errors.push(`第${index}行: ${error instanceof Error ? error.message : String(error)}`); }
    }
    return success(`成功导入 ${successCount} 条${errors.length ? `；失败 ${errors.length} 条：${errors.slice(0, 10).join('；')}` : ''}`);
  }

  @Post('user/register')
  async registerUser(@Body() body: DataRecord): Promise<DataRecord> {
    return success((await this.system.createUser(body, String(body.userName ?? 'register'))) > 0);
  }

  @Put('user/recordlogin')
  async recordLogin(@Body() body: DataRecord): Promise<DataRecord> {
    const result = await this.database.execute('UPDATE sys_user SET login_ip=?,login_date=NOW() WHERE user_id=?', [String(body.loginIp ?? ''), Number(body.userId)]);
    return success(result.affectedRows > 0);
  }

  @Get('user/getInfo')
  async currentUser(@Req() request: Request): Promise<DataRecord> {
    return successWith(await this.system.currentUser(this.userId(request)));
  }

  @Get('user/info/:username')
  async userByName(@Param('username') username: string): Promise<DataRecord> {
    const rows = await this.database.query("SELECT * FROM sys_user WHERE user_name=? AND del_flag='0' LIMIT 1", [username]);
    if (!rows[0]) return { code: 500, msg: '用户名或密码错误' };
    const detail = await this.system.currentUser(Number(rows[0].userId));
    return success({ sysUser: rows[0], roles: detail.roles, permissions: detail.permissions });
  }

  @Get('user')
  async userDetail(@Param('userId') id?: string): Promise<DataRecord> {
    return successWith(await this.system.userDetail(id ? Number(id) : undefined));
  }

  @Post('user')
  async addUser(@Body() body: DataRecord, @Req() request: Request): Promise<DataRecord> {
    return affected(await this.system.createUser(body, this.username(request)));
  }

  @Put('user')
  async editUser(@Body() body: DataRecord, @Req() request: Request): Promise<DataRecord> {
    return affected(await this.system.updateUser(body, this.username(request)));
  }

  @Delete('user/:ids')
  async removeUsers(@Param('ids') ids: string): Promise<DataRecord> {
    return affected(await this.system.removeUsers(this.numberIds(ids)));
  }

  @Put('user/resetPwd')
  async resetPassword(@Body() body: DataRecord, @Req() request: Request): Promise<DataRecord> {
    return affected(await this.system.resetPassword(Number(body.userId), String(body.password ?? ''), this.username(request)));
  }

  @Put('user/changeStatus')
  async changeUserStatus(@Body() body: DataRecord): Promise<DataRecord> {
    if (Number(body.userId) === 1 && body.status !== '0') return { code: 500, msg: '不允许停用超级管理员' };
    const result = await this.database.execute('UPDATE sys_user SET status=?,update_time=NOW() WHERE user_id=?', [String(body.status), Number(body.userId)]);
    return affected(result.affectedRows);
  }

  @Get('user/authRole/:userId')
  async userRoles(@Param('userId') id: string): Promise<DataRecord> {
    const user = await this.database.get({ table: 'sys_user', id: 'user_id', columns: [] }, Number(id));
    if (user) delete user.password;
    const roles = await this.database.query("SELECT r.* FROM sys_role r LEFT JOIN sys_user_role ur ON ur.role_id=r.role_id AND ur.user_id=? WHERE r.del_flag='0' ORDER BY r.role_sort", [Number(id)]);
    return successWith({ user, roles });
  }

  @Put('user/authRole')
  async setUserRoles(@Query('userId') userId: string, @Query('roleIds') roleIds: string): Promise<DataRecord> {
    await this.system.setUserRoles(Number(userId), this.numberIds(roleIds));
    return success();
  }

  @Get('user/deptTree')
  async userDeptTree(@Query() query: PageQuery, @Req() request: Request): Promise<DataRecord> {
    return success(this.system.buildTreeSelect(await this.system.listDepartments(query, this.userId(request))));
  }

  @Get('user/profile')
  async profile(@Req() request: Request): Promise<DataRecord> {
    const current = await this.system.currentUser(this.userId(request));
    const user = current.user as DataRecord;
    const roles = await this.database.query<{ roleName: string }>('SELECT r.role_name FROM sys_role r JOIN sys_user_role ur ON ur.role_id=r.role_id WHERE ur.user_id=?', [this.userId(request)]);
    const posts = await this.database.query<{ postName: string }>('SELECT p.post_name FROM sys_post p JOIN sys_user_post up ON up.post_id=p.post_id WHERE up.user_id=?', [this.userId(request)]);
    return successWith({ data: user, roleGroup: roles.map((row) => row.roleName).join(','), postGroup: posts.map((row) => row.postName).join(',') });
  }

  @Put('user/profile')
  async updateProfile(@Req() request: Request, @Body() body: DataRecord): Promise<DataRecord> {
    return affected(await this.system.updateProfile(this.userId(request), body));
  }

  @Put('user/profile/updatePwd')
  async updatePassword(@Req() request: Request, @Body() body: DataRecord): Promise<DataRecord> {
    return affected(await this.system.updateOwnPassword(this.userId(request), String(body.oldPassword ?? ''), String(body.newPassword ?? '')));
  }

  @Post('user/profile/avatar')
  @UseInterceptors(FileInterceptor('avatarfile', { limits: { fileSize: 5 * 1024 * 1024 } }))
  async avatar(@Req() request: Request, @UploadedFile() file: Express.Multer.File): Promise<DataRecord> {
    if (!file) return { code: 500, msg: '请选择头像文件' };
    const uploadRoot = resolve(process.env.UPLOAD_DIR ?? './uploads');
    const name = `${randomUUID()}${extname(file.originalname).toLowerCase()}`;
    await mkdir(join(uploadRoot, 'avatar'), { recursive: true });
    await writeFile(join(uploadRoot, 'avatar', name), file.buffer);
    const url = `${process.env.FILE_PUBLIC_URL ?? 'http://127.0.0.1:8080/file/statics'}/avatar/${name}`;
    await this.system.setAvatar(this.userId(request), url);
    return successWith({ imgUrl: url });
  }

  @Get('user/:userId')
  async userDetailById(@Param('userId') id: string): Promise<DataRecord> {
    return successWith(await this.system.userDetail(Number(id)));
  }

  @Get('role/list')
  async roles(@Query() query: PageQuery, @Req() request: Request): Promise<DataRecord> { const result = await this.system.listRoles(query, this.userId(request)); return table(result.rows, result.total); }

  @Post('role/export')
  async exportRoles(@Body() query: PageQuery, @Res() response: Response, @Req() request: Request): Promise<void> {
    const result = await this.system.listRoles({ ...query, pageNum: 1, pageSize: 500 }, this.userId(request));
    await this.sendWorkbook(response, '角色数据', ['roleId', 'roleName', 'roleKey', 'roleSort', 'dataScope', 'status'], result.rows);
  }

  @Get('role/optionselect')
  async roleOptions(@Req() request: Request): Promise<DataRecord> { return success((await this.system.listRoles({ pageSize: 500, status: '0' }, this.userId(request))).rows); }

  @Get('role/authUser/allocatedList')
  async allocated(@Query() query: PageQuery): Promise<DataRecord> { const result = await this.system.roleUsers(Number(query.roleId), true, query); return table(result.rows, result.total); }

  @Get('role/authUser/unallocatedList')
  async unallocated(@Query() query: PageQuery): Promise<DataRecord> { const result = await this.system.roleUsers(Number(query.roleId), false, query); return table(result.rows, result.total); }

  @Put('role/authUser/cancel')
  async cancelRoleUser(@Body() body: DataRecord): Promise<DataRecord> {
    const result = await this.database.execute('DELETE FROM sys_user_role WHERE user_id=? AND role_id=?', [Number(body.userId), Number(body.roleId)]); return affected(result.affectedRows);
  }

  @Put('role/authUser/cancelAll')
  async cancelRoleUsers(@Query('roleId') roleId: string, @Query('userIds') userIds: string): Promise<DataRecord> {
    const ids = this.numberIds(userIds); if (!ids.length) return success();
    const result = await this.database.execute(`DELETE FROM sys_user_role WHERE role_id=? AND user_id IN (${ids.map(() => '?').join(',')})`, [Number(roleId), ...ids]); return affected(result.affectedRows);
  }

  @Put('role/authUser/selectAll')
  async selectRoleUsers(@Query('roleId') roleId: string, @Query('userIds') userIds: string): Promise<DataRecord> {
    for (const id of this.numberIds(userIds)) await this.database.execute('INSERT IGNORE INTO sys_user_role(user_id,role_id) VALUES(?,?)', [id, Number(roleId)]); return success();
  }

  @Get('role/deptTree/:roleId')
  async roleDeptTree(@Param('roleId') id: string, @Req() request: Request): Promise<DataRecord> {
    const depts = await this.system.listDepartments({}, this.userId(request));
    const checked = await this.database.query<{ deptId: number }>('SELECT dept_id FROM sys_role_dept WHERE role_id=?', [Number(id)]);
    return successWith({ checkedKeys: checked.map((row) => row.deptId), depts: this.system.buildTreeSelect(depts) });
  }

  @Get('role/:roleId')
  async role(@Param('roleId') id: string): Promise<DataRecord> { return success(await this.system.roleDetail(Number(id))); }

  @Post('role')
  async addRole(@Body() body: DataRecord, @Req() request: Request): Promise<DataRecord> { return affected(await this.system.saveRole(body, this.username(request), true)); }

  @Put(['role', 'role/dataScope'])
  async editRole(@Body() body: DataRecord, @Req() request: Request): Promise<DataRecord> { return affected(await this.system.saveRole(body, this.username(request), false)); }

  @Put('role/changeStatus')
  async roleStatus(@Body() body: DataRecord): Promise<DataRecord> { return affected((await this.database.execute('UPDATE sys_role SET status=? WHERE role_id=?', [String(body.status), Number(body.roleId)])).affectedRows); }

  @Delete('role/:ids')
  async deleteRoles(@Param('ids') ids: string): Promise<DataRecord> { return affected((await this.database.remove(ROLE_RESOURCE, this.numberIds(ids))).affectedRows); }

  @Get('dept/list')
  async departments(@Query() query: PageQuery, @Req() request: Request): Promise<DataRecord> { return success(await this.system.listDepartments(query, this.userId(request))); }

  @Get('dept/list/exclude/:deptId')
  async departmentsExclude(@Param('deptId') id: string, @Req() request: Request): Promise<DataRecord> {
    const all = await this.system.listDepartments({}, this.userId(request)); const current = Number(id);
    return success(all.filter((dept) => Number(dept.deptId) !== current && !String(dept.ancestors ?? '').split(',').includes(id)));
  }

  @Get('dept/:deptId')
  async department(@Param('deptId') id: string): Promise<DataRecord> { return success(await this.database.get(DEPT_RESOURCE, Number(id))); }

  @Post('dept')
  async addDepartment(@Body() body: DataRecord, @Req() request: Request): Promise<DataRecord> { return affected(await this.system.saveDepartment(body, this.username(request), true)); }

  @Put('dept')
  async editDepartment(@Body() body: DataRecord, @Req() request: Request): Promise<DataRecord> { return affected(await this.system.saveDepartment(body, this.username(request), false)); }

  @Put('dept/updateSort')
  async deptSort(@Body() body: DataRecord): Promise<DataRecord> { await this.system.updateSort('sys_dept', 'dept_id', String(body.deptIds ?? ''), String(body.orderNums ?? '')); return success(); }

  @Delete('dept/:deptId')
  async deleteDepartment(@Param('deptId') id: string): Promise<DataRecord> {
    const children = await this.database.query("SELECT dept_id FROM sys_dept WHERE parent_id=? AND del_flag='0' LIMIT 1", [Number(id)]);
    if (children.length) return { code: 601, msg: '存在下级部门，不允许删除' };
    return affected((await this.database.remove(DEPT_RESOURCE, [Number(id)])).affectedRows);
  }

  @Get('menu/list')
  async menus(@Req() request: Request, @Query() query: PageQuery): Promise<DataRecord> { return success(await this.system.listMenus(query, this.userId(request))); }

  @Get('menu/getRouters')
  async routers(@Req() request: Request): Promise<DataRecord> { return success(await this.system.menuTree(this.userId(request))); }

  @Get('menu/treeselect')
  async menuTree(@Req() request: Request, @Query() query: PageQuery): Promise<DataRecord> {
    return success(this.system.buildTreeSelect(await this.system.listMenus(query, this.userId(request)), 'menuId', 'parentId', 'menuName'));
  }

  @Get('menu/roleMenuTreeselect/:roleId')
  async roleMenuTree(@Req() request: Request, @Param('roleId') id: string): Promise<DataRecord> {
    const menus = await this.system.listMenus({}, this.userId(request));
    const checked = await this.database.query<{ menuId: number }>('SELECT menu_id FROM sys_role_menu WHERE role_id=?', [Number(id)]);
    return successWith({ checkedKeys: checked.map((row) => row.menuId), menus: this.system.buildTreeSelect(menus, 'menuId', 'parentId', 'menuName') });
  }

  @Get('menu/:menuId')
  async menu(@Param('menuId') id: string): Promise<DataRecord> { return success(await this.database.get(MENU_RESOURCE, Number(id))); }

  @Post('menu')
  async addMenu(@Body() body: DataRecord, @Req() request: Request): Promise<DataRecord> { return affected(await this.system.saveMenu(body, this.username(request), true)); }

  @Put('menu')
  async editMenu(@Body() body: DataRecord, @Req() request: Request): Promise<DataRecord> { return affected(await this.system.saveMenu(body, this.username(request), false)); }

  @Put('menu/updateSort')
  async menuSort(@Body() body: DataRecord): Promise<DataRecord> { await this.system.updateSort('sys_menu', 'menu_id', String(body.menuIds ?? ''), String(body.orderNums ?? '')); return success(); }

  @Delete('menu/:menuId')
  async deleteMenu(@Param('menuId') id: string): Promise<DataRecord> {
    const children = await this.database.query('SELECT menu_id FROM sys_menu WHERE parent_id=? LIMIT 1', [Number(id)]);
    if (children.length) return { code: 601, msg: '存在子菜单，不允许删除' };
    return affected((await this.database.remove(MENU_RESOURCE, [Number(id)])).affectedRows);
  }

  private numberIds(value: string): number[] { return String(value ?? '').split(',').map(Number).filter((id) => Number.isFinite(id) && id > 0); }
  private userId(request: Request): number { return Number(request.headers.user_id ?? 0); }
  private username(request: Request): string { return decodeURIComponent(String(request.headers.username ?? 'system')); }

  private async sendWorkbook(response: Response, sheetName: string, columns: string[], rows: DataRecord[]): Promise<void> {
    const workbook = new ExcelJS.Workbook(); const sheet = workbook.addWorksheet(sheetName);
    sheet.columns = columns.map((column) => ({ header: column, key: column, width: Math.max(14, column.length + 4) }));
    for (const row of rows) sheet.addRow(Object.fromEntries(columns.map((column) => [column, row[column] ?? ''])));
    const content = await workbook.xlsx.writeBuffer();
    response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    response.setHeader('Content-Disposition', `attachment; filename=${encodeURIComponent(sheetName)}.xlsx`);
    response.send(Buffer.from(content));
  }
}
