import type { IpcMain } from 'electron'
import type { AssistedServicesRepo } from '@yanglao/db'

export function registerAssistedServicesHandlers(ipc: IpcMain, repo: AssistedServicesRepo): void {
  ipc.handle('assisted:catalog:list', (_event, activeOnly?: boolean) => repo.findServiceCatalog(activeOnly))
  ipc.handle('assisted:catalog:create', (_event, data) => repo.createServiceCatalog(data))
  ipc.handle('assisted:catalog:update', (_event, { id, data }) => repo.updateServiceCatalog(id, data))

  ipc.handle('assisted:purchase:list', (_event, query) => repo.findPurchaseOrders(query))
  ipc.handle('assisted:purchase:get', (_event, id: string) => repo.findPurchaseOrder(id))
  ipc.handle('assisted:purchase:items', (_event, id: string) => repo.findPurchaseItems(id))
  ipc.handle('assisted:purchase:create', (_event, { order, items }) => repo.createPurchaseOrder(order, items))
  ipc.handle('assisted:purchase:assign', (_event, { id, assigneeId, assigneeName }) => repo.assignPurchase(id, assigneeId, assigneeName))
  ipc.handle('assisted:purchase:verify-prescription', (_event, { id, prescriptionNo, verifier }) => repo.verifyPrescription(id, prescriptionNo, verifier))
  ipc.handle('assisted:purchase:start', (_event, id: string) => repo.startPurchase(id))
  ipc.handle('assisted:purchase:deliver', (_event, id: string) => repo.startDelivery(id))
  ipc.handle('assisted:purchase:sign', (_event, { id, signedBy }) => repo.signPurchase(id, signedBy))
  ipc.handle('assisted:purchase:settle', (_event, { id, method }) => repo.settlePurchase(id, method))
  ipc.handle('assisted:purchase:cancel', (_event, { id, reason }) => repo.cancelPurchase(id, reason))

  ipc.handle('assisted:partner:list', (_event, activeOnly?: boolean) => repo.findPartners(activeOnly))
  ipc.handle('assisted:partner:create', (_event, data) => repo.createPartner(data))
  ipc.handle('assisted:partner:update', (_event, { id, data }) => repo.updatePartner(id, data))

  ipc.handle('assisted:referral:list', (_event, query) => repo.findReferrals(query))
  ipc.handle('assisted:referral:get', (_event, id: string) => repo.findReferral(id))
  ipc.handle('assisted:referral:create', (_event, data) => repo.createReferral(data))
  ipc.handle('assisted:referral:confirm', (_event, id: string) => repo.confirmReferral(id))
  ipc.handle('assisted:referral:depart', (_event, id: string) => repo.departReferral(id))
  ipc.handle('assisted:referral:consult', (_event, id: string) => repo.startConsultation(id))
  ipc.handle('assisted:referral:complete', (_event, { id, data }) => repo.completeReferral(id, data))
  ipc.handle('assisted:referral:cancel', (_event, { id, reason }) => repo.cancelReferral(id, reason))
  ipc.handle('assisted:follow-up:list', (_event, referralId?: string) => repo.findFollowUps(referralId))
  ipc.handle('assisted:follow-up:create', (_event, data) => repo.createFollowUp(data))
  ipc.handle('assisted:stats', () => repo.getStats())
}
