// apps/desktop/src/renderer/src/stores/task-reminder.store.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { TaskReminderRow } from '@yanglao/db'

export const useTaskReminderStore = defineStore('taskReminder', () => {
  /** 当前登录用户负责的提醒列表 */
  const myList = ref<TaskReminderRow[]>([])
  /** 当前登录用户创建（分配给他人）的提醒列表 */
  const createdList = ref<TaskReminderRow[]>([])

  async function fetchMine(userId: string, includeInactive = false) {
    myList.value = await window.api.reminder.listMine(userId, includeInactive)
  }

  async function fetchCreated(userId: string) {
    createdList.value = await window.api.reminder.listCreated(userId)
  }

  async function create(data: Parameters<typeof window.api.reminder.create>[0]) {
    const row = await window.api.reminder.create(data)
    myList.value.unshift(row as TaskReminderRow)
    return row
  }

  async function update(id: string, data: unknown) {
    await window.api.reminder.update(id, data)
    const idx = myList.value.findIndex(r => r.id === id)
    if (idx !== -1) Object.assign(myList.value[idx], data)
  }

  async function markDone(id: string) {
    await window.api.reminder.done(id)
    const item = myList.value.find(r => r.id === id)
    if (item) item.status = 'done'
  }

  async function cancel(id: string) {
    await window.api.reminder.cancel(id)
    const item = myList.value.find(r => r.id === id)
    if (item) item.status = 'cancelled'
  }

  async function remove(id: string) {
    await window.api.reminder.delete(id)
    myList.value = myList.value.filter(r => r.id !== id)
    createdList.value = createdList.value.filter(r => r.id !== id)
  }

  return {
    myList, createdList,
    fetchMine, fetchCreated,
    create, update, markDone, cancel, remove,
  }
})
