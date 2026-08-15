import { BadRequestException, Injectable } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { DatabaseService, type DataRecord, type PageQuery } from '@app/common';
import { DEPT_RESOURCE, MENU_RESOURCE, ROLE_RESOURCE, USER_RESOURCE } from './resources';

@Injectable()
export class SystemService {
  constructor(private readonly database: DatabaseService) {}

  async listUsers(query: PageQuery): Promise<{ rows: DataRecord[]; total: number }> {
    const result = await this.database.list(USER_RESOURCE, query);
    const deptIds = [...new Set(result.rows.map((row) => Number(row.deptId)).filter(Boolean))];
    const depts = deptIds.length
      ? await this.database.query(`SELECT dept_id,dept_name,leader FROM sys_dept WHERE dept_id IN (${deptIds.map(() => '?').join(',')})`, deptIds)
      : [];
    const deptMap = new Map(depts.map((dept) => [Number(dept.deptId), dept]));
    result.rows = result.rows.map((user) => ({ ...user, password: undefined, dept: deptMap.get(Number(user.deptId)) ?? null }));
    return result;
  }

  async userDetail(userId?: number): Promise<DataRecord> {
    const fields: DataRecord = {
      roles: await this.database.query("SELECT * FROM sys_role WHERE status='0' AND del_flag='0' ORDER BY role_sort"),
      posts: await this.database.query("SELECT * FROM sys_post WHERE status='0' ORDER BY post_sort"),
    };
    if (userId) {
      const user = await this.database.get(USER_RESOURCE, userId);
      if (user) delete user.password;
      const roleIds = await this.database.query<{ roleId: number }>('SELECT role_id FROM sys_user_role WHERE user_id=?', [userId]);
      const postIds = await this.database.query<{ postId: number }>('SELECT post_id FROM sys_user_post WHERE user_id=?', [userId]);
      fields.data = user;
      fields.roleIds = roleIds.map((row) => row.roleId);
      fields.postIds = postIds.map((row) => row.postId);
    }
    return fields;
  }

  async currentUser(userId: number): Promise<DataRecord> {
    const rows = await this.database.query('SELECT * FROM sys_user WHERE user_id=? AND del_flag=\'0\' LIMIT 1', [userId]);
    const user = rows[0];
    if (!user) throw new BadRequestException('用户不存在');
    delete user.password;
    const roles = await this.database.query<{ roleKey: string }>(
      "SELECT DISTINCT r.role_key FROM sys_role r JOIN sys_user_role ur ON ur.role_id=r.role_id WHERE ur.user_id=? AND r.status='0' AND r.del_flag='0'", [userId],
    );
    const permissions = userId === 1 ? ['*:*:*'] : (await this.database.query<{ perms: string }>(
      "SELECT DISTINCT m.perms FROM sys_menu m JOIN sys_role_menu rm ON rm.menu_id=m.menu_id JOIN sys_user_role ur ON ur.role_id=rm.role_id WHERE ur.user_id=? AND m.status='0' AND m.perms IS NOT NULL AND m.perms<>''", [userId],
    )).map((row) => row.perms);
    const configRows = await this.database.query<{ configKey: string; configValue: string }>(
      "SELECT config_key,config_value FROM sys_config WHERE config_key IN ('sys.account.chrtype','sys.account.initPasswordModify','sys.account.passwordValidateDays')",
    );
    const config = Object.fromEntries(configRows.map((row) => [row.configKey, row.configValue]));
    return {
      user,
      roles: roles.map((row) => row.roleKey),
      permissions,
      pwdChrtype: config['sys.account.chrtype'] ?? '0',
      isDefaultModifyPwd: config['sys.account.initPasswordModify'] === '1' && !user.pwdUpdateDate,
      isPasswordExpired: this.passwordExpired(user.pwdUpdateDate, Number(config['sys.account.passwordValidateDays'] ?? 0)),
    };
  }

