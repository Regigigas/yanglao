# 架构文档

> 创建时间：2026-07-25  
> 平台：Electron + Vue3 Monorepo

---

## 目录结构

```
before/
├── package.json            # Workspace 根，统一 scripts
├── pnpm-workspace.yaml     # pnpm workspace 配置
├── tsconfig.base.json      # 共享 TS 基础配置
├── eslint.config.ts        # 全局 ESLint
├── .prettierrc             # 全局格式化配置
├── .npmrc                  # shamefully-hoist，兼容 Electron 原生模块
│
├── apps/
│   └── desktop/            # Electron 桌面应用
│       ├── electron.vite.config.ts
│       ├── electron-builder.config.ts
│       └── src/
│           ├── main/       # 主进程（Node.js 环境）
│           │   ├── index.ts          # 主进程入口，窗口管理
│           │   └── ipc/              # IPC 处理器（按业务模块拆分）
│           │       ├── sync.handler.ts
│           │       ├── elderly.handler.ts
│           │       └── config.handler.ts
│           ├── preload/    # 预加载脚本（contextBridge）
│           │   └── index.ts          # 暴露 window.api
│           └── renderer/   # Vue 渲染进程
│               ├── index.html
│               └── src/
│                   ├── main.ts       # Vue 入口
│                   ├── App.vue       # 根组件（naive-ui Provider）
│                   ├── router/       # Vue Router
│                   ├── stores/       # Pinia Stores
│                   ├── layouts/      # 布局组件
│                   ├── views/        # 页面组件（路由级懒加载）
│                   └── env.d.ts      # 全局类型声明（window.api）
│
└── packages/
    ├── core/               # 公共业务逻辑（跨平台可复用）
    │   └── src/
    │       ├── http/       # axios 实例工厂 + TanStack Query composable
    │       ├── utils/      # dayjs 封装、格式化、校验（zod）
    │       └── types/      # 共享类型定义（ApiResponse、SyncConfig 等）
    │
    ├── ui/                 # 公共 UI 组件库（跨平台可复用）
    │   ├── uno.config.ts   # UnoCSS 配置（由 apps/desktop 引用）
    │   └── src/
    │       ├── components/ # 封装组件（BaseChart、BaseTable 等）
    │       └── composables/# useTheme 等
    │
    ├── db/                 # 本地 SQLite 数据层（Electron 主进程专用）
    │   └── src/
    │       ├── schema.ts   # 表结构 DDL + TypeScript 接口
    │       ├── migrations/ # 版本化迁移系统
    │       └── repositories/# CRUD 封装（含自动记录变更日志）
    │
    └── sync/               # 同步引擎（Electron 主进程专用）
        └── src/
            ├── engine.ts   # 上传/下载核心逻辑
            ├── scheduler.ts# 调度管理（手动/自动/cron/固定时间）
            └── types.ts    # 同步专用类型
```

---

## 数据流

```
渲染进程（Vue）
  │   window.api.xxx()
  ▼
contextBridge（preload）
  │   ipcRenderer.invoke(...)
  ▼
主进程 IPC 处理器
  │
  ├─→ packages/db（Repository）─→ SQLite（better-sqlite3）
  │       └─→ 写操作自动插入 change_log 表（变更日志）
  │
  └─→ packages/sync（SyncScheduler）
          │
          ├─→ SyncEngine：读取 change_log → POST /sync/upload → 标记已同步
          │                           ← POST /sync/download ← 应用远程变更
          └─→ scheduler：管理触发时机（手动/auto/cron/固定时间）
                │
                └─→ 推送同步事件到渲染进程（ipcMain.webContents.send('sync:event')）
```

---

## 同步基础设施设计原则

1. **本地优先（Local-first）**：所有写操作先落本地 SQLite，再异步同步
2. **增量同步**：通过 `change_log` 表记录每次变更，只推送未同步的 delta
3. **幂等同步**：每条变更记录有唯一 id（nanoid），服务端可安全去重
4. **软删除**：业务表使用 `deleted_at` 字段，保留同步追踪能力
5. **时间戳统一**：所有时间存储为 Unix ms（INTEGER），传输也用 ms

---

## 未来接入新平台（示例：小程序）

```bash
# 1. 在 packages 目录新建平台包
mkdir packages/ui-mp     # 小程序 UI 层（复用 packages/ui 接口约定）
mkdir apps/miniprogram   # uni-app 项目

# 2. packages/core 直接安装复用（无需修改）
# packages/db 和 packages/sync 在小程序中不需要（数据通过云端获取）

# 3. packages/ui-mp 实现相同组件接口
# 渲染层替换，业务逻辑复用 packages/core
```
