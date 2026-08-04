<script setup lang="ts">
/**
 * ScheduleView - 排班管理（周日历视图）
 * 功能：
 * - 周日历网格：行=员工，列=周一至周日，格内显示班次标签，若已关联提醒则显示铃铛图标
 * - 点击空格新增排班，点击已有排班可编辑/删除，并可设置/修改到点提醒（支持重复规则）
 * - 批量排班：为一名员工在指定日期范围内、按星期几模式一次性创建多条排班
 */
defineOptions({ name: 'Schedule' })
import {
  NCard, NButton, NSpace, NModal, NForm, NFormItem,
  NInput, NSelect, NDatePicker, NTimePicker, NSwitch,
  NCheckboxGroup, NCheckbox, NTooltip, NPopconfirm, NEmpty,
  NTag, NDivider,
  useMessage, useDialog
} from 'naive-ui'
import { BasePage } from '@yanglao/ui'
import { useAttendanceStore } from '../../stores/attendance.store'
import { useUserStore } from '../../stores/user.store'
import { useRoleStore } from '../../stores/role.store'
import { useAuthStore } from '../../stores/auth.store'
import { ref, computed, watch } from 'vue'
import type { ScheduleRow, ShiftRow, TaskReminderRow } from '@yanglao/db'
import { usePageRefresh } from '../../composables/usePageRefresh'

const attendanceStore = useAttendanceStore()
const userStore = useUserStore()
const roleStore = useRoleStore()
const authStore = useAuthStore()
const message = useMessage()
const dialog = useDialog()

// ── 周导航 ────────────────────────────────────────────────
function startOfWeek(d: Date): Date {
  const date = new Date(d)
  const day = date.getDay() // 0=周日
  const diff = day === 0 ? -6 : 1 - day // 周一为起点
  date.setDate(date.getDate() + diff)
  date.setHours(0, 0, 0, 0)
  return date
}
function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const weekStart = ref(startOfWeek(new Date()))

const weekDates = computed<string[]>(() => {
  const arr: string[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart.value)
    d.setDate(d.getDate() + i)
    arr.push(toDateStr(d))
  }
  return arr
})

const weekDayLabels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

const weekRangeText = computed(() => `${weekDates.value[0]} 至 ${weekDates.value[6]}`)

function prevWeek() {
  const d = new Date(weekStart.value)
  d.setDate(d.getDate() - 7)
  weekStart.value = d
}
function nextWeek() {
  const d = new Date(weekStart.value)
  d.setDate(d.getDate() + 7)
  weekStart.value = d
}
function thisWeek() {
  weekStart.value = startOfWeek(new Date())
}

// ── 数据加载 ──────────────────────────────────────────────
const reminderMap = ref<Record<string, TaskReminderRow>>({})

async function loadSchedules() {
  await attendanceStore.fetchSchedules(weekDates.value[0], weekDates.value[6])
  await loadReminders()
}

async function loadReminders() {
  const ids = attendanceStore.schedules.map(s => s.id)
  reminderMap.value = ids.length ? await window.api.reminder.byScheduleIds(ids) : {}
}

async function loadData() {
  await Promise.all([userStore.fetchList(), attendanceStore.fetchShifts(), roleStore.fetchList()])
  await loadSchedules()
}

const { refresh, refreshing } = usePageRefresh(loadData)

watch(weekStart, () => { loadSchedules() })

const employeeOptions = computed(() => userStore.list.filter(u => u.status === 'active').map(u => ({ label: u.real_name, value: u.id })))
const shiftOptions = computed(() => attendanceStore.shifts.map(s => ({ label: `${s.name}（${s.start_time}-${s.end_time}）`, value: s.id })))

function shiftName(id: string) {
  const s = attendanceStore.shifts.find(s => s.id === id)
  return s ? s.name : '—'
}
function shiftColor(id: string): string {
  // 依据班次名称做一个简单的颜色映射，方便日历视图区分不同班次
  const palette = ['#2c5f8a', '#3a8a5f', '#a86c2c', '#7a4fa8', '#b03a5f', '#2c8aa8']
  const idx = attendanceStore.shifts.findIndex(s => s.id === id)
  return palette[idx % palette.length] ?? '#888'
}

// ── 日历网格数据：employeeId -> dateStr -> ScheduleRow[] ────────
const gridRows = computed(() => {
  // 仅显示本周有排班的员工 + 当前所有在职员工（方便直接点空格排班）
  return employeeOptions.value
})

function cellSchedules(userId: string, date: string): ScheduleRow[] {
  return attendanceStore.schedules.filter(s => s.user_id === userId && s.work_date === date)
}

