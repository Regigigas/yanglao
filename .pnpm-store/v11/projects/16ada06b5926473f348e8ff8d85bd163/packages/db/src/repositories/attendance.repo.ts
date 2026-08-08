// packages/db/src/repositories/attendance.repo.ts
// 考勤仓库：班次 / 排班 / 打卡 / 请假

import type { Database } from 'better-sqlite3'
import { nanoid } from 'nanoid'
import type { ShiftRow, WorkShiftRule, ScheduleRow, AttendanceRow, LeaveApplicationRow } from '../schema'

export class AttendanceRepo {
  constructor(private db: Database) {}

  // ─── 班次 ─────────────────────────────────────────────────
  findAllShifts(): ShiftRow[] {
    return this.db
      .prepare<[], ShiftRow>(`SELECT * FROM sys_shift WHERE deleted_at IS NULL ORDER BY start_time`)
      .all() as ShiftRow[]
  }

  insertShift(data: Omit<ShiftRow, 'id' | 'is_default' | 'created_at' | 'updated_at' | 'deleted_at'>): ShiftRow {
    const now = Date.now()
    const hasActiveShift = (this.db
      .prepare<[], { count: number }>(`SELECT COUNT(*) AS count FROM sys_shift WHERE deleted_at IS NULL`)
      .get()?.count ?? 0) > 0
    const row: ShiftRow = {
      ...data,
      id: nanoid(),
      is_default: hasActiveShift ? 0 : 1,
      created_at: now,
      updated_at: now,
      deleted_at: null,
    }
    this.db
      .prepare(
        `INSERT INTO sys_shift (id,name,start_time,end_time,is_default,remark,created_at,updated_at,deleted_at)
         VALUES (@id,@name,@start_time,@end_time,@is_default,@remark,@created_at,@updated_at,@deleted_at)`
      )
      .run(row)
    return row
  }

  updateShift(id: string, data: Partial<Omit<ShiftRow, 'id' | 'is_default' | 'created_at' | 'deleted_at'>>): void {
    const now = Date.now()
    const fields = Object.keys(data)
    if (!fields.length) return
    const sets = [...fields, 'updated_at'].map(f => `${f}=@${f}`).join(',')
    this.db.prepare(`UPDATE sys_shift SET ${sets} WHERE id=@id`).run({ ...data, updated_at: now, id })
  }

  setDefaultShift(id: string): void {
    const shift = this.db
      .prepare<[string], ShiftRow>(`SELECT * FROM sys_shift WHERE id=? AND deleted_at IS NULL`)
      .get(id)
    if (!shift) throw new Error('班次不存在或已删除')

    this.db.transaction(() => {
      const now = Date.now()
      this.db.prepare(`UPDATE sys_shift SET is_default=0, updated_at=? WHERE is_default=1 AND deleted_at IS NULL`).run(now)
      this.db.prepare(`UPDATE sys_shift SET is_default=1, updated_at=? WHERE id=?`).run(now, id)
    })()
  }

  deleteShift(id: string): void {
    const shift = this.db
      .prepare<[string], ShiftRow>(`SELECT * FROM sys_shift WHERE id=? AND deleted_at IS NULL`)
      .get(id)
    if (!shift) return

    const activeCount = this.db
      .prepare<[], { count: number }>(`SELECT COUNT(*) AS count FROM sys_shift WHERE deleted_at IS NULL`)
      .get()?.count ?? 0
    if (activeCount <= 1) throw new Error('至少需要保留一个班次作为默认上班时间')

    this.db.transaction(() => {
      const now = Date.now()
      this.db.prepare(`UPDATE sys_shift SET deleted_at=?, updated_at=? WHERE id=?`).run(now, now, id)
      if (shift.is_default) {
        const next = this.db
          .prepare<[], ShiftRow>(`SELECT * FROM sys_shift WHERE deleted_at IS NULL ORDER BY start_time, created_at LIMIT 1`)
          .get()
        if (next) this.db.prepare(`UPDATE sys_shift SET is_default=1, updated_at=? WHERE id=?`).run(now, next.id)
      }
    })()
  }

  resolveWorkShift(userId: string, workDate: string): WorkShiftRule | null {
    const scheduledShift = this.db
      .prepare<[string, string], ShiftRow>(
        `SELECT shift.*
         FROM sys_schedule schedule
         JOIN sys_shift shift ON shift.id = schedule.shift_id AND shift.deleted_at IS NULL
         WHERE schedule.user_id=? AND schedule.work_date=? AND schedule.deleted_at IS NULL
         ORDER BY shift.start_time, schedule.created_at
         LIMIT 1`
      )
      .get(userId, workDate)
    if (scheduledShift) return { shift: scheduledShift, source: 'schedule' }

    const defaultShift = this.db
      .prepare<[], ShiftRow>(
        `SELECT * FROM sys_shift
         WHERE deleted_at IS NULL
         ORDER BY is_default DESC, start_time, created_at
         LIMIT 1`
      )
      .get()
    return defaultShift ? { shift: defaultShift, source: 'default' } : null
  }

  // ─── 排班 ─────────────────────────────────────────────────
  findSchedules(startDate: string, endDate: string, userId?: string): ScheduleRow[] {
    if (userId) {
      return this.db
        .prepare<[string, string, string], ScheduleRow>(
          `SELECT * FROM sys_schedule WHERE deleted_at IS NULL AND user_id=? AND date(work_date) >= date(?) AND date(work_date) <= date(?) ORDER BY work_date`
        )
        .all(userId, startDate, endDate) as ScheduleRow[]
    }
    return this.db
      .prepare<[string, string], ScheduleRow>(
        `SELECT * FROM sys_schedule WHERE deleted_at IS NULL AND date(work_date) >= date(?) AND date(work_date) <= date(?) ORDER BY work_date, user_id`
      )
      .all(startDate, endDate) as ScheduleRow[]
  }

