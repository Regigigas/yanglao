<script setup lang="ts">
defineOptions({ name: 'Health' })
import {
  NCard, NButton, NSpace, NTag, NModal, NForm, NFormItem,
  NInput, NInputNumber, NSelect, NDatePicker, NTabs, NTabPane, useMessage, useDialog, NAlert
} from 'naive-ui'
import { BasePage, BaseTable, BaseChart } from '@yanglao/ui'
import { useHealthStore } from '../../stores/health.store'
import { useElderlyStore } from '../../stores/elderly.store'
import { ref, h, computed } from 'vue'
import { formatDateTime } from '@yanglao/core'
import { usePageRefresh } from '../../composables/usePageRefresh'
import type { VitalSignsRow, MedicationOrderRow, MedicalVisitRow, MedicationRecordRow } from '@yanglao/db'
import type { EChartsOption } from 'echarts'

const healthStore = useHealthStore()
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
  await healthStore.fetchAll(id)
  Object.assign(profileForm.value, {
    elderly_id: id,
    blood_type: healthStore.profile?.blood_type ?? '',
    allergy: healthStore.profile?.allergy ?? '',
    chronic_disease: healthStore.profile?.chronic_disease ?? '',
    surgery_history: healthStore.profile?.surgery_history ?? '',
    family_history: healthStore.profile?.family_history ?? '',
    disability: healthStore.profile?.disability ?? '',
    diet_require: healthStore.profile?.diet_require ?? '',
    remark: healthStore.profile?.remark ?? '',
  })
}

// ── 健康档案 ─────────────────────────────────────
const profileForm = ref({
  elderly_id: '',
  blood_type: '',
  allergy: '',
  chronic_disease: '',
  surgery_history: '',
  family_history: '',
  disability: '',
  diet_require: '',
  remark: '',
})

async function saveProfile() {
  if (!profileForm.value.elderly_id) return message.error('请选择老人')
  await healthStore.saveProfile(profileForm.value.elderly_id, {
    blood_type: profileForm.value.blood_type || null,
    allergy: profileForm.value.allergy || null,
    chronic_disease: profileForm.value.chronic_disease || null,
    surgery_history: profileForm.value.surgery_history || null,
    family_history: profileForm.value.family_history || null,
    disability: profileForm.value.disability || null,
    diet_require: profileForm.value.diet_require || null,
    remark: profileForm.value.remark || null,
  })
  message.success('健康档案已保存')
}

// ── 生命体征 ─────────────────────────────────────
const showVitalModal = ref(false)
const vitalForm = ref({
  elderly_id: '',
  record_date: formatDateTime(Date.now()),
  record_time: new Date().toTimeString().slice(0, 5),
  temperature: null as number | null,
  pulse: null as number | null,
  respiration: null as number | null,
  systolic_bp: null as number | null,
  diastolic_bp: null as number | null,
  blood_sugar: null as number | null,
  weight: null as number | null,
  spo2: null as number | null,
  recorder: '',
  remark: '',
})

async function saveVital() {
  if (!vitalForm.value.elderly_id) return message.error('请选择老人')
  await healthStore.createVital({ ...vitalForm.value, deleted_at: null })
  showVitalModal.value = false
  message.success('体征记录已保存')
  if (selectedElderlyId.value) await healthStore.fetchAll(selectedElderlyId.value)
}

// ── 血压趋势图 ─────────────────────────────────────
const bpChartOption = computed<EChartsOption>(() => {
  const data = healthStore.vitals.slice(0, 20).reverse()
  return {
    tooltip: { trigger: 'axis', confine: true },
    legend: { top: 0, data: ['收缩压', '舒张压'] },
    grid: { top: 40, right: 16, bottom: 8, left: 8, containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.map(v => v.record_date.slice(5, 16)),
      axisLabel: { hideOverlap: true },
    },
    yAxis: { type: 'value', name: 'mmHg' },
    series: [
      { name: '收缩压', type: 'line', data: data.map(v => v.systolic_bp), smooth: true, itemStyle: { color: '#f56c6c' } },
      { name: '舒张压', type: 'line', data: data.map(v => v.diastolic_bp), smooth: true, itemStyle: { color: '#409eff' } },
    ],
  }
})

