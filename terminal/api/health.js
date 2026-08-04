/**
 * health.js — 健康监测 API
 */
import { get, post } from './request'

/** 获取老人健康数据列表 */
export function getHealthList(params = {}) {
  return get('/health/monitor/list', params)
}

/** 获取单个老人最新健康数据 */
export function getLatestHealth(elderlyId) {
  return get(`/health/monitor/latest/${elderlyId}`)
}

/** 提交健康数据 */
export function submitHealthData(data) {
  return post('/health/monitor', data)
}

/** 获取健康趋势（按日期范围） */
export function getHealthTrend(elderlyId, startDate, endDate) {
  return get('/health/monitor/trend', { elderlyId, startDate, endDate })
}

/** 获取告警（健康异常）列表 */
export function getHealthAlerts(params = {}) {
  return get('/health/alert/list', params)
}

/** 标记告警已读 */
export function readAlert(alertId) {
  return post(`/health/alert/read/${alertId}`)
}

/** 批量标记告警已读 */
export function readAllAlerts() {
  return post('/health/alert/readAll')
}

/** 获取老人基本信息列表 */
export function getElderlyList(params = {}) {
  return get('/elderly/list', params)
}

/** 获取单个老人信息 */
export function getElderlyDetail(elderlyId) {
  return get(`/elderly/${elderlyId}`)
}
