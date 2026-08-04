<script setup lang="ts">
defineOptions({ name: 'Exam' })
import {
  NCard, NButton, NSpace, NTag, NModal, NForm, NFormItem,
  NInput, NSelect, NDatePicker, NTabs, NTabPane, NCheckbox, useMessage, useDialog
} from 'naive-ui'
import { BasePage, BaseTable } from '@yanglao/ui'
import { useHealthStore } from '../../stores/health.store'
import { useElderlyStore } from '../../stores/elderly.store'
import { ref, h, computed } from 'vue'
import { formatDateTime } from '@yanglao/core'
import { usePageRefresh } from '../../composables/usePageRefresh'
import type { HealthExamAppointmentRow, HealthExamResultRow } from '@yanglao/db'

const healthStore = useHealthStore()
const elderlyStore = useElderlyStore()
const message = useMessage()
const dialog = useDialog()

const selectedElderlyId = ref<string | null>(null)
const activeTab = ref('appointment')
const appointmentStatusFilter = ref<string | null>(null)
const resultKeyword = ref('')
const saving = ref(false)

type ExamItem = { name: string; value: string; unit: string; abnormal: 0 | 1 }

async function loadData() {
  await Promise.all([
    elderlyStore.fetchList(),
    healthStore.fetchExamAppointments(),
    healthStore.fetchExamResults(),
  ])
}
const { refresh, refreshing } = usePageRefresh(loadData)

const elderlyOptions = computed(() =>
  elderlyStore.list.filter(e => e.status !== 'left').map(e => ({ label: e.name, value: e.id }))
)

async function onElderlyChange(id: string | null) {
  selectedElderlyId.value = id
  await refreshExamData()
}

async function refreshExamData() {
  await Promise.all([
    healthStore.fetchExamAppointments(selectedElderlyId.value ?? undefined),
    healthStore.fetchExamResults(selectedElderlyId.value ?? undefined),
  ])
}

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

function elderlyName(id: string) {
  return elderlyStore.list.find(e => e.id === id)?.name ?? '—'
}

// ── 体检预约 ─────────────────────────────────────
const showApptModal = ref(false)
const editingAppointmentId = ref<string | null>(null)
const apptForm = ref({
  elderly_id: '',
  exam_date: formatDateTime(Date.now()),
  institution: '',
  exam_items: '',
  remark: '',
  created_by: null as string | null,
})

function openApptCreate() {
  editingAppointmentId.value = null
  apptForm.value = {
    elderly_id: selectedElderlyId.value ?? '',
    exam_date: formatDateTime(Date.now()),
    institution: '',
    exam_items: '',
    remark: '',
    created_by: null,
  }
  showApptModal.value = true
}

function openApptEdit(appointment: HealthExamAppointmentRow) {
  editingAppointmentId.value = appointment.id
  apptForm.value = {
    elderly_id: appointment.elderly_id,
    exam_date: appointment.exam_date,
    institution: appointment.institution ?? '',
    exam_items: appointment.exam_items ?? '',
    remark: appointment.remark ?? '',
    created_by: appointment.created_by,
  }
  showApptModal.value = true
}

async function saveAppointment() {
  if (!apptForm.value.elderly_id || !apptForm.value.exam_date) return message.error('请选择老人和体检时间')
  const data = {
    ...apptForm.value,
    institution: apptForm.value.institution.trim() || null,
    exam_items: apptForm.value.exam_items.trim() || null,
    remark: apptForm.value.remark.trim() || null,
  }
  saving.value = true
  try {
    if (editingAppointmentId.value) {
      await healthStore.updateExamAppointment(editingAppointmentId.value, data)
      message.success('体检预约已更新')
    } else {
      await healthStore.createExamAppointment(data)
      message.success('体检预约已创建')
    }
    showApptModal.value = false
    await refreshExamData()
  } catch (error) {
    message.error(errorMessage(error, '保存体检预约失败'))
  } finally {
    saving.value = false
  }
}

function cancelAppt(row: HealthExamAppointmentRow) {
  dialog.warning({
    title: '取消预约', content: '确定要取消这条体检预约吗？', positiveText: '确定', negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await healthStore.cancelExamAppointment(row.id)
        message.success('预约已取消')
        await refreshExamData()
      } catch (error) {
        message.error(errorMessage(error, '取消预约失败'))
      }
    }
  })
}

const apptStatusTagType: Record<string, 'warning' | 'success' | 'default'> = { pending: 'warning', completed: 'success', cancelled: 'default' }
const apptStatusLabel: Record<string, string> = { pending: '待体检', completed: '已完成', cancelled: '已取消' }
const appointmentStatusOptions = [
  { label: '待体检', value: 'pending' },
  { label: '已完成', value: 'completed' },
  { label: '已取消', value: 'cancelled' },
]
const filteredAppointments = computed(() =>
  appointmentStatusFilter.value
    ? healthStore.examAppointments.filter(appointment => appointment.status === appointmentStatusFilter.value)
    : healthStore.examAppointments
)

