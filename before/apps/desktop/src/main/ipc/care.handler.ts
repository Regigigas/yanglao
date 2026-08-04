// apps/desktop/src/main/ipc/care.handler.ts
import type { IpcMain } from 'electron'
import type { CareRepo } from '@yanglao/db'

export function registerCareHandlers(ipc: IpcMain, repo: CareRepo): void {
  // 护理评估
  ipc.handle('care:assess:list', (_e, elderlyId: string) => repo.findAssessments(elderlyId))
  ipc.handle('care:assess:latest', (_e, elderlyId: string) => repo.findLatestAssessment(elderlyId))
  ipc.handle('care:assess:create', (_e, data) => repo.insertAssessment(data))
  ipc.handle('care:assess:delete', (_e, id: string) => { repo.deleteAssessment(id); return { ok: true } })

  // 护理计划
  ipc.handle('care:plan:list', (_e, elderlyId: string) => repo.findPlans(elderlyId))
  ipc.handle('care:plan:active', (_e, elderlyId: string) => repo.findActivePlan(elderlyId))
  ipc.handle('care:plan:create', (_e, data) => repo.insertPlan(data))
  ipc.handle('care:plan:update', (_e, { id, data }) => { repo.updatePlan(id, data); return { ok: true } })
  ipc.handle('care:plan:delete', (_e, id: string) => { repo.deletePlan(id); return { ok: true } })

  // 护理记录
  ipc.handle('care:record:list', (_e, elderlyId: string, date?: string) => repo.findRecords(elderlyId, date))
  ipc.handle('care:record:bydate', (_e, date: string) => repo.findRecordsByDate(date))
  ipc.handle('care:record:create', (_e, data) => repo.insertRecord(data))
  ipc.handle('care:record:delete', (_e, id: string) => { repo.deleteRecord(id); return { ok: true } })
  ipc.handle('care:workload', (_e, startDate: string, endDate: string) => repo.getWorkloadStats(startDate, endDate))
}
