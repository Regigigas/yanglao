<script setup lang="ts">
defineOptions({ name: 'Contract' })
import {
  NCard, NButton, NSpace, NTag, NModal, NForm, NFormItem,
  NInput, NInputNumber, NSelect, NDatePicker, useMessage, useDialog, NAlert
} from 'naive-ui'
import { BasePage, BaseTable } from '@yanglao/ui'
import { useContractStore } from '../../stores/contract.store'
import { useElderlyStore } from '../../stores/elderly.store'
import { ref, h, computed } from 'vue'
import { formatDateTime } from '@yanglao/core'
import { usePageRefresh } from '../../composables/usePageRefresh'
import type { ContractRow } from '@yanglao/db'

const contractStore = useContractStore()
const elderlyStore = useElderlyStore()
const message = useMessage()
const dialog = useDialog()

async function loadData() {
  await Promise.all([
    contractStore.fetchAll(),
    contractStore.fetchExpiring(30),
    elderlyStore.fetchList(),
  ])
}
const { refresh, refreshing } = usePageRefresh(loadData)

const elderlyOptions = computed(() =>
  elderlyStore.list.map(e => ({ label: e.name, value: e.id }))
)

// ── 新建合同 ─────────────────────────────────────
const showContractModal = ref(false)
const contractForm = ref(createContractForm())
const attachmentName = ref('')

function createContractForm() {
  const now = Date.now()
  return {
    elderly_id: '',
    contract_no: '',
    sign_date: now,
    start_date: now,
    end_date: null as number | null,
    auto_renew: 0 as 0 | 1,
    renew_months: 12,
    monthly_amount: 0,
    status: 'active',
    file_path: '',
    remark: '',
    created_by: '',
  }
}

async function openNewContract() {
  const no = await contractStore.genContractNo()
  contractForm.value = { ...createContractForm(), contract_no: no }
  attachmentName.value = ''
  showContractModal.value = true
}

async function saveContract() {
  if (!contractForm.value.elderly_id || !contractForm.value.start_date || !contractForm.value.end_date) {
    return message.error('请填写老人、开始日期和结束日期')
  }
  await contractStore.create({
    ...contractForm.value,
    sign_date: formatDateTime(contractForm.value.sign_date),
    start_date: formatDateTime(contractForm.value.start_date),
    end_date: formatDateTime(contractForm.value.end_date),
  })
  showContractModal.value = false
  message.success('合同已创建')
  await refresh()
}

async function selectAttachment() {
  try {
    const result = await window.api.contract.selectAttachment()
    if (result.canceled || !result.filePath) return
    contractForm.value.file_path = result.filePath
    attachmentName.value = result.fileName ?? '已选择合同扫描件'
  } catch {
    message.error('选择合同扫描件失败')
  }
}

async function openAttachment(filePath: string) {
  try {
    await window.api.contract.openAttachment(filePath)
  } catch {
    message.error('无法打开合同扫描件，文件可能已被移动或删除')
  }
}

async function terminateContract(id: string) {
  dialog.warning({
    title: '终止合同',
    content: '确定要终止此合同吗？',
    positiveText: '确定终止',
    negativeText: '取消',
    onPositiveClick: async () => {
      await contractStore.update(id, { status: 'terminated' })
      message.success('合同已终止')
      await refresh()
    },
  })
}

const statusTagType: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
  active: 'success', expired: 'warning', terminated: 'error'
}
const statusLabel: Record<string, string> = {
  active: '有效', expired: '已过期', terminated: '已终止'
}

