/**
 * device.js — 设备状态管理
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getDeviceList, getAlertList } from '../api/device'

export const useDeviceStore = defineStore('device', () => {
  const devices  = ref([])
  const alerts   = ref([])
  const loading  = ref(false)

  // 蓝牙连接状态
  const btAdapterAvailable = ref(false)
  const btConnectedDevice  = ref(null)  // { deviceId, name, ... }
  const btScanning         = ref(false)
  const btFoundDevices     = ref([])

  // WiFi 连接状态
  const wifiConnected  = ref(false)
  const wifiInfo       = ref(null)

  // 终端自身 ID（注册到后台后获得）
  const terminalId = ref(uni.getStorageSync('yl_terminal_id') || '')

  const unreadAlerts = computed(() =>
    alerts.value.filter(a => !a.resolved && !a.read).length
  )

  const onlineDevices = computed(() =>
    devices.value.filter(d => d.status === 'online').length
  )

  async function fetchDevices() {
    loading.value = true
    try {
      const res = await getDeviceList()
      devices.value = res.rows || res.data || []
    } finally {
      loading.value = false
    }
  }

  async function fetchAlerts() {
    const res = await getAlertList({ resolved: false })
    alerts.value = res.rows || res.data || []
  }

  function setTerminalId(id) {
    terminalId.value = id
    uni.setStorageSync('yl_terminal_id', id)
  }

  function setBluetoothDevice(device) {
    btConnectedDevice.value = device
  }

  function clearBluetoothDevice() {
    btConnectedDevice.value = null
  }

  function setWifiInfo(info) {
    wifiInfo.value = info
    wifiConnected.value = !!info
  }

  return {
    devices, alerts, loading,
    btAdapterAvailable, btConnectedDevice, btScanning, btFoundDevices,
    wifiConnected, wifiInfo, terminalId,
    unreadAlerts, onlineDevices,
    fetchDevices, fetchAlerts, setTerminalId,
    setBluetoothDevice, clearBluetoothDevice, setWifiInfo
  }
})
