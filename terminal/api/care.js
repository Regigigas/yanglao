/**
 * care.js — 护理服务 API
 */
import { get, post, put, del } from './request'

/** 获取护理任务列表 */
export function getCareTaskList(params = {}) {
  return get('/care/task/list', params)
}

/** 获取我的待办任务 */
export function getMyTasks(params = {}) {
  return get('/care/task/myTask', params)
}

/** 获取任务详情 */
export function getTaskDetail(taskId) {
  return get(`/care/task/${taskId}`)
}

/** 开始执行任务 */
export function startTask(taskId) {
  return put(`/care/task/start/${taskId}`)
}

/** 完成任务 */
export function completeTask(taskId, remark = '') {
  return put('/care/task/complete', { taskId, remark })
}

/** 获取护理记录列表 */
export function getCareRecordList(params = {}) {
  return get('/care/record/list', params)
}

/** 新增护理记录 */
export function addCareRecord(data) {
  return post('/care/record', data)
}

/** 获取护理记录详情 */
export function getCareRecordDetail(recordId) {
  return get(`/care/record/${recordId}`)
}

/** 获取护理项目列表 */
export function getCareItemList() {
  return get('/care/item/list')
}

/** 更新护理记录 */
export function updateCareRecord(recordId, data) {
  return put(`/care/record/${recordId}`, data)
}

/** 删除护理记录 */
export function deleteCareRecord(recordId) {
  return del(`/care/record/${recordId}`)
}

/** 获取通知公告 */
export function getNoticeList(params = {}) {
  return get('/system/notice/list', params)
}
