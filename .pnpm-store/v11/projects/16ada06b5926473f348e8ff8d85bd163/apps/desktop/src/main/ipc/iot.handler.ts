// apps/desktop/src/main/ipc/iot.handler.ts
// 物联网设备 IPC 处理器：设备注册管理 + 数据上报接收
//
// WiFi 设备接入方式：设备在局域网内以固定 IP/端口注册后，本机作为接收端，
// 设备主动 POST 数据到局域网主机的 HTTP 接口（见 lan-server.ts 的 /iot/report 路由），
// 该路由内部会调用本文件导出的 handleDeviceReport 完成入库，同时也可在渲染进程手动调用 iot:report 模拟上报测试。
// 蓝牙设备：本阶段仅支持设备档案登记（conn_type='bluetooth'），暂无实际蓝牙数据接入。

import type { IpcMain } from 'electron'
import type { IotRepo, TaskReminderRepo } from '@yanglao/db'

export function registerIotHandlers(ipc: IpcMain, repo: IotRepo, reminderRepo: TaskReminderRepo): void {
  ipc.handle('iot:device:list', () => repo.findAllDevices())
  ipc.handle('iot:device:create', (_e, data) => repo.insertDevice(data))
  ipc.handle('iot:device:update', (_e, { id, data }) => { repo.updateDevice(id, data); return { ok: true } })
  ipc.handle('iot:device:delete', (_e, id: string) => { repo.deleteDevice(id); return { ok: true } })

  ipc.handle('iot:data:list', (_e, deviceId: string, limit?: number) => repo.findDeviceData(deviceId, limit))
  ipc.handle('iot:data:list:elderly', (_e, elderlyId: string, limit?: number) => repo.findDeviceDataByElderly(elderlyId, limit))
  ipc.handle('iot:alert:list', (_e, includeResolved?: boolean) => repo.findAlerts(includeResolved))
  ipc.handle('iot:health:check', () => repo.checkHealth())
  ipc.handle('iot:alert:create', (_e, data) => repo.createManualAlert(data))
  ipc.handle('iot:alert:sync-reminder', (_e, { alertId, userId }: { alertId: string; userId: string }) => {
    return syncAlertToReminder(repo, reminderRepo, alertId, userId)
  })
  ipc.handle('iot:alert:start-repair', (_e, id: string) => { repo.startAlertRepair(id); return { ok: true } })
  ipc.handle('iot:alert:resolve', (_e, id: string) => {
    repo.resolveAlert(id)
    const reminder = reminderRepo.findByMaintenanceAlertId(id)
    if (reminder?.status === 'active') reminderRepo.markDone(reminder.id)
    return { ok: true }
  })

  // 渲染进程手动模拟上报（用于测试联调，实际生产环境数据由设备通过局域网 HTTP 接口上报）
  ipc.handle('iot:report', (_e, payload: { deviceId: string; elderlyId?: string | null; data: Record<string, unknown> }) => {
    return handleDeviceReport(repo, payload)
  })
}

/** 将维修事项幂等同步为当前处理人的持续任务提醒。 */
export function syncAlertToReminder(repo: IotRepo, reminderRepo: TaskReminderRepo, alertId: string, userId: string) {
  const existing = reminderRepo.findByMaintenanceAlertId(alertId)
  if (existing) return { reminder: existing, created: false }
  const alert = repo.findAlertById(alertId)
  if (!alert) throw new Error('维修事项不存在')
  const nextMinute = new Date(Date.now() + 60_000)
  const pad = (value: number) => String(value).padStart(2, '0')
  const reminder = reminderRepo.insert({
    title: `维修：${alert.device_name ?? '设备'} - ${alert.title}`,
    description: alert.content,
    remind_date: `${nextMinute.getFullYear()}-${pad(nextMinute.getMonth() + 1)}-${pad(nextMinute.getDate())}`,
    remind_at: `${pad(nextMinute.getHours())}:${pad(nextMinute.getMinutes())}`,
    repeat_type: 'daily',
    repeat_days: null,
    creator_id: userId,
    assignee_id: userId,
    status: 'active',
    schedule_id: null,
    maintenance_alert_id: alert.id,
  })
  return { reminder, created: true }
}

/** 供 lan-server.ts 的 HTTP 路由复用：接收到设备数据后统一走这里入库并刷新设备在线状态 */
export function handleDeviceReport(
  repo: IotRepo,
  payload: { deviceId: string; elderlyId?: string | null; data: Record<string, unknown> }
) {
  const device = repo.findDeviceById(payload.deviceId)
  if (!device) return { ok: false, error: '设备不存在，请先在设备管理中注册' }
  const row = repo.insertDeviceData({
    device_id: payload.deviceId,
    elderly_id: payload.elderlyId ?? device.elderly_id ?? null,
    data: JSON.stringify(payload.data),
    reported_at: Date.now(),
  })
  return { ok: true, row }
}
