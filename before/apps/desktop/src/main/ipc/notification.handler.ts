// apps/desktop/src/main/ipc/notification.handler.ts
import type { IpcMain } from 'electron'
import type { NotificationRepo } from '@yanglao/db'

export function registerNotificationHandlers(ipc: IpcMain, repo: NotificationRepo): void {
  ipc.handle('notify:list', (_e, unreadOnly?: boolean) => repo.findAll(unreadOnly))
  ipc.handle('notify:unread:count', () => repo.getUnreadCount())
  ipc.handle('notify:create', (_e, data) => repo.insert(data))
  ipc.handle('notify:read', (_e, id: string) => { repo.markRead(id); return { ok: true } })
  ipc.handle('notify:unread', (_e, id: string) => { repo.markUnread(id); return { ok: true } })
  ipc.handle('notify:read:all', () => { repo.markAllRead(); return { ok: true } })
  ipc.handle('notify:delete', (_e, id: string) => { repo.delete(id); return { ok: true } })
}
