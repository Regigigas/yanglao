// apps/desktop/src/renderer/src/stores/care.store.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CareAssessmentRow, CarePlanRow, CareRecordRow } from '@yanglao/db'

export const useCareStore = defineStore('care', () => {
  const assessments = ref<CareAssessmentRow[]>([])
  const plans = ref<CarePlanRow[]>([])
  const records = ref<CareRecordRow[]>([])
  const loading = ref(false)

  async function fetchAssessments(elderlyId: string) {
    assessments.value = await window.api.care.assessment.list(elderlyId)
  }

  async function createAssessment(data: unknown) {
    const row = await window.api.care.assessment.create(data)
    assessments.value.unshift(row)
    return row
  }

  async function deleteAssessment(id: string) {
    await window.api.care.assessment.delete(id)
    assessments.value = assessments.value.filter(a => a.id !== id)
  }

  async function fetchPlans(elderlyId: string) {
    plans.value = await window.api.care.plan.list(elderlyId)
  }

  async function createPlan(data: unknown) {
    const row = await window.api.care.plan.create(data)
    plans.value.unshift(row)
    return row
  }

  async function updatePlan(id: string, data: unknown) {
    await window.api.care.plan.update(id, data)
    const idx = plans.value.findIndex(p => p.id === id)
    if (idx !== -1) plans.value[idx] = { ...plans.value[idx], ...(data as object) }
  }

  async function fetchRecords(elderlyId: string, date?: string) {
    loading.value = true
    try { records.value = await window.api.care.record.list(elderlyId, date) }
    finally { loading.value = false }
  }

  async function createRecord(data: unknown) {
    const row = await window.api.care.record.create(data)
    records.value.unshift(row)
    return row
  }

  async function deleteRecord(id: string) {
    await window.api.care.record.delete(id)
    records.value = records.value.filter(r => r.id !== id)
  }

  return {
    assessments, plans, records, loading,
    fetchAssessments, createAssessment, deleteAssessment,
    fetchPlans, createPlan, updatePlan,
    fetchRecords, createRecord, deleteRecord,
  }
})
