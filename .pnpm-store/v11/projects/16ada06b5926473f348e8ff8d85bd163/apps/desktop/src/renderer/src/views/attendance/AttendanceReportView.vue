<script setup lang="ts">
defineOptions({ name: 'AttendanceReport' })
import { NCard, NButton, NSpace, NTag, NSelect, NDatePicker } from 'naive-ui'
import { BasePage, BaseTable } from '@yanglao/ui'
import { useAttendanceStore } from '../../stores/attendance.store'
import { useUserStore } from '../../stores/user.store'
import { ref, h, computed } from 'vue'
import { usePageRefresh } from '../../composables/usePageRefresh'
import type { AttendanceRow } from '@yanglao/db'

const attendanceStore = useAttendanceStore()
const userStore = useUserStore()

const today = new Date()
const rangeStart = ref(new Date(today.getFullYear(), today.getMonth(), 1).getTime())
const rangeEnd = ref(today.getTime())
const selectedUserId = ref<string | null>(null)

function toDateStr(ts: number) {
  return new Date(ts).toISOString().slice(0, 10)
}

async function loadData() {
  await userStore.fetchList()
  await loadReport()
}
const { refresh, refreshing } = usePageRefresh(loadData)

async function loadReport() {
  await attendanceStore.fetchRange(toDateStr(rangeStart.value), toDateStr(rangeEnd.value), selectedUserId.value ?? undefined)
}

const userOptions = computed(() => userStore.list.map(u => ({ label: u.real_name, value: u.id })))

function userName(id: string) {
  return userStore.list.find(u => u.id === id)?.real_name ?? '—'
}

const statusTagType: Record<string, 'success' | 'warning' | 'error'> = {
  normal: 'success', late: 'warning', early_leave: 'warning', absent: 'error',
}
const statusLabel: Record<string, string> = {
  normal: '正常', late: '迟到', early_leave: '早退', absent: '缺卡',
}

const columns = [
  { title: '员工', key: 'user_id', width: 110, render: (r: AttendanceRow) => userName(r.user_id) },
  { title: '日期', key: 'clock_date', width: 110 },
  { title: '类型', key: 'clock_type', width: 90, render: (r: AttendanceRow) => r.clock_type === 'clock_in' ? '上班' : '下班' },
  { title: '打卡时间', key: 'clock_at', width: 180 },
  { title: '状态', key: 'status', width: 90, render: (r: AttendanceRow) => h(NTag, { type: statusTagType[r.status] ?? 'success' }, () => statusLabel[r.status] ?? r.status) },
]

// 简单汇总：按员工统计迟到/早退次数
const summary = computed(() => {
  const map: Record<string, { late: number; early: number; total: number }> = {}
  for (const r of attendanceStore.rangeRecords) {
    if (!map[r.user_id]) map[r.user_id] = { late: 0, early: 0, total: 0 }
    map[r.user_id].total++
    if (r.status === 'late') map[r.user_id].late++
    if (r.status === 'early_leave') map[r.user_id].early++
  }
  return Object.entries(map).map(([userId, s]) => ({ userId, ...s }))
})

const summaryColumns = [
  { title: '员工', key: 'userId', width: 110, render: (r: { userId: string }) => userName(r.userId) },
  { title: '打卡总次数', key: 'total', width: 100 },
  { title: '迟到次数', key: 'late', width: 100 },
  { title: '早退次数', key: 'early', width: 100 },
]
</script>

<template>
  <BasePage title="考勤报表">
    <NCard class="mb-4">
      <NSpace align="center">
        <span>统计区间：</span>
        <NDatePicker v-model:value="rangeStart" type="date" style="width:150px" @update:value="loadReport" />
        <span>至</span>
        <NDatePicker v-model:value="rangeEnd" type="date" style="width:150px" @update:value="loadReport" />
        <NSelect v-model:value="selectedUserId" :options="userOptions" clearable filterable placeholder="按员工筛选" style="width:160px" @update:value="loadReport" />
        <NButton @click="loadReport">查询</NButton>
        <NButton :loading="refreshing" size="small" @click="refresh">刷新</NButton>
      </NSpace>
    </NCard>

    <NCard title="汇总统计" class="mb-4">
      <BaseTable :columns="summaryColumns" :data="summary" :pagination="false" />
    </NCard>

    <NCard title="打卡明细">
      <BaseTable :columns="columns" :data="attendanceStore.rangeRecords" :loading="attendanceStore.loading" :pagination="{ pageSize: 20 }" />
    </NCard>
  </BasePage>
</template>
