<script setup lang="ts">
import { computed, h, onMounted, ref } from 'vue'
import {
  NButton, NCard, NDatePicker, NDescriptions, NDescriptionsItem, NDivider, NForm,
  NFormItem, NGi, NGrid, NInput, NInputNumber, NModal, NPopconfirm, NSelect, NSpace,
  NStatistic, NTabPane, NTabs, NTag, useMessage,
} from 'naive-ui'
import BasePage from '@ui/components/BasePage.vue'
import BaseTable from '@ui/components/BaseTable.vue'
import type {
  ElderlyRow, UserRow, WasteCategoryRow, WasteInventoryLotRow, WasteInventoryTransactionRow,
  WasteOrderStatus, WastePointsLedgerRow, WasteRecyclingItemRow, WasteRecyclingOrderRow,
} from '@yanglao/db'
import { useAuthStore } from '../../stores/auth.store'
import { useWasteRecyclingStore } from '../../stores/waste-recycling.store'

type SafeUser = Omit<UserRow, 'password_hash' | 'password_salt'>
type WeighDraft = {
  category_id: string | null
  material_name: string
  gross_weight: number | null
  tare_weight: number
  unit_price_yuan: number
  quality_grade: 'excellent' | 'normal' | 'mixed'
  remark: string
}

const store = useWasteRecyclingStore()
const auth = useAuthStore()
const message = useMessage()
const users = ref<SafeUser[]>([])
const elderly = ref<ElderlyRow[]>([])
const activeTab = ref('orders')
const refreshing = ref(false)

const statusMap: Record<WasteOrderStatus, { label: string; type: 'default' | 'info' | 'warning' | 'success' | 'error' }> = {
  pending: { label: '待派单', type: 'warning' },
  assigned: { label: '已派单', type: 'info' },
  collecting: { label: '回收中', type: 'info' },
  weighed: { label: '待结算', type: 'warning' },
  settled: { label: '已结算', type: 'success' },
  completed: { label: '已完成', type: 'success' },
  cancelled: { label: '已取消', type: 'error' },
}
const sourceOptions = [
  { label: '在院老人', value: 'elderly' }, { label: '员工', value: 'staff' },
  { label: '社区居民', value: 'community' }, { label: '其他', value: 'other' },
]
const pickupOptions = [{ label: '上门回收', value: 'pickup' }, { label: '送至回收点', value: 'dropoff' }]
const orderStatusOptions = [{ label: '全部状态', value: '' }, ...Object.entries(statusMap).map(([value, item]) => ({ label: item.label, value }))]
const settlementOptions = [
  { label: '现金', value: 'cash' }, { label: '银行转账', value: 'bank' },
  { label: '积分', value: 'points' }, { label: '公益捐赠', value: 'donation' },
]
const gradeOptions = [
  { label: '优质', value: 'excellent' }, { label: '普通', value: 'normal' }, { label: '混合', value: 'mixed' },
]
const categoryStatusOptions = [{ label: '启用', value: 'active' }, { label: '停用', value: 'inactive' }]
const inventoryStatusOptions = [{ label: '在库', value: 'in_stock' }, { label: '部分出库', value: 'partial' }, { label: '已出库', value: 'out' }]

const can = (action: string) => auth.canUseButton(`waste-recycling:${action}`)
const yuan = (cents: number) => `¥${(Number(cents || 0) / 100).toFixed(2)}`
const weight = (value: number) => `${Number(value || 0).toFixed(3)} kg`
const elderlyName = (id: string) => elderly.value.find(item => item.id === id)?.name ?? id
const categoryOptions = computed(() => store.categories.filter(item => item.status === 'active').map(item => ({ label: `${item.name}（${yuan(item.guide_price_cents)}/${item.unit}）`, value: item.id })))
const elderlyOptions = computed(() => elderly.value.map(item => ({ label: `${item.name}${item.room_no ? ` · ${item.room_no}` : ''}`, value: item.id })))
const userOptions = computed(() => users.value.filter(item => item.status === 'active').map(item => ({ label: item.real_name || item.username, value: item.id })))

const query = ref<{ status: WasteOrderStatus | ''; keyword: string; dateRange: [number, number] | null }>({ status: '', keyword: '', dateRange: null })
function queryParams() {
  const range = query.value.dateRange
  return {
    status: query.value.status || undefined,
    keyword: query.value.keyword || undefined,
    startDate: range ? new Date(range[0]).toISOString().slice(0, 10) : undefined,
    endDate: range ? new Date(range[1]).toISOString().slice(0, 10) : undefined,
  }
}
async function refresh() {
  refreshing.value = true
  try { await store.refreshAll(queryParams()) }
  catch (error) { message.error(error instanceof Error ? error.message : String(error)) }
  finally { refreshing.value = false }
}

