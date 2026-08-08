# 养老管理系统

基于 Electron + Vue3 的桌面端养老机构管理系统，采用 pnpm monorepo 架构，支持离线优先、本地 SQLite 存储与多模式数据同步。

---

## 技术栈

| 层级 | 技术 | 版本 |
|---|---|---|
| 框架 | Vue 3 + TypeScript | 3.5.40 / 7.0.2 |
| 桌面壳 | Electron | 43.2.0 |
| 构建 | Vite + electron-vite | 7.3.6 / 5.0.0 |
| 状态管理 | Pinia | 4.0.2 |
| 路由 | Vue Router | 5.2.0 |
| UI 组件 | naive-ui | 2.44.1 |
| 原子化 CSS | UnoCSS | 66.7.5 |
| 动画 | @vueuse/motion | 3.0.3 |
| 图表 | ECharts + vue-echarts | 6.1.0 / 8.0.1 |
| HTTP | Axios | 1.18.1 |
| 服务端状态 | TanStack Vue Query | 5.101.4 |
| 时间处理 | dayjs | 1.11.21 |
| 数据校验 | zod | 4.4.3 |
| 本地数据库 | better-sqlite3 | 13.0.1 |
| 定时任务 | node-cron | 4.6.0 |
| 代码风格 | ESLint + Prettier（Google Style）| 10.8.0 / 3.9.6 |

---

## 环境要求

- **Node.js** >= 22
- **pnpm** >= 11
- **操作系统**：Windows / macOS / Linux

---

## 目录结构

```
.
├── apps/
│   └── desktop/            # Electron 桌面应用
│       ├── src/main/       # 主进程（Node.js 环境）
│       ├── src/preload/    # 预加载脚本（contextBridge）
│       └── src/renderer/   # Vue 渲染进程
├── packages/
│   ├── core/               # 公共业务逻辑（跨平台可复用）
│   ├── ui/                 # 公共 UI 组件库（跨平台可复用）
│   ├── db/                 # SQLite 数据层（Electron 主进程专用）
│   └── sync/               # 数据同步引擎（Electron 主进程专用）
├── docs/
│   ├── TECH-STACK.md       # 技术选型与版本约束说明
│   ├── ARCHITECTURE.md     # 架构设计与目录说明
│   ├── SYNC.md             # 同步功能完整文档
│   ├── USAGE.md            # 使用手册（傻瓜版）
│   └── CHANGELOG.md        # 每次迭代变更留痕
└── .vscode/                # 团队统一编辑器配置
```

---

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

> 首次安装会自动执行 `husky install`，启用 Git 提交钩子。

### 2. 重建原生模块

better-sqlite3 是原生模块，需针对当前 Electron 版本重新编译：

```bash
pnpm rebuild
```

### 3. 启动开发环境

```bash
pnpm dev
```

---

## 常用命令

```bash
# 开发
pnpm dev              # 启动 Electron 开发模式

# 打包
pnpm build:win        # 打包 Windows 安装包
pnpm build:mac        # 打包 macOS DMG
pnpm build:linux      # 打包 Linux AppImage

# 代码检查
pnpm lint             # ESLint 检查（Google Style）
pnpm lint:fix         # ESLint 自动修复
pnpm lint:style       # Stylelint 检查
pnpm format           # Prettier 全量格式化
pnpm format:check     # 格式检查（CI 用，不改文件）
pnpm typecheck        # TypeScript 全量类型检查
```

---

## 数据同步

支持四种同步触发方式，时间参数基础单位为 **毫秒（ms）**：

| 模式 | 说明 |
|---|---|
| 手动 | 用户主动点击"立即同步" |
| 自动间隔 | 每隔 N 毫秒自动触发（界面以分钟显示） |
| Cron 定时 | 按 cron 表达式定时，如 `0 9 * * *`（每天9:00） |
| 固定时间 | 每天在指定时刻触发，如 `["09:00","18:00"]` |

> 详细接口约定、变更日志表结构见 [docs/SYNC.md](docs/SYNC.md)

---

## 团队开发规范

项目采用 **Google TypeScript Style** 约束代码风格：

- **分号**：必须有
- **缩进**：2 空格
- **行宽**：80 字符
- **引号**：单引号
- **命名**：变量 camelCase，类型 PascalCase，常量 UPPER\_CASE
- **异步**：浮动 Promise 必须 `await` 或显式 `void`

每次 `git commit` 前自动执行 lint-staged，只检查暂存文件。

VSCode 用户打开项目后按提示安装推荐扩展（`.vscode/extensions.json`），保存即自动格式化。

---

## 扩展到其他平台

`packages/core`（工具函数/HTTP/类型）和 `packages/ui`（UI 组件）按跨平台设计，
接入小程序或 H5 时可直接复用：

- 小程序：`packages/core` 中 axios 替换为 `uni.request` 封装即可
- 小程序 UI：新建 `packages/ui-mp`，实现与 `packages/ui` 相同的组件接口

> 接入新平台的详细步骤见 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

---

## 变更记录

每次迭代的技术决策、新增/修改文件均记录于 [docs/CHANGELOG.md](docs/CHANGELOG.md)，
方便日后查阅历史决策依据。

---

## 许可证

MIT
