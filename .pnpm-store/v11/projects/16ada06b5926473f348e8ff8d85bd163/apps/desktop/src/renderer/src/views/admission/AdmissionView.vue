<script setup lang="ts">
defineOptions({ name: 'Admission' })
import {
  NCard, NButton, NSpace, NTag, NModal, NForm, NFormItem,
  NInput, NInputNumber, NSelect, NDatePicker, NTabs, NTabPane,
  useMessage, NAlert
} from 'naive-ui'
import { BasePage, BaseTable } from '@yanglao/ui'
import { useAdmissionStore } from '../../stores/admission.store'
import { useBuildingStore } from '../../stores/building.store'
import { useElderlyStore } from '../../stores/elderly.store'
import { ref, h, computed } from 'vue'
import { formatDateTime } from '@yanglao/core'
import { usePageRefresh } from '../../composables/usePageRefresh'
import type { AdmissionRow } from '@yanglao/db'

const admissionStore = useAdmissionStore()
const buildingStore = useBuildingStore()
const elderlyStore = useElderlyStore()
const message = useMessage()

async function loadData() {
  await Promise.all([
    admissionStore.fetchAdmissions(),
    buildingStore.fetchAll(),
    elderlyStore.fetchList(),
  ])
}
const { refresh, refreshing } = usePageRefresh(loadData)

// ── 入院办理 ─────────────────────────────────────
const showAdmissionModal = ref(false)
function createAdmissionForm() {
  return {
    elderly_id: '',
    bed_id: '',
    admission_date: formatDateTime(Date.now()),
    care_level: 'level2',
    deposit: 0,
    monthly_fee: 0,
    remark: '',
  }
}

const admissionForm = ref(createAdmissionForm())

function openAdmissionModal() {
  admissionForm.value = createAdmissionForm()
  showAdmissionModal.value = true
}

// 待办理入院/暂离：尚未入院或已离院的老人（非在院状态）
const pendingElderlyOptions = computed(() =>
  elderlyStore.list
    .filter(e => e.status !== 'active')
    .map(e => ({ label: `${e.name}（${e.id_card ?? e.phone ?? ''}）`, value: e.id }))
)

// 在院老人：暂离登记、办理离院时选择
const activeElderlyOptions = computed(() =>
  elderlyStore.list
    .filter(e => e.status === 'active')
    .map(e => ({ label: `${e.name}（${e.id_card ?? e.phone ?? ''}）`, value: e.id }))
)

// 离院应以有效入住记录为准，避免老人状态与入住记录短暂不同步时下拉框显示内部 ID。
const dischargeElderlyOptions = computed(() =>
  admissionStore.admissions
    .filter(a => a.status === 'active')
    .map(a => {
      const elderly = elderlyStore.list.find(e => e.id === a.elderly_id)
      return {
        label: elderly ? `${elderly.name}（${elderly.id_card ?? elderly.phone ?? ''}）` : '未找到老人信息',
        value: a.elderly_id,
      }
    })
)

const availableBedOptions = computed(() => {
  const available = buildingStore.beds.filter(b => b.status === 'available')
  return available.map(b => {
    const room = buildingStore.rooms.find(r => r.id === b.room_id)
    return { label: `${room?.room_no ?? ''}—${b.bed_no}`, value: b.id }
  })
})

const careLevelOptions = [
  { label: '自理（一级）', value: 'level1' },
  { label: '半自理（二级）', value: 'level2' },
  { label: '不能自理（三级）', value: 'level3' },
  { label: '完全不能自理（四级）', value: 'level4' },
]

