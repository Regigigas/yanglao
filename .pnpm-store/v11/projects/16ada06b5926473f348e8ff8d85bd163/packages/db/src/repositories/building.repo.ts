// packages/db/src/repositories/building.repo.ts
// 床位管理仓库（楼栋/房间/床位）

import type { Database } from 'better-sqlite3'
import { nanoid } from 'nanoid'
import type {
  BedRow,
  BuildingRow,
  CorridorRow,
  RoomGenerateInput,
  RoomGenerateResult,
  RoomRow,
  RoomTypeRow,
} from '../schema'

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

  // ─── 房型 ─────────────────────────────────────────────────
  findAllRoomTypes(activeOnly = false): RoomTypeRow[] {
    return this.db
      .prepare<[number], RoomTypeRow>(`
        SELECT * FROM room_type
        WHERE deleted_at IS NULL AND (? = 0 OR status='active')
        ORDER BY sort_order, name
      `)
      .all(activeOnly ? 1 : 0) as RoomTypeRow[]
  }

  insertRoomType(data: Omit<RoomTypeRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): RoomTypeRow {
    const now = Date.now()
    const row: RoomTypeRow = { ...data, id: nanoid(), created_at: now, updated_at: now, deleted_at: null }
    this.db.prepare(`
      INSERT INTO room_type
        (id,code,name,default_capacity,default_price,area,has_window,has_private_bathroom,
         care_equipment,status,remark,sort_order,created_at,updated_at,deleted_at)
      VALUES
        (@id,@code,@name,@default_capacity,@default_price,@area,@has_window,@has_private_bathroom,
         @care_equipment,@status,@remark,@sort_order,@created_at,@updated_at,@deleted_at)
    `).run(row)
    return row
  }

  updateRoomType(id: string, data: Partial<Omit<RoomTypeRow, 'id' | 'created_at' | 'deleted_at'>>): void {
    const now = Date.now()
    const fields = Object.keys(data)
    if (!fields.length) return
    const sets = [...fields, 'updated_at'].map(f => `${f}=@${f}`).join(',')
    this.db.prepare(`UPDATE room_type SET ${sets} WHERE id=@id`).run({ ...data, updated_at: now, id })
  }

  deleteRoomType(id: string): void {
    this.db.prepare(`UPDATE room_type SET deleted_at=?, updated_at=?, status='inactive' WHERE id=?`).run(Date.now(), Date.now(), id)
    this.db.prepare(`UPDATE room SET room_type_id=NULL, updated_at=? WHERE room_type_id=?`).run(Date.now(), id)
  }

  // ─── 走廊/分区 ─────────────────────────────────────────────
  findAllCorridors(buildingId?: string): CorridorRow[] {
    if (buildingId) {
      return this.db
        .prepare<[string], CorridorRow>(`
          SELECT * FROM corridor
          WHERE deleted_at IS NULL AND building_id=?
          ORDER BY floor, sort_order, name
        `)
        .all(buildingId) as CorridorRow[]
    }
    return this.db
      .prepare<[], CorridorRow>(`
        SELECT * FROM corridor
        WHERE deleted_at IS NULL
        ORDER BY building_id, floor, sort_order, name
      `)
      .all() as CorridorRow[]
  }

  insertCorridor(data: Omit<CorridorRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): CorridorRow {
    const now = Date.now()
    const row: CorridorRow = { ...data, id: nanoid(), created_at: now, updated_at: now, deleted_at: null }
    this.db.prepare(`
      INSERT INTO corridor (id,building_id,floor,name,direction,sort_order,remark,created_at,updated_at,deleted_at)
      VALUES (@id,@building_id,@floor,@name,@direction,@sort_order,@remark,@created_at,@updated_at,@deleted_at)
    `).run(row)
    return row
  }

  updateCorridor(id: string, data: Partial<Omit<CorridorRow, 'id' | 'created_at' | 'deleted_at'>>): void {
    const now = Date.now()
    const fields = Object.keys(data)
    if (!fields.length) return
    const sets = [...fields, 'updated_at'].map(f => `${f}=@${f}`).join(',')
    this.db.prepare(`UPDATE corridor SET ${sets} WHERE id=@id`).run({ ...data, updated_at: now, id })
  }

  deleteCorridor(id: string): void {
    this.db.prepare(`UPDATE corridor SET deleted_at=?, updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id)
    this.db.prepare(`UPDATE room SET corridor_id=NULL, layout_side='none', updated_at=? WHERE corridor_id=?`).run(Date.now(), id)
  }

  // ─── 房间 ─────────────────────────────────────────────────
  findAllRooms(buildingId?: string): RoomRow[] {
    if (buildingId) {
      return this.db
        .prepare<[string], RoomRow>(`
          SELECT * FROM room
          WHERE deleted_at IS NULL AND building_id=?
          ORDER BY floor, COALESCE(corridor_id, ''), layout_side, sort_order, room_no
        `)
        .all(buildingId) as RoomRow[]
    }
    return this.db
      .prepare<[], RoomRow>(`
        SELECT * FROM room
        WHERE deleted_at IS NULL
        ORDER BY building_id, floor, COALESCE(corridor_id, ''), layout_side, sort_order, room_no
      `)
      .all() as RoomRow[]
  }

  findRoomById(id: string): RoomRow | null {
    return (this.db.prepare<[string], RoomRow>(`SELECT * FROM room WHERE id=?`).get(id) as RoomRow | undefined) ?? null
  }

  insertRoom(data: Omit<RoomRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): RoomRow {
    const now = Date.now()
    const defaults = {
      corridor_id: null,
      room_type_id: null,
      layout_side: 'none',
      sort_order: 0,
    } satisfies Pick<RoomRow, 'corridor_id' | 'room_type_id' | 'layout_side' | 'sort_order'>
    const row: RoomRow = {
      ...defaults,
      ...data,
      id: nanoid(),
      created_at: now,
      updated_at: now,
      deleted_at: null,
    }
    this.db.prepare(`
      INSERT INTO room
        (id,building_id,floor,corridor_id,room_no,room_type,room_type_id,capacity,price,status,layout_side,sort_order,remark,created_at,updated_at,deleted_at)
      VALUES
        (@id,@building_id,@floor,@corridor_id,@room_no,@room_type,@room_type_id,@capacity,@price,@status,@layout_side,@sort_order,@remark,@created_at,@updated_at,@deleted_at)
    `).run(row)
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

  generateRooms(input: RoomGenerateInput): RoomGenerateResult {
    const sides: Array<'left' | 'right' | 'none'> = input.side === 'both' ? ['left', 'right'] : [input.side]
    const result: RoomGenerateResult = { rooms: [], beds: [], skipped: [] }
    const existing = this.db.prepare<[string, number, string], { id: string }>(`
      SELECT id FROM room
      WHERE deleted_at IS NULL AND building_id=? AND floor=? AND room_no=?
    `)
    const tx = this.db.transaction(() => {
      let order = input.start_no
      for (let index = 0; index < input.room_count; index += 1) {
        for (const side of sides) {
          const roomOrder = order
          const roomNo = `${input.room_prefix}${String(order).padStart(input.number_width, '0')}${input.room_suffix}`
          order += 1
          if (existing.get(input.building_id, input.floor, roomNo)) {
            if (input.skip_existing) {
              result.skipped.push(roomNo)
              continue
            }
            throw new Error(`房间号 ${roomNo} 已存在`)
          }

          const room = this.insertRoom({
            building_id: input.building_id,
            floor: input.floor,
            corridor_id: input.corridor_id || null,
            room_no: roomNo,
            room_type: input.room_type,
            room_type_id: input.room_type_id || null,
            capacity: input.capacity,
            price: input.price,
            status: 'available',
            layout_side: side,
            sort_order: roomOrder,
            remark: null,
          })
          result.rooms.push(room)

          for (let bedIndex = 0; bedIndex < input.capacity; bedIndex += 1) {
            const bedNo = input.bed_style === 'letter'
              ? `${input.bed_prefix}${String.fromCharCode(65 + bedIndex)}`
              : `${input.bed_prefix}${bedIndex + 1}`
            result.beds.push(this.insertBed({
              room_id: room.id,
              bed_no: bedNo,
              status: 'available',
              elderly_id: null,
              remark: null,
            }))
          }
        }
      }
    })
    tx()
    return result
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
