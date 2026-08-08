<script setup lang="ts">
  /**
   * TagsView - 顶部多页签导航
   * 记录已访问路由为可点击/可关闭的标签，配合 DefaultLayout 中的 KeepAlive 使用
   * 关闭页签时会同步清空 tabsStore.cached 中对应的 KeepAlive 缓存，避免内存泄漏
   */
  import { NDropdown } from 'naive-ui'
  import { CloseSmall } from '@icon-park/vue-next'
  import { RouterLink, useRoute, useRouter } from 'vue-router'
  import { computed, ref } from 'vue'
  import { useTabsStore } from '../stores/tabs.store'
  import type { TabView } from '../stores/tabs.store'

  const route = useRoute()
  const router = useRouter()
  const tabsStore = useTabsStore()

  const contextMenuVisible = ref(false)
  const contextMenuX = ref(0)
  const contextMenuY = ref(0)
  const contextTab = ref<TabView | null>(null)

  function isActive(tab: TabView): boolean {
    return tab.path === route.path
  }

  const dropdownOptions = computed(() => {
    const tab = contextTab.value
    if (!tab) return []
    return [
      { label: '关闭当前', key: 'close', disabled: tab.affix },
      { label: '关闭其他', key: 'closeOthers' },
      { label: '关闭左侧', key: 'closeLeft' },
      { label: '关闭右侧', key: 'closeRight' },
      { label: '关闭全部', key: 'closeAll' },
    ]
  })

  function openContextMenu(tab: TabView, e: MouseEvent) {
    e.preventDefault()
    contextTab.value = tab
    contextMenuX.value = e.clientX
    contextMenuY.value = e.clientY
    contextMenuVisible.value = true
  }

  /** 关闭页签后，若关闭的是当前激活页签，需要导航到最后一个剩余页签（或首页） */
  function navigateAfterClose(closedPath: string) {
    if (route.path !== closedPath) return
    const last = tabsStore.visited[tabsStore.visited.length - 1]
    router.push(last ? last.fullPath : '/dashboard')
  }

  function handleClose(tab: TabView) {
    if (tab.affix) return
    tabsStore.closeTab(tab.path)
    navigateAfterClose(tab.path)
  }

  function handleSelect(key: string) {
    const tab = contextTab.value
    if (!tab) return
    switch (key) {
      case 'close':
        handleClose(tab)
        break
      case 'closeOthers':
        tabsStore.closeOthers(tab.path)
        router.push(tab.fullPath)
        break
      case 'closeLeft':
        tabsStore.closeLeft(tab.path)
        navigateAfterClose(route.path)
        break
      case 'closeRight':
        tabsStore.closeRight(tab.path)
        navigateAfterClose(route.path)
        break
      case 'closeAll':
        tabsStore.closeAll()
        navigateAfterClose(route.path)
        break
    }
    contextMenuVisible.value = false
  }
</script>

<template>
  <div class="tags-view-container flex items-center h-9 px-3 gap-2 overflow-x-auto bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
    <RouterLink
      v-for="tab in tabsStore.visited"
      :key="tab.path"
      :to="tab.fullPath"
      class="tags-view-item group flex-center flex-shrink-0 h-6.5 pl-2.5 rounded text-xs border cursor-pointer select-none no-underline transition-colors"
      :class="isActive(tab)
        ? 'bg-primary/10 text-primary border-primary/40 font-medium'
        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:border-primary/50 hover:text-primary'"
      :style="{ paddingRight: tab.affix ? '10px' : '2px' }"
      @contextmenu="openContextMenu(tab, $event)"
      @click.middle="handleClose(tab)"
    >
      <!-- 左侧圆点：激活态为主色，非激活态为灰色占位，避免切换时标签宽度跳动 -->
      <span
        class="w-1.5 h-1.5 mr-1.5 rounded-full flex-shrink-0 transition-colors"
        :class="isActive(tab) ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'"
      />
      {{ tab.title }}
      <span
        v-if="!tab.affix"
        class="flex-center flex-shrink-0 w-3.5 h-3.5 ml-1.5 rounded-full transition-colors text-gray-400 hover:text-white hover:bg-gray-400 dark:text-gray-500 dark:hover:bg-gray-500 leading-none"
        :class="isActive(tab) ? 'hover:!bg-primary hover:!text-white' : ''"
        @click.stop.prevent="handleClose(tab)"
      >
        <CloseSmall theme="outline" :size="12" :stroke-width="4" />
      </span>
    </RouterLink>

    <NDropdown
      placement="bottom-start"
      trigger="manual"
      :show="contextMenuVisible"
      :x="contextMenuX"
      :y="contextMenuY"
      :options="dropdownOptions"
      @select="handleSelect"
      @clickoutside="contextMenuVisible = false"
    />
  </div>
</template>
