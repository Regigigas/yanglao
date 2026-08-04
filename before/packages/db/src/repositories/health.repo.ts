// packages/db/src/repositories/health.repo.ts
// 健康档案/生命体征/用药/就医仓库

import type { Database } from 'better-sqlite3'
import { nanoid } from 'nanoid'
import type {
  HealthProfileRow,
  VitalSignsRow,
  MedicationOrderRow,
  MedicationRecordRow,
  MedicalVisitRow,
  HealthExamAppointmentRow,
  HealthExamResultRow,
} from '../schema'

export class HealthRepo {
  constructor(private db: Database) {}

  // ─── 健康档案 ──────────────────────────────────────────────
  findProfile(elderlyId: string): HealthProfileRow | null {
    return (
      (this.db.prepare<[string], HealthProfileRow>(`SELECT * FROM health_profile WHERE elderly_id=?`).get(elderlyId) as HealthProfileRow | undefined) ?? null
    )
  }

  upsertProfile(elderlyId: string, data: Omit<HealthProfileRow, 'id' | 'elderly_id' | 'created_at' | 'updated_at'>): HealthProfileRow {
    const now = Date.now()
    const existing = this.findProfile(elderlyId)
    if (existing) {
      const fields = Object.keys(data)
      if (fields.length) {
        const sets = [...fields, 'updated_at'].map(f => `${f}=@${f}`).join(',')
        this.db.prepare(`UPDATE health_profile SET ${sets} WHERE elderly_id=@elderly_id`).run({ ...data, updated_at: now, elderly_id: elderlyId })
      }
      return { ...existing, ...data, updated_at: now }
    }
    const row: HealthProfileRow = { ...data, id: nanoid(), elderly_id: elderlyId, created_at: now, updated_at: now }
    this.db
      .prepare(
        `INSERT INTO health_profile (id,elderly_id,blood_type,allergy,chronic_disease,surgery_history,family_history,disability,diet_require,remark,created_at,updated_at)
         VALUES (@id,@elderly_id,@blood_type,@allergy,@chronic_disease,@surgery_history,@family_history,@disability,@diet_require,@remark,@created_at,@updated_at)`
      )
      .run(row)
    return row
  }

  // ─── 生命体征 ──────────────────────────────────────────────
  findVitalSigns(elderlyId: string, limit = 30): VitalSignsRow[] {
    return this.db
      .prepare<[string, number], VitalSignsRow>(
        `SELECT * FROM vital_signs WHERE elderly_id=? AND deleted_at IS NULL ORDER BY record_date DESC, record_time DESC LIMIT ?`
      )
      .all(elderlyId, limit) as VitalSignsRow[]
  }

  insertVitalSigns(data: Omit<VitalSignsRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): VitalSignsRow {
    const now = Date.now()
    const row: VitalSignsRow = { ...data, id: nanoid(), created_at: now, updated_at: now, deleted_at: null }
    this.db
      .prepare(
        `INSERT INTO vital_signs (id,elderly_id,record_date,record_time,temperature,pulse,respiration,systolic_bp,diastolic_bp,blood_sugar,weight,spo2,recorder,remark,created_at,updated_at,deleted_at)
         VALUES (@id,@elderly_id,@record_date,@record_time,@temperature,@pulse,@respiration,@systolic_bp,@diastolic_bp,@blood_sugar,@weight,@spo2,@recorder,@remark,@created_at,@updated_at,@deleted_at)`
      )
      .run(row)
    this.createVitalAlerts(row)
    return row
  }