const contractColumns = [
  { title: '合同编号', key: 'contract_no', width: 160 },
  { title: '老人', key: 'elderly_id', width: 90, render: (r: ContractRow) => elderlyStore.list.find(e => e.id === r.elderly_id)?.name ?? '—' },
  { title: '签订日期', key: 'sign_date', width: 160, render: (r: ContractRow) => formatDateTime(r.sign_date) },
  { title: '起始日期', key: 'start_date', width: 160, render: (r: ContractRow) => formatDateTime(r.start_date) },
  { title: '终止日期', key: 'end_date', width: 160, render: (r: ContractRow) => formatDateTime(r.end_date) },
  { title: '月费(元)', key: 'monthly_amount', width: 100, render: (r: ContractRow) => `¥${r.monthly_amount}` },
  { title: '扫描件', key: 'file_path', width: 90, render: (r: ContractRow) => r.file_path
    ? h(NButton, { text: true, type: 'primary', size: 'small', onClick: () => openAttachment(r.file_path!) }, '查看')
    : '—' },
  { title: '状态', key: 'status', width: 90, render: (r: ContractRow) => h(NTag, { type: statusTagType[r.status] ?? 'default' }, () => statusLabel[r.status] ?? r.status) },
  {
    title: '操作', key: 'actions', width: 120,
    render: (r: ContractRow) => h(NSpace, null, { default: () => [
      h(NButton, { size: 'small', disabled: r.status !== 'active', onClick: () => terminateContract(r.id) }, '终止'),
      h(NButton, { size: 'small', type: 'error', onClick: () => {
        dialog.warning({ title: '删除', content: '确认删除？', positiveText: '确定', negativeText: '取消',
          onPositiveClick: async () => { await contractStore.remove(r.id); message.success('已删除'); await refresh() }
        })
      }}, '删除'),
    ]})
  },
]
</script>

<template>
  <BasePage title="合同管理">
    <!-- 到期预警 -->
    <NAlert v-if="contractStore.expiring.length > 0" type="warning" class="mb-4" title="合同即将到期提醒">
      以下 {{ contractStore.expiring.length }} 份合同将在30天内到期，请及时处理：
      {{ contractStore.expiring.map(c => elderlyStore.list.find(e => e.id === c.elderly_id)?.name).filter(Boolean).join('、') }}
    </NAlert>

    <NSpace justify="end" class="mb-4">
      <NButton :loading="refreshing" size="small" @click="refresh">刷新</NButton>
      <NButton type="primary" @click="openNewContract">新建合同</NButton>
    </NSpace>

    <NCard>
      <BaseTable
        :columns="contractColumns"
        :data="contractStore.list"
        :loading="contractStore.loading"
        :pagination="{ pageSize: 15 }"
      />
    </NCard>

    <!-- 新建合同弹窗 -->
    <NModal v-model:show="showContractModal" title="新建合同" preset="card" style="width:560px">
      <NForm :model="contractForm" label-placement="left" label-width="90">
        <NFormItem label="合同编号"><NInput v-model:value="contractForm.contract_no" /></NFormItem>
        <NFormItem label="老人" required><NSelect v-model:value="contractForm.elderly_id" :options="elderlyOptions" filterable /></NFormItem>
        <NFormItem label="签订日期">
          <NDatePicker v-model:value="contractForm.sign_date" type="date" style="width: 100%" />
        </NFormItem>
        <NFormItem label="开始日期" required>
          <NDatePicker v-model:value="contractForm.start_date" type="date" style="width: 100%" />
        </NFormItem>
        <NFormItem label="结束日期" required>
          <NDatePicker v-model:value="contractForm.end_date" type="date" style="width: 100%" />
        </NFormItem>
        <NFormItem label="月费用(元)"><NInputNumber v-model:value="contractForm.monthly_amount" :min="0" :precision="2" /></NFormItem>
        <NFormItem label="自动续签">
          <NSelect v-model:value="contractForm.auto_renew" :options="[{label:'否',value:0},{label:'是',value:1}]" />
        </NFormItem>
        <NFormItem label="续签月数" v-if="contractForm.auto_renew"><NInputNumber v-model:value="contractForm.renew_months" :min="1" /></NFormItem>
        <NFormItem label="合同扫描件">
          <NSpace align="center">
            <NButton size="small" @click="selectAttachment">选择文件</NButton>
            <NButton v-if="contractForm.file_path" text type="primary" size="small" @click="openAttachment(contractForm.file_path)">
              {{ attachmentName || '查看已选择文件' }}
            </NButton>
            <span v-else class="text-xs text-gray-400">支持 PDF、JPG、PNG、WebP</span>
          </NSpace>
        </NFormItem>
        <NFormItem label="备注"><NInput v-model:value="contractForm.remark" type="textarea" :rows="2" /></NFormItem>
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showContractModal = false">取消</NButton>
          <NButton type="primary" @click="saveContract">签署合同</NButton>
        </NSpace>
      </template>
    </NModal>
  </BasePage>
</template>