async function run(action: () => Promise<unknown>, success?: string) {
  try {
    await action()
    if (success) message.success(success)
  } catch (error) {
    message.error(error instanceof Error ? error.message : String(error))
  }
}

const showOrderModal = ref(false)
const orderForm = ref({
  source_type: 'elderly' as WasteRecyclingOrderRow['source_type'], elderly_id: null as string | null,
  contact_name: '', contact_phone: '', pickup_type: 'pickup' as WasteRecyclingOrderRow['pickup_type'],
  pickup_address: '', appointment_at: '', estimated_weight: null as number | null, remark: '',
})
function openCreateOrder() {
  const now = new Date(Date.now() + 60 * 60 * 1000)
  orderForm.value = {
    source_type: 'elderly', elderly_id: null, contact_name: '', contact_phone: '', pickup_type: 'pickup',
    pickup_address: '', appointment_at: now.toISOString().slice(0, 16).replace('T', ' '), estimated_weight: null, remark: '',
  }
  showOrderModal.value = true
}
function selectElderly(id: string | null) {
  const item = elderly.value.find(row => row.id === id)
  if (!item) return
  orderForm.value.contact_name = item.name
  orderForm.value.contact_phone = item.phone ?? ''
  orderForm.value.pickup_address = item.room_no ? `院内 ${item.room_no}` : (item.address ?? '')
}
async function saveOrder() {
  if (!orderForm.value.contact_name.trim() || !orderForm.value.appointment_at) return message.error('请填写联系人和预约时间')
  await run(async () => {
    await store.createOrder({
      ...orderForm.value,
      contact_phone: orderForm.value.contact_phone || null,
      pickup_address: orderForm.value.pickup_address || null,
      created_by: auth.currentUser?.id ?? null,
      created_by_name: auth.currentUser?.real_name ?? auth.currentUser?.username ?? null,
      remark: orderForm.value.remark || null,
    })
    showOrderModal.value = false
  }, '回收预约已登记')
}

const currentOrder = ref<WasteRecyclingOrderRow | null>(null)
const showAssignModal = ref(false)
const assigneeId = ref<string | null>(null)
function openAssign(row: WasteRecyclingOrderRow) { currentOrder.value = row; assigneeId.value = row.assignee_id; showAssignModal.value = true }
async function saveAssign() {
  const user = users.value.find(item => item.id === assigneeId.value)
  if (!currentOrder.value || !user) return message.error('请选择回收负责人')
  await run(async () => {
    await store.assign(currentOrder.value!.id, user.id, user.real_name || user.username)
    showAssignModal.value = false
  }, '派单成功')
}

const showWeighModal = ref(false)
const weighDrafts = ref<WeighDraft[]>([])
function emptyWeighDraft(): WeighDraft {
  const category = store.categories.find(item => item.status === 'active')
  return { category_id: category?.id ?? null, material_name: category?.name ?? '', gross_weight: null, tare_weight: 0, unit_price_yuan: (category?.guide_price_cents ?? 0) / 100, quality_grade: 'normal', remark: '' }
}
async function openWeigh(row: WasteRecyclingOrderRow) {
  currentOrder.value = row
  await run(async () => {
    const existing = await window.api.wasteRecycling.order.items(row.id) as WasteRecyclingItemRow[]
    weighDrafts.value = existing.length ? existing.map(item => ({
      category_id: item.category_id, material_name: item.material_name, gross_weight: item.gross_weight,
      tare_weight: item.tare_weight, unit_price_yuan: item.unit_price_cents / 100,
      quality_grade: item.quality_grade, remark: item.remark ?? '',
    })) : [emptyWeighDraft()]
    showWeighModal.value = true
  })
}
function selectCategory(draft: WeighDraft, id: string | null) {
  const category = store.categories.find(item => item.id === id)
  if (!category) return
  draft.material_name = category.name
  draft.unit_price_yuan = category.guide_price_cents / 100
}
const weighTotal = computed(() => weighDrafts.value.reduce((sum, item) => {
  const net = Math.max(0, Number(item.gross_weight || 0) - Number(item.tare_weight || 0))
  return sum + net * Number(item.unit_price_yuan || 0)
}, 0))
async function saveWeigh() {
  if (!currentOrder.value) return
  if (weighDrafts.value.some(item => !item.category_id || !item.gross_weight || item.gross_weight <= item.tare_weight)) return message.error('请完整填写称重明细，且毛重必须大于皮重')
  await run(async () => {
    await store.weigh(currentOrder.value!.id, weighDrafts.value.map(item => ({
      category_id: item.category_id!, material_name: item.material_name,
      gross_weight: Number(item.gross_weight), tare_weight: Number(item.tare_weight || 0),
      unit_price_cents: Math.round(Number(item.unit_price_yuan || 0) * 100),
      quality_grade: item.quality_grade, remark: item.remark || null,
    })))
    showWeighModal.value = false
  }, '称重计价已保存')
}

