<script setup lang="ts">
/**
 * TaskReminderView - 任务提醒管理
 * 功能：创建/编辑提醒（类闹钟，支持每日/每周/每月重复）、分配给其他用户（需 reminder:assign 权限）、
 *       标记完成/取消、查看"我分配的任务"
 */
defineOptions({ name: 'TaskReminder' })

import {
  NCard, NButton, NSpace, NTag, NModal, NForm, NFormItem,
  NInput, NSelect, NTimePicker, NDatePicker, NCheckboxGroup, NCheckbox,
  NTabs, NTabPane, NPopconfirm, NTooltip, NBadge, NCalendar,
  useMessage,
} from 'naive-ui'
import { BasePage, BaseTable } from '@yanglao/ui'
import { useTaskReminderStore } from '../../stores/task-reminder.store'
import { useAuthStore } from '../../stores/auth.store'
import { useUserStore } from '../../stores/user.store'
import { ref, computed, h } from 'vue'
import type { TaskReminderRow } from '@yanglao/db'
import { usePageRefresh } from '../../composables/usePageRefresh'

const message  = useMessage()
const auth     = useAuthStore()
const store    = useTaskReminderStore()
const users    = useUserStore()

const canAssign = computed(() => auth.canUseButton('reminder:assign'))
const myId      = computed(() => auth.currentUser?.id ?? '')
const activeTab = ref<'mine' | 'created'>('mine')

async function loadData() {
  if (!myId.value) return
  await Promise.all([
    store.fetchMine(myId.value, true),
    store.fetchCreated(myId.value),
    users.fetchList(),
  ])
}

const { refresh, refreshing } = usePageRefresh(loadData)

// ── 用户下拉选项（用于分配负责人） ──────────────────────────
const userOptions = computed(() =>
  users.list
    .filter(u => u.status === 'active')
    .map(u => ({ label: `${u.real_name}${u.position ? ` · ${u.position}` : ''}`, value: u.id }))
)

function getUserName(userId: string): string {
  return users.list.find(u => u.id === userId)?.real_name ?? userId
}

// ── 重复规则选项 ─────────────────────────────────────────────
const repeatTypeOptions = [
  { label: '不重复', value: 'none' },
  { label: '每天', value: 'daily' },
  { label: '每周', value: 'weekly' },
  { label: '每月', value: 'monthly' },
]
const weekDayOptions = [
  { label: '周日', value: 0 },
  { label: '周一', value: 1 },
  { label: '周二', value: 2 },
  { label: '周三', value: 3 },
  { label: '周四', value: 4 },
  { label: '周五', value: 5 },
  { label: '周六', value: 6 },
]
const monthDayOptions = Array.from({ length: 31 }, (_, i) => ({ label: `${i + 1}日`, value: i + 1 }))

// ── 表单 ────────────────────────────────────────────────────
const showModal = ref(false)
const editingId = ref<string | null>(null)
const submitting = ref(false)

const defaultForm = () => ({
  title: '',
  description: '',
  remind_at: '09:00',
  remind_date: new Date().toISOString().slice(0, 10),
  repeat_type: 'none' as 'none' | 'daily' | 'weekly' | 'monthly',
  repeat_days: [] as number[],
  assignee_id: myId.value,
})
const form = ref(defaultForm())

function openCreate(presetDate?: string) {
  editingId.value = null
  form.value = defaultForm()
  form.value.assignee_id = myId.value
  if (presetDate) form.value.remind_date = presetDate
  showModal.value = true
}

function openEdit(row: TaskReminderRow) {
  editingId.value = row.id
  form.value = {
    title: row.title,
    description: row.description ?? '',
    remind_at: row.remind_at,
    remind_date: row.remind_date,
    repeat_type: row.repeat_type,
    repeat_days: row.repeat_days ? JSON.parse(row.repeat_days) : [],
    assignee_id: row.assignee_id,
  }
  showModal.value = true
}

