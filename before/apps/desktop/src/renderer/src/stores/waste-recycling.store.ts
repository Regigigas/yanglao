import { defineStore } from 'pinia'
import { ref } from 'vue'
import type {
  WasteCategoryRow,
  WasteInventoryLotRow,
  WasteInventoryTransactionRow,
  WasteOrderQuery,
  WastePointsLedgerRow,
  WasteRecyclingItemRow,
  WasteRecyclingOrderRow,
  WasteRecyclingStats,
  WasteSettlementInput,
  WasteSettlementRow,
  WasteWeighItemInput,
} from '@yanglao/db'

const emptyStats = (): WasteRecyclingStats => ({
  total_orders: 0,
  pending_orders: 0,
  completed_orders: 0,
  total_weight: 0,
  total_amount_cents: 0,
  total_points: 0,
  inventory_weight: 0,
  by_category: [],
  monthly_trend: [],
})

export const useWasteRecyclingStore = defineStore('waste-recycling', () => {
  const categories = ref<WasteCategoryRow[]>([])
  const orders = ref<WasteRecyclingOrderRow[]>([])
  const currentItems = ref<WasteRecyclingItemRow[]>([])
  const currentSettlement = ref<WasteSettlementRow | null>(null)
  const inventory = ref<WasteInventoryLotRow[]>([])
  const inventoryTransactions = ref<WasteInventoryTransactionRow[]>([])
  const pointsLedger = ref<WastePointsLedgerRow[]>([])
  const stats = ref<WasteRecyclingStats>(emptyStats())
  const loading = ref(false)

  async function fetchCategories(activeOnly = false) {
    categories.value = await window.api.wasteRecycling.category.list(activeOnly)
  }

  async function createCategory(data: Partial<WasteCategoryRow>) {
    const row = await window.api.wasteRecycling.category.create(data)
    await fetchCategories()
    return row as WasteCategoryRow
  }

  async function updateCategory(id: string, data: Partial<WasteCategoryRow>) {
    const row = await window.api.wasteRecycling.category.update(id, data)
    await fetchCategories()
    return row as WasteCategoryRow
  }

  async function deleteCategory(id: string) {
    await window.api.wasteRecycling.category.delete(id)
    await fetchCategories()
  }

  async function fetchOrders(query: WasteOrderQuery = {}) {
    loading.value = true
    try { orders.value = await window.api.wasteRecycling.order.list(query) }
    finally { loading.value = false }
  }

  async function createOrder(data: Partial<WasteRecyclingOrderRow>) {
    const row = await window.api.wasteRecycling.order.create(data)
    await Promise.all([fetchOrders(), fetchStats()])
    return row as WasteRecyclingOrderRow
  }

  async function assign(id: string, assigneeId: string, assigneeName: string) {
    await window.api.wasteRecycling.order.assign(id, assigneeId, assigneeName)
    await fetchOrders()
  }

  async function start(id: string) {
    await window.api.wasteRecycling.order.start(id)
    await fetchOrders()
  }

  async function weigh(id: string, items: WasteWeighItemInput[]) {
    await window.api.wasteRecycling.order.weigh(id, items)
    await Promise.all([fetchOrders(), fetchStats()])
  }

  async function settle(id: string, data: WasteSettlementInput) {
    const row = await window.api.wasteRecycling.order.settle(id, data)
    await Promise.all([fetchOrders(), fetchInventory(), fetchPoints(), fetchStats()])
    return row as WasteSettlementRow
  }

  async function complete(id: string) {
    await window.api.wasteRecycling.order.complete(id)
    await Promise.all([fetchOrders(), fetchStats()])
  }

  async function cancel(id: string, reason: string) {
    await window.api.wasteRecycling.order.cancel(id, reason)
    await Promise.all([fetchOrders(), fetchStats()])
  }

  async function fetchOrderDetail(id: string) {
    const [items, settlement] = await Promise.all([
      window.api.wasteRecycling.order.items(id),
      window.api.wasteRecycling.settlement.get(id),
    ])
    currentItems.value = items
    currentSettlement.value = settlement
  }

  async function fetchInventory(status?: WasteInventoryLotRow['status']) {
    inventory.value = await window.api.wasteRecycling.inventory.list(status)
  }

  async function fetchInventoryTransactions(lotId: string) {
    inventoryTransactions.value = await window.api.wasteRecycling.inventory.transactions(lotId)
  }

  async function transactInventory(lotId: string, data: Partial<WasteInventoryTransactionRow>) {
    const row = await window.api.wasteRecycling.inventory.transact(lotId, data)
    await Promise.all([fetchInventory(), fetchInventoryTransactions(lotId), fetchStats()])
    return row as WasteInventoryTransactionRow
  }

  async function fetchPoints(elderlyId?: string) {
    pointsLedger.value = await window.api.wasteRecycling.points.list(elderlyId)
  }

  async function fetchStats(startDate?: string, endDate?: string) {
    stats.value = await window.api.wasteRecycling.stats(startDate, endDate)
  }

  async function refreshAll(query: WasteOrderQuery = {}) {
    await Promise.all([
      fetchCategories(),
      fetchOrders(query),
      fetchInventory(),
      fetchPoints(),
      fetchStats(query.startDate, query.endDate),
    ])
  }

  return {
    categories, orders, currentItems, currentSettlement, inventory, inventoryTransactions,
    pointsLedger, stats, loading, fetchCategories, createCategory, updateCategory, deleteCategory,
    fetchOrders, createOrder, assign, start, weigh, settle, complete, cancel, fetchOrderDetail,
    fetchInventory, fetchInventoryTransactions, transactInventory, fetchPoints, fetchStats, refreshAll,
  }
})