const showSettlementModal = ref(false)
const settlementForm = ref({ method: 'cash' as 'cash' | 'bank' | 'points' | 'donation', cash_amount_yuan: 0, points: 0, payee: '', storage_location: '回收暂存区', remark: '' })
function openSettlement(row: WasteRecyclingOrderRow) {
  currentOrder.value = row
  settlementForm.value = { method: row.elderly_id ? 'points' : 'cash', cash_amount_yuan: row.total_amount_cents / 100, points: row.points, payee: row.contact_name, storage_location: '回收暂存区', remark: '' }
  showSettlementModal.value = true
}
async function saveSettlement() {
  if (!currentOrder.value) return
  await run(async () => {
    await store.settle(currentOrder.value!.id, {
      method: settlementForm.value.method,
      cash_amount_cents: Math.round(settlementForm.value.cash_amount_yuan * 100),
      points: Math.round(settlementForm.value.points),
      payee: settlementForm.value.payee || null,
      operator: auth.currentUser?.real_name ?? auth.currentUser?.username ?? null,
      storage_location: settlementForm.value.storage_location || null,
      remark: settlementForm.value.remark || null,
    })
    showSettlementModal.value = false
  }, '结算完成，回收物已入库')
}

const showCancelModal = ref(false)
const cancelReason = ref('')
function openCancel(row: WasteRecyclingOrderRow) { currentOrder.value = row; cancelReason.value = ''; showCancelModal.value = true }
async function saveCancel() {
  if (!currentOrder.value || !cancelReason.value.trim()) return message.error('请填写取消原因')
  await run(async () => { await store.cancel(currentOrder.value!.id, cancelReason.value); showCancelModal.value = false }, '回收单已取消')
}

const showDetailModal = ref(false)
async function openDetail(row: WasteRecyclingOrderRow) {
  currentOrder.value = row
  await run(async () => { await store.fetchOrderDetail(row.id); showDetailModal.value = true })
}

const showInventoryModal = ref(false)
const currentLot = ref<WasteInventoryLotRow | null>(null)
const inventoryForm = ref({ transaction_type: 'out' as 'out' | 'adjust', quantity: 0, destination: '', counterparty: '', unit_price_yuan: 0, occurred_at: '', remark: '' })
function openInventory(row: WasteInventoryLotRow, type: 'out' | 'adjust') {
  currentLot.value = row
  inventoryForm.value = { transaction_type: type, quantity: type === 'out' ? row.remaining_quantity : 0, destination: '', counterparty: '', unit_price_yuan: 0, occurred_at: new Date().toISOString().slice(0, 16).replace('T', ' '), remark: '' }
  showInventoryModal.value = true
}
async function saveInventory() {
  if (!currentLot.value || !inventoryForm.value.quantity) return message.error('请填写数量')
  await run(async () => {
    await store.transactInventory(currentLot.value!.id, {
      ...inventoryForm.value,
      unit_price_cents: Math.round(inventoryForm.value.unit_price_yuan * 100),
      operator: auth.currentUser?.real_name ?? auth.currentUser?.username ?? null,
      destination: inventoryForm.value.destination || null,
      counterparty: inventoryForm.value.counterparty || null,
      remark: inventoryForm.value.remark || null,
    })
    showInventoryModal.value = false
  }, inventoryForm.value.transaction_type === 'out' ? '出库成功' : '库存调整成功')
}
const showTransactionsModal = ref(false)
async function openTransactions(row: WasteInventoryLotRow) {
  currentLot.value = row
  await run(async () => { await store.fetchInventoryTransactions(row.id); showTransactionsModal.value = true })
}

