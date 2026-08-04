/**
 * bluetooth.js — 蓝牙 BLE 工具类
 * 封装 uni-app 蓝牙 API，用于连接护理监测设备
 */
import { useDeviceStore } from '../store/device'

/** 初始化蓝牙适配器 */
export function initBluetooth() {
  return new Promise((resolve, reject) => {
    uni.openBluetoothAdapter({
      success(res) {
        const store = useDeviceStore()
        store.btAdapterAvailable = true
        resolve(res)
      },
      fail(err) {
        const store = useDeviceStore()
        store.btAdapterAvailable = false
        const msg = err.errCode === 10001
          ? '蓝牙未开启，请开启手机蓝牙'
          : '蓝牙初始化失败：' + (err.errMsg || '')
        reject(new Error(msg))
      }
    })
  })
}

/** 开始扫描蓝牙设备 */
export function startScan(services = []) {
  const store = useDeviceStore()
  store.btFoundDevices = []
  store.btScanning = true

  return new Promise((resolve, reject) => {
    // 监听发现新设备
    uni.onBluetoothDeviceFound((result) => {
      const devices = result.devices || []
      devices.forEach(device => {
        if (!device.name && !device.localName) return
        const exists = store.btFoundDevices.find(d => d.deviceId === device.deviceId)
        if (!exists) {
          store.btFoundDevices.push({
            deviceId:  device.deviceId,
            name:      device.name || device.localName || '未知设备',
            RSSI:      device.RSSI,
            connected: false
          })
        }
      })
    })

    uni.startBluetoothDevicesDiscovery({
      services,
      allowDuplicatesKey: false,
      success: resolve,
      fail(err) {
        store.btScanning = false
        reject(new Error(err.errMsg || '扫描启动失败'))
      }
    })
  })
}

/** 停止扫描 */
export function stopScan() {
  const store = useDeviceStore()
  store.btScanning = false
  uni.stopBluetoothDevicesDiscovery()
  uni.offBluetoothDeviceFound()
}

/**
 * 连接 BLE 设备
 * @param {string} deviceId
 */
export function connectDevice(deviceId) {
  return new Promise((resolve, reject) => {
    uni.createBLEConnection({
      deviceId,
      timeout: 10000,
      success(res) {
        const store = useDeviceStore()
        const device = store.btFoundDevices.find(d => d.deviceId === deviceId)
        store.setBluetoothDevice({
          deviceId,
          name: device?.name || deviceId,
          connectedAt: new Date().toISOString()
        })
        // 监听连接断开
        uni.onBLEConnectionStateChange((result) => {
          if (!result.connected && result.deviceId === deviceId) {
            store.clearBluetoothDevice()
            uni.showToast({ title: '蓝牙设备已断开', icon: 'none' })
          }
        })
        resolve(res)
      },
      fail(err) {
        reject(new Error(err.errMsg || '连接失败'))
      }
    })
  })
}

/** 断开 BLE 连接 */
export function disconnectDevice(deviceId) {
  return new Promise((resolve, reject) => {
    uni.closeBLEConnection({
      deviceId,
      success(res) {
        const store = useDeviceStore()
        store.clearBluetoothDevice()
        resolve(res)
      },
      fail(err) {
        reject(new Error(err.errMsg || '断开失败'))
      }
    })
  })
}

/**
 * 获取 BLE 设备服务列表
 * @param {string} deviceId
 */
export function getServices(deviceId) {
  return new Promise((resolve, reject) => {
    uni.getBLEDeviceServices({
      deviceId,
      success: res => resolve(res.services || []),
      fail:    err => reject(new Error(err.errMsg))
    })
  })
}

/** 读取 BLE 特征值（接收设备上报数据） */
export function readCharacteristic(deviceId, serviceId, characteristicId) {
  return new Promise((resolve, reject) => {
    uni.readBLECharacteristicValue({
      deviceId, serviceId, characteristicId,
      success: resolve,
      fail:    err => reject(new Error(err.errMsg))
    })
  })
}

/** 监听 BLE 特征值变化（实时数据推送） */
export function onCharacteristicValueChange(callback) {
  uni.onBLECharacteristicValueChange(callback)
}

/** 关闭蓝牙适配器 */
export function closeBluetooth() {
  uni.closeBluetoothAdapter()
  const store = useDeviceStore()
  store.btAdapterAvailable = false
  store.btConnectedDevice  = null
  store.btScanning         = false
  store.btFoundDevices     = []
}
