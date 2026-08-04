// packages/core/src/types/index.ts
// 跨平台公共类型定义

/** 统一 API 响应结构 */
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
  timestamp: number
}

/** 分页参数 */
export interface PaginationParams {
  page: number
  pageSize: number
}

/** 分页响应 */
export interface PaginationResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

/** 同步状态 */
export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error' | 'disabled'

/** 同步方向 */
export type SyncDirection = 'upload' | 'download' | 'both'

/** 同步触发方式 */
export type SyncTrigger = 'manual' | 'auto' | 'scheduled' | 'timed'

/** 同步配置（时间单位：ms 或分钟，统一换算为 ms 存储） */
export interface SyncConfig {
  enabled: boolean
  trigger: SyncTrigger
  /** 自动同步间隔（ms） */
  intervalMs: number
  /** 定时同步 cron 表达式（如 "0 9 * * *" = 每天9:00） */
  cronExpression?: string
  /** 固定时间列表（HH:mm 格式，如 ["09:00","18:00"]） */
  fixedTimes?: string[]
  serverUrl: string
  /** 服务端访问令牌，仅保存在本机同步配置中 */
  accessToken?: string
  direction: SyncDirection
  /** 上次同步时间戳（ms） */
  lastSyncAt?: number
  /** 服务端变更游标，仅用于远程同步断点续传 */
  lastSyncCursor?: number
}

/** 变更记录（用于增量同步） */
export interface ChangeRecord {
  id: string
  tableName: string
  recordId: string
  operation: 'INSERT' | 'UPDATE' | 'DELETE'
  payload: Record<string, unknown>
  /** 创建时间戳（ms） */
  createdAt: number
  /** 是否已同步 */
  synced: boolean
  /** 同步时间戳（ms） */
  syncedAt?: number
}
