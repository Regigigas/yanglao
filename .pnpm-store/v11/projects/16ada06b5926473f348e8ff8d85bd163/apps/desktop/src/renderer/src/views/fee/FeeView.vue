<script setup lang="ts">
defineOptions({ name: 'Fee' })
import {
  NCard, NButton, NSpace, NTag, NModal, NForm, NFormItem,
  NInput, NInputNumber, NSelect, NDatePicker, NTabs, NTabPane, NGrid, NGi, NStatistic, NDivider, useMessage
} from 'naive-ui'
import { BasePage, BaseTable } from '@yanglao/ui'
import { useFeeStore } from '../../stores/fee.store'
import { useElderlyStore } from '../../stores/elderly.store'
import { ref, h, computed } from 'vue'
import { formatDateTime } from '@yanglao/core'
import { usePageRefresh } from '../../composables/usePageRefresh'
import type { FeeItemRow, MonthlyBillRow, DepositRecordRow, BillDetailRow, PaymentRecordRow } from '@yanglao/db'

const feeStore = useFeeStore()
const elderlyStore = useElderlyStore()
const message = useMessage()

const selectedElderlyId = ref<string | null>(null)
const elderlyOptions = computed(() =>
  elderlyStore.list.filter(e => e.status === 'active').map(e => ({ label: e.name, value: e.id }))
)

const statMonth = ref(new Date().toISOString().slice(0, 7))
const feeStats = ref({ total_billed: 0, total_paid: 0, overdue: 0 })
async function refreshFinancialStats() {
  feeStats.value = await feeStore.getStats(statMonth.value)
}

async function loadData() {
  await Promise.all([
    feeStore.fetchFeeItems(),
    feeStore.fetchBills(),
    feeStore.fetchPayments(),
    elderlyStore.fetchList(),
    refreshFinancialStats(),
  ])
}
const { refresh, refreshing } = usePageRefresh(loadData)

async function onElderlyChange(id: string | null) {
  selectedElderlyId.value = id
  if (id) {
    await Promise.all([feeStore.fetchBills(id), feeStore.fetchDeposits(id), feeStore.fetchPayments(id)])
  } else {
    feeStore.clearElderlyScopedData()
    await Promise.all([feeStore.fetchBills(), feeStore.fetchPayments()])
  }
}

// ── 费用项目 ─────────────────────────────────────
const showFeeItemModal = ref(false)
const feeItemForm = ref({ name: '', category: 'other', unit_price: 0, unit: '月', is_required: 0, status: 'active', remark: '' })

const categoryOptions = [
  { label: '床位费', value: 'bed' }, { label: '护理费', value: 'care' },
  { label: '餐饮费', value: 'meal' }, { label: '医疗费', value: 'medical' }, { label: '其他', value: 'other' },
]

async function saveFeeItem() {
  if (!feeItemForm.value.name) return message.error('请填写费用名称')
  await feeStore.createFeeItem({ ...feeItemForm.value, remark: feeItemForm.value.remark || null })
  showFeeItemModal.value = false
  message.success('保存成功')
  await feeStore.fetchFeeItems()
}

function openFeeItemModal() {
  feeItemForm.value = { name: '', category: 'other', unit_price: 0, unit: '月', is_required: 0, status: 'active', remark: '' }
  showFeeItemModal.value = true
}

const feeItemColumns = [
  { title: '名称', key: 'name', width: 130 },
  { title: '分类', key: 'category', width: 90, render: (r: FeeItemRow) => ({ bed: '床位费', care: '护理费', meal: '餐饮费', medical: '医疗费', other: '其他' }[r.category] ?? r.category) },
  { title: '单价', key: 'unit_price', width: 100, render: (r: FeeItemRow) => `¥${r.unit_price}/${r.unit}` },
  { title: '状态', key: 'status', width: 80, render: (r: FeeItemRow) => h(NTag, { type: r.status === 'active' ? 'success' : 'default' }, () => r.status === 'active' ? '启用' : '禁用') },
  { title: '操作', key: 'actions', width: 120, render: (r: FeeItemRow) => h(NSpace, null, { default: () => [
    h(NButton, { size: 'small', onClick: async () => { await feeStore.updateFeeItem(r.id, { status: r.status === 'active' ? 'inactive' : 'active' }); message.success('更新成功'); await feeStore.fetchFeeItems() } }, r.status === 'active' ? '禁用' : '启用'),
    h(NButton, { size: 'small', type: 'error', onClick: async () => { await feeStore.deleteFeeItem(r.id); message.success('删除成功'); await feeStore.fetchFeeItems() } }, '删除'),
  ] }) },
]