  /** 将明显异常的体征写入独立预警队列，后续必须由工作人员处置并关闭。 */
  private createVitalAlerts(vital: VitalSignsRow): void {
    const alerts: { type: string; severity: 'warning' | 'critical'; content: string }[] = []
    if (vital.temperature != null && (vital.temperature >= 37.5 || vital.temperature < 35)) {
      alerts.push({ type: 'temperature', severity: vital.temperature >= 38.5 || vital.temperature < 35 ? 'critical' : 'warning', content: `体温异常：${vital.temperature}℃` })
    }
    if (vital.systolic_bp != null && vital.systolic_bp >= 140) {
      alerts.push({ type: 'blood_pressure', severity: vital.systolic_bp >= 180 ? 'critical' : 'warning', content: `收缩压偏高：${vital.systolic_bp} mmHg` })
    }
    if (vital.diastolic_bp != null && vital.diastolic_bp >= 90) {
      alerts.push({ type: 'blood_pressure', severity: vital.diastolic_bp >= 110 ? 'critical' : 'warning', content: `舒张压偏高：${vital.diastolic_bp} mmHg` })
    }
    if (vital.spo2 != null && vital.spo2 < 95) {
      alerts.push({ type: 'spo2', severity: vital.spo2 < 90 ? 'critical' : 'warning', content: `血氧饱和度偏低：${vital.spo2}%` })
    }
    if (vital.blood_sugar != null && (vital.blood_sugar <= 3.9 || vital.blood_sugar >= 11.1)) {
      alerts.push({ type: 'blood_sugar', severity: vital.blood_sugar <= 3 || vital.blood_sugar >= 16.7 ? 'critical' : 'warning', content: `血糖异常：${vital.blood_sugar} mmol/L` })
    }
    if (!alerts.length) return
    const insert = this.db.prepare(
      `INSERT INTO health_alert (id,elderly_id,vital_id,alert_type,severity,content,status,opened_at,resolved_at,resolver,resolution)
       VALUES (@id,@elderly_id,@vital_id,@alert_type,@severity,@content,'open',@opened_at,NULL,NULL,NULL)`,
    )
    const now = Date.now()
    const write = this.db.transaction(() => {
      for (const alert of alerts) {
        insert.run({ id: nanoid(), elderly_id: vital.elderly_id, vital_id: vital.id, ...alert, opened_at: now })
      }
    })
    write()
  }

