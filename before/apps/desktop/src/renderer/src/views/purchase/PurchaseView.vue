<script setup lang="ts">
defineOptions({ name: 'Purchase' })
import {
  NCard, NButton, NSpace, NTag, NModal, NForm, NFormItem,
  NInput, NInputNumber, NSelect, NDatePicker, NTabs, NTabPane,
  NGrid, NGi, NStatistic, NDivider, NPopconfirm, useMessage
} from 'naive-ui'
import { BasePage, BaseTable } from '@yanglao/ui'
import { usePurchaseStore } from '../../stores/purchase.store'
import { ref, computed, h } from 'vue'
import { formatDateTime } from '@yanglao/core'
import { usePageRefresh } from '../../composables/usePageRefresh'
import type { SupplierRow, PurchaseOrderRow, PurchaseOrderItemRow } from '@yanglao/db'

const store   = usePurchaseStore()
const message = useMessage()

async function loadData() {
  await Promise.all([store.fetchSuppliers(), store.fetchOrders()])
}
const { refresh, refreshing } = usePageRefresh(loadData)

const stats = ref({ total: 0, draft: 0, pending: 0, approved: 0, received: 0, total_amount: 0 })
async function refreshStats() { stats.value = await store.getStats() }

// ── 供应商 ────────────────────────────────────────
const showSupplierModal = ref(false)
const supplierForm = ref<Partial<SupplierRow>>({
  name: '', contact: '', phone: '', address: '', category: 'other', tax_no: '', status: 'active', remark: ''
})
const editingSupplierIdx = ref<number | null>(null)

const categoryOptions = [
  { label: '药品/医疗', value: 'medicine' },
  { label: '护理用品',  value: 'care_supply' },
  { label: '食材/餐饮', value: 'food' },
  { label: '设备器械', value: 'equipment' },
  { label: '其他',      value: 'other' },
]
const categoryMap: Record<string, string> = {
  medicine: '药品/医疗', care_supply: '护理用品', food: '食材/餐饮', equipment: '设备器械', other: '其他'
}

const supplierOptions = computed(() =>
  store.suppliers.filter(s => s.status === 'active').map(s => ({ label: s.name, value: s.id }))
)

function openAddSupplier() {
  editingSupplierIdx.value = null
  supplierForm.value = { name: '', contact: '', phone: '', address: '', category: 'other', tax_no: '', status: 'active', remark: '' }
  showSupplierModal.value = true
}

function openEditSupplier(row: SupplierRow) {
  editingSupplierIdx.value = store.suppliers.findIndex(s => s.id === row.id)
  supplierForm.value = { ...row }
  showSupplierModal.value = true
}

async function saveSupplier() {
  if (!supplierForm.value.name) return message.error('请填写供应商名称')
  if (editingSupplierIdx.value !== null) {
    const id = store.suppliers[editingSupplierIdx.value].id
    await store.updateSupplier(id, supplierForm.value)
  } else {
    await store.createSupplier(supplierForm.value)
  }
  showSupplierModal.value = false
  message.success('保存成功')
}

const supplierColumns = [
  { title: '供应商名称', key: 'name', minWidth: 130 },
  { title: '类别', key: 'category', width: 100, render: (r: SupplierRow) => categoryMap[r.category] ?? r.category },
  { title: '联系人', key: 'contact', width: 90 },
  { title: '电话', key: 'phone', width: 120 },
  { title: '状态', key: 'status', width: 80,
    render: (r: SupplierRow) => h(NTag, { type: r.status === 'active' ? 'success' : 'default' }, () => r.status === 'active' ? '合作中' : '已停用') },
  { title: '操作', key: 'actions', width: 130,
    render: (r: SupplierRow) => h(NSpace, null, { default: () => [
      h(NButton, { size: 'small', onClick: () => openEditSupplier(r) }, '编辑'),
      h(NPopconfirm, { onPositiveClick: async () => { await store.deleteSupplier(r.id); message.success('已删除') } }, {
        trigger: () => h(NButton, { size: 'small', type: 'error' }, '删除'),
        default: () => '确定删除该供应商？',
      }),
    ] })
  },
]

