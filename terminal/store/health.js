/**
 * health.js — 健康数据状态管理
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getHealthList, getHealthAlerts } from '../api/health'

export const useHealthStore = defineStore('health', () => {
  const healthList   = ref([])
  const healthAlerts = ref([])
  const loading      = ref(false)

  const unreadAlerts = computed(() =>
    healthAlerts.value.filter(a => !a.isRead).length
  )

  const criticalCount = computed(() =>
    healthAlerts.value.filter(a => a.level === 'critical' && !a.isRead).length
  )

  async function fetchHealthList(params = {}) {
    loading.value = true
    try {
      const res = await getHealthList(params)
      healthList.value = res.rows || res.data || []
    } finally {
      loading.value = false
    }
  }

  async function fetchAlerts() {
    const res = await getHealthAlerts({ isRead: false })
    healthAlerts.value = res.rows || res.data || []
  }

  return {
    healthList, healthAlerts, loading,
    unreadAlerts, criticalCount,
    fetchHealthList, fetchAlerts
  }
})
