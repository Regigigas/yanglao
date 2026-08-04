// packages/db/src/repositories/supplier.repo.ts
import type { Database } from 'better-sqlite3'
import { nanoid } from 'nanoid'
import type { SupplierRow } from '../schema'

export class SupplierRepo {
  constructor(private db: Database) {}

  findAll(activeOnly = false): SupplierRow[] {
    const sql = activeOnly
      ? `SELECT * FROM supplier WHERE deleted_at IS NULL AND status='active' ORDER BY name`
      : `SELECT * FROM supplier WHERE deleted_at IS NULL ORDER BY name`
    return this.db.prepare<[], SupplierRow>(sql).all() as SupplierRow[]
  }

  findById(id: string): SupplierRow | undefined {
    return this.db
      .prepare<[string], SupplierRow>(`SELECT * FROM supplier WHERE id=? AND deleted_at IS NULL`)
      .get(id) as SupplierRow | undefined
  }

  insert(data: Omit<SupplierRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): SupplierRow {
    const now = Date.now()
    const row: SupplierRow = {
      ...data, id: nanoid(), created_at: now, updated_at: now, deleted_at: null
    }
    this.db.prepare(`
      INSERT INTO supplier
        (id,name,contact,phone,address,category,tax_no,bank_account,bank_name,status,remark,created_at,updated_at,deleted_at)
      VALUES
        (@id,@name,@contact,@phone,@address,@category,@tax_no,@bank_account,@bank_name,@status,@remark,@created_at,@updated_at,@deleted_at)
    `).run(row)
    return row
  }

  update(id: string, data: Partial<Omit<SupplierRow, 'id' | 'created_at' | 'deleted_at'>>): void {
    const fields = Object.keys(data)
    if (!fields.length) return
    const sets = [...fields, 'updated_at'].map(f => `${f}=@${f}`).join(',')
    this.db.prepare(`UPDATE supplier SET ${sets} WHERE id=@id`)
      .run({ ...data, updated_at: Date.now(), id })
  }

  delete(id: string): void {
    this.db.prepare(`UPDATE supplier SET deleted_at=?,updated_at=? WHERE id=?`)
      .run(Date.now(), Date.now(), id)
  }
}
