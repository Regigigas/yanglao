// apps/desktop/src/main/ipc/permission-group.handler.ts
// 权限组管理 IPC 处理器

import type { IpcMain } from 'electron'
import type { PermissionGroupRepo } from '@yanglao/db'

export function registerPermissionGroupHandlers(ipc: IpcMain, repo: PermissionGroupRepo): void {
  ipc.handle('permission-group:list', () => repo.findAll())

  ipc.handle('permission-group:create', (_e, data) => {
    try {
      const row = repo.insert(data as never)
      return { ok: true, group: row }
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : '创建失败' }
    }
  })

  ipc.handle('permission-group:update', (_e, { id, data }: { id: string; data: unknown }) => {
    try {
      repo.update(id, data as never)
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : '更新失败' }
    }
  })

  ipc.handle('permission-group:delete', (_e, id: string) => {
    try {
      repo.softDelete(id)
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : '删除失败' }
    }
  })
}