  async createUser(input: DataRecord, username: string): Promise<number> {
    const account = String(input.userName ?? '').trim();
    if (!account) throw new BadRequestException('用户账号不能为空');
    const existing = await this.database.query('SELECT user_id FROM sys_user WHERE user_name=? LIMIT 1', [account]);
    if (existing.length) throw new BadRequestException(`新增用户 ${account} 失败，登录账号已存在`);
    input.password = await hash(String(input.password ?? '123456'), 10);
    input.delFlag = '0';
    const created = await this.database.insert(USER_RESOURCE, input, username);
    await this.replaceUserRelations(created.insertId, input.roleIds, input.postIds);
    return created.affectedRows;
  }

  async updateUser(input: DataRecord, username: string): Promise<number> {
    const userId = Number(input.userId);
    if (userId === 1 && String(input.status ?? '0') !== '0') throw new BadRequestException('不允许停用超级管理员');
    delete input.password;
    const result = await this.database.update(USER_RESOURCE, input, username);
    await this.replaceUserRelations(userId, input.roleIds, input.postIds);
    return result.affectedRows;
  }

  async removeUsers(ids: number[]): Promise<number> {
    if (ids.includes(1)) throw new BadRequestException('不允许删除超级管理员');
    return (await this.database.remove(USER_RESOURCE, ids)).affectedRows;
  }

  async resetPassword(userId: number, password: string, username: string): Promise<number> {
    if (!password || password.length < 5) throw new BadRequestException('密码长度不能少于5位');
    const result = await this.database.execute('UPDATE sys_user SET password=?,pwd_update_date=NOW(),update_by=?,update_time=NOW() WHERE user_id=?', [await hash(password, 10), username, userId]);
    return result.affectedRows;
  }

  async updateProfile(userId: number, input: DataRecord): Promise<number> {
    const allowed = ['nickName', 'email', 'phonenumber', 'sex'];
    const entries = allowed.filter((field) => input[field] !== undefined);
    if (!entries.length) return 1;
    const columns: Record<string, string> = { nickName: 'nick_name', email: 'email', phonenumber: 'phonenumber', sex: 'sex' };
    const result = await this.database.execute(`UPDATE sys_user SET ${entries.map((field) => `${columns[field]}=?`).join(',')},update_time=NOW() WHERE user_id=?`, [...entries.map((field) => String(input[field] ?? '')), userId]);
    return result.affectedRows;
  }

  async updateOwnPassword(userId: number, oldPassword: string, newPassword: string): Promise<number> {
    const rows = await this.database.query<{ password: string }>('SELECT password FROM sys_user WHERE user_id=? LIMIT 1', [userId]);
    if (!rows[0] || !(await compare(oldPassword, rows[0].password))) throw new BadRequestException('修改密码失败，旧密码错误');
    if (newPassword.length < 5) throw new BadRequestException('新密码长度不能少于5位');
    const result = await this.database.execute('UPDATE sys_user SET password=?,pwd_update_date=NOW(),update_time=NOW() WHERE user_id=?', [await hash(newPassword, 10), userId]);
    return result.affectedRows;
  }

  async setAvatar(userId: number, avatar: string): Promise<number> {
    return (await this.database.execute('UPDATE sys_user SET avatar=?,update_time=NOW() WHERE user_id=?', [avatar, userId])).affectedRows;
  }

  async listRoles(query: PageQuery): Promise<{ rows: DataRecord[]; total: number }> {
    return this.database.list(ROLE_RESOURCE, query);
  }

  async roleDetail(roleId: number): Promise<DataRecord | null> {
    return this.database.get(ROLE_RESOURCE, roleId);
  }