const vitalColumns = [
  { title: '日期', key: 'record_date', width: 160, render: (r: VitalSignsRow) => formatDateTime(r.record_date) },
  { title: '时间', key: 'record_time', width: 70 },
  { title: '体温(℃)', key: 'temperature', width: 90 },
  { title: '脉搏', key: 'pulse', width: 70 },
  { title: '收缩压', key: 'systolic_bp', width: 80 },
  { title: '舒张压', key: 'diastolic_bp', width: 80 },
  { title: '血糖', key: 'blood_sugar', width: 80 },
  { title: '体重(kg)', key: 'weight', width: 90 },
  { title: '血氧(%)', key: 'spo2', width: 80 },
  { title: '记录人', key: 'recorder', width: 90 },
  { title: '操作', key: 'actions', width: 80, render: (r: VitalSignsRow) => h(NButton, { size: 'small', type: 'error', onClick: () => { dialog.warning({ title: '删除', content: '确认删除？', positiveText: '确定', negativeText: '取消', onPositiveClick: async () => { await healthStore.deleteVital(r.id); message.success('已删除'); if (selectedElderlyId.value) await healthStore.fetchAll(selectedElderlyId.value) } }) } }, '删除') },
]

// ── 用药医嘱 ─────────────────────────────────────
const showMedOrderModal = ref(false)
const medOrderForm = ref({
  elderly_id: '', drug_name: '', drug_spec: '', dosage: '',
  frequency: '', route: 'oral', start_date: formatDateTime(Date.now()),
  end_date: null as string | null, prescriber: '', status: 'active', remark: '',
})

const routeOptions = [
  { label: '口服', value: 'oral' }, { label: '肌肉注射', value: 'im' },
  { label: '静脉注射', value: 'iv' }, { label: '外用', value: 'external' },
  { label: '吸入', value: 'inhalation' }, { label: '其他', value: 'other' },
]

async function saveMedOrder() {
  if (!medOrderForm.value.drug_name || !medOrderForm.value.dosage || !medOrderForm.value.frequency) {
    return message.error('请填写药品名称、剂量和频次')
  }
  await healthStore.createMedOrder({ ...medOrderForm.value, deleted_at: null, prescriber: medOrderForm.value.prescriber || null })
  showMedOrderModal.value = false
  message.success('医嘱已添加')
  if (selectedElderlyId.value) await healthStore.fetchAll(selectedElderlyId.value)
}

const medOrderColumns = [
  { title: '药品名称', key: 'drug_name', width: 120 },
  { title: '规格', key: 'drug_spec', width: 90 },
  { title: '剂量', key: 'dosage', width: 80 },
  { title: '频次', key: 'frequency', width: 90 },
  { title: '给药方式', key: 'route', width: 90, render: (r: MedicationOrderRow) => ({ oral: '口服', im: '肌注', iv: '静注', external: '外用', inhalation: '吸入', other: '其他' }[r.route] ?? r.route) },
  { title: '开始日期', key: 'start_date', width: 160, render: (r: MedicationOrderRow) => formatDateTime(r.start_date) },
  { title: '结束日期', key: 'end_date', width: 160, render: (r: MedicationOrderRow) => r.end_date ? formatDateTime(r.end_date) : '长期' },
  { title: '状态', key: 'status', width: 80, render: (r: MedicationOrderRow) => h(NTag, { type: r.status === 'active' ? 'success' : 'default' }, () => r.status === 'active' ? '执行中' : '已停用') },
  {
    title: '操作', key: 'actions', width: 160,
    render: (r: MedicationOrderRow) => h(NSpace, null, { default: () => [
      h(NButton, { size: 'small', type: 'primary', disabled: r.status !== 'active', onClick: () => openMedRecordModal(r) }, '执行记录'),
      h(NButton, { size: 'small', disabled: r.status !== 'active', onClick: async () => { await healthStore.stopMedOrder(r.id); message.success('医嘱已停用'); if (selectedElderlyId.value) await healthStore.fetchAll(selectedElderlyId.value) } }, '停用'),
    ]}),
  },
]

// ── 用药执行记录 ─────────────────────────────────────
const showMedRecordModal = ref(false)
const medRecordForm = ref({
  elderly_id: '',
  order_id: '',
  take_date: formatDateTime(Date.now()),
  take_time: new Date().toTimeString().slice(0, 5),
  shift: 'morning' as 'morning' | 'noon' | 'evening' | 'bedtime',
  status: 'taken' as 'taken' | 'refused' | 'missed',
  executor: '',
  remark: '',
})

