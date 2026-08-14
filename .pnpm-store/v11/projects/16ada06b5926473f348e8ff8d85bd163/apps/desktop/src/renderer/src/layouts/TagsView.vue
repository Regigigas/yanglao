<script setup lang="ts">
  /**
   * TagsView - 顶部多页签导航
   * 记录已访问路由为可点击/可关闭的标签，配合 DefaultLayout 中的 KeepAlive 使用
   * 关闭页签时会同步清空 tabsStore.cached 中对应的 KeepAlive 缓存，避免内存泄漏
   */
  import { NDropdown } from 'naive-ui'
  import { CloseSmall, More } from '@icon-park/vue-next'
  import { RouterLink, useRoute, useRouter } from 'vue-router'
  import { computed, ref } from 'vue'
  import { useTabsStore } from '../stores/tabs.store'
  import { useTheme } from '@ui/composables/useTheme'
  import type { TabView } from '../stores/tabs.store'

  const route = useRoute()
  const router = useRouter()
  const tabsStore = useTabsStore()
  const { isDark } = useTheme()
  const MAX_VISIBLE_TABS = 7

  const visibleTabs = computed(() => {
    if (tabsStore.visited.length <= MAX_VISIBLE_TABS) return tabsStore.visited
    const active = tabsStore.visited.find(tab => isActive(tab))
    const affixed = tabsStore.visited.filter(tab => tab.affix)
    const recent = tabsStore.visited.slice(-(MAX_VISIBLE_TABS - affixed.length))
    const result = [...affixed, ...recent]
    if (active && !result.some(tab => tab.path === active.path)) result[result.length - 1] = active
    return result.filter((tab, index, list) => list.findIndex(item => item.path === tab.path) === index)
  })
  const hasOverflow = computed(() => tabsStore.visited.length > visibleTabs.value.length)
  const allTabOptions = computed(() => tabsStore.visited.map(tab => ({
    label: tab.title,
    key: tab.fullPath,
  })))

  function selectOverflowTab(fullPath: string) {
    router.push(fullPath)
  }

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
  <div class="tags-view-container flex items-center h-9 px-3 gap-2 overflow-hidden" :class="{ 'is-dark': isDark }">
    <RouterLink
      v-for="tab in visibleTabs"
      :key="tab.path"
      :to="tab.fullPath"
      class="tags-view-item group flex-center flex-shrink-0 h-6.5 pl-2.5 rounded text-xs border cursor-pointer select-none no-underline transition-colors"
      :class="{ active: isActive(tab) }"
      :style="{ paddingRight: tab.affix ? '10px' : '2px' }"
      @contextmenu="openContextMenu(tab, $event)"
      @click.middle="handleClose(tab)"
    >
      <!-- 左侧圆点：激活态为主色，非激活态为灰色占位，避免切换时标签宽度跳动 -->
      <span
        class="w-1.5 h-1.5 mr-1.5 rounded-full flex-shrink-0 transition-colors"
        :class="isActive(tab) ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'"
      />
      <span class="tab-title">{{ tab.title }}</span>
      <span
        v-if="!tab.affix"
        class="flex-center flex-shrink-0 w-3.5 h-3.5 ml-1.5 rounded-full transition-colors text-gray-400 hover:text-white hover:bg-gray-400 dark:text-gray-500 dark:hover:bg-gray-500 leading-none"
        :class="isActive(tab) ? 'hover:!bg-primary hover:!text-white' : ''"
        @click.stop.prevent="handleClose(tab)"
      >
        <CloseSmall theme="outline" :size="12" :stroke-width="4" />
      </span>
    </RouterLink>

    <NDropdown v-if="hasOverflow" trigger="click" :options="allTabOptions" @select="selectOverflowTab">
      <button class="tags-overflow flex-center flex-shrink-0 h-6.5 min-w-8 rounded border cursor-pointer" title="查看全部标签" aria-label="查看全部标签">
        <More theme="outline" :size="17" :stroke-width="3" />
      </button>
    </NDropdown>

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

<style scoped>
.tags-view-container {
  color: #4b5563;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}
.tags-view-container.is-dark {
  color: #d1d5db;
  background: #111827;
  border-bottom-color: #374151;
}
.tags-view-item,
.tags-overflow {
  color: inherit;
  background: #fff;
  border-color: #e5e7eb;
}
.is-dark .tags-view-item,
.is-dark .tags-overflow {
  background: #1f2937;
  border-color: #4b5563;
}
.tags-view-item:hover,
.tags-overflow:hover,
.tags-view-item.active {
  color: var(--primary-color, #18a058);
  border-color: var(--primary-color, #18a058);
}
.tags-view-item.active {
  background: color-mix(in srgb, var(--primary-color, #18a058) 12%, transparent);
  font-weight: 500;
}
.tab-title {
  display: block;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tags-overflow {
  padding: 0 8px;
  line-height: 1;
}
</style>