  insertSchedule(data: Omit<ScheduleRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): ScheduleRow {
    const now = Date.now()
    const row: ScheduleRow = { ...data, id: nanoid(), created_at: now, updated_at: now, deleted_at: null }
    this.db
      .prepare(
        `INSERT INTO sys_schedule (id,user_id,shift_id,work_date,remark,task_type,task_target,created_at,updated_at,deleted_at)
         VALUES (@id,@user_id,@shift_id,@work_date,@remark,@task_type,@task_target,@created_at,@updated_at,@deleted_at)`
      )
      .run(row)
    return row
  }

  updateSchedule(id: string, data: Partial<Omit<ScheduleRow, 'id' | 'created_at' | 'deleted_at'>>): void {
    const now = Date.now()
    const fields = Object.keys(data)
    if (!fields.length) return
    const sets = [...fields, 'updated_at'].map(f => `${f}=@${f}`).join(',')
    this.db.prepare(`UPDATE sys_schedule SET ${sets} WHERE id=@id`).run({ ...data, updated_at: now, id })
  }

  findScheduleById(id: string): ScheduleRow | null {
    return (
      (this.db.prepare<[string], ScheduleRow>(`SELECT * FROM sys_schedule WHERE id=?`).get(id) as ScheduleRow | undefined) ?? null
    )
  }

  deleteSchedule(id: string): void {
    this.db.prepare(`UPDATE sys_schedule SET deleted_at=?, updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id)
  }

  // ─── 打卡 ─────────────────────────────────────────────────
  /** 查询某用户某天的打卡记录（用于判断今天是否已上/下班打卡） */
  findTodayAttendance(userId: string, date: string): AttendanceRow[] {
    return this.db
      .prepare<[string, string], AttendanceRow>(
        `SELECT * FROM sys_attendance WHERE user_id=? AND clock_date=? ORDER BY clock_at`
      )
      .all(userId, date) as AttendanceRow[]
  }

  findAttendanceByRange(startDate: string, endDate: string, userId?: string): AttendanceRow[] {
    if (userId) {
      return this.db
        .prepare<[string, string, string], AttendanceRow>(
          `SELECT * FROM sys_attendance WHERE user_id=? AND date(clock_date) >= date(?) AND date(clock_date) <= date(?) ORDER BY clock_date, clock_at`
        )
        .all(userId, startDate, endDate) as AttendanceRow[]
    }
    return this.db
      .prepare<[string, string], AttendanceRow>(
        `SELECT * FROM sys_attendance WHERE date(clock_date) >= date(?) AND date(clock_date) <= date(?) ORDER BY clock_date, user_id, clock_at`
      )
      .all(startDate, endDate) as AttendanceRow[]
  }

  insertAttendance(data: Omit<AttendanceRow, 'id' | 'created_at' | 'updated_at'>): AttendanceRow {
    const now = Date.now()
    const row: AttendanceRow = { ...data, id: nanoid(), created_at: now, updated_at: now }
    this.db
      .prepare(
        `INSERT INTO sys_attendance (id,user_id,clock_date,clock_type,clock_at,status,remark,created_at,updated_at)
         VALUES (@id,@user_id,@clock_date,@clock_type,@clock_at,@status,@remark,@created_at,@updated_at)`
      )
      .run(row)
    return row
  }

  // ─── 请假 ─────────────────────────────────────────────────
  findLeaves(userId?: string, status?: string): LeaveApplicationRow[] {
    const conditions: string[] = ['deleted_at IS NULL']
    const params: string[] = []
    if (userId) { conditions.push('user_id=?'); params.push(userId) }
    if (status) { conditions.push('status=?'); params.push(status) }
    return this.db
      .prepare<string[], LeaveApplicationRow>(
        `SELECT * FROM sys_leave WHERE ${conditions.join(' AND ')} ORDER BY created_at DESC`
      )
      .all(...params) as LeaveApplicationRow[]
  }

  insertLeave(data: Omit<LeaveApplicationRow, 'id' | 'status' | 'approver_id' | 'approve_remark' | 'created_at' | 'updated_at' | 'deleted_at'>): LeaveApplicationRow {
    const now = Date.now()
    const row: LeaveApplicationRow = {
      ...data,
      id: nanoid(),
      status: 'pending',
      approver_id: null,
      approve_remark: null,
      created_at: now,
      updated_at: now,
      deleted_at: null,
    }
    this.db
      .prepare(
        `INSERT INTO sys_leave (id,user_id,leave_type,start_date,end_date,reason,status,approver_id,approve_remark,created_at,updated_at,deleted_at)
         VALUES (@id,@user_id,@leave_type,@start_date,@end_date,@reason,@status,@approver_id,@approve_remark,@created_at,@updated_at,@deleted_at)`
      )
      .run(row)
    return row
  }

  approveLeave(id: string, approverId: string, approved: boolean, remark?: string): void {
    const now = Date.now()
    this.db
      .prepare(`UPDATE sys_leave SET status=?, approver_id=?, approve_remark=?, updated_at=? WHERE id=?`)
      .run(approved ? 'approved' : 'rejected', approverId, remark ?? null, now, id)
  }
}
