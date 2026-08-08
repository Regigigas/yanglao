<script setup lang="ts">
/**
 * ClockView - 考勤打卡（个人视角）
 * 参考钉钉/企业微信/飞书考勤模块的常见设计：
 * - 顶部：实时时间 + 上/下班打卡按钮
 * - 下方按 日 / 周 / 月 / 年 四个维度查看本人的打卡历史
 *   · 日：选定日期的打卡明细 + 工作时长
 *   · 周：7天状态条 + 本周汇总（出勤/迟到/早退/缺勤/请假）
 *   · 月：月历热力图（每天一个状态色点，点击查看当天明细）+ 本月汇总
 *   · 年：12个月卡片，每月出勤率进度条 + 异常次数
 *
 * 说明：本页只展示"我"的打卡记录；查看全员汇总请前往"考勤报表"页面。
 */
defineOptions({ name: 'Clock' })
import {
  NCard, NButton, NSpace, NTag, NStatistic, NGrid, NGi,
  NTabs, NTabPane, NCalendar, NPopover, NProgress,
  useMessage,
} from 'naive-ui'
import { BasePage, BaseTable } from '@yanglao/ui'
import { useAttendanceStore } from '../../stores/attendance.store'
import { useAuthStore } from '../../stores/auth.store'
import { onMounted, onUnmounted, ref, computed, watch, h } from 'vue'
import { dayjs, formatDateTime } from '@yanglao/core'
import { usePageRefresh } from '../../composables/usePageRefresh'
import type { AttendanceRow } from '@yanglao/db'

const attendanceStore = useAttendanceStore()
const authStore = useAuthStore()
const message = useMessage()

const userId = computed(() => authStore.currentUser?.id ?? '')
const today = computed(() => dayjs().format('YYYY-MM-DD'))

// ── 实时时钟（用于顶部时间展示 + 打卡时间判定） ──────────────────
const now = ref(new Date())
let clockTimer: number | null = null
onMounted(() => {
  clockTimer = window.setInterval(() => { now.value = new Date() }, 1000)
})
onUnmounted(() => {
  if (clockTimer) window.clearInterval(clockTimer)
})
const nowText = computed(() => formatDateTime(now.value.getTime()))

const clockedIn = computed(() => attendanceStore.todayRecords.some(r => r.clock_type === 'clock_in'))
const clockedOut = computed(() => attendanceStore.todayRecords.some(r => r.clock_type === 'clock_out'))
const workTimeText = computed(() => {
  const shift = attendanceStore.workRule?.shift
  return shift ? `${shift.start_time} - ${shift.end_time}` : '未设置'
})

async function doClock(type: 'clock_in' | 'clock_out') {
  if (!userId.value) return
  if (!attendanceStore.workRule) return message.error('尚未设置上班时间')
  const res = await attendanceStore.clock({
    userId: userId.value,
    clockType: type,
    clockAt: formatDateTime(Date.now()),
    remark: null,
  })
  if (!res.ok) return message.error(res.error ?? '打卡失败')
  message.success(type === 'clock_in' ? '上班打卡成功' : '下班打卡成功')
  await refresh()
}

// ── 视图切换：日 / 周 / 月 / 年 ──────────────────────────────
const periodTab = ref<'day' | 'week' | 'month' | 'year'>('day')

// —— 日 ——
const selectedDay = ref(today.value)
function prevDay() { selectedDay.value = dayjs(selectedDay.value).subtract(1, 'day').format('YYYY-MM-DD') }
function nextDay() {
  const next = dayjs(selectedDay.value).add(1, 'day')
  if (next.isAfter(dayjs(), 'day')) return
  selectedDay.value = next.format('YYYY-MM-DD')
}
function gotoToday() { selectedDay.value = today.value }
const isViewingToday = computed(() => selectedDay.value === today.value)

// —— 周 ——
function startOfWeek(d: Date): Date {
  const date = new Date(d)
  const day = date.getDay() // 0=周日
  const diff = day === 0 ? -6 : 1 - day // 周一为起点
  date.setDate(date.getDate() + diff)
  date.setHours(0, 0, 0, 0)
  return date
}
const weekStart = ref(startOfWeek(new Date()))
const weekDates = computed<string[]>(() => {
  const arr: string[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart.value)
    d.setDate(d.getDate() + i)
    arr.push(dayjs(d).format('YYYY-MM-DD'))
  }
  return arr
})
const weekDayLabels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
const weekRangeText = computed(() => `${weekDates.value[0]} 至 ${weekDates.value[6]}`)
function prevWeek() { const d = new Date(weekStart.value); d.setDate(d.getDate() - 7); weekStart.value = d }
function nextWeek() { const d = new Date(weekStart.value); d.setDate(d.getDate() + 7); weekStart.value = d }
function thisWeek() { weekStart.value = startOfWeek(new Date()) }

