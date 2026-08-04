// apps/desktop/src/main/ipc/auth.handler.ts
// 登录鉴权 IPC 处理器 - 维护主进程内的当前登录用户会话（单窗口应用，会话保存在内存中）

import type { IpcMain } from 'electron'
import type { UserRepo, UserRow } from '@yanglao/db'
import { loadPersistedSession, savePersistedSession, clearPersistedSession } from '../session-store'

export interface AuthSession {
  /** 当前登录用户，未登录时为 null */
  user: UserRow | null
}

/** "记住登录状态"的有效期：30 天 */
const REMEMBER_TTL_MS = 30 * 24 * 60 * 60 * 1000

/** 全局会话状态，供其他 handler（如需要记录 created_by）读取当前操作人 */
export const session: AuthSession = { user: null }

function toSafeUser(user: UserRow) {
  const { password_hash: _h, password_salt: _s, ...safe } = user
  return safe
}

export function registerAuthHandlers(ipc: IpcMain, userRepo: UserRepo): void {
  ipc.handle('auth:login', (_e, { username, password, remember }: { username: string; password: string; remember?: boolean }) => {
    const user = userRepo.verifyLogin(username, password)
    if (!user) return { ok: false, error: '用户名或密码错误' }
    userRepo.recordLogin(user.id)
    session.user = user
    if (remember) {
      savePersistedSession(user.id, REMEMBER_TTL_MS)
    } else {
      clearPersistedSession()
    }
    return { ok: true, user: toSafeUser(user) }
  })

  ipc.handle('auth:logout', () => {
    session.user = null
    clearPersistedSession()
    return { ok: true }
  })

  ipc.handle('auth:current', () => {
    if (session.user) return toSafeUser(session.user)
    // 内存会话为空（应用刚启动）时，尝试通过本地持久化的"记住登录状态"记录自动恢复
    const persisted = loadPersistedSession()
    if (!persisted) return null
    const user = userRepo.findUserById(persisted.userId)
    if (!user || user.status !== 'active') {
      clearPersistedSession()
      return null
    }
    session.user = user
    return toSafeUser(user)
  })

  ipc.handle('auth:change-password', (_e, { oldPassword, newPassword }: { oldPassword: string; newPassword: string }) => {
    if (!session.user) return { ok: false, error: '未登录' }
    const ok = userRepo.verifyLogin(session.user.username, oldPassword)
    if (!ok) return { ok: false, error: '原密码不正确' }
    userRepo.setPassword(session.user.id, newPassword, false)
    session.user = userRepo.findUserById(session.user.id)
    return { ok: true }
  })
}
