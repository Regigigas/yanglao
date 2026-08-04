// packages/db/src/repositories/contract.repo.ts
// 合同管理仓库

import type { Database } from 'better-sqlite3'
import { nanoid } from 'nanoid'
import type { ContractRow } from '../schema'

export class ContractRepo {
  constructor(private db: Database) {}

  findAll(): ContractRow[] {
    return this.db
      .prepare<[], ContractRow>(`SELECT * FROM contract WHERE deleted_at IS NULL ORDER BY created_at DESC`)
      .all() as ContractRow[]
  }

  findByElderly(elderlyId: string): ContractRow[] {
    return this.db
      .prepare<[string], ContractRow>(`SELECT * FROM contract WHERE elderly_id=? AND deleted_at IS NULL ORDER BY sign_date DESC`)
      .all(elderlyId) as ContractRow[]
  }

  findActiveByElderly(elderlyId: string): ContractRow | null {
    return (
      (this.db
        .prepare<[string], ContractRow>(`SELECT * FROM contract WHERE elderly_id=? AND status='active' AND deleted_at IS NULL LIMIT 1`)
        .get(elderlyId) as ContractRow | undefined) ?? null
    )
  }

  findById(id: string): ContractRow | null {
    return (this.db.prepare<[string], ContractRow>(`SELECT * FROM contract WHERE id=?`).get(id) as ContractRow | undefined) ?? null
  }

  /** 查询即将到期的合同（指定天数内）
   *  end_date 现在存储为 'YYYY-MM-DD HH:mm:ss'，用 SQLite date() 函数只取日期部分参与比较，
   *  避免因为带时间戳字符串比 10 位日期字符串"更大"而导致边界判断失真（漏掉临期合同）。 */
  findExpiringSoon(days = 30): ContractRow[] {
    const today = new Date().toISOString().slice(0, 10)
    const limit = new Date(Date.now() + days * 86400000).toISOString().slice(0, 10)
    return this.db
      .prepare<[string, string], ContractRow>(
        `SELECT * FROM contract WHERE deleted_at IS NULL AND status='active' AND date(end_date) >= date(?) AND date(end_date) <= date(?) ORDER BY end_date`
      )
      .all(today, limit) as ContractRow[]
  }

  insert(data: Omit<ContractRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): ContractRow {
    const now = Date.now()
    const row: ContractRow = { ...data, id: nanoid(), created_at: now, updated_at: now, deleted_at: null }
    this.db
      .prepare(`INSERT INTO contract (id,elderly_id,contract_no,sign_date,start_date,end_date,auto_renew,renew_months,monthly_amount,status,file_path,remark,created_by,created_at,updated_at,deleted_at)
        VALUES (@id,@elderly_id,@contract_no,@sign_date,@start_date,@end_date,@auto_renew,@renew_months,@monthly_amount,@status,@file_path,@remark,@created_by,@created_at,@updated_at,@deleted_at)`)
      .run(row)
    return row
  }

  update(id: string, data: Partial<Omit<ContractRow, 'id' | 'created_at' | 'deleted_at'>>): void {
    const now = Date.now()
    const fields = Object.keys(data)
    if (!fields.length) return
    const sets = [...fields, 'updated_at'].map(f => `${f}=@${f}`).join(',')
    this.db.prepare(`UPDATE contract SET ${sets} WHERE id=@id`).run({ ...data, updated_at: now, id })
  }

  softDelete(id: string): void {
    this.db.prepare(`UPDATE contract SET deleted_at=?, updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id)
  }

  /** 生成唯一合同编号 */
  generateContractNo(): string {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const count = (this.db.prepare<[], { cnt: number }>(`SELECT COUNT(*) AS cnt FROM contract`).get() as { cnt: number })?.cnt ?? 0
    return `HT${date}${String(count + 1).padStart(4, '0')}`
  }
}
