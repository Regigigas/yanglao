<script setup lang="ts">
defineOptions({ name: 'Leave' })
import {
  NCard, NButton, NSpace, NTag, NModal, NForm, NFormItem,
  NInput, NSelect, NDatePicker, NTabs, NTabPane, useMessage, useDialog
} from 'naive-ui'
import { BasePage, BaseTable } from '@yanglao/ui'
import { useAttendanceStore } from '../../stores/attendance.store'
import { useUserStore } from '../../stores/user.store'
import { useAuthStore } from '../../stores/auth.store'
import { ref, h, computed } from 'vue'
import { formatDateTime } from '@yanglao/core'
import { usePageRefresh } from '../../composables/usePageRefresh'
import type { LeaveApplicationRow } from '@yanglao/db'

const attendanceStore = useAttendanceStore()
const userStore = useUserStore()
const authStore = useAuthStore()
const message = useMessage()
const dialog = useDialog()

async function loadData() {
  await Promise.all([userStore.fetchList(), attendanceStore.fetchLeaves()])
}
const { refresh, refreshing } = usePageRefresh(loadData)

function userName(id: string) {
  return userStore.list.find(u => u.id === id)?.real_name ?? '—'
}

// 我的请假记录（自己提交的）
const myLeaves = computed(() =>
  attendanceStore.leaves.filter(l => l.user_id === authStore.currentUser?.id)
)
// 待审批（有 leave:approve 权限的人可见全部待审批）
const pendingLeaves = computed(() => attendanceStore.leaves.filter(l => l.status === 'pending'))

// ── 申请请假 ─────────────────────────────────────
const showLeaveModal = ref(false)
const leaveForm = ref({
  leave_type: 'personal' as 'sick' | 'annual' | 'personal' | 'other',
  start_date: formatDateTime(Date.now()),
  end_date: formatDateTime(Date.now()),
  reason: '',
})

const leaveTypeOptions = [
  { label: '病假', value: 'sick' },
  { label: '年假', value: 'annual' },
  { label: '事假', value: 'personal' },
  { label: '其他', value: 'other' },
]
const leaveTypeLabel: Record<string, string> = { sick: '病假', annual: '年假', personal: '事假', other: '其他' }

async function saveLeave() {
  if (!authStore.currentUser) return
  if (!leaveForm.value.start_date || !leaveForm.value.end_date) return message.error('请选择起止时间')
  await attendanceStore.createLeave({
    user_id: authStore.currentUser.id,
    leave_type: leaveForm.value.leave_type,
    start_date: leaveForm.value.start_date,
    end_date: leaveForm.value.end_date,
    reason: leaveForm.value.reason || null,
  })
  showLeaveModal.value = false
  message.success('请假申请已提交')
  await refresh()
}

function approve(row: LeaveApplicationRow, approved: boolean) {
  dialog.warning({
    title: approved ? '批准请假' : '驳回请假',
    content: `确定要${approved ? '批准' : '驳回'}该请假申请吗？`,
    positiveText: '确定', negativeText: '取消',
    onPositiveClick: async () => {
      await attendanceStore.approveLeave(row.id, approved)
      message.success(approved ? '已批准' : '已驳回')
      await refresh()
    }
  })
}

const statusTagType: Record<string, 'warning' | 'success' | 'error'> = { pending: 'warning', approved: 'success', rejected: 'error' }
const statusLabel: Record<string, string> = { pending: '待审批', approved: '已批准', rejected: '已驳回' }

const myColumns = [
  { title: '类型', key: 'leave_type', width: 90, render: (r: LeaveApplicationRow) => leaveTypeLabel[r.leave_type] ?? r.leave_type },
  { title: '开始时间', key: 'start_date', width: 160 },
  { title: '结束时间', key: 'end_date', width: 160 },
  { title: '原因', key: 'reason', render: (r: LeaveApplicationRow) => r.reason ?? '—' },
  { title: '状态', key: 'status', width: 90, render: (r: LeaveApplicationRow) => h(NTag, { type: statusTagType[r.status] }, () => statusLabel[r.status]) },
]

const pendingColumns = [
  { title: '申请人', key: 'user_id', width: 100, render: (r: LeaveApplicationRow) => userName(r.user_id) },
  { title: '类型', key: 'leave_type', width: 90, render: (r: LeaveApplicationRow) => leaveTypeLabel[r.leave_type] ?? r.leave_type },
  { title: '开始时间', key: 'start_date', width: 160 },
  { title: '结束时间', key: 'end_date', width: 160 },
  { title: '原因', key: 'reason', render: (r: LeaveApplicationRow) => r.reason ?? '—' },
  {
    title: '操作', key: 'actions', width: 160,
    render: (r: LeaveApplicationRow) => h(NSpace, null, { default: () => [
      h(NButton, { size: 'small', type: 'primary', onClick: () => approve(r, true) }, '批准'),
      h(NButton, { size: 'small', type: 'error', onClick: () => approve(r, false) }, '驳回'),
    ]}),
  },
]
</script>

<template>
  <BasePage title="请假管理">
    <NCard class="mb-4">
      <NSpace>
        <NButton type="primary" @click="showLeaveModal = true">+ 申请请假</NButton>
        <NButton :loading="refreshing" size="small" @click="refresh">刷新</NButton>
      </NSpace>
    </NCard>

    <NTabs type="line" animated>
      <NTabPane name="mine" tab="我的请假">
        <NCard>
          <BaseTable :columns="myColumns" :data="myLeaves" :pagination="{ pageSize: 15 }" />
        </NCard>
      </NTabPane>
      <NTabPane name="pending" :tab="`待审批（${pendingLeaves.length}）`">
        <NCard>
          <BaseTable v-perm="'leave:approve'" :columns="pendingColumns" :data="pendingLeaves" :pagination="{ pageSize: 15 }" />
        </NCard>
      </NTabPane>
    </NTabs>

    <!-- 申请弹窗 -->
    <NModal v-model:show="showLeaveModal" title="申请请假" preset="card" style="width:480px">
      <NForm :model="leaveForm" label-placement="left" label-width="90">
        <NFormItem label="请假类型"><NSelect v-model:value="leaveForm.leave_type" :options="leaveTypeOptions" /></NFormItem>
        <NFormItem label="开始时间" required>
          <NDatePicker v-model:formatted-value="leaveForm.start_date" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" style="width: 100%" />
        </NFormItem>
        <NFormItem label="结束时间" required>
          <NDatePicker v-model:formatted-value="leaveForm.end_date" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" style="width: 100%" />
        </NFormItem>
        <NFormItem label="请假原因"><NInput v-model:value="leaveForm.reason" type="textarea" :rows="3" /></NFormItem>
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showLeaveModal = false">取消</NButton>
          <NButton type="primary" @click="saveLeave">提交申请</NButton>
        </NSpace>
      </template>
    </NModal>
  </BasePage>
</template>
