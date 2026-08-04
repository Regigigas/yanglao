// packages/db/src/repositories/announcement.repo.ts
// 全员公告：发布生命周期与按账号阅读记录

import type { Database } from 'better-sqlite3';
import { nanoid } from 'nanoid';
import type {
  AnnouncementForUserRow,
  AnnouncementReadStats,
  AnnouncementReadUserRow,
  AnnouncementRow,
} from '../schema';
import { ChangeLogRepo } from './change-log.repo';

export class AnnouncementRepo {
  private changeLog: ChangeLogRepo;

  constructor(private db: Database) {
    this.changeLog = new ChangeLogRepo(db);
  }

  findAll(): AnnouncementRow[] {
    return this.db
      .prepare<[], AnnouncementRow>(
        `SELECT * FROM announcement WHERE deleted_at IS NULL
       ORDER BY is_pinned DESC, publish_at DESC, created_at DESC`,
      )
      .all() as AnnouncementRow[];
  }

  /** 仅返回当前应展示给用户的公告，并附带该用户的已读状态。 */
  findVisibleForUser(
    userId: string,
    now = Date.now(),
  ): AnnouncementForUserRow[] {
    return this.db
      .prepare<[string, number, number], AnnouncementForUserRow>(
        `SELECT a.*, CASE WHEN r.user_id IS NULL THEN 0 ELSE 1 END AS is_read, r.read_at
       FROM announcement a
       LEFT JOIN announcement_read r ON r.announcement_id=a.id AND r.user_id=?
       WHERE a.deleted_at IS NULL AND a.status='published' AND a.publish_at<=?
         AND (a.expire_at IS NULL OR a.expire_at>?)
       ORDER BY a.is_pinned DESC, a.level='urgent' DESC, a.publish_at DESC`,
      )
      .all(userId, now, now) as AnnouncementForUserRow[];
  }

  insert(
    data: Omit<
      AnnouncementRow,
      'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'published_by'
    >,
  ): AnnouncementRow {
    const now = Date.now();
    const row: AnnouncementRow = {
      ...data,
      id: nanoid(),
      published_by: data.status === 'published' ? data.created_by : null,
      created_at: now,
      updated_at: now,
      deleted_at: null,
    };
    this.db
      .prepare(
        `INSERT INTO announcement
       (id,title,content,level,status,is_pinned,publish_at,expire_at,created_by,published_by,created_at,updated_at,deleted_at)
       VALUES (@id,@title,@content,@level,@status,@is_pinned,@publish_at,@expire_at,@created_by,@published_by,@created_at,@updated_at,@deleted_at)`,
      )
      .run(row);
    this.writeChange('INSERT', row.id, row);
    return row;
  }

  update(
    id: string,
    data: Partial<
      Omit<AnnouncementRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>
    >,
  ): void {
    const fields = Object.keys(data);
    if (!fields.length) return;
    const updated_at = Date.now();
    const sets = [...fields, 'updated_at']
      .map((field) => `${field}=@${field}`)
      .join(',');
    this.db
      .prepare(
        `UPDATE announcement SET ${sets} WHERE id=@id AND deleted_at IS NULL`,
      )
      .run({ ...data, id, updated_at });
    this.writeChange('UPDATE', id, { id, ...data, updated_at });
  }

  publish(id: string, userId: string): void {
    const updated_at = Date.now();
    this.db
      .prepare(
        `UPDATE announcement SET status='published', publish_at=?, published_by=?, updated_at=?
       WHERE id=? AND deleted_at IS NULL`,
      )
      .run(updated_at, userId, updated_at, id);
    this.writeChange('UPDATE', id, {
      id,
      status: 'published',
      publish_at: updated_at,
      published_by: userId,
      updated_at,
    });
  }

  withdraw(id: string): void {
    this.update(id, { status: 'withdrawn' });
  }

  softDelete(id: string): void {
    const deleted_at = Date.now();
    this.db
      .prepare(`UPDATE announcement SET deleted_at=?, updated_at=? WHERE id=?`)
      .run(deleted_at, deleted_at, id);
    this.writeChange('DELETE', id, { id, deleted_at });
  }

  markRead(announcementId: string, userId: string): void {
    this.db
      .prepare(
        `INSERT OR IGNORE INTO announcement_read (announcement_id,user_id,read_at) VALUES (?,?,?)`,
      )
      .run(announcementId, userId, Date.now());
  }

  getReadStats(announcementId: string): AnnouncementReadStats {
    const row = this.db
      .prepare<[string], AnnouncementReadStats>(
        `SELECT COUNT(u.id) AS total,
              COUNT(r.user_id) AS read,
              COUNT(u.id) - COUNT(r.user_id) AS unread
       FROM sys_user u
       LEFT JOIN announcement_read r ON r.user_id=u.id AND r.announcement_id=?
       WHERE u.deleted_at IS NULL AND u.status='active'`,
      )
      .get(announcementId) as AnnouncementReadStats | undefined;
    return row ?? { total: 0, read: 0, unread: 0 };
  }

  findReadUsers(announcementId: string): AnnouncementReadUserRow[] {
    return this.db
      .prepare<[string], AnnouncementReadUserRow>(
        `SELECT u.id AS user_id, u.real_name, u.username, r.read_at
       FROM announcement_read r
       JOIN sys_user u ON u.id=r.user_id
       WHERE r.announcement_id=?
       ORDER BY r.read_at DESC`,
      )
      .all(announcementId) as AnnouncementReadUserRow[];
  }

  private writeChange(
    operation: 'INSERT' | 'UPDATE' | 'DELETE',
    recordId: string,
    payload: unknown,
  ): void {
    this.changeLog.insert({
      table_name: 'announcement',
      record_id: recordId,
      operation,
      payload: JSON.stringify(payload),
    });
  }
}
