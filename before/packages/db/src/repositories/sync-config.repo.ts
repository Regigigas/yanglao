// packages/db/src/repositories/sync-config.repo.ts
// 同步配置读写（id 固定为 1，始终只有一行）

import type { Database } from 'better-sqlite3'
import type { SyncConfigRow } from '../schema'
import type { SyncConfig } from '@yanglao/core'

export class SyncConfigRepo {
  constructor(private db: Database) {}

  get(): SyncConfigRow {
    const row = this.db
      .prepare<[], SyncConfigRow>(`SELECT * FROM sync_config WHERE id=1`)
      .get()
    if (!row) throw new Error('sync_config 初始数据缺失，请检查迁移脚本')
    return row as SyncConfigRow
  }

  /** 将 SyncConfig（业务层类型）映射并持久化 */
  save(cfg: SyncConfig): void {
    this.db
      .prepare(
        `UPDATE sync_config SET
          enabled=?,
          trigger=?,
          interval_ms=?,
          cron_expression=?,
          fixed_times=?,
          server_url=?,
          access_token=?,
          direction=?
         WHERE id=1`
      )
      .run(
        cfg.enabled ? 1 : 0,
        cfg.trigger,
        cfg.intervalMs,
        cfg.cronExpression ?? null,
        cfg.fixedTimes ? JSON.stringify(cfg.fixedTimes) : null,
        cfg.serverUrl,
        cfg.accessToken?.trim() || null,
        cfg.direction
      )
  }

  updateLastSync(status: 'success' | 'error', message?: string, syncedAt = Date.now(), syncCursor?: number): void {
    this.db
      .prepare(
         `UPDATE sync_config SET last_sync_at=?, last_sync_cursor=COALESCE(?, last_sync_cursor), last_sync_status=?, last_sync_message=? WHERE id=1`
      )
      .run(syncedAt, syncCursor ?? null, status, message ?? null)
  }

  /** 将数据库行转为业务层类型 */
  toSyncConfig(row: SyncConfigRow): SyncConfig {
    return {
      enabled: row.enabled === 1,
      trigger: row.trigger,
      intervalMs: row.interval_ms,
      cronExpression: row.cron_expression ?? undefined,
      fixedTimes: row.fixed_times ? JSON.parse(row.fixed_times) : undefined,
      serverUrl: row.server_url,
      accessToken: row.access_token ?? undefined,
      direction: row.direction,
      lastSyncAt: row.last_sync_at ?? undefined,
      lastSyncCursor: row.last_sync_cursor ?? undefined,
    }
  }
}
