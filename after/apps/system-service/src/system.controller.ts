import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { mkdir, writeFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import type { Request, Response } from 'express';
import * as ExcelJS from 'exceljs';
import { DatabaseService, RedisService, affected, success, successWith, table, type DataRecord, type PageQuery } from '@app/common';
import { ChatService } from './chat.service';
import { PurchaseService } from './purchase.service';
import { SyncService } from './sync.service';
import { SystemService } from './system.service';
import { DEPT_RESOURCE, MENU_RESOURCE, ROLE_RESOURCE } from './resources';

@Controller()
export class SystemController {
  constructor(
    private readonly database: DatabaseService,
    private readonly redis: RedisService,
    private readonly system: SystemService,
    private readonly purchase: PurchaseService,
    private readonly chat: ChatService,
    private readonly sync: SyncService,
  ) {}

  @Get('health')
  async health(): Promise<DataRecord> {
    return { status: (await this.database.ping()) ? 'ok' : 'degraded', service: 'system-service', timestamp: new Date().toISOString() };
  }

  @Get('user/list')
  async users(@Query() query: PageQuery): Promise<DataRecord> {
    const result = await this.system.listUsers(query);
    return table(result.rows, result.total);
  }

  @Post('user/export')
  async exportUsers(@Body() query: PageQuery, @Res() response: Response): Promise<void> {
    const result = await this.system.listUsers({ ...query, pageNum: 1, pageSize: 500 });
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
  async userDeptTree(@Query() query: PageQuery): Promise<DataRecord> {
    return success(this.system.buildTreeSelect(await this.system.listDepartments(query)));
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
  async roles(@Query() query: PageQuery): Promise<DataRecord> { const result = await this.system.listRoles(query); return table(result.rows, result.total); }

  @Post('role/export')
  async exportRoles(@Body() query: PageQuery, @Res() response: Response): Promise<void> {
    const result = await this.system.listRoles({ ...query, pageNum: 1, pageSize: 500 });
    await this.sendWorkbook(response, '角色数据', ['roleId', 'roleName', 'roleKey', 'roleSort', 'dataScope', 'status'], result.rows);
  }

  @Get('role/optionselect')
  async roleOptions(): Promise<DataRecord> { return success((await this.database.list(ROLE_RESOURCE, { pageSize: 500, status: '0' })).rows); }

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
  async roleDeptTree(@Param('roleId') id: string): Promise<DataRecord> {
    const depts = await this.system.listDepartments({});
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
  async departments(@Query() query: PageQuery): Promise<DataRecord> { return success(await this.system.listDepartments(query)); }

  @Get('dept/list/exclude/:deptId')
  async departmentsExclude(@Param('deptId') id: string): Promise<DataRecord> {
    const all = await this.system.listDepartments({}); const current = Number(id);
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

  @Get('purchase/order/list')
  async purchaseList(@Query() query: PageQuery): Promise<DataRecord> { const result = await this.purchase.list(query); return table(result.rows, result.total); }

  @Get('purchase/order/stats')
  async purchaseStats(): Promise<DataRecord> { return success(await this.purchase.stats()); }

  @Get('purchase/order/:id/items')
  async purchaseItems(@Param('id') id: string): Promise<DataRecord> { return success(await this.purchase.items(id)); }

  @Get('purchase/order/:id')
  async purchaseDetail(@Param('id') id: string): Promise<DataRecord> { return success(await this.purchase.get(id)); }

  @Post('purchase/order')
  async addPurchase(@Body() body: DataRecord, @Req() request: Request): Promise<DataRecord> { await this.purchase.create(body, this.username(request)); return success(); }

  @Put('purchase/order/:id/status')
  async purchaseStatus(@Param('id') id: string, @Body() body: DataRecord, @Req() request: Request): Promise<DataRecord> { return affected(await this.purchase.updateStatus(id, String(body.status), this.username(request))); }

  @Delete('purchase/order/:ids')
  async removePurchases(@Param('ids') ids: string): Promise<DataRecord> { return affected(await this.purchase.remove(ids.split(',').filter(Boolean))); }

  @Post('sync/upload')
  async uploadChanges(@Body() body: DataRecord, @Req() request: Request): Promise<DataRecord> { return success(await this.sync.upload(body, this.userId(request))); }

  @Post('sync/download')
  async downloadChanges(@Body() body: DataRecord, @Req() request: Request): Promise<DataRecord> { return success(await this.sync.download(body, this.userId(request))); }

  @Get('chat/contacts')
  async contacts(@Req() request: Request, @Query('keyword') keyword: string): Promise<DataRecord> { return success(await this.chat.contacts(this.userId(request), keyword)); }

  @Get('chat/me')
  me(@Req() request: Request): DataRecord { return success({ userId: this.userId(request), userName: this.username(request) }); }

  @Get('chat/conversations')
  async conversations(@Req() request: Request): Promise<DataRecord> { return success(await this.chat.conversations(this.userId(request))); }

  @Post('chat/conversations/direct')
  async direct(@Req() request: Request, @Body() body: DataRecord): Promise<DataRecord> { return success(await this.chat.createDirect(this.userId(request), Number(body.peerUserId))); }

  @Post('chat/conversations/group')
  async group(@Req() request: Request, @Body() body: DataRecord): Promise<DataRecord> { return success(await this.chat.createGroup(this.userId(request), body.name, body.memberUserIds)); }

  @Get('chat/conversations/:conversationId/messages')
  async messages(@Req() request: Request, @Param('conversationId') id: string, @Query() query: PageQuery): Promise<DataRecord> { return success(await this.chat.messages(this.userId(request), Number(id), query.afterMessageId, query.beforeMessageId, query.limit)); }

  @Post('chat/conversations/:conversationId/messages')
  async send(@Req() request: Request, @Param('conversationId') id: string, @Body() body: DataRecord): Promise<DataRecord> { return success(await this.chat.send(this.userId(request), Number(id), body)); }

  @Put('chat/conversations/:conversationId/read')
  async read(@Req() request: Request, @Param('conversationId') id: string, @Body() body: DataRecord): Promise<DataRecord> { await this.chat.markRead(this.userId(request), Number(id), Number(body.lastReadMessageId)); return success({ ok: true }); }

  @Get('online/list')
  async online(@Query() query: PageQuery): Promise<DataRecord> {
    const keyword = String(query.userName ?? '');
    const keys = await this.redis.keys('login_tokens:*');
    const rows: DataRecord[] = [];
    for (const key of keys) {
      const session = await this.redis.getJson<DataRecord>(key);
      if (!session || (keyword && !String(session.username ?? '').includes(keyword))) continue;
      rows.push({ tokenId: key.slice('login_tokens:'.length), userName: session.username, ipaddr: session.ipaddr, loginTime: session.loginTime });
    }
    return table(rows, rows.length);
  }

  @Delete('online/:tokenId')
  async forceLogout(@Param('tokenId') tokenId: string): Promise<DataRecord> { await this.redis.delete(`login_tokens:${tokenId}`); return success(); }

  @Get('app-update/latest')
  appUpdate(@Query() query: PageQuery): DataRecord {
    const platform = String(query.platform ?? '').toLowerCase();
    const prefix = platform === 'ios' ? 'APP_UPDATE_IOS_' : platform === 'android' ? 'APP_UPDATE_ANDROID_' : 'APP_UPDATE_';
    const env = (name: string): string => String(process.env[`${prefix}${name}`] ?? process.env[`APP_UPDATE_${name}`] ?? '').trim();
    const type = ['wgt', 'store'].includes(env('TYPE')) ? env('TYPE') : 'apk';
    const versionName = env('VERSION_NAME'); const versionCode = Math.max(0, Number(env('VERSION_CODE')) || 0);
    const downloadUrl = env('PACKAGE_URL') || (type === 'store' ? env('STORE_URL') : ''); const sha256 = env('SHA256').toLowerCase();
    const configured = Boolean(versionName && downloadUrl && (type === 'store' || /^[a-f0-9]{64}$/.test(sha256)) && (type === 'wgt' || versionCode > 0));
    const available = type === 'wgt' ? this.compareVersions(versionName, String(query.wgtVersion ?? '0')) > 0 : versionCode > Math.max(0, Number(query.versionCode ?? 0));
    if (!configured || !available) return success({ available: false, message: configured ? '当前已是最新版本' : '当前暂无可用更新' });
    return success({ available: true, type, versionName, versionCode, title: env('TITLE') || `养老护理终端 ${versionName}`, description: env('DESCRIPTION').replaceAll('\\n', '\n'), downloadUrl, storeUrl: env('STORE_URL'), size: Number(env('SIZE')) || 0, sha256, mandatory: ['1', 'true', 'yes', 'on'].includes(env('MANDATORY').toLowerCase()), publishedAt: env('PUBLISHED_AT') });
  }

  private numberIds(value: string): number[] { return String(value ?? '').split(',').map(Number).filter((id) => Number.isFinite(id) && id > 0); }
  private userId(request: Request): number { return Number(request.headers.user_id ?? 0); }
  private username(request: Request): string { return decodeURIComponent(String(request.headers.username ?? 'system')); }
  private compareVersions(left: string, right: string): number {
    const a = left.split(/[.-]/); const b = right.split(/[.-]/); const length = Math.max(a.length, b.length);
    for (let index = 0; index < length; index += 1) {
      const x = a[index] ?? '0'; const y = b[index] ?? '0'; const numeric = /^\d+$/.test(x) && /^\d+$/.test(y);
      const result = numeric ? Number(x) - Number(y) : x.localeCompare(y, undefined, { sensitivity: 'base' }); if (result) return result;
    }
    return 0;
  }

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
