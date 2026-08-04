// apps/desktop/src/main/ipc/family-contact.handler.ts
import type { IpcMain } from 'electron'
import type { FamilyContactRepo } from '@yanglao/db'

export function registerFamilyContactHandlers(ipc: IpcMain, repo: FamilyContactRepo): void {
  ipc.handle('family:list', (_e, elderlyId: string) => repo.findByElderly(elderlyId))
  ipc.handle('family:create', (_e, data) => repo.insert(data))
  ipc.handle('family:update', (_e, { id, data }) => { repo.update(id, data); return { ok: true } })
  ipc.handle('family:delete', (_e, id: string) => { repo.softDelete(id); return { ok: true } })
}
