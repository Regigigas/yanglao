// apps/desktop/src/renderer/src/stores/elderly.store.ts
// 老人信息 Pinia Store

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ElderlyRow } from '@yanglao/db'

export const useElderlyStore = defineStore('elderly', () => {
  const list = ref<ElderlyRow[]>([])
  const loading = ref(false)
  const current = ref<ElderlyRow | null>(null)

  async function fetchList() {
    loading.value = true
    try {
      list.value = await window.api.elderly.list()
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id: string) {
    current.value = await window.api.elderly.get(id)
    return current.value
  }

  async function create(data: Omit<ElderlyRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) {
    const row = await window.api.elderly.create(data)
    list.value.unshift(row)
    return row
  }

  async function update(id: string, data: Partial<ElderlyRow>) {
    await window.api.elderly.update(id, data)
    const idx = list.value.findIndex(e => e.id === id)
    if (idx !== -1) {
      list.value[idx] = { ...list.value[idx], ...data }
    }
  }

  async function remove(id: string) {
    await window.api.elderly.delete(id)
    list.value = list.value.filter(e => e.id !== id)
  }

  return { list, loading, current, fetchList, fetchById, create, update, remove }
})
