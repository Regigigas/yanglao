// apps/desktop/src/renderer/src/stores/lan.store.ts
// 局域网主机模式 Pinia Store

import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface LanConfig {
  id: 1
  enabled: 0 | 1
  port: number
  allow_write: 0 | 1
  secret: string | null
  updated_at: number
}

export interface LanStatus {
  running: boolean
  port: number
  urls: string[]
}

export const useLanStore = defineStore('lan', () => {
  const config = ref<LanConfig | null>(null)
  const status = ref<LanStatus>({ running: false, port: 7788, urls: [] })
  const ips = ref<string[]>([])
  const loading = ref(false)

  async function fetchConfig() {
    config.value = await window.api.lan.getConfig()
  }

  async function fetchStatus() {
    status.value = await window.api.lan.getStatus()
  }

  async function fetchIPs() {
    ips.value = await window.api.lan.getIPs()
  }

  async function fetchAll() {
    loading.value = true
    try {
      await Promise.all([fetchConfig(), fetchStatus(), fetchIPs()])
    } finally {
      loading.value = false
    }
  }

  async function saveConfig(cfg: Partial<Pick<LanConfig, 'port' | 'allow_write' | 'secret' | 'enabled'>>) {
    await window.api.lan.saveConfig(cfg)
    await fetchConfig()
  }

  /** 启动主机服务，并持久化 enabled=1，下次开机自动启动 */
  async function start(port?: number): Promise<{ ok: boolean; error?: string }> {
    const res = await window.api.lan.start(port)
    if (res.ok) {
      status.value = res.status
      await saveConfig({ enabled: 1, port: port ?? config.value?.port })
    }
    return res
  }

  /** 停止主机服务，并持久化 enabled=0 */
  async function stop() {
    const res = await window.api.lan.stop()
    status.value = res.status
    await saveConfig({ enabled: 0 })
    return res
  }

  async function pingUrl(url: string): Promise<{ ok: boolean; latency?: number; error?: string }> {
    return window.api.lan.ping(url)
  }

  return {
    config, status, ips, loading,
    fetchAll, fetchConfig, fetchStatus, fetchIPs,
    saveConfig, start, stop, pingUrl,
  }
})
