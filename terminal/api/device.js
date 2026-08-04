/**
 * device.js — IoT 设备 API
 * 对接后台设备管理模块
 */
import { get, post, put, del } from './request'

/** 获取设备列表 */
export function getDeviceList(params = {}) {
  return get('/iot/device/list', params)
}

/** 获取设备详情 */
export function getDeviceDetail(deviceId) {
  return get(`/iot/device/${deviceId}`)
}

/** 注册/添加设备 */
export function addDevice(data) {
  return post('/iot/device', data)
}

/** 更新设备信息 */
export function updateDevice(data) {
  return put('/iot/device', data)
}

/** 删除设备 */
export function deleteDevice(deviceId) {
  return del(`/iot/device/${deviceId}`)
}

/** 绑定设备到老人 */
export function bindDeviceToElderly(deviceId, elderlyId) {
  return post('/iot/device/bind', { deviceId, elderlyId })
}

/** 解绑设备 */
export function unbindDevice(deviceId) {
  return post('/iot/device/unbind', { deviceId })
}

/** 上报设备数据 */
export function reportDeviceData(data) {
  return post('/iot/device/report', data)
}

/** 获取设备实时数据 */
export function getDeviceData(deviceId, limit = 20) {
  return get('/iot/data/list', { deviceId, pageSize: limit })
}

/** 获取告警列表 */
export function getAlertList(params = {}) {
  return get('/iot/alert/list', params)
}

/** 处理告警 */
export function resolveAlert(alertId) {
  return put(`/iot/alert/resolve/${alertId}`)
}

/** 终端注册（将当前终端设备注册到后台）*/
export function registerTerminal(data) {
  return post('/iot/terminal/register', data)
}

/** 终端心跳保活 */
export function terminalHeartbeat(terminalId) {
  return post('/iot/terminal/heartbeat', { terminalId })
}