  deleteVitalSigns(id: string): void {
    this.db.prepare(`UPDATE vital_signs SET deleted_at=?, updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id)
  }

  // ─── 用药医嘱 ──────────────────────────────────────────────
  findMedOrders(elderlyId: string, activeOnly = false): MedicationOrderRow[] {
    const sql = activeOnly
      ? `SELECT * FROM medication_order WHERE elderly_id=? AND deleted_at IS NULL AND status='active' ORDER BY created_at DESC`
      : `SELECT * FROM medication_order WHERE elderly_id=? AND deleted_at IS NULL ORDER BY created_at DESC`
    return this.db.prepare<[string], MedicationOrderRow>(sql).all(elderlyId) as MedicationOrderRow[]
  }

  insertMedOrder(data: Omit<MedicationOrderRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): MedicationOrderRow {
    const now = Date.now()
    const row: MedicationOrderRow = { ...data, id: nanoid(), created_at: now, updated_at: now, deleted_at: null }
    this.db
      .prepare(
        `INSERT INTO medication_order (id,elderly_id,drug_name,drug_spec,dosage,frequency,route,start_date,end_date,prescriber,status,remark,created_at,updated_at,deleted_at)
         VALUES (@id,@elderly_id,@drug_name,@drug_spec,@dosage,@frequency,@route,@start_date,@end_date,@prescriber,@status,@remark,@created_at,@updated_at,@deleted_at)`
      )
      .run(row)
    return row
  }

  updateMedOrder(id: string, data: Partial<Omit<MedicationOrderRow, 'id' | 'created_at' | 'deleted_at'>>): void {
    const now = Date.now()
    const fields = Object.keys(data)
    if (!fields.length) return
    const sets = [...fields, 'updated_at'].map(f => `${f}=@${f}`).join(',')
    this.db.prepare(`UPDATE medication_order SET ${sets} WHERE id=@id`).run({ ...data, updated_at: now, id })
  }

  deleteMedOrder(id: string): void {
    this.db.prepare(`UPDATE medication_order SET deleted_at=?, updated_at=?, status='stopped' WHERE id=?`).run(Date.now(), Date.now(), id)
  }

  // ─── 服药记录 ──────────────────────────────────────────────
  // take_date 现在存储为 'YYYY-MM-DD HH:mm:ss'，用 date() 只取日期部分比较
  findMedRecords(elderlyId: string, date?: string): MedicationRecordRow[] {
    if (date) {
      return this.db
        .prepare<[string, string], MedicationRecordRow>(
          `SELECT * FROM medication_record WHERE elderly_id=? AND date(take_date)=date(?) AND deleted_at IS NULL ORDER BY take_time`
        )
        .all(elderlyId, date) as MedicationRecordRow[]
    }
    return this.db
      .prepare<[string], MedicationRecordRow>(
        `SELECT * FROM medication_record WHERE elderly_id=? AND deleted_at IS NULL ORDER BY take_date DESC, take_time DESC LIMIT 60`
      )
      .all(elderlyId) as MedicationRecordRow[]
  }

  insertMedRecord(data: Omit<MedicationRecordRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): MedicationRecordRow {
    const now = Date.now()
    const row: MedicationRecordRow = { ...data, id: nanoid(), created_at: now, updated_at: now, deleted_at: null }
    this.db
      .prepare(
        `INSERT INTO medication_record (id,elderly_id,order_id,take_date,take_time,shift,status,executor,remark,created_at,updated_at,deleted_at)
         VALUES (@id,@elderly_id,@order_id,@take_date,@take_time,@shift,@status,@executor,@remark,@created_at,@updated_at,@deleted_at)`
      )
      .run(row)
    return row
  }

  // ─── 就医记录 ──────────────────────────────────────────────
  findMedVisits(elderlyId: string): MedicalVisitRow[] {
    return this.db
      .prepare<[string], MedicalVisitRow>(
        `SELECT * FROM medical_visit WHERE elderly_id=? AND deleted_at IS NULL ORDER BY visit_date DESC`
      )
      .all(elderlyId) as MedicalVisitRow[]
  }

  insertMedVisit(data: Omit<MedicalVisitRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): MedicalVisitRow {
    const now = Date.now()
    const row: MedicalVisitRow = { ...data, id: nanoid(), created_at: now, updated_at: now, deleted_at: null }
    this.db
      .prepare(
        `INSERT INTO medical_visit (id,elderly_id,visit_date,hospital,department,doctor,diagnosis,treatment,cost,escort,remark,created_at,updated_at,deleted_at)
         VALUES (@id,@elderly_id,@visit_date,@hospital,@department,@doctor,@diagnosis,@treatment,@cost,@escort,@remark,@created_at,@updated_at,@deleted_at)`
      )
      .run(row)
    return row
  }

  deleteMedVisit(id: string): void {
    this.db.prepare(`UPDATE medical_visit SET deleted_at=?, updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id)
  }

  // ─── 体检预约 ──────────────────────────────────────────────
  findExamAppointments(elderlyId?: string): HealthExamAppointmentRow[] {
    if (elderlyId) {
      return this.db
        .prepare<[string], HealthExamAppointmentRow>(
          `SELECT * FROM health_exam_appointment WHERE elderly_id=? AND deleted_at IS NULL ORDER BY exam_date DESC`
        )
        .all(elderlyId) as HealthExamAppointmentRow[]
    }
    return this.db
      .prepare<[], HealthExamAppointmentRow>(
        `SELECT * FROM health_exam_appointment WHERE deleted_at IS NULL ORDER BY exam_date DESC`
      )
      .all() as HealthExamAppointmentRow[]
  }

  insertExamAppointment(data: Omit<HealthExamAppointmentRow, 'id' | 'status' | 'created_at' | 'updated_at' | 'deleted_at'>): HealthExamAppointmentRow {
    const now = Date.now()
    const row: HealthExamAppointmentRow = { ...data, id: nanoid(), status: 'pending', created_at: now, updated_at: now, deleted_at: null }
    this.db
      .prepare(
        `INSERT INTO health_exam_appointment (id,elderly_id,exam_date,institution,exam_items,status,remark,created_by,created_at,updated_at,deleted_at)
         VALUES (@id,@elderly_id,@exam_date,@institution,@exam_items,@status,@remark,@created_by,@created_at,@updated_at,@deleted_at)`
      )
      .run(row)
    return row
  }

