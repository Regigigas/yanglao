<script setup lang="ts">
defineOptions({ name: 'Care' })
import {
  NCard, NButton, NSpace, NTag, NModal, NForm, NFormItem,
  NInput, NInputNumber, NSelect, NDatePicker, NTabs, NTabPane,
  NProgress, useMessage, useDialog, NAlert
} from 'naive-ui'
import { BasePage, BaseTable } from '@yanglao/ui'
import { useCareStore } from '../../stores/care.store'
import { useElderlyStore } from '../../stores/elderly.store'
import { ref, h, computed } from 'vue'
import { formatDateTime } from '@yanglao/core'
import { usePageRefresh } from '../../composables/usePageRefresh'
import type { CareAssessmentRow, CareRecordRow, CarePlanRow } from '@yanglao/db'

const careStore = useCareStore()
const elderlyStore = useElderlyStore()
const message = useMessage()
const dialog = useDialog()

const selectedElderlyId = ref<string | null>(null)

async function loadData() {
  await elderlyStore.fetchList()
}
const { refresh, refreshing } = usePageRefresh(loadData)

const elderlyOptions = computed(() =>
  elderlyStore.list.filter(e => e.status === 'active').map(e => ({ label: e.name, value: e.id }))
)

async function onElderlyChange(id: string) {
  selectedElderlyId.value = id
  await Promise.all([
    careStore.fetchAssessments(id),
    careStore.fetchPlans(id),
    careStore.fetchRecords(id),
  ])
}

// ── ADL评估 ─────────────────────────────────────
const showAssessModal = ref(false)
const assessForm = ref({
  elderly_id: '',
  assess_date: formatDateTime(Date.now()),
  assessor: '',
  eating: 10, bathing: 5, grooming: 5, dressing: 10,
  bowel: 10, bladder: 10, toilet: 10, transfer: 15,
  mobility: 15, stairs: 10,
  remark: '',
})

const adlItems = [
  { key: 'eating',   label: '进食',   max: 10 },
  { key: 'bathing',  label: '洗澡',   max: 5 },
  { key: 'grooming', label: '修饰',   max: 5 },
  { key: 'dressing', label: '穿衣',   max: 10 },
  { key: 'bowel',    label: '大便控制', max: 10 },
  { key: 'bladder',  label: '小便控制', max: 10 },
  { key: 'toilet',   label: '如厕',   max: 10 },
  { key: 'transfer', label: '床椅转移', max: 15 },
  { key: 'mobility', label: '平地行走', max: 15 },
  { key: 'stairs',   label: '上下楼梯', max: 10 },
]

const totalScore = computed(() =>
  adlItems.reduce((sum, item) => sum + (assessForm.value as unknown as Record<string, number>)[item.key], 0)
)

const careLevel = computed(() => {
  const s = totalScore.value
  if (s >= 95) return { level: 'level1', label: '自理（一级）', type: 'success' }
  if (s >= 60) return { level: 'level2', label: '半自理（二级）', type: 'info' }
  if (s >= 40) return { level: 'level3', label: '不能自理（三级）', type: 'warning' }
  return { level: 'level4', label: '完全不能自理（四级）', type: 'error' }
})

async function saveAssessment() {
  if (!assessForm.value.elderly_id) return message.error('请选择老人')
  await careStore.createAssessment({
    ...assessForm.value,
    total_score: totalScore.value,
    care_level: careLevel.value.level,
    deleted_at: null,
  })
  showAssessModal.value = false
  message.success('评估完成，护理级别：' + careLevel.value.label)
  if (selectedElderlyId.value) await careStore.fetchAssessments(selectedElderlyId.value)
}

// ── 护理记录 ─────────────────────────────────────
const showRecordModal = ref(false)
const recordForm = ref({
  elderly_id: '',
  plan_id: null as string | null,
  record_date: formatDateTime(Date.now()),
  shift: 'day',
  care_type: '',
  content: '',
  executor: '',
  status: 'done',
  remark: '',
})

