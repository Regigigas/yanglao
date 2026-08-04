// apps/desktop/src/main/ipc/fee.handler.ts
import type { IpcMain } from 'electron'
import type { FeeRepo } from '@yanglao/db'

export function registerFeeHandlers(ipc: IpcMain, repo: FeeRepo): void {
  // 费用项目
  ipc.handle('fee:item:list', (_e, activeOnly?: boolean) => repo.findAllFeeItems(activeOnly))
  ipc.handle('fee:item:create', (_e, data) => repo.insertFeeItem(data))
  ipc.handle('fee:item:update', (_e, { id, data }) => { repo.updateFeeItem(id, data); return { ok: true } })
  ipc.handle('fee:item:delete', (_e, id: string) => { repo.deleteFeeItem(id); return { ok: true } })

  // 押金
  ipc.handle('fee:deposit:list', (_e, elderlyId: string) => repo.findDeposits(elderlyId))
  ipc.handle('fee:deposit:balance', (_e, elderlyId: string) => repo.getDepositBalance(elderlyId))
  ipc.handle('fee:deposit:create', (_e, data) => repo.insertDeposit(data))

  // 账单
  ipc.handle('fee:bill:list', (_e, elderlyId?: string) => repo.findBills(elderlyId))
  ipc.handle('fee:bill:get', (_e, elderlyId: string, billMonth: string) => repo.findBill(elderlyId, billMonth))
  ipc.handle('fee:bill:overdue', () => repo.findOverdueBills())
  ipc.handle('fee:bill:create', (_e, data) => repo.insertBill(data))
  ipc.handle('fee:bill:create-with-details', (_e, { data, details }) => repo.insertBillWithDetails(data, details))
  ipc.handle('fee:bill:update', (_e, { id, data }) => { repo.updateBill(id, data); return { ok: true } })

  // 账单明细
  ipc.handle('fee:bill:detail:list', (_e, billId: string) => repo.findBillDetails(billId))
  ipc.handle('fee:bill:detail:create', (_e, data) => repo.insertBillDetail(data))

  // 收款
  ipc.handle('fee:payment:list', (_e, elderlyId?: string, billId?: string) => repo.findPayments(elderlyId, billId))
  ipc.handle('fee:payment:create', (_e, data) => repo.insertPayment(data))

  // 统计
  ipc.handle('fee:stats', (_e, month: string) => repo.getFinancialStats(month))
}
