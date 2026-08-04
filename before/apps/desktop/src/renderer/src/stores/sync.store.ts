// apps/desktop/src/renderer/src/stores/sync.store.ts
// 同步状态 Pinia Store

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SyncConfig, SyncStatus } from '@yanglao/core'
import type { SyncEvent } from '@yanglao/sync'

export const useSyncStore = defineStore('sync', () => {
  const status = ref<SyncStatus>('idle')
  const config = ref<SyncConfig | null>(null)
  const pendingCount = ref(0)
  const lastSyncAt = ref<number | null>(null)
  const lastError = ref<string | null>(null)
  let unsubscribe: (() => void) | null = null

  /** 初始化主进程同步事件监听 */
  function initListener() {
    if (unsubscribe) return  // 防止重复注册
    unsubscribe = window.api.sync.onEvent((event: SyncEvent) => {
      status.value = event.status
      if (event.type === 'success') {
        lastSyncAt.value = Date.now()
        lastError.value = null
        refreshPendingCount()
      }
      if (event.type === 'error') {
        lastError.value = event.error ?? '同步失败'
      }
    })
    // 初始化时拉取状态
    refreshPendingCount()
    loadConfig()
  }

  function destroyListener() {
    unsubscribe?.()
    unsubscribe = null
  }

  async function loadConfig() {
    config.value = await window.api.sync.getConfig()
    lastSyncAt.value = config.value?.lastSyncAt ?? null
  }

  async function saveConfig(cfg: SyncConfig) {
    await window.api.sync.saveConfig(cfg)
    config.value = cfg
  }

  async function triggerManual() {
    await window.api.sync.triggerManual()
  }

  async function refreshPendingCount() {
    const { count } = await window.api.sync.pendingCount()
    pendingCount.value = count
  }

  async function disableSync() {
    await window.api.sync.disable()
    if (config.value) config.value.enabled = false
  }

  return {
    status,
    config,
    pendingCount,
    lastSyncAt,
    lastError,
    initListener,
    destroyListener,
    loadConfig,
    saveConfig,
    triggerManual,
    refreshPendingCount,
    disableSync,
  }
})
