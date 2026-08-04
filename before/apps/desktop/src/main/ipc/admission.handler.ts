// apps/desktop/src/main/ipc/admission.handler.ts
import type { IpcMain } from 'electron'
import type { AdmissionRepo } from '@yanglao/db'

export function registerAdmissionHandlers(ipc: IpcMain, repo: AdmissionRepo): void {
  // 入院记录
  ipc.handle('admission:list', () => repo.findAll())
  ipc.handle('admission:list:elderly', (_e, elderlyId: string) => repo.findByElderly(elderlyId))
  ipc.handle('admission:active', (_e, elderlyId: string) => repo.findActiveByElderly(elderlyId))
  ipc.handle('admission:create', (_e, data) => repo.insert(data))
  ipc.handle('admission:update', (_e, { id, data }) => { repo.update(id, data); return { ok: true } })
  ipc.handle('admission:delete', (_e, id: string) => { repo.softDelete(id); return { ok: true } })

  // 暂离记录
  ipc.handle('admission:leave:list', (_e, elderlyId: string) => repo.findLeaveByElderly(elderlyId))
  ipc.handle('admission:leave:active', (_e, elderlyId: string) => repo.findActiveLeave(elderlyId))
  ipc.handle('admission:leave:create', (_e, data) => repo.insertLeave(data))
  ipc.handle('admission:leave:return', (_e, { id, actualReturn }) => {
    repo.updateLeave(id, { status: 'returned', actual_return: actualReturn })
    return { ok: true }
  })

  // 离院记录
  ipc.handle('discharge:list', (_e, elderlyId: string) => repo.findDischargeByElderly(elderlyId))
  ipc.handle('discharge:create', (_e, data) => repo.insertDischarge(data))
}