const apptColumns = [
  { title: '老人', key: 'elderly_id', width: 100, render: (r: HealthExamAppointmentRow) => elderlyName(r.elderly_id) },
  { title: '预约时间', key: 'exam_date', width: 170, render: (r: HealthExamAppointmentRow) => formatDateTime(r.exam_date) },
  { title: '体检机构', key: 'institution', width: 150, render: (r: HealthExamAppointmentRow) => r.institution ?? '—' },
  { title: '体检项目', key: 'exam_items', render: (r: HealthExamAppointmentRow) => r.exam_items ?? '—' },
  { title: '状态', key: 'status', width: 90, render: (r: HealthExamAppointmentRow) => h(NTag, { type: apptStatusTagType[r.status] }, () => apptStatusLabel[r.status]) },
  {
    title: '操作', key: 'actions', width: 190,
    render: (r: HealthExamAppointmentRow) => r.status === 'pending'
      ? h(NSpace, null, { default: () => [
          h(NButton, { size: 'small', type: 'primary', onClick: () => openResultFromAppt(r) }, '录入结果'),
          h(NButton, { size: 'small', onClick: () => openApptEdit(r) }, '编辑'),
          h(NButton, { size: 'small', onClick: () => cancelAppt(r) }, '取消'),
        ]})
      : null,
  },
]

// ── 体检结果 ─────────────────────────────────────
const showResultModal = ref(false)
const showResultDetail = ref(false)
const editingResultId = ref<string | null>(null)
const selectedResult = ref<HealthExamResultRow | null>(null)
const resultForm = ref({
  elderly_id: '',
  appointment_id: null as string | null,
  exam_date: formatDateTime(Date.now()),
  institution: '',
  conclusion: '',
  created_by: null as string | null,
})
const itemInput = ref({ name: '', value: '', unit: '', abnormal: false })
const itemList = ref<ExamItem[]>([])

function openResultCreate() {
  editingResultId.value = null
  resultForm.value = {
    elderly_id: selectedElderlyId.value ?? '',
    appointment_id: null,
    exam_date: formatDateTime(Date.now()),
    institution: '',
    conclusion: '',
    created_by: null,
  }
  itemList.value = []
  itemInput.value = { name: '', value: '', unit: '', abnormal: false }
  showResultModal.value = true
}

function openResultFromAppt(appt: HealthExamAppointmentRow) {
  editingResultId.value = null
  resultForm.value = {
    elderly_id: appt.elderly_id,
    appointment_id: appt.id,
    exam_date: formatDateTime(Date.now()),
    institution: appt.institution ?? '',
    conclusion: '',
    created_by: null,
  }
  itemList.value = []
  itemInput.value = { name: '', value: '', unit: '', abnormal: false }
  showResultModal.value = true
}

function openResultEdit(result: HealthExamResultRow) {
  editingResultId.value = result.id
  resultForm.value = {
    elderly_id: result.elderly_id,
    appointment_id: result.appointment_id,
    exam_date: result.exam_date,
    institution: result.institution ?? '',
    conclusion: result.conclusion ?? '',
    created_by: result.created_by,
  }
  itemList.value = parseItems(result.items)
  itemInput.value = { name: '', value: '', unit: '', abnormal: false }
  showResultModal.value = true
}

function openResultDetail(result: HealthExamResultRow) {
  selectedResult.value = result
  showResultDetail.value = true
}

function addItem() {
  if (!itemInput.value.name || !itemInput.value.value) return message.error('请填写检查项名称和数值')
  itemList.value.push({
    name: itemInput.value.name, value: itemInput.value.value, unit: itemInput.value.unit,
    abnormal: itemInput.value.abnormal ? 1 : 0,
  })
  itemInput.value = { name: '', value: '', unit: '', abnormal: false }
}

function removeItem(idx: number) {
  itemList.value.splice(idx, 1)
}

async function saveResult() {
  if (!resultForm.value.elderly_id || !resultForm.value.exam_date) return message.error('请选择老人和体检日期')
  if (!itemList.value.length && !resultForm.value.conclusion.trim()) return message.error('请至少录入一项检查结果或体检结论')
  const data = {
    ...resultForm.value,
    institution: resultForm.value.institution.trim() || null,
    conclusion: resultForm.value.conclusion.trim() || null,
    items: JSON.stringify(itemList.value),
    attachment_path: null,
  }
  saving.value = true
  try {
    if (editingResultId.value) {
      await healthStore.updateExamResult(editingResultId.value, {
        exam_date: data.exam_date,
        institution: data.institution,
        conclusion: data.conclusion,
        items: data.items,
        attachment_path: data.attachment_path,
      })
      if (selectedResult.value?.id === editingResultId.value) selectedResult.value = { ...selectedResult.value, ...data }
      message.success('体检结果已更新')
    } else {
      await healthStore.createExamResult(data)
      message.success('体检结果已保存')
    }
    showResultModal.value = false
    activeTab.value = 'result'
    await refreshExamData()
  } catch (error) {
    message.error(errorMessage(error, '保存体检结果失败'))
  } finally {
    saving.value = false
  }
}

