// apps/desktop/src/renderer/src/stores/user.store.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserRow } from '@yanglao/db'

type SafeUser = Omit<UserRow, 'password_hash' | 'password_salt'>

export const useUserStore = defineStore('user', () => {
  const list = ref<SafeUser[]>([])
  const loading = ref(false)

  async function fetchList() {
    loading.value = true
    try { list.value = await window.api.user.list() }
    finally { loading.value = false }
  }

  async function create(data: unknown) {
    const res = await window.api.user.create(data)
    if (res.ok) list.value.unshift(res.user)
    return res
  }

  async function update(id: string, data: unknown) {
    const res = await window.api.user.update(id, data)
    if (res.ok) {
      const idx = list.value.findIndex(u => u.id === id)
      if (idx !== -1) list.value[idx] = { ...list.value[idx], ...(data as object) }
    }
    return res
  }

  async function resetPassword(id: string, newPassword: string) {
    return window.api.user.resetPassword(id, newPassword)
  }

  async function remove(id: string) {
    const res = await window.api.user.delete(id)
    if (res.ok) list.value = list.value.filter(u => u.id !== id)
    return res
  }

  return { list, loading, fetchList, create, update, resetPassword, remove }
})
