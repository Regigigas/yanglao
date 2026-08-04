// packages/db/src/repositories/user.repo.ts
// 用户 / 角色 仓库（登录鉴权、权限管理）
// 注意：密码哈希是敏感数据，不通过 change_log 同步到其他设备（账号体系不参与局域网数据同步）

import type { Database } from 'better-sqlite3'
import { nanoid } from 'nanoid'
import type { UserRow, RoleRow } from '../schema'
import { hashPassword, verifyPassword } from '../utils/password'

export class UserRepo {
  constructor(private db: Database) {}

  // ─── 角色 ─────────────────────────────────────────────────
  /** 角色列表，附带 user_count（该角色当前关联的账号数，供角色管理页展示/删除前提示） */
  findAllRoles(): (RoleRow & { user_count: number })[] {
    return this.db
      .prepare<[], RoleRow & { user_count: number }>(
        `SELECT r.*, (
           SELECT COUNT(*) FROM sys_user u WHERE u.role_id = r.id AND u.deleted_at IS NULL
         ) as user_count
         FROM sys_role r
         WHERE r.deleted_at IS NULL
         ORDER BY r.is_system DESC, r.created_at`
      )
      .all() as (RoleRow & { user_count: number })[]
  }

  findRoleById(id: string): RoleRow | null {
    return (this.db.prepare<[string], RoleRow>(`SELECT * FROM sys_role WHERE id=?`).get(id) as RoleRow | undefined) ?? null
  }

  insertRole(data: Omit<RoleRow, 'id' | 'is_system' | 'created_at' | 'updated_at' | 'deleted_at'>): RoleRow {
    const now = Date.now()
    const row: RoleRow = { ...data, id: nanoid(), is_system: 0, created_at: now, updated_at: now, deleted_at: null }
    this.db
      .prepare(
        `INSERT INTO sys_role (id,name,code,menu_keys,button_keys,is_system,remark,created_at,updated_at,deleted_at)
         VALUES (@id,@name,@code,@menu_keys,@button_keys,@is_system,@remark,@created_at,@updated_at,@deleted_at)`
      )
      .run(row)
    return row
  }

  updateRole(id: string, data: Partial<Omit<RoleRow, 'id' | 'is_system' | 'created_at' | 'deleted_at'>>): void {
    const role = this.findRoleById(id)
    if (role?.is_system) throw new Error('系统内置角色不允许修改')
    const now = Date.now()
    const fields = Object.keys(data)
    if (!fields.length) return
    const sets = [...fields, 'updated_at'].map(f => `${f}=@${f}`).join(',')
    this.db.prepare(`UPDATE sys_role SET ${sets} WHERE id=@id`).run({ ...data, updated_at: now, id })
  }

  deleteRole(id: string): void {
    const role = this.findRoleById(id)
    if (role?.is_system) throw new Error('系统内置角色不允许删除')
    const inUse = this.db
      .prepare<[string], { cnt: number }>(`SELECT COUNT(*) as cnt FROM sys_user WHERE role_id=? AND deleted_at IS NULL`)
      .get(id)
    if (inUse && inUse.cnt > 0) throw new Error('该角色下仍有账号，请先转移或删除相关账号')
    this.db.prepare(`UPDATE sys_role SET deleted_at=?, updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id)
  }

  // ─── 用户 ─────────────────────────────────────────────────
  findAllUsers(): UserRow[] {
    return this.db
      .prepare<[], UserRow>(`SELECT * FROM sys_user WHERE deleted_at IS NULL ORDER BY created_at DESC`)
      .all() as UserRow[]
  }

  findUserById(id: string): UserRow | null {
    return (this.db.prepare<[string], UserRow>(`SELECT * FROM sys_user WHERE id=?`).get(id) as UserRow | undefined) ?? null
  }

  findUserByUsername(username: string): UserRow | null {
    return (
      (this.db
        .prepare<[string], UserRow>(`SELECT * FROM sys_user WHERE username=? AND deleted_at IS NULL`)
        .get(username) as UserRow | undefined) ?? null
    )
  }

  /** 新增用户，密码由此方法内部哈希，调用方只传明文密码 */
  insertUser(
    data: Omit<UserRow, 'id' | 'password_hash' | 'password_salt' | 'last_login_at' | 'created_at' | 'updated_at' | 'deleted_at'> & {
      password: string
    }
  ): UserRow {
    const existing = this.findUserByUsername(data.username)
    if (existing) throw new Error('用户名已存在')
    const now = Date.now()
    const { password, ...rest } = data
    const { salt, hash } = hashPassword(password)
    const row: UserRow = {
      ...rest,
      id: nanoid(),
      password_hash: hash,
      password_salt: salt,
      last_login_at: null,
      created_at: now,
      updated_at: now,
      deleted_at: null,
    }
    this.db
      .prepare(
        `INSERT INTO sys_user (id,username,password_hash,password_salt,real_name,phone,role_id,status,must_change_pw,last_login_at,remark,created_at,updated_at,deleted_at)
         VALUES (@id,@username,@password_hash,@password_salt,@real_name,@phone,@role_id,@status,@must_change_pw,@last_login_at,@remark,@created_at,@updated_at,@deleted_at)`
      )
      .run(row)
    return row
  }

  /** 更新用户基础信息（不含密码）。内置管理员账号禁止被禁用或改绑其他角色，避免系统无人可管理 */
  updateUser(
    id: string,
    data: Partial<Omit<UserRow, 'id' | 'username' | 'password_hash' | 'password_salt' | 'created_at' | 'deleted_at'>>
  ): void {
    const user = this.findUserById(id)
    if (user?.username === 'admin') {
      if (data.status === 'disabled') throw new Error('内置管理员账号不允许禁用')
      if (data.role_id && data.role_id !== user.role_id) throw new Error('内置管理员账号不允许更换角色')
    }
    const now = Date.now()
    const fields = Object.keys(data)
    if (!fields.length) return
    const sets = [...fields, 'updated_at'].map(f => `${f}=@${f}`).join(',')
    this.db.prepare(`UPDATE sys_user SET ${sets} WHERE id=@id`).run({ ...data, updated_at: now, id })
  }

  /** 重置/修改密码（管理员重置或用户自己改密均走此方法） */
  setPassword(id: string, newPassword: string, mustChangePw = false): void {
    const now = Date.now()
    const { salt, hash } = hashPassword(newPassword)
    this.db
      .prepare(`UPDATE sys_user SET password_hash=?, password_salt=?, must_change_pw=?, updated_at=? WHERE id=?`)
      .run(hash, salt, mustChangePw ? 1 : 0, now, id)
  }

  softDeleteUser(id: string): void {
    const user = this.findUserById(id)
    if (user?.username === 'admin') throw new Error('内置管理员账号不允许删除')
    this.db.prepare(`UPDATE sys_user SET deleted_at=?, updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id)
  }

  /** 登录校验：用户名+密码匹配则返回用户行，否则返回 null */
  verifyLogin(username: string, password: string): UserRow | null {
    const user = this.findUserByUsername(username)
    if (!user || user.status !== 'active') return null
    const ok = verifyPassword(password, user.password_salt, user.password_hash)
    return ok ? user : null
  }

  recordLogin(id: string): void {
    this.db.prepare(`UPDATE sys_user SET last_login_at=? WHERE id=?`).run(Date.now(), id)
  }
}
