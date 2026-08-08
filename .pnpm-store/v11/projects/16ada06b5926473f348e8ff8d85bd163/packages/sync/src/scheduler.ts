// packages/sync/src/scheduler.ts
// 同步调度器 - 管理手动/自动/定时/固定时间四种触发方式
// 时间单位约定：
//   - intervalMs：自动同步间隔（毫秒）
//   - delayMs：延迟（毫秒）
//   - 固定时间：HH:mm 字符串，由 msUntilNextFixedTime 转为 ms 偏移

import cron from 'node-cron'
import type { ScheduledTask } from 'node-cron'
import type { SyncConfig, SyncStatus } from './types'
import type { SyncEngine } from './engine'
import { msUntilNextFixedTime, minutesToMs } from '@yanglao/core'

export type SyncEventType = 'start' | 'success' | 'error' | 'status-change'

export interface SyncEvent {
  type: SyncEventType
  status: SyncStatus
  trigger?: string
  durationMs?: number
  error?: string
  pendingCount?: number
}

type SyncListener = (event: SyncEvent) => void

export class SyncScheduler {
  private listeners: SyncListener[] = []
  private status: SyncStatus = 'idle'
  private autoTimer: ReturnType<typeof setTimeout> | null = null
  private cronTask: ScheduledTask | null = null
  private fixedTimers: ReturnType<typeof setTimeout>[] = []
  private config: SyncConfig | null = null

  constructor(private engine: SyncEngine) {}

  // ─── 事件监听 ──────────────────────────────────────────────

  on(listener: SyncListener): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private emit(event: SyncEvent): void {
    for (const l of this.listeners) l(event)
  }

  private setStatus(s: SyncStatus): void {
    if (this.status === s) return
    this.status = s
    this.emit({ type: 'status-change', status: s })
  }

  getStatus(): SyncStatus {
    return this.status
  }

  // ─── 手动触发 ──────────────────────────────────────────────

  async triggerManual(): Promise<void> {
    await this.runSync('manual')
  }

  // ─── 调度管理 ──────────────────────────────────────────────

  /**
   * 应用新的同步配置，并重新启动调度
   * @param config 新配置
   */
  applyConfig(config: SyncConfig): void {
    this.config = config
    this.engine.setAccessToken(config.accessToken)
    this.engine.setServerUrl(config.serverUrl)

    // 先停止所有调度
    this.stopAll()

    if (!config.enabled) {
      this.setStatus('disabled')
      return
    }

    this.setStatus('idle')

    switch (config.trigger) {
      case 'manual':
        // 手动模式：不启动自动调度
        break

      case 'auto':
        // 自动模式：按 intervalMs 循环
        this.startAutoSync(config.intervalMs)
        break

      case 'scheduled':
        // cron 模式
        if (config.cronExpression) {
          this.startCronSync(config.cronExpression)
        }
        break

      case 'timed':
        // 固定时间模式
        if (config.fixedTimes && config.fixedTimes.length > 0) {
          this.startFixedTimeSync(config.fixedTimes)
        }
        break
    }
  }

  /** 停止所有调度 */
  stopAll(): void {
    if (this.autoTimer) {
      clearTimeout(this.autoTimer)
      this.autoTimer = null
    }
    if (this.cronTask) {
      this.cronTask.stop()
      this.cronTask = null
    }
    for (const t of this.fixedTimers) clearTimeout(t)
    this.fixedTimers = []
  }

  // ─── 私有调度方法 ──────────────────────────────────────────

  /**
   * 自动同步：按 intervalMs 递归调度
   * @param intervalMs 间隔时间（ms）
   */
  private startAutoSync(intervalMs: number): void {
    const run = async () => {
      await this.runSync('auto')
      // 每次执行完后重新计时（避免执行耗时累积偏移）
      this.autoTimer = setTimeout(run, intervalMs)
    }
    this.autoTimer = setTimeout(run, intervalMs)
  }

  /**
   * cron 定时同步
   * @param expression node-cron 表达式
   */
  private startCronSync(expression: string): void {
    if (!cron.validate(expression)) {
      console.warn(`[Sync] 无效的 cron 表达式: ${expression}`)
      return
    }
    this.cronTask = cron.schedule(expression, () => {
      void this.runSync('scheduled')
    })
  }

  /**
   * 固定时间同步（每天在指定 HH:mm 触发）
   * @param fixedTimes HH:mm 格式时间列表，如 ["09:00","18:00"]
   */
  private startFixedTimeSync(fixedTimes: string[]): void {
    const scheduleNext = (timeStr: string) => {
      const delay = msUntilNextFixedTime([timeStr])
      const timer = setTimeout(async () => {
        await this.runSync('timed')
        // 当天执行后次日再触发
        const nextTimer = setTimeout(async () => {
          await this.runSync('timed')
          scheduleNext(timeStr)
        }, minutesToMs(24 * 60))
        this.fixedTimers.push(nextTimer)
      }, delay)
      this.fixedTimers.push(timer)
    }

    for (const t of fixedTimes) {
      scheduleNext(t)
    }
  }

  // ─── 执行同步 ──────────────────────────────────────────────

  private async runSync(trigger: string): Promise<void> {
    if (this.status === 'syncing') return  // 防止重入
    if (!this.config?.serverUrl) {
      this.emit({ type: 'error', status: 'error', trigger, error: '服务端 URL 未配置' })
      return
    }

    this.setStatus('syncing')
    this.emit({ type: 'start', status: 'syncing', trigger })

    const result = await this.engine.sync(
      trigger,
      this.config.direction,
      this.config.lastSyncAt,
      this.config.lastSyncCursor,
    )

    if (result.status === 'success') {
      if (this.config) {
        this.config.lastSyncAt = result.nextSyncAt ?? Date.now()
        this.config.lastSyncCursor = result.nextSyncCursor
      }
      this.setStatus('success')
      this.emit({
        type: 'success',
        status: 'success',
        trigger,
        durationMs: result.durationMs,
      })
    } else {
      this.setStatus('error')
      this.emit({
        type: 'error',
        status: 'error',
        trigger,
        durationMs: result.durationMs,
        error: result.error,
      })
    }

    // 成功或失败后回到 idle，等待下次触发
    setTimeout(() => {
      if (this.status !== 'disabled') this.setStatus('idle')
    }, 3000)
  }
}
