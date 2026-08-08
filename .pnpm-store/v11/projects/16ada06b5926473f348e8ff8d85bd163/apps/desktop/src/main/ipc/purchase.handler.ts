// apps/desktop/src/main/ipc/purchase.handler.ts
import type { IpcMain } from 'electron'
import type { SupplierRepo } from '@yanglao/db'
import type { PurchaseOrderRepo } from '@yanglao/db'

export function registerPurchaseHandlers(
  ipc: IpcMain,
  supplierRepo: SupplierRepo,
  orderRepo: PurchaseOrderRepo
): void {
  // ── 供应商 ──
  ipc.handle('purchase:supplier:list',   ()            => supplierRepo.findAll())
  ipc.handle('purchase:supplier:create', (_e, data)    => supplierRepo.insert(data))
  ipc.handle('purchase:supplier:update', (_e, { id, data }) => { supplierRepo.update(id, data); return { ok: true } })
  ipc.handle('purchase:supplier:delete', (_e, id)      => { supplierRepo.delete(id); return { ok: true } })

  // ── 采购单 ──
  ipc.handle('purchase:order:list',          (_e, status)            => orderRepo.findAll(status))
  ipc.handle('purchase:order:items',         (_e, orderId)           => orderRepo.findItems(orderId))
  ipc.handle('purchase:order:stats',         ()                      => orderRepo.getStats())
  ipc.handle('purchase:order:create',        (_e, { order, items })  => orderRepo.create(order, items))
  ipc.handle('purchase:order:update-status', (_e, { id, status, remark }) => {
    orderRepo.updateStatus(id, status, remark)
    return { ok: true }
  })
  ipc.handle('purchase:order:delete', (_e, id) => { orderRepo.delete(id); return { ok: true } })
}