// ── 选中日期（点击列头或空格单元格选中某一天）─────────────────
const selectedDate = ref<string | null>(null)

function selectDate(date: string) {
  selectedDate.value = selectedDate.value === date ? null : date
}

function isToday(date: string): boolean {
  return date === toDateStr(new Date())
}

// ── 单格编辑（新增/编辑排班 + 提醒） ─────────────────────────
const showEditModal = ref(false)
const editingId = ref<string | null>(null)
const editForm = ref({
  user_id: '',
  shift_id: '',
  work_date: '',
  task_type: null as string | null,
  task_target: '',
  remark: '',
})

const taskTypeOptions = [
  { label: '巡房', value: '巡房' },
  { label: '护理', value: '护理' },
  { label: '餐饮', value: '餐饮' },
  { label: '活动', value: '活动' },
  { label: '前台', value: '前台' },
]

// 提醒设置（内联）
const enableReminder = ref(false)
const reminderForm = ref({
  remind_at: '08:00',
  repeat_type: 'none' as 'none' | 'daily' | 'weekly' | 'monthly',
  repeat_days: [] as number[],
})
const existingReminder = ref<TaskReminderRow | null>(null)

const weekDayCheckOptions = [
  { label: '周日', value: 0 }, { label: '周一', value: 1 }, { label: '周二', value: 2 },
  { label: '周三', value: 3 }, { label: '周四', value: 4 }, { label: '周五', value: 5 }, { label: '周六', value: 6 },
]
const monthDayCheckOptions = Array.from({ length: 31 }, (_, i) => ({ label: `${i + 1}日`, value: i + 1 }))

function openCreateCell(userId: string, date: string) {
  editingId.value = null
  editForm.value = { user_id: userId, shift_id: '', work_date: date, task_type: null, task_target: '', remark: '' }
  enableReminder.value = false
  reminderForm.value = { remind_at: '08:00', repeat_type: 'none', repeat_days: [] }
  existingReminder.value = null
  showEditModal.value = true
}

// 从工具栏"添加排班"按钮触发（通过选中的日期）
function openCreateFromToolbar() {
  const date = selectedDate.value ?? toDateStr(new Date())
  editingId.value = null
  editForm.value = { user_id: '', shift_id: '', work_date: date, task_type: null, task_target: '', remark: '' }
  enableReminder.value = false
  reminderForm.value = { remind_at: '08:00', repeat_type: 'none', repeat_days: [] }
  existingReminder.value = null
  showEditModal.value = true
}

function openEditCell(row: ScheduleRow) {
  editingId.value = row.id
  editForm.value = {
    user_id: row.user_id,
    shift_id: row.shift_id,
    work_date: row.work_date,
    task_type: row.task_type,
    task_target: row.task_target ?? '',
    remark: row.remark ?? '',
  }
  const linked = reminderMap.value[row.id]
  if (linked) {
    existingReminder.value = linked
    enableReminder.value = true
    reminderForm.value = {
      remind_at: linked.remind_at,
      repeat_type: linked.repeat_type,
      repeat_days: linked.repeat_days ? JSON.parse(linked.repeat_days) : [],
    }
  } else {
    existingReminder.value = null
    enableReminder.value = false
    reminderForm.value = { remind_at: '08:00', repeat_type: 'none', repeat_days: [] }
  }
  showEditModal.value = true
}

async function saveCell() {
  if (!editForm.value.user_id || !editForm.value.shift_id) return message.error('请选择员工和班次')
  if (enableReminder.value) {
    if (reminderForm.value.repeat_type === 'weekly' && !reminderForm.value.repeat_days.length) {
      return message.error('每周重复请至少勾选一天')
    }
    if (reminderForm.value.repeat_type === 'monthly' && !reminderForm.value.repeat_days.length) {
      return message.error('每月重复请至少选择一个日期')
    }
  }

  const payload = {
    ...editForm.value,
    task_target: editForm.value.task_target || null,
  }

  let scheduleId = editingId.value
  if (editingId.value) {
    const res = await attendanceStore.updateSchedule(editingId.value, payload)
    if (!res.ok) return message.error(res.error ?? '更新失败')
  } else {
    const res = await attendanceStore.createSchedule(payload)
    if (!res.ok) return message.error(res.error ?? '排班失败')
    scheduleId = res.row.id
  }

  // 同步提醒
  if (scheduleId) await syncReminder(scheduleId)

  showEditModal.value = false
  message.success(editingId.value ? '排班已更新' : '排班成功')
  await loadSchedules()
}

