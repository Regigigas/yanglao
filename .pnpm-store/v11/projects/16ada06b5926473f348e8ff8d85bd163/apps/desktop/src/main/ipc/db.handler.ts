// apps/desktop/src/main/ipc/db.handler.ts
// 数据库文件路径配置 + 应用级配置 IPC 处理器

import type { IpcMain, BrowserWindow } from 'electron'
import { app, dialog, shell } from 'electron'
import { copyFileSync, existsSync, readFileSync, realpathSync, writeFileSync } from 'fs'
import { dirname, join, resolve, sep } from 'path'
import type { DatabaseBackupService, UserRepo } from '@yanglao/db'
import type { ChatMode } from '@yanglao/core'
import { requireActiveUser } from './auth.handler'

/** app 级持久化配置结构 */
export interface AppConfig {
  dbPath?: string
  /** 桌面聊天使用本地 SQLite 或线上 RuoYi 服务。 */
  chatMode?: ChatMode
  /** 自动刷新间隔（秒），0 或不填表示关闭 */
  autoRefreshSec?: number
}

/** 从持久化 JSON 配置文件读取 app 级配置 */
export function readAppConfig(configPath: string): AppConfig {
  try {
    if (existsSync(configPath)) {
      return JSON.parse(readFileSync(configPath, 'utf-8'))
    }
  } catch { /* 损坏/不存在时忽略，使用默认值 */ }
  return {}
}

/** 写回 app 级配置文件 */
export function writeAppConfig(configPath: string, cfg: AppConfig): void {
  writeFileSync(configPath, JSON.stringify(cfg, null, 2), 'utf-8')
}

export function registerDbHandlers(
  ipc: IpcMain,
  defaultDbPath: string,
  appConfigPath: string,
  pendingRestorePath: string,
  backupService: DatabaseBackupService,
  userRepo: UserRepo,
  getMainWindow: () => BrowserWindow | null,
  isRemoteSyncRunning: () => boolean,
): void {
  const requireAdministrator = (): void => {
    if (requireActiveUser(userRepo).role_id !== 'role-admin') throw new Error('仅系统管理员可执行数据安全操作')
  }

  // ── 数据库文件路径 ─────────────────────────────────────────
  ipc.handle('db:get-path', () => {
    const cfg = readAppConfig(appConfigPath)
    return {
      current: cfg.dbPath || defaultDbPath,
      default: defaultDbPath,
      isCustom: !!cfg.dbPath,
    }
  })

  ipc.handle('db:set-path', (_e, newPath: string) => {
    requireAdministrator()
    const cfg = readAppConfig(appConfigPath)
    if (newPath) cfg.dbPath = newPath
    else delete cfg.dbPath
    writeAppConfig(appConfigPath, cfg)
    return { ok: true }
  })

  ipc.handle('db:reset-path', () => {
    requireAdministrator()
    const cfg = readAppConfig(appConfigPath)
    delete cfg.dbPath
    writeAppConfig(appConfigPath, cfg)
    return { ok: true }
  })

  ipc.handle('db:select-path', async () => {
    requireAdministrator()
    const win = getMainWindow()
    const result = await dialog.showSaveDialog(win ?? undefined!, {
      title: '选择数据库文件保存位置',
      defaultPath: join(app.getPath('userData'), 'yanglao.db'),
      filters: [{ name: 'SQLite 数据库文件', extensions: ['db'] }],
    })
    if (result.canceled) return { canceled: true }
    return { canceled: false, path: result.filePath }
  })

  // ── 数据安全、备份与本地文件同步 ─────────────────────────────
  ipc.handle('db:backup:create', () => {
    requireAdministrator()
    return backupService.createBackup()
  })
  ipc.handle('db:backup:list', () => {
    requireAdministrator()
    return backupService.listBackups()
  })
  ipc.handle('db:backup:restore', (_event, name: string) => {
    requireAdministrator()
    if (isRemoteSyncRunning()) throw new Error('远程同步正在执行，请稍后再恢复数据库备份')
    const result = backupService.scheduleRestore(name, pendingRestorePath)
    setImmediate(() => {
      app.relaunch()
      app.quit()
    })
    return result
  })
  ipc.handle('db:integrity-check', () => {
    requireAdministrator()
    return backupService.integrityCheck()
  })

  ipc.handle('db:local-sync:select-and-run', async () => {
    requireAdministrator()
    if (isRemoteSyncRunning()) throw new Error('远程同步正在执行，请稍后再选择本地数据文件')
    const win = getMainWindow()
    const selected = await dialog.showOpenDialog(win ?? undefined!, {
      title: '选择要同步的 SQLite 数据文件',
      properties: ['openFile'],
      filters: [{ name: 'SQLite 数据文件', extensions: ['db', 'sqlite', 'sqlite3'] }],
    })
    if (selected.canceled || !selected.filePaths[0]) return { canceled: true }

    const staged = await backupService.stageLocalDataFile(selected.filePaths[0])
    const result = backupService.syncFromStagedFile(staged.importId, staged.fileName)
    return { canceled: false, result }
  })

  ipc.handle('db:backup:export', async (_event, name: string) => {
    requireAdministrator()
    const sourcePath = backupService.getBackupPath(name)
    const win = getMainWindow()
    const result = await dialog.showSaveDialog(win ?? undefined!, {
      title: '导出数据库备份',
      defaultPath: join(app.getPath('documents'), name),
      filters: [{ name: 'SQLite 数据库备份', extensions: ['db'] }],
    })
    if (result.canceled || !result.filePath) return { canceled: true }

    const destination = resolve(result.filePath)
    const managedDirectory = realpathSync(backupService.backupDirectory).toLowerCase()
    const destinationDirectory = realpathSync(dirname(destination)).toLowerCase()
    if (
      destinationDirectory === managedDirectory
      || destinationDirectory.startsWith(`${managedDirectory}${sep}`)
    ) {
      throw new Error('不能覆盖程序受控备份目录中的历史备份，请选择其他位置')
    }
    copyFileSync(sourcePath, destination)
    return { canceled: false, path: destination }
  })

  ipc.handle('db:backup:open-directory', async () => {
    requireAdministrator()
    const error = await shell.openPath(backupService.backupDirectory)
    if (error) throw new Error(error)
    return { ok: true }
  })

  // ── 应用级通用配置（含自动刷新间隔等） ─────────────────────
  /** 读取完整 app 配置 */
  ipc.handle('config:app:get', () => readAppConfig(appConfigPath))

  /**
   * 局部更新 app 配置（Object.assign 合并，不会清除未传的字段）
   * 例：saveConfig({ autoRefreshSec: 30 })
   */
  ipc.handle('config:app:set', (_e, partial: Partial<AppConfig>) => {
    if (Object.prototype.hasOwnProperty.call(partial, 'dbPath')) requireAdministrator()
    const cfg = readAppConfig(appConfigPath)
    Object.assign(cfg, partial)
    // 清理无意义的 undefined/0 值
    if (cfg.autoRefreshSec === 0) delete cfg.autoRefreshSec
    if (cfg.chatMode !== undefined && cfg.chatMode !== 'local' && cfg.chatMode !== 'online') {
      delete cfg.chatMode
    }
    writeAppConfig(appConfigPath, cfg)
    return { ok: true }
  })
}
