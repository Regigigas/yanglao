import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request, Response } from 'express';
import * as ExcelJS from 'exceljs';
import { DatabaseService, affected, success, successWith, table, type DataRecord, type PageQuery } from '@app/common';
import { IdentityService } from '../../domain/identity.service';
import { currentUserId, currentUsername, numberIds, sendWorkbook, storeAvatar } from '../../shared/http.helpers';

@Controller('user')
export class UsersController {
  constructor(
    private readonly database: DatabaseService,
    private readonly identity: IdentityService,
  ) {}

  @Get('list')
  async users(@Query() query: PageQuery, @Req() request: Request): Promise<DataRecord> {
    const result = await this.identity.listUsers(query, currentUserId(request));
    return table(result.rows, result.total);
  }

  @Post('export')
  async exportUsers(@Body() query: PageQuery, @Res() response: Response, @Req() request: Request): Promise<void> {
    const result = await this.identity.listUsers({ ...query, pageNum: 1, pageSize: 500 }, currentUserId(request));
    await sendWorkbook(response, '用户数据', ['userId', 'userName', 'nickName', 'deptId', 'email', 'phonenumber', 'sex', 'status'], result.rows);
  }

  @Post('importTemplate')
  async userTemplate(@Res() response: Response): Promise<void> {
    await sendWorkbook(response, '用户导入模板', ['userName', 'nickName', 'deptId', 'email', 'phonenumber', 'sex', 'status', 'password'], []);
  }

  @Post('importData')
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
          input.userId = existing[0].userId;
          await this.identity.updateUser(input, currentUsername(request));
        } else if (!existing.length) {
          await this.identity.createUser(input, currentUsername(request));
        } else {
          throw new Error('账号已存在');
        }
        successCount += 1;
      } catch (error) {
        errors.push(`第${index}行: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    return success(`成功导入 ${successCount} 条${errors.length ? `；失败 ${errors.length} 条：${errors.slice(0, 10).join('；')}` : ''}`);
  }

  @Post('register')
  async registerUser(@Body() body: DataRecord): Promise<DataRecord> {
    return success((await this.identity.createUser(body, String(body.userName ?? 'register'))) > 0);
  }

  @Put('recordlogin')
  async recordLogin(@Body() body: DataRecord): Promise<DataRecord> {
    const result = await this.database.execute('UPDATE sys_user SET login_ip=?,login_date=NOW() WHERE user_id=?', [String(body.loginIp ?? ''), Number(body.userId)]);
    return success(result.affectedRows > 0);
  }

  @Get('getInfo')
  async currentUser(@Req() request: Request): Promise<DataRecord> {
    return successWith(await this.identity.currentUser(currentUserId(request)));
  }

  @Get('info/:username')
  async userByName(@Param('username') username: string): Promise<DataRecord> {
    const rows = await this.database.query("SELECT * FROM sys_user WHERE user_name=? AND del_flag='0' LIMIT 1", [username]);
    if (!rows[0]) return { code: 500, msg: '用户名或密码错误' };
    const detail = await this.identity.currentUser(Number(rows[0].userId));
    return success({ sysUser: rows[0], roles: detail.roles, permissions: detail.permissions });
  }

  @Get()
  async userDetail(@Param('userId') id?: string): Promise<DataRecord> {
    return successWith(await this.identity.userDetail(id ? Number(id) : undefined));
  }

  @Post()
  async addUser(@Body() body: DataRecord, @Req() request: Request): Promise<DataRecord> {
    return affected(await this.identity.createUser(body, currentUsername(request)));
  }

  @Put()
  async editUser(@Body() body: DataRecord, @Req() request: Request): Promise<DataRecord> {
    return affected(await this.identity.updateUser(body, currentUsername(request)));
  }

  @Delete(':ids')
  async removeUsers(@Param('ids') ids: string): Promise<DataRecord> {
    return affected(await this.identity.removeUsers(numberIds(ids)));
  }

  @Put('resetPwd')
  async resetPassword(@Body() body: DataRecord, @Req() request: Request): Promise<DataRecord> {
    return affected(await this.identity.resetPassword(Number(body.userId), String(body.password ?? ''), currentUsername(request)));
  }

  @Put('changeStatus')
  async changeUserStatus(@Body() body: DataRecord): Promise<DataRecord> {
    if (Number(body.userId) === 1 && body.status !== '0') return { code: 500, msg: '不允许停用超级管理员' };
    const result = await this.database.execute('UPDATE sys_user SET status=?,update_time=NOW() WHERE user_id=?', [String(body.status), Number(body.userId)]);
    return affected(result.affectedRows);
  }

  @Get('authRole/:userId')
  async userRoles(@Param('userId') id: string): Promise<DataRecord> {
    const user = await this.database.get({ table: 'sys_user', id: 'user_id', columns: [] }, Number(id));
    if (user) delete user.password;
    const roles = await this.database.query("SELECT r.* FROM sys_role r LEFT JOIN sys_user_role ur ON ur.role_id=r.role_id AND ur.user_id=? WHERE r.del_flag='0' ORDER BY r.role_sort", [Number(id)]);
    return successWith({ user, roles });
  }

  @Put('authRole')
  async setUserRoles(@Query('userId') userId: string, @Query('roleIds') roleIds: string): Promise<DataRecord> {
    await this.identity.setUserRoles(Number(userId), numberIds(roleIds));
    return success();
  }

  @Get('deptTree')
  async userDeptTree(@Query() query: PageQuery, @Req() request: Request): Promise<DataRecord> {
    return success(this.identity.buildTreeSelect(await this.identity.listDepartments(query, currentUserId(request))));
  }

  @Get('profile')
  async profile(@Req() request: Request): Promise<DataRecord> {
    const userId = currentUserId(request);
    const current = await this.identity.currentUser(userId);
    const user = current.user as DataRecord;
    const roles = await this.database.query<{ roleName: string }>('SELECT r.role_name FROM sys_role r JOIN sys_user_role ur ON ur.role_id=r.role_id WHERE ur.user_id=?', [userId]);
    const posts = await this.database.query<{ postName: string }>('SELECT p.post_name FROM sys_post p JOIN sys_user_post up ON up.post_id=p.post_id WHERE up.user_id=?', [userId]);
    return successWith({ data: user, roleGroup: roles.map((row) => row.roleName).join(','), postGroup: posts.map((row) => row.postName).join(',') });
  }

  @Put('profile')
  async updateProfile(@Req() request: Request, @Body() body: DataRecord): Promise<DataRecord> {
    return affected(await this.identity.updateProfile(currentUserId(request), body));
  }

  @Put('profile/updatePwd')
  async updatePassword(@Req() request: Request, @Body() body: DataRecord): Promise<DataRecord> {
    return affected(await this.identity.updateOwnPassword(currentUserId(request), String(body.oldPassword ?? ''), String(body.newPassword ?? '')));
  }

  @Post('profile/avatar')
  @UseInterceptors(FileInterceptor('avatarfile', { limits: { fileSize: 5 * 1024 * 1024 } }))
  async avatar(@Req() request: Request, @UploadedFile() file: Express.Multer.File): Promise<DataRecord> {
    if (!file) return { code: 500, msg: '请选择头像文件' };
    const url = await storeAvatar(file);
    await this.identity.setAvatar(currentUserId(request), url);
    return successWith({ imgUrl: url });
  }

  @Get(':userId')
  async userDetailById(@Param('userId') id: string): Promise<DataRecord> {
    return successWith(await this.identity.userDetail(Number(id)));
  }
}
