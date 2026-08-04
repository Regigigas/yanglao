// apps/desktop/src/renderer/src/stores/permission-group.store.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { PermissionGroupRow } from '@yanglao/db'

export const usePermissionGroupStore = defineStore('permissionGroup', () => {
  const list = ref<PermissionGroupRow[]>([])
  const loading = ref(false)

  async function fetchList() {
    loading.value = true
    try { list.value = await window.api.permissionGroup.list() }
    finally { loading.value = false }
  }

  async function create(data: unknown) {
    const res = await window.api.permissionGroup.create(data)
    if (res.ok) list.value.push(res.group)
    return res
  }

  async function update(id: string, data: unknown) {
    const res = await window.api.permissionGroup.update(id, data)
    if (res.ok) {
      const idx = list.value.findIndex(g => g.id === id)
      if (idx !== -1) list.value[idx] = { ...list.value[idx], ...(data as object) }
    }
    return res
  }

  async function remove(id: string) {
    const res = await window.api.permissionGroup.delete(id)
    if (res.ok) list.value = list.value.filter(g => g.id !== id)
    return res
  }

  return { list, loading, fetchList, create, update, remove }
})
