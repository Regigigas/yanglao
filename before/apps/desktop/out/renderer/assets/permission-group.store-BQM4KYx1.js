import { S as defineStore, r as ref } from "./vendor-vue-Hc3ejqjp.js";
const usePermissionGroupStore = defineStore("permissionGroup", () => {
  const list = ref([]);
  const loading = ref(false);
  async function fetchList() {
    loading.value = true;
    try {
      list.value = await window.api.permissionGroup.list();
    } finally {
      loading.value = false;
    }
  }
  async function create(data) {
    const res = await window.api.permissionGroup.create(data);
    if (res.ok) list.value.push(res.group);
    return res;
  }
  async function update(id, data) {
    const res = await window.api.permissionGroup.update(id, data);
    if (res.ok) {
      const idx = list.value.findIndex((g) => g.id === id);
      if (idx !== -1) list.value[idx] = { ...list.value[idx], ...data };
    }
    return res;
  }
  async function remove(id) {
    const res = await window.api.permissionGroup.delete(id);
    if (res.ok) list.value = list.value.filter((g) => g.id !== id);
    return res;
  }
  return { list, loading, fetchList, create, update, remove };
});
export {
  usePermissionGroupStore as u
};
