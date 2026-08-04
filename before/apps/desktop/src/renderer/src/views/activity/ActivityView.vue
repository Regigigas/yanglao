<script setup lang="ts">
defineOptions({ name: 'Activity' })
import {
  NCard, NButton, NSpace, NTag, NModal, NForm, NFormItem,
  NInput, NInputNumber, NSelect, NDatePicker, NTimePicker, useMessage, useDialog
} from 'naive-ui'
import { BasePage, BaseTable } from '@yanglao/ui'
import { useActivityStore } from '../../stores/activity.store'
import { useElderlyStore } from '../../stores/elderly.store'
import { ref, h, computed } from 'vue'
import { formatDate } from '@yanglao/core'
import { usePageRefresh } from '../../composables/usePageRefresh'
import type { ActivityRow, ActivityAttendanceRow } from '@yanglao/db'

const activityStore = useActivityStore()
const elderlyStore = useElderlyStore()
const message = useMessage()
const dialog = useDialog()
const saving = ref(false)
const activityStatusFilter = ref<string | null>(null)
const activityKeyword = ref('')

async function loadData() {
  await Promise.all([activityStore.fetchAll(), elderlyStore.fetchList()])
}
const { refresh, refreshing } = usePageRefresh(loadData)

// ── 活动管理 ─────────────────────────────────────
const showActivityModal = ref(false)
const editingActivityId = ref<string | null>(null)

function createActivityForm() {
  return {
    title: '', category: 'entertainment' as ActivityRow['category'],
    activity_date: formatDate(Date.now()),
    start_time: null as string | null, end_time: null as string | null, location: '', organizer: '',
    max_capacity: null as number | null, description: '',
  }
}

const activityForm = ref(createActivityForm())

const categoryOptions = [
  { label: '文娱活动', value: 'entertainment' },
  { label: '体育锻炼', value: 'sports' },
  { label: '文化学习', value: 'cultural' },
  { label: '健康保健', value: 'health' },
  { label: '其他', value: 'other' },
]

const statusTagType: Record<string, 'default'|'success'|'info'|'warning'|'error'> = {
  planned: 'info', ongoing: 'warning', completed: 'success', cancelled: 'default'
}
const statusLabel: Record<string, string> = {
  planned: '计划中', ongoing: '进行中', completed: '已完成', cancelled: '已取消'
}
const statusOptions = [
  { label: '计划中', value: 'planned' },
  { label: '进行中', value: 'ongoing' },
  { label: '已完成', value: 'completed' },
  { label: '已取消', value: 'cancelled' },
]

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

function openActivityCreate() {
  editingActivityId.value = null
  activityForm.value = createActivityForm()
  showActivityModal.value = true
}

function openActivityEdit(activity: ActivityRow) {
  editingActivityId.value = activity.id
  activityForm.value = {
    title: activity.title,
    category: activity.category,
    activity_date: activity.activity_date.slice(0, 10),
    start_time: activity.start_time,
    end_time: activity.end_time,
    location: activity.location ?? '',
    organizer: activity.organizer ?? '',
    max_capacity: activity.max_capacity,
    description: activity.description ?? '',
  }
  showActivityModal.value = true
}

async function saveActivity() {
  const form = activityForm.value
  if (!form.title.trim() || !form.activity_date) return message.error('请填写活动标题和日期')
  if (form.end_time && !form.start_time) return message.error('请先填写开始时间')
  if (form.start_time && form.end_time && form.start_time >= form.end_time) return message.error('结束时间必须晚于开始时间')

  const data = {
    title: form.title.trim(), category: form.category, activity_date: form.activity_date,
    start_time: form.start_time, end_time: form.end_time,
    location: form.location.trim() || null, organizer: form.organizer.trim() || null,
    max_capacity: form.max_capacity, description: form.description.trim() || null,
  }
  saving.value = true
  try {
    if (editingActivityId.value) {
      await activityStore.update(editingActivityId.value, data)
      message.success('活动已更新')
    } else {
      await activityStore.create({ ...data, status: 'planned', created_by: null, deleted_at: null })
      message.success('活动已创建')
    }
    showActivityModal.value = false
    await activityStore.fetchAll()
  } catch (error) {
    message.error(errorMessage(error, '保存活动失败'))
  } finally {
    saving.value = false
  }
}