// ── 押金 ─────────────────────────────────────────
const showDepositModal = ref(false)
const depositForm = ref({ elderly_id: '', amount: 0, type: 'deposit', pay_method: 'cash', pay_date: formatDateTime(Date.now()), operator: '', remark: '' })
const depositBalance = computed(() => feeStore.deposits.reduce((sum, record) => sum + (record.type === 'deposit' ? record.amount : -record.amount), 0))

const payMethodOptions = [
  { label: '现金', value: 'cash' }, { label: '微信', value: 'wechat' },
  { label: '支付宝', value: 'alipay' }, { label: '银行转账', value: 'bank' }, { label: '其他', value: 'other' },
]

async function saveDeposit() {
  if (!depositForm.value.elderly_id || !depositForm.value.amount) return message.error('请填写必填项')
  if (depositForm.value.type === 'refund' && selectedElderlyId.value === depositForm.value.elderly_id && depositForm.value.amount > depositBalance.value) return message.error('退款金额不能超过当前押金余额')
  await feeStore.createDeposit({ ...depositForm.value, operator: depositForm.value.operator || null, remark: depositForm.value.remark || null })
  showDepositModal.value = false
  message.success('押金记录已保存')
  if (selectedElderlyId.value) await feeStore.fetchDeposits(selectedElderlyId.value)
}

function openDepositModal() {
  depositForm.value = { elderly_id: selectedElderlyId.value ?? '', amount: 0, type: 'deposit', pay_method: 'cash', pay_date: formatDateTime(Date.now()), operator: '', remark: '' }
  showDepositModal.value = true
}

// ── 生成账单 ─────────────────────────────────────
const showBillModal = ref(false)
const billForm = ref({ elderly_id: '', bill_month: new Date().toISOString().slice(0, 7), remark: '' })
type BillDetailDraft = { fee_item_id: string | null; item_name: string; quantity: number; unit_price: number; remark: string }
const billDetailDrafts = ref<BillDetailDraft[]>([])
const billTotal = computed(() => Number(billDetailDrafts.value.reduce((sum, detail) => sum + detail.quantity * detail.unit_price, 0).toFixed(2)))
const activeFeeItemOptions = computed(() => feeStore.feeItems.filter(item => item.status === 'active').map(item => ({ label: `${item.name} (¥${item.unit_price}/${item.unit})`, value: item.id })))

function createEmptyBillDetail(): BillDetailDraft {
  return { fee_item_id: null, item_name: '', quantity: 1, unit_price: 0, remark: '' }
}

function openBillModal() {
  billForm.value = { elderly_id: selectedElderlyId.value ?? '', bill_month: new Date().toISOString().slice(0, 7), remark: '' }
  const requiredItems = feeStore.feeItems.filter(item => item.status === 'active' && item.is_required === 1)
  billDetailDrafts.value = requiredItems.length
    ? requiredItems.map(item => ({ fee_item_id: item.id, item_name: item.name, quantity: 1, unit_price: item.unit_price, remark: '' }))
    : [createEmptyBillDetail()]
  showBillModal.value = true
}

function applyFeeItem(index: number, feeItemId: string | null) {
  const detail = billDetailDrafts.value[index]
  detail.fee_item_id = feeItemId
  const feeItem = feeStore.feeItems.find(item => item.id === feeItemId)
  if (feeItem) {
    detail.item_name = feeItem.name
    detail.unit_price = feeItem.unit_price
  }
}

