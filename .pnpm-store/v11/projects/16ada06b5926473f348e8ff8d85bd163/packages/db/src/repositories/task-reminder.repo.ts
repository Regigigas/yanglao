// packages/db/src/repositories/task-reminder.repo.ts
// 任务提醒仓库（闹钟式提醒：可自建，也可由有权限的角色分配给其他用户，支持每日/每周/每月重复）

import type { Database } from 'better-sqlite3'
import { nanoid } from 'nanoid'
import type { TaskReminderRow } from '../schema'
import { ChangeLogRepo } from './change-log.repo'

export class TaskReminderRepo {
  private changeLog: ChangeLogRepo

  constructor(private db: Database) {
    this.changeLog = new ChangeLogRepo(db)
  }

  /** 查询某用户负责的全部提醒（含自己创建给自己的），默认不含已取消 */
  findByAssignee(userId: string, includeInactive = false): TaskReminderRow[] {
    const sql = includeInactive
      ? `SELECT * FROM task_reminder WHERE assignee_id=? AND deleted_at IS NULL ORDER BY remind_date DESC, remind_at DESC`
      : `SELECT * FROM task_reminder WHERE assignee_id=? AND deleted_at IS NULL AND status='active' ORDER BY remind_date DESC, remind_at DESC`
    return this.db.prepare<[string], TaskReminderRow>(sql).all(userId) as TaskReminderRow[]
  }

  /** 查询某用户创建的全部提醒（用于"我分配的任务"列表） */
  findByCreator(userId: string): TaskReminderRow[] {
    return this.db
      .prepare<[string], TaskReminderRow>(
        `SELECT * FROM task_reminder WHERE creator_id=? AND deleted_at IS NULL ORDER BY created_at DESC`
      )
      .all(userId) as TaskReminderRow[]
  }

  findById(id: string): TaskReminderRow | null {
    return (
      (this.db.prepare<[string], TaskReminderRow>(`SELECT * FROM task_reminder WHERE id=?`).get(id) as
        | TaskReminderRow
        | undefined) ?? null
    )
  }

  /** 查询关联某维修事项的提醒，用于保证维修同步时不会重复建任务。 */
  findByMaintenanceAlertId(alertId: string): TaskReminderRow | null {
    return (
      (this.db
        .prepare<[string], TaskReminderRow>(
          `SELECT * FROM task_reminder WHERE maintenance_alert_id=? AND deleted_at IS NULL LIMIT 1`,
        )
        .get(alertId) as TaskReminderRow | undefined) ?? null
    )
  }

  /** 所有活跃状态的提醒（供主进程定时扫描到期提醒使用，跨用户） */
  findAllActive(): TaskReminderRow[] {
    return this.db
      .prepare<[], TaskReminderRow>(
        `SELECT * FROM task_reminder WHERE deleted_at IS NULL AND status='active' ORDER BY remind_at`
      )
      .all() as TaskReminderRow[]
  }

  /** 根据排班 ID 查找关联的活跃提醒（用于排班列表显示铃铛图标） */
  findByScheduleId(scheduleId: string): TaskReminderRow | null {
    return (
      (this.db
        .prepare<[string], TaskReminderRow>(
          `SELECT * FROM task_reminder WHERE schedule_id=? AND deleted_at IS NULL AND status='active' LIMIT 1`
        )
        .get(scheduleId) as TaskReminderRow | undefined) ?? null
    )
  }

  /** 根据多个排班 ID 批量查找关联的提醒，返回 map<scheduleId, reminder> */
  findByScheduleIds(scheduleIds: string[]): Map<string, TaskReminderRow> {
    if (!scheduleIds.length) return new Map()
    const placeholders = scheduleIds.map(() => '?').join(',')
    const rows = this.db
      .prepare<string[], TaskReminderRow>(
        `SELECT * FROM task_reminder WHERE schedule_id IN (${placeholders}) AND deleted_at IS NULL AND status='active'`
      )
      .all(...scheduleIds) as TaskReminderRow[]
    const map = new Map<string, TaskReminderRow>()
    for (const row of rows) {
      if (row.schedule_id) map.set(row.schedule_id, row)
    }
    return map
  }

  insert(data: Omit<TaskReminderRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'last_triggered_at' | 'maintenance_alert_id'> & { maintenance_alert_id?: string | null }): TaskReminderRow {
    const now = Date.now()
    const row: TaskReminderRow = {
      ...data,
      id: nanoid(),
      maintenance_alert_id: data.maintenance_alert_id ?? null,
      last_triggered_at: null,
      created_at: now,
      updated_at: now,
      deleted_at: null,
    }
    this.db
      .prepare(
        `INSERT INTO task_reminder (id,title,description,remind_at,remind_date,repeat_type,repeat_days,creator_id,assignee_id,status,last_triggered_at,schedule_id,maintenance_alert_id,created_at,updated_at,deleted_at)
         VALUES (@id,@title,@description,@remind_at,@remind_date,@repeat_type,@repeat_days,@creator_id,@assignee_id,@status,@last_triggered_at,@schedule_id,@maintenance_alert_id,@created_at,@updated_at,@deleted_at)`
      )
      .run(row)

    this.changeLog.insert({
      table_name: 'task_reminder',
      record_id: row.id,
      operation: 'INSERT',
      payload: JSON.stringify(row),
    })
    return row
  }

  update(id: string, data: Partial<Omit<TaskReminderRow, 'id' | 'created_at' | 'deleted_at'>>): void {
    const now = Date.now()
    const fields = Object.keys(data)
    if (!fields.length) return
    const sets = [...fields, 'updated_at'].map(f => `${f}=@${f}`).join(',')
    this.db.prepare(`UPDATE task_reminder SET ${sets} WHERE id=@id`).run({ ...data, updated_at: now, id })

    this.changeLog.insert({
      table_name: 'task_reminder',
      record_id: id,
      operation: 'UPDATE',
      payload: JSON.stringify({ id, ...data, updated_at: now }),
    })
  }

  /** 记录本次触发时间，避免同一时刻重复弹出提醒 */
  markTriggered(id: string): void {
    const now = Date.now()
    this.db.prepare(`UPDATE task_reminder SET last_triggered_at=?, updated_at=? WHERE id=?`).run(now, now, id)
  }

  /** 标记完成（单次任务标记完成后不再触发；重复任务通常无需标记完成，由用户自行取消） */
  markDone(id: string): void {
    this.update(id, { status: 'done' })
  }

  cancel(id: string): void {
    this.update(id, { status: 'cancelled' })
  }

  softDelete(id: string): void {
    const now = Date.now()
    this.db.prepare(`UPDATE task_reminder SET deleted_at=?, updated_at=? WHERE id=?`).run(now, now, id)
    this.changeLog.insert({
      table_name: 'task_reminder',
      record_id: id,
      operation: 'DELETE',
      payload: JSON.stringify({ id, deleted_at: now }),
    })
  }
}