function parseItems(json: string): ExamItem[] {
  try {
    const items: unknown = JSON.parse(json)
    return Array.isArray(items) ? items.filter((item): item is ExamItem =>
      typeof item === 'object' && item !== null && 'name' in item && 'value' in item
    ) : []
  } catch {
    return []
  }
}

const filteredResults = computed(() => {
  const keyword = resultKeyword.value.trim().toLowerCase()
  if (!keyword) return healthStore.examResults
  return healthStore.examResults.filter(result => [
    elderlyName(result.elderly_id), result.institution ?? '', result.conclusion ?? '', result.items,
  ].some(value => value.toLowerCase().includes(keyword)))
})

function deleteResult(result: HealthExamResultRow) {
  dialog.warning({
    title: '删除体检结果',
    content: result.appointment_id ? '删除后，关联预约将恢复为待体检，可重新录入结果。' : '确认删除此体检结果吗？',
    positiveText: '确认删除',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await healthStore.deleteExamResult(result.id)
        if (selectedResult.value?.id === result.id) showResultDetail.value = false
        message.success('体检结果已删除')
        await refreshExamData()
      } catch (error) {
        message.error(errorMessage(error, '删除体检结果失败'))
      }
    },
  })
}

const resultColumns = [
  { title: '老人', key: 'elderly_id', width: 100, render: (r: HealthExamResultRow) => elderlyName(r.elderly_id) },
  { title: '体检日期', key: 'exam_date', width: 170, render: (r: HealthExamResultRow) => formatDateTime(r.exam_date) },
  { title: '机构', key: 'institution', width: 150, render: (r: HealthExamResultRow) => r.institution ?? '—' },
  {
    title: '检查结果', key: 'items',
    render: (r: HealthExamResultRow) => {
      const items = parseItems(r.items)
      if (!items.length) return '—'
      return h(NSpace, null, { default: () => items.map(it =>
        h(NTag, { size: 'small', type: it.abnormal ? 'error' : 'default' }, () => `${it.name}: ${it.value}${it.unit}`)
      )})
    },
  },
  { title: '结论', key: 'conclusion', render: (r: HealthExamResultRow) => r.conclusion ?? '—' },
  {
    title: '操作', key: 'actions', width: 190,
    render: (r: HealthExamResultRow) => h(NSpace, null, { default: () => [
      h(NButton, { size: 'small', onClick: () => openResultDetail(r) }, '查看'),
      h(NButton, { size: 'small', onClick: () => openResultEdit(r) }, '编辑'),
      h(NButton, { size: 'small', type: 'error', onClick: () => deleteResult(r) }, '删除'),
    ]}),
  },
]
</script>