const filteredActivities = computed(() => {
  const keyword = activityKeyword.value.trim().toLowerCase()
  return activityStore.list.filter((activity) => {
    const matchedStatus = !activityStatusFilter.value || activity.status === activityStatusFilter.value
    const matchedKeyword = !keyword || [activity.title, activity.location ?? '', activity.organizer ?? '']
      .some(value => value.toLowerCase().includes(keyword))
    return matchedStatus && matchedKeyword
  })
})

function cancelActivity(activity: ActivityRow) {
  dialog.warning({
    title: '取消活动', content: `确定取消“${activity.title}”吗？取消后不可恢复。`, positiveText: '确定取消', negativeText: '返回',
    onPositiveClick: async () => {
      try {
        await activityStore.cancel(activity.id)
        if (currentActivity.value?.id === activity.id) currentActivity.value = { ...currentActivity.value, status: 'cancelled' }
        message.success('活动已取消')
      } catch (error) {
        message.error(errorMessage(error, '取消活动失败'))
      }
    },
  })
}

const activityColumns = [
  { title: '活动名称', key: 'title', width: 150, ellipsis: { tooltip: true } },
  { title: '分类', key: 'category', width: 100, render: (r: ActivityRow) => categoryOptions.find(c => c.value === r.category)?.label ?? r.category },
  { title: '日期', key: 'activity_date', width: 120, render: (r: ActivityRow) => formatDate(r.activity_date) },
  { title: '时间', key: 'time', width: 120, render: (r: ActivityRow) => r.start_time ? `${r.start_time}~${r.end_time ?? ''}` : '—' },
  { title: '地点', key: 'location', width: 120 },
  { title: '状态', key: 'status', width: 90, render: (r: ActivityRow) => h(NTag, { type: statusTagType[r.status] ?? 'default' }, () => statusLabel[r.status] ?? r.status) },
  {
    title: '操作', key: 'actions', width: 320,
    render: (r: ActivityRow) => h(NSpace, null, { default: () => [
      h(NButton, { size: 'small', onClick: () => openAttendance(r) }, '签到管理'),
      ...(r.status === 'planned' ? [
        h(NButton, { size: 'small', onClick: () => openActivityEdit(r) }, '编辑'),
        h(NButton, { size: 'small', type: 'primary', onClick: () => startActivity(r) }, '开始'),
      ] : []),
      ...(r.status === 'ongoing' ? [
        h(NButton, { size: 'small', type: 'primary', onClick: () => finishActivity(r) }, '结束'),
      ] : []),
      ...((r.status === 'planned' || r.status === 'ongoing') ? [
        h(NButton, { size: 'small', onClick: () => cancelActivity(r) }, '取消'),
      ] : []),
      h(NButton, { size: 'small', type: 'error', onClick: () => {
        dialog.warning({ title: '删除', content: '确认删除此活动？', positiveText: '确定', negativeText: '取消',
          onPositiveClick: async () => { await activityStore.remove(r.id); message.success('已删除'); await refresh() }
        })
      }}, '删除'),
    ]})
  },
]

// ── 签到管理 ─────────────────────────────────────
const showAttendanceModal = ref(false)
const currentActivity = ref<ActivityRow | null>(null)
const addElderlyId = ref<string | null>(null)

const elderlyOptions = computed(() =>
  elderlyStore.list.filter(e => e.status === 'active').map(e => ({ label: e.name, value: e.id }))
)
const availableElderlyOptions = computed(() => {
  const registeredIds = new Set(activityStore.attendance.map(row => row.elderly_id))
  return elderlyOptions.value.filter(option => !registeredIds.has(option.value))
})
const attendanceStats = computed(() => ({
  registered: activityStore.attendance.filter(row => row.status === 'registered').length,
  attended: activityStore.attendance.filter(row => row.status === 'attended').length,
  absent: activityStore.attendance.filter(row => row.status === 'absent').length,
}))
const isAtCapacity = computed(() => currentActivity.value?.max_capacity !== null
  && currentActivity.value !== null
  && activityStore.attendance.length >= currentActivity.value.max_capacity)
