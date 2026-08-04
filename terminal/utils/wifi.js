/**
 * wifi.js — WiFi 工具类
 * 封装 uni-app WiFi API，用于连接设备局域网
 */
import { useDeviceStore } from '../store/device'

/** 初始化 WiFi 模块 */
export function initWifi() {
  return new Promise((resolve, reject) => {
    uni.startWifi({
      success: resolve,
      fail:    err => reject(new Error(err.errMsg || 'WiFi 初始化失败'))
    })
  })
}

/** 获取当前已连接的 WiFi 信息 */
export function getConnectedWifi() {
  return new Promise((resolve, reject) => {
    uni.getConnectedWifi({
      partialInfo: false,
      success(res) {
        const store = useDeviceStore()
        store.setWifiInfo(res.wifi)
        resolve(res.wifi)
      },
      fail(err) {
        const store = useDeviceStore()
        store.setWifiInfo(null)
        reject(new Error(err.errMsg || '未连接 WiFi'))
      }
    })
  })
}

/** 扫描周边 WiFi 列表 */
export function scanWifiList() {
  return new Promise((resolve, reject) => {
    uni.onGetWifiList((res) => {
      resolve(res.wifiList || [])
    })

    uni.getWifiList({
      success() {},
      fail: err => reject(new Error(err.errMsg || '扫描 WiFi 失败'))
    })
  })
}

/**
 * 连接指定 WiFi
 * @param {string} SSID
 * @param {string} password
 * @param {string} [BSSID]
 */
export function connectWifi(SSID, password, BSSID = '') {
  return new Promise((resolve, reject) => {
    const params = {
      SSID,
      password,
      success(res) {
        uni.showToast({ title: `已连接 ${SSID}`, icon: 'success' })
        resolve(res)
      },
      fail(err) {
        reject(new Error(err.errMsg || '连接 WiFi 失败'))
      }
    }
    if (BSSID) params.BSSID = BSSID
    uni.connectWifi(params)
  })
}

/** 关闭 WiFi 模块 */
export function closeWifi() {
  uni.stopWifi()
}

/** 获取网络类型（wifi / cellular / none） */
export function getNetworkType() {
  return new Promise((resolve, reject) => {
    uni.getNetworkType({
      success: res => resolve(res.networkType),
      fail:    err => reject(new Error(err.errMsg))
    })
  })
}

/** 监听网络状态变化 */
export function onNetworkStatusChange(callback) {
  uni.onNetworkStatusChange(callback)
}