async function syncReminder(scheduleId: string) {
  const title = editForm.value.task_type
    ? `${editForm.value.task_type}${editForm.value.task_target ? '：' + editForm.value.task_target : ''}`
    : `排班任务提醒（${shiftName(editForm.value.shift_id)}）`

  if (enableReminder.value) {
    const payload = {
      title,
      description: editForm.value.remark || null,
      remind_at: reminderForm.value.remind_at,
      remind_date: editForm.value.work_date,
      repeat_type: reminderForm.value.repeat_type,
      repeat_days: ['weekly', 'monthly'].includes(reminderForm.value.repeat_type)
        ? JSON.stringify(reminderForm.value.repeat_days)
        : null,
      creator_id: authStore.currentUser?.id ?? editForm.value.user_id,
      assignee_id: editForm.value.user_id,
      status: 'active' as const,
      schedule_id: scheduleId,
    }
    try {
      if (existingReminder.value) {
        await window.api.reminder.update(existingReminder.value.id, payload)
      } else {
        await window.api.reminder.create(payload)
      }
    } catch {
      message.warning('排班已保存，但提醒设置失败，请稍后到"任务提醒"页手动检查')
    }
  } else if (existingReminder.value) {
    // 关闭了提醒开关，取消原有提醒
    try { await window.api.reminder.cancel(existingReminder.value.id) } catch { /* 忽略 */ }
  }
}

function removeSchedule(row: ScheduleRow) {
  dialog.warning({
    title: '删除排班',
    content: reminderMap.value[row.id] ? '该排班已关联提醒，删除排班将同时取消该提醒。确定删除吗？' : '确定要删除此条排班记录吗？',
    positiveText: '确定', negativeText: '取消',
    onPositiveClick: async () => {
      const linked = reminderMap.value[row.id]
      if (linked) { try { await window.api.reminder.cancel(linked.id) } catch { /* 忽略 */ } }
      await attendanceStore.removeSchedule(row.id)
      await loadSchedules()
      message.success('已删除')
    }
  })
}

// ── 班次管理（完整 CRUD） ─────────────────────────────────────
const showShiftModal = ref(false)
const editingShiftId = ref<string | null>(null)
const shiftForm = ref({ name: '', start_time: '08:00', end_time: '17:00', remark: '' })
const showShiftAddForm = ref(false)

function openShiftModal() {
  editingShiftId.value = null
  shiftForm.value = { name: '', start_time: '08:00', end_time: '17:00', remark: '' }
  showShiftAddForm.value = false
  showShiftModal.value = true
}

function openEditShift(shift: ShiftRow) {
  editingShiftId.value = shift.id
  shiftForm.value = {
    name: shift.name,
    start_time: shift.start_time,
    end_time: shift.end_time,
    remark: shift.remark ?? '',
  }
  showShiftAddForm.value = true
}

function cancelEditShift() {
  editingShiftId.value = null
  shiftForm.value = { name: '', start_time: '08:00', end_time: '17:00', remark: '' }
  showShiftAddForm.value = false
}

async function saveShift() {
  if (!shiftForm.value.name.trim()) return message.error('请填写班次名称')
  if (!shiftForm.value.start_time || !shiftForm.value.end_time) return message.error('请选择上班和下班时间')
  if (shiftForm.value.start_time >= shiftForm.value.end_time) return message.error('下班时间必须晚于上班时间')
  try {
    if (editingShiftId.value) {
      await attendanceStore.updateShift(editingShiftId.value, {
        name: shiftForm.value.name.trim(),
        start_time: shiftForm.value.start_time,
        end_time: shiftForm.value.end_time,
        remark: shiftForm.value.remark || null,
      })
      message.success('上班时间已更新')
    } else {
      await attendanceStore.createShift({ ...shiftForm.value, name: shiftForm.value.name.trim() })
      message.success('班次已添加')
    }
    cancelEditShift()
    await attendanceStore.fetchShifts()
  } catch (error) {
    message.error(error instanceof Error ? error.message : '保存上班时间失败')
  }
}

async function deleteShift(id: string) {
  try {
    await attendanceStore.deleteShift(id)
    message.success('班次已删除')
  } catch (error) {
    message.error(error instanceof Error ? error.message : '删除班次失败')
  }
}

async function setDefaultShift(shift: ShiftRow) {
  try {
    await attendanceStore.setDefaultShift(shift.id)
    message.success(`已将「${shift.name}」设为默认班次`)
  } catch (error) {
    message.error(error instanceof Error ? error.message : '设置默认班次失败')
  }
}