async function saveAdmission() {
  if (!admissionForm.value.elderly_id || !admissionForm.value.admission_date) {
    return message.error('请填写老人和入院日期')
  }
  try {
    await admissionStore.createAdmission({
      ...admissionForm.value,
      bed_id: admissionForm.value.bed_id || null,
      status: 'active',
      remark: admissionForm.value.remark || null,
      created_by: null,
    })
    // 同步更新床位状态
    if (admissionForm.value.bed_id) {
      await buildingStore.updateBed(admissionForm.value.bed_id, { status: 'occupied', elderly_id: admissionForm.value.elderly_id })
    }
    // 更新老人状态
    await elderlyStore.update(admissionForm.value.elderly_id, {
      status: 'active',
      bed_id: admissionForm.value.bed_id || null,
      admission_date: admissionForm.value.admission_date,
      care_level: admissionForm.value.care_level,
    })
    showAdmissionModal.value = false
    message.success('入院登记成功')
  } catch (e) {
    // 多步操作中途失败时，部分数据可能已落库，务必在 finally 中刷新，避免 UI 与后端状态不一致
    message.error(e instanceof Error ? e.message : '入院登记失败，请检查数据后重试')
  } finally {
    await refresh()
  }
}

// ── 暂离登记 ─────────────────────────────────────
const showLeaveModal = ref(false)
const leaveForm = ref({ elderly_id: '', leave_date: formatDateTime(Date.now()), expect_return: null as string | null, reason: '', contact_phone: '' })

async function saveLeave() {
  if (!leaveForm.value.elderly_id || !leaveForm.value.leave_date) return message.error('请填写必填项')
  try {
    await admissionStore.createLeave({ ...leaveForm.value, status: 'out', actual_return: null, created_by: null })
    await elderlyStore.update(leaveForm.value.elderly_id, { status: 'inactive' })
    showLeaveModal.value = false
    message.success('暂离登记成功')
  } catch (e) {
    message.error(e instanceof Error ? e.message : '暂离登记失败，请检查数据后重试')
  } finally {
    await refresh()
  }
}

// ── 离院办理 ─────────────────────────────────────
const showDischargeModal = ref(false)
const dischargeForm = ref({ elderly_id: '', admission_id: '', discharge_date: formatDateTime(Date.now()), reason: '', refund_amount: 0, remark: '' })

function openDischargeModal() {
  dischargeForm.value = { elderly_id: '', admission_id: '', discharge_date: formatDateTime(Date.now()), reason: '', refund_amount: 0, remark: '' }
  showDischargeModal.value = true
}

const dischargeReasonOptions = [
  { label: '自愿离院', value: '自愿离院' },
  { label: '家属接回', value: '家属接回' },
  { label: '转院', value: '转院' },
  { label: '去世', value: '去世' },
  { label: '其他', value: '其他' },
]

// 从工具栏直接打开离院弹窗时，根据选择的老人自动带出其在院入住记录，
// 避免离院记录的 admission_id 为空导致与入住记录失联
function onDischargeElderlyChange(elderlyId: string | null) {
  if (!elderlyId) {
    dischargeForm.value.admission_id = ''
    return
  }
  const admission = admissionStore.admissions.find(a => a.elderly_id === elderlyId && a.status === 'active')
  dischargeForm.value.admission_id = admission?.id ?? ''
}

async function saveDischarge() {
  if (!dischargeForm.value.elderly_id || !dischargeForm.value.discharge_date) return message.error('请填写必填项')
  // 先读取床位信息，再更新老人状态，避免床位号在老人状态更新后被清空导致无法释放
  const elderly = elderlyStore.list.find(e => e.id === dischargeForm.value.elderly_id)
  const bedId = elderly?.bed_id ?? null

  try {
    await admissionStore.createDischarge({ ...dischargeForm.value, created_by: null })
    // 同步更新入住记录状态为已离院，否则"在院记录"会继续显示已离院老人，"离院历史"永远为空
    if (dischargeForm.value.admission_id) {
      await admissionStore.updateAdmission(dischargeForm.value.admission_id, { status: 'discharged' })
    }
    // 更新老人状态为离院
    await elderlyStore.update(dischargeForm.value.elderly_id, { status: 'left', bed_id: null })
    // 释放床位
    if (bedId) {
      await buildingStore.updateBed(bedId, { status: 'available', elderly_id: null })
    }
    showDischargeModal.value = false
    message.success('离院办理成功')
  } catch (e) {
    message.error(e instanceof Error ? e.message : '离院办理失败，请检查数据后重试')
  } finally {
    await refresh()
  }
}

