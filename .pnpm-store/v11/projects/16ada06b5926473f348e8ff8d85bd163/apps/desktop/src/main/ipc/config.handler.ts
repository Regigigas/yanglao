// apps/desktop/src/main/ipc/config.handler.ts
// 应用配置 IPC 处理器

import type { IpcMain } from 'electron'
import type { SyncConfigRepo } from '@yanglao/db'
import type { SyncScheduler } from '@yanglao/sync'
import { app } from 'electron'

export function registerConfigHandlers(
  ipc: IpcMain,
  syncConfigRepo: SyncConfigRepo,
  scheduler: SyncScheduler
): void {
  // 获取应用版本
  ipc.handle('app:get-version', () => app.getVersion())

  // 获取用户数据目录
  ipc.handle('app:get-user-data', () => app.getPath('userData'))

  // 重置同步配置（禁用同步）
  ipc.handle('sync:disable', () => {
    const current = syncConfigRepo.get()
    const config = syncConfigRepo.toSyncConfig(current)
    config.enabled = false
    syncConfigRepo.save(config)
    scheduler.applyConfig(config)
    return { ok: true }
  })
}