// ── 员工快速新增 ─────────────────────────────────────────────
const showAddEmployeeModal = ref(false)
const addEmployeeSubmitting = ref(false)
const addEmployeeForm = ref({
  username: '',
  password: '',
  real_name: '',
  phone: '',
  position: '',
  role_id: '',
})

const roleOptions = computed(() => roleStore.list.map(r => ({ label: r.name, value: r.id })))

const positionOptions = [
  { label: '护士', value: '护士' },
  { label: '护理员', value: '护理员' },
  { label: '前台', value: '前台' },
  { label: '后勤', value: '后勤' },
  { label: '厨师', value: '厨师' },
  { label: '管理员', value: '管理员' },
]

function openAddEmployee() {
  addEmployeeForm.value = {
    username: '',
    password: '',
    real_name: '',
    phone: '',
    position: '',
    role_id: roleStore.list[0]?.id ?? '',
  }
  showAddEmployeeModal.value = true
}

async function saveAddEmployee() {
  const f = addEmployeeForm.value
  if (!f.real_name.trim()) return message.error('请填写员工姓名')
  if (!f.username.trim()) return message.error('请填写登录用户名')
  if (!f.password || f.password.length < 6) return message.error('初始密码至少6位')
  if (!f.role_id) return message.error('请选择角色')

  addEmployeeSubmitting.value = true
  try {
    const res = await userStore.create({
      username: f.username.trim(),
      password: f.password,
      real_name: f.real_name.trim(),
      phone: f.phone || null,
      role_id: f.role_id,
      status: 'active',
      must_change_pw: 0,
      position: f.position || null,
      department: null,
      remark: null,
    })
    if (!res.ok) return message.error(res.error ?? '添加失败')
    showAddEmployeeModal.value = false
    message.success(`员工「${f.real_name}」已添加，已自动出现在排班表中`)
    await userStore.fetchList()
  } finally {
    addEmployeeSubmitting.value = false
  }
}

// ── 批量排班 ─────────────────────────────────────
const showBatchModal = ref(false)
const batchForm = ref({
  user_id: '',
  shift_id: '',
  date_range: [Date.now(), Date.now() + 6 * 86400000] as [number, number],
  weekdays: [1, 2, 3, 4, 5] as number[], // 默认周一到周五
  task_type: null as string | null,
  task_target: '',
  remark: '',
})
const batchSubmitting = ref(false)

function openBatch() {
  batchForm.value = {
    user_id: '', shift_id: '',
    date_range: [weekStart.value.getTime(), weekStart.value.getTime() + 6 * 86400000],
    weekdays: [1, 2, 3, 4, 5],
    task_type: null, task_target: '', remark: '',
  }
  showBatchModal.value = true
}

async function saveBatch() {
  if (!batchForm.value.user_id || !batchForm.value.shift_id) return message.error('请选择员工和班次')
  if (!batchForm.value.weekdays.length) return message.error('请至少选择一个星期')

  const [start, end] = batchForm.value.date_range
  const dates: string[] = []
  const cur = new Date(start)
  const endDate = new Date(end)
  while (cur.getTime() <= endDate.getTime()) {
    if (batchForm.value.weekdays.includes(cur.getDay())) {
      dates.push(toDateStr(cur))
    }
    cur.setDate(cur.getDate() + 1)
  }
  if (!dates.length) return message.error('所选日期范围内没有匹配的星期')

  batchSubmitting.value = true
  let successCount = 0
  let failCount = 0
  try {
    for (const date of dates) {
      const res = await attendanceStore.createSchedule({
        user_id: batchForm.value.user_id,
        shift_id: batchForm.value.shift_id,
        work_date: date,
        task_type: batchForm.value.task_type,
        task_target: batchForm.value.task_target || null,
        remark: batchForm.value.remark || null,
      })
      if (res.ok) successCount++
      else failCount++
    }
  } finally {
    batchSubmitting.value = false
  }

  showBatchModal.value = false
  await loadSchedules()
  if (failCount) {
    message.warning(`批量排班完成：成功 ${successCount} 条，失败 ${failCount} 条（可能与已有排班冲突）`)
  } else {
    message.success(`批量排班成功，共创建 ${successCount} 条排班记录`)
  }
}
</script>