  updateExamAppointment(id: string, data: Partial<Omit<HealthExamAppointmentRow, 'id' | 'created_at' | 'deleted_at'>>): void {
    const now = Date.now()
    const fields = Object.keys(data)
    if (!fields.length) return
    const sets = [...fields, 'updated_at'].map(f => `${f}=@${f}`).join(',')
    this.db.prepare(`UPDATE health_exam_appointment SET ${sets} WHERE id=@id`).run({ ...data, updated_at: now, id })
  }

  deleteExamAppointment(id: string): void {
    this.db.prepare(`UPDATE health_exam_appointment SET deleted_at=?, updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id)
  }

  // ─── 体检结果 ──────────────────────────────────────────────
  findExamResults(elderlyId?: string): HealthExamResultRow[] {
    if (elderlyId) {
      return this.db
        .prepare<[string], HealthExamResultRow>(
          `SELECT * FROM health_exam_result WHERE elderly_id=? AND deleted_at IS NULL ORDER BY exam_date DESC`
        )
        .all(elderlyId) as HealthExamResultRow[]
    }
    return this.db
      .prepare<[], HealthExamResultRow>(
        `SELECT * FROM health_exam_result WHERE deleted_at IS NULL ORDER BY exam_date DESC`
      )
      .all() as HealthExamResultRow[]
  }

  insertExamResult(data: Omit<HealthExamResultRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): HealthExamResultRow {
    const now = Date.now()
    const row: HealthExamResultRow = { ...data, id: nanoid(), created_at: now, updated_at: now, deleted_at: null }
    if (row.appointment_id) {
      const appointment = this.db
        .prepare<[string], HealthExamAppointmentRow>(`SELECT * FROM health_exam_appointment WHERE id=? AND deleted_at IS NULL`)
        .get(row.appointment_id)
      if (!appointment || appointment.status !== 'pending') throw new Error('该体检预约不可录入结果')
      if (appointment.elderly_id !== row.elderly_id) throw new Error('体检结果与预约老人不一致')
    }
    this.db
      .prepare(
        `INSERT INTO health_exam_result (id,elderly_id,appointment_id,exam_date,institution,items,conclusion,attachment_path,created_by,created_at,updated_at,deleted_at)
         VALUES (@id,@elderly_id,@appointment_id,@exam_date,@institution,@items,@conclusion,@attachment_path,@created_by,@created_at,@updated_at,@deleted_at)`
      )
      .run(row)
    // 若结果关联了预约，自动将预约状态置为已完成
    if (row.appointment_id) {
      this.updateExamAppointment(row.appointment_id, { status: 'completed' })
    }
    return row
  }

  updateExamResult(
    id: string,
    data: Partial<Pick<HealthExamResultRow, 'exam_date' | 'institution' | 'items' | 'conclusion' | 'attachment_path'>>
  ): void {
    const fields = Object.keys(data)
    if (!fields.length) return
    const now = Date.now()
    const sets = [...fields, 'updated_at'].map(field => `${field}=@${field}`).join(',')
    this.db.prepare(`UPDATE health_exam_result SET ${sets} WHERE id=@id AND deleted_at IS NULL`).run({ ...data, updated_at: now, id })
  }

  deleteExamResult(id: string): void {
    const result = this.db
      .prepare<[string], HealthExamResultRow>(`SELECT * FROM health_exam_result WHERE id=? AND deleted_at IS NULL`)
      .get(id)
    if (!result) return

    const now = Date.now()
    const remove = this.db.transaction(() => {
      this.db.prepare(`UPDATE health_exam_result SET deleted_at=?, updated_at=? WHERE id=?`).run(now, now, id)
      if (result.appointment_id) {
        const remaining = this.db
          .prepare<[string], { count: number }>(
            `SELECT COUNT(*) AS count FROM health_exam_result WHERE appointment_id=? AND deleted_at IS NULL`
          )
          .get(result.appointment_id)
        if (!remaining?.count) {
          this.db.prepare(`UPDATE health_exam_appointment SET status='pending', updated_at=? WHERE id=? AND status='completed'`).run(now, result.appointment_id)
        }
      }
    })
    remove()
  }
}
