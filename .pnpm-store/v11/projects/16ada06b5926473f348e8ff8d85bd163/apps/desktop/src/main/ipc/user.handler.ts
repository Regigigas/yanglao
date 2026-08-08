// apps/desktop/src/main/ipc/user.handler.ts
// 用户与角色管理 IPC 处理器

import type { IpcMain } from 'electron'
import type { UserRepo } from '@yanglao/db'
import { requireActiveUser, session } from './auth.handler'

function toSafeUser(user: { password_hash: string; password_salt: string; [k: string]: unknown }) {
  const { password_hash: _h, password_salt: _s, ...safe } = user
  return safe
}

function permissionKeys(value: string): string[] {
  try {
    const parsed = JSON.parse(value) as unknown
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []
  } catch {
    return []
  }
}

function requirePermission(repo: UserRepo, menu: string, button?: string): void {
  const currentUser = requireActiveUser(repo)
  const role = repo.findRoleById(currentUser.role_id)
  if (!role || role.deleted_at !== null) throw new Error('当前账号角色无效')
  const menus = permissionKeys(role.menu_keys)
  if (!menus.includes('*') && !menus.includes(menu)) throw new Error('当前账号无此菜单权限')
  if (button) {
    const buttons = permissionKeys(role.button_keys)
    if (!buttons.includes('*') && !buttons.includes(button)) throw new Error('当前账号无此操作权限')
  }
}

function requireAdministrator(repo: UserRepo): void {
  if (requireActiveUser(repo).role_id !== 'role-admin') throw new Error('仅系统管理员可执行角色和高权限账号操作')
}

function isPrivilegedRole(repo: UserRepo, roleId: string): boolean {
  const role = repo.findRoleById(roleId)
  return !!role && (roleId === 'role-admin'
    || permissionKeys(role.menu_keys).includes('*')
    || permissionKeys(role.button_keys).includes('*'))
}

function requireCanManageUser(repo: UserRepo, targetUserId: string): void {
  const currentUser = requireActiveUser(repo)
  const target = repo.findUserById(targetUserId)
  if (!target) throw new Error('目标账号不存在')
  if (currentUser.role_id !== 'role-admin' && (target.username === 'admin' || isPrivilegedRole(repo, target.role_id))) {
    throw new Error('仅系统管理员可管理高权限账号')
  }
}

function validateRoleAssignment(repo: UserRepo, roleId: unknown, targetUserId?: string): void {
  if (typeof roleId !== 'string') return
  const role = repo.findRoleById(roleId)
  if (!role || role.deleted_at !== null) throw new Error('指定角色不存在')
  if (isPrivilegedRole(repo, roleId)) requireAdministrator(repo)
  const currentUser = requireActiveUser(repo)
  if (targetUserId === currentUser.id && currentUser.role_id !== 'role-admin') {
    throw new Error('不能修改自己的角色')
  }
}

export function registerUserHandlers(ipc: IpcMain, repo: UserRepo): void {
  // ── 用户 ──────────────────────────────────────────────────
  ipc.handle('user:list', () => {
    requirePermission(repo, 'user')
    return repo.findAllUsers().map(toSafeUser)
  })

  ipc.handle('user:create', (_e, data: { password: string; [k: string]: unknown }) => {
    try {
      requirePermission(repo, 'user', 'user:create')
      validateRoleAssignment(repo, data.role_id)
      const row = repo.insertUser(data as never)
      return { ok: true, user: toSafeUser(row) }
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : '创建失败' }
    }
  })

  ipc.handle('user:update', (_e, { id, data }: { id: string; data: unknown }) => {
    try {
      requirePermission(repo, 'user')
      requireCanManageUser(repo, id)
      const update = data && typeof data === 'object' ? data as Record<string, unknown> : {}
      validateRoleAssignment(repo, update.role_id, id)
      repo.updateUser(id, data as never)
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : '更新失败' }
    }
  })

  ipc.handle('user:reset-password', (_e, { id, newPassword }: { id: string; newPassword: string }) => {
    requirePermission(repo, 'user', 'user:reset-pw')
    requireCanManageUser(repo, id)
    repo.setPassword(id, newPassword, true)
    return { ok: true }
  })

  ipc.handle('user:delete', (_e, id: string) => {
    try {
      requirePermission(repo, 'user', 'user:delete')
      requireCanManageUser(repo, id)
      repo.softDeleteUser(id)
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : '删除失败' }
    }
  })

  // ── 角色 ──────────────────────────────────────────────────
  ipc.handle('role:list', () => {
    requireActiveUser(repo)
    return repo.findAllRoles()
  })

  ipc.handle('role:create', (_e, data) => {
    requireAdministrator(repo)
    return repo.insertRole(data as never)
  })

  ipc.handle('role:update', (_e, { id, data }: { id: string; data: unknown }) => {
    try {
      requireAdministrator(repo)
      repo.updateRole(id, data as never)
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : '更新失败' }
    }
  })

  ipc.handle('role:delete', (_e, id: string) => {
    try {
      requireAdministrator(repo)
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