<template>
  <BasePage title="排班管理">
    <NCard class="mb-4">
      <NSpace align="center" justify="space-between">
        <NSpace align="center">
          <NButton size="small" @click="prevWeek">← 上一周</NButton>
          <NButton size="small" @click="thisWeek">本周</NButton>
          <NButton size="small" @click="nextWeek">下一周 →</NButton>
          <span class="text-sm text-gray-500 ml-2">{{ weekRangeText }}</span>
        </NSpace>
        <NSpace align="center">
          <!-- 选中日期后显示"为 xx/xx 添加排班"按钮 -->
          <span v-if="selectedDate" class="text-sm text-gray-500">
            已选：<b>{{ selectedDate }}</b>
          </span>
          <NButton
            type="primary"
            @click="openCreateFromToolbar"
          >
            {{ selectedDate ? `为 ${selectedDate.slice(5)} 添加排班` : '+ 添加排班' }}
          </NButton>
          <NButton @click="openShiftModal">上班时间设置</NButton>
          <NButton @click="openBatch">批量排班</NButton>
          <NButton @click="openAddEmployee">+ 添加员工</NButton>
          <NButton :loading="refreshing" @click="refresh">刷新</NButton>
        </NSpace>
      </NSpace>
    </NCard>

    <NCard :bordered="true">
      <div v-if="!gridRows.length" class="py-10">
        <NEmpty description="暂无在职员工，请先添加员工">
          <template #extra>
            <NButton type="primary" @click="openAddEmployee">+ 添加员工</NButton>
          </template>
        </NEmpty>
      </div>
      <div v-else class="schedule-grid-wrapper" style="overflow-x: auto">
        <table class="schedule-grid">
          <thead>
            <tr>
              <th class="employee-col">员工</th>
              <th
                v-for="(date, i) in weekDates"
                :key="date"
                class="day-col"
                :class="{ 'day-col--selected': selectedDate === date, 'day-col--today': isToday(date) }"
                style="cursor: pointer"
                @click="selectDate(date)"
              >
                <div>{{ weekDayLabels[i] }}</div>
                <div class="text-xs" :class="isToday(date) ? 'text-blue-500 font-bold' : 'text-gray-400'">
                  {{ date.slice(5) }}
                  <span v-if="isToday(date)">&nbsp;今天</span>
                </div>
                <div v-if="selectedDate === date" class="text-xs text-primary mt-1">▼ 已选</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="emp in gridRows" :key="emp.value">
              <td class="employee-col font-medium">{{ emp.label }}</td>
              <td
                v-for="date in weekDates"
                :key="date"
                class="day-cell"
                :class="{
                  'day-cell--selected-col': selectedDate === date,
                  'day-cell--clickable': cellSchedules(emp.value, date).length === 0,
                }"
                @click="cellSchedules(emp.value, date).length === 0 ? (selectDate(date), openCreateCell(emp.value, date)) : undefined"
              >
                <div v-if="cellSchedules(emp.value, date).length === 0" class="empty-cell">
                  <span class="add-hint">+</span>
                </div>
                <div v-else class="cell-content">
                  <div
                    v-for="sc in cellSchedules(emp.value, date)"
                    :key="sc.id"
                    class="shift-tag"
                    :style="{ background: shiftColor(sc.shift_id) }"
                    @click.stop="openEditCell(sc)"
                  >
                    <span>{{ shiftName(sc.shift_id) }}</span>
                    <NTooltip v-if="reminderMap[sc.id]">
                      <template #trigger>
                        <i class="i-ion:alarm text-xs ml-1" />
                      </template>
                      已设置提醒：{{ reminderMap[sc.id].remind_at }}
                    </NTooltip>
                    <span v-if="sc.task_type" class="text-xs opacity-80 ml-1">{{ sc.task_type }}</span>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </NCard>

    <!-- 单格编辑弹窗：新增/编辑排班 + 提醒设置 -->
    <NModal
      v-model:show="showEditModal"
      :title="editingId ? '编辑排班' : '添加排班'"
      preset="card"
      style="width: 500px"
    >
      <!-- 日期头部：显著展示当前操作的日期 -->
      <div class="date-banner mb-4">
        <i class="i-ion:calendar-outline mr-2" />
        <span class="font-bold text-base">
          {{ editForm.work_date || '请选择日期' }}
        </span>
        <span v-if="editForm.work_date" class="text-sm text-gray-400 ml-2">
          {{ weekDayLabels[new Date(editForm.work_date + 'T00:00:00').getDay() === 0 ? 6 : new Date(editForm.work_date + 'T00:00:00').getDay() - 1] }}
        </span>
        <span v-if="isToday(editForm.work_date)" class="ml-2 text-blue-500 text-sm font-medium">今天</span>
      </div>

      <NForm :model="editForm" label-placement="left" label-width="80">
        <NFormItem label="日期" required>
          <NDatePicker
            v-model:formatted-value="editForm.work_date"
            value-format="yyyy-MM-dd"
            type="date"
            style="width: 100%"
            :disabled="!!editingId"
          />
        </NFormItem>
        <NFormItem label="员工" required>
          <NSelect v-model:value="editForm.user_id" :options="employeeOptions" filterable :disabled="!!editingId" />
        </NFormItem>
        <NFormItem label="班次" required>
          <NSelect v-model:value="editForm.shift_id" :options="shiftOptions" />
        </NFormItem>
        <NFormItem label="任务类型">
          <NSelect v-model:value="editForm.task_type" :options="taskTypeOptions" clearable placeholder="可选" />
        </NFormItem>
        <NFormItem label="负责区域">
          <NInput v-model:value="editForm.task_target" placeholder="如：3楼A区、1-10号床，可选" />
        </NFormItem>
        <NFormItem label="备注">
          <NInput v-model:value="editForm.remark" />
        </NFormItem>

        <!-- 到点提醒区块 -->
        <div class="reminder-section">
          <div class="reminder-section__header" @click="enableReminder = !enableReminder">
            <NSpace align="center">
              <i class="i-ion:alarm-outline text-base" />
              <span class="font-medium">到点提醒</span>
              <NSwitch v-model:value="enableReminder" @click.stop />
              <span v-if="existingReminder && enableReminder" class="text-xs text-green-500">已设置</span>
            </NSpace>
          </div>

          <template v-if="enableReminder">
            <div class="reminder-section__body">
              <NFormItem label="提醒时间" required>
                <NTimePicker
                  v-model:formatted-value="reminderForm.remind_at"
                  value-format="HH:mm"
                  format="HH:mm"
                  style="width: 100%"
                />
              </NFormItem>
              <NFormItem label="重复规则">
                <NSelect
                  v-model:value="reminderForm.repeat_type"
                  :options="[
                    { label: '仅当天（不重复）', value: 'none' },
                    { label: '每天', value: 'daily' },
                    { label: '每周', value: 'weekly' },
                    { label: '每月', value: 'monthly' },
                  ]"
                />
              </NFormItem>
              <NFormItem v-if="reminderForm.repeat_type === 'weekly'" label="重复星期">
                <NCheckboxGroup v-model:value="reminderForm.repeat_days">
                  <NSpace wrap>
                    <NCheckbox v-for="opt in weekDayCheckOptions" :key="opt.value" :value="opt.value" :label="opt.label" />
                  </NSpace>
                </NCheckboxGroup>
              </NFormItem>
              <NFormItem v-if="reminderForm.repeat_type === 'monthly'" label="重复日期">
                <NCheckboxGroup v-model:value="reminderForm.repeat_days">
                  <NSpace wrap style="max-width: 340px">
                    <NCheckbox v-for="opt in monthDayCheckOptions" :key="opt.value" :value="opt.value" :label="opt.label" />
                  </NSpace>
                </NCheckboxGroup>
              </NFormItem>
            </div>
          </template>
        </div>
      </NForm>
      <template #footer>
        <NSpace justify="space-between">
          <NPopconfirm v-if="editingId" @positive-click="removeSchedule({ id: editingId } as ScheduleRow); showEditModal = false">
            <template #trigger>
              <NButton type="error">删除排班</NButton>
            </template>
            确认删除该排班记录？{{ existingReminder ? '关联提醒也会被取消。' : '' }}
          </NPopconfirm>
          <span v-else />
          <NSpace>
            <NButton @click="showEditModal = false">取消</NButton>
            <NButton type="primary" @click="saveCell">
              {{ editingId ? '保存修改' : '确认添加' }}
            </NButton>
          </NSpace>
        </NSpace>
      </template>
    </NModal>

    <!-- 上班时间设置弹窗（班次 CRUD + 默认工作时间） -->
    <NModal v-model:show="showShiftModal" title="上班时间设置" preset="card" style="width:600px">
      <!-- 班次列表 -->
      <div v-if="attendanceStore.shifts.length === 0" class="py-4 text-center text-gray-400">
        暂无班次，请在下方添加
      </div>
      <div v-else class="shift-list mb-3">
        <div
          v-for="shift in attendanceStore.shifts"
          :key="shift.id"
          class="shift-list-row"
        >
          <!-- 非编辑态：显示信息 -->
          <template v-if="editingShiftId !== shift.id">
            <NTag type="info" :bordered="false" style="font-size:13px">{{ shift.name }}</NTag>
            <NTag v-if="shift.is_default" type="success" :bordered="false" size="small">默认</NTag>
            <span class="text-sm text-gray-500 ml-2">{{ shift.start_time }} — {{ shift.end_time }}</span>
            <span v-if="shift.remark" class="text-xs text-gray-400 ml-2">{{ shift.remark }}</span>
            <NSpace class="ml-auto" size="small">
              <NButton v-if="!shift.is_default" size="tiny" @click="setDefaultShift(shift)">设为默认</NButton>
              <NButton size="tiny" @click="openEditShift(shift)">编辑</NButton>
              <NPopconfirm @positive-click="deleteShift(shift.id)">
                <template #trigger>
                  <NButton size="tiny" type="error" :disabled="attendanceStore.shifts.length <= 1">删除</NButton>
                </template>
                删除班次「{{ shift.name }}」？已使用该班次的历史排班记录将保留。
              </NPopconfirm>
            </NSpace>
          </template>
          <!-- 编辑态：内联表单 -->
          <template v-else>
            <div class="shift-edit-inline">
              <NInput v-model:value="shiftForm.name" placeholder="班次名称" size="small" style="width:100px" />
              <NTimePicker v-model:formatted-value="shiftForm.start_time" value-format="HH:mm" format="HH:mm" size="small" style="width:110px" />
              <NTimePicker v-model:formatted-value="shiftForm.end_time" value-format="HH:mm" format="HH:mm" size="small" style="width:110px" />
              <NInput v-model:value="shiftForm.remark" placeholder="备注" size="small" style="width:100px" />
              <NButton size="small" type="primary" @click="saveShift">保存</NButton>
              <NButton size="small" @click="cancelEditShift">取消</NButton>
            </div>
          </template>
        </div>
      </div>

      <NDivider style="margin: 8px 0" />

      <!-- 新增班次区域 -->
      <div v-if="!editingShiftId">
        <div
          class="text-sm font-medium mb-2 cursor-pointer flex items-center gap-1"
          @click="showShiftAddForm = !showShiftAddForm"
        >
          <span>{{ showShiftAddForm ? '▾' : '▸' }}</span> 新增班次
        </div>
        <template v-if="showShiftAddForm">
          <NForm :model="shiftForm" label-placement="left" label-width="80" size="small">
            <NFormItem label="班次名称" required>
              <NInput v-model:value="shiftForm.name" placeholder="如：白班、夜班" />
            </NFormItem>
            <NFormItem label="上班时间" required>
              <NTimePicker v-model:formatted-value="shiftForm.start_time" value-format="HH:mm" format="HH:mm" style="width:100%" />
            </NFormItem>
            <NFormItem label="下班时间" required>
              <NTimePicker v-model:formatted-value="shiftForm.end_time" value-format="HH:mm" format="HH:mm" style="width:100%" />
            </NFormItem>
            <NFormItem label="备注">
              <NInput v-model:value="shiftForm.remark" />
            </NFormItem>
          </NForm>
          <NSpace justify="end">
            <NButton @click="cancelEditShift">取消</NButton>
            <NButton type="primary" @click="saveShift">添加班次</NButton>
          </NSpace>
        </template>
        <NButton v-else size="small" dashed @click="showShiftAddForm = true" style="width:100%">+ 新增班次</NButton>
      </div>

      <template #footer>
        <NSpace justify="end">
          <NButton @click="showShiftModal = false">关闭</NButton>
        </NSpace>
      </template>
    </NModal>

    <!-- 员工快速新增弹窗 -->
    <NModal v-model:show="showAddEmployeeModal" title="快速添加员工" preset="card" style="width:460px">
      <NForm :model="addEmployeeForm" label-placement="left" label-width="90">
        <NFormItem label="员工姓名" required>
          <NInput v-model:value="addEmployeeForm.real_name" placeholder="真实姓名" />
        </NFormItem>
        <NFormItem label="登录用户名" required>
          <NInput v-model:value="addEmployeeForm.username" placeholder="用于登录的账号" />
        </NFormItem>
        <NFormItem label="初始密码" required>
          <NInput
            v-model:value="addEmployeeForm.password"
            type="password"
            show-password-on="click"
            placeholder="至少6位"
          />
        </NFormItem>
        <NFormItem label="手机号">
          <NInput v-model:value="addEmployeeForm.phone" placeholder="可选" />
        </NFormItem>
        <NFormItem label="职位">
          <NSelect
            v-model:value="addEmployeeForm.position"
            :options="positionOptions"
            filterable
            tag
            placeholder="选择或输入职位（可选）"
            clearable
          />
        </NFormItem>
        <NFormItem label="角色" required>
          <NSelect v-model:value="addEmployeeForm.role_id" :options="roleOptions" placeholder="请选择角色" />
        </NFormItem>
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showAddEmployeeModal = false">取消</NButton>
          <NButton type="primary" :loading="addEmployeeSubmitting" @click="saveAddEmployee">确认添加</NButton>
        </NSpace>
      </template>
    </NModal>

    <!-- 批量排班弹窗 -->
    <NModal v-model:show="showBatchModal" title="批量排班" preset="card" style="width: 480px">
      <NForm :model="batchForm" label-placement="left" label-width="90">
        <NFormItem label="员工" required>
          <NSelect v-model:value="batchForm.user_id" :options="employeeOptions" filterable />
        </NFormItem>
        <NFormItem label="班次" required>
          <NSelect v-model:value="batchForm.shift_id" :options="shiftOptions" />
        </NFormItem>
        <NFormItem label="日期范围" required>
          <NDatePicker v-model:value="batchForm.date_range" type="daterange" style="width: 100%" />
        </NFormItem>
        <NFormItem label="重复星期" required>
          <NCheckboxGroup v-model:value="batchForm.weekdays">
            <NSpace wrap>
              <NCheckbox v-for="opt in weekDayCheckOptions" :key="opt.value" :value="opt.value" :label="opt.label" />
            </NSpace>
          </NCheckboxGroup>
        </NFormItem>
        <NFormItem label="任务类型">
          <NSelect v-model:value="batchForm.task_type" :options="taskTypeOptions" clearable placeholder="可选" />
        </NFormItem>
        <NFormItem label="负责区域">
          <NInput v-model:value="batchForm.task_target" placeholder="可选" />
        </NFormItem>
        <NFormItem label="备注">
          <NInput v-model:value="batchForm.remark" />
        </NFormItem>
      </NForm>
      <div class="text-xs text-gray-400 mb-2">
        将在所选日期范围内，匹配勾选星期的每一天创建一条排班记录（与已有排班冲突的日期会自动跳过）。
      </div>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showBatchModal = false">取消</NButton>
          <NButton type="primary" :loading="batchSubmitting" @click="saveBatch">批量创建</NButton>
        </NSpace>
      </template>
    </NModal>
  </BasePage>