  async saveRole(input: DataRecord, username: string, create: boolean): Promise<number> {
    const duplicate = await this.database.query(
      `SELECT role_id FROM sys_role WHERE (role_name=? OR role_key=?) AND del_flag='0' ${create ? '' : 'AND role_id<>?'}`,
      create ? [String(input.roleName), String(input.roleKey)] : [String(input.roleName), String(input.roleKey), Number(input.roleId)],
    );
    if (duplicate.length) throw new BadRequestException('角色名称或权限字符已存在');
    const result = create ? await this.database.insert(ROLE_RESOURCE, { ...input, delFlag: '0' }, username) : await this.database.update(ROLE_RESOURCE, input, username);
    const roleId = create ? result.insertId : Number(input.roleId);
    if (Array.isArray(input.menuIds)) {
      await this.database.execute('DELETE FROM sys_role_menu WHERE role_id=?', [roleId]);
      for (const menuId of input.menuIds) await this.database.execute('INSERT INTO sys_role_menu(role_id,menu_id) VALUES(?,?)', [roleId, Number(menuId)]);
    }
    if (Array.isArray(input.deptIds)) await this.setRoleDepartments(roleId, input.deptIds);
    return result.affectedRows;
  }

  async setRoleDepartments(roleId: number, deptIds: unknown): Promise<void> {
    await this.database.execute('DELETE FROM sys_role_dept WHERE role_id=?', [roleId]);
    if (Array.isArray(deptIds)) for (const deptId of deptIds) await this.database.execute('INSERT INTO sys_role_dept(role_id,dept_id) VALUES(?,?)', [roleId, Number(deptId)]);
  }

  async setUserRoles(userId: number, roleIds: number[]): Promise<void> {
    await this.database.execute('DELETE FROM sys_user_role WHERE user_id=?', [userId]);
    for (const roleId of roleIds) await this.database.execute('INSERT INTO sys_user_role(user_id,role_id) VALUES(?,?)', [userId, roleId]);
  }

  async roleUsers(roleId: number, allocated: boolean, query: PageQuery): Promise<{ rows: DataRecord[]; total: number }> {
    const relation = allocated ? 'IN' : 'NOT IN';
    const keyword = String(query.userName ?? '').trim();
    const rows = await this.database.query(
      `SELECT u.*,d.dept_name FROM sys_user u LEFT JOIN sys_dept d ON d.dept_id=u.dept_id
       WHERE u.del_flag='0' AND u.user_id ${relation} (SELECT user_id FROM sys_user_role WHERE role_id=?)
       AND (?='' OR u.user_name LIKE ? OR u.nick_name LIKE ?) ORDER BY u.user_id`,
      [roleId, keyword, `%${keyword}%`, `%${keyword}%`],
    );
    return { rows: rows.map((row) => ({ ...row, password: undefined })), total: rows.length };
  }

  async listDepartments(query: PageQuery): Promise<DataRecord[]> {
    return (await this.database.list(DEPT_RESOURCE, { ...query, pageSize: 500 })).rows;
  }

  async saveDepartment(input: DataRecord, username: string, create: boolean): Promise<number> {
    if (Number(input.parentId) === Number(input.deptId)) throw new BadRequestException('上级部门不能选择自己');
    if (create) {
      const parent = Number(input.parentId ?? 0);
      const parentRows = parent ? await this.database.query<{ ancestors: string }>('SELECT ancestors FROM sys_dept WHERE dept_id=?', [parent]) : [];
      input.ancestors = parent ? `${parentRows[0]?.ancestors ?? '0'},${parent}` : '0';
      input.delFlag = '0';
    }
    const result = create ? await this.database.insert(DEPT_RESOURCE, input, username) : await this.database.update(DEPT_RESOURCE, input, username);
    return result.affectedRows;
  }

  async listMenus(query: PageQuery, userId: number): Promise<DataRecord[]> {
    const result = await this.database.list(MENU_RESOURCE, { ...query, pageSize: 1000 });
    if (userId === 1) return result.rows;
    const allowed = await this.database.query<{ menuId: number }>('SELECT DISTINCT rm.menu_id FROM sys_role_menu rm JOIN sys_user_role ur ON ur.role_id=rm.role_id WHERE ur.user_id=?', [userId]);
    const ids = new Set(allowed.map((row) => row.menuId));
    return result.rows.filter((menu) => ids.has(Number(menu.menuId)));
  }

