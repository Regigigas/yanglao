/**
 * purchase.js — 采购管理 API
 */
import { get, post, put } from './request'

/** 获取供应商列表 */
export function getSupplierList(params = {}) {
  return get('/purchase/supplier/list', params)
}

/** 获取采购单列表 */
export function getPurchaseOrderList(params = {}) {
  return get('/purchase/order/list', params)
}

/** 获取采购单详情 */
export function getPurchaseOrderDetail(orderId) {
  return get(`/purchase/order/${orderId}`)
}

/** 获取采购单明细 */
export function getPurchaseOrderItems(orderId) {
  return get(`/purchase/order/${orderId}/items`)
}

/** 新建采购申请 */
export function createPurchaseRequest(data) {
  return post('/purchase/order', data)
}

/** 更新采购单状态 */
export function updatePurchaseStatus(orderId, status) {
  return put(`/purchase/order/${orderId}/status`, { status })
}

/** 审批采购单 */
export function approvePurchaseOrder(orderId, approved, remark) {
  return post(`/purchase/order/${orderId}/approve`, { approved, remark })
}

/** 采购统计 */
export function getPurchaseStats(params = {}) {
  return get('/purchase/order/stats', params)
}
