// packages/db/src/repositories/elderly.repo.ts
// 老人信息 CRUD（含变更日志记录）

import type { Database } from 'better-sqlite3'
import { nanoid } from 'nanoid'
import type { ElderlyRow } from '../schema'
import { ChangeLogRepo } from './change-log.repo'

export class ElderlyRepo {
  private changeLog: ChangeLogRepo

  constructor(private db: Database) {
    this.changeLog = new ChangeLogRepo(db)
  }

  findAll(includeDeleted = false): ElderlyRow[] {
    const sql = includeDeleted
      ? `SELECT * FROM elderly ORDER BY created_at DESC`
      : `SELECT * FROM elderly WHERE deleted_at IS NULL ORDER BY created_at DESC`
    return this.db.prepare<[], ElderlyRow>(sql).all() as ElderlyRow[]
  }

  findById(id: string): ElderlyRow | null {
    return (
      (this.db
        .prepare<[string], ElderlyRow>(`SELECT * FROM elderly WHERE id=?`)
        .get(id) as ElderlyRow | undefined) ?? null
    )
  }

  insert(data: Omit<ElderlyRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): ElderlyRow {
    const now = Date.now()
    const id = nanoid()
    const row: ElderlyRow = {
      ...data,
      id,
      created_at: now,
      updated_at: now,
      deleted_at: null,
    }
    this.db
      .prepare(
        `INSERT INTO elderly (id,name,gender,birth_date,id_card,phone,address,room_no,status,created_at,updated_at,deleted_at)
         VALUES (@id,@name,@gender,@birth_date,@id_card,@phone,@address,@room_no,@status,@created_at,@updated_at,@deleted_at)`
      )
      .run(row)

    // 记录变更
    this.changeLog.insert({
      table_name: 'elderly',
      record_id: id,
      operation: 'INSERT',
      payload: JSON.stringify(row),
    })
    return row
  }

  update(id: string, data: Partial<Omit<ElderlyRow, 'id' | 'created_at' | 'deleted_at'>>): void {
    const now = Date.now()
    const fields = Object.keys(data).filter(k => k !== 'updated_at')
    if (fields.length === 0) return
    const sets = [...fields, 'updated_at'].map(f => `${f}=@${f}`).join(',')
    this.db
      .prepare(`UPDATE elderly SET ${sets} WHERE id=@id`)
      .run({ ...data, updated_at: now, id })

    this.changeLog.insert({
      table_name: 'elderly',
      record_id: id,
      operation: 'UPDATE',
      payload: JSON.stringify({ id, ...data, updated_at: now }),
    })
  }

  /** 软删除 */
  softDelete(id: string): void {
    const now = Date.now()
    this.db
      .prepare(`UPDATE elderly SET deleted_at=?, updated_at=? WHERE id=?`)
      .run(now, now, id)

    this.changeLog.insert({
      table_name: 'elderly',
      record_id: id,
      operation: 'DELETE',
      payload: JSON.stringify({ id, deleted_at: now }),
    })
  }
}
