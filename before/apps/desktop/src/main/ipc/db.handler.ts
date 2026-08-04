// apps/desktop/src/main/ipc/db.handler.ts
// 数据库文件路径配置 + 应用级配置 IPC 处理器

import type { IpcMain, BrowserWindow } from 'electron'
import { app, dialog } from 'electron'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

/** app 级持久化配置结构 */
export interface AppConfig {
  dbPath?: string
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
  getMainWindow: () => BrowserWindow | null
): void {
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
    const cfg = readAppConfig(appConfigPath)
    if (newPath) cfg.dbPath = newPath
    else delete cfg.dbPath
    writeAppConfig(appConfigPath, cfg)
    return { ok: true }
  })

  ipc.handle('db:reset-path', () => {
    const cfg = readAppConfig(appConfigPath)
    delete cfg.dbPath
    writeAppConfig(appConfigPath, cfg)
    return { ok: true }
  })

  ipc.handle('db:select-path', async () => {
    const win = getMainWindow()
    const result = await dialog.showSaveDialog(win ?? undefined!, {
      title: '选择数据库文件保存位置',
      defaultPath: join(app.getPath('userData'), 'yanglao.db'),
      filters: [{ name: 'SQLite 数据库文件', extensions: ['db'] }],
    })
    if (result.canceled) return { canceled: true }
    return { canceled: false, path: result.filePath }
  })

  // ── 应用级通用配置（含自动刷新间隔等） ─────────────────────
  /** 读取完整 app 配置 */
  ipc.handle('config:app:get', () => readAppConfig(appConfigPath))

  /**
   * 局部更新 app 配置（Object.assign 合并，不会清除未传的字段）
   * 例：saveConfig({ autoRefreshSec: 30 })
   */
  ipc.handle('config:app:set', (_e, partial: Partial<AppConfig>) => {
    const cfg = readAppConfig(appConfigPath)
    Object.assign(cfg, partial)
    // 清理无意义的 undefined/0 值
    if (cfg.autoRefreshSec === 0) delete cfg.autoRefreshSec
    writeAppConfig(appConfigPath, cfg)
    return { ok: true }
  })
}
