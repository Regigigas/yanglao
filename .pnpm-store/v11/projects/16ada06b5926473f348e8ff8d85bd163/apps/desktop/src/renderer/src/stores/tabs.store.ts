// apps/desktop/src/renderer/src/stores/tabs.store.ts
// 顶部多页签（选项卡）导航状态管理
//
// 设计说明：
// - visited：已访问页签列表，按访问顺序排列，"首页概览"等 meta.affix 页签固定不可关闭
// - cached：KeepAlive 的 include 名单，元素为组件名（需与各 View 组件 defineOptions 声明的
//   name 一致，同时也与路由 name 保持一致，方便直接复用）
// - 关闭页签的任何操作都必须同步从 cached 中移除对应组件名，否则 KeepAlive 会一直持有
//   已关闭页面的组件实例，造成内存泄漏（DOM 已不可见但状态/定时器等仍在后台运行）

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

export interface TabView {
  /** 不含 query 的路径，作为页签唯一标识 */
  path: string
  /** 含 query 的完整路径，用于关闭后跳转还原 */
  fullPath: string
  /** 路由 name，需与组件 defineOptions({ name }) 一致，供 KeepAlive 匹配 */
  name: string
  title: string
  /** 固定页签（如首页概览），不参与关闭操作 */
  affix: boolean
}

export const useTabsStore = defineStore('tabs', () => {
  const visited = ref<TabView[]>([])
  const cached = ref<string[]>([])

  function toTabView(route: RouteLocationNormalizedLoaded): TabView | null {
    const name = route.name as string | undefined
    if (!name) return null
    return {
      path: route.path,
      fullPath: route.fullPath,
      name,
      title: (route.meta.title as string | undefined) ?? name,
      affix: !!route.meta.affix,
    }
  }

  /** 路由守卫/导航完成后调用：新增页签，并按需加入缓存名单 */
  function addTab(route: RouteLocationNormalizedLoaded) {
    const tab = toTabView(route)
    if (!tab) return
    if (!visited.value.some((v) => v.path === tab.path)) {
      visited.value.push(tab)
    }
    // meta.noCache 的路由（如带动态参数的详情页）不加入 KeepAlive，避免切换参数时显示旧数据
    if (!route.meta.noCache && !cached.value.includes(tab.name)) {
      cached.value.push(tab.name)
    }
  }

  /** 从缓存名单中移除组件名，清空 KeepAlive 持有的实例 */
  function uncache(name: string) {
    const idx = cached.value.indexOf(name)
    if (idx > -1) cached.value.splice(idx, 1)
  }

  /** 关闭单个页签（同名路由若被其他仍打开的页签复用，则保留缓存） */
  function closeTab(path: string) {
    const idx = visited.value.findIndex((v) => v.path === path)
    if (idx === -1) return
    const [removed] = visited.value.splice(idx, 1)
    if (!visited.value.some((v) => v.name === removed.name)) {
      uncache(removed.name)
    }
  }

  function syncCacheWithVisited() {
    cached.value = cached.value.filter((name) => visited.value.some((v) => v.name === name))
  }

  function closeOthers(path: string) {
    visited.value = visited.value.filter((v) => v.affix || v.path === path)
    syncCacheWithVisited()
  }

  function closeLeft(path: string) {
    const idx = visited.value.findIndex((v) => v.path === path)
    if (idx === -1) return
    visited.value = visited.value.filter((v, i) => v.affix || i >= idx)
    syncCacheWithVisited()
  }

  function closeRight(path: string) {
    const idx = visited.value.findIndex((v) => v.path === path)
    if (idx === -1) return
    visited.value = visited.value.filter((v, i) => v.affix || i <= idx)
    syncCacheWithVisited()
  }

  /** 全部关闭：仅保留固定页签，缓存名单同步清空 */
  function closeAll() {
    visited.value = visited.value.filter((v) => v.affix)
    syncCacheWithVisited()
  }

  return {
    visited,
    cached,
    addTab,
    closeTab,
    closeOthers,
    closeLeft,
    closeRight,
    closeAll,
  }
})
