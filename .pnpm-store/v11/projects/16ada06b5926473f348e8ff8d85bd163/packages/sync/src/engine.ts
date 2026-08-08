// packages/sync/src/engine.ts
// 同步核心引擎 - 负责实际的上传/下载逻辑
// 时间单位：ms（毫秒）贯穿整个同步链路

import axios from 'axios'
import type { AxiosInstance } from 'axios'
import type { ChangeLogRow } from '@yanglao/db'
import type { ChangeRecord } from '@yanglao/core'
import type {
  SyncResult,
  SyncUploadPayload,
  SyncDownloadPayload,
  SyncServerResponse,
} from './types'

export class SyncEngine {
  private http: AxiosInstance
  private deviceId: string
  private accessToken = ''

  constructor(
    private getUnsynced: (limit?: number) => ChangeLogRow[],
    private markSynced: (ids: string[]) => void,
    private updateLastSync: (status: 'success' | 'error', msg?: string, syncedAt?: number, syncCursor?: number) => void,
    private saveHistory: (result: SyncResult & { trigger: string; direction: string }) => void,
    deviceId: string,
    private applyRemoteChanges?: (changes: ChangeRecord[]) => void | Promise<void>
  ) {
    this.deviceId = deviceId
    // http 实例延迟创建，等配置加载后初始化
    this.http = axios.create({ timeout: 15000 })
  }

  /** 更新同步服务端 URL（配置变更时调用） */
  setServerUrl(url: string, timeoutMs = 15000): void {
    this.http = axios.create({
      baseURL: url,
      timeout: timeoutMs,
      headers: this.accessToken ? { Authorization: `Bearer ${this.accessToken}` } : undefined,
    })
  }

  setAccessToken(accessToken?: string): void {
    this.accessToken = accessToken?.trim() ?? ''
  }

  /**
   * 执行一次完整同步
   * @param trigger 触发方式
   * @param direction 同步方向
   * @param lastSyncAt 上次同步时间戳（ms），用于下行增量同步
   */
  async sync(
    trigger: string,
    direction: 'upload' | 'download' | 'both',
    lastSyncAt?: number,
    lastSyncCursor?: number,
  ): Promise<SyncResult> {
    const startedAt = Date.now()
    let recordsSent = 0
    let recordsReceived = 0
    let nextSyncAt = Date.now()
    let nextSyncCursor = lastSyncCursor

    try {
      // ── 1. 上传本地变更 ───────────────────────────────────────
      if (direction === 'upload' || direction === 'both') {
        const unsyncedRows = this.getUnsynced(500)

        if (unsyncedRows.length > 0) {
          const payload: SyncUploadPayload = {
            deviceId: this.deviceId,
            clientTime: Date.now(),
            changes: unsyncedRows.map(r => ({
              id: r.id,
              tableName: r.table_name,
              recordId: r.record_id,
              operation: r.operation as 'INSERT' | 'UPDATE' | 'DELETE',
              payload: JSON.parse(r.payload),
              createdAt: r.created_at,
              synced: r.synced === 1,
              syncedAt: r.synced_at ?? undefined,
            })),
          }

          const res = await this.http.post<SyncServerResponse>('/sync/upload', payload)
          if (res.data.code === 0 || res.data.code === 200) {
            const acceptedIds = res.data.data?.acceptedIds
            const ids = acceptedIds
              ? unsyncedRows.map(r => r.id).filter(id => acceptedIds.includes(id))
              : res.data.data?.received === unsyncedRows.length
                ? unsyncedRows.map(r => r.id)
                : []
            if (ids.length !== unsyncedRows.length) {
              throw new Error('服务端未确认全部上传变更')
            }
            this.markSynced(ids)
            recordsSent = ids.length
          } else {
            throw new Error(`上传失败: ${res.data.message ?? res.data.msg ?? '未知错误'}`)
          }
        }
      }

      // ── 2. 下载服务端变更 ─────────────────────────────────────
      if (direction === 'download' || direction === 'both') {
        const payload: SyncDownloadPayload = {
          deviceId: this.deviceId,
          lastSyncAt: lastSyncAt ?? 0,
          lastSyncCursor,
        }

        const res = await this.http.post<SyncServerResponse>('/sync/download', payload)
        if (res.data.code === 0 || res.data.code === 200) {
          const changes = res.data.data?.changes ?? []
          await this.applyRemoteChanges?.(changes)
          recordsReceived = changes.length
          nextSyncAt = res.data.data?.nextSyncAt ?? Date.now()
          nextSyncCursor = res.data.data?.nextSyncCursor ?? nextSyncCursor
        }
      }

      const durationMs = Date.now() - startedAt
      const result: SyncResult = {
        status: 'success',
        recordsSent,
        recordsReceived,
        durationMs,
        nextSyncAt,
        nextSyncCursor,
      }

      this.updateLastSync('success', undefined, nextSyncAt, nextSyncCursor)
      this.saveHistory({ ...result, trigger, direction })
      return result
    } catch (err) {
      const durationMs = Date.now() - startedAt
      const errorMsg = err instanceof Error ? err.message : String(err)

      const result: SyncResult = {
        status: 'error',
        recordsSent,
        recordsReceived,
        durationMs,
        error: errorMsg,
      }

      this.updateLastSync('error', errorMsg)
      this.saveHistory({ ...result, trigger, direction })
      return result
    }
  }
}