async function handleSave() {
  if (!form.value.title.trim()) return message.error('请填写任务标题')
  if (!form.value.remind_at) return message.error('请选择提醒时间')
  if (!form.value.remind_date) return message.error('请选择日期')
  if (form.value.repeat_type === 'weekly' && !form.value.repeat_days.length) {
    return message.error('每周重复请至少勾选一天')
  }
  if (form.value.repeat_type === 'monthly' && !form.value.repeat_days.length) {
    return message.error('每月重复请至少选择一个日期')
  }

  const payload = {
    title: form.value.title.trim(),
    description: form.value.description.trim() || null,
    remind_at: form.value.remind_at,
    remind_date: form.value.remind_date,
    repeat_type: form.value.repeat_type,
    repeat_days: ['weekly', 'monthly'].includes(form.value.repeat_type)
      ? JSON.stringify(form.value.repeat_days)
      : null,
    creator_id: myId.value,
    assignee_id: form.value.assignee_id,
    status: 'active' as const,
  }

  submitting.value = true
  try {
    if (editingId.value) {
      await store.update(editingId.value, payload)
      // 刷新列表以获取最新数据
      await store.fetchMine(myId.value, true)
      await store.fetchCreated(myId.value)
      message.success('提醒已更新')
    } else {
      await store.create(payload)
      await store.fetchMine(myId.value, true)
      await store.fetchCreated(myId.value)
      message.success('提醒已创建')
    }
    showModal.value = false
  } finally {
    submitting.value = false
  }
}

async function handleDone(id: string) {
  await store.markDone(id)
  message.success('已标记完成')
}

async function handleCancel(id: string) {
  await store.cancel(id)
  message.success('已取消提醒')
}

async function handleDelete(id: string) {
  await store.remove(id)
  message.success('已删除')
}

// ── 表格列 ──────────────────────────────────────────────────
function repeatLabel(row: TaskReminderRow): string {
  switch (row.repeat_type) {
    case 'none': return '仅一次'
    case 'daily': return '每天'
    case 'weekly': {
      const names = ['周日','周一','周二','周三','周四','周五','周六']
      const days: number[] = row.repeat_days ? JSON.parse(row.repeat_days) : []
      return `每周 ${days.map(d => names[d]).join('、')}`
    }
    case 'monthly': {
      const days: number[] = row.repeat_days ? JSON.parse(row.repeat_days) : []
      return `每月 ${days.join('、')} 号`
    }
    default: return row.repeat_type
  }
}

function statusTag(row: TaskReminderRow) {
  const map: Record<string, { type: 'default'|'success'|'warning'|'error'|'info'; label: string }> = {
    active: { type: 'info', label: '进行中' },
    done:   { type: 'success', label: '已完成' },
    cancelled: { type: 'default', label: '已取消' },
  }
  const cfg = map[row.status] ?? { type: 'default', label: row.status }
  return h(NTag, { type: cfg.type, size: 'small' }, () => cfg.label)
}

const myColumns = computed(() => [
  { title: '任务标题', key: 'title', width: 180, ellipsis: { tooltip: true } },
  { title: '提醒时间', key: 'remind_at', width: 90,
    render: (r: TaskReminderRow) => `${r.remind_date} ${r.remind_at}` },
  { title: '重复规则', key: 'repeat_type', width: 160, render: (r: TaskReminderRow) => repeatLabel(r) },
  { title: '创建人', key: 'creator_id', width: 90, render: (r: TaskReminderRow) => getUserName(r.creator_id) },
  { title: '状态', key: 'status', width: 80, render: statusTag },
  { title: '备注', key: 'description', width: 150, ellipsis: { tooltip: true }, render: (r: TaskReminderRow) => r.description || '—' },
  {
    title: '操作', key: 'actions', width: 220,
    render: (r: TaskReminderRow) => h(NSpace, { size: 4 }, { default: () => [
      h(NButton, { size: 'small', onClick: () => openEdit(r), disabled: r.status !== 'active' }, '编辑'),
      r.status === 'active' ? h(NPopconfirm, {
        onPositiveClick: () => handleDone(r.id),
      }, {
        trigger: () => h(NButton, { size: 'small', type: 'success' }, '完成'),
        default: () => '标记为已完成？',
      }) : null,
      r.status === 'active' ? h(NPopconfirm, {
        onPositiveClick: () => handleCancel(r.id),
      }, {
        trigger: () => h(NButton, { size: 'small', type: 'warning' }, '取消'),
        default: () => '取消该提醒？',
      }) : null,
      h(NPopconfirm, {
        onPositiveClick: () => handleDelete(r.id),
      }, {
        trigger: () => h(NButton, { size: 'small', type: 'error' }, '删除'),
        default: () => '确认删除？',
      }),
    ].filter(Boolean) })
  },
])

const createdColumns = computed(() => [
  { title: '任务标题', key: 'title', width: 180, ellipsis: { tooltip: true } },
  { title: '负责人', key: 'assignee_id', width: 100, render: (r: TaskReminderRow) => getUserName(r.assignee_id) },
  { title: '提醒时间', key: 'remind_at', width: 160,
    render: (r: TaskReminderRow) => `${r.remind_date} ${r.remind_at}` },
  { title: '重复规则', key: 'repeat_type', width: 160, render: (r: TaskReminderRow) => repeatLabel(r) },
  { title: '状态', key: 'status', width: 80, render: statusTag },
  {
    title: '操作', key: 'actions', width: 100,
    render: (r: TaskReminderRow) => h(NPopconfirm, {
      onPositiveClick: () => handleDelete(r.id),
    }, {
      trigger: () => h(NButton, { size: 'small', type: 'error' }, '删除'),
      default: () => '确认删除该分配的任务？',
    })
  },
])

