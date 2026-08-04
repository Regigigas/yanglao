// packages/db/src/repositories/building.repo.ts
// 床位管理仓库（楼栋/房间/床位）

import type { Database } from 'better-sqlite3'
import { nanoid } from 'nanoid'
import type { BuildingRow, RoomRow, BedRow } from '../schema'

export class BuildingRepo {
  constructor(private db: Database) {}

  // ─── 楼栋 ─────────────────────────────────────────────────
  findAllBuildings(): BuildingRow[] {
    return this.db
      .prepare<[], BuildingRow>(`SELECT * FROM building WHERE deleted_at IS NULL ORDER BY sort_order, name`)
      .all() as BuildingRow[]
  }

  findBuildingById(id: string): BuildingRow | null {
    return (this.db.prepare<[string], BuildingRow>(`SELECT * FROM building WHERE id=?`).get(id) as BuildingRow | undefined) ?? null
  }

  insertBuilding(data: Omit<BuildingRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): BuildingRow {
    const now = Date.now()
    const row: BuildingRow = { ...data, id: nanoid(), created_at: now, updated_at: now, deleted_at: null }
    this.db.prepare(`INSERT INTO building (id,name,floors,remark,sort_order,created_at,updated_at,deleted_at)
      VALUES (@id,@name,@floors,@remark,@sort_order,@created_at,@updated_at,@deleted_at)`).run(row)
    return row
  }

  updateBuilding(id: string, data: Partial<Omit<BuildingRow, 'id' | 'created_at' | 'deleted_at'>>): void {
    const now = Date.now()
    const fields = Object.keys(data)
    if (!fields.length) return
    const sets = [...fields, 'updated_at'].map(f => `${f}=@${f}`).join(',')
    this.db.prepare(`UPDATE building SET ${sets} WHERE id=@id`).run({ ...data, updated_at: now, id })
  }

  deleteBuilding(id: string): void {
    this.db.prepare(`UPDATE building SET deleted_at=?, updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id)
  }

  // ─── 房间 ─────────────────────────────────────────────────
  findAllRooms(buildingId?: string): RoomRow[] {
    if (buildingId) {
      return this.db
        .prepare<[string], RoomRow>(`SELECT * FROM room WHERE deleted_at IS NULL AND building_id=? ORDER BY floor, room_no`)
        .all(buildingId) as RoomRow[]
    }
    return this.db
      .prepare<[], RoomRow>(`SELECT * FROM room WHERE deleted_at IS NULL ORDER BY building_id, floor, room_no`)
      .all() as RoomRow[]
  }

  findRoomById(id: string): RoomRow | null {
    return (this.db.prepare<[string], RoomRow>(`SELECT * FROM room WHERE id=?`).get(id) as RoomRow | undefined) ?? null
  }

  insertRoom(data: Omit<RoomRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): RoomRow {
    const now = Date.now()
    const row: RoomRow = { ...data, id: nanoid(), created_at: now, updated_at: now, deleted_at: null }
    this.db.prepare(`INSERT INTO room (id,building_id,floor,room_no,room_type,capacity,price,status,remark,created_at,updated_at,deleted_at)
      VALUES (@id,@building_id,@floor,@room_no,@room_type,@capacity,@price,@status,@remark,@created_at,@updated_at,@deleted_at)`).run(row)
    return row
  }

  updateRoom(id: string, data: Partial<Omit<RoomRow, 'id' | 'created_at' | 'deleted_at'>>): void {
    const now = Date.now()
    const fields = Object.keys(data)
    if (!fields.length) return
    const sets = [...fields, 'updated_at'].map(f => `${f}=@${f}`).join(',')
    this.db.prepare(`UPDATE room SET ${sets} WHERE id=@id`).run({ ...data, updated_at: now, id })
  }

  deleteRoom(id: string): void {
    this.db.prepare(`UPDATE room SET deleted_at=?, updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id)
  }

  // ─── 床位 ─────────────────────────────────────────────────
  findAllBeds(roomId?: string): BedRow[] {
    if (roomId) {
      return this.db
        .prepare<[string], BedRow>(`SELECT * FROM bed WHERE deleted_at IS NULL AND room_id=? ORDER BY bed_no`)
        .all(roomId) as BedRow[]
    }
    return this.db
      .prepare<[], BedRow>(`SELECT * FROM bed WHERE deleted_at IS NULL ORDER BY room_id, bed_no`)
      .all() as BedRow[]
  }

  findBedById(id: string): BedRow | null {
    return (this.db.prepare<[string], BedRow>(`SELECT * FROM bed WHERE id=?`).get(id) as BedRow | undefined) ?? null
  }

  findAvailableBeds(): BedRow[] {
    return this.db
      .prepare<[], BedRow>(`SELECT * FROM bed WHERE deleted_at IS NULL AND status='available' ORDER BY room_id, bed_no`)
      .all() as BedRow[]
  }

  insertBed(data: Omit<BedRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): BedRow {
    const now = Date.now()
    const row: BedRow = { ...data, id: nanoid(), created_at: now, updated_at: now, deleted_at: null }
    this.db.prepare(`INSERT INTO bed (id,room_id,bed_no,status,elderly_id,remark,created_at,updated_at,deleted_at)
      VALUES (@id,@room_id,@bed_no,@status,@elderly_id,@remark,@created_at,@updated_at,@deleted_at)`).run(row)
    return row
  }

  updateBed(id: string, data: Partial<Omit<BedRow, 'id' | 'created_at' | 'deleted_at'>>): void {
    const now = Date.now()
    const fields = Object.keys(data)
    if (!fields.length) return
    const sets = [...fields, 'updated_at'].map(f => `${f}=@${f}`).join(',')
    this.db.prepare(`UPDATE bed SET ${sets} WHERE id=@id`).run({ ...data, updated_at: now, id })
  }

  deleteBed(id: string): void {
    this.db.prepare(`UPDATE bed SET deleted_at=?, updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id)
  }

  /** 床位统计 */
  getBedStats(): { total: number; available: number; occupied: number; maintenance: number } {
    const row = this.db.prepare<[], { total: number; available: number; occupied: number; maintenance: number }>(`
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN status='available'   THEN 1 ELSE 0 END) AS available,
        SUM(CASE WHEN status='occupied'    THEN 1 ELSE 0 END) AS occupied,
        SUM(CASE WHEN status='maintenance' THEN 1 ELSE 0 END) AS maintenance
      FROM bed WHERE deleted_at IS NULL
    `).get() as { total: number; available: number; occupied: number; maintenance: number }
    return row
  }
}
