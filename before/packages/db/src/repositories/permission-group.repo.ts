// packages/db/src/repositories/permission-group.repo.ts
// 权限组仓库：预设的菜单/按钮权限集合，角色管理页创建/编辑角色时可一键套用
// 权限组与角色之间无外键关联（套用即拷贝值），因此没有"使用中不可删除"的限制

import type { Database } from 'better-sqlite3'
import { nanoid } from 'nanoid'
import type { PermissionGroupRow } from '../schema'

export class PermissionGroupRepo {
  constructor(private db: Database) {}

  findAll(): PermissionGroupRow[] {
    return this.db
      .prepare<[], PermissionGroupRow>(`SELECT * FROM sys_permission_group WHERE deleted_at IS NULL ORDER BY created_at`)
      .all() as PermissionGroupRow[]
  }

  findById(id: string): PermissionGroupRow | null {
    return (
      (this.db
        .prepare<[string], PermissionGroupRow>(`SELECT * FROM sys_permission_group WHERE id=?`)
        .get(id) as PermissionGroupRow | undefined) ?? null
    )
  }

  findByCode(code: string): PermissionGroupRow | null {
    return (
      (this.db
        .prepare<[string], PermissionGroupRow>(`SELECT * FROM sys_permission_group WHERE code=? AND deleted_at IS NULL`)
        .get(code) as PermissionGroupRow | undefined) ?? null
    )
  }

  insert(data: Omit<PermissionGroupRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): PermissionGroupRow {
    const existing = this.findByCode(data.code)
    if (existing) throw new Error('权限组编码已存在')
    const now = Date.now()
    const row: PermissionGroupRow = { ...data, id: nanoid(), created_at: now, updated_at: now, deleted_at: null }
    this.db
      .prepare(
        `INSERT INTO sys_permission_group (id,name,code,menu_keys,button_keys,remark,created_at,updated_at,deleted_at)
         VALUES (@id,@name,@code,@menu_keys,@button_keys,@remark,@created_at,@updated_at,@deleted_at)`
      )
      .run(row)
    return row
  }

  update(id: string, data: Partial<Omit<PermissionGroupRow, 'id' | 'created_at' | 'deleted_at'>>): void {
    const now = Date.now()
    const fields = Object.keys(data)
    if (!fields.length) return
    const sets = [...fields, 'updated_at'].map(f => `${f}=@${f}`).join(',')
    this.db.prepare(`UPDATE sys_permission_group SET ${sets} WHERE id=@id`).run({ ...data, updated_at: now, id })
  }

  softDelete(id: string): void {
    this.db.prepare(`UPDATE sys_permission_group SET deleted_at=?, updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id)
  }
}
