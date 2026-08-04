import { S as defineStore, r as ref } from "./vendor-vue-Hc3ejqjp.js";
const useBuildingStore = defineStore("building", () => {
  const buildings = ref([]);
  const rooms = ref([]);
  const beds = ref([]);
  const bedStats = ref({ total: 0, available: 0, occupied: 0, maintenance: 0 });
  const loading = ref(false);
  async function fetchBuildings() {
    buildings.value = await window.api.building.list();
  }
  async function fetchRooms(buildingId) {
    rooms.value = await window.api.room.list(buildingId);
  }
  async function fetchBeds(roomId) {
    beds.value = await window.api.bed.list(roomId);
  }
  async function fetchBedStats() {
    bedStats.value = await window.api.bed.stats();
  }
  async function fetchAll() {
    loading.value = true;
    try {
      await Promise.all([fetchBuildings(), fetchRooms(), fetchBeds(), fetchBedStats()]);
    } finally {
      loading.value = false;
    }
  }
  async function createBuilding(data) {
    const row = await window.api.building.create(data);
    buildings.value.unshift(row);
    return row;
  }
  async function updateBuilding(id, data) {
    await window.api.building.update(id, data);
    const idx = buildings.value.findIndex((b) => b.id === id);
    if (idx !== -1) buildings.value[idx] = { ...buildings.value[idx], ...data };
  }
  async function deleteBuilding(id) {
    await window.api.building.delete(id);
    buildings.value = buildings.value.filter((b) => b.id !== id);
  }
  async function createRoom(data) {
    const row = await window.api.room.create(data);
    rooms.value.push(row);
    return row;
  }
  async function updateRoom(id, data) {
    await window.api.room.update(id, data);
    const idx = rooms.value.findIndex((r) => r.id === id);
    if (idx !== -1) rooms.value[idx] = { ...rooms.value[idx], ...data };
  }
  async function deleteRoom(id) {
    await window.api.room.delete(id);
    rooms.value = rooms.value.filter((r) => r.id !== id);
  }
  async function createBed(data) {
    const row = await window.api.bed.create(data);
    beds.value.push(row);
    await fetchBedStats();
    return row;
  }
  async function updateBed(id, data) {
    await window.api.bed.update(id, data);
    const idx = beds.value.findIndex((b) => b.id === id);
    if (idx !== -1) beds.value[idx] = { ...beds.value[idx], ...data };
    await fetchBedStats();
  }
  async function deleteBed(id) {
    await window.api.bed.delete(id);
    beds.value = beds.value.filter((b) => b.id !== id);
    await fetchBedStats();
  }
  return {
    buildings,
    rooms,
    beds,
    bedStats,
    loading,
    fetchAll,
    fetchBuildings,
    fetchRooms,
    fetchBeds,
    fetchBedStats,
    createBuilding,
    updateBuilding,
    deleteBuilding,
    createRoom,
    updateRoom,
    deleteRoom,
    createBed,
    updateBed,
    deleteBed
  };
});
export {
  useBuildingStore as u
};