const careTypeOptions = [
  { label: '晨间护理', value: '晨间护理' },
  { label: '口腔护理', value: '口腔护理' },
  { label: '皮肤护理', value: '皮肤护理' },
  { label: '翻身拍背', value: '翻身拍背' },
  { label: '协助进餐', value: '协助进餐' },
  { label: '协助排泄', value: '协助排泄' },
  { label: '协助洗浴', value: '协助洗浴' },
  { label: '生命体征监测', value: '生命体征监测' },
  { label: '康复训练', value: '康复训练' },
  { label: '心理疏导', value: '心理疏导' },
  { label: '其他', value: '其他' },
]

const shiftOptions = [
  { label: '白班 (7:00-15:00)', value: 'day' },
  { label: '中班 (15:00-23:00)', value: 'evening' },
  { label: '夜班 (23:00-7:00)', value: 'night' },
]

async function saveRecord() {
  if (!recordForm.value.elderly_id || !recordForm.value.care_type || !recordForm.value.content) {
    return message.error('请填写必填项')
  }
  await careStore.createRecord({ ...recordForm.value, deleted_at: null })
  showRecordModal.value = false
  message.success('护理记录已保存')
  if (selectedElderlyId.value) await careStore.fetchRecords(selectedElderlyId.value)
}

// ── 护理计划 ─────────────────────────────────────
const planCareLevelOptions = [
  { label: '自理（一级）', value: 'level1' },
  { label: '半自理（二级）', value: 'level2' },
  { label: '不能自理（三级）', value: 'level3' },
  { label: '完全不能自理（四级）', value: 'level4' },
]
const showPlanModal = ref(false)
const planForm = ref({
  elderly_id: '',
  care_level: 'level2',
  start_date: formatDateTime(Date.now()),
  end_date: null as string | null,
  content: '',
})

// 该老人当前生效的护理计划（用于护理记录关联 plan_id）
const activePlan = computed(() => careStore.plans.find(p => p.status === 'active'))

async function savePlan() {
  if (!planForm.value.elderly_id) return message.error('请选择老人')
  await careStore.createPlan({
    ...planForm.value,
    content: planForm.value.content || null,
    created_by: null,
    status: 'active',
    deleted_at: null,
  })
  showPlanModal.value = false
  message.success('护理计划已创建')
  if (selectedElderlyId.value) await careStore.fetchPlans(selectedElderlyId.value)
}

async function endPlan(plan: CarePlanRow) {
  await careStore.updatePlan(plan.id, { status: 'ended', end_date: formatDateTime(Date.now()) })
  message.success('护理计划已结束')
  if (selectedElderlyId.value) await careStore.fetchPlans(selectedElderlyId.value)
}

const planColumns = [
  { title: '护理级别', key: 'care_level', width: 130, render: (r: CarePlanRow) => {
    const map: Record<string, string> = { level1: '自理（一级）', level2: '半自理（二级）', level3: '不能自理（三级）', level4: '完全不能自理（四级）' }
    return map[r.care_level] ?? r.care_level
  }},
  { title: '开始日期', key: 'start_date', width: 160, render: (r: CarePlanRow) => formatDateTime(r.start_date) },
  { title: '结束日期', key: 'end_date', width: 160, render: (r: CarePlanRow) => r.end_date ? formatDateTime(r.end_date) : '进行中' },
  { title: '计划内容', key: 'content', ellipsis: { tooltip: true }, render: (r: CarePlanRow) => r.content ?? '—' },
  { title: '状态', key: 'status', width: 90, render: (r: CarePlanRow) => h(NTag, { type: r.status === 'active' ? 'success' : 'default' }, () => r.status === 'active' ? '进行中' : '已结束') },
  { title: '操作', key: 'actions', width: 90, render: (r: CarePlanRow) => r.status === 'active'
    ? h(NButton, { size: 'small', onClick: () => endPlan(r) }, '结束')
    : null },
]

