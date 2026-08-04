// packages/db/src/repositories/activity.repo.ts
// 活动管理仓库

import type { Database } from 'better-sqlite3'
import { nanoid } from 'nanoid'
import type { ActivityRow, ActivityAttendanceRow } from '../schema'

export class ActivityRepo {
  constructor(private db: Database) {}

  findAll(status?: string): ActivityRow[] {
    if (status) {
      return this.db
        .prepare<[string], ActivityRow>(`SELECT * FROM activity WHERE deleted_at IS NULL AND status=? ORDER BY activity_date DESC`)
        .all(status) as ActivityRow[]
    }
    return this.db
      .prepare<[], ActivityRow>(`SELECT * FROM activity WHERE deleted_at IS NULL ORDER BY activity_date DESC`)
      .all() as ActivityRow[]
  }

  findById(id: string): ActivityRow | null {
    return (this.db.prepare<[string], ActivityRow>(`SELECT * FROM activity WHERE id=?`).get(id) as ActivityRow | undefined) ?? null
  }

  insert(data: Omit<ActivityRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): ActivityRow {
    this.validateCapacity(data.max_capacity)
    const now = Date.now()
    const row: ActivityRow = { ...data, id: nanoid(), created_at: now, updated_at: now, deleted_at: null }
    this.db
      .prepare(`INSERT INTO activity (id,title,category,activity_date,start_time,end_time,location,organizer,max_capacity,description,status,created_by,created_at,updated_at,deleted_at)
        VALUES (@id,@title,@category,@activity_date,@start_time,@end_time,@location,@organizer,@max_capacity,@description,@status,@created_by,@created_at,@updated_at,@deleted_at)`)
      .run(row)
    return row
  }

  update(id: string, data: Partial<Omit<ActivityRow, 'id' | 'created_at' | 'deleted_at'>>): void {
    const now = Date.now()
    const fields = Object.keys(data)
    if (!fields.length) return
    if (data.max_capacity !== undefined) {
      this.validateCapacity(data.max_capacity)
      if (data.max_capacity !== null) {
        const attendanceCount = this.getAttendanceCount(id)
        if (attendanceCount > data.max_capacity) throw new Error('人数上限不能低于当前报名人数')
      }
    }
    const sets = [...fields, 'updated_at'].map(f => `${f}=@${f}`).join(',')
    this.db.prepare(`UPDATE activity SET ${sets} WHERE id=@id`).run({ ...data, updated_at: now, id })
  }

