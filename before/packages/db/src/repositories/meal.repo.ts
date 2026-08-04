// packages/db/src/repositories/meal.repo.ts
// 餐饮管理仓库

import type { Database } from 'better-sqlite3'
import { nanoid } from 'nanoid'
import type { MealMenuRow, MealRecordRow, NutritionPlanRow } from '../schema'

export class MealRepo {
  constructor(private db: Database) {}

  // ─── 菜单 ──────────────────────────────────────────────────
  // menu_date 现在存储为 'YYYY-MM-DD HH:mm:ss'，用 date() 只取日期部分比较，
  // 确保同一天不同时间录入的菜单仍能按天正确归类查询。
  findMenuByDate(date: string): MealMenuRow[] {
    return this.db
      .prepare<[string], MealMenuRow>(`SELECT * FROM meal_menu WHERE date(menu_date)=date(?) AND deleted_at IS NULL ORDER BY meal_type`)
      .all(date) as MealMenuRow[]
  }

  findMenuByRange(startDate: string, endDate: string): MealMenuRow[] {
    return this.db
      .prepare<[string, string], MealMenuRow>(
        `SELECT * FROM meal_menu WHERE date(menu_date) >= date(?) AND date(menu_date) <= date(?) AND deleted_at IS NULL ORDER BY menu_date, meal_type`
      )
      .all(startDate, endDate) as MealMenuRow[]
  }

  insertMenu(data: Omit<MealMenuRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): MealMenuRow {
    const now = Date.now()
    const row: MealMenuRow = { ...data, id: nanoid(), created_at: now, updated_at: now, deleted_at: null }
    this.db
      .prepare(`INSERT INTO meal_menu (id,menu_date,meal_type,dishes,calories,remark,created_by,created_at,updated_at,deleted_at)
        VALUES (@id,@menu_date,@meal_type,@dishes,@calories,@remark,@created_by,@created_at,@updated_at,@deleted_at)`)
      .run(row)
    return row
  }

  updateMenu(id: string, data: Partial<Omit<MealMenuRow, 'id' | 'created_at' | 'deleted_at'>>): void {
    const now = Date.now()
    const fields = Object.keys(data)
    if (!fields.length) return
    const sets = [...fields, 'updated_at'].map(f => `${f}=@${f}`).join(',')
    this.db.prepare(`UPDATE meal_menu SET ${sets} WHERE id=@id`).run({ ...data, updated_at: now, id })
  }

  deleteMenu(id: string): void {
    this.db.prepare(`UPDATE meal_menu SET deleted_at=?, updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id)
  }

  // ─── 用餐记录 ──────────────────────────────────────────────
  findMealRecords(elderlyId: string, limit = 30): MealRecordRow[] {
    return this.db
      .prepare<[string, number], MealRecordRow>(
        `SELECT * FROM meal_record WHERE elderly_id=? AND deleted_at IS NULL ORDER BY record_date DESC, meal_type LIMIT ?`
      )
      .all(elderlyId, limit) as MealRecordRow[]
  }

  // record_date 现在存储为 'YYYY-MM-DD HH:mm:ss'，用 date() 只取日期部分比较
  findMealRecordsByDate(date: string): MealRecordRow[] {
    return this.db
      .prepare<[string], MealRecordRow>(
        `SELECT * FROM meal_record WHERE date(record_date)=date(?) AND deleted_at IS NULL ORDER BY meal_type, elderly_id`
      )
      .all(date) as MealRecordRow[]
  }

  insertMealRecord(data: Omit<MealRecordRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): MealRecordRow {
    const now = Date.now()
    const row: MealRecordRow = { ...data, id: nanoid(), created_at: now, updated_at: now, deleted_at: null }
    this.db
      .prepare(`INSERT INTO meal_record (id,elderly_id,record_date,meal_type,status,intake_rate,remark,recorder,created_at,updated_at,deleted_at)
        VALUES (@id,@elderly_id,@record_date,@meal_type,@status,@intake_rate,@remark,@recorder,@created_at,@updated_at,@deleted_at)`)
      .run(row)
    return row
  }

  updateMealRecord(id: string, data: Partial<Omit<MealRecordRow, 'id' | 'created_at' | 'deleted_at'>>): void {
    const now = Date.now()
    const fields = Object.keys(data)
    if (!fields.length) return
    const sets = [...fields, 'updated_at'].map(f => `${f}=@${f}`).join(',')
    this.db.prepare(`UPDATE meal_record SET ${sets} WHERE id=@id`).run({ ...data, updated_at: now, id })
  }

  deleteMealRecord(id: string): void {
    this.db.prepare(`UPDATE meal_record SET deleted_at=?, updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id)
  }

  // ─── 营养搭配 ────────────────────────────────────────────────
  findNutritionPlans(elderlyId: string, includeInactive = true): NutritionPlanRow[] {
    const statusClause = includeInactive ? '' : ` AND status='active'`
    return this.db
      .prepare<[string], NutritionPlanRow>(
        `SELECT * FROM nutrition_plan WHERE elderly_id=? AND deleted_at IS NULL${statusClause} ORDER BY status='active' DESC, effective_date DESC, created_at DESC`
      )
      .all(elderlyId) as NutritionPlanRow[]
  }

  insertNutritionPlan(data: Omit<NutritionPlanRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): NutritionPlanRow {
    const now = Date.now()
    const row: NutritionPlanRow = { ...data, id: nanoid(), created_at: now, updated_at: now, deleted_at: null }
    this.db
      .prepare(`INSERT INTO nutrition_plan (id,elderly_id,diet_type,allergies,avoid_foods,daily_calories,protein_target,meal_advice,effective_date,expiry_date,status,remark,created_by,created_at,updated_at,deleted_at)
        VALUES (@id,@elderly_id,@diet_type,@allergies,@avoid_foods,@daily_calories,@protein_target,@meal_advice,@effective_date,@expiry_date,@status,@remark,@created_by,@created_at,@updated_at,@deleted_at)`)
      .run(row)
    return row
  }

  updateNutritionPlan(id: string, data: Partial<Omit<NutritionPlanRow, 'id' | 'created_at' | 'deleted_at'>>): void {
    const fields = Object.keys(data)
    if (!fields.length) return
    const sets = [...fields, 'updated_at'].map(f => `${f}=@${f}`).join(',')
    this.db.prepare(`UPDATE nutrition_plan SET ${sets} WHERE id=@id`).run({ ...data, updated_at: Date.now(), id })
  }

  deleteNutritionPlan(id: string): void {
    this.db.prepare(`UPDATE nutrition_plan SET deleted_at=?, updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id)
  }
}