const canManageParticipants = computed(() => currentActivity.value?.status === 'planned' || currentActivity.value?.status === 'ongoing')
const canCheckIn = computed(() => currentActivity.value?.status === 'ongoing')

async function openAttendance(activity: ActivityRow) {
  currentActivity.value = activity
  await activityStore.fetchAttendance(activity.id)
  showAttendanceModal.value = true
}

async function startActivity(activity = currentActivity.value) {
  if (!activity) return
  try {
    await activityStore.start(activity.id)
    if (currentActivity.value?.id === activity.id) currentActivity.value = { ...currentActivity.value, status: 'ongoing' }
    message.success('活动已开始')
  } catch (error) {
    message.error(errorMessage(error, '开始活动失败'))
  }
}

function finishActivity(activity = currentActivity.value) {
  if (!activity) return
  dialog.warning({
    title: '结束活动', content: '未签到的参与者将统一标记为缺席，确定结束此活动吗？', positiveText: '结束活动', negativeText: '返回',
    onPositiveClick: async () => {
      try {
        await activityStore.complete(activity.id)
        if (currentActivity.value?.id === activity.id) {
          currentActivity.value = { ...currentActivity.value, status: 'completed' }
          await activityStore.fetchAttendance(activity.id)
        }
        message.success('活动已完成')
      } catch (error) {
        message.error(errorMessage(error, '结束活动失败'))
      }
    },
  })
}

async function addParticipant() {
  if (!addElderlyId.value || !currentActivity.value || isAtCapacity.value) return
  try {
    await activityStore.register(currentActivity.value.id, addElderlyId.value)
    addElderlyId.value = null
    message.success('已报名')
    await activityStore.fetchAttendance(currentActivity.value.id)
  } catch (error) {
    message.error(errorMessage(error, '报名失败'))
  }
}

async function doCheckIn(elderlyId: string) {
  if (!currentActivity.value || !canCheckIn.value) return
  try {
    await activityStore.checkIn(currentActivity.value.id, elderlyId)
    message.success('签到成功')
    await activityStore.fetchAttendance(currentActivity.value.id)
  } catch (error) {
    message.error(errorMessage(error, '签到失败'))
  }
}

async function markAbsent(elderlyId: string) {
  if (!currentActivity.value || !canCheckIn.value) return
  try {
    await activityStore.markAbsent(currentActivity.value.id, elderlyId)
    message.success('已标记缺席')
  } catch (error) {
    message.error(errorMessage(error, '标记缺席失败'))
  }
}

async function removeParticipant(elderlyId: string) {
  if (!currentActivity.value || !canManageParticipants.value) return
  try {
    await activityStore.removeAttendance(currentActivity.value.id, elderlyId)
    message.success('已移除参与者')
  } catch (error) {
    message.error(errorMessage(error, '移除参与者失败'))
  }
}

const attendanceColumns = [
  { title: '老人', key: 'elderly_id', width: 100, render: (r: ActivityAttendanceRow) => elderlyStore.list.find(e => e.id === r.elderly_id)?.name ?? r.elderly_id },
  { title: '状态', key: 'status', width: 90, render: (r: ActivityAttendanceRow) => h(NTag, {
    type: r.status === 'attended' ? 'success' : r.status === 'absent' ? 'error' : 'info'
  }, () => ({ registered: '已报名', attended: '已签到', absent: '缺席' }[r.status] ?? r.status)) },
  { title: '签到时间', key: 'check_in_at', width: 160, render: (r: ActivityAttendanceRow) => r.check_in_at ? new Date(r.check_in_at).toLocaleString() : '—' },
  { title: '操作', key: 'actions', width: 210, render: (r: ActivityAttendanceRow) => h(NSpace, null, { default: () => [
    h(NButton, { size: 'small', type: 'primary', disabled: !canCheckIn.value || r.status !== 'registered', onClick: () => doCheckIn(r.elderly_id) }, '签到'),
    h(NButton, { size: 'small', disabled: !canCheckIn.value || r.status !== 'registered', onClick: () => markAbsent(r.elderly_id) }, '缺席'),
    h(NButton, { size: 'small', type: 'error', disabled: !canManageParticipants.value || r.status !== 'registered', onClick: () => removeParticipant(r.elderly_id) }, '移除'),
  ]}) },
]
</script>

