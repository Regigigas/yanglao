// apps/desktop/src/renderer/src/stores/purchase.store.ts
// 采购管理：供应商 + 采购单

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SupplierRow, PurchaseOrderRow, PurchaseOrderItemRow } from '@yanglao/db'

export const usePurchaseStore = defineStore('purchase', () => {
  const suppliers    = ref<SupplierRow[]>([])
  const orders       = ref<PurchaseOrderRow[]>([])
  const orderItems   = ref<PurchaseOrderItemRow[]>([])
  const loading      = ref(false)

  // ── 供应商 ──────────────────────────────────────
  async function fetchSuppliers() {
    loading.value = true
    try { suppliers.value = await window.api.purchase.supplier.list() }
    finally { loading.value = false }
  }

  async function createSupplier(data: Partial<SupplierRow>) {
    const row = await window.api.purchase.supplier.create(data)
    suppliers.value.unshift(row)
    return row
  }

  async function updateSupplier(id: string, data: Partial<SupplierRow>) {
    await window.api.purchase.supplier.update(id, data)
    const idx = suppliers.value.findIndex(s => s.id === id)
    if (idx !== -1) suppliers.value[idx] = { ...suppliers.value[idx], ...data }
  }

  async function deleteSupplier(id: string) {
    await window.api.purchase.supplier.delete(id)
    suppliers.value = suppliers.value.filter(s => s.id !== id)
  }

  // ── 采购单 ──────────────────────────────────────
  async function fetchOrders(status?: string) {
    loading.value = true
    try { orders.value = await window.api.purchase.order.list(status) }
    finally { loading.value = false }
  }

  async function createOrder(
    order: Partial<PurchaseOrderRow>,
    items: Partial<PurchaseOrderItemRow>[]
  ) {
    const row = await window.api.purchase.order.create(order, items)
    orders.value.unshift(row)
    return row
  }

  async function updateOrderStatus(id: string, status: PurchaseOrderRow['status'], remark?: string) {
    await window.api.purchase.order.updateStatus(id, status, remark)
    const order = orders.value.find(o => o.id === id)
    if (order) order.status = status
  }

  async function fetchOrderItems(orderId: string) {
    orderItems.value = await window.api.purchase.order.items(orderId)
  }

  async function deleteOrder(id: string) {
    await window.api.purchase.order.delete(id)
    orders.value = orders.value.filter(o => o.id !== id)
  }

  // ── 统计 ──────────────────────────────────────
  async function getStats() {
    return window.api.purchase.order.stats() as Promise<{
      total: number
      draft: number
      pending: number
      approved: number
      received: number
      total_amount: number
    }>
  }

  return {
    suppliers, orders, orderItems, loading,
    fetchSuppliers, createSupplier, updateSupplier, deleteSupplier,
    fetchOrders, createOrder, updateOrderStatus, fetchOrderItems, deleteOrder,
    getStats,
  }
})
