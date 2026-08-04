// apps/desktop/src/main/ipc/user.handler.ts
// 用户与角色管理 IPC 处理器

import type { IpcMain } from 'electron'
import type { UserRepo } from '@yanglao/db'
import { session } from './auth.handler'

function toSafeUser(user: { password_hash: string; password_salt: string; [k: string]: unknown }) {
  const { password_hash: _h, password_salt: _s, ...safe } = user
  return safe
}

export function registerUserHandlers(ipc: IpcMain, repo: UserRepo): void {
  // ── 用户 ──────────────────────────────────────────────────
  ipc.handle('user:list', () => repo.findAllUsers().map(toSafeUser))

  ipc.handle('user:create', (_e, data: { password: string; [k: string]: unknown }) => {
    try {
      const row = repo.insertUser(data as never)
      return { ok: true, user: toSafeUser(row) }
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : '创建失败' }
    }
  })

  ipc.handle('user:update', (_e, { id, data }: { id: string; data: unknown }) => {
    try {
      repo.updateUser(id, data as never)
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : '更新失败' }
    }
  })

  ipc.handle('user:reset-password', (_e, { id, newPassword }: { id: string; newPassword: string }) => {
    repo.setPassword(id, newPassword, true)
    return { ok: true }
  })

  ipc.handle('user:delete', (_e, id: string) => {
    try {
      repo.softDeleteUser(id)
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : '删除失败' }
    }
  })

  // ── 角色 ──────────────────────────────────────────────────
  ipc.handle('role:list', () => repo.findAllRoles())

  ipc.handle('role:create', (_e, data) => repo.insertRole(data as never))

  ipc.handle('role:update', (_e, { id, data }: { id: string; data: unknown }) => {
    try {
      repo.updateRole(id, data as never)
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : '更新失败' }
    }
  })

  ipc.handle('role:delete', (_e, id: string) => {
    try {
      repo.deleteRole(id)
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : '删除失败' }
    }
  })
}

/** 供其他业务 handler 获取当前操作人 id（如用于 created_by 字段），未登录返回 null */
export function currentUserId(): string | null {
  return session.user?.id ?? null
}
