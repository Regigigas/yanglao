import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import * as jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import { DatabaseService, RedisService, type DataRecord } from '@app/common';
import { RuntimeConfig } from '@app/config';

interface LoginUserRow extends DataRecord {
  userId: number;
  userName: string;
  nickName: string;
  password: string;
  status: string;
  delFlag: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly database: DatabaseService, private readonly redis: RedisService) {}

  async login(usernameInput: unknown, passwordInput: unknown, codeInput: unknown, uuidInput: unknown, ipAddress: string): Promise<DataRecord> {
    await this.validateCaptcha(codeInput, uuidInput);
    const username = String(usernameInput ?? '').trim();
    const password = String(passwordInput ?? '');
    if (username.length < 2 || username.length > 20 || password.length < 5 || password.length > 100) {
      await this.recordLogin(username, '1', '用户或密码格式错误', ipAddress);
      throw new BadRequestException('用户或密码格式错误');
    }
    const users = await this.database.query<LoginUserRow>(
      "SELECT * FROM sys_user WHERE user_name = ? AND del_flag = '0' LIMIT 1",
      [username],
    );
    const user = users[0];
    if (!user || !(await compare(password, user.password))) {
      await this.recordLogin(username, '1', '用户名或密码错误', ipAddress);
      throw new UnauthorizedException('用户名或密码错误');
    }
    if (user.status === '1') throw new UnauthorizedException('用户已停用，请联系管理员');
    const roles = await this.database.query<{ roleKey: string }>(
      "SELECT DISTINCT r.role_key FROM sys_role r JOIN sys_user_role ur ON ur.role_id=r.role_id WHERE ur.user_id=? AND r.status='0' AND r.del_flag='0'",
      [user.userId],
    );
    const permissions = await this.database.query<{ perms: string }>(
      "SELECT DISTINCT m.perms FROM sys_menu m JOIN sys_role_menu rm ON rm.menu_id=m.menu_id JOIN sys_user_role ur ON ur.role_id=rm.role_id WHERE ur.user_id=? AND m.status='0' AND m.perms IS NOT NULL AND m.perms<>''",
      [user.userId],
    );
    const expiresIn = (process.env.JWT_EXPIRES_IN ?? '720m') as SignOptions['expiresIn'];
    const userKey = randomUUID().replaceAll('-', '');
    const roleKeys = roles.map((role) => role.roleKey);
    const permissionKeys = user.userId === 1 ? ['*:*:*'] : permissions.map((permission) => permission.perms);
    const accessToken = jwt.sign(
      {
        user_key: userKey,
        user_id: user.userId,
        username: user.userName,
        roles: roleKeys,
        permissions: permissionKeys,
      },
      process.env.JWT_SECRET ?? 'abcdefghijklmnopqrstuvwxyz',
      { algorithm: 'HS512', expiresIn },
    );
    await this.redis.setJson(`login_tokens:${userKey}`, { userId: user.userId, username: user.userName, roles: roleKeys, permissions: permissionKeys, ipaddr: ipAddress, loginTime: Date.now() }, this.expireMinutes() * 60);
    await this.database.execute('UPDATE sys_user SET login_ip=?, login_date=NOW() WHERE user_id=?', [ipAddress, user.userId]);
    await this.recordLogin(username, '0', '登录成功', ipAddress);
    return { access_token: accessToken, expires_in: this.expireMinutes() };
  }

  async register(usernameInput: unknown, passwordInput: unknown, codeInput: unknown, uuidInput: unknown): Promise<void> {
    await this.validateCaptcha(codeInput, uuidInput);
    const username = String(usernameInput ?? '').trim();
    const password = String(passwordInput ?? '');
    if (username.length < 2 || username.length > 20) throw new BadRequestException('账户长度必须在2到20个字符之间');
    if (password.length < 5 || password.length > 100) throw new BadRequestException('密码长度必须在5到100个字符之间');
    const config = await this.database.query<{ configValue: string }>("SELECT config_value FROM sys_config WHERE config_key='sys.account.registerUser' LIMIT 1");
    if (config[0]?.configValue !== 'true') throw new BadRequestException('当前系统没有开启注册功能');
    const existing = await this.database.query('SELECT user_id FROM sys_user WHERE user_name=? LIMIT 1', [username]);
    if (existing.length) throw new BadRequestException(`账号 ${username} 已存在`);
    await this.database.execute(
      "INSERT INTO sys_user(user_name,nick_name,password,status,del_flag,pwd_update_date,create_by,create_time) VALUES(?,?,?,'0','0',NOW(),?,NOW())",
      [username, username, await hash(password, 10), username],
    );
  }

  async unlock(userId: number, passwordInput: unknown): Promise<void> {
    const rows = await this.database.query<LoginUserRow>('SELECT * FROM sys_user WHERE user_id=? LIMIT 1', [userId]);
    if (!rows[0] || !(await compare(String(passwordInput ?? ''), rows[0].password))) {
      throw new UnauthorizedException('密码错误，请重新输入');
    }
  }

  async logout(token: string): Promise<void> {
    try {
      const claims = jwt.verify(token, process.env.JWT_SECRET ?? 'abcdefghijklmnopqrstuvwxyz', { algorithms: ['HS512'] });
      if (typeof claims === 'object' && claims.user_key) await this.redis.delete(`login_tokens:${String(claims.user_key)}`);
    } catch { /* An expired token is already logged out. */ }
  }

  async refresh(token: string): Promise<number> {
    const claims = jwt.verify(token, process.env.JWT_SECRET ?? 'abcdefghijklmnopqrstuvwxyz', { algorithms: ['HS512'] });
    if (typeof claims !== 'object' || !claims.user_key) throw new UnauthorizedException('令牌无效');
    await this.redis.expire(`login_tokens:${String(claims.user_key)}`, this.expireMinutes() * 60);
    return this.expireMinutes();
  }

  private expireMinutes(): number {
    const match = /^(\d+)m$/.exec(process.env.JWT_EXPIRES_IN ?? '720m');
    return match ? Number(match[1]) : 720;
  }

  private async validateCaptcha(codeInput: unknown, uuidInput: unknown): Promise<void> {
    if (!RuntimeConfig.boolean('CAPTCHA_ENABLED', false)) return;
    const uuid = String(uuidInput ?? '').trim();
    const code = String(codeInput ?? '').trim();
    if (!uuid || !code) throw new BadRequestException('验证码不能为空');
    const key = `captcha_codes:${uuid}`;
    const expected = await this.redis.getJson<string>(key);
    await this.redis.delete(key);
    if (!expected) throw new BadRequestException('验证码已失效');
    if (String(expected).toLowerCase() !== code.toLowerCase()) throw new BadRequestException('验证码错误');
  }

  private async recordLogin(username: string, status: string, message: string, ipAddress: string): Promise<void> {
    try {
      await this.database.execute(
        "INSERT INTO sys_logininfor(user_name,ipaddr,login_location,browser,os,status,msg,login_time) VALUES(?,?,'','','',?,?,NOW())",
        [username, ipAddress, status, message],
      );
    } catch {
      // Login must remain available when the optional audit table has not been initialized yet.
    }
  }
}
