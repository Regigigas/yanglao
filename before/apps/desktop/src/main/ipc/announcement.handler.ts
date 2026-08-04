// apps/desktop/src/main/ipc/announcement.handler.ts

import type { IpcMain } from 'electron';
import type { AnnouncementRepo } from '@yanglao/db';

export function registerAnnouncementHandlers(
  ipc: IpcMain,
  repo: AnnouncementRepo,
): void {
  ipc.handle('announcement:list', () => repo.findAll());
  ipc.handle('announcement:visible', (_e, userId: string) =>
    repo.findVisibleForUser(userId),
  );
  ipc.handle('announcement:create', (_e, data) => repo.insert(data));
  ipc.handle(
    'announcement:update',
    (_e, payload: { id: string; data: unknown }) =>
      repo.update(payload.id, payload.data as never),
  );
  ipc.handle(
    'announcement:publish',
    (_e, payload: { id: string; userId: string }) => {
      repo.publish(payload.id, payload.userId);
      return { ok: true };
    },
  );
  ipc.handle('announcement:withdraw', (_e, id: string) => {
    repo.withdraw(id);
    return { ok: true };
  });
  ipc.handle('announcement:delete', (_e, id: string) => {
    repo.softDelete(id);
    return { ok: true };
  });
  ipc.handle(
    'announcement:read',
    (_e, payload: { announcementId: string; userId: string }) => {
      repo.markRead(payload.announcementId, payload.userId);
      return { ok: true };
    },
  );
  ipc.handle('announcement:read-stats', (_e, id: string) =>
    repo.getReadStats(id),
  );
  ipc.handle('announcement:read-users', (_e, id: string) =>
    repo.findReadUsers(id),
  );
}
