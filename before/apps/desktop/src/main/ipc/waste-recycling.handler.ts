import type { IpcMain } from 'electron'
import type { WasteRecyclingRepo } from '@yanglao/db'

export function registerWasteRecyclingHandlers(ipc: IpcMain, repo: WasteRecyclingRepo): void {
  ipc.handle('waste:category:list', (_event, activeOnly?: boolean) => repo.findCategories(activeOnly))
  ipc.handle('waste:category:create', (_event, data) => repo.createCategory(data))
  ipc.handle('waste:category:update', (_event, { id, data }) => repo.updateCategory(id, data))
  ipc.handle('waste:category:delete', (_event, id: string) => {
    repo.deleteCategory(id)
    return { ok: true }
  })

  ipc.handle('waste:order:list', (_event, query) => repo.findOrders(query))
  ipc.handle('waste:order:get', (_event, id: string) => repo.findOrder(id))
  ipc.handle('waste:order:items', (_event, id: string) => repo.findItems(id))
  ipc.handle('waste:order:create', (_event, data) => repo.createOrder(data))
  ipc.handle('waste:order:assign', (_event, { id, assigneeId, assigneeName }) =>
    repo.assign(id, assigneeId, assigneeName))
  ipc.handle('waste:order:start', (_event, id: string) => repo.startCollection(id))
  ipc.handle('waste:order:weigh', (_event, { id, items }) => repo.weigh(id, items))
  ipc.handle('waste:order:settle', (_event, { id, data }) => repo.settle(id, data))
  ipc.handle('waste:order:complete', (_event, id: string) => repo.complete(id))
  ipc.handle('waste:order:cancel', (_event, { id, reason }) => repo.cancel(id, reason))
  ipc.handle('waste:settlement:get', (_event, orderId: string) => repo.findSettlement(orderId))

  ipc.handle('waste:points:list', (_event, elderlyId?: string) => repo.findPointsLedger(elderlyId))
  ipc.handle('waste:points:balance', (_event, elderlyId: string) => repo.getPointsBalance(elderlyId))

  ipc.handle('waste:inventory:list', (_event, status) => repo.findInventory(status))
  ipc.handle('waste:inventory:transactions', (_event, lotId: string) => repo.findInventoryTransactions(lotId))
  ipc.handle('waste:inventory:transact', (_event, { lotId, data }) => repo.transactInventory(lotId, data))

  ipc.handle('waste:stats', (_event, { startDate, endDate } = {}) => repo.getStats(startDate, endDate))
}