// ── 表格列 ─────────────────────────────────────
const assessColumns = [
  { title: '评估日期', key: 'assess_date', width: 160, render: (r: CareAssessmentRow) => formatDateTime(r.assess_date) },
  { title: '评估人', key: 'assessor', width: 100 },
  { title: 'ADL总分', key: 'total_score', width: 90 },
  { title: '护理级别', key: 'care_level', width: 160, render: (r: CareAssessmentRow) => {
    const map: Record<string, string> = { level1: '自理（一级）', level2: '半自理（二级）', level3: '不能自理（三级）', level4: '完全不能自理（四级）' }
    const typeMap: Record<string, 'success' | 'info' | 'warning' | 'error'> = { level1: 'success', level2: 'info', level3: 'warning', level4: 'error' }
    return h(NTag, { type: typeMap[r.care_level] ?? 'default' }, () => map[r.care_level] ?? r.care_level)
  }},
  { title: '操作', key: 'actions', width: 80, render: (r: CareAssessmentRow) => h(NButton, { size: 'small', type: 'error', onClick: () => {
    dialog.warning({ title: '删除', content: '确认删除此评估记录？', positiveText: '确定', negativeText: '取消',
      onPositiveClick: async () => { await careStore.deleteAssessment(r.id); message.success('已删除'); if (selectedElderlyId.value) await careStore.fetchAssessments(selectedElderlyId.value) }
    })
  }}, '删除') }
]

const recordColumns = [
  { title: '日期', key: 'record_date', width: 160, render: (r: CareRecordRow) => formatDateTime(r.record_date) },
  { title: '班次', key: 'shift', width: 90, render: (r: CareRecordRow) => ({ day: '白班', evening: '中班', night: '夜班' }[r.shift]) },
  { title: '护理类型', key: 'care_type', width: 110 },
  { title: '内容', key: 'content', ellipsis: { tooltip: true } },
  { title: '执行人', key: 'executor', width: 90 },
  { title: '状态', key: 'status', width: 80, render: (r: CareRecordRow) => h(NTag, { type: r.status === 'done' ? 'success' : 'warning' }, () => r.status === 'done' ? '已完成' : '跳过') },
]
</script>

