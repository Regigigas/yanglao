// packages/db/src/repositories/admission.repo.ts
// 入住/暂离/离院仓库

import type { Database } from 'better-sqlite3'
import { nanoid } from 'nanoid'
import type { AdmissionRow, LeaveRecordRow, DischargeRow } from '../schema'

export class AdmissionRepo {
  constructor(private db: Database) {}

  // ─── 入院记录 ──────────────────────────────────────────────
  findAll(): AdmissionRow[] {
    return this.db
      .prepare<[], AdmissionRow>(`SELECT * FROM admission WHERE deleted_at IS NULL ORDER BY created_at DESC`)
      .all() as AdmissionRow[]
  }

  findByElderly(elderlyId: string): AdmissionRow[] {
    return this.db
      .prepare<[string], AdmissionRow>(`SELECT * FROM admission WHERE elderly_id=? AND deleted_at IS NULL ORDER BY created_at DESC`)
      .all(elderlyId) as AdmissionRow[]
  }

  findActiveByElderly(elderlyId: string): AdmissionRow | null {
    return (
      (this.db
        .prepare<[string], AdmissionRow>(`SELECT * FROM admission WHERE elderly_id=? AND status='active' AND deleted_at IS NULL LIMIT 1`)
        .get(elderlyId) as AdmissionRow | undefined) ?? null
    )
  }

  findById(id: string): AdmissionRow | null {
    return (this.db.prepare<[string], AdmissionRow>(`SELECT * FROM admission WHERE id=?`).get(id) as AdmissionRow | undefined) ?? null
  }

  insert(data: Omit<AdmissionRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): AdmissionRow {
    const now = Date.now()
    const row: AdmissionRow = { ...data, id: nanoid(), created_at: now, updated_at: now, deleted_at: null }
    this.db
      .prepare(
        `INSERT INTO admission (id,elderly_id,bed_id,admission_date,care_level,deposit,monthly_fee,status,remark,created_by,created_at,updated_at,deleted_at)
         VALUES (@id,@elderly_id,@bed_id,@admission_date,@care_level,@deposit,@monthly_fee,@status,@remark,@created_by,@created_at,@updated_at,@deleted_at)`
      )
      .run(row)
    return row
  }

  update(id: string, data: Partial<Omit<AdmissionRow, 'id' | 'created_at' | 'deleted_at'>>): void {
    const now = Date.now()
    const fields = Object.keys(data)
    if (!fields.length) return
    const sets = [...fields, 'updated_at'].map(f => `${f}=@${f}`).join(',')
    this.db.prepare(`UPDATE admission SET ${sets} WHERE id=@id`).run({ ...data, updated_at: now, id })
  }

  softDelete(id: string): void {
    this.db.prepare(`UPDATE admission SET deleted_at=?, updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id)
  }

  // ─── 暂离记录 ──────────────────────────────────────────────
  findLeaveByElderly(elderlyId: string): LeaveRecordRow[] {
    return this.db
      .prepare<[string], LeaveRecordRow>(`SELECT * FROM leave_record WHERE elderly_id=? AND deleted_at IS NULL ORDER BY leave_date DESC`)
      .all(elderlyId) as LeaveRecordRow[]
  }

  findActiveLeave(elderlyId: string): LeaveRecordRow | null {
    return (
      (this.db
        .prepare<[string], LeaveRecordRow>(`SELECT * FROM leave_record WHERE elderly_id=? AND status='out' AND deleted_at IS NULL LIMIT 1`)
        .get(elderlyId) as LeaveRecordRow | undefined) ?? null
    )
  }

  insertLeave(data: Omit<LeaveRecordRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): LeaveRecordRow {
    const now = Date.now()
    const row: LeaveRecordRow = { ...data, id: nanoid(), created_at: now, updated_at: now, deleted_at: null }
    this.db
      .prepare(
        `INSERT INTO leave_record (id,elderly_id,leave_date,expect_return,actual_return,reason,contact_phone,status,created_by,created_at,updated_at,deleted_at)
         VALUES (@id,@elderly_id,@leave_date,@expect_return,@actual_return,@reason,@contact_phone,@status,@created_by,@created_at,@updated_at,@deleted_at)`
      )
      .run(row)
    return row
  }

  updateLeave(id: string, data: Partial<Omit<LeaveRecordRow, 'id' | 'created_at' | 'deleted_at'>>): void {
    const now = Date.now()
    const fields = Object.keys(data)
    if (!fields.length) return
    const sets = [...fields, 'updated_at'].map(f => `${f}=@${f}`).join(',')
    this.db.prepare(`UPDATE leave_record SET ${sets} WHERE id=@id`).run({ ...data, updated_at: now, id })
  }

  // ─── 离院记录 ──────────────────────────────────────────────
  findDischargeByElderly(elderlyId: string): DischargeRow[] {
    return this.db
      .prepare<[string], DischargeRow>(`SELECT * FROM discharge WHERE elderly_id=? AND deleted_at IS NULL ORDER BY discharge_date DESC`)
      .all(elderlyId) as DischargeRow[]
  }

  insertDischarge(data: Omit<DischargeRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): DischargeRow {
    const now = Date.now()
    const row: DischargeRow = { ...data, id: nanoid(), created_at: now, updated_at: now, deleted_at: null }
    this.db
      .prepare(
        `INSERT INTO discharge (id,elderly_id,admission_id,discharge_date,reason,refund_amount,remark,created_by,created_at,updated_at,deleted_at)
         VALUES (@id,@elderly_id,@admission_id,@discharge_date,@reason,@refund_amount,@remark,@created_by,@created_at,@updated_at,@deleted_at)`
      )
      .run(row)
    return row
  }
}
