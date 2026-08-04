// apps/desktop/src/renderer/src/stores/health.store.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type {
  HealthProfileRow, VitalSignsRow, MedicationOrderRow, MedicationRecordRow, MedicalVisitRow,
  HealthExamAppointmentRow, HealthExamResultRow,
} from '@yanglao/db'

export const useHealthStore = defineStore('health', () => {
  const profile = ref<HealthProfileRow | null>(null)
  const vitals = ref<VitalSignsRow[]>([])
  const medOrders = ref<MedicationOrderRow[]>([])
  const medRecords = ref<MedicationRecordRow[]>([])
  const visits = ref<MedicalVisitRow[]>([])
  const examAppointments = ref<HealthExamAppointmentRow[]>([])
  const examResults = ref<HealthExamResultRow[]>([])
  const loading = ref(false)

  async function fetchAll(elderlyId: string) {
    loading.value = true
    try {
      const [p, v, o, r, vis, appts, results] = await Promise.all([
        window.api.health.profile.get(elderlyId),
        window.api.health.vital.list(elderlyId),
        window.api.health.medOrder.list(elderlyId),
        window.api.health.medRecord.list(elderlyId),
        window.api.health.visit.list(elderlyId),
        window.api.health.examAppointment.list(elderlyId),
        window.api.health.examResult.list(elderlyId),
      ])
      profile.value = p
      vitals.value = v
      medOrders.value = o
      medRecords.value = r
      visits.value = vis
      examAppointments.value = appts
      examResults.value = results
    } finally { loading.value = false }
  }

  async function saveProfile(elderlyId: string, data: unknown) {
    profile.value = await window.api.health.profile.save(elderlyId, data)
  }

  async function createVital(data: unknown) {
    const row = await window.api.health.vital.create(data)
    vitals.value.unshift(row)
    return row
  }

  async function deleteVital(id: string) {
    await window.api.health.vital.delete(id)
    vitals.value = vitals.value.filter(v => v.id !== id)
  }

  async function createMedOrder(data: unknown) {
    const row = await window.api.health.medOrder.create(data)
    medOrders.value.unshift(row)
    return row
  }

  async function stopMedOrder(id: string) {
    await window.api.health.medOrder.update(id, { status: 'stopped' })
    const idx = medOrders.value.findIndex(o => o.id === id)
    if (idx !== -1) medOrders.value[idx] = { ...medOrders.value[idx], status: 'stopped' }
  }

  async function createMedRecord(data: unknown) {
    const row = await window.api.health.medRecord.create(data)
    medRecords.value.unshift(row)
    return row
  }

  async function createVisit(data: unknown) {
    const row = await window.api.health.visit.create(data)
    visits.value.unshift(row)
    return row
  }

  async function deleteVisit(id: string) {
    await window.api.health.visit.delete(id)
    visits.value = visits.value.filter(v => v.id !== id)
  }

  // ── 体检预约 ─────────────────────────────────────
  async function fetchExamAppointments(elderlyId?: string) {
    examAppointments.value = await window.api.health.examAppointment.list(elderlyId)
  }

  async function fetchExamResults(elderlyId?: string) {
    examResults.value = await window.api.health.examResult.list(elderlyId)
  }

  async function createExamAppointment(data: unknown) {
    const row = await window.api.health.examAppointment.create(data)
    examAppointments.value.unshift(row)
    return row
  }

  async function updateExamAppointment(id: string, data: unknown) {
    await window.api.health.examAppointment.update(id, data)
    const idx = examAppointments.value.findIndex(a => a.id === id)
    if (idx !== -1) examAppointments.value[idx] = { ...examAppointments.value[idx], ...(data as object) }
  }

  async function cancelExamAppointment(id: string) {
    await updateExamAppointment(id, { status: 'cancelled' })
  }

  async function deleteExamAppointment(id: string) {
    await window.api.health.examAppointment.delete(id)
    examAppointments.value = examAppointments.value.filter(a => a.id !== id)
  }

  // ── 体检结果 ─────────────────────────────────────
  async function createExamResult(data: unknown) {
    const row = await window.api.health.examResult.create(data)
    examResults.value.unshift(row)
    // 若关联了预约，本地同步将该预约标记为已完成，与后端 insertExamResult 的联动行为保持一致
    const apptId = (data as { appointment_id?: string | null }).appointment_id
    if (apptId) {
      const idx = examAppointments.value.findIndex(a => a.id === apptId)
      if (idx !== -1) examAppointments.value[idx] = { ...examAppointments.value[idx], status: 'completed' }
    }
    return row
  }

  async function updateExamResult(id: string, data: unknown) {
    await window.api.health.examResult.update(id, data)
    const idx = examResults.value.findIndex(result => result.id === id)
    if (idx !== -1) examResults.value[idx] = { ...examResults.value[idx], ...(data as object) }
  }

  async function deleteExamResult(id: string) {
    await window.api.health.examResult.delete(id)
    examResults.value = examResults.value.filter(r => r.id !== id)
  }

  return {
    profile, vitals, medOrders, medRecords, visits, examAppointments, examResults, loading,
    fetchAll, saveProfile,
    createVital, deleteVital,
    createMedOrder, stopMedOrder, createMedRecord,
    createVisit, deleteVisit,
    fetchExamAppointments, fetchExamResults,
    createExamAppointment, updateExamAppointment, cancelExamAppointment, deleteExamAppointment,
    createExamResult, updateExamResult, deleteExamResult,
  }
})