  async saveMenu(input: DataRecord, username: string, create: boolean): Promise<number> {
    if (Number(input.menuId) && Number(input.menuId) === Number(input.parentId)) throw new BadRequestException('上级菜单不能选择自己');
    const result = create ? await this.database.insert(MENU_RESOURCE, input, username) : await this.database.update(MENU_RESOURCE, input, username);
    return result.affectedRows;
  }

  async menuTree(userId: number): Promise<DataRecord[]> {
    const menus = await this.listMenus({ status: '0' }, userId);
    return this.buildTree(menus, 'menuId', 'parentId', (menu, children) => ({
      name: String(menu.routeName || this.capitalize(String(menu.path ?? 'index'))),
      path: String(menu.path ?? ''),
      hidden: menu.visible === '1',
      redirect: menu.parentId === 0 && menu.menuType === 'M' ? 'noRedirect' : undefined,
      component: menu.component || (Number(menu.parentId) === 0 ? 'Layout' : 'ParentView'),
      alwaysShow: menu.menuType === 'M',
      meta: { title: menu.menuName, icon: menu.icon, noCache: menu.isCache === '1', link: menu.isFrame === '0' ? menu.path : null },
      children,
    }));
  }

  buildTreeSelect(items: DataRecord[], idKey = 'deptId', parentKey = 'parentId', labelKey = 'deptName'): DataRecord[] {
    return this.buildTree(items, idKey, parentKey, (item, children) => ({ id: item[idKey], label: item[labelKey] ?? item.menuName, children }));
  }

  async updateSort(table: 'sys_menu' | 'sys_dept', idColumn: 'menu_id' | 'dept_id', idsText: string, orderText: string): Promise<void> {
    const ids = idsText.split(',');
    const orders = orderText.split(',');
    for (let index = 0; index < ids.length; index += 1) {
      await this.database.execute(`UPDATE ${table} SET ${table === 'sys_menu' ? 'order_num' : 'order_num'}=? WHERE ${idColumn}=?`, [Number(orders[index] ?? index), Number(ids[index])]);
    }
  }

  private async replaceUserRelations(userId: number, roleIds: unknown, postIds: unknown): Promise<void> {
    if (Array.isArray(roleIds)) await this.setUserRoles(userId, roleIds.map(Number));
    if (Array.isArray(postIds)) {
      await this.database.execute('DELETE FROM sys_user_post WHERE user_id=?', [userId]);
      for (const postId of postIds) await this.database.execute('INSERT INTO sys_user_post(user_id,post_id) VALUES(?,?)', [userId, Number(postId)]);
    }
  }

  private buildTree(
    items: DataRecord[], idKey: string, parentKey: string,
    mapper: (item: DataRecord, children: DataRecord[]) => DataRecord,
  ): DataRecord[] {
    const grouped = new Map<number, DataRecord[]>();
    const ids = new Set(items.map((item) => Number(item[idKey])));
    for (const item of items) {
      const parentId = Number(item[parentKey] ?? 0);
      const bucket = grouped.get(parentId) ?? [];
      bucket.push(item);
      grouped.set(parentId, bucket);
    }
    const visit = (item: DataRecord): DataRecord => mapper(item, (grouped.get(Number(item[idKey])) ?? []).map(visit));
    return items.filter((item) => !ids.has(Number(item[parentKey]))).map(visit);
  }

  private capitalize(value: string): string {
    const clean = value.replace(/^\//, '').replace(/[^A-Za-z0-9]/g, '');
    return clean ? `${clean[0].toUpperCase()}${clean.slice(1)}` : 'Index';
  }

  private passwordExpired(updatedAt: unknown, days: number): boolean {
    if (days <= 0) return false;
    if (!updatedAt) return true;
    return Date.now() - new Date(String(updatedAt)).getTime() > days * 86_400_000;
  }
}
