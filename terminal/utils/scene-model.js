const value = (item, snakeKey, camelKey) => item?.[snakeKey] ?? item?.[camelKey]
const text = (input, fallback = '') => String(input ?? fallback).trim()

function positiveInteger(input, fallback = 1) {
  const number = Number(input)
  return Number.isInteger(number) && number > 0 ? number : fallback
}

function normalizeStatus(status) {
  const normalized = text(status).toLowerCase()
  return ['available', 'occupied', 'maintenance'].includes(normalized) ? normalized : 'unknown'
}

export function normalizeSceneData(payload) {
  const source = payload && typeof payload === 'object' ? payload : {}
  const buildings = Array.isArray(source.buildings) ? source.buildings : []
  const rooms = Array.isArray(source.rooms) ? source.rooms : []
  const beds = Array.isArray(source.beds) ? source.beds : []

  return {
    buildings: buildings.map((item) => ({
      id: text(item?.id),
      name: text(item?.name, '未命名楼栋'),
      floors: positiveInteger(item?.floors)
    })).filter((item) => item.id),
    rooms: rooms.map((item) => ({
      id: text(item?.id),
      buildingId: text(value(item, 'building_id', 'buildingId')),
      floor: positiveInteger(item?.floor),
      roomNo: text(value(item, 'room_no', 'roomNo'), '未编号'),
      status: text(item?.status).toLowerCase()
    })).filter((item) => item.id && item.buildingId),
    beds: beds.map((item) => ({
      id: text(item?.id),
      roomId: text(value(item, 'room_id', 'roomId')),
      bedNo: text(value(item, 'bed_no', 'bedNo'), '未编号'),
      status: normalizeStatus(item?.status)
    })).filter((item) => item.id && item.roomId)
  }
}

export function sceneBuildingSummary(scene, buildingId) {
  const rooms = scene.rooms.filter((item) => item.buildingId === String(buildingId))
  const roomIds = new Set(rooms.map((item) => item.id))
  const beds = scene.beds.filter((item) => roomIds.has(item.roomId))
  return { rooms: rooms.length, beds: beds.length }
}