<template>
  <BasePage title="活动管理">
    <NCard class="mb-4">
      <NSpace>
        <NSelect
          v-model:value="activityStatusFilter"
          :options="statusOptions"
          clearable
          placeholder="活动状态"
          style="width: 130px"
        />
        <NInput v-model:value="activityKeyword" clearable placeholder="搜索活动名称、地点或组织者" style="width: 240px" />
        <NButton :loading="refreshing" size="small" @click="refresh">刷新</NButton>
        <NButton type="primary" @click="openActivityCreate">+ 新增活动</NButton>
      </NSpace>
    </NCard>
    <NCard>
      <BaseTable :columns="activityColumns" :data="filteredActivities" :loading="activityStore.loading" :pagination="{ pageSize: 15 }" />
    </NCard>

    <!-- 活动编辑弹窗 -->
    <NModal v-model:show="showActivityModal" :title="editingActivityId ? '编辑活动' : '新增活动'" preset="card" style="width:520px">
      <NForm :model="activityForm" label-placement="left" label-width="80">
        <NFormItem label="活动名称" required><NInput v-model:value="activityForm.title" /></NFormItem>
        <NFormItem label="分类"><NSelect v-model:value="activityForm.category" :options="categoryOptions" /></NFormItem>
        <NFormItem label="活动日期" required>
          <NDatePicker v-model:formatted-value="activityForm.activity_date" value-format="yyyy-MM-dd" type="date" style="width: 100%" />
        </NFormItem>
        <NFormItem label="开始时间"><NTimePicker v-model:formatted-value="activityForm.start_time" value-format="HH:mm" format="HH:mm" style="width: 100%" /></NFormItem>
        <NFormItem label="结束时间"><NTimePicker v-model:formatted-value="activityForm.end_time" value-format="HH:mm" format="HH:mm" style="width: 100%" /></NFormItem>
        <NFormItem label="活动地点"><NInput v-model:value="activityForm.location" /></NFormItem>
        <NFormItem label="组织者"><NInput v-model:value="activityForm.organizer" /></NFormItem>
        <NFormItem label="人数上限"><NInputNumber v-model:value="activityForm.max_capacity" :min="1" placeholder="不填表示不限人数" style="width: 100%" /></NFormItem>
        <NFormItem label="活动描述"><NInput v-model:value="activityForm.description" type="textarea" :rows="3" /></NFormItem>
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showActivityModal = false">取消</NButton>
          <NButton type="primary" :loading="saving" @click="saveActivity">保存</NButton>
        </NSpace>
      </template>
    </NModal>

    <!-- 签到管理弹窗 -->
    <NModal v-model:show="showAttendanceModal" :title="`${currentActivity?.title} - 签到管理`" preset="card" style="width:600px">
      <NSpace class="mb-3">
        <NSelect v-model:value="addElderlyId" :options="availableElderlyOptions" filterable clearable placeholder="搜索老人" style="width:180px" :disabled="!canManageParticipants || isAtCapacity" />
        <NButton type="primary" :disabled="!addElderlyId || !canManageParticipants || isAtCapacity" @click="addParticipant">添加参与者</NButton>
        <NButton v-if="currentActivity?.status === 'planned'" @click="() => startActivity()">开始活动</NButton>
        <NButton v-if="currentActivity?.status === 'ongoing'" @click="() => finishActivity()">结束活动</NButton>
      </NSpace>
      <NSpace class="mb-3">
        <NTag type="info">报名 {{ activityStore.attendance.length }}{{ currentActivity?.max_capacity != null ? ` / ${currentActivity.max_capacity}` : '' }}</NTag>
        <NTag type="success">已签到 {{ attendanceStats.attended }}</NTag>
        <NTag type="error">缺席 {{ attendanceStats.absent }}</NTag>
        <NTag v-if="attendanceStats.registered" type="warning">待签到 {{ attendanceStats.registered }}</NTag>
      </NSpace>
      <BaseTable :columns="attendanceColumns" :data="activityStore.attendance" :pagination="false" />
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showAttendanceModal = false">关闭</NButton>
        </NSpace>
      </template>
    </NModal>
  </BasePage>
</template>
