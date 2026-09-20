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

export function requireActiveUser(userRepo: UserRepo): UserRow {
  if (!session.user) throw new Error('请先登录')
  const current = userRepo.findUserById(session.user.id)
  if (!current || current.status !== 'active' || current.deleted_at !== null) {
    session.user = null
    clearPersistedSession()
    throw new Error('当前账号已停用或不存在，请重新登录')
  }
  session.user = current
  return current
}

function toSafeUser(user: UserRow) {
  const { password_hash: _h, password_salt: _s, ...safe } = user
  return safe
}

export function registerAuthHandlers(ipc: IpcMain, userRepo: UserRepo): void {
  ipc.handle('auth:login', (_e, { username, password, remember }: { username: string; password: string; remember?: boolean }) => {
    if (typeof username !== 'string' || !username.trim() || typeof password !== 'string' || !password) {
      return { ok: false, error: '请输入用户名和密码' }
    }
    const user = userRepo.verifyLogin(username, password)
    if (!user) return { ok: false, error: '用户名或密码错误' }
    userRepo.recordLogin(user.id)
    // 登录时间已更新，重新读取以保证渲染进程拿到的用户信息和数据库一致。
    session.user = userRepo.findUserById(user.id) ?? user
    if (remember) {
      savePersistedSession(user.id, REMEMBER_TTL_MS)
    } else {
      clearPersistedSession()
    }
    return { ok: true, user: toSafeUser(session.user) }
  })

  ipc.handle('auth:logout', () => {
    session.user = null
    clearPersistedSession()
    return { ok: true }
  })

  ipc.handle('auth:current', () => {
    if (session.user) {
      try {
        return toSafeUser(requireActiveUser(userRepo))
      } catch {
        return null
      }
    }
    // 内存会话为空（应用刚启动）时，尝试通过本地持久化的"记住登录状态"记录自动恢复
    const persisted = loadPersistedSession()
    if (!persisted) return null
    const user = userRepo.findUserById(persisted.userId)
    if (!user || user.status !== 'active' || user.deleted_at !== null) {
      clearPersistedSession()
      return null
    }
    session.user = user
    return toSafeUser(user)
  })

  ipc.handle('auth:change-password', (_e, { oldPassword, newPassword }: { oldPassword: string; newPassword: string }) => {
    let currentUser: UserRow
    try {
      currentUser = requireActiveUser(userRepo)
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : '未登录' }
    }
    if (typeof oldPassword !== 'string') return { ok: false, error: '原密码无效' }
    if (typeof newPassword !== 'string' || newPassword.length < 6 || newPassword.length > 128) {
      return { ok: false, error: '新密码长度应为 6 到 128 位' }
    }
    if (newPassword === oldPassword) return { ok: false, error: '新密码不能与原密码相同' }
    const ok = userRepo.verifyLogin(currentUser.username, oldPassword)
    if (!ok) return { ok: false, error: '原密码不正确' }
    userRepo.setPassword(currentUser.id, newPassword, false)
    session.user = userRepo.findUserById(currentUser.id)
    return { ok: true }
  })
}
