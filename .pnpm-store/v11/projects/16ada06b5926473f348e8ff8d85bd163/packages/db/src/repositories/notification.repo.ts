// packages/db/src/repositories/notification.repo.ts
// 系统通知仓库

import type { Database } from 'better-sqlite3'
import { nanoid } from 'nanoid'
import type { NotificationRow } from '../schema'

export class NotificationRepo {
  constructor(private db: Database) {}

  findAll(unreadOnly = false): NotificationRow[] {
    if (unreadOnly) {
      return this.db
        .prepare<[], NotificationRow>(`SELECT * FROM notification WHERE is_read=0 ORDER BY created_at DESC`)
        .all() as NotificationRow[]
    }
    return this.db
      .prepare<[], NotificationRow>(`SELECT * FROM notification ORDER BY created_at DESC LIMIT 100`)
      .all() as NotificationRow[]
  }

  getUnreadCount(): number {
    const row = this.db.prepare<[], { cnt: number }>(`SELECT COUNT(*) AS cnt FROM notification WHERE is_read=0`).get() as { cnt: number }
    return row?.cnt ?? 0
  }

  insert(data: Omit<NotificationRow, 'id' | 'created_at'>): NotificationRow {
    const now = Date.now()
    const row: NotificationRow = { ...data, id: nanoid(), created_at: now }
    this.db
      .prepare(`INSERT INTO notification (id,type,title,content,elderly_id,is_read,read_at,created_at)
        VALUES (@id,@type,@title,@content,@elderly_id,@is_read,@read_at,@created_at)`)
      .run(row)
    return row
  }

  markRead(id: string): void {
    this.db.prepare(`UPDATE notification SET is_read=1, read_at=? WHERE id=?`).run(Date.now(), id)
  }

  markUnread(id: string): void {
    this.db.prepare(`UPDATE notification SET is_read=0, read_at=NULL WHERE id=?`).run(id)
  }

  markAllRead(): void {
    this.db.prepare(`UPDATE notification SET is_read=1, read_at=? WHERE is_read=0`).run(Date.now())
  }

  delete(id: string): void {
    this.db.prepare(`DELETE FROM notification WHERE id=?`).run(id)
  }

  /** 生成生日提醒（今日/近7天生日的老人） */
  generateBirthdayReminders(db: Database): void {
    const today = new Date()
    const mmdd = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    const rows = db.prepare<[string], { id: string; name: string; birth_date: string }>(
      `SELECT id, name, birth_date FROM elderly WHERE deleted_at IS NULL AND status='active'
       AND birth_date IS NOT NULL AND substr(birth_date,6,5) = ?`
    ).all(mmdd) as { id: string; name: string; birth_date: string }[]

    for (const row of rows) {
      const existsToday = db.prepare<[string, number], { cnt: number }>(
        `SELECT COUNT(*) AS cnt FROM notification WHERE elderly_id=? AND type='birthday' AND created_at > ?`
      ).get(row.id, Date.now() - 86400000) as { cnt: number }
      if (!existsToday?.cnt) {
        this.insert({
          type: 'birthday',
          title: '生日提醒',
          content: `${row.name} 今天生日，请记得送上祝福！`,
          elderly_id: row.id,
          is_read: 0,
          read_at: null,
        })
      }
    }
  }
}