const shiftOptions = [
  { label: '早晨', value: 'morning' },
  { label: '中午', value: 'noon' },
  { label: '晚上', value: 'evening' },
  { label: '睡前', value: 'bedtime' },
]
const medRecordStatusOptions = [
  { label: '已服用', value: 'taken' },
  { label: '拒绝服用', value: 'refused' },
  { label: '漏服', value: 'missed' },
]

function openMedRecordModal(order: MedicationOrderRow) {
  medRecordForm.value = {
    elderly_id: order.elderly_id,
    order_id: order.id,
    take_date: formatDateTime(Date.now()),
    take_time: new Date().toTimeString().slice(0, 5),
    shift: 'morning',
    status: 'taken',
    executor: '',
    remark: '',
  }
  showMedRecordModal.value = true
}

async function saveMedRecord() {
  await healthStore.createMedRecord({ ...medRecordForm.value, deleted_at: null })
  showMedRecordModal.value = false
  message.success('用药执行记录已保存')
  if (selectedElderlyId.value) await healthStore.fetchAll(selectedElderlyId.value)
}

const medRecordColumns = [
  { title: '日期', key: 'take_date', width: 160, render: (r: MedicationRecordRow) => formatDateTime(r.take_date) },
  { title: '时间', key: 'take_time', width: 80 },
  { title: '药品', key: 'order_id', width: 130, render: (r: MedicationRecordRow) => healthStore.medOrders.find(o => o.id === r.order_id)?.drug_name ?? r.order_id },
  { title: '班次', key: 'shift', width: 80, render: (r: MedicationRecordRow) => ({ morning: '早晨', noon: '中午', evening: '晚上', bedtime: '睡前' }[r.shift] ?? r.shift) },
  { title: '状态', key: 'status', width: 90, render: (r: MedicationRecordRow) => h(NTag, { type: r.status === 'taken' ? 'success' : r.status === 'refused' ? 'warning' : 'error' }, () => ({ taken: '已服用', refused: '拒绝服用', missed: '漏服' }[r.status] ?? r.status)) },
  { title: '执行人', key: 'executor', width: 90 },
]

// ── 就医记录 ─────────────────────────────────────
const showVisitModal = ref(false)
const visitForm = ref({
  elderly_id: '', visit_date: formatDateTime(Date.now()),
  hospital: '', department: '', doctor: '', diagnosis: '',
  treatment: '', cost: null as number | null, escort: '', remark: '',
})

async function saveVisit() {
  if (!visitForm.value.elderly_id || !visitForm.value.visit_date) return message.error('请填写必填项')
  await healthStore.createVisit({ ...visitForm.value, deleted_at: null })
  showVisitModal.value = false
  message.success('就医记录已保存')
  if (selectedElderlyId.value) await healthStore.fetchAll(selectedElderlyId.value)
}

const visitColumns = [
  { title: '就医日期', key: 'visit_date', width: 160, render: (r: MedicalVisitRow) => formatDateTime(r.visit_date) },
  { title: '医院', key: 'hospital', width: 150 },
  { title: '科室', key: 'department', width: 100 },
  { title: '诊断', key: 'diagnosis', ellipsis: { tooltip: true } },
  { title: '费用', key: 'cost', width: 90, render: (r: MedicalVisitRow) => r.cost != null ? `¥${r.cost}` : '—' },
  { title: '陪同人', key: 'escort', width: 90 },
  { title: '操作', key: 'actions', width: 80, render: (r: MedicalVisitRow) => h(NButton, { size: 'small', type: 'error', onClick: () => { dialog.warning({ title: '删除', content: '确认删除？', positiveText: '确定', negativeText: '取消', onPositiveClick: async () => { await healthStore.deleteVisit(r.id); message.success('已删除'); if (selectedElderlyId.value) await healthStore.fetchAll(selectedElderlyId.value) } }) } }, '删除') },
]
</script>