// ── 入住统计列 ─────────────────────────────────────
const admissionColumns = [
  { title: '老人姓名', key: 'elderly_id', width: 100, render: (r: AdmissionRow) => elderlyStore.list.find(e => e.id === r.elderly_id)?.name ?? r.elderly_id },
  { title: '入院日期', key: 'admission_date', width: 160, render: (r: AdmissionRow) => formatDateTime(r.admission_date) },
  { title: '护理级别', key: 'care_level', width: 130, render: (r: AdmissionRow) => careLevelOptions.find(c => c.value === r.care_level)?.label ?? r.care_level },
  { title: '押金(元)', key: 'deposit', width: 100 },
  { title: '月费(元)', key: 'monthly_fee', width: 100 },
  { title: '状态', key: 'status', width: 80, render: (r: AdmissionRow) => h(NTag, { type: r.status === 'active' ? 'success' : 'default' }, () => r.status === 'active' ? '在院' : '已离院') },
  {
    title: '操作', key: 'actions', width: 120,
    render: (r: AdmissionRow) => h(NButton, {
      size: 'small', type: 'error', disabled: r.status !== 'active',
      onClick: () => {
        dischargeForm.value = { elderly_id: r.elderly_id, admission_id: r.id, discharge_date: formatDateTime(Date.now()), reason: '自愿离院', refund_amount: 0, remark: '' }
        showDischargeModal.value = true
      }
    }, () => '办理离院')
  },
]

// 今日暂离老人
const outElderlyList = computed(() =>
  elderlyStore.list.filter(e => e.status === 'inactive')
)
</script>

