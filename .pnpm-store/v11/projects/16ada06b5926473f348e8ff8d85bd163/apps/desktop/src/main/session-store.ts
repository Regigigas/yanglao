// apps/desktop/src/main/session-store.ts
// 持久化"记住登录状态"的会话信息：只保存 userId + 过期时间，绝不保存密码
// 用于登录时勾选"记住登录状态"后，应用重启在有效期内（默认30天）可自动恢复登录

import { app } from 'electron'
import { join } from 'path'
import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'fs'

interface PersistedSession {
  userId: string
  expiresAt: number
}

function sessionFilePath(): string {
  return join(app.getPath('userData'), 'session.json')
}

/** 读取持久化会话，过期或不存在则返回 null（过期时会自动清理文件） */
export function loadPersistedSession(): PersistedSession | null {
  try {
    const filePath = sessionFilePath()
    if (!existsSync(filePath)) return null
    const data = JSON.parse(readFileSync(filePath, 'utf-8')) as PersistedSession
    if (!data?.userId || !data.expiresAt || data.expiresAt < Date.now()) {
      clearPersistedSession()
      return null
    }
    return data
  } catch {
    return null
  }
}

export function savePersistedSession(userId: string, ttlMs: number): void {
  try {
    const data: PersistedSession = { userId, expiresAt: Date.now() + ttlMs }
    writeFileSync(sessionFilePath(), JSON.stringify(data), 'utf-8')
  } catch {
    // 持久化失败不影响正常登录，仅记住登录状态功能失效
  }
}

export function clearPersistedSession(): void {
  try {
    const filePath = sessionFilePath()
    if (existsSync(filePath)) unlinkSync(filePath)
  } catch {
    // 忽略清理失败
  }
}
