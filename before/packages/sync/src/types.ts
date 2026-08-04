// packages/sync/src/types.ts
// 同步引擎内部类型（拓展 @yanglao/core 的公共类型）

import type { SyncConfig, SyncStatus, ChangeRecord } from '@yanglao/core'

export type { SyncConfig, SyncStatus, ChangeRecord }

export interface SyncResult {
  status: 'success' | 'error' | 'partial'
  recordsSent: number
  recordsReceived: number
  durationMs: number
  error?: string
  nextSyncAt?: number
  nextSyncCursor?: number
}

export interface SyncUploadPayload {
  deviceId: string
  changes: ChangeRecord[]
  clientTime: number  // ms
}

export interface SyncDownloadPayload {
  deviceId: string
  lastSyncAt: number  // ms
  lastSyncCursor?: number
}

export interface SyncServerResponse {
  code: number
  message?: string
  msg?: string
  data: {
    received: number
    changes: ChangeRecord[]
    acceptedIds?: string[]
    nextSyncAt?: number
    nextSyncCursor?: number
  }
}
