// apps/desktop/src/renderer/src/stores/building.store.ts
// 床位管理 Pinia Store

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { BedRow, BuildingRow, CorridorRow, RoomGenerateInput, RoomGenerateResult, RoomRow, RoomTypeRow } from '@yanglao/db'

export const useBuildingStore = defineStore('building', () => {
  const buildings = ref<BuildingRow[]>([])
  const roomTypes = ref<RoomTypeRow[]>([])
  const corridors = ref<CorridorRow[]>([])
  const rooms = ref<RoomRow[]>([])
  const beds = ref<BedRow[]>([])
  const bedStats = ref({ total: 0, available: 0, occupied: 0, maintenance: 0 })
  const loading = ref(false)

  async function fetchBuildings() {
    buildings.value = await window.api.building.list()
  }

  async function fetchRoomTypes(activeOnly = false) {
    roomTypes.value = await window.api.roomType.list(activeOnly)
  }

  async function fetchCorridors(buildingId?: string) {
    corridors.value = await window.api.corridor.list(buildingId)
  }

  async function fetchRooms(buildingId?: string) {
    rooms.value = await window.api.room.list(buildingId)
  }

  async function fetchBeds(roomId?: string) {
    beds.value = await window.api.bed.list(roomId)
  }

  async function fetchBedStats() {
    bedStats.value = await window.api.bed.stats()
  }

  async function fetchAll() {
    loading.value = true
    try {
      await Promise.all([fetchBuildings(), fetchRoomTypes(), fetchCorridors(), fetchRooms(), fetchBeds(), fetchBedStats()])
    } finally {
      loading.value = false
    }
  }

  async function createBuilding(data: Omit<BuildingRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) {
    const row = await window.api.building.create(data)
    buildings.value.unshift(row)
    return row
  }

  async function updateBuilding(id: string, data: Partial<BuildingRow>) {
    await window.api.building.update(id, data)
    const idx = buildings.value.findIndex(b => b.id === id)
    if (idx !== -1) buildings.value[idx] = { ...buildings.value[idx], ...data }
  }

  async function deleteBuilding(id: string) {
    await window.api.building.delete(id)
    buildings.value = buildings.value.filter(b => b.id !== id)
  }

  async function createRoomType(data: Omit<RoomTypeRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) {
    const row = await window.api.roomType.create(data)
    roomTypes.value.push(row)
    return row
  }

  async function updateRoomType(id: string, data: Partial<RoomTypeRow>) {
    await window.api.roomType.update(id, data)
    const idx = roomTypes.value.findIndex(t => t.id === id)
    if (idx !== -1) roomTypes.value[idx] = { ...roomTypes.value[idx], ...data }
  }

  async function deleteRoomType(id: string) {
    await window.api.roomType.delete(id)
    roomTypes.value = roomTypes.value.filter(t => t.id !== id)
    rooms.value = rooms.value.map(r => r.room_type_id === id ? { ...r, room_type_id: null } : r)
  }

  async function createCorridor(data: Omit<CorridorRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) {
    const row = await window.api.corridor.create(data)
    corridors.value.push(row)
    return row
  }

  async function updateCorridor(id: string, data: Partial<CorridorRow>) {
    await window.api.corridor.update(id, data)
    const idx = corridors.value.findIndex(c => c.id === id)
    if (idx !== -1) corridors.value[idx] = { ...corridors.value[idx], ...data }
  }

  async function deleteCorridor(id: string) {
    await window.api.corridor.delete(id)
    corridors.value = corridors.value.filter(c => c.id !== id)
    rooms.value = rooms.value.map(r => r.corridor_id === id ? { ...r, corridor_id: null, layout_side: 'none' } : r)
  }

  async function createRoom(data: Omit<RoomRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) {
    const row = await window.api.room.create(data)
    rooms.value.push(row)
    return row
  }

  async function updateRoom(id: string, data: Partial<RoomRow>) {
    await window.api.room.update(id, data)
    const idx = rooms.value.findIndex(r => r.id === id)
    if (idx !== -1) rooms.value[idx] = { ...rooms.value[idx], ...data }
  }

  async function deleteRoom(id: string) {
    await window.api.room.delete(id)
    rooms.value = rooms.value.filter(r => r.id !== id)
  }

  async function generateRooms(data: RoomGenerateInput): Promise<RoomGenerateResult> {
    const result = await window.api.room.generate(data)
    rooms.value.push(...result.rooms)
    beds.value.push(...result.beds)
    await fetchBedStats()
    return result
  }

  async function createBed(data: Omit<BedRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) {
    const row = await window.api.bed.create(data)
    beds.value.push(row)
    await fetchBedStats()
    return row
  }

  async function updateBed(id: string, data: Partial<BedRow>) {
    await window.api.bed.update(id, data)
    const idx = beds.value.findIndex(b => b.id === id)
    if (idx !== -1) beds.value[idx] = { ...beds.value[idx], ...data }
    await fetchBedStats()
  }

  async function deleteBed(id: string) {
    await window.api.bed.delete(id)
    beds.value = beds.value.filter(b => b.id !== id)
    await fetchBedStats()
  }

  return {
    buildings, roomTypes, corridors, rooms, beds, bedStats, loading,
    fetchAll, fetchBuildings, fetchRoomTypes, fetchCorridors, fetchRooms, fetchBeds, fetchBedStats,
    createBuilding, updateBuilding, deleteBuilding,
    createRoomType, updateRoomType, deleteRoomType,
    createCorridor, updateCorridor, deleteCorridor,
    createRoom, updateRoom, deleteRoom,
    generateRooms,
    createBed, updateBed, deleteBed,
  }
})
