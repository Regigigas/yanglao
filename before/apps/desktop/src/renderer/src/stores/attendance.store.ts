// apps/desktop/src/renderer/src/stores/attendance.store.ts
// 考勤：班次 / 排班 / 打卡 / 请假

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ShiftRow, WorkShiftRule, ScheduleRow, AttendanceRow, LeaveApplicationRow } from '@yanglao/db'

export const useAttendanceStore = defineStore('attendance', () => {
  const shifts = ref<ShiftRow[]>([])
  const schedules = ref<ScheduleRow[]>([])
  const todayRecords = ref<AttendanceRow[]>([])
  const rangeRecords = ref<AttendanceRow[]>([])
  const leaves = ref<LeaveApplicationRow[]>([])
  const workRule = ref<WorkShiftRule | null>(null)
  const loading = ref(false)

  // ── 班次 ──────────────────────────────────────────────────
  async function fetchShifts() {
    shifts.value = await window.api.shift.list()
  }
  async function createShift(data: unknown) {
    const row = await window.api.shift.create(data)
    shifts.value.push(row)
    return row
  }
  async function updateShift(id: string, data: unknown) {
    await window.api.shift.update(id, data)
    const idx = shifts.value.findIndex(s => s.id === id)
    if (idx !== -1) Object.assign(shifts.value[idx], data as object)
    return { ok: true }
  }
  async function deleteShift(id: string) {
    await window.api.shift.delete(id)
    shifts.value = shifts.value.filter(s => s.id !== id)
  }
  async function setDefaultShift(id: string) {
    await window.api.shift.setDefault(id)
    shifts.value = shifts.value.map(s => ({ ...s, is_default: s.id === id ? 1 : 0 }))
  }
  async function fetchWorkRule(userId: string, workDate: string) {
    workRule.value = await window.api.shift.workRule(userId, workDate)
  }

  // ── 排班 ──────────────────────────────────────────────────
  async function fetchSchedules(startDate: string, endDate: string, userId?: string) {
    schedules.value = await window.api.schedule.list(startDate, endDate, userId)
  }
  async function createSchedule(data: unknown) {
    const res = await window.api.schedule.create(data)
    if (res.ok) schedules.value.push(res.row)
    return res
  }
  async function updateSchedule(id: string, data: unknown) {
    const res = await window.api.schedule.update(id, data)
    if (res.ok) {
      const idx = schedules.value.findIndex(s => s.id === id)
      if (idx !== -1) Object.assign(schedules.value[idx], data)
    }
    return res
  }
  async function removeSchedule(id: string) {
    await window.api.schedule.delete(id)
    schedules.value = schedules.value.filter(s => s.id !== id)
  }

  // ── 打卡 ──────────────────────────────────────────────────
  async function fetchToday(userId: string, date: string) {
    todayRecords.value = await window.api.attendance.today(userId, date)
  }
  async function fetchRange(startDate: string, endDate: string, userId?: string) {
    loading.value = true
    try { rangeRecords.value = await window.api.attendance.range(startDate, endDate, userId) }
    finally { loading.value = false }
  }
  async function clock(data: { userId: string; clockType: 'clock_in' | 'clock_out'; clockAt: string; remark?: string | null }) {
    const res = await window.api.attendance.clock(data)
    if (res.ok) todayRecords.value.push(res.row)
    return res
  }

  // ── 请假 ──────────────────────────────────────────────────
  async function fetchLeaves(userId?: string, status?: string) {
    leaves.value = await window.api.leaveApply.list(userId, status)
  }
  async function createLeave(data: unknown) {
    const row = await window.api.leaveApply.create(data)
    leaves.value.unshift(row)
    return row
  }
  async function approveLeave(id: string, approved: boolean, remark?: string) {
    await window.api.leaveApply.approve(id, approved, remark)
    const idx = leaves.value.findIndex(l => l.id === id)
    if (idx !== -1) leaves.value[idx] = { ...leaves.value[idx], status: approved ? 'approved' : 'rejected' }
  }

  return {
    shifts, schedules, todayRecords, rangeRecords, leaves, workRule, loading,
    fetchShifts, createShift, updateShift, deleteShift, setDefaultShift, fetchWorkRule,
    fetchSchedules, createSchedule, updateSchedule, removeSchedule,
    fetchToday, fetchRange, clock,
    fetchLeaves, createLeave, approveLeave,
  }
})
