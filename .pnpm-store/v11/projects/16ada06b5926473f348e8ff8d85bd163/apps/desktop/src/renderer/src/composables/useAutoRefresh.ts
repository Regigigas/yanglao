// apps/desktop/src/renderer/src/composables/useAutoRefresh.ts
// 全局自动刷新定时器（单例）：
// - initAutoRefresh(seconds) 启动/重置定时器，seconds<=0 表示关闭
// - 定时器触发时会调用所有通过 usePageRefresh 注册的回调
// - 定时器状态是模块级单例，跨组件/跨页面共享，不会因页面切换而重复创建

type RefreshCallback = () => void | Promise<void>

const callbacks = new Set<RefreshCallback>()
let timerId: ReturnType<typeof setInterval> | null = null
let currentIntervalSec = 0

/** 启动（或重新配置）全局自动刷新定时器。seconds <= 0 时关闭定时器。 */
export function initAutoRefresh(seconds: number): void {
  if (timerId !== null) {
    clearInterval(timerId)
    timerId = null
  }
  currentIntervalSec = seconds > 0 ? seconds : 0
  if (currentIntervalSec > 0) {
    timerId = setInterval(() => {
      for (const cb of callbacks) {
        try {
          const ret = cb()
          if (ret instanceof Promise) ret.catch(() => { /* 单个页面刷新失败不影响其他页面 */ })
        } catch { /* 忽略 */ }
      }
    }, currentIntervalSec * 1000)
  }
}

export function getAutoRefreshInterval(): number {
  return currentIntervalSec
}

export function isAutoRefreshRunning(): boolean {
  return timerId !== null
}

/** 注册一个自动刷新回调，返回取消注册函数 */
export function registerAutoRefresh(cb: RefreshCallback): () => void {
  callbacks.add(cb)
  return () => callbacks.delete(cb)
}
