// packages/core/src/utils/time.ts
// dayjs 统一封装 + 时间单位转换工具
// 约定：所有对外接口的时间单位为 ms（毫秒）或 分钟（minuteXxx），内部统一 ms

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.extend(duration)
dayjs.extend(localizedFormat)
dayjs.extend(isBetween)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.locale('zh-cn')

export { dayjs }

// ─── 单位换算 ─────────────────────────────────────────────────

/** 分钟 → 毫秒 */
export const minutesToMs = (minutes: number): number => minutes * 60 * 1000

/** 毫秒 → 分钟（保留两位小数） */
export const msToMinutes = (ms: number): number =>
  Math.round((ms / (60 * 1000)) * 100) / 100

/** 毫秒 → 秒 */
export const msToSeconds = (ms: number): number => Math.floor(ms / 1000)

/** 秒 → 毫秒 */
export const secondsToMs = (seconds: number): number => seconds * 1000

// ─── 格式化 ───────────────────────────────────────────────────

/** 格式化为日期时间 "YYYY-MM-DD HH:mm:ss" */
export const formatDateTime = (ts: number | string | Date): string =>
  dayjs(ts).format('YYYY-MM-DD HH:mm:ss')

/** 格式化为日期 "YYYY-MM-DD" */
export const formatDate = (ts: number | string | Date): string =>
  dayjs(ts).format('YYYY-MM-DD')

/** 相对时间（如 "3 分钟前"） */
export const fromNow = (ts: number | string | Date): string =>
  dayjs(ts).fromNow()

/** 获取当前时间戳（ms） */
export const nowMs = (): number => Date.now()

/** 获取今天指定时刻的时间戳，输入格式 "HH:mm"（如 "09:00"） */
export const todayAtMs = (timeStr: string): number => {
  const [h, m] = timeStr.split(':').map(Number)
  return dayjs().hour(h).minute(m).second(0).millisecond(0).valueOf()
}

/** 判断当前时间是否超过某个时刻（HH:mm），用于固定时间同步触发判断 */
export const isPastTime = (timeStr: string): boolean =>
  Date.now() >= todayAtMs(timeStr)

/**
 * 计算下一个固定时刻距今的毫秒数
 * fixedTimes: ["09:00", "18:00"]
 * 若今天所有时刻均已过去，则返回明天第一个时刻的距离
 */
export const msUntilNextFixedTime = (fixedTimes: string[]): number => {
  const now = Date.now()
  const sorted = [...fixedTimes].sort()
  for (const t of sorted) {
    const target = todayAtMs(t)
    if (target > now) return target - now
  }
  // 今天都过了，取明天第一个
  const tomorrow = dayjs(todayAtMs(sorted[0])).add(1, 'day').valueOf()
  return tomorrow - now
}