const showCategoryModal = ref(false)
const editingCategory = ref<WasteCategoryRow | null>(null)
const categoryForm = ref({ code: '', name: '', unit: 'kg', guide_price_yuan: 0, points_per_unit: 0, status: 'active' as 'active' | 'inactive', sort_order: 0, remark: '' })
function openCategory(row?: WasteCategoryRow) {
  editingCategory.value = row ?? null
  categoryForm.value = row ? { code: row.code, name: row.name, unit: row.unit, guide_price_yuan: row.guide_price_cents / 100, points_per_unit: row.points_per_unit, status: row.status, sort_order: row.sort_order, remark: row.remark ?? '' } : { code: '', name: '', unit: 'kg', guide_price_yuan: 0, points_per_unit: 0, status: 'active', sort_order: 0, remark: '' }
  showCategoryModal.value = true
}
async function saveCategory() {
  if (!categoryForm.value.code.trim() || !categoryForm.value.name.trim()) return message.error('请填写编码和名称')
  const data = { ...categoryForm.value, guide_price_cents: Math.round(categoryForm.value.guide_price_yuan * 100), remark: categoryForm.value.remark || null }
  delete (data as Partial<typeof data> & { guide_price_yuan?: number }).guide_price_yuan
  await run(async () => {
    if (editingCategory.value) await store.updateCategory(editingCategory.value.id, data)
    else await store.createCategory(data)
    showCategoryModal.value = false
  }, '品类已保存')
}

const orderColumns = [
  { title: '回收单号', key: 'order_no', width: 155 },
  { title: '预约时间', key: 'appointment_at', width: 155 },
  { title: '联系人', key: 'contact_name', width: 100 },
  { title: '方式', key: 'pickup_type', width: 90, render: (row: WasteRecyclingOrderRow) => row.pickup_type === 'pickup' ? '上门' : '送达' },
  { title: '负责人', key: 'assignee_name', width: 100, render: (row: WasteRecyclingOrderRow) => row.assignee_name || '—' },
  { title: '重量', key: 'total_weight', width: 100, render: (row: WasteRecyclingOrderRow) => weight(row.total_weight) },
  { title: '金额', key: 'total_amount_cents', width: 90, render: (row: WasteRecyclingOrderRow) => yuan(row.total_amount_cents) },
  { title: '状态', key: 'status', width: 90, render: (row: WasteRecyclingOrderRow) => h(NTag, { type: statusMap[row.status].type, size: 'small' }, () => statusMap[row.status].label) },
  { title: '操作', key: 'actions', width: 330, render: (row: WasteRecyclingOrderRow) => h(NSpace, { size: 6, wrap: false }, { default: () => [
    h(NButton, { size: 'tiny', onClick: () => openDetail(row) }, () => '详情'),
    ['pending', 'assigned'].includes(row.status) && can('dispatch') ? h(NButton, { size: 'tiny', type: 'primary', onClick: () => openAssign(row) }, () => row.status === 'pending' ? '派单' : '改派') : null,
    row.status === 'assigned' && can('dispatch') ? h(NButton, { size: 'tiny', onClick: () => run(() => store.start(row.id), '已开始回收') }, () => '开始') : null,
    ['assigned', 'collecting', 'weighed'].includes(row.status) && can('weigh') ? h(NButton, { size: 'tiny', type: 'warning', onClick: () => openWeigh(row) }, () => '称重') : null,
    row.status === 'weighed' && can('settle') ? h(NButton, { size: 'tiny', type: 'success', onClick: () => openSettlement(row) }, () => '结算') : null,
    row.status === 'settled' ? h(NButton, { size: 'tiny', type: 'success', onClick: () => run(() => store.complete(row.id), '回收单已完成') }, () => '完成') : null,
    ['pending', 'assigned', 'collecting'].includes(row.status) ? h(NButton, { size: 'tiny', type: 'error', onClick: () => openCancel(row) }, () => '取消') : null,
  ].filter(Boolean) }) },
]
const itemColumns = [
  { title: '品类', key: 'category_name' }, { title: '物料', key: 'material_name' },
  { title: '毛重', key: 'gross_weight' }, { title: '皮重', key: 'tare_weight' }, { title: '净重', key: 'net_weight' },
  { title: '单价', key: 'unit_price_cents', render: (row: WasteRecyclingItemRow) => `${yuan(row.unit_price_cents)}/${row.unit}` },
  { title: '金额', key: 'amount_cents', render: (row: WasteRecyclingItemRow) => yuan(row.amount_cents) },
]
const inventoryColumns = [
  { title: '物料', key: 'material_name' }, { title: '入库量', key: 'quantity', render: (row: WasteInventoryLotRow) => `${row.quantity} ${row.unit}` },
  { title: '剩余量', key: 'remaining_quantity', render: (row: WasteInventoryLotRow) => `${row.remaining_quantity} ${row.unit}` },
  { title: '库位', key: 'storage_location', render: (row: WasteInventoryLotRow) => row.storage_location || '—' },
  { title: '状态', key: 'status', render: (row: WasteInventoryLotRow) => inventoryStatusOptions.find(item => item.value === row.status)?.label },
  { title: '操作', key: 'actions', width: 210, render: (row: WasteInventoryLotRow) => h(NSpace, { size: 6 }, { default: () => [
    h(NButton, { size: 'tiny', onClick: () => openTransactions(row) }, () => '流水'),
    row.status !== 'out' && can('inventory') ? h(NButton, { size: 'tiny', type: 'primary', onClick: () => openInventory(row, 'out') }, () => '出库') : null,
    can('inventory') ? h(NButton, { size: 'tiny', onClick: () => openInventory(row, 'adjust') }, () => '盘点') : null,
  ].filter(Boolean) }) },
]
const categoryColumns = [
  { title: '编码', key: 'code' }, { title: '品类', key: 'name' }, { title: '单位', key: 'unit' },
  { title: '指导价', key: 'guide_price_cents', render: (row: WasteCategoryRow) => `${yuan(row.guide_price_cents)}/${row.unit}` },
  { title: '积分系数', key: 'points_per_unit', render: (row: WasteCategoryRow) => `${row.points_per_unit} 分/${row.unit}` },
  { title: '状态', key: 'status', render: (row: WasteCategoryRow) => h(NTag, { type: row.status === 'active' ? 'success' : 'default', size: 'small' }, () => row.status === 'active' ? '启用' : '停用') },
  { title: '操作', key: 'actions', width: 150, render: (row: WasteCategoryRow) => h(NSpace, null, { default: () => [
    can('category') ? h(NButton, { size: 'tiny', onClick: () => openCategory(row) }, () => '编辑') : null,
    can('category') ? h(NPopconfirm, { onPositiveClick: () => run(() => store.deleteCategory(row.id), '已删除') }, { trigger: () => h(NButton, { size: 'tiny', type: 'error' }, () => '删除'), default: () => '仅未产生回收记录的品类可删除，确定继续？' }) : null,
  ].filter(Boolean) }) },
]
const pointColumns = [
  { title: '老人', key: 'elderly_id', render: (row: WastePointsLedgerRow) => elderlyName(row.elderly_id) },
  { title: '积分变动', key: 'change_points', render: (row: WastePointsLedgerRow) => h(NTag, { type: row.change_points >= 0 ? 'success' : 'error' }, () => `${row.change_points >= 0 ? '+' : ''}${row.change_points}`) },
  { title: '原因', key: 'reason' }, { title: '操作人', key: 'operator', render: (row: WastePointsLedgerRow) => row.operator || '—' },
  { title: '时间', key: 'occurred_at', render: (row: WastePointsLedgerRow) => new Date(row.occurred_at).toLocaleString() },
]
const transactionColumns = [
  { title: '类型', key: 'transaction_type', render: (row: WasteInventoryTransactionRow) => ({ in: '入库', out: '出库', adjust: '盘点调整' }[row.transaction_type]) },
  { title: '数量', key: 'quantity' }, { title: '去向', key: 'destination', render: (row: WasteInventoryTransactionRow) => row.destination || '—' },
  { title: '接收方', key: 'counterparty', render: (row: WasteInventoryTransactionRow) => row.counterparty || '—' },
  { title: '金额', key: 'amount_cents', render: (row: WasteInventoryTransactionRow) => yuan(row.amount_cents) },
  { title: '时间', key: 'occurred_at' }, { title: '操作人', key: 'operator' },
]

