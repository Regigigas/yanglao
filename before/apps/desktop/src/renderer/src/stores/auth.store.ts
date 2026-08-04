// apps/desktop/src/renderer/src/stores/auth.store.ts
// 登录鉴权状态管理：当前登录用户、权限集合、登录/登出/改密

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserRow, RoleRow } from '@yanglao/db'
import { menuKeysAllow } from '../config/menu-catalog'

type SafeUser = Omit<UserRow, 'password_hash' | 'password_salt'>

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<SafeUser | null>(null)
  const currentRole = ref<RoleRow | null>(null)
  const initialized = ref(false)

  const isLoggedIn = computed(() => !!currentUser.value)
  const menuKeys = computed<string[]>(() => {
    if (!currentRole.value) return []
    try { return JSON.parse(currentRole.value.menu_keys) } catch { return [] }
  })
  const buttonKeys = computed<string[]>(() => {
    if (!currentRole.value) return []
    try { return JSON.parse(currentRole.value.button_keys) } catch { return [] }
  })

  function canAccessMenu(key: string): boolean {
    return menuKeysAllow(menuKeys.value, key)
  }

  function canUseButton(key: string): boolean {
    return buttonKeys.value.includes('*') || buttonKeys.value.includes(key)
  }

  async function loadRole(roleId: string) {
    const roles: RoleRow[] = await window.api.role.list()
    currentRole.value = roles.find(r => r.id === roleId) ?? null
  }

  /** 应用启动时调用：尝试恢复主进程内存中的登录会话（同一次进程运行内，刷新渲染进程不会丢登录态） */
  async function restore() {
    if (initialized.value) return
    const user = await window.api.auth.current()
    if (user) {
      currentUser.value = user
      await loadRole(user.role_id)
    }
    initialized.value = true
  }

  async function login(username: string, password: string, remember?: boolean) {
    const res = await window.api.auth.login(username, password, remember)
    if (!res.ok) return res
    currentUser.value = res.user
    await loadRole(res.user.role_id)
    return res
  }

  async function logout() {
    await window.api.auth.logout()
    currentUser.value = null
    currentRole.value = null
  }

  async function changePassword(oldPassword: string, newPassword: string) {
    const res = await window.api.auth.changePassword(oldPassword, newPassword)
    if (res.ok && currentUser.value) {
      currentUser.value = { ...currentUser.value, must_change_pw: 0 }
    }
    return res
  }

  return {
    currentUser, currentRole, initialized, isLoggedIn,
    menuKeys, buttonKeys, canAccessMenu, canUseButton,
    restore, login, logout, changePassword, loadRole,
  }
})
