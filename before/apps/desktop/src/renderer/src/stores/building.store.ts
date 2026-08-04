// apps/desktop/src/renderer/src/stores/building.store.ts
// 床位管理 Pinia Store

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { BuildingRow, RoomRow, BedRow } from '@yanglao/db'

export const useBuildingStore = defineStore('building', () => {
  const buildings = ref<BuildingRow[]>([])
  const rooms = ref<RoomRow[]>([])
  const beds = ref<BedRow[]>([])
  const bedStats = ref({ total: 0, available: 0, occupied: 0, maintenance: 0 })
  const loading = ref(false)

  async function fetchBuildings() {
    buildings.value = await window.api.building.list()
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
      await Promise.all([fetchBuildings(), fetchRooms(), fetchBeds(), fetchBedStats()])
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
    buildings, rooms, beds, bedStats, loading,
    fetchAll, fetchBuildings, fetchRooms, fetchBeds, fetchBedStats,
    createBuilding, updateBuilding, deleteBuilding,
    createRoom, updateRoom, deleteRoom,
    createBed, updateBed, deleteBed,
  }
})