<template>
  <BasePage title="健康管理">
    <NCard class="mb-4">
      <NSpace>
        <NSelect v-model:value="selectedElderlyId" :options="elderlyOptions" filterable placeholder="请选择老人" style="width:200px" @update:value="onElderlyChange" />
        <template v-if="selectedElderlyId">
          <NButton type="primary" @click="() => { vitalForm.elderly_id = selectedElderlyId!; showVitalModal = true }">+ 体征记录</NButton>
          <NButton @click="() => { medOrderForm.elderly_id = selectedElderlyId!; showMedOrderModal = true }">+ 用药医嘱</NButton>
          <NButton @click="() => { visitForm.elderly_id = selectedElderlyId!; showVisitModal = true }">+ 就医记录</NButton>
        </template>
        <NButton :loading="refreshing" size="small" @click="refresh">刷新</NButton>
      </NSpace>
    </NCard>

    <NTabs v-if="selectedElderlyId" type="line" animated>
      <NTabPane name="vital" tab="生命体征">
        <NCard class="mb-3" title="血压趋势">
          <BaseChart :option="bpChartOption" height="200px" />
        </NCard>
        <NCard title="体征记录">
          <BaseTable :columns="vitalColumns" :data="healthStore.vitals" :loading="healthStore.loading" :pagination="{ pageSize: 15 }" />
        </NCard>
      </NTabPane>

      <NTabPane name="medication" tab="用药管理">
        <NCard class="mb-3" title="用药医嘱">
          <BaseTable :columns="medOrderColumns" :data="healthStore.medOrders" :loading="healthStore.loading" :pagination="{ pageSize: 15 }" />
        </NCard>
        <NCard title="用药执行记录">
          <BaseTable :columns="medRecordColumns" :data="healthStore.medRecords" :loading="healthStore.loading" :pagination="{ pageSize: 15 }" />
        </NCard>
      </NTabPane>

      <NTabPane name="visit" tab="就医记录">
        <NCard>
          <BaseTable :columns="visitColumns" :data="healthStore.visits" :loading="healthStore.loading" :pagination="{ pageSize: 15 }" />
        </NCard>
      </NTabPane>

      <NTabPane name="profile" tab="健康档案">
        <NCard>
          <NForm :model="profileForm" label-placement="left" label-width="100">
            <NFormItem label="血型"><NInput v-model:value="profileForm.blood_type" placeholder="如：A型" /></NFormItem>
            <NFormItem label="过敏史"><NInput v-model:value="profileForm.allergy" type="textarea" :rows="2" /></NFormItem>
            <NFormItem label="慢性病史"><NInput v-model:value="profileForm.chronic_disease" type="textarea" :rows="2" /></NFormItem>
            <NFormItem label="手术史"><NInput v-model:value="profileForm.surgery_history" type="textarea" :rows="2" /></NFormItem>
            <NFormItem label="家族病史"><NInput v-model:value="profileForm.family_history" type="textarea" :rows="2" /></NFormItem>
            <NFormItem label="残疾情况"><NInput v-model:value="profileForm.disability" /></NFormItem>
            <NFormItem label="饮食要求"><NInput v-model:value="profileForm.diet_require" type="textarea" :rows="2" /></NFormItem>
            <NFormItem label="备注"><NInput v-model:value="profileForm.remark" type="textarea" :rows="2" /></NFormItem>
            <NFormItem>
              <NButton type="primary" @click="saveProfile">保存档案</NButton>
            </NFormItem>
          </NForm>
        </NCard>
      </NTabPane>
    </NTabs>
    <NAlert v-else type="info">请先选择老人，查看其健康信息。</NAlert>

    <!-- 体征弹窗 -->
    <NModal v-model:show="showVitalModal" title="生命体征记录" preset="card" style="width:520px">
      <NForm :model="vitalForm" label-placement="left" label-width="90">
        <NFormItem label="记录日期">
          <NDatePicker v-model:formatted-value="vitalForm.record_date" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" style="width: 100%" />
        </NFormItem>
        <NFormItem label="记录时间"><NInput v-model:value="vitalForm.record_time" /></NFormItem>
        <NFormItem label="体温(℃)"><NInputNumber v-model:value="vitalForm.temperature" :precision="1" :min="35" :max="42" /></NFormItem>
        <NFormItem label="脉搏(次/分)"><NInputNumber v-model:value="vitalForm.pulse" :min="30" :max="200" /></NFormItem>
        <NFormItem label="收缩压"><NInputNumber v-model:value="vitalForm.systolic_bp" :min="60" :max="250" /></NFormItem>
        <NFormItem label="舒张压"><NInputNumber v-model:value="vitalForm.diastolic_bp" :min="40" :max="150" /></NFormItem>
        <NFormItem label="血糖(mmol/L)"><NInputNumber v-model:value="vitalForm.blood_sugar" :precision="1" :min="1" :max="30" /></NFormItem>
        <NFormItem label="体重(kg)"><NInputNumber v-model:value="vitalForm.weight" :precision="1" :min="20" :max="200" /></NFormItem>
        <NFormItem label="血氧饱和度(%)"><NInputNumber v-model:value="vitalForm.spo2" :min="70" :max="100" /></NFormItem>
        <NFormItem label="记录人"><NInput v-model:value="vitalForm.recorder" /></NFormItem>
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showVitalModal = false">取消</NButton>
          <NButton type="primary" @click="saveVital">保存</NButton>
        </NSpace>
      </template>
    </NModal>

    <!-- 用药医嘱弹窗 -->
    <NModal v-model:show="showMedOrderModal" title="新增用药医嘱" preset="card" style="width:520px">
      <NForm :model="medOrderForm" label-placement="left" label-width="90">
        <NFormItem label="药品名称" required><NInput v-model:value="medOrderForm.drug_name" /></NFormItem>
        <NFormItem label="规格"><NInput v-model:value="medOrderForm.drug_spec" placeholder="如：100mg/片" /></NFormItem>
        <NFormItem label="剂量" required><NInput v-model:value="medOrderForm.dosage" placeholder="如：1片" /></NFormItem>
        <NFormItem label="频次" required><NInput v-model:value="medOrderForm.frequency" placeholder="如：每日三次" /></NFormItem>
        <NFormItem label="给药途径"><NSelect v-model:value="medOrderForm.route" :options="routeOptions" /></NFormItem>
        <NFormItem label="开始日期">
          <NDatePicker v-model:formatted-value="medOrderForm.start_date" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" style="width: 100%" />
        </NFormItem>
        <NFormItem label="结束日期">
          <NDatePicker v-model:formatted-value="medOrderForm.end_date" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" clearable placeholder="留空表示长期" style="width: 100%" />
        </NFormItem>
        <NFormItem label="开方医生"><NInput v-model:value="medOrderForm.prescriber" /></NFormItem>
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showMedOrderModal = false">取消</NButton>
          <NButton type="primary" @click="saveMedOrder">添加医嘱</NButton>
        </NSpace>
      </template>
    </NModal>

    <!-- 用药执行记录弹窗 -->
    <NModal v-model:show="showMedRecordModal" title="用药执行记录" preset="card" style="width:480px">
      <NForm :model="medRecordForm" label-placement="left" label-width="90">
        <NFormItem label="服药日期">
          <NDatePicker v-model:formatted-value="medRecordForm.take_date" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" style="width: 100%" />
        </NFormItem>
        <NFormItem label="服药时间"><NInput v-model:value="medRecordForm.take_time" /></NFormItem>
        <NFormItem label="班次"><NSelect v-model:value="medRecordForm.shift" :options="shiftOptions" /></NFormItem>
        <NFormItem label="执行状态"><NSelect v-model:value="medRecordForm.status" :options="medRecordStatusOptions" /></NFormItem>
        <NFormItem label="执行人"><NInput v-model:value="medRecordForm.executor" /></NFormItem>
        <NFormItem label="备注"><NInput v-model:value="medRecordForm.remark" /></NFormItem>
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showMedRecordModal = false">取消</NButton>
          <NButton type="primary" @click="saveMedRecord">保存</NButton>
        </NSpace>
      </template>
    </NModal>

    <!-- 就医弹窗 -->
    <NModal v-model:show="showVisitModal" title="就医/转诊记录" preset="card" style="width:520px">
      <NForm :model="visitForm" label-placement="left" label-width="90">
        <NFormItem label="就医日期" required>
          <NDatePicker v-model:formatted-value="visitForm.visit_date" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" style="width: 100%" />
        </NFormItem>
        <NFormItem label="医院"><NInput v-model:value="visitForm.hospital" /></NFormItem>
        <NFormItem label="科室"><NInput v-model:value="visitForm.department" /></NFormItem>
        <NFormItem label="医生"><NInput v-model:value="visitForm.doctor" /></NFormItem>
        <NFormItem label="诊断"><NInput v-model:value="visitForm.diagnosis" type="textarea" :rows="2" /></NFormItem>
        <NFormItem label="治疗方案"><NInput v-model:value="visitForm.treatment" type="textarea" :rows="2" /></NFormItem>
        <NFormItem label="费用(元)"><NInputNumber v-model:value="visitForm.cost" :min="0" :precision="2" /></NFormItem>
        <NFormItem label="陪同人员"><NInput v-model:value="visitForm.escort" /></NFormItem>
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showVisitModal = false">取消</NButton>
          <NButton type="primary" @click="saveVisit">保存</NButton>
        </NSpace>
      </template>
    </NModal>
  </BasePage>
</template>