const myActiveCount = computed(() => store.myList.filter(r => r.status === 'active').length)

// ── 日历（月视图）：显示当前用户可见的全部提醒，点击某天直接新建提醒 ──────
/** 我的提醒 + 我分配的任务，去重合并，仅统计进行中的提醒 */
const calendarReminders = computed<TaskReminderRow[]>(() => {
  const map = new Map<string, TaskReminderRow>()
  for (const r of store.myList) map.set(r.id, r)
  for (const r of store.createdList) map.set(r.id, r)
  return Array.from(map.values()).filter(r => r.status === 'active')
})

function padZero(n: number): string {
  return String(n).padStart(2, '0')
}
function toDateKey(year: number, month: number, date: number): string {
  return `${year}-${padZero(month)}-${padZero(date)}`
}

/** 判断某条提醒是否会在指定日期（yyyy-MM-dd）触发一次 */
function occursOnDate(row: TaskReminderRow, dateStr: string): boolean {
  if (dateStr < row.remind_date) return false
  switch (row.repeat_type) {
    case 'none':
      return dateStr === row.remind_date
    case 'daily':
      return true
    case 'weekly': {
      const days: number[] = row.repeat_days ? JSON.parse(row.repeat_days) : []
      const dow = new Date(`${dateStr}T00:00:00`).getDay()
      return days.includes(dow)
    }
    case 'monthly': {
      const days: number[] = row.repeat_days ? JSON.parse(row.repeat_days) : []
      const dom = new Date(`${dateStr}T00:00:00`).getDate()
      return days.includes(dom)
    }
    default:
      return false
  }
}

/** 某天的提醒数量，用于日历格子下方的角标提示 */
function reminderCountOnDate(year: number, month: number, date: number): number {
  const dateStr = toDateKey(year, month, date)
  let count = 0
  for (const r of calendarReminders.value) {
    if (occursOnDate(r, dateStr)) count++
  }
  return count
}

/** 点击日历上的某一天：直接打开新建提醒弹窗，日期已预填 */
function onCalendarSelect(_value: number, time: { year: number; month: number; date: number }) {
  openCreate(toDateKey(time.year, time.month, time.date))
}
</script>

