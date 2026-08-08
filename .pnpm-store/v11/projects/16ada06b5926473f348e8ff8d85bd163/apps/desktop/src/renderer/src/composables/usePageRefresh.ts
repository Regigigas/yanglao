// apps/desktop/src/renderer/src/composables/usePageRefresh.ts
// 页面级刷新 composable：
// 1. 封装手动刷新按钮所需的 loading 状态
// 2. 自动订阅全局定时刷新事件（组件卸载时自动取消订阅）
// 3. 同时在 onMounted 时执行一次初始加载（替代原来手写的 onMounted(() => loadData())）

import { ref, onMounted, onUnmounted } from 'vue'
import { registerAutoRefresh } from './useAutoRefresh'

/**
 * 在页面 setup 中调用：
 * ```ts
 * const { refresh, refreshing } = usePageRefresh(async () => {
 *   await Promise.all([store.fetchList(), otherStore.fetchAll()])
 * })
 * ```
 * 然后在模板里：
 * ```html
 * <NButton :loading="refreshing" @click="refresh">刷新</NButton>
 * ```
 *
 * @param loadFn  数据加载函数（onMounted 和自动刷新时都会调用）
 * @param opts.immediate  默认 true，挂载时立即执行一次 loadFn
 */
export function usePageRefresh(
  loadFn: () => void | Promise<void>,
  opts: { immediate?: boolean } = {}
) {
  const { immediate = true } = opts
  const refreshing = ref(false)

  async function refresh() {
    if (refreshing.value) return   // 防止重叠请求
    refreshing.value = true
    try {
      await loadFn()
    } finally {
      refreshing.value = false
    }
  }

  // 订阅全局自动刷新
  let unsubscribe: (() => void) | null = null
  onMounted(() => {
    unsubscribe = registerAutoRefresh(refresh)
    if (immediate) {
      // 首次挂载加载（替代页面里写 onMounted(loadData)）
      refresh()
    }
  })
  onUnmounted(() => {
    unsubscribe?.()
  })

  return { refresh, refreshing }
}