async function saveBill() {
  if (!billForm.value.elderly_id || !billForm.value.bill_month) return message.error('请填写必填项')
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(billForm.value.bill_month)) return message.error('账期格式应为 YYYY-MM')
  if (!billDetailDrafts.value.length || billDetailDrafts.value.some(detail => !detail.item_name || detail.quantity <= 0 || detail.unit_price < 0)) return message.error('请完整填写账单明细')
  const existing = await feeStore.getBill(billForm.value.elderly_id, billForm.value.bill_month)
  if (existing) return message.error(`${billForm.value.bill_month} 账单已存在`)
  try {
    await feeStore.createBillWithDetails(
      { ...billForm.value, remark: billForm.value.remark || null },
      billDetailDrafts.value.map(detail => ({ ...detail, amount: Number((detail.quantity * detail.unit_price).toFixed(2)), remark: detail.remark || null })),
    )
    showBillModal.value = false
    message.success(`账单已生成，应收 ¥${billTotal.value}`)
    await Promise.all([feeStore.fetchBills(selectedElderlyId.value ?? undefined), refreshFinancialStats()])
  } catch (error) {
    message.error(error instanceof Error ? error.message : '账单生成失败')
  }
}

// ── 收款 ─────────────────────────────────────────
const showPayModal = ref(false)
const payForm = ref({ elderly_id: '', bill_id: '' as string | null, amount: 0, pay_method: 'cash', pay_date: formatDateTime(Date.now()), operator: '', receipt_no: '', remark: '' })
function openPay(bill: MonthlyBillRow) {
  payForm.value = { elderly_id: bill.elderly_id, bill_id: bill.id, amount: Number((bill.total - bill.paid).toFixed(2)), pay_method: 'cash', pay_date: formatDateTime(Date.now()), operator: '', receipt_no: '', remark: '' }
  showPayModal.value = true
}

async function savePay() {
  if (!payForm.value.amount) return message.error('请填写收款金额')
  const bill = feeStore.bills.find(item => item.id === payForm.value.bill_id)
  if (bill && payForm.value.amount > bill.total - bill.paid) return message.error('收款金额不能超过未收金额')
  try {
    await feeStore.createPayment({ ...payForm.value, operator: payForm.value.operator || null, receipt_no: payForm.value.receipt_no || null, remark: payForm.value.remark || null })
    await Promise.all([feeStore.fetchBills(selectedElderlyId.value ?? undefined), feeStore.fetchPayments(selectedElderlyId.value ?? undefined), refreshFinancialStats()])
    showPayModal.value = false
    message.success('收款成功')
  } catch (error) {
    message.error(error instanceof Error ? error.message : '收款失败')
  }
}

// ── 账单明细 ─────────────────────────────────────
const showBillDetailModal = ref(false)
const selectedBill = ref<MonthlyBillRow | null>(null)
const detailPayments = ref<PaymentRecordRow[]>([])

async function openBillDetail(bill: MonthlyBillRow) {
  selectedBill.value = bill
  await Promise.all([
    feeStore.fetchBillDetails(bill.id),
    window.api.fee.payment.list(undefined, bill.id).then(rows => { detailPayments.value = rows }),
  ])
  showBillDetailModal.value = true
}

const billColumns = [
  { title: '账期', key: 'bill_month', width: 100 },
  { title: '老人', key: 'elderly_id', width: 90, render: (r: MonthlyBillRow) => elderlyStore.list.find(e => e.id === r.elderly_id)?.name ?? r.elderly_id },
  { title: '账单金额', key: 'total', width: 100, render: (r: MonthlyBillRow) => `¥${r.total}` },
  { title: '已收', key: 'paid', width: 90, render: (r: MonthlyBillRow) => `¥${r.paid}` },
  { title: '欠费', key: 'owe', width: 90, render: (r: MonthlyBillRow) => {
    const owe = r.total - r.paid
    return h(NTag, { type: owe > 0 ? 'error' : 'success' }, () => owe > 0 ? `¥${owe}` : '已结清')
  }},
  { title: '状态', key: 'status', width: 80, render: (r: MonthlyBillRow) => {
    const map = { unpaid: ['error', '未收'], partial: ['warning', '部分'], paid: ['success', '已收'] } as const
    const [type, label] = map[r.status] ?? ['default', r.status]
    return h(NTag, { type }, () => label)
  }},
  { title: '操作', key: 'actions', width: 150, render: (r: MonthlyBillRow) => h(NSpace, null, { default: () => [
    h(NButton, { size: 'small', onClick: () => openBillDetail(r) }, '明细'),
    h(NButton, { size: 'small', type: 'primary', disabled: r.status === 'paid', onClick: () => openPay(r) }, '收款'),
  ] }) },
]