<template>
  <BasePage title="任务提醒" class="page-reminder">
    <!-- ① 日历区域（点击某天直接新建提醒） -->
    <NCard class="calendar-card mb-4" :bordered="true">
      <template #header>
        <span class="text-sm text-gray-500">点击日期可快速新建提醒，有提醒的日期下方显示数量角标</span>
      </template>
      <template #header-extra>
        <NSpace>
          <NButton :loading="refreshing" size="small" @click="refresh">刷新</NButton>
          <NButton type="primary" size="small" @click="openCreate()">+ 新建提醒</NButton>
        </NSpace>
      </template>
      <NCalendar @update:value="onCalendarSelect">
        <template #default="{ year, month, date }">
          <div class="cal-cell-extra">
            <template v-if="reminderCountOnDate(year, month, date) > 0">
              <span class="cal-dot-badge">{{ reminderCountOnDate(year, month, date) }}</span>
            </template>
          </div>
        </template>
      </NCalendar>
    </NCard>

    <!-- ② 列表区域（填满页面剩余高度） -->
    <NCard class="list-card" :bordered="true" content-style="display:flex;flex-direction:column;padding:0;height:100%">
      <NTabs
        v-model:value="activeTab"
        type="line"
        animated
        style="height:100%;display:flex;flex-direction:column"
        pane-wrapper-style="flex:1;overflow:hidden"
        pane-style="height:100%"
      >
        <!-- 我的提醒 -->
        <NTabPane name="mine" style="height:100%;display:flex;flex-direction:column">
          <template #tab>
            <NBadge :value="myActiveCount" :max="99" :show="myActiveCount > 0" type="info">
              我的提醒
            </NBadge>
          </template>
          <div style="flex:1;min-height:0;padding:12px 16px">
            <BaseTable
              flex-height
              style="height:100%"
              :columns="myColumns"
              :data="store.myList"
              :row-key="(row: TaskReminderRow) => row.id"
            />
          </div>
        </NTabPane>

        <!-- 我分配的任务（有 reminder:assign 权限时才显示此 tab） -->
        <NTabPane v-if="canAssign" name="created" style="height:100%;display:flex;flex-direction:column">
          <template #tab>我分配的任务</template>
          <div class="text-sm text-gray-400 px-4 pt-3 pb-1">这里显示您分配给其他人的任务提醒，对方在自己设备登录后会收到闹钟提醒。</div>
          <div style="flex:1;min-height:0;padding:0 16px 12px">
            <BaseTable
              flex-height
              style="height:100%"
              :columns="createdColumns"
              :data="store.createdList.filter(r => r.assignee_id !== myId)"
              :row-key="(row: TaskReminderRow) => row.id"
            />
          </div>
        </NTabPane>
      </NTabs>
    </NCard>

    <!-- 新建/编辑提醒弹窗 -->
    <NModal
      v-model:show="showModal"
      :title="editingId ? '编辑任务提醒' : '新建任务提醒'"
      preset="card"
      style="width: 520px"
    >
      <NForm :model="form" label-placement="left" label-width="80">
        <NFormItem label="任务标题" required>
          <NInput v-model:value="form.title" placeholder="请输入任务标题，如：巡查3号楼" maxlength="60" show-count />
        </NFormItem>

        <NFormItem label="备注说明">
          <NInput
            v-model:value="form.description"
            type="textarea"
            :rows="2"
            placeholder="可填写任务详情、注意事项等（选填）"
          />
        </NFormItem>

        <NFormItem label="提醒日期" required>
          <NDatePicker
            v-model:formatted-value="form.remind_date"
            value-format="yyyy-MM-dd"
            type="date"
            style="width: 100%"
          />
        </NFormItem>

        <NFormItem label="提醒时间" required>
          <NTimePicker
            v-model:formatted-value="form.remind_at"
            value-format="HH:mm"
            format="HH:mm"
            style="width: 100%"
          />
        </NFormItem>

        <NFormItem label="重复规则">
          <NSelect v-model:value="form.repeat_type" :options="repeatTypeOptions" />
        </NFormItem>

        <!-- 每周：选星期 -->
        <NFormItem v-if="form.repeat_type === 'weekly'" label="重复星期">
          <NCheckboxGroup v-model:value="form.repeat_days">
            <NSpace wrap>
              <NCheckbox
                v-for="opt in weekDayOptions"
                :key="opt.value"
                :value="opt.value"
                :label="opt.label"
              />
            </NSpace>
          </NCheckboxGroup>
        </NFormItem>

        <!-- 每月：选日期 -->
        <NFormItem v-if="form.repeat_type === 'monthly'" label="重复日期">
          <NCheckboxGroup v-model:value="form.repeat_days">
            <NSpace wrap>
              <NCheckbox
                v-for="opt in monthDayOptions"
                :key="opt.value"
                :value="opt.value"
                :label="opt.label"
              />
            </NSpace>
          </NCheckboxGroup>
        </NFormItem>

        <!-- 分配负责人（仅有 reminder:assign 权限时可选他人） -->
        <NFormItem label="负责人">
          <NTooltip v-if="!canAssign" :disabled="canAssign">
            <template #trigger>
              <NSelect
                v-model:value="form.assignee_id"
                :options="userOptions"
                :disabled="!canAssign"
                filterable
              />
            </template>
            您没有分配任务给他人的权限
          </NTooltip>
          <NSelect
            v-else
            v-model:value="form.assignee_id"
            :options="userOptions"
            filterable
            placeholder="选择负责人（默认为自己）"
          />
        </NFormItem>
      </NForm>

      <template #footer>
        <NSpace justify="end">
          <NButton @click="showModal = false">取消</NButton>
          <NButton type="primary" :loading="submitting" @click="handleSave">
            {{ editingId ? '保存修改' : '创建提醒' }}
          </NButton>
        </NSpace>
      </template>
    </NModal>
  </BasePage>
</template>

<style scoped>
/* 外层页面：flex 列方向，充满 NLayoutContent 给的高度 */
:deep(.page-reminder.page-container) {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

/* 日历卡片：固定大小，不拉伸 */
.calendar-card {
  flex-shrink: 0;
}

/* 列表卡片：占满剩余高度 */
.list-card {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
:deep(.list-card > .n-card__content) {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

/* 日历格子下方的提醒数量小圆点 */
.cal-cell-extra {
  min-height: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.cal-dot-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 8px;
  background-color: var(--n-color-primary, #18a058);
  color: #fff;
  font-size: 10px;
  line-height: 1;
}
</style>
