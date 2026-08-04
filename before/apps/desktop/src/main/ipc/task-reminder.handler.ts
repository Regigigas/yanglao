// apps/desktop/src/main/ipc/task-reminder.handler.ts
// 任务提醒 IPC 处理器：CRUD + 到期扫描逻辑（供 main/index.ts 定时调用）

import type { IpcMain } from 'electron'
import type { TaskReminderRepo, TaskReminderRow } from '@yanglao/db'

export function registerTaskReminderHandlers(ipc: IpcMain, repo: TaskReminderRepo): void {
  ipc.handle('reminder:list-mine', (_e, userId: string, includeInactive?: boolean) => repo.findByAssignee(userId, includeInactive))
  ipc.handle('reminder:list-created', (_e, userId: string) => repo.findByCreator(userId))
  ipc.handle('reminder:get', (_e, id: string) => repo.findById(id))
  ipc.handle('reminder:by-schedule-ids', (_e, ids: string[]) => {
    const map = repo.findByScheduleIds(ids)
    // 将 Map 转为普通对象以便 IPC 序列化
    return Object.fromEntries(map)
  })
  ipc.handle('reminder:create', (_e, data) => repo.insert(data))
  ipc.handle('reminder:update', (_e, { id, data }) => { repo.update(id, data); return { ok: true } })
  ipc.handle('reminder:done', (_e, id: string) => { repo.markDone(id); return { ok: true } })
  ipc.handle('reminder:cancel', (_e, id: string) => { repo.cancel(id); return { ok: true } })
  ipc.handle('reminder:delete', (_e, id: string) => { repo.softDelete(id); return { ok: true } })
}

/** 判断某条提醒在"现在"这一分钟是否应当触发 */
function shouldTrigger(row: TaskReminderRow, now: Date): boolean {
  const pad = (n: number) => String(n).padStart(2, '0')
  const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
  const nowHHmm = `${pad(now.getHours())}:${pad(now.getMinutes())}`

  if (row.remind_at !== nowHHmm) return false
  if (row.remind_date > todayStr) return false // 尚未到起始日期

  // 防止同一天/同一次occurrence 内重复触发
  if (row.last_triggered_at) {
    const last = new Date(row.last_triggered_at)
    const lastStr = `${last.getFullYear()}-${pad(last.getMonth() + 1)}-${pad(last.getDate())}`
    if (lastStr === todayStr) return false
  }

  switch (row.repeat_type) {
    case 'none':
      return row.remind_date === todayStr
    case 'daily':
      return true
    case 'weekly': {
      const days: number[] = row.repeat_days ? JSON.parse(row.repeat_days) : []
      return days.includes(now.getDay())
    }
    case 'monthly': {
      const days: number[] = row.repeat_days ? JSON.parse(row.repeat_days) : []
      return days.includes(now.getDate())
    }
    default:
      return false
  }
}

/**
 * 扫描"当前登录用户"名下到期的提醒，返回应触发的记录并标记为已触发。
 * 注意：仅扫描当前登录用户负责的提醒，而非全库所有提醒——
 * 因为 last_triggered_at 会通过 change_log 同步到其他设备，若在未登录该用户的设备上
 * 提前标记触发，会导致该用户在自己设备登录后收不到本该收到的提醒。
 */
export function scanDueReminders(repo: TaskReminderRepo, assigneeId: string, now: Date = new Date()): TaskReminderRow[] {
  const active = repo.findByAssignee(assigneeId)
  const due: TaskReminderRow[] = []
  for (const row of active) {
    if (shouldTrigger(row, now)) {
      repo.markTriggered(row.id)
      due.push(row)
      // 单次（不重复）提醒触发后自动标记完成，避免第二天误触发
      if (row.repeat_type === 'none') {
        repo.markDone(row.id)
      }
    }
  }
  return due
}
