// apps/desktop/src/renderer/src/stores/meal.store.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { MealMenuRow, MealRecordRow, NutritionPlanRow } from '@yanglao/db'

export const useMealStore = defineStore('meal', () => {
  const menus = ref<MealMenuRow[]>([])
  const records = ref<MealRecordRow[]>([])
  const nutritionPlans = ref<NutritionPlanRow[]>([])
  const loading = ref(false)

  async function fetchMenuByDate(date: string) {
    menus.value = await window.api.meal.menu.byDate(date)
  }

  async function createMenu(data: unknown) {
    const row = await window.api.meal.menu.create(data)
    menus.value.push(row)
    return row
  }

  async function updateMenu(id: string, data: unknown) {
    await window.api.meal.menu.update(id, data)
    const idx = menus.value.findIndex(m => m.id === id)
    if (idx !== -1) menus.value[idx] = { ...menus.value[idx], ...(data as object) }
  }

  async function deleteMenu(id: string) {
    await window.api.meal.menu.delete(id)
    menus.value = menus.value.filter(m => m.id !== id)
  }

  async function fetchRecordsByDate(date: string) {
    loading.value = true
    try { records.value = await window.api.meal.record.byDate(date) }
    finally { loading.value = false }
  }

  async function fetchRecordsByElderly(elderlyId: string) {
    records.value = await window.api.meal.record.list(elderlyId)
  }

  async function createRecord(data: unknown) {
    const row = await window.api.meal.record.create(data)
    records.value.unshift(row)
    return row
  }

  async function updateRecord(id: string, data: unknown) {
    await window.api.meal.record.update(id, data)
    const idx = records.value.findIndex(r => r.id === id)
    if (idx !== -1) records.value[idx] = { ...records.value[idx], ...(data as object) }
  }

  async function fetchNutritionPlans(elderlyId: string, includeInactive = true) {
    nutritionPlans.value = await window.api.meal.nutrition.list(elderlyId, includeInactive)
  }

  async function createNutritionPlan(data: unknown) {
    const row = await window.api.meal.nutrition.create(data)
    nutritionPlans.value.unshift(row)
    return row
  }

  async function updateNutritionPlan(id: string, data: unknown) {
    await window.api.meal.nutrition.update(id, data)
    const index = nutritionPlans.value.findIndex(plan => plan.id === id)
    if (index !== -1) nutritionPlans.value[index] = { ...nutritionPlans.value[index], ...(data as object) }
  }

  async function deleteNutritionPlan(id: string) {
    await window.api.meal.nutrition.delete(id)
    nutritionPlans.value = nutritionPlans.value.filter(plan => plan.id !== id)
  }

  return {
    menus, records, nutritionPlans, loading,
    fetchMenuByDate, createMenu, updateMenu, deleteMenu,
    fetchRecordsByDate, fetchRecordsByElderly, createRecord, updateRecord,
    fetchNutritionPlans, createNutritionPlan, updateNutritionPlan, deleteNutritionPlan,
  }
})
