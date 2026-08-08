// apps/desktop/src/main/ipc/building.handler.ts
// 床位管理 IPC 处理器

import type { IpcMain } from 'electron'
import type { BuildingRepo } from '@yanglao/db'

export function registerBuildingHandlers(ipc: IpcMain, repo: BuildingRepo): void {
  // ─── 楼栋 ─────────────────────────────────────────────────
  ipc.handle('building:list', () => repo.findAllBuildings())
  ipc.handle('building:create', (_e, data) => repo.insertBuilding(data))
  ipc.handle('building:update', (_e, { id, data }) => { repo.updateBuilding(id, data); return { ok: true } })
  ipc.handle('building:delete', (_e, id: string) => { repo.deleteBuilding(id); return { ok: true } })

  // ─── 房型 ─────────────────────────────────────────────────
  ipc.handle('room-type:list', (_e, activeOnly?: boolean) => repo.findAllRoomTypes(activeOnly))
  ipc.handle('room-type:create', (_e, data) => repo.insertRoomType(data))
  ipc.handle('room-type:update', (_e, { id, data }) => { repo.updateRoomType(id, data); return { ok: true } })
  ipc.handle('room-type:delete', (_e, id: string) => { repo.deleteRoomType(id); return { ok: true } })

  // ─── 走廊/分区 ─────────────────────────────────────────────
  ipc.handle('corridor:list', (_e, buildingId?: string) => repo.findAllCorridors(buildingId))
  ipc.handle('corridor:create', (_e, data) => repo.insertCorridor(data))
  ipc.handle('corridor:update', (_e, { id, data }) => { repo.updateCorridor(id, data); return { ok: true } })
  ipc.handle('corridor:delete', (_e, id: string) => { repo.deleteCorridor(id); return { ok: true } })

  // ─── 房间 ─────────────────────────────────────────────────
  ipc.handle('room:list', (_e, buildingId?: string) => repo.findAllRooms(buildingId))
  ipc.handle('room:create', (_e, data) => repo.insertRoom(data))
  ipc.handle('room:update', (_e, { id, data }) => { repo.updateRoom(id, data); return { ok: true } })
  ipc.handle('room:delete', (_e, id: string) => { repo.deleteRoom(id); return { ok: true } })
  ipc.handle('room:generate', (_e, data) => repo.generateRooms(data))

  // ─── 床位 ─────────────────────────────────────────────────
  ipc.handle('bed:list', (_e, roomId?: string) => repo.findAllBeds(roomId))
  ipc.handle('bed:available', () => repo.findAvailableBeds())
  ipc.handle('bed:stats', () => repo.getBedStats())
  ipc.handle('bed:create', (_e, data) => repo.insertBed(data))
  ipc.handle('bed:update', (_e, { id, data }) => { repo.updateBed(id, data); return { ok: true } })
  ipc.handle('bed:delete', (_e, id: string) => { repo.deleteBed(id); return { ok: true } })
}
