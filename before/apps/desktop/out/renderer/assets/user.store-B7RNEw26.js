import { S as defineStore, r as ref } from "./vendor-vue-C6_copC_.js";
const useUserStore = defineStore("user", () => {
  const list = ref([]);
  const loading = ref(false);
  async function fetchList() {
    loading.value = true;
    try {
      list.value = await window.api.user.list();
    } finally {
      loading.value = false;
    }
  }
  async function create(data) {
    const res = await window.api.user.create(data);
    if (res.ok) list.value.unshift(res.user);
    return res;
  }
  async function update(id, data) {
    const res = await window.api.user.update(id, data);
    if (res.ok) {
      const idx = list.value.findIndex((u) => u.id === id);
      if (idx !== -1) list.value[idx] = { ...list.value[idx], ...data };
    }
    return res;
  }
  async function resetPassword(id, newPassword) {
    return window.api.user.resetPassword(id, newPassword);
  }
  async function remove(id) {
    const res = await window.api.user.delete(id);
    if (res.ok) list.value = list.value.filter((u) => u.id !== id);
    return res;
  }
  return { list, loading, fetchList, create, update, resetPassword, remove };
});
export {
  useUserStore as u
};