// —— 月 ——
const calendarYear = ref(dayjs().year())
const calendarMonth = ref(dayjs().month() + 1) // 1-12
function handlePanelChange(info: { year: number; month: number }) {
  calendarYear.value = info.year
  calendarMonth.value = info.month
}
function monthRange(year: number, month: number) {
  const start = dayjs(`${year}-${String(month).padStart(2, '0')}-01`)
  return { start: start.format('YYYY-MM-DD'), end: start.endOf('month').format('YYYY-MM-DD') }
}

// —— 年 ——
const selectedYear = ref(dayjs().year())
function prevYear() { selectedYear.value-- }
function nextYear() { selectedYear.value++ }
function thisYear() { selectedYear.value = dayjs().year() }
function yearRange(year: number) { return { start: `${year}-01-01`, end: `${year}-12-31` } }

// ── 当前需要拉取的日期区间（随 tab / 导航变化） ──────────────────
const activeRange = computed(() => {
  switch (periodTab.value) {
    case 'day': return { start: selectedDay.value, end: selectedDay.value }
    case 'week': return { start: weekDates.value[0], end: weekDates.value[6] }
    case 'month': return monthRange(calendarYear.value, calendarMonth.value)
    case 'year': return yearRange(selectedYear.value)
  }
})

async function loadRangeForActiveTab() {
  if (!userId.value) return
  const { start, end } = activeRange.value
  await attendanceStore.fetchRange(start, end, userId.value)
}
watch(activeRange, () => { loadRangeForActiveTab() })

// ── 数据加载 + 自动/手动刷新 ────────────────────────────────────
const { refresh, refreshing } = usePageRefresh(async () => {
  if (!userId.value) return
  await Promise.all([
    attendanceStore.fetchToday(userId.value, today.value),
    attendanceStore.fetchLeaves(userId.value, 'approved'),
    attendanceStore.fetchWorkRule(userId.value, today.value),
    loadRangeForActiveTab(),
  ])
})

// ── 按天归组打卡记录 + 请假区间 ──────────────────────────────────
const recordsByDate = computed(() => {
  const map: Record<string, AttendanceRow[]> = {}
  for (const r of attendanceStore.rangeRecords) {
    (map[r.clock_date] ??= []).push(r)
  }
  return map
})

const approvedLeaveRanges = computed(() =>
  attendanceStore.leaves
    .filter(l => l.status === 'approved')
    .map(l => ({ start: dayjs(l.start_date), end: dayjs(l.end_date) }))
)

function clockInRecord(dateStr: string) { return recordsByDate.value[dateStr]?.find(r => r.clock_type === 'clock_in') }
function clockOutRecord(dateStr: string) { return recordsByDate.value[dateStr]?.find(r => r.clock_type === 'clock_out') }
function clockInTime(dateStr: string) { return clockInRecord(dateStr)?.clock_at?.slice(11, 16) ?? '--:--' }
function clockOutTime(dateStr: string) { return clockOutRecord(dateStr)?.clock_at?.slice(11, 16) ?? '--:--' }

type DayCategory = 'normal' | 'abnormal' | 'absent' | 'incomplete' | 'leave' | 'weekend' | 'future'

/** 综合打卡记录 + 请假 + 是否周末/未来，判定某天的考勤状态 */
function dayCategory(dateStr: string): DayCategory {
  const d = dayjs(dateStr)
  if (d.isAfter(dayjs(), 'day')) return 'future'
  const onLeave = approvedLeaveRanges.value.some(l => d.isBetween(l.start, l.end, 'day', '[]'))
  if (onLeave) return 'leave'
  const isWeekend = [0, 6].includes(d.day())
  const inR = clockInRecord(dateStr)
  const outR = clockOutRecord(dateStr)
  if (!inR && !outR) return isWeekend ? 'weekend' : 'absent'
  if (inR?.status === 'late' || outR?.status === 'early_leave') return 'abnormal'
  if (inR && outR) return 'normal'
  return 'incomplete' // 只打了一次卡
}

const categoryMeta: Record<DayCategory, { label: string; color: string; tagType: 'success' | 'warning' | 'error' | 'info' | 'default' }> = {
  normal:     { label: '正常', color: '#18a058', tagType: 'success' },
  abnormal:   { label: '异常', color: '#f0a020', tagType: 'warning' },
  absent:     { label: '缺勤', color: '#d03050', tagType: 'error' },
  incomplete: { label: '缺卡', color: '#8a2be2', tagType: 'error' },
  leave:      { label: '请假', color: '#2080f0', tagType: 'info' },
  weekend:    { label: '休息', color: '#c2c2c2', tagType: 'default' },
  future:     { label: '—',   color: '#e5e5e5', tagType: 'default' },
}