const billDetailColumns = [
  { title: '费用项目', key: 'item_name', minWidth: 130 },
  { title: '数量', key: 'quantity', width: 80 },
  { title: '单价', key: 'unit_price', width: 100, render: (r: BillDetailRow) => `¥${r.unit_price}` },
  { title: '金额', key: 'amount', width: 100, render: (r: BillDetailRow) => `¥${r.amount}` },
  { title: '备注', key: 'remark', minWidth: 120, render: (r: BillDetailRow) => r.remark || '—' },
]

const paymentColumns = [
  { title: '日期', key: 'pay_date', width: 165, render: (r: PaymentRecordRow) => formatDateTime(r.pay_date) },
  { title: '老人', key: 'elderly_id', width: 90, render: (r: PaymentRecordRow) => elderlyStore.list.find(e => e.id === r.elderly_id)?.name ?? r.elderly_id },
  { title: '账期', key: 'bill_id', width: 90, render: (r: PaymentRecordRow) => feeStore.bills.find(bill => bill.id === r.bill_id)?.bill_month ?? '非账单收款' },
  { title: '金额', key: 'amount', width: 100, render: (r: PaymentRecordRow) => `¥${r.amount}` },
  { title: '方式', key: 'pay_method', width: 90, render: (r: PaymentRecordRow) => ({ cash: '现金', wechat: '微信', alipay: '支付宝', bank: '银行转账', other: '其他' }[r.pay_method] ?? r.pay_method) },
  { title: '收据号', key: 'receipt_no', width: 120, render: (r: PaymentRecordRow) => r.receipt_no || '—' },
  { title: '经办人', key: 'operator', width: 90, render: (r: PaymentRecordRow) => r.operator || '—' },
]
</script>

