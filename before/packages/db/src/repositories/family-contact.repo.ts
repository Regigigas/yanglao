// packages/db/src/repositories/family-contact.repo.ts
// 家属/紧急联系人仓库

import type { Database } from 'better-sqlite3'
import { nanoid } from 'nanoid'
import type { FamilyContactRow } from '../schema'

export class FamilyContactRepo {
  constructor(private db: Database) {}

  findByElderly(elderlyId: string): FamilyContactRow[] {
    return this.db
      .prepare<[string], FamilyContactRow>(
        `SELECT * FROM family_contact WHERE elderly_id=? AND deleted_at IS NULL ORDER BY is_guardian DESC, is_emergency DESC, created_at`
      )
      .all(elderlyId) as FamilyContactRow[]
  }

  findById(id: string): FamilyContactRow | null {
    return (
      (this.db.prepare<[string], FamilyContactRow>(`SELECT * FROM family_contact WHERE id=?`).get(id) as FamilyContactRow | undefined) ?? null
    )
  }

  insert(data: Omit<FamilyContactRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): FamilyContactRow {
    const now = Date.now()
    const row: FamilyContactRow = { ...data, id: nanoid(), created_at: now, updated_at: now, deleted_at: null }
    this.db
      .prepare(
        `INSERT INTO family_contact (id,elderly_id,name,relation,phone,phone2,id_card,address,is_emergency,is_guardian,remark,created_at,updated_at,deleted_at)
         VALUES (@id,@elderly_id,@name,@relation,@phone,@phone2,@id_card,@address,@is_emergency,@is_guardian,@remark,@created_at,@updated_at,@deleted_at)`
      )
      .run(row)
    return row
  }

  update(id: string, data: Partial<Omit<FamilyContactRow, 'id' | 'created_at' | 'deleted_at'>>): void {
    const now = Date.now()
    const fields = Object.keys(data)
    if (!fields.length) return
    const sets = [...fields, 'updated_at'].map(f => `${f}=@${f}`).join(',')
    this.db.prepare(`UPDATE family_contact SET ${sets} WHERE id=@id`).run({ ...data, updated_at: now, id })
  }

  softDelete(id: string): void {
    this.db.prepare(`UPDATE family_contact SET deleted_at=?, updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id)
  }
}