// ── 区间统计（应出勤/出勤/迟到/早退/缺勤/请假/出勤率） ─────────────
function periodStats(startStr: string, endStr: string) {
  let expected = 0, present = 0, late = 0, early = 0, absent = 0, leaveDays = 0, incomplete = 0
  let cur = dayjs(startStr)
  const boundEnd = dayjs(endStr).isAfter(dayjs()) ? dayjs() : dayjs(endStr)
  while (cur.isSameOrBefore(boundEnd, 'day')) {
    const dateStr = cur.format('YYYY-MM-DD')
    const cat = dayCategory(dateStr)
    if (cat === 'leave') {
      leaveDays++
    } else if (cat !== 'weekend') {
      expected++
      if (cat === 'normal') present++
      else if (cat === 'abnormal') {
        present++
        if (clockInRecord(dateStr)?.status === 'late') late++
        if (clockOutRecord(dateStr)?.status === 'early_leave') early++
      } else if (cat === 'incomplete') { present++; incomplete++ }
      else if (cat === 'absent') absent++
    }
    cur = cur.add(1, 'day')
  }
  const rate = expected > 0 ? Math.round((present / expected) * 100) : 0
  return { expected, present, late, early, absent, leaveDays, incomplete, rate }
}

const weekStats = computed(() => periodStats(weekDates.value[0], weekDates.value[6]))
const monthStats = computed(() => {
  const r = monthRange(calendarYear.value, calendarMonth.value)
  return periodStats(r.start, r.end)
})

function monthStatsFor(year: number, month: number) {
  const r = monthRange(year, month)
  return periodStats(r.start, r.end)
}
const yearMonthStats = computed(() =>
  Array.from({ length: 12 }, (_, i) => ({ month: i + 1, ...monthStatsFor(selectedYear.value, i + 1) }))
)
function isCurrentMonth(m: number) {
  return selectedYear.value === dayjs().year() && m === dayjs().month() + 1
}

