import { S as defineStore, r as ref } from "./vendor-vue-C6_copC_.js";
const useRoleStore = defineStore("role", () => {
  const list = ref([]);
  const loading = ref(false);
  async function fetchList() {
    loading.value = true;
    try {
      list.value = await window.api.role.list();
    } finally {
      loading.value = false;
    }
  }
  async function create(data) {
    const row = await window.api.role.create(data);
    list.value.push({ ...row, user_count: 0 });
    return row;
  }
  async function update(id, data) {
    const res = await window.api.role.update(id, data);
    if (res.ok) {
      const idx = list.value.findIndex((r) => r.id === id);
      if (idx !== -1) list.value[idx] = { ...list.value[idx], ...data };
    }
    return res;
  }
  async function remove(id) {
    const res = await window.api.role.delete(id);
    if (res.ok) list.value = list.value.filter((r) => r.id !== id);
    return res;
  }
  return { list, loading, fetchList, create, update, remove };
});
export {
  useRoleStore as u
};