onMounted(async () => {
  await auth.restore()
  await run(async () => {
    const [userRows, elderlyRows] = await Promise.all([window.api.user.list(), window.api.elderly.list()])
    users.value = userRows
    elderly.value = elderlyRows
    await refresh()
  })
})
</script>

<template>
  <BasePage title="废品回收">
    <NCard class="mb-3">
      <NGrid :cols="7" :x-gap="16">
        <NGi><NStatistic label="回收单" :value="store.stats.total_orders" /></NGi>
        <NGi><NStatistic label="待处理" :value="store.stats.pending_orders" /></NGi>
        <NGi><NStatistic label="已完成" :value="store.stats.completed_orders" /></NGi>
        <NGi><NStatistic label="累计重量" :value="store.stats.total_weight" :precision="3" suffix="kg" /></NGi>
        <NGi><NStatistic label="回收金额" :value="store.stats.total_amount_cents / 100" :precision="2" prefix="¥" /></NGi>
        <NGi><NStatistic label="发放积分" :value="store.stats.total_points" /></NGi>
        <NGi><NStatistic label="当前库存" :value="store.stats.inventory_weight" :precision="3" suffix="kg" /></NGi>
      </NGrid>
    </NCard>

    <NTabs v-model:value="activeTab" type="line" animated>
      <NTabPane name="orders" tab="回收单">
        <NCard>
          <template #header-extra>
            <NSpace>
              <NInput v-model:value="query.keyword" clearable placeholder="单号/联系人/负责人" style="width:190px" @keyup.enter="refresh" />
              <NSelect v-model:value="query.status" :options="orderStatusOptions" style="width:120px" />
              <NDatePicker v-model:value="query.dateRange" type="daterange" clearable style="width:250px" />
              <NButton :loading="refreshing" @click="refresh">查询</NButton>
              <NButton v-if="can('create')" type="primary" @click="openCreateOrder">登记预约</NButton>
            </NSpace>
          </template>
          <BaseTable :columns="orderColumns" :data="store.orders" :loading="store.loading" :pagination="{ pageSize: 15 }" />
        </NCard>
      </NTabPane>

      <NTabPane name="inventory" tab="库存去向">
        <NCard>
          <template #header-extra><NButton @click="store.fetchInventory()">刷新</NButton></template>
          <BaseTable :columns="inventoryColumns" :data="store.inventory" :pagination="{ pageSize: 15 }" />
        </NCard>
      </NTabPane>

      <NTabPane name="categories" tab="品类与价格">
        <NCard>
          <template #header-extra><NButton v-if="can('category')" type="primary" @click="openCategory()">新增品类</NButton></template>
          <BaseTable :columns="categoryColumns" :data="store.categories" :pagination="false" />
        </NCard>
      </NTabPane>

      <NTabPane name="stats" tab="积分与统计">
        <NGrid :cols="2" :x-gap="16">
          <NGi>
            <NCard title="品类汇总">
              <BaseTable :columns="[
                { title: '品类', key: 'category_name' },
                { title: '重量(kg)', key: 'weight' },
                { title: '金额', key: 'amount_cents', render: (row) => yuan(row.amount_cents) },
              ]" :data="store.stats.by_category" :pagination="false" />
            </NCard>
          </NGi>
          <NGi>
            <NCard title="月度趋势">
              <BaseTable :columns="[
                { title: '月份', key: 'month' }, { title: '单量', key: 'orders' },
                { title: '重量(kg)', key: 'weight' },
                { title: '金额', key: 'amount_cents', render: (row) => yuan(row.amount_cents) },
              ]" :data="store.stats.monthly_trend" :pagination="false" />
            </NCard>
          </NGi>
        </NGrid>
        <NCard title="积分流水" class="mt-3">
          <BaseTable :columns="pointColumns" :data="store.pointsLedger" :pagination="{ pageSize: 10 }" />
        </NCard>
      </NTabPane>
    </NTabs>

    <NModal v-model:show="showOrderModal" preset="card" title="登记回收预约" style="width:700px">
      <NForm :model="orderForm" label-placement="left" label-width="90">
        <NGrid :cols="2" :x-gap="18">
          <NGi><NFormItem label="来源"><NSelect v-model:value="orderForm.source_type" :options="sourceOptions" /></NFormItem></NGi>
          <NGi><NFormItem v-if="orderForm.source_type === 'elderly'" label="关联老人"><NSelect v-model:value="orderForm.elderly_id" :options="elderlyOptions" filterable clearable @update:value="selectElderly" /></NFormItem></NGi>
          <NGi><NFormItem label="联系人" required><NInput v-model:value="orderForm.contact_name" /></NFormItem></NGi>
          <NGi><NFormItem label="联系电话"><NInput v-model:value="orderForm.contact_phone" /></NFormItem></NGi>
          <NGi><NFormItem label="回收方式"><NSelect v-model:value="orderForm.pickup_type" :options="pickupOptions" /></NFormItem></NGi>
          <NGi><NFormItem label="预约时间" required><NDatePicker v-model:formatted-value="orderForm.appointment_at" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" style="width:100%" /></NFormItem></NGi>
          <NGi :span="2"><NFormItem label="地址" :required="orderForm.pickup_type === 'pickup'"><NInput v-model:value="orderForm.pickup_address" /></NFormItem></NGi>
          <NGi><NFormItem label="预估重量"><NInputNumber v-model:value="orderForm.estimated_weight" :min="0" :precision="3"><template #suffix>kg</template></NInputNumber></NFormItem></NGi>
          <NGi><NFormItem label="备注"><NInput v-model:value="orderForm.remark" /></NFormItem></NGi>
        </NGrid>
      </NForm>
      <template #footer><NSpace justify="end"><NButton @click="showOrderModal=false">取消</NButton><NButton type="primary" @click="saveOrder">保存预约</NButton></NSpace></template>
    </NModal>

    <NModal v-model:show="showAssignModal" preset="card" title="派单" style="width:430px">
      <NFormItem label="回收负责人"><NSelect v-model:value="assigneeId" :options="userOptions" filterable /></NFormItem>
      <template #footer><NSpace justify="end"><NButton @click="showAssignModal=false">取消</NButton><NButton type="primary" @click="saveAssign">确认派单</NButton></NSpace></template>
    </NModal>

    <NModal v-model:show="showWeighModal" preset="card" title="称重计价" style="width:920px">
      <div v-for="(item, index) in weighDrafts" :key="index" class="mb-3">
        <NSpace align="center" wrap>
          <NSelect v-model:value="item.category_id" :options="categoryOptions" style="width:180px" @update:value="value => selectCategory(item, value)" />
          <NInput v-model:value="item.material_name" placeholder="物料名称" style="width:120px" />
          <NInputNumber v-model:value="item.gross_weight" :min="0.001" :precision="3" placeholder="毛重" style="width:115px"><template #suffix>kg</template></NInputNumber>
          <NInputNumber v-model:value="item.tare_weight" :min="0" :precision="3" placeholder="皮重" style="width:115px"><template #suffix>kg</template></NInputNumber>
          <NInputNumber v-model:value="item.unit_price_yuan" :min="0" :precision="2" placeholder="单价" style="width:120px"><template #prefix>¥</template></NInputNumber>
          <NSelect v-model:value="item.quality_grade" :options="gradeOptions" style="width:90px" />
          <NTag>净重 {{ Math.max(0, Number(item.gross_weight || 0) - item.tare_weight).toFixed(3) }}kg</NTag>
          <NButton v-if="weighDrafts.length > 1" type="error" size="small" @click="weighDrafts.splice(index,1)">删除</NButton>
        </NSpace>
      </div>
      <NDivider />
      <NSpace justify="space-between"><NButton @click="weighDrafts.push(emptyWeighDraft())">添加明细</NButton><NStatistic label="预计结算" :value="weighTotal" :precision="2" prefix="¥" /></NSpace>
      <template #footer><NSpace justify="end"><NButton @click="showWeighModal=false">取消</NButton><NButton type="primary" @click="saveWeigh">保存称重</NButton></NSpace></template>
    </NModal>

    <NModal v-model:show="showSettlementModal" preset="card" title="回收结算" style="width:560px">
      <NForm :model="settlementForm" label-placement="left" label-width="95">
        <NFormItem label="结算方式"><NSelect v-model:value="settlementForm.method" :options="settlementOptions" /></NFormItem>
        <NFormItem v-if="['cash','bank'].includes(settlementForm.method)" label="结算金额"><NInputNumber v-model:value="settlementForm.cash_amount_yuan" :min="0" :precision="2"><template #prefix>¥</template></NInputNumber></NFormItem>
        <NFormItem v-if="settlementForm.method === 'points'" label="发放积分"><NInputNumber v-model:value="settlementForm.points" :min="0" :precision="0" /></NFormItem>
        <NFormItem label="收款/受益人"><NInput v-model:value="settlementForm.payee" /></NFormItem>
        <NFormItem label="入库位置"><NInput v-model:value="settlementForm.storage_location" /></NFormItem>
        <NFormItem label="备注"><NInput v-model:value="settlementForm.remark" /></NFormItem>
      </NForm>
      <template #footer><NSpace justify="end"><NButton @click="showSettlementModal=false">取消</NButton><NButton type="primary" @click="saveSettlement">确认结算并入库</NButton></NSpace></template>
    </NModal>

    <NModal v-model:show="showCancelModal" preset="card" title="取消回收单" style="width:480px">
      <NFormItem label="取消原因" required><NInput v-model:value="cancelReason" type="textarea" /></NFormItem>
      <template #footer><NSpace justify="end"><NButton @click="showCancelModal=false">返回</NButton><NButton type="error" @click="saveCancel">确认取消</NButton></NSpace></template>
    </NModal>

    <NModal v-model:show="showDetailModal" preset="card" title="回收单详情" style="width:850px">
      <NDescriptions v-if="currentOrder" bordered :column="3" label-placement="left">
        <NDescriptionsItem label="回收单号">{{ currentOrder.order_no }}</NDescriptionsItem>
        <NDescriptionsItem label="状态">{{ statusMap[currentOrder.status].label }}</NDescriptionsItem>
        <NDescriptionsItem label="预约时间">{{ currentOrder.appointment_at }}</NDescriptionsItem>
        <NDescriptionsItem label="联系人">{{ currentOrder.contact_name }}</NDescriptionsItem>
        <NDescriptionsItem label="负责人">{{ currentOrder.assignee_name || '—' }}</NDescriptionsItem>
        <NDescriptionsItem label="回收地址">{{ currentOrder.pickup_address || '—' }}</NDescriptionsItem>
        <NDescriptionsItem label="总重量">{{ weight(currentOrder.total_weight) }}</NDescriptionsItem>
        <NDescriptionsItem label="总金额">{{ yuan(currentOrder.total_amount_cents) }}</NDescriptionsItem>
        <NDescriptionsItem label="积分">{{ currentOrder.points }}</NDescriptionsItem>
      </NDescriptions>
      <NDivider>称重明细</NDivider>
      <BaseTable :columns="itemColumns" :data="store.currentItems" :pagination="false" />
      <template v-if="store.currentSettlement">
        <NDivider>结算信息</NDivider>
        <NDescriptions bordered :column="3">
          <NDescriptionsItem label="结算单号">{{ store.currentSettlement.settlement_no }}</NDescriptionsItem>
          <NDescriptionsItem label="方式">{{ settlementOptions.find(item => item.value === store.currentSettlement?.method)?.label }}</NDescriptionsItem>
          <NDescriptionsItem label="金额/积分">{{ yuan(store.currentSettlement.cash_amount_cents) }} / {{ store.currentSettlement.points }}分</NDescriptionsItem>
        </NDescriptions>
      </template>
    </NModal>

    <NModal v-model:show="showInventoryModal" preset="card" :title="inventoryForm.transaction_type === 'out' ? '回收物出库' : '库存盘点调整'" style="width:560px">
      <NForm :model="inventoryForm" label-placement="left" label-width="85">
        <NFormItem label="当前库存"><NTag>{{ currentLot?.remaining_quantity }} {{ currentLot?.unit }}</NTag></NFormItem>
        <NFormItem label="数量" required><NInputNumber v-model:value="inventoryForm.quantity" :min="inventoryForm.transaction_type === 'out' ? 0.001 : undefined" :max="inventoryForm.transaction_type === 'out' ? currentLot?.remaining_quantity : undefined" :precision="3" /></NFormItem>
        <NFormItem label="去向" :required="inventoryForm.transaction_type === 'out'"><NInput v-model:value="inventoryForm.destination" placeholder="再生资源企业/公益捐赠/无害化处理等" /></NFormItem>
        <NFormItem label="接收方"><NInput v-model:value="inventoryForm.counterparty" /></NFormItem>
        <NFormItem label="出售价"><NInputNumber v-model:value="inventoryForm.unit_price_yuan" :min="0" :precision="2"><template #prefix>¥</template></NInputNumber></NFormItem>
        <NFormItem label="发生时间"><NDatePicker v-model:formatted-value="inventoryForm.occurred_at" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" style="width:100%" /></NFormItem>
        <NFormItem label="备注"><NInput v-model:value="inventoryForm.remark" /></NFormItem>
      </NForm>
      <template #footer><NSpace justify="end"><NButton @click="showInventoryModal=false">取消</NButton><NButton type="primary" @click="saveInventory">确认</NButton></NSpace></template>
    </NModal>

    <NModal v-model:show="showTransactionsModal" preset="card" title="库存流水" style="width:900px">
      <BaseTable :columns="transactionColumns" :data="store.inventoryTransactions" :pagination="false" />
    </NModal>

    <NModal v-model:show="showCategoryModal" preset="card" title="回收品类" style="width:520px">
      <NForm :model="categoryForm" label-placement="left" label-width="90">
        <NGrid :cols="2" :x-gap="16">
          <NGi><NFormItem label="编码" required><NInput v-model:value="categoryForm.code" /></NFormItem></NGi>
          <NGi><NFormItem label="名称" required><NInput v-model:value="categoryForm.name" /></NFormItem></NGi>
          <NGi><NFormItem label="计量单位"><NInput v-model:value="categoryForm.unit" /></NFormItem></NGi>
          <NGi><NFormItem label="排序"><NInputNumber v-model:value="categoryForm.sort_order" :min="0" /></NFormItem></NGi>
          <NGi><NFormItem label="指导价"><NInputNumber v-model:value="categoryForm.guide_price_yuan" :min="0" :precision="2"><template #prefix>¥</template></NInputNumber></NFormItem></NGi>
          <NGi><NFormItem label="积分/单位"><NInputNumber v-model:value="categoryForm.points_per_unit" :min="0" :precision="0" /></NFormItem></NGi>
          <NGi><NFormItem label="状态"><NSelect v-model:value="categoryForm.status" :options="categoryStatusOptions" /></NFormItem></NGi>
          <NGi><NFormItem label="备注"><NInput v-model:value="categoryForm.remark" /></NFormItem></NGi>
        </NGrid>
      </NForm>
      <template #footer><NSpace justify="end"><NButton @click="showCategoryModal=false">取消</NButton><NButton type="primary" @click="saveCategory">保存</NButton></NSpace></template>
    </NModal>
  </BasePage>
</template>