</template>

<style scoped>
.schedule-grid {
  border-collapse: collapse;
  width: 100%;
  min-width: 900px;
}
.schedule-grid th,
.schedule-grid td {
  border: 1px solid var(--n-border-color, #e5e7eb);
  padding: 6px 8px;
  vertical-align: top;
}
.employee-col {
  width: 110px;
  min-width: 110px;
  text-align: left;
  background: rgba(128, 128, 128, 0.04);
}
.day-col {
  width: 130px;
  min-width: 130px;
  text-align: center;
}
.day-cell {
  height: 64px;
  transition: background 0.15s;
}
.day-cell--clickable {
  cursor: pointer;
}
.day-cell--clickable:hover {
  background: rgba(44, 95, 138, 0.06);
}
.day-cell--selected-col {
  background: rgba(44, 95, 138, 0.05);
}
.empty-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: transparent;
}
.day-cell--clickable:hover .add-hint {
  color: #2c5f8a;
}
.cell-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.shift-tag {
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 12px;
  padding: 3px 6px;
  border-radius: 4px;
  cursor: pointer;
  line-height: 1.4;
}
.shift-tag:hover {
  opacity: 0.85;
}

/* 班次管理弹窗 - 班次列表行 */
.shift-list {
  max-height: 280px;
  overflow-y: auto;
  border: 1px solid var(--n-border-color, #e5e7eb);
  border-radius: 6px;
}
.shift-list-row {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid var(--n-border-color, #e5e7eb);
  gap: 6px;
}
.shift-list-row:last-child { border-bottom: none; }
.shift-edit-inline {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

/* 选中的日期列头 */
.day-col--today {
  background: rgba(64, 158, 255, 0.06);
}
.day-col--selected {
  background: rgba(44, 95, 138, 0.12) !important;
  box-shadow: inset 0 -2px 0 #2c5f8a;
}

/* 弹窗内日期横幅 */
.date-banner {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  border-radius: 6px;
  background: rgba(44, 95, 138, 0.08);
}

/* 到点提醒区块 */
.reminder-section {
  margin-top: 8px;
  border: 1px solid var(--n-border-color, #e5e7eb);
  border-radius: 6px;
  padding: 10px 12px;
}
.reminder-section__header {
  cursor: pointer;
}
.reminder-section__body {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed var(--n-border-color, #e5e7eb);
}
</style>
