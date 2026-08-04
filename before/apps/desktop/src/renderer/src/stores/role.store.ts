// apps/desktop/src/renderer/src/stores/role.store.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RoleRow } from '@yanglao/db'

/** 角色列表附带 user_count：该角色当前关联的账号数（后端 findAllRoles 拼接返回） */
export type RoleWithCount = RoleRow & { user_count: number }

export const useRoleStore = defineStore('role', () => {
  const list = ref<RoleWithCount[]>([])
  const loading = ref(false)

  async function fetchList() {
    loading.value = true
    try { list.value = await window.api.role.list() }
    finally { loading.value = false }
  }

  async function create(data: unknown) {
    const row = await window.api.role.create(data)
    list.value.push({ ...row, user_count: 0 })
    return row
  }

  async function update(id: string, data: unknown) {
    const res = await window.api.role.update(id, data)
    if (res.ok) {
      const idx = list.value.findIndex(r => r.id === id)
      if (idx !== -1) list.value[idx] = { ...list.value[idx], ...(data as object) }
    }
    return res
  }

  async function remove(id: string) {
    const res = await window.api.role.delete(id)
    if (res.ok) list.value = list.value.filter(r => r.id !== id)
    return res
  }

  return { list, loading, fetchList, create, update, remove }
})
