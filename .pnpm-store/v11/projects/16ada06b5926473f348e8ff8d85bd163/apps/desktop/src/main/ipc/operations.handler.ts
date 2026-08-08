import { app, dialog, shell } from 'electron';
import { randomUUID } from 'node:crypto';
import { copyFile, mkdir } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';
import type { IpcMain } from 'electron';
import type { OperationsRepo } from '@yanglao/db';

export function registerOperationsHandlers(ipc: IpcMain, repo: OperationsRepo): void {
  ipc.handle('operations:risk-summary', () => repo.findRiskSummary());
  ipc.handle('operations:handover:list', () => repo.findHandovers());
  ipc.handle('operations:handover:create', (_e, data) => repo.createHandover(data));
  ipc.handle('operations:handover:acknowledge', (_e, { id, incomingStaff }) => {
    repo.acknowledgeHandover(id, incomingStaff);
    return { ok: true };
  });

  ipc.handle('operations:incident:list', (_e, includeClosed?: boolean) => repo.findIncidents(includeClosed));
  ipc.handle('operations:incident:create', (_e, data) => repo.createIncident(data));
  ipc.handle('operations:incident:start', (_e, { id, responsible }) => {
    repo.startIncident(id, responsible ?? null);
    return { ok: true };
  });
  ipc.handle('operations:incident:notify-family', (_e, id: string) => {
    repo.notifyIncidentFamily(id);
    return { ok: true };
  });
  ipc.handle('operations:incident:close', (_e, { id, closeNote }) => {
    repo.closeIncident(id, closeNote);
    return { ok: true };
  });

  ipc.handle('operations:visitor:list', (_e, includeFinished?: boolean) => repo.findVisitors(includeFinished));
  ipc.handle('operations:visitor:create', (_e, data) => repo.createVisitor(data));
  ipc.handle('operations:visitor:checkin', (_e, id: string) => {
    repo.checkInVisitor(id);
    return { ok: true };
  });
  ipc.handle('operations:visitor:checkout', (_e, { id, leaveAt }) => {
    repo.checkOutVisitor(id, leaveAt);
    return { ok: true };
  });
  ipc.handle('operations:visitor:cancel', (_e, id: string) => {
    repo.cancelVisitor(id);
    return { ok: true };
  });

  ipc.handle('operations:communication:list', (_e, openOnly?: boolean) => repo.findCommunications(openOnly));
  ipc.handle('operations:communication:create', (_e, data) => repo.createCommunication(data));
  ipc.handle('operations:communication:close', (_e, id: string) => {
    repo.closeCommunication(id);
    return { ok: true };
  });

  ipc.handle('operations:inventory:list', () => repo.findInventory());
  ipc.handle('operations:inventory:create', (_e, data) => repo.createInventoryItem(data));
  ipc.handle('operations:inventory:transactions', (_e, itemId: string) => repo.findInventoryTransactions(itemId));
  ipc.handle('operations:inventory:transact', (_e, data) => repo.transactInventory(data));

  ipc.handle('operations:document:list', (_e, elderlyId?: string) => repo.findDocuments(elderlyId));
  ipc.handle('operations:document:create', (_e, data) => repo.createDocument(data));
  ipc.handle('operations:document:attachment:select', async () => {
    const result = await dialog.showOpenDialog({
      title: '选择养老服务文书',
      properties: ['openFile'],
      filters: [{ name: '文书附件', extensions: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'webp'] }],
    });
    if (result.canceled || result.filePaths.length === 0) return { canceled: true };
    const sourcePath = result.filePaths[0];
    const attachmentDir = join(app.getPath('userData'), 'elderly-documents');
    await mkdir(attachmentDir, { recursive: true });
    const filePath = join(attachmentDir, `${Date.now()}-${randomUUID()}${extname(sourcePath).toLowerCase()}`);
    await copyFile(sourcePath, filePath);
    return { canceled: false, filePath, fileName: basename(sourcePath) };
  });
  ipc.handle('operations:document:attachment:open', async (_e, filePath: string) => {
    const error = await shell.openPath(filePath);
    if (error) throw new Error(error);
    return { ok: true };
  });

  ipc.handle('operations:health-alert:list', (_e, includeResolved?: boolean) => repo.findHealthAlerts(includeResolved));
  ipc.handle('operations:health-alert:start', (_e, id: string) => {
    repo.startHealthAlert(id);
    return { ok: true };
  });
  ipc.handle('operations:health-alert:resolve', (_e, { id, resolver, resolution }) => {
    repo.resolveHealthAlert(id, resolver, resolution);
    return { ok: true };
  });
}
