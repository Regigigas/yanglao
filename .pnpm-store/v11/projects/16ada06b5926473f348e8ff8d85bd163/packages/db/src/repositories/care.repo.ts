// packages/db/src/repositories/care.repo.ts
// 护理评估/护理计划/护理记录仓库

import type { Database } from 'better-sqlite3'
import { nanoid } from 'nanoid'
import type { CareAssessmentRow, CarePlanRow, CareRecordRow } from '../schema'

export class CareRepo {
  constructor(private db: Database) {}

  // ─── 护理评估 ──────────────────────────────────────────────
  findAssessments(elderlyId: string): CareAssessmentRow[] {
    return this.db
      .prepare<[string], CareAssessmentRow>(
        `SELECT * FROM care_assessment WHERE elderly_id=? AND deleted_at IS NULL ORDER BY assess_date DESC`
      )
      .all(elderlyId) as CareAssessmentRow[]
  }

  findLatestAssessment(elderlyId: string): CareAssessmentRow | null {
    return (
      (this.db
        .prepare<[string], CareAssessmentRow>(
          `SELECT * FROM care_assessment WHERE elderly_id=? AND deleted_at IS NULL ORDER BY assess_date DESC LIMIT 1`
        )
        .get(elderlyId) as CareAssessmentRow | undefined) ?? null
    )
  }

  insertAssessment(data: Omit<CareAssessmentRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): CareAssessmentRow {
    const now = Date.now()
    const row: CareAssessmentRow = { ...data, id: nanoid(), created_at: now, updated_at: now, deleted_at: null }
    this.db
      .prepare(
        `INSERT INTO care_assessment (id,elderly_id,assess_date,assessor,eating,bathing,grooming,dressing,bowel,bladder,toilet,transfer,mobility,stairs,total_score,care_level,remark,created_at,updated_at,deleted_at)
         VALUES (@id,@elderly_id,@assess_date,@assessor,@eating,@bathing,@grooming,@dressing,@bowel,@bladder,@toilet,@transfer,@mobility,@stairs,@total_score,@care_level,@remark,@created_at,@updated_at,@deleted_at)`
      )
      .run(row)
    return row
  }

  deleteAssessment(id: string): void {
    this.db.prepare(`UPDATE care_assessment SET deleted_at=?, updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id)
  }

  // ─── 护理计划 ──────────────────────────────────────────────
  findPlans(elderlyId: string): CarePlanRow[] {
    return this.db
      .prepare<[string], CarePlanRow>(`SELECT * FROM care_plan WHERE elderly_id=? AND deleted_at IS NULL ORDER BY start_date DESC`)
      .all(elderlyId) as CarePlanRow[]
  }

  findActivePlan(elderlyId: string): CarePlanRow | null {
    return (
      (this.db
        .prepare<[string], CarePlanRow>(
          `SELECT * FROM care_plan WHERE elderly_id=? AND status='active' AND deleted_at IS NULL ORDER BY start_date DESC LIMIT 1`
        )
        .get(elderlyId) as CarePlanRow | undefined) ?? null
    )
  }

  insertPlan(data: Omit<CarePlanRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): CarePlanRow {
    const now = Date.now()
    const row: CarePlanRow = { ...data, id: nanoid(), created_at: now, updated_at: now, deleted_at: null }
    this.db
      .prepare(
        `INSERT INTO care_plan (id,elderly_id,care_level,start_date,end_date,status,content,created_by,created_at,updated_at,deleted_at)
         VALUES (@id,@elderly_id,@care_level,@start_date,@end_date,@status,@content,@created_by,@created_at,@updated_at,@deleted_at)`
      )
      .run(row)
    return row
  }

  updatePlan(id: string, data: Partial<Omit<CarePlanRow, 'id' | 'created_at' | 'deleted_at'>>): void {
    const now = Date.now()
    const fields = Object.keys(data)
    if (!fields.length) return
    const sets = [...fields, 'updated_at'].map(f => `${f}=@${f}`).join(',')
    this.db.prepare(`UPDATE care_plan SET ${sets} WHERE id=@id`).run({ ...data, updated_at: now, id })
  }

  deletePlan(id: string): void {
    this.db.prepare(`UPDATE care_plan SET deleted_at=?, updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id)
  }

  // ─── 护理记录 ──────────────────────────────────────────────
  // record_date 现在存储为 'YYYY-MM-DD HH:mm:ss'，用 date() 只取日期部分比较，
  // 确保同一天不同时间提交的护理记录仍能按天正确归类查询。
  findRecords(elderlyId: string, date?: string): CareRecordRow[] {
    if (date) {
      return this.db
        .prepare<[string, string], CareRecordRow>(
          `SELECT * FROM care_record WHERE elderly_id=? AND date(record_date)=date(?) AND deleted_at IS NULL ORDER BY shift, created_at`
        )
        .all(elderlyId, date) as CareRecordRow[]
    }
    return this.db
      .prepare<[string], CareRecordRow>(
        `SELECT * FROM care_record WHERE elderly_id=? AND deleted_at IS NULL ORDER BY record_date DESC, shift LIMIT 60`
      )
      .all(elderlyId) as CareRecordRow[]
  }

  findRecordsByDate(date: string): CareRecordRow[] {
    return this.db
      .prepare<[string], CareRecordRow>(
        `SELECT * FROM care_record WHERE date(record_date)=date(?) AND deleted_at IS NULL ORDER BY elderly_id, shift`
      )
      .all(date) as CareRecordRow[]
  }

  insertRecord(data: Omit<CareRecordRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): CareRecordRow {
    const now = Date.now()
    const row: CareRecordRow = { ...data, id: nanoid(), created_at: now, updated_at: now, deleted_at: null }
    this.db
      .prepare(
        `INSERT INTO care_record (id,elderly_id,plan_id,record_date,shift,care_type,content,executor,status,remark,created_at,updated_at,deleted_at)
         VALUES (@id,@elderly_id,@plan_id,@record_date,@shift,@care_type,@content,@executor,@status,@remark,@created_at,@updated_at,@deleted_at)`
      )
      .run(row)
    return row
  }

  deleteRecord(id: string): void {
    this.db.prepare(`UPDATE care_record SET deleted_at=?, updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id)
  }

  /** 护理工作量统计 */
  getWorkloadStats(startDate: string, endDate: string): { executor: string; count: number }[] {
    return this.db
      .prepare<[string, string], { executor: string; count: number }>(
        `SELECT executor, COUNT(*) as count FROM care_record
         WHERE date(record_date) >= date(?) AND date(record_date) <= date(?) AND deleted_at IS NULL AND executor IS NOT NULL
         GROUP BY executor ORDER BY count DESC`
      )
      .all(startDate, endDate) as { executor: string; count: number }[]
  }
}