// ── 采购单 ────────────────────────────────────────
const showOrderModal  = ref(false)
const showItemsModal  = ref(false)
const activeOrderStatus = ref('')

type ItemDraft = Partial<PurchaseOrderItemRow>
const orderForm = ref<Partial<PurchaseOrderRow>>({
  supplier_id: null, supplier_name: '', order_date: formatDateTime(Date.now()).slice(0, 10), expect_date: '', remark: ''
})
const itemDrafts = ref<ItemDraft[]>([])

function createEmptyItem(): ItemDraft {
  return { item_name: '', category: 'other', specification: '', unit: '件', quantity: 1, unit_price: 0, remark: '' }
}

function openAddOrder() {
  orderForm.value = {
    supplier_id: null, supplier_name: '',
    order_date: new Date().toISOString().slice(0, 10), expect_date: '', remark: ''
  }
  itemDrafts.value = [createEmptyItem()]
  showOrderModal.value = true
}

async function saveOrder() {
  if (!itemDrafts.value.length || itemDrafts.value.some(it => !it.item_name || (it.quantity ?? 0) <= 0))
    return message.error('请完整填写采购明细')
  const items = itemDrafts.value.map(it => ({
    ...it,
    amount: Number(((it.quantity ?? 0) * (it.unit_price ?? 0)).toFixed(2)),
  }))
  await store.createOrder(orderForm.value, items)
  showOrderModal.value = false
  message.success('采购单已创建')
  await Promise.all([store.fetchOrders(), refreshStats()])
}

async function viewItems(order: PurchaseOrderRow) {
  await store.fetchOrderItems(order.id)
  showItemsModal.value = true
}

async function approve(order: PurchaseOrderRow) {
  await store.updateOrderStatus(order.id, 'approved')
  message.success('审批通过')
}

async function receive(order: PurchaseOrderRow) {
  await store.updateOrderStatus(order.id, 'received')
  message.success('已标记入库')
}

async function cancel(order: PurchaseOrderRow) {
  await store.updateOrderStatus(order.id, 'cancelled')
  message.success('已取消')
}

const statusMap: Record<string, { label: string; type: 'default'|'info'|'warning'|'success'|'error' }> = {
  draft:     { label: '草稿',   type: 'default' },
  pending:   { label: '待审批', type: 'warning' },
  approved:  { label: '已审批', type: 'info' },
  received:  { label: '已入库', type: 'success' },
  cancelled: { label: '已取消', type: 'error' },
}

const filteredOrders = computed(() =>
  activeOrderStatus.value
    ? store.orders.filter(o => o.status === activeOrderStatus.value)
    : store.orders
)

const orderColumns = [
  { title: '单号', key: 'order_no', width: 150 },
  { title: '供应商', key: 'supplier_name', width: 120, render: (r: PurchaseOrderRow) => r.supplier_name || '—' },
  { title: '采购日期', key: 'order_date', width: 110 },
  { title: '总金额', key: 'total_amount', width: 100, render: (r: PurchaseOrderRow) => `¥${r.total_amount.toFixed(2)}` },
  { title: '状态', key: 'status', width: 90,
    render: (r: PurchaseOrderRow) => {
      const s = statusMap[r.status] ?? { label: r.status, type: 'default' as const }
      return h(NTag, { type: s.type }, () => s.label)
    }
  },
  { title: '申请人', key: 'applicant', width: 90, render: (r: PurchaseOrderRow) => r.applicant || '—' },
  { title: '操作', key: 'actions', width: 200,
    render: (r: PurchaseOrderRow) => h(NSpace, null, { default: () => [
      h(NButton, { size: 'small', onClick: () => viewItems(r) }, '明细'),
      r.status === 'pending'
        ? h(NButton, { size: 'small', type: 'primary', onClick: () => approve(r) }, '审批')
        : null,
      r.status === 'approved'
        ? h(NButton, { size: 'small', type: 'success', onClick: () => receive(r) }, '入库')
        : null,
      ['draft', 'pending'].includes(r.status)
        ? h(NPopconfirm, { onPositiveClick: () => cancel(r) }, {
            trigger: () => h(NButton, { size: 'small', type: 'error' }, '取消'),
            default: () => '确定取消该采购单？',
          })
        : null,
    ].filter(Boolean) })
  },
]

