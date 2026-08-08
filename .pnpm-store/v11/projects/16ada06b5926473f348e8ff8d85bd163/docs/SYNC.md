# 数据同步功能文档

> 版本：1.0  
> 时间单位约定：所有时间参数统一使用 **毫秒（ms）** 作为基础单位，界面展示时换算为**分钟**。

---

## 同步模式总览

| 模式 | trigger 值 | 描述 | 适用场景 |
|---|---|---|---|
| 手动触发 | `manual` | 用户点击"立即同步"按钮后触发 | 随时按需 |
| 自动间隔 | `auto` | 每隔 N 毫秒自动执行一次 | 低频后台保持 |
| Cron 定时 | `scheduled` | 按 cron 表达式定时执行 | 精确周期调度 |
| 固定时间 | `timed` | 每天在指定 HH:mm 触发 | 每天定点同步 |

---

## 配置字段说明

```typescript
interface SyncConfig {
  enabled: boolean          // 是否启用同步
  trigger: SyncTrigger      // 触发方式

  // auto 模式：自动同步间隔（ms）
  // 界面以"分钟"显示，存储时换算：intervalMs = 分钟 × 60 × 1000
  intervalMs: number

  // scheduled 模式：标准 cron 表达式
  // 示例："0 9 * * *" = 每天 09:00
  cronExpression?: string

  // timed 模式：固定时间列表（HH:mm 格式）
  // 示例：["09:00", "18:00"] = 每天 9点 和 18点各触发一次
  fixedTimes?: string[]

  serverUrl: string         // 同步服务端 URL（空则禁止网络同步）
  direction: SyncDirection  // upload | download | both
  lastSyncAt?: number       // 上次同步时间戳（ms）
}
```

---

## 同步流程

### 上传（本地 → 服务端）

```
1. 从 change_log 表读取 synced=0 的记录（最多 500 条/批）
2. 组装 SyncUploadPayload（包含 deviceId、clientTime、changes[]）
3. POST {serverUrl}/sync/upload
4. 服务端返回成功后，批量将已上传记录的 synced 更新为 1，synced_at = now
5. 写入 sync_history 记录本次同步结果
```

### 下载（服务端 → 本地）

```
1. POST {serverUrl}/sync/download（携带 lastSyncAt 做增量）
2. 服务端返回自 lastSyncAt 以来的变更列表
3. 应用远程变更到本地表（需业务层实现冲突解决策略）
4. 更新 last_sync_at
```

---

## 变更日志表（change_log）

每次对业务表的写操作（INSERT/UPDATE/DELETE）会自动在 `change_log` 中插入一条记录：

```sql
CREATE TABLE change_log (
  id           TEXT    PRIMARY KEY,  -- nanoid，全局唯一
  table_name   TEXT    NOT NULL,     -- 业务表名，如 elderly
  record_id    TEXT    NOT NULL,     -- 业务记录 id
  operation    TEXT    NOT NULL,     -- INSERT | UPDATE | DELETE
  payload      TEXT    NOT NULL,     -- JSON 序列化的变更数据
  created_at   INTEGER NOT NULL,     -- 变更时间（ms）
  synced       INTEGER DEFAULT 0,    -- 0=待同步 1=已同步
  synced_at    INTEGER               -- 同步完成时间（ms）
);
```

**如何触发记录**：在 Repository 的写方法中调用 `ChangeLogRepo.insert()`，见 `packages/db/src/repositories/elderly.repo.ts`。

**清理策略**：调用 `ChangeLogRepo.cleanup(retainMs)` 清除已同步且超过保留期（默认 7 天）的历史记录，建议在每次同步成功后执行。

---

## 定时同步实现细节

### auto（自动间隔）

```typescript
// 每次执行完成后重新计时，避免任务执行时间累积误差
const run = async () => {
  await sync()
  timer = setTimeout(run, intervalMs)  // 完成后再等下一个间隔
}
timer = setTimeout(run, intervalMs)
```

### scheduled（cron 表达式）

使用 `node-cron`：

```typescript
cron.schedule('0 9 * * *', () => sync())
// 支持秒级精度（6位）或分钟级（5位）
```

### timed（固定时间）

使用 `msUntilNextFixedTime()` 计算距下次触发的 ms 数，通过 `setTimeout` 实现：

```typescript
const delay = msUntilNextFixedTime(['09:00', '18:00'])  // 返回 ms
setTimeout(() => { sync(); scheduleNext() }, delay)
```

---

## 禁用/启用联网同步

- 界面操作：同步配置页将 `serverUrl` 清空 或 关闭"启用同步"开关
- 编程方式：调用 `window.api.sync.disable()`（通过 IPC → `SyncScheduler.applyConfig`）
- 禁用后：`SyncScheduler` 停止所有定时器和 cron 任务，状态变为 `disabled`

---

## 添加新业务表的同步支持

1. 在 `packages/db/src/migrations/` 添加新迁移版本（递增 version）
2. 在 `packages/db/src/schema.ts` 添加表 DDL 和 TypeScript 接口
3. 在 `packages/db/src/repositories/` 创建新的 Repository
4. Repository 的写方法中调用 `this.changeLog.insert()` 记录变更
5. 在 `packages/db/src/index.ts` 的 `createRepos()` 中注册新 Repository
6. 在 `apps/desktop/src/main/ipc/` 添加对应 IPC 处理器
7. 在 `apps/desktop/src/preload/index.ts` 暴露新 API

---

## 服务端接口约定（供后端开发参考）

### POST /sync/upload

请求体：
```json
{
  "deviceId": "string（设备唯一ID）",
  "clientTime": 1722000000000,
  "changes": [
    {
      "id": "nanoid",
      "tableName": "elderly",
      "recordId": "nanoid",
      "operation": "INSERT|UPDATE|DELETE",
      "payload": { "...业务字段": "..." },
      "createdAt": 1722000000000
    }
  ]
}
```

响应体（成功）：
```json
{
  "code": 0,
  "message": "ok",
  "data": { "received": 5 }
}
```

### POST /sync/download

请求体：
```json
{
  "deviceId": "string",
  "lastSyncAt": 1722000000000
}
```

响应体：
```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "received": 2,
    "changes": [ /* 同上传格式 */ ]
  }
}
```
