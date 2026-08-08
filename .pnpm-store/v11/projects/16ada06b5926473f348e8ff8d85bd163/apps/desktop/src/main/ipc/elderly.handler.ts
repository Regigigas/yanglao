// apps/desktop/src/main/ipc/elderly.handler.ts
// 老人信息 IPC 处理器

import type { IpcMain } from 'electron'
import type { ElderlyRepo } from '@yanglao/db'

export function registerElderlyHandlers(ipc: IpcMain, elderlyRepo: ElderlyRepo): void {
  ipc.handle('elderly:list', () => {
    return elderlyRepo.findAll()
  })

  ipc.handle('elderly:get', (_event, id: string) => {
    return elderlyRepo.findById(id)
  })

  ipc.handle('elderly:create', (_event, data) => {
    return elderlyRepo.insert(data)
  })

  ipc.handle('elderly:update', (_event, { id, data }) => {
    elderlyRepo.update(id, data)
    return { ok: true }
  })

  ipc.handle('elderly:delete', (_event, id: string) => {
    elderlyRepo.softDelete(id)
    return { ok: true }
  })
}
