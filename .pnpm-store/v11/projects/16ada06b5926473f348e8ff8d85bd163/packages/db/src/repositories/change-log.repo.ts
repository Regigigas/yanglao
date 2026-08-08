// packages/db/src/repositories/change-log.repo.ts
// 变更日志 CRUD - 同步基础设施的核心数据层

import type { Database } from 'better-sqlite3'
import { nanoid } from 'nanoid'
import type { ChangeLogRow } from '../schema'

export class ChangeLogRepo {
  constructor(private db: Database) {}

  /**
   * 记录一条变更（INSERT / UPDATE / DELETE）
   * 由业务层在数据写操作后调用，或通过触发器自动插入
   */
  insert(params: Omit<ChangeLogRow, 'id' | 'created_at' | 'synced' | 'synced_at'>): string {
    const id = nanoid()
    this.db
      .prepare(
        `INSERT INTO change_log (id, table_name, record_id, operation, payload, created_at, synced)
         VALUES (?, ?, ?, ?, ?, ?, 0)`
      )
      .run(id, params.table_name, params.record_id, params.operation, params.payload, Date.now())
    return id
  }

  /**
   * 查询所有未同步的变更（按创建时间升序，限制条数）
   * @param limit 最多拉取条数，默认 500
   */
  getUnsynced(limit = 500): ChangeLogRow[] {
    return this.db
      .prepare<[number], ChangeLogRow>(
        `SELECT * FROM change_log WHERE synced=0 ORDER BY created_at ASC LIMIT ?`
      )
      .all(limit) as ChangeLogRow[]
  }

  /** 批量标记为已同步 */
  markSynced(ids: string[]): void {
    if (ids.length === 0) return
    const now = Date.now()
    const placeholders = ids.map(() => '?').join(',')
    this.db
      .prepare(
        `UPDATE change_log SET synced=1, synced_at=? WHERE id IN (${placeholders})`
      )
      .run(now, ...ids)
  }

  /** 查询未同步条数 */
  countUnsynced(): number {
    const row = this.db
      .prepare<[], { cnt: number }>(`SELECT COUNT(*) as cnt FROM change_log WHERE synced=0`)
      .get()
    return row?.cnt ?? 0
  }

  /** 清理已同步的历史变更（保留最近 N ms 内的记录，默认保留 7 天） */
  cleanup(retainMs = 7 * 24 * 60 * 60 * 1000): number {
    const before = Date.now() - retainMs
    const result = this.db
      .prepare(`DELETE FROM change_log WHERE synced=1 AND synced_at < ?`)
      .run(before)
    return result.changes
  }
}
