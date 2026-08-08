// apps/desktop/src/main/ipc/health.handler.ts
import type { IpcMain } from 'electron'
import type { HealthRepo } from '@yanglao/db'

export function registerHealthHandlers(ipc: IpcMain, repo: HealthRepo): void {
  // 健康档案
  ipc.handle('health:profile:get', (_e, elderlyId: string) => repo.findProfile(elderlyId))
  ipc.handle('health:profile:save', (_e, { elderlyId, data }) => repo.upsertProfile(elderlyId, data))

  // 生命体征
  ipc.handle('health:vital:list', (_e, elderlyId: string, limit?: number) => repo.findVitalSigns(elderlyId, limit))
  ipc.handle('health:vital:create', (_e, data) => repo.insertVitalSigns(data))
  ipc.handle('health:vital:delete', (_e, id: string) => { repo.deleteVitalSigns(id); return { ok: true } })

  // 用药医嘱
  ipc.handle('health:med:order:list', (_e, elderlyId: string, activeOnly?: boolean) => repo.findMedOrders(elderlyId, activeOnly))
  ipc.handle('health:med:order:create', (_e, data) => repo.insertMedOrder(data))
  ipc.handle('health:med:order:update', (_e, { id, data }) => { repo.updateMedOrder(id, data); return { ok: true } })
  ipc.handle('health:med:order:delete', (_e, id: string) => { repo.deleteMedOrder(id); return { ok: true } })

  // 服药记录
  ipc.handle('health:med:record:list', (_e, elderlyId: string, date?: string) => repo.findMedRecords(elderlyId, date))
  ipc.handle('health:med:record:create', (_e, data) => repo.insertMedRecord(data))

  // 就医记录
  ipc.handle('health:visit:list', (_e, elderlyId: string) => repo.findMedVisits(elderlyId))
  ipc.handle('health:visit:create', (_e, data) => repo.insertMedVisit(data))
  ipc.handle('health:visit:delete', (_e, id: string) => { repo.deleteMedVisit(id); return { ok: true } })

  // 体检预约
  ipc.handle('health:exam:appt:list', (_e, elderlyId?: string) => repo.findExamAppointments(elderlyId))
  ipc.handle('health:exam:appt:create', (_e, data) => repo.insertExamAppointment(data))
  ipc.handle('health:exam:appt:update', (_e, { id, data }) => { repo.updateExamAppointment(id, data); return { ok: true } })
  ipc.handle('health:exam:appt:delete', (_e, id: string) => { repo.deleteExamAppointment(id); return { ok: true } })

  // 体检结果
  ipc.handle('health:exam:result:list', (_e, elderlyId?: string) => repo.findExamResults(elderlyId))
  ipc.handle('health:exam:result:create', (_e, data) => repo.insertExamResult(data))
  ipc.handle('health:exam:result:update', (_e, { id, data }) => { repo.updateExamResult(id, data); return { ok: true } })
  ipc.handle('health:exam:result:delete', (_e, id: string) => { repo.deleteExamResult(id); return { ok: true } })
}