  softDelete(id: string): void {
    this.db.prepare(`UPDATE activity SET deleted_at=?, updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id)
  }

  start(id: string): void {
    this.changeStatus(id, 'planned', 'ongoing')
  }

  cancel(id: string): void {
    this.changeStatus(id, ['planned', 'ongoing'], 'cancelled')
  }

  complete(id: string): void {
    const complete = this.db.transaction((activityId: string) => {
      this.changeStatus(activityId, 'ongoing', 'completed')
      this.db
        .prepare(`UPDATE activity_attendance SET status='absent', updated_at=? WHERE activity_id=? AND status='registered'`)
        .run(Date.now(), activityId)
    })
    complete(id)
  }

  private changeStatus(
    id: string,
    currentStatus: ActivityRow['status'] | ActivityRow['status'][],
    nextStatus: ActivityRow['status'],
  ): void {
    const acceptedStatuses = Array.isArray(currentStatus) ? currentStatus : [currentStatus]
    const activity = this.findById(id)
    if (!activity || activity.deleted_at) throw new Error('活动不存在或已删除')
    if (!acceptedStatuses.includes(activity.status)) throw new Error('当前活动状态不支持此操作')
    this.update(id, { status: nextStatus })
  }

  private validateCapacity(capacity: number | null): void {
    if (capacity !== null && (!Number.isInteger(capacity) || capacity < 1)) {
      throw new Error('人数上限必须为大于零的整数')
    }
  }

  private getAttendanceCount(activityId: string): number {
    return this.db
      .prepare<[string], { count: number }>(`SELECT COUNT(*) AS count FROM activity_attendance WHERE activity_id=?`)
      .get(activityId)?.count ?? 0
  }

  // ─── 签到 ──────────────────────────────────────────────────
  findAttendance(activityId: string): ActivityAttendanceRow[] {
    return this.db
      .prepare<[string], ActivityAttendanceRow>(`SELECT * FROM activity_attendance WHERE activity_id=? ORDER BY created_at`)
      .all(activityId) as ActivityAttendanceRow[]
  }

  findElderlyActivities(elderlyId: string): ActivityAttendanceRow[] {
    return this.db
      .prepare<[string], ActivityAttendanceRow>(`SELECT * FROM activity_attendance WHERE elderly_id=? ORDER BY created_at DESC`)
      .all(elderlyId) as ActivityAttendanceRow[]
  }

  registerAttendance(activityId: string, elderlyId: string): ActivityAttendanceRow {
    const activity = this.findById(activityId)
    if (!activity || activity.deleted_at) throw new Error('活动不存在或已删除')
    if (activity.status !== 'planned' && activity.status !== 'ongoing') throw new Error('当前活动不可报名')

    const existing = this.db
      .prepare<[string, string], ActivityAttendanceRow>(`SELECT * FROM activity_attendance WHERE activity_id=? AND elderly_id=?`)
      .get(activityId, elderlyId)
    if (existing) throw new Error('该老人已报名此活动')

    if (activity.max_capacity !== null) {
      const count = this.getAttendanceCount(activityId)
      if (count >= activity.max_capacity) throw new Error('活动报名人数已满')
    }

    const now = Date.now()
    const row: ActivityAttendanceRow = {
      id: nanoid(), activity_id: activityId, elderly_id: elderlyId,
      check_in_at: null, status: 'registered', remark: null,
      created_at: now, updated_at: now,
    }
    this.db
      .prepare(`INSERT INTO activity_attendance (id,activity_id,elderly_id,check_in_at,status,remark,created_at,updated_at)
        VALUES (@id,@activity_id,@elderly_id,@check_in_at,@status,@remark,@created_at,@updated_at)`)
      .run(row)
    return row
  }

  checkIn(activityId: string, elderlyId: string): void {
    this.ensureOngoing(activityId)
    const now = Date.now()
    const result = this.db.prepare(`UPDATE activity_attendance SET status='attended', check_in_at=?, updated_at=? WHERE activity_id=? AND elderly_id=? AND status='registered'`)
      .run(now, now, activityId, elderlyId)
    if (!result.changes) throw new Error('该报名记录不能签到')
  }

  markAbsent(activityId: string, elderlyId: string): void {
    this.ensureOngoing(activityId)
    const result = this.db.prepare(`UPDATE activity_attendance SET status='absent', updated_at=? WHERE activity_id=? AND elderly_id=? AND status='registered'`)
      .run(Date.now(), activityId, elderlyId)
    if (!result.changes) throw new Error('该报名记录不能标记为缺席')
  }

  removeAttendance(activityId: string, elderlyId: string): void {
    const activity = this.findById(activityId)
    if (!activity || activity.deleted_at || (activity.status !== 'planned' && activity.status !== 'ongoing')) {
      throw new Error('当前活动不可移除参与者')
    }
    const result = this.db.prepare(`DELETE FROM activity_attendance WHERE activity_id=? AND elderly_id=? AND status='registered'`)
      .run(activityId, elderlyId)
    if (!result.changes) throw new Error('该报名记录不能移除')
  }

  private ensureOngoing(activityId: string): void {
    const activity = this.findById(activityId)
    if (!activity || activity.deleted_at || activity.status !== 'ongoing') throw new Error('活动尚未开始或已结束')
  }
}
