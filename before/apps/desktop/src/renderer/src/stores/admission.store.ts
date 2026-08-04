// apps/desktop/src/renderer/src/stores/admission.store.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AdmissionRow, LeaveRecordRow, DischargeRow } from '@yanglao/db'

export const useAdmissionStore = defineStore('admission', () => {
  const admissions = ref<AdmissionRow[]>([])
  const leaveRecords = ref<LeaveRecordRow[]>([])
  const discharges = ref<DischargeRow[]>([])
  const loading = ref(false)

  async function fetchAdmissions(elderlyId?: string) {
    loading.value = true
    try {
      admissions.value = elderlyId
        ? await window.api.admission.listByElderly(elderlyId)
        : await window.api.admission.list()
    } finally { loading.value = false }
  }

  async function createAdmission(data: unknown) {
    const row = await window.api.admission.create(data)
    admissions.value.unshift(row)
    return row
  }

  async function updateAdmission(id: string, data: unknown) {
    await window.api.admission.update(id, data)
    const idx = admissions.value.findIndex(a => a.id === id)
    if (idx !== -1) admissions.value[idx] = { ...admissions.value[idx], ...(data as object) }
  }

  async function fetchLeave(elderlyId: string) {
    leaveRecords.value = await window.api.leave.list(elderlyId)
  }

  async function createLeave(data: unknown) {
    const row = await window.api.leave.create(data)
    leaveRecords.value.unshift(row)
    return row
  }

  async function returnFromLeave(id: string, actualReturn: string) {
    await window.api.leave.return(id, actualReturn)
    const idx = leaveRecords.value.findIndex(l => l.id === id)
    if (idx !== -1) leaveRecords.value[idx] = { ...leaveRecords.value[idx], status: 'returned', actual_return: actualReturn }
  }

  async function fetchDischarges(elderlyId: string) {
    discharges.value = await window.api.discharge.list(elderlyId)
  }

  async function createDischarge(data: unknown) {
    const row = await window.api.discharge.create(data)
    discharges.value.unshift(row)
    return row
  }

  return {
    admissions, leaveRecords, discharges, loading,
    fetchAdmissions, createAdmission, updateAdmission,
    fetchLeave, createLeave, returnFromLeave,
    fetchDischarges, createDischarge,
  }
})
