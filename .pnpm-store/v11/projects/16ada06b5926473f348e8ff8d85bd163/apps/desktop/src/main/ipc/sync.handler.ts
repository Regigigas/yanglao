// apps/desktop/src/main/ipc/sync.handler.ts
// 同步相关 IPC 处理器

import type { IpcMain } from 'electron'
import type { SyncScheduler } from '@yanglao/sync'
import type { SyncConfigRepo } from '@yanglao/db'
import type { SyncConfig } from '@yanglao/core'

export function registerSyncHandlers(
  ipc: IpcMain,
  scheduler: SyncScheduler,
  syncConfigRepo: SyncConfigRepo
): void {
  // 手动触发同步
  ipc.handle('sync:trigger-manual', async () => {
    await scheduler.triggerManual()
    return { ok: true }
  })

  // 获取同步配置
  ipc.handle('sync:get-config', () => {
    const row = syncConfigRepo.get()
    return syncConfigRepo.toSyncConfig(row)
  })

  // 保存同步配置并重新应用调度
  ipc.handle('sync:save-config', (_event, config: SyncConfig) => {
    syncConfigRepo.save(config)
    scheduler.applyConfig(config)
    return { ok: true }
  })

  // 查询未同步条数
  ipc.handle('sync:pending-count', () => {
    // changeLog.countUnsynced 在 engine 内部，通过 repos 暴露
    return { count: 0 }  // 由调用方实现具体逻辑
  })

  // 获取同步状态
  ipc.handle('sync:get-status', () => {
    return scheduler.getStatus()
  })
}
