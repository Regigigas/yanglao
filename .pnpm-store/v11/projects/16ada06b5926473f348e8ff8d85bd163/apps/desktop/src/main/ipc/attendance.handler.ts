// apps/desktop/src/main/ipc/attendance.handler.ts
// 考勤 IPC 处理器：班次 / 排班 / 打卡 / 请假

import type { IpcMain } from 'electron'
import type { AttendanceRepo } from '@yanglao/db'
import { session } from './auth.handler'

function timeToMinutes(value: string): number {
  const match = /^(\d{2}):(\d{2})/.exec(value)
  if (!match) return Number.NaN
  return Number(match[1]) * 60 + Number(match[2])
}

function validateShiftTimes(data: { start_time?: string; end_time?: string }): void {
  if (data.start_time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(data.start_time)) {
    throw new Error('上班时间格式应为 HH:mm')
  }
  if (data.end_time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(data.end_time)) {
    throw new Error('下班时间格式应为 HH:mm')
  }
  if (data.start_time && data.end_time && timeToMinutes(data.start_time) >= timeToMinutes(data.end_time)) {
    throw new Error('下班时间必须晚于上班时间')
  }
}

export function registerAttendanceHandlers(ipc: IpcMain, repo: AttendanceRepo): void {
  // ── 班次 ──────────────────────────────────────────────────
  ipc.handle('shift:list', () => repo.findAllShifts())
  ipc.handle('shift:create', (_e, data: { start_time: string; end_time: string }) => {
    validateShiftTimes(data)
    return repo.insertShift(data as never)
  })
  ipc.handle('shift:update', (_e, { id, data }: { id: string; data: unknown }) => {
    validateShiftTimes(data as { start_time?: string; end_time?: string })
    repo.updateShift(id, data as never)
    return { ok: true }
  })
  ipc.handle('shift:delete', (_e, id: string) => {
    repo.deleteShift(id)
    return { ok: true }
  })
  ipc.handle('shift:set-default', (_e, id: string) => {
    repo.setDefaultShift(id)
    return { ok: true }
  })
  ipc.handle('shift:work-rule', (_e, userId: string, workDate: string) =>
    repo.resolveWorkShift(userId, workDate)
  )

  // ── 排班 ──────────────────────────────────────────────────
  ipc.handle('schedule:list', (_e, startDate: string, endDate: string, userId?: string) =>
    repo.findSchedules(startDate, endDate, userId)
  )
  ipc.handle('schedule:get', (_e, id: string) => repo.findScheduleById(id))
  ipc.handle('schedule:create', (_e, data) => {
    try {
      return { ok: true, row: repo.insertSchedule(data as never) }
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : '排班失败（该日期该班次可能已存在）' }
    }
  })
  ipc.handle('schedule:update', (_e, { id, data }) => {
    try {
      repo.updateSchedule(id, data as never)
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : '更新失败' }
    }
  })
  ipc.handle('schedule:delete', (_e, id: string) => {
    repo.deleteSchedule(id)
    return { ok: true }
  })

  // ── 打卡 ──────────────────────────────────────────────────
  ipc.handle('attendance:today', (_e, userId: string, date: string) => repo.findTodayAttendance(userId, date))
  ipc.handle('attendance:range', (_e, startDate: string, endDate: string, userId?: string) =>
    repo.findAttendanceByRange(startDate, endDate, userId)
  )
  ipc.handle('attendance:clock', (_e, { userId, clockType, clockAt, remark }: {
    userId: string
    clockType: 'clock_in' | 'clock_out'
    clockAt: string
    remark?: string | null
  }) => {
    const clockDate = clockAt.slice(0, 10)
    const today = repo.findTodayAttendance(userId, clockDate)
    if (today.some(a => a.clock_type === clockType)) {
      return { ok: false, error: clockType === 'clock_in' ? '今日已上班打卡' : '今日已下班打卡' }
    }
    const workRule = repo.resolveWorkShift(userId, clockDate)
    if (!workRule) return { ok: false, error: '尚未设置上班时间，请先配置班次' }

    const actualMinutes = timeToMinutes(clockAt.slice(11, 16))
    const scheduledMinutes = timeToMinutes(
      clockType === 'clock_in' ? workRule.shift.start_time : workRule.shift.end_time
    )
    if (!Number.isFinite(actualMinutes) || !Number.isFinite(scheduledMinutes)) {
      return { ok: false, error: '打卡时间或班次时间格式无效' }
    }
    const status = clockType === 'clock_in'
      ? actualMinutes > scheduledMinutes ? 'late' : 'normal'
      : actualMinutes < scheduledMinutes ? 'early_leave' : 'normal'
    const row = repo.insertAttendance({
      user_id: userId,
      clock_date: clockDate,
      clock_type: clockType,
      clock_at: clockAt,
      status,
      remark: remark ?? null,
    })
    return { ok: true, row, workRule }
  })

  // ── 请假 ──────────────────────────────────────────────────
  ipc.handle('leave:list', (_e, userId?: string, status?: string) => repo.findLeaves(userId, status))
  ipc.handle('leave:create', (_e, data) => repo.insertLeave(data as never))
  ipc.handle('leave:approve', (_e, { id, approved, remark }: { id: string; approved: boolean; remark?: string }) => {
    if (!session.user) return { ok: false, error: '未登录' }
    repo.approveLeave(id, session.user.id, approved, remark)
    return { ok: true }
  })
}
