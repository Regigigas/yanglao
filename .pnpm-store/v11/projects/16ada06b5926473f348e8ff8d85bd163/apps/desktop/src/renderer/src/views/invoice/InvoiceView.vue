<script setup lang="ts">
defineOptions({ name: 'Invoice' })
import { computed, h, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { NButton, NCard, NDatePicker, NForm, NFormItem, NInput, NInputNumber, NModal, NSelect, NSpace, NTag, useMessage } from 'naive-ui'
import { BasePage, BaseTable } from '@yanglao/ui'
import { formatDateTime } from '@yanglao/core'
import type { InvoiceRow, MonthlyBillRow } from '@yanglao/db'
import { useElderlyStore } from '../../stores/elderly.store'
import { useFeeStore } from '../../stores/fee.store'

const route = useRoute()
const message = useMessage()
const elderlyStore = useElderlyStore()
const feeStore = useFeeStore()
const invoices = ref<InvoiceRow[]>([])
const selectedElderlyId = ref<string | null>(null)
const loading = ref(false)
const showModal = ref(false)
const editingId = ref<string | null>(null)
const form = ref({ bill_id: '', elderly_id: '', invoice_no: '', title: '个人', tax_no: '', invoice_type: 'normal', amount: 0, invoice_date: formatDateTime(Date.now()), status: 'pending', email: '', operator: '', applicant: '', remark: '' })

const elderlyOptions = computed(() => elderlyStore.list.map(item => ({ label: item.name, value: item.id })))
const paidBills = computed(() => feeStore.bills.filter(bill => bill.status === 'paid' && !invoices.value.some(invoice => invoice.bill_id === bill.id)))
const billOptions = computed(() => paidBills.value.map(bill => ({ label: `${elderlyStore.list.find(item => item.id === bill.elderly_id)?.name ?? bill.elderly_id} / ${bill.bill_month} / ¥${bill.paid}`, value: bill.id })))

async function loadData() {
  loading.value = true
  try {
    await Promise.all([elderlyStore.fetchList(), feeStore.fetchBills()])
    invoices.value = await window.api.invoice.list(selectedElderlyId.value ?? undefined)
  } finally { loading.value = false }
}

function openCreate(bill?: MonthlyBillRow) {
  const target = bill ?? paidBills.value.find(item => item.id === route.query.billId) ?? paidBills.value[0]
  editingId.value = null
  form.value = { bill_id: target?.id ?? '', elderly_id: target?.elderly_id ?? '', invoice_no: '', title: '个人', tax_no: '', invoice_type: 'normal', amount: target?.paid ?? 0, invoice_date: formatDateTime(Date.now()), status: 'pending', email: '', operator: '', applicant: '', remark: '' }
  showModal.value = true
}

function openEdit(row: InvoiceRow) {
  if (row.status !== 'pending') return message.warning('只有待处理发票可以编辑')
  editingId.value = row.id
  form.value = { bill_id: row.bill_id, elderly_id: row.elderly_id, invoice_no: row.invoice_no, title: row.title, tax_no: row.tax_no ?? '', invoice_type: row.invoice_type, amount: row.amount, invoice_date: row.invoice_date, status: row.status, email: row.email ?? '', operator: row.operator ?? '', applicant: row.applicant ?? '', remark: row.remark ?? '' }
  showModal.value = true
}

function selectBill(billId: string) {
  const bill = feeStore.bills.find(item => item.id === billId)
  if (!bill) return
  form.value.elderly_id = bill.elderly_id
  form.value.amount = bill.paid
}

async function save() {
  if (!form.value.bill_id || !form.value.invoice_no.trim() || !form.value.title.trim()) return message.error('请选择账单并填写发票号码、抬头')
  try {
    if (editingId.value) {
      await window.api.invoice.update(editingId.value, { title: form.value.title, tax_no: form.value.tax_no || null, applicant: form.value.applicant || null, remark: form.value.remark || null })
    } else {
      await window.api.invoice.create({ ...form.value, tax_no: form.value.tax_no || null, email: form.value.email || null, operator: form.value.operator || null, applicant: form.value.applicant || null, remark: form.value.remark || null })
    }
    showModal.value = false
    message.success('发票已开具并进入同步队列')
    await loadData()
  } catch (error) { message.error(error instanceof Error ? error.message : '开票失败') }
}

async function voidInvoice(row: InvoiceRow) {
  try {
    await window.api.invoice.void(row.id, '业务作废')
    message.success('发票已作废，状态将同步到其他设备')
    await loadData()
  } catch (error) { message.error(error instanceof Error ? error.message : '作废失败') }
}

async function issueInvoice(row: InvoiceRow) {
  try {
    await window.api.invoice.issue(row.id)
    message.success('发票已确认开具，财务字段已锁定')
    await loadData()
  } catch (error) { message.error(error instanceof Error ? error.message : '确认开具失败') }
}

const columns = [
  { title: '发票号码', key: 'invoice_no', minWidth: 140 },
  { title: '老人', key: 'elderly_id', width: 100, render: (row: InvoiceRow) => elderlyStore.list.find(item => item.id === row.elderly_id)?.name ?? row.elderly_id },
  { title: '抬头', key: 'title', minWidth: 130 },
  { title: '金额', key: 'amount', width: 100, render: (row: InvoiceRow) => `¥${row.amount.toFixed(2)}` },
  { title: '开票日期', key: 'invoice_date', width: 165, render: (row: InvoiceRow) => formatDateTime(row.invoice_date) },
  { title: '状态', key: 'status', width: 90, render: (row: InvoiceRow) => h(NTag, { type: row.status === 'issued' ? 'success' : row.status === 'pending' ? 'warning' : 'error' }, () => ({ pending: '待处理', issued: '已开具', voided: '已作废' }[row.status])) },
  { title: '操作', key: 'actions', width: 220, render: (row: InvoiceRow) => h(NSpace, null, { default: () => [h(NButton, { size: 'small', disabled: row.status !== 'pending', onClick: () => openEdit(row) }, () => '编辑'), h(NButton, { size: 'small', type: 'success', disabled: row.status !== 'pending', onClick: () => issueInvoice(row) }, () => '确认开具'), h(NButton, { size: 'small', type: 'error', disabled: row.status === 'voided', onClick: () => voidInvoice(row) }, () => '作废')] }) },
]

onMounted(async () => {
  await loadData()
  if (route.query.billId) openCreate()
})
</script>

<template>
  <BasePage title="发票管理">
    <NCard title="发票列表">
      <template #header-extra>
        <NSpace>
          <NSelect v-model:value="selectedElderlyId" :options="elderlyOptions" clearable filterable placeholder="筛选老人" style="width: 180px" @update:value="loadData" />
          <NButton :loading="loading" @click="loadData">刷新</NButton>
          <NButton type="primary" :disabled="!paidBills.length" @click="openCreate()">+ 开具发票</NButton>
        </NSpace>
      </template>
      <BaseTable :columns="columns" :data="invoices" :loading="loading" :pagination="{ pageSize: 15 }" />
    </NCard>

    <NModal v-model:show="showModal" :title="editingId ? '编辑发票申请' : '新增发票申请'" preset="card" style="width: 520px">
      <NForm :model="form" label-placement="left" label-width="90">
        <NFormItem label="已结清账单" required><NSelect v-model:value="form.bill_id" :options="billOptions" :disabled="!!editingId" filterable @update:value="selectBill" /></NFormItem>
        <NFormItem label="发票号码" required><NInput v-model:value="form.invoice_no" :disabled="!!editingId" /></NFormItem>
        <NFormItem label="发票抬头" required><NInput v-model:value="form.title" /></NFormItem>
        <NFormItem label="税号"><NInput v-model:value="form.tax_no" /></NFormItem>
        <NFormItem label="发票类型"><NSelect v-model:value="form.invoice_type" :disabled="!!editingId" :options="[{ label: '电子普通发票', value: 'normal' }, { label: '增值税专用发票', value: 'special' }]" /></NFormItem>
        <NFormItem label="开票金额"><NInputNumber v-model:value="form.amount" disabled :precision="2" /></NFormItem>
        <NFormItem label="开票日期"><NDatePicker v-model:formatted-value="form.invoice_date" :disabled="!!editingId" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" style="width: 100%" /></NFormItem>
        <NFormItem label="接收邮箱"><NInput v-model:value="form.email" :disabled="!!editingId" /></NFormItem>
        <NFormItem label="经办人"><NInput v-model:value="form.operator" :disabled="!!editingId" /></NFormItem>
        <NFormItem label="申请人"><NInput v-model:value="form.applicant" /></NFormItem>
        <NFormItem label="备注"><NInput v-model:value="form.remark" /></NFormItem>
      </NForm>
      <template #footer><NSpace justify="end"><NButton @click="showModal = false">取消</NButton><NButton type="primary" @click="save">确认开票</NButton></NSpace></template>
    </NModal>
  </BasePage>
</template>
