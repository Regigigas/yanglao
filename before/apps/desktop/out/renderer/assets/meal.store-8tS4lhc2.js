import { S as defineStore, r as ref } from "./vendor-vue-Hc3ejqjp.js";
const useMealStore = defineStore("meal", () => {
  const menus = ref([]);
  const records = ref([]);
  const nutritionPlans = ref([]);
  const loading = ref(false);
  async function fetchMenuByDate(date) {
    menus.value = await window.api.meal.menu.byDate(date);
  }
  async function createMenu(data) {
    const row = await window.api.meal.menu.create(data);
    menus.value.push(row);
    return row;
  }
  async function updateMenu(id, data) {
    await window.api.meal.menu.update(id, data);
    const idx = menus.value.findIndex((m) => m.id === id);
    if (idx !== -1) menus.value[idx] = { ...menus.value[idx], ...data };
  }
  async function deleteMenu(id) {
    await window.api.meal.menu.delete(id);
    menus.value = menus.value.filter((m) => m.id !== id);
  }
  async function fetchRecordsByDate(date) {
    loading.value = true;
    try {
      records.value = await window.api.meal.record.byDate(date);
    } finally {
      loading.value = false;
    }
  }
  async function fetchRecordsByElderly(elderlyId) {
    records.value = await window.api.meal.record.list(elderlyId);
  }
  async function createRecord(data) {
    const row = await window.api.meal.record.create(data);
    records.value.unshift(row);
    return row;
  }
  async function updateRecord(id, data) {
    await window.api.meal.record.update(id, data);
    const idx = records.value.findIndex((r) => r.id === id);
    if (idx !== -1) records.value[idx] = { ...records.value[idx], ...data };
  }
  async function fetchNutritionPlans(elderlyId, includeInactive = true) {
    nutritionPlans.value = await window.api.meal.nutrition.list(elderlyId, includeInactive);
  }
  async function createNutritionPlan(data) {
    const row = await window.api.meal.nutrition.create(data);
    nutritionPlans.value.unshift(row);
    return row;
  }
  async function updateNutritionPlan(id, data) {
    await window.api.meal.nutrition.update(id, data);
    const index = nutritionPlans.value.findIndex((plan) => plan.id === id);
    if (index !== -1) nutritionPlans.value[index] = { ...nutritionPlans.value[index], ...data };
  }
  async function deleteNutritionPlan(id) {
    await window.api.meal.nutrition.delete(id);
    nutritionPlans.value = nutritionPlans.value.filter((plan) => plan.id !== id);
  }
  return {
    menus,
    records,
    nutritionPlans,
    loading,
    fetchMenuByDate,
    createMenu,
    updateMenu,
    deleteMenu,
    fetchRecordsByDate,
    fetchRecordsByElderly,
    createRecord,
    updateRecord,
    fetchNutritionPlans,
    createNutritionPlan,
    updateNutritionPlan,
    deleteNutritionPlan
  };
});
export {
  useMealStore as u
};
