// apps/desktop/src/renderer/src/stores/iot.store.ts
// 物联网设备：设备注册管理 + 数据上报查询

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { IotDeviceAlertRow, IotDeviceDataRow, IotDeviceRow } from '@yanglao/db'

export const useIotStore = defineStore('iot', () => {
  const devices = ref<IotDeviceRow[]>([])
  const deviceData = ref<IotDeviceDataRow[]>([])
  const alerts = ref<IotDeviceAlertRow[]>([])
  const loading = ref(false)

  async function fetchDevices() {
    loading.value = true
    try { devices.value = await window.api.iot.device.list() }
    finally { loading.value = false }
  }

  async function createDevice(data: unknown) {
    const row = await window.api.iot.device.create(data)
    devices.value.unshift(row)
    return row
  }

  async function updateDevice(id: string, data: unknown) {
    await window.api.iot.device.update(id, data)
    const idx = devices.value.findIndex(d => d.id === id)
    if (idx !== -1) devices.value[idx] = { ...devices.value[idx], ...(data as object) }
  }

  async function removeDevice(id: string) {
    await window.api.iot.device.delete(id)
    devices.value = devices.value.filter(d => d.id !== id)
  }

  async function fetchDeviceData(deviceId: string, limit?: number) {
    deviceData.value = await window.api.iot.data.list(deviceId, limit)
  }

  async function fetchDeviceDataByElderly(elderlyId: string, limit?: number) {
    deviceData.value = await window.api.iot.data.listByElderly(elderlyId, limit)
  }

  async function checkHealth() {
    const result = await window.api.iot.alert.check()
    alerts.value = result.alerts
    return result.opened as IotDeviceAlertRow[]
  }

  async function fetchAlerts(includeResolved = false) {
    alerts.value = await window.api.iot.alert.list(includeResolved)
  }

  async function createManualAlert(data: unknown) {
    const row = await window.api.iot.alert.create(data)
    alerts.value.unshift(row)
    return row as IotDeviceAlertRow
  }

  async function syncAlertToReminder(alertId: string, userId: string) {
    return window.api.iot.alert.syncReminder(alertId, userId) as Promise<{ created: boolean }>
  }

  async function startAlertRepair(id: string) {
    await window.api.iot.alert.startRepair(id)
    await fetchAlerts()
  }

  async function resolveAlert(id: string) {
    await window.api.iot.alert.resolve(id)
    await fetchAlerts()
  }

  /** 手动模拟上报，用于设备联调测试 */
  async function simulateReport(deviceId: string, elderlyId: string | null, data: Record<string, unknown>) {
    return window.api.iot.report({ deviceId, elderlyId, data })
  }

  return {
    devices, deviceData, alerts, loading,
    fetchDevices, createDevice, updateDevice, removeDevice,
    fetchDeviceData, fetchDeviceDataByElderly, checkHealth, fetchAlerts, createManualAlert, syncAlertToReminder,
    startAlertRepair, resolveAlert, simulateReport,
  }
})
