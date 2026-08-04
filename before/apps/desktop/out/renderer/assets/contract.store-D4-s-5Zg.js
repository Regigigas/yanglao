import { S as defineStore, r as ref } from "./vendor-vue-Hc3ejqjp.js";
const useContractStore = defineStore("contract", () => {
  const list = ref([]);
  const expiring = ref([]);
  const loading = ref(false);
  async function fetchAll() {
    loading.value = true;
    try {
      list.value = await window.api.contract.list();
    } finally {
      loading.value = false;
    }
  }
  async function fetchExpiring(days = 30) {
    expiring.value = await window.api.contract.expiring(days);
  }
  async function fetchByElderly(elderlyId) {
    list.value = await window.api.contract.listByElderly(elderlyId);
  }
  async function create(data) {
    const row = await window.api.contract.create(data);
    list.value.unshift(row);
    return row;
  }
  async function update(id, data) {
    await window.api.contract.update(id, data);
    const idx = list.value.findIndex((c) => c.id === id);
    if (idx !== -1) list.value[idx] = { ...list.value[idx], ...data };
    const expIdx = expiring.value.findIndex((c) => c.id === id);
    if (expIdx !== -1) {
      const merged = { ...expiring.value[expIdx], ...data };
      if (merged.status !== "active") {
        expiring.value.splice(expIdx, 1);
      } else {
        expiring.value[expIdx] = merged;
      }
    }
  }
  async function remove(id) {
    await window.api.contract.delete(id);
    list.value = list.value.filter((c) => c.id !== id);
  }
  async function genContractNo() {
    return window.api.contract.genNo();
  }
  return {
    list,
    expiring,
    loading,
    fetchAll,
    fetchExpiring,
    fetchByElderly,
    create,
    update,
    remove,
    genContractNo
  };
});
export {
  useContractStore as u
};