<template>
  <BasePage title="护理管理">
    <NCard class="mb-4">
      <NSpace>
        <NSelect
          v-model:value="selectedElderlyId"
          :options="elderlyOptions"
          filterable
          placeholder="请选择老人"
          style="width: 200px"
          @update:value="onElderlyChange"
        />
        <NButton type="primary" :disabled="!selectedElderlyId" @click="() => { assessForm.elderly_id = selectedElderlyId!; showAssessModal = true }">
          + 护理评估（ADL）
        </NButton>
        <NButton :disabled="!selectedElderlyId" @click="() => { recordForm.elderly_id = selectedElderlyId!; recordForm.plan_id = activePlan?.id ?? null; showRecordModal = true }">
          + 护理记录
        </NButton>
        <NButton :disabled="!selectedElderlyId" @click="() => { planForm.elderly_id = selectedElderlyId!; showPlanModal = true }">
          + 护理计划
        </NButton>
        <NButton :loading="refreshing" size="small" @click="refresh">刷新</NButton>
      </NSpace>
    </NCard>

    <NTabs v-if="selectedElderlyId" type="line" animated>
      <NTabPane name="assessment" tab="护理评估">
        <NCard>
          <BaseTable :columns="assessColumns" :data="careStore.assessments" :loading="careStore.loading" :pagination="{ pageSize: 10 }" />
        </NCard>
      </NTabPane>
      <NTabPane name="plan" tab="护理计划">
        <NCard>
          <BaseTable :columns="planColumns" :data="careStore.plans" :loading="careStore.loading" :pagination="{ pageSize: 10 }" />
        </NCard>
      </NTabPane>
      <NTabPane name="records" tab="护理记录">
        <NCard>
          <BaseTable :columns="recordColumns" :data="careStore.records" :loading="careStore.loading" :pagination="{ pageSize: 15 }" />
        </NCard>
      </NTabPane>
    </NTabs>
    <NAlert v-else type="info">请先选择老人，查看其护理信息。</NAlert>

    <!-- 评估弹窗 -->
    <NModal v-model:show="showAssessModal" title="ADL护理评估（Barthel量表）" preset="card" style="width:600px">
      <NForm :model="assessForm" label-placement="left" label-width="100">
        <NFormItem label="评估日期">
          <NDatePicker v-model:formatted-value="assessForm.assess_date" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" style="width: 100%" />
        </NFormItem>
        <NFormItem label="评估人"><NInput v-model:value="assessForm.assessor" placeholder="护士/护理员姓名" /></NFormItem>
        <NFormItem v-for="item in adlItems" :key="item.key" :label="item.label">
          <NSpace align="center" style="width:100%">
            <NInputNumber v-model:value="(assessForm as unknown as Record<string, number>)[item.key]" :min="0" :max="item.max" style="width:100px" />
            <span class="text-gray-400">/ {{ item.max }}分</span>
            <NProgress type="line" :percentage="Math.round((assessForm as unknown as Record<string, number>)[item.key] / item.max * 100)" style="width:120px" :show-indicator="false" />
          </NSpace>
        </NFormItem>
        <NFormItem label="总分">
          <NSpace align="center">
            <span class="text-xl font-bold">{{ totalScore }}</span>
            <NTag :type="careLevel.type as 'success'|'info'|'warning'|'error'">{{ careLevel.label }}</NTag>
          </NSpace>
        </NFormItem>
        <NFormItem label="备注"><NInput v-model:value="assessForm.remark" type="textarea" :rows="2" /></NFormItem>
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showAssessModal = false">取消</NButton>
          <NButton type="primary" @click="saveAssessment">提交评估</NButton>
        </NSpace>
      </template>
    </NModal>

    <!-- 护理计划弹窗 -->
    <NModal v-model:show="showPlanModal" title="新增护理计划" preset="card" style="width:520px">
      <NForm :model="planForm" label-placement="left" label-width="90">
        <NFormItem label="护理级别"><NSelect v-model:value="planForm.care_level" :options="planCareLevelOptions" /></NFormItem>
        <NFormItem label="开始日期" required>
          <NDatePicker v-model:formatted-value="planForm.start_date" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" style="width: 100%" />
        </NFormItem>
        <NFormItem label="结束日期">
          <NDatePicker v-model:formatted-value="planForm.end_date" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" clearable placeholder="留空表示长期" style="width: 100%" />
        </NFormItem>
        <NFormItem label="计划内容"><NInput v-model:value="planForm.content" type="textarea" :rows="3" placeholder="护理目标与具体措施" /></NFormItem>
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showPlanModal = false">取消</NButton>
          <NButton type="primary" @click="savePlan">创建</NButton>
        </NSpace>
      </template>
    </NModal>

    <!-- 护理记录弹窗 -->
    <NModal v-model:show="showRecordModal" title="护理记录" preset="card" style="width:520px">
      <NForm :model="recordForm" label-placement="left" label-width="90">
        <NFormItem label="记录日期">
          <NDatePicker v-model:formatted-value="recordForm.record_date" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" style="width: 100%" />
        </NFormItem>
        <NFormItem label="班次"><NSelect v-model:value="recordForm.shift" :options="shiftOptions" /></NFormItem>
        <NFormItem label="关联计划">
          <NSelect
            v-model:value="recordForm.plan_id"
            :options="careStore.plans.filter(p => p.status === 'active').map(p => ({ label: `${p.start_date} 起 · ${p.care_level}`, value: p.id }))"
            clearable
            placeholder="可选，选择当前生效的护理计划"
          />
        </NFormItem>
        <NFormItem label="护理类型" required><NSelect v-model:value="recordForm.care_type" :options="careTypeOptions" /></NFormItem>
        <NFormItem label="执行内容" required><NInput v-model:value="recordForm.content" type="textarea" :rows="3" placeholder="详细描述护理执行情况" /></NFormItem>
        <NFormItem label="执行人"><NInput v-model:value="recordForm.executor" /></NFormItem>
        <NFormItem label="备注"><NInput v-model:value="recordForm.remark" /></NFormItem>
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showRecordModal = false">取消</NButton>
          <NButton type="primary" @click="saveRecord">保存</NButton>
        </NSpace>
      </template>
    </NModal>
  </BasePage>
</template>