<template>
  <BasePage title="入住管理">
    <NSpace class="mb-4">
      <NButton type="primary" @click="openAdmissionModal">+ 办理入院</NButton>
      <NButton @click="showLeaveModal = true">+ 暂离登记</NButton>
      <NButton @click="openDischargeModal">办理离院</NButton>
      <NButton :loading="refreshing" size="small" @click="refresh">刷新</NButton>
    </NSpace>

    <NTabs type="line" animated>
      <!-- 在院记录 -->
      <NTabPane name="active" tab="在院记录">
        <NCard>
          <BaseTable
            :columns="admissionColumns"
            :data="admissionStore.admissions.filter(a => a.status === 'active')"
            :loading="admissionStore.loading"
            :pagination="{ pageSize: 15 }"
          />
        </NCard>
      </NTabPane>

      <!-- 暂离列表 -->
      <NTabPane name="leave" :tab="`暂离中（${outElderlyList.length}人）`">
        <NCard>
          <NSpace class="mb-3">
            <NAlert type="warning" style="flex:1">当前有 {{ outElderlyList.length }} 位老人在外，请及时关注返院情况。</NAlert>
          </NSpace>
          <BaseTable
            :columns="[
              { title: '老人姓名', key: 'name', width: 100 },
              { title: '房间号', key: 'room_no', width: 100 },
              { title: '手机号', key: 'phone', width: 130 },
              { title: '状态', key: 'status', width: 80, render: () => h(NTag, { type: 'warning' }, () => '暂离') },
            ]"
            :data="outElderlyList"
            :pagination="false"
          />
        </NCard>
      </NTabPane>

      <!-- 历史离院 -->
      <NTabPane name="discharged" tab="离院历史">
        <NCard>
          <BaseTable
            :columns="admissionColumns"
            :data="admissionStore.admissions.filter(a => a.status === 'discharged')"
            :loading="admissionStore.loading"
            :pagination="{ pageSize: 15 }"
          />
        </NCard>
      </NTabPane>
    </NTabs>

    <!-- 入院弹窗 -->
    <NModal v-model:show="showAdmissionModal" title="办理入院" preset="card" style="width:520px">
      <NForm :model="admissionForm" label-placement="left" label-width="90">
        <NFormItem label="选择老人" required><NSelect v-model:value="admissionForm.elderly_id" :options="pendingElderlyOptions" filterable placeholder="搜索待入院老人" /></NFormItem>
        <NFormItem label="分配床位"><NSelect v-model:value="admissionForm.bed_id" :options="availableBedOptions" clearable placeholder="选择空闲床位" /></NFormItem>
        <NFormItem label="入院日期" required>
          <NDatePicker v-model:formatted-value="admissionForm.admission_date" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" style="width: 100%" />
        </NFormItem>
        <NFormItem label="护理级别"><NSelect v-model:value="admissionForm.care_level" :options="careLevelOptions" /></NFormItem>
        <NFormItem label="押金(元)"><NInputNumber v-model:value="admissionForm.deposit" :min="0" :precision="2" /></NFormItem>
        <NFormItem label="月费用(元)"><NInputNumber v-model:value="admissionForm.monthly_fee" :min="0" :precision="2" /></NFormItem>
        <NFormItem label="备注"><NInput v-model:value="admissionForm.remark" type="textarea" :rows="2" /></NFormItem>
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showAdmissionModal = false">取消</NButton>
          <NButton type="primary" @click="saveAdmission">确认入院</NButton>
        </NSpace>
      </template>
    </NModal>

    <!-- 暂离弹窗 -->
    <NModal v-model:show="showLeaveModal" title="暂离登记" preset="card" style="width:480px">
      <NForm :model="leaveForm" label-placement="left" label-width="90">
        <NFormItem label="选择老人" required><NSelect v-model:value="leaveForm.elderly_id" :options="activeElderlyOptions" filterable /></NFormItem>
        <NFormItem label="外出日期" required>
          <NDatePicker v-model:formatted-value="leaveForm.leave_date" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" style="width: 100%" />
        </NFormItem>
        <NFormItem label="预计返院">
          <NDatePicker v-model:formatted-value="leaveForm.expect_return" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" clearable style="width: 100%" />
        </NFormItem>
        <NFormItem label="外出原因"><NInput v-model:value="leaveForm.reason" /></NFormItem>
        <NFormItem label="联系电话"><NInput v-model:value="leaveForm.contact_phone" /></NFormItem>
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showLeaveModal = false">取消</NButton>
          <NButton type="primary" @click="saveLeave">登记外出</NButton>
        </NSpace>
      </template>
    </NModal>

    <!-- 离院弹窗 -->
    <NModal v-model:show="showDischargeModal" title="办理离院" preset="card" style="width:480px">
      <NForm :model="dischargeForm" label-placement="left" label-width="90">
        <NFormItem label="选择老人" required><NSelect v-model:value="dischargeForm.elderly_id" :options="dischargeElderlyOptions" filterable @update:value="onDischargeElderlyChange" /></NFormItem>
        <NFormItem label="离院日期" required>
          <NDatePicker v-model:formatted-value="dischargeForm.discharge_date" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" style="width: 100%" />
        </NFormItem>
        <NFormItem label="离院原因" required><NSelect v-model:value="dischargeForm.reason" :options="dischargeReasonOptions" /></NFormItem>
        <NFormItem label="退款金额"><NInputNumber v-model:value="dischargeForm.refund_amount" :min="0" :precision="2" /></NFormItem>
        <NFormItem label="备注"><NInput v-model:value="dischargeForm.remark" type="textarea" :rows="2" /></NFormItem>
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showDischargeModal = false">取消</NButton>
          <NButton type="primary" @click="saveDischarge">确认离院</NButton>
        </NSpace>
      </template>
    </NModal>
  </BasePage>
</template>
