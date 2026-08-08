// apps/desktop/src/renderer/src/stores/contract.store.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ContractRow } from '@yanglao/db'

export const useContractStore = defineStore('contract', () => {
  const list = ref<ContractRow[]>([])
  const expiring = ref<ContractRow[]>([])
  const loading = ref(false)

  async function fetchAll() {
    loading.value = true
    try { list.value = await window.api.contract.list() }
    finally { loading.value = false }
  }

  async function fetchExpiring(days = 30) {
    expiring.value = await window.api.contract.expiring(days)
  }

  async function fetchByElderly(elderlyId: string) {
    list.value = await window.api.contract.listByElderly(elderlyId)
  }

  async function create(data: unknown) {
    const row = await window.api.contract.create(data)
    list.value.unshift(row)
    return row
  }

  async function update(id: string, data: unknown) {
    await window.api.contract.update(id, data)
    const idx = list.value.findIndex(c => c.id === id)
    if (idx !== -1) list.value[idx] = { ...list.value[idx], ...(data as object) }
    // expiring 是单独维护的列表，需同步更新，否则合同终止/续签后仍会显示在"即将到期"中
    const expIdx = expiring.value.findIndex(c => c.id === id)
    if (expIdx !== -1) {
      const merged = { ...expiring.value[expIdx], ...(data as object) } as ContractRow
      if (merged.status !== 'active') {
        expiring.value.splice(expIdx, 1)
      } else {
        expiring.value[expIdx] = merged
      }
    }
  }

  async function remove(id: string) {
    await window.api.contract.delete(id)
    list.value = list.value.filter(c => c.id !== id)
  }

  async function genContractNo(): Promise<string> {
    return window.api.contract.genNo()
  }

  return {
    list, expiring, loading,
    fetchAll, fetchExpiring, fetchByElderly,
    create, update, remove, genContractNo,
  }
})
