// apps/desktop/src/main/ipc/meal.handler.ts
import type { IpcMain } from 'electron'
import type { MealRepo } from '@yanglao/db'

export function registerMealHandlers(ipc: IpcMain, repo: MealRepo): void {
  ipc.handle('meal:menu:bydate', (_e, date: string) => repo.findMenuByDate(date))
  ipc.handle('meal:menu:range', (_e, startDate: string, endDate: string) => repo.findMenuByRange(startDate, endDate))
  ipc.handle('meal:menu:create', (_e, data) => repo.insertMenu(data))
  ipc.handle('meal:menu:update', (_e, { id, data }) => { repo.updateMenu(id, data); return { ok: true } })
  ipc.handle('meal:menu:delete', (_e, id: string) => { repo.deleteMenu(id); return { ok: true } })

  ipc.handle('meal:record:list', (_e, elderlyId: string, limit?: number) => repo.findMealRecords(elderlyId, limit))
  ipc.handle('meal:record:bydate', (_e, date: string) => repo.findMealRecordsByDate(date))
  ipc.handle('meal:record:create', (_e, data) => repo.insertMealRecord(data))
  ipc.handle('meal:record:update', (_e, { id, data }) => { repo.updateMealRecord(id, data); return { ok: true } })
  ipc.handle('meal:record:delete', (_e, id: string) => { repo.deleteMealRecord(id); return { ok: true } })

  ipc.handle('meal:nutrition:list', (_e, elderlyId: string, includeInactive?: boolean) => repo.findNutritionPlans(elderlyId, includeInactive))
  ipc.handle('meal:nutrition:create', (_e, data) => repo.insertNutritionPlan(data))
  ipc.handle('meal:nutrition:update', (_e, { id, data }) => { repo.updateNutritionPlan(id, data); return { ok: true } })
  ipc.handle('meal:nutrition:delete', (_e, id: string) => { repo.deleteNutritionPlan(id); return { ok: true } })
}