// ── 月历单元格辅助 ───────────────────────────────────────────
function ymdToStr(year: number, month: number, date: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`
}
function dayCategoryYMD(year: number, month: number, date: number): DayCategory {
  return dayCategory(ymdToStr(year, month, date))
}

// ── 日视图：工作时长 ─────────────────────────────────────────
const dayDuration = computed(() => {
  const inR = clockInRecord(selectedDay.value)
  const outR = clockOutRecord(selectedDay.value)
  if (!inR || !outR) return null
  const mins = dayjs(outR.clock_at).diff(dayjs(inR.clock_at), 'minute')
  if (mins < 0) return null
  return `${Math.floor(mins / 60)}小时${mins % 60}分钟`
})

const statusTagType: Record<string, 'success' | 'warning' | 'error'> = {
  normal: 'success', late: 'warning', early_leave: 'warning', absent: 'error',
}
const statusLabel: Record<string, string> = {
  normal: '正常', late: '迟到', early_leave: '早退', absent: '缺卡',
}
const dayColumns = [
  { title: '打卡类型', key: 'clock_type', width: 100, render: (r: AttendanceRow) => r.clock_type === 'clock_in' ? '上班' : '下班' },
  { title: '打卡时间', key: 'clock_at', width: 180 },
  { title: '状态', key: 'status', width: 90, render: (r: AttendanceRow) => h(NTag, { type: statusTagType[r.status] ?? 'success' }, () => statusLabel[r.status] ?? r.status) },
]
</script>

<template>
  <BasePage title="考勤打卡">
    <!-- 顶部：实时时间 + 打卡按钮 -->
    <NGrid :x-gap="16" :y-gap="16" cols="1 620:3" class="mb-4">
      <NGi>
        <NCard>
          <NStatistic label="当前时间" :value="nowText" />
        </NCard>
      </NGi>
      <NGi>
        <NCard>
          <NStatistic label="今日上班时间" :value="workTimeText" />
          <div class="mt-2">
            <NTag v-if="attendanceStore.workRule" size="small" :type="attendanceStore.workRule.source === 'schedule' ? 'info' : 'default'">
              {{ attendanceStore.workRule.shift.name }} · {{ attendanceStore.workRule.source === 'schedule' ? '今日排班' : '默认班次' }}
            </NTag>
            <NTag v-else size="small" type="error">未配置班次</NTag>
          </div>
        </NCard>
      </NGi>
      <NGi>
        <NCard>
          <NSpace align="center" size="large">
            <NButton type="primary" size="large" :disabled="!attendanceStore.workRule || clockedIn" @click="doClock('clock_in')">
              {{ clockedIn ? '已上班打卡' : '上班打卡' }}
            </NButton>
            <NButton type="warning" size="large" :disabled="!attendanceStore.workRule || !clockedIn || clockedOut" @click="doClock('clock_out')">
              {{ clockedOut ? '已下班打卡' : '下班打卡' }}
            </NButton>
          </NSpace>
        </NCard>
      </NGi>
    </NGrid>

    <!-- 打卡记录：日 / 周 / 月 / 年 -->
    <NCard title="打卡记录">
      <template #header-extra>
        <NButton :loading="refreshing" size="small" @click="refresh">刷新</NButton>
      </template>

      <NTabs v-model:value="periodTab" type="line" animated>
        <!-- 日 -->
        <NTabPane name="day" tab="日">
          <NSpace align="center" justify="space-between" class="mb-3">
            <NSpace align="center">
              <NButton size="small" @click="prevDay">← 前一天</NButton>
              <NButton size="small" :disabled="isViewingToday" @click="gotoToday">今天</NButton>
              <NButton size="small" :disabled="isViewingToday" @click="nextDay">后一天 →</NButton>
              <span class="text-sm font-medium ml-2">{{ selectedDay }}</span>
              <NTag :type="categoryMeta[dayCategory(selectedDay)].tagType" size="small">
                {{ categoryMeta[dayCategory(selectedDay)].label }}
              </NTag>
            </NSpace>
          </NSpace>

          <NGrid :x-gap="12" :cols="3" class="mb-4">
            <NGi><NCard size="small"><NStatistic label="上班时间" :value="clockInTime(selectedDay)" /></NCard></NGi>
            <NGi><NCard size="small"><NStatistic label="下班时间" :value="clockOutTime(selectedDay)" /></NCard></NGi>
            <NGi><NCard size="small"><NStatistic label="工作时长" :value="dayDuration ?? '—'" /></NCard></NGi>
          </NGrid>

          <BaseTable
            :columns="dayColumns"
            :data="recordsByDate[selectedDay] ?? []"
            :pagination="false"
          />
        </NTabPane>

        <!-- 周 -->
        <NTabPane name="week" tab="周">
          <NSpace align="center" justify="space-between" class="mb-3">
            <NSpace align="center">
              <NButton size="small" @click="prevWeek">← 上一周</NButton>
              <NButton size="small" @click="thisWeek">本周</NButton>
              <NButton size="small" @click="nextWeek">下一周 →</NButton>
              <span class="text-sm text-gray-500 ml-2">{{ weekRangeText }}</span>
            </NSpace>
          </NSpace>

          <div class="week-grid mb-4">
            <div
              v-for="(date, i) in weekDates"
              :key="date"
              class="week-day-card"
              :class="{ 'week-day-card--today': date === today }"
            >
              <div class="week-day-label">{{ weekDayLabels[i] }}</div>
              <div class="week-day-date">{{ date.slice(5) }}</div>
              <NTag :type="categoryMeta[dayCategory(date)].tagType" size="small" class="mt-1">
                {{ categoryMeta[dayCategory(date)].label }}
              </NTag>
              <div v-if="!['weekend', 'future'].includes(dayCategory(date))" class="week-day-times">
                <div>上 {{ clockInTime(date) }}</div>
                <div>下 {{ clockOutTime(date) }}</div>
              </div>
            </div>
          </div>

          <NGrid :x-gap="12" :cols="5">
            <NGi><NCard size="small"><NStatistic label="应出勤" :value="weekStats.expected" /></NCard></NGi>
            <NGi><NCard size="small"><NStatistic label="出勤" :value="weekStats.present" /></NCard></NGi>
            <NGi><NCard size="small"><NStatistic label="迟到" :value="weekStats.late" /></NCard></NGi>
            <NGi><NCard size="small"><NStatistic label="早退" :value="weekStats.early" /></NCard></NGi>
            <NGi><NCard size="small"><NStatistic label="缺勤" :value="weekStats.absent" /></NCard></NGi>
          </NGrid>
        </NTabPane>

        <!-- 月 -->
        <NTabPane name="month" tab="月">
          <NGrid :x-gap="12" :cols="4" class="mb-4">
            <NGi><NCard size="small"><NStatistic label="出勤率" :value="`${monthStats.rate}%`" /></NCard></NGi>
            <NGi><NCard size="small"><NStatistic label="出勤天数" :value="`${monthStats.present}/${monthStats.expected}`" /></NCard></NGi>
            <NGi><NCard size="small"><NStatistic label="迟到/早退" :value="`${monthStats.late}/${monthStats.early}`" /></NCard></NGi>
            <NGi><NCard size="small"><NStatistic label="缺勤/请假" :value="`${monthStats.absent}/${monthStats.leaveDays}`" /></NCard></NGi>
          </NGrid>

          <NCalendar @panel-change="handlePanelChange">
            <template #default="{ year, month, date }">
              <div class="cal-cell-wrap">
                <NPopover v-if="dayCategoryYMD(year, month, date) !== 'future'" trigger="click" placement="top">
                  <template #trigger>
                    <span class="cal-dot" :style="{ background: categoryMeta[dayCategoryYMD(year, month, date)].color }" />
                  </template>
                  <div class="cal-popover">
                    <div class="cal-popover-title">
                      {{ ymdToStr(year, month, date) }} · {{ categoryMeta[dayCategoryYMD(year, month, date)].label }}
                    </div>
                    <template v-if="!['weekend', 'absent', 'leave'].includes(dayCategoryYMD(year, month, date))">
                      <div class="text-xs text-gray-500">上班：{{ clockInTime(ymdToStr(year, month, date)) }}</div>
                      <div class="text-xs text-gray-500">下班：{{ clockOutTime(ymdToStr(year, month, date)) }}</div>
                    </template>
                  </div>
                </NPopover>
              </div>
            </template>
          </NCalendar>

          <div class="legend-row mt-3">
            <span v-for="key in (['normal','abnormal','incomplete','absent','leave','weekend'] as DayCategory[])" :key="key" class="legend-item">
              <span class="legend-dot" :style="{ background: categoryMeta[key].color }" />
              {{ categoryMeta[key].label }}
            </span>
          </div>
        </NTabPane>

        <!-- 年 -->
        <NTabPane name="year" tab="年">
          <NSpace align="center" class="mb-4">
            <NButton size="small" @click="prevYear">← 上一年</NButton>
            <NButton size="small" @click="thisYear">今年</NButton>
            <NButton size="small" @click="nextYear">下一年 →</NButton>
            <span class="text-sm font-medium ml-2">{{ selectedYear }} 年</span>
          </NSpace>

          <div class="year-grid">
            <NCard
              v-for="ms in yearMonthStats"
              :key="ms.month"
              size="small"
              :class="{ 'month-card--current': isCurrentMonth(ms.month) }"
            >
              <div class="month-card__title">{{ ms.month }}月</div>
              <NProgress
                type="line"
                :percentage="ms.rate"
                :height="8"
                :show-indicator="false"
                :color="ms.rate >= 95 ? '#18a058' : ms.rate >= 80 ? '#f0a020' : '#d03050'"
              />
              <div class="month-card__rate">{{ ms.rate }}%</div>
              <div class="text-xs text-gray-400">出勤 {{ ms.present }}/{{ ms.expected }} 天</div>
              <div v-if="ms.late || ms.early || ms.absent" class="text-xs text-gray-400">
                迟到{{ ms.late }}·早退{{ ms.early }}·缺勤{{ ms.absent }}
              </div>
            </NCard>
          </div>
        </NTabPane>
      </NTabs>
    </NCard>
  </BasePage>
</template>

<style scoped>
/* 周视图：7 天状态条 */
.week-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}
.week-day-card {
  border: 1px solid var(--n-border-color, #e5e7eb);
  border-radius: 8px;
  padding: 10px 6px;
  text-align: center;
}
.week-day-card--today {
  border-color: #2080f0;
  background: rgba(32, 128, 240, 0.06);
}
.week-day-label {
  font-size: 12px;
  color: var(--n-text-color-3, #999);
}
.week-day-date {
  font-size: 15px;
  font-weight: 600;
  margin-top: 2px;
}
.week-day-times {
  margin-top: 6px;
  font-size: 11px;
  color: var(--n-text-color-3, #999);
  line-height: 1.5;
}

/* 月历单元格 */
.cal-cell-wrap {
  min-height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.cal-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  cursor: pointer;
}
.cal-popover {
  min-width: 140px;
}
.cal-popover-title {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 4px;
}

/* 图例 */
.legend-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--n-text-color-3, #999);
}
.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

/* 年视图：12 个月卡片 */
.year-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.month-card--current {
  border: 1px solid #2080f0;
}
.month-card__title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}
.month-card__rate {
  font-size: 12px;
  color: var(--n-text-color-2, #666);
  margin: 4px 0;
}
</style>