<template>
  <BasePage title="费用管理">
    <NTabs type="line" animated>
      <!-- 费用项目 -->
      <NTabPane name="items" tab="费用项目配置">
        <NCard>
          <template #header-extra>
            <NSpace>
              <NButton :loading="refreshing" size="small" @click="refresh">刷新</NButton>
              <NButton type="primary" size="small" @click="openFeeItemModal">+ 新增项目</NButton>
            </NSpace>
          </template>
          <BaseTable :columns="feeItemColumns" :data="feeStore.feeItems" :pagination="false" />
        </NCard>
      </NTabPane>

      <!-- 账单管理 -->
      <NTabPane name="bills" tab="月度账单">
        <NCard class="mb-3">
          <NGrid :cols="4" :x-gap="24" :y-gap="16" responsive="screen">
            <NGi><NStatistic label="本月应收" :value="feeStats.total_billed" :precision="2" prefix="¥" /></NGi>
            <NGi><NStatistic label="本月实收" :value="feeStats.total_paid" :precision="2" prefix="¥" /></NGi>
            <NGi><NStatistic label="本月欠费" :value="feeStats.overdue" :precision="2" prefix="¥" /></NGi>
            <NGi>
              <NDatePicker v-model:formatted-value="statMonth" value-format="yyyy-MM" :clearable="false" style="width: 100%" @update:formatted-value="() => refreshFinancialStats()" />
            </NGi>
          </NGrid>
          <NDivider />
          <NSpace>
            <NSelect v-model:value="selectedElderlyId" :options="elderlyOptions" filterable clearable placeholder="筛选老人" style="width:180px" @update:value="onElderlyChange" />
            <NButton type="primary" @click="openBillModal">+ 生成账单</NButton>
          </NSpace>
        </NCard>
        <NCard>
          <BaseTable :columns="billColumns" :data="feeStore.bills" :loading="feeStore.loading" :pagination="{ pageSize: 15 }" />
        </NCard>
      </NTabPane>

      <!-- 押金管理 -->
      <NTabPane name="deposit" tab="押金管理">
        <NCard>
          <template #header-extra>
            <NSpace>
              <NSelect v-model:value="selectedElderlyId" :options="elderlyOptions" filterable clearable placeholder="选择老人" style="width:180px" @update:value="onElderlyChange" />
              <NButton type="primary" size="small" @click="openDepositModal">+ 押金登记</NButton>
            </NSpace>
          </template>
          <NStatistic v-if="selectedElderlyId" label="当前押金余额" :value="depositBalance" :precision="2" prefix="¥" class="mb-3" />
          <BaseTable
            :columns="[
              { title: '老人', key: 'elderly_id', width: 90, render: r => elderlyStore.list.find(e => e.id === r.elderly_id)?.name ?? r.elderly_id },
              { title: '类型', key: 'type', width: 80, render: r => h(NTag, { type: r.type === 'deposit' ? 'success' : 'error' }, () => r.type === 'deposit' ? '收押金' : '退押金') },
              { title: '金额', key: 'amount', width: 100, render: r => `¥${r.amount}` },
              { title: '日期', key: 'pay_date', width: 160, render: (r: DepositRecordRow) => formatDateTime(r.pay_date) },
              { title: '经办人', key: 'operator', width: 90 },
            ]"
            :data="feeStore.deposits"
            :pagination="{ pageSize: 15 }"
          />
        </NCard>
      </NTabPane>

      <!-- 收款流水 -->
      <NTabPane name="payments" tab="收款记录">
        <NCard>
          <template #header-extra>
            <NSpace>
              <NSelect v-model:value="selectedElderlyId" :options="elderlyOptions" filterable clearable placeholder="筛选老人" style="width:180px" @update:value="onElderlyChange" />
              <NButton :loading="refreshing" size="small" @click="refresh">刷新</NButton>
            </NSpace>
          </template>
          <BaseTable :columns="paymentColumns" :data="feeStore.payments" :loading="feeStore.loading" :pagination="{ pageSize: 15 }" />
        </NCard>
      </NTabPane>
    </NTabs>

    <!-- 费用项目弹窗 -->
    <NModal v-model:show="showFeeItemModal" title="费用项目" preset="card" style="width:440px">
      <NForm :model="feeItemForm" label-placement="left" label-width="80">
        <NFormItem label="项目名称" required><NInput v-model:value="feeItemForm.name" placeholder="如：护理费" /></NFormItem>
        <NFormItem label="分类"><NSelect v-model:value="feeItemForm.category" :options="categoryOptions" /></NFormItem>
        <NFormItem label="单价(元)"><NInputNumber v-model:value="feeItemForm.unit_price" :min="0" :precision="2" /></NFormItem>
        <NFormItem label="计费单位"><NInput v-model:value="feeItemForm.unit" placeholder="如：月、次" /></NFormItem>
        <NFormItem label="备注"><NInput v-model:value="feeItemForm.remark" /></NFormItem>
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showFeeItemModal = false">取消</NButton>
          <NButton type="primary" @click="saveFeeItem">保存</NButton>
        </NSpace>
      </template>
    </NModal>

    <!-- 账单弹窗 -->
    <NModal v-model:show="showBillModal" title="生成月度账单" preset="card" style="width:440px">
      <NForm :model="billForm" label-placement="left" label-width="80">
        <NFormItem label="老人" required><NSelect v-model:value="billForm.elderly_id" :options="elderlyOptions" filterable /></NFormItem>
        <NFormItem label="账期" required><NInput v-model:value="billForm.bill_month" placeholder="YYYY-MM" /></NFormItem>
        <NDivider>账单明细</NDivider>
        <div v-for="(detail, index) in billDetailDrafts" :key="index" class="mb-3">
          <NSpace vertical :size="8">
            <NSpace align="center" wrap-item>
              <NSelect :value="detail.fee_item_id" :options="activeFeeItemOptions" clearable placeholder="选择费用项目" style="width: 200px" @update:value="value => applyFeeItem(index, value)" />
              <NInput v-model:value="detail.item_name" placeholder="费用名称" style="width: 150px" />
              <NInputNumber v-model:value="detail.quantity" :min="0.01" :precision="2" placeholder="数量" style="width: 100px" />
              <NInputNumber v-model:value="detail.unit_price" :min="0" :precision="2" placeholder="单价" style="width: 110px" />
              <NButton v-if="billDetailDrafts.length > 1" size="small" type="error" @click="billDetailDrafts.splice(index, 1)">移除</NButton>
            </NSpace>
            <NInput v-model:value="detail.remark" placeholder="该项目备注" />
          </NSpace>
        </div>
        <NSpace justify="space-between" align="center" class="mb-3">
          <NButton size="small" @click="billDetailDrafts.push(createEmptyBillDetail())">+ 添加费用项目</NButton>
          <NTag type="info">账单合计 ¥{{ billTotal }}</NTag>
        </NSpace>
        <NFormItem label="备注"><NInput v-model:value="billForm.remark" /></NFormItem>
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showBillModal = false">取消</NButton>
          <NButton type="primary" @click="saveBill">生成</NButton>
        </NSpace>
      </template>
    </NModal>

    <!-- 收款弹窗 -->
    <NModal v-model:show="showPayModal" title="收款登记" preset="card" style="width:440px">
      <NForm :model="payForm" label-placement="left" label-width="90">
        <NFormItem label="收款金额" required><NInputNumber v-model:value="payForm.amount" :min="0.01" :precision="2" /></NFormItem>
        <NFormItem label="收款方式"><NSelect v-model:value="payForm.pay_method" :options="payMethodOptions" /></NFormItem>
        <NFormItem label="收款日期">
          <NDatePicker v-model:formatted-value="payForm.pay_date" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" style="width: 100%" />
        </NFormItem>
        <NFormItem label="经办人"><NInput v-model:value="payForm.operator" /></NFormItem>
        <NFormItem label="收据号"><NInput v-model:value="payForm.receipt_no" /></NFormItem>
        <NFormItem label="备注"><NInput v-model:value="payForm.remark" /></NFormItem>
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showPayModal = false">取消</NButton>
          <NButton type="primary" @click="savePay">确认收款</NButton>
        </NSpace>
      </template>
    </NModal>

    <!-- 押金弹窗 -->
    <NModal v-model:show="showDepositModal" title="押金记录" preset="card" style="width:440px">
      <NForm :model="depositForm" label-placement="left" label-width="90">
        <NFormItem label="老人" required><NSelect v-model:value="depositForm.elderly_id" :options="elderlyOptions" filterable /></NFormItem>
        <NFormItem label="类型"><NSelect v-model:value="depositForm.type" :options="[{label:'收押金',value:'deposit'},{label:'退押金',value:'refund'}]" /></NFormItem>
        <NFormItem label="金额(元)" required><NInputNumber v-model:value="depositForm.amount" :min="0.01" :precision="2" /></NFormItem>
        <NFormItem label="支付方式"><NSelect v-model:value="depositForm.pay_method" :options="payMethodOptions" /></NFormItem>
        <NFormItem label="日期">
          <NDatePicker v-model:formatted-value="depositForm.pay_date" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" style="width: 100%" />
        </NFormItem>
        <NFormItem label="经办人"><NInput v-model:value="depositForm.operator" /></NFormItem>
        <NFormItem label="备注"><NInput v-model:value="depositForm.remark" /></NFormItem>
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showDepositModal = false">取消</NButton>
          <NButton type="primary" @click="saveDeposit">保存</NButton>
        </NSpace>
      </template>
    </NModal>

    <!-- 账单详情 -->
    <NModal v-model:show="showBillDetailModal" title="账单明细" preset="card" style="width:760px">
      <NGrid v-if="selectedBill" :cols="3" :x-gap="24" class="mb-3">
        <NGi><NStatistic label="应收金额" :value="selectedBill.total" :precision="2" prefix="¥" /></NGi>
        <NGi><NStatistic label="已收金额" :value="selectedBill.paid" :precision="2" prefix="¥" /></NGi>
        <NGi><NStatistic label="未收金额" :value="selectedBill.total - selectedBill.paid" :precision="2" prefix="¥" /></NGi>
      </NGrid>
      <NDivider>费用项目</NDivider>
      <BaseTable :columns="billDetailColumns" :data="feeStore.billDetails" :pagination="false" />
      <NDivider>收款记录</NDivider>
      <BaseTable :columns="paymentColumns" :data="detailPayments" :pagination="false" />
    </NModal>
  </BasePage>
</template>
