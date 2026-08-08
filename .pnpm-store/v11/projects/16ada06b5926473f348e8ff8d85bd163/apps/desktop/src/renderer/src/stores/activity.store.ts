// apps/desktop/src/renderer/src/stores/activity.store.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ActivityRow, ActivityAttendanceRow } from '@yanglao/db'

export const useActivityStore = defineStore('activity', () => {
  const list = ref<ActivityRow[]>([])
  const attendance = ref<ActivityAttendanceRow[]>([])
  const loading = ref(false)

  async function fetchAll(status?: string) {
    loading.value = true
    try { list.value = await window.api.activity.list(status) }
    finally { loading.value = false }
  }

  async function create(data: unknown) {
    const row = await window.api.activity.create(data)
    list.value.unshift(row)
    return row
  }

  async function update(id: string, data: unknown) {
    await window.api.activity.update(id, data)
    const idx = list.value.findIndex(a => a.id === id)
    if (idx !== -1) list.value[idx] = { ...list.value[idx], ...(data as object) }
  }

  async function remove(id: string) {
    await window.api.activity.delete(id)
    list.value = list.value.filter(a => a.id !== id)
  }

  async function start(id: string) {
    await window.api.activity.start(id)
    updateListStatus(id, 'ongoing')
  }

  async function complete(id: string) {
    await window.api.activity.complete(id)
    updateListStatus(id, 'completed')
  }

  async function cancel(id: string) {
    await window.api.activity.cancel(id)
    updateListStatus(id, 'cancelled')
  }

  async function fetchAttendance(activityId: string) {
    attendance.value = await window.api.activity.attendance.list(activityId)
  }

  async function register(activityId: string, elderlyId: string) {
    const row = await window.api.activity.attendance.register(activityId, elderlyId)
    attendance.value.push(row)
    return row
  }

  async function checkIn(activityId: string, elderlyId: string) {
    await window.api.activity.attendance.checkIn(activityId, elderlyId)
    const idx = attendance.value.findIndex(a => a.elderly_id === elderlyId)
    if (idx !== -1) attendance.value[idx] = { ...attendance.value[idx], status: 'attended', check_in_at: Date.now() }
  }

  async function markAbsent(activityId: string, elderlyId: string) {
    await window.api.activity.attendance.absent(activityId, elderlyId)
    const idx = attendance.value.findIndex(a => a.elderly_id === elderlyId)
    if (idx !== -1) attendance.value[idx] = { ...attendance.value[idx], status: 'absent' }
  }

  async function removeAttendance(activityId: string, elderlyId: string) {
    await window.api.activity.attendance.remove(activityId, elderlyId)
    attendance.value = attendance.value.filter(a => a.elderly_id !== elderlyId)
  }

  function updateListStatus(id: string, status: ActivityRow['status']) {
    const idx = list.value.findIndex(activity => activity.id === id)
    if (idx !== -1) list.value[idx] = { ...list.value[idx], status }
  }

  return {
    list, attendance, loading,
    fetchAll, create, update, remove,
    start, complete, cancel,
    fetchAttendance, register, checkIn, markAbsent, removeAttendance,
  }
})
