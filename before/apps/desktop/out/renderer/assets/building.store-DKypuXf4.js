import { S as defineStore, r as ref } from "./vendor-vue-C6_copC_.js";
const useBuildingStore = defineStore("building", () => {
  const buildings = ref([]);
  const roomTypes = ref([]);
  const corridors = ref([]);
  const rooms = ref([]);
  const beds = ref([]);
  const bedStats = ref({ total: 0, available: 0, occupied: 0, maintenance: 0 });
  const loading = ref(false);
  async function fetchBuildings() {
    buildings.value = await window.api.building.list();
  }
  async function fetchRoomTypes(activeOnly = false) {
    roomTypes.value = await window.api.roomType.list(activeOnly);
  }
  async function fetchCorridors(buildingId) {
    corridors.value = await window.api.corridor.list(buildingId);
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
      await Promise.all([fetchBuildings(), fetchRoomTypes(), fetchCorridors(), fetchRooms(), fetchBeds(), fetchBedStats()]);
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
  async function createRoomType(data) {
    const row = await window.api.roomType.create(data);
    roomTypes.value.push(row);
    return row;
  }
  async function updateRoomType(id, data) {
    await window.api.roomType.update(id, data);
    const idx = roomTypes.value.findIndex((t) => t.id === id);
    if (idx !== -1) roomTypes.value[idx] = { ...roomTypes.value[idx], ...data };
  }
  async function deleteRoomType(id) {
    await window.api.roomType.delete(id);
    roomTypes.value = roomTypes.value.filter((t) => t.id !== id);
    rooms.value = rooms.value.map((r) => r.room_type_id === id ? { ...r, room_type_id: null } : r);
  }
  async function createCorridor(data) {
    const row = await window.api.corridor.create(data);
    corridors.value.push(row);
    return row;
  }
  async function updateCorridor(id, data) {
    await window.api.corridor.update(id, data);
    const idx = corridors.value.findIndex((c) => c.id === id);
    if (idx !== -1) corridors.value[idx] = { ...corridors.value[idx], ...data };
  }
  async function deleteCorridor(id) {
    await window.api.corridor.delete(id);
    corridors.value = corridors.value.filter((c) => c.id !== id);
    rooms.value = rooms.value.map((r) => r.corridor_id === id ? { ...r, corridor_id: null, layout_side: "none" } : r);
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
  async function generateRooms(data) {
    const result = await window.api.room.generate(data);
    rooms.value.push(...result.rooms);
    beds.value.push(...result.beds);
    await fetchBedStats();
    return result;
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
    roomTypes,
    corridors,
    rooms,
    beds,
    bedStats,
    loading,
    fetchAll,
    fetchBuildings,
    fetchRoomTypes,
    fetchCorridors,
    fetchRooms,
    fetchBeds,
    fetchBedStats,
    createBuilding,
    updateBuilding,
    deleteBuilding,
    createRoomType,
    updateRoomType,
    deleteRoomType,
    createCorridor,
    updateCorridor,
    deleteCorridor,
    createRoom,
    updateRoom,
    deleteRoom,
    generateRooms,
    createBed,
    updateBed,
    deleteBed
  };
});
export {
  useBuildingStore as u
};
