// apps/desktop/src/renderer/src/stores/notification.store.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { NotificationRow } from '@yanglao/db'

export const useNotificationStore = defineStore('notification', () => {
  const list = ref<NotificationRow[]>([])
  const unreadCount = ref(0)

  async function fetchAll(unreadOnly = false) {
    list.value = await window.api.notify.list(unreadOnly)
  }

  async function fetchUnreadCount() {
    unreadCount.value = await window.api.notify.unreadCount()
  }

  async function markRead(id: string) {
    await window.api.notify.read(id)
    const item = list.value.find(n => n.id === id)
    if (item?.is_read === 0) {
      item.is_read = 1
      item.read_at = Date.now()
      if (unreadCount.value > 0) unreadCount.value--
    }
  }

  async function markUnread(id: string) {
    await window.api.notify.unread(id)
    const item = list.value.find(n => n.id === id)
    if (item?.is_read === 1) {
      item.is_read = 0
      item.read_at = null
      unreadCount.value++
    }
  }

  async function markAllRead() {
    await window.api.notify.readAll()
    list.value.forEach(n => { n.is_read = 1; n.read_at = Date.now() })
    unreadCount.value = 0
  }

  async function remove(id: string) {
    const item = list.value.find(n => n.id === id)
    await window.api.notify.delete(id)
    list.value = list.value.filter(n => n.id !== id)
    if (item?.is_read === 0 && unreadCount.value > 0) unreadCount.value--
  }

  return { list, unreadCount, fetchAll, fetchUnreadCount, markRead, markUnread, markAllRead, remove }
})
