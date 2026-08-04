// apps/desktop/src/main/ipc/activity.handler.ts
import type { IpcMain } from 'electron'
import type { ActivityRepo } from '@yanglao/db'

export function registerActivityHandlers(ipc: IpcMain, repo: ActivityRepo): void {
  ipc.handle('activity:list', (_e, status?: string) => repo.findAll(status))
  ipc.handle('activity:get', (_e, id: string) => repo.findById(id))
  ipc.handle('activity:create', (_e, data) => repo.insert(data))
  ipc.handle('activity:update', (_e, { id, data }) => { repo.update(id, data); return { ok: true } })
  ipc.handle('activity:delete', (_e, id: string) => { repo.softDelete(id); return { ok: true } })
  ipc.handle('activity:start', (_e, id: string) => { repo.start(id); return { ok: true } })
  ipc.handle('activity:complete', (_e, id: string) => { repo.complete(id); return { ok: true } })
  ipc.handle('activity:cancel', (_e, id: string) => { repo.cancel(id); return { ok: true } })

  ipc.handle('activity:attendance:list', (_e, activityId: string) => repo.findAttendance(activityId))
  ipc.handle('activity:attendance:elderly', (_e, elderlyId: string) => repo.findElderlyActivities(elderlyId))
  ipc.handle('activity:attendance:register', (_e, activityId: string, elderlyId: string) => repo.registerAttendance(activityId, elderlyId))
  ipc.handle('activity:attendance:checkin', (_e, activityId: string, elderlyId: string) => { repo.checkIn(activityId, elderlyId); return { ok: true } })
  ipc.handle('activity:attendance:absent', (_e, activityId: string, elderlyId: string) => { repo.markAbsent(activityId, elderlyId); return { ok: true } })
  ipc.handle('activity:attendance:remove', (_e, activityId: string, elderlyId: string) => { repo.removeAttendance(activityId, elderlyId); return { ok: true } })
}