const itemColumns = [
  { title: '物品名称', key: 'item_name', minWidth: 120 },
  { title: '类别', key: 'category', width: 100, render: (r: PurchaseOrderItemRow) => categoryMap[r.category] ?? r.category },
  { title: '规格', key: 'specification', width: 120, render: (r: PurchaseOrderItemRow) => r.specification || '—' },
  { title: '单位', key: 'unit', width: 60 },
  { title: '数量', key: 'quantity', width: 80 },
  { title: '单价', key: 'unit_price', width: 90, render: (r: PurchaseOrderItemRow) => `¥${r.unit_price}` },
  { title: '金额', key: 'amount', width: 100, render: (r: PurchaseOrderItemRow) => `¥${r.amount.toFixed(2)}` },
  { title: '已入库', key: 'received_qty', width: 80 },
]

const statusFilterOptions = [
  { label: '全部',   value: '' },
  { label: '草稿',   value: 'draft' },
  { label: '待审批', value: 'pending' },
  { label: '已审批', value: 'approved' },
  { label: '已入库', value: 'received' },
  { label: '已取消', value: 'cancelled' },
]
</script>

<template>
  <BasePage title="采购管理">
    <!-- 统计卡片 -->
    <NCard class="mb-3">
      <NGrid :cols="5" :x-gap="24">
        <NGi><NStatistic label="采购单总数" :value="stats.total" /></NGi>
        <NGi><NStatistic label="待审批" :value="stats.pending" /></NGi>
        <NGi><NStatistic label="已审批" :value="stats.approved" /></NGi>
        <NGi><NStatistic label="已入库" :value="stats.received" /></NGi>
        <NGi><NStatistic label="采购总额" :value="stats.total_amount" :precision="2" prefix="¥" /></NGi>
      </NGrid>
    </NCard>

    <NTabs type="line" animated>
      <!-- 采购单 -->
      <NTabPane name="orders" tab="采购单">
        <NCard>
          <template #header-extra>
            <NSpace align="center">
              <NSelect
                v-model:value="activeOrderStatus"
                :options="statusFilterOptions"
                style="width:120px"
                placeholder="状态筛选"
              />
              <NButton :loading="refreshing" size="small" @click="refresh">刷新</NButton>
              <NButton type="primary" size="small" @click="openAddOrder">+ 新建采购单</NButton>
            </NSpace>
          </template>
          <BaseTable
            :columns="orderColumns"
            :data="filteredOrders"
            :loading="store.loading"
            :pagination="{ pageSize: 15 }"
          />
        </NCard>
      </NTabPane>

      <!-- 供应商 -->
      <NTabPane name="suppliers" tab="供应商管理">
        <NCard>
          <template #header-extra>
            <NButton type="primary" size="small" @click="openAddSupplier">+ 新增供应商</NButton>
          </template>
          <BaseTable
            :columns="supplierColumns"
            :data="store.suppliers"
            :loading="store.loading"
            :pagination="{ pageSize: 15 }"
          />
        </NCard>
      </NTabPane>
    </NTabs>

    <!-- 新建采购单弹窗 -->
    <NModal v-model:show="showOrderModal" title="新建采购单" preset="card" style="width:680px">
      <NForm :model="orderForm" label-placement="left" label-width="80">
        <NGrid :cols="2" :x-gap="16">
          <NGi>
            <NFormItem label="供应商">
              <NSelect
                v-model:value="orderForm.supplier_id"
                :options="supplierOptions"
                filterable
                clearable
                placeholder="选择供应商"
                @update:value="v => { orderForm.supplier_name = store.suppliers.find(s=>s.id===v)?.name || '' }"
              />
            </NFormItem>
          </NGi>
          <NGi>
            <NFormItem label="采购日期" required>
              <NDatePicker v-model:formatted-value="orderForm.order_date" value-format="yyyy-MM-dd" style="width:100%" />
            </NFormItem>
          </NGi>
          <NGi>
            <NFormItem label="预计到货">
              <NDatePicker v-model:formatted-value="orderForm.expect_date" value-format="yyyy-MM-dd" clearable style="width:100%" />
            </NFormItem>
          </NGi>
          <NGi>
            <NFormItem label="备注">
              <NInput v-model:value="orderForm.remark" />
            </NFormItem>
          </NGi>
        </NGrid>

        <NDivider>采购明细</NDivider>
        <div v-for="(item, idx) in itemDrafts" :key="idx" class="mb-3">
          <NSpace align="center" wrap>
            <NInput v-model:value="item.item_name" placeholder="物品名称*" style="width:130px" />
            <NSelect v-model:value="item.category" :options="categoryOptions" style="width:110px" />
            <NInput v-model:value="item.specification" placeholder="规格" style="width:100px" />
            <NInput v-model:value="item.unit" placeholder="单位" style="width:60px" />
            <NInputNumber v-model:value="item.quantity" :min="0.01" :precision="2" placeholder="数量" style="width:90px" />
            <NInputNumber v-model:value="item.unit_price" :min="0" :precision="2" placeholder="单价" style="width:100px" />
            <NTag type="info">¥{{ ((item.quantity||0)*(item.unit_price||0)).toFixed(2) }}</NTag>
            <NButton v-if="itemDrafts.length>1" size="small" type="error" @click="itemDrafts.splice(idx,1)">×</NButton>
          </NSpace>
        </div>
        <NSpace justify="space-between" align="center">
          <NButton size="small" @click="itemDrafts.push(createEmptyItem())">+ 添加明细</NButton>
          <NTag type="warning">
            合计 ¥{{ itemDrafts.reduce((s,it)=>s+(it.quantity||0)*(it.unit_price||0),0).toFixed(2) }}
          </NTag>
        </NSpace>
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showOrderModal=false">取消</NButton>
          <NButton @click="async()=>{ orderForm.status='draft'; await saveOrder() }">存草稿</NButton>
          <NButton type="primary" @click="async()=>{ orderForm.status='pending'; await saveOrder() }">提交审批</NButton>
        </NSpace>
      </template>
    </NModal>

    <!-- 供应商弹窗 -->
    <NModal v-model:show="showSupplierModal" title="供应商信息" preset="card" style="width:500px">
      <NForm :model="supplierForm" label-placement="left" label-width="80">
        <NFormItem label="名称" required><NInput v-model:value="supplierForm.name" /></NFormItem>
        <NFormItem label="类别"><NSelect v-model:value="supplierForm.category" :options="categoryOptions" /></NFormItem>
        <NFormItem label="联系人"><NInput v-model:value="supplierForm.contact" /></NFormItem>
        <NFormItem label="电话"><NInput v-model:value="supplierForm.phone" /></NFormItem>
        <NFormItem label="地址"><NInput v-model:value="supplierForm.address" /></NFormItem>
        <NFormItem label="税号"><NInput v-model:value="supplierForm.tax_no" /></NFormItem>
        <NFormItem label="开户行"><NInput v-model:value="supplierForm.bank_name" /></NFormItem>
        <NFormItem label="银行账号"><NInput v-model:value="supplierForm.bank_account" /></NFormItem>
        <NFormItem label="备注"><NInput v-model:value="supplierForm.remark" /></NFormItem>
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showSupplierModal=false">取消</NButton>
          <NButton type="primary" @click="saveSupplier">保存</NButton>
        </NSpace>
      </template>
    </NModal>

    <!-- 采购明细弹窗 -->
    <NModal v-model:show="showItemsModal" title="采购明细" preset="card" style="width:760px">
      <BaseTable :columns="itemColumns" :data="store.orderItems" :pagination="false" />
    </NModal>
  </BasePage>
</template>