<template>
  <BasePage title="体检管理">
    <NCard class="mb-4">
      <NSpace>
        <NSelect
          v-model:value="selectedElderlyId"
          :options="elderlyOptions"
          filterable
          clearable
          placeholder="筛选老人"
          style="width: 200px"
          @update:value="onElderlyChange"
        />
        <NSelect
          v-model:value="appointmentStatusFilter"
          :options="appointmentStatusOptions"
          clearable
          placeholder="预约状态"
          style="width: 130px"
        />
        <NButton v-perm="'exam:create'" type="primary" @click="openApptCreate">+ 预约体检</NButton>
        <NButton v-perm="'exam:create'" @click="openResultCreate">+ 录入体检结果</NButton>
        <NButton :loading="refreshing" size="small" @click="refresh">刷新</NButton>
      </NSpace>
    </NCard>

    <NTabs v-model:value="activeTab" type="line" animated>
      <NTabPane name="appointment" tab="体检预约">
        <NCard>
          <BaseTable :columns="apptColumns" :data="filteredAppointments" :loading="healthStore.loading" :pagination="{ pageSize: 15 }" />
        </NCard>
      </NTabPane>
      <NTabPane name="result" tab="体检结果">
        <NCard>
          <template #header-extra>
            <NInput v-model:value="resultKeyword" clearable placeholder="搜索老人、机构、结论或项目" style="width: 260px" />
          </template>
          <BaseTable :columns="resultColumns" :data="filteredResults" :loading="healthStore.loading" :pagination="{ pageSize: 15 }" />
        </NCard>
      </NTabPane>
    </NTabs>

    <!-- 预约弹窗 -->
    <NModal v-model:show="showApptModal" :title="editingAppointmentId ? '编辑体检预约' : '预约体检'" preset="card" style="width:480px">
      <NForm :model="apptForm" label-placement="left" label-width="90" :show-require-mark="true">
        <NFormItem label="老人" required><NSelect v-model:value="apptForm.elderly_id" :options="elderlyOptions" filterable /></NFormItem>
        <NFormItem label="预约时间" required>
          <NDatePicker v-model:formatted-value="apptForm.exam_date" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" style="width: 100%" />
        </NFormItem>
        <NFormItem label="体检机构"><NInput v-model:value="apptForm.institution" placeholder="如：市人民医院体检中心" /></NFormItem>
        <NFormItem label="体检项目"><NInput v-model:value="apptForm.exam_items" type="textarea" :rows="2" placeholder="如：血常规、心电图、腹部B超" /></NFormItem>
        <NFormItem label="备注"><NInput v-model:value="apptForm.remark" /></NFormItem>
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showApptModal = false">取消</NButton>
          <NButton type="primary" :loading="saving" @click="saveAppointment">保存</NButton>
        </NSpace>
      </template>
    </NModal>

    <!-- 结果弹窗 -->
    <NModal v-model:show="showResultModal" :title="editingResultId ? '编辑体检结果' : '录入体检结果'" preset="card" style="width:560px">
      <NForm :model="resultForm" label-placement="left" label-width="90" :show-require-mark="true">
        <NFormItem label="老人" required><NSelect v-model:value="resultForm.elderly_id" :options="elderlyOptions" filterable :disabled="!!resultForm.appointment_id || !!editingResultId" /></NFormItem>
        <NFormItem label="体检日期" required>
          <NDatePicker v-model:formatted-value="resultForm.exam_date" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" style="width: 100%" />
        </NFormItem>
        <NFormItem label="体检机构"><NInput v-model:value="resultForm.institution" /></NFormItem>

        <NFormItem label="检查项">
          <NSpace vertical style="width:100%">
            <NSpace :wrap="false">
               <NInput v-model:value="itemInput.name" placeholder="项目名，如：血压" style="width:120px" />
               <NInput v-model:value="itemInput.value" placeholder="数值，如：130/85" style="width:110px" />
               <NInput v-model:value="itemInput.unit" placeholder="单位，如：mmHg" style="width:90px" />
               <NCheckbox v-model:checked="itemInput.abnormal">异常</NCheckbox>
               <NButton @click="addItem">添加</NButton>
            </NSpace>
            <div class="flex flex-wrap gap-2">
              <NTag v-for="(it, idx) in itemList" :key="idx" :type="it.abnormal ? 'error' : 'default'" closable @close="removeItem(idx)">
                {{ it.name }}: {{ it.value }}{{ it.unit }}
              </NTag>
              <span v-if="!itemList.length" class="text-gray-400 text-sm">暂无检查项，请添加</span>
            </div>
          </NSpace>
        </NFormItem>

        <NFormItem label="体检结论"><NInput v-model:value="resultForm.conclusion" type="textarea" :rows="3" /></NFormItem>
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showResultModal = false">取消</NButton>
          <NButton type="primary" :loading="saving" @click="saveResult">保存</NButton>
        </NSpace>
      </template>
    </NModal>

    <!-- 结果详情 -->
    <NModal v-model:show="showResultDetail" :title="`${selectedResult ? elderlyName(selectedResult.elderly_id) : ''}的体检结果`" preset="card" style="width:560px">
      <NForm v-if="selectedResult" label-placement="left" label-width="90">
        <NFormItem label="体检日期">{{ formatDateTime(selectedResult.exam_date) }}</NFormItem>
        <NFormItem label="体检机构">{{ selectedResult.institution || '—' }}</NFormItem>
        <NFormItem label="关联预约">{{ selectedResult.appointment_id ? '已关联预约' : '独立录入' }}</NFormItem>
        <NFormItem label="检查项目">
          <NSpace v-if="parseItems(selectedResult.items).length" wrap>
            <NTag v-for="(item, index) in parseItems(selectedResult.items)" :key="index" :type="item.abnormal ? 'error' : 'default'">
              {{ item.name }}: {{ item.value }}{{ item.unit }}{{ item.abnormal ? '（异常）' : '' }}
            </NTag>
          </NSpace>
          <span v-else>—</span>
        </NFormItem>
        <NFormItem label="体检结论"><span style="white-space: pre-wrap">{{ selectedResult.conclusion || '—' }}</span></NFormItem>
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showResultDetail = false">关闭</NButton>
          <NButton v-if="selectedResult" @click="showResultDetail = false; openResultEdit(selectedResult)">编辑</NButton>
        </NSpace>
      </template>
    </NModal>
  </BasePage>
</template>
