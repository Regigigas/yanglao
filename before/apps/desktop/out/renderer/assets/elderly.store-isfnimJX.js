import { S as defineStore, r as ref } from "./vendor-vue-Hc3ejqjp.js";
const useElderlyStore = defineStore("elderly", () => {
  const list = ref([]);
  const loading = ref(false);
  const current = ref(null);
  async function fetchList() {
    loading.value = true;
    try {
      list.value = await window.api.elderly.list();
    } finally {
      loading.value = false;
    }
  }
  async function fetchById(id) {
    current.value = await window.api.elderly.get(id);
    return current.value;
  }
  async function create(data) {
    const row = await window.api.elderly.create(data);
    list.value.unshift(row);
    return row;
  }
  async function update(id, data) {
    await window.api.elderly.update(id, data);
    const idx = list.value.findIndex((e) => e.id === id);
    if (idx !== -1) {
      list.value[idx] = { ...list.value[idx], ...data };
    }
  }
  async function remove(id) {
    await window.api.elderly.delete(id);
    list.value = list.value.filter((e) => e.id !== id);
  }
  return { list, loading, current, fetchList, fetchById, create, update, remove };
});
export {
  useElderlyStore as u
};
