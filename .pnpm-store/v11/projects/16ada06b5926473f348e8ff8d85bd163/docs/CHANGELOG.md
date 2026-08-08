# 变更记录（CHANGELOG）

> 格式：每次开发迭代在此留痕，方便查阅历史决策和变更原因。

---

## [1.0.2] - 2026-07-25

### 修复 — SASS 缺失 + axios 位置错误

#### 决策说明

- sass 是 Vite 在构建阶段处理 .scss 的必须包，属于 devDependency
- axios 在渲染进程运行时被用到，应放在 dependencies 而非 devDependencies
- stylelint-config-standard-scss 已包含 stylelint-config-standard，
  直接替换可避免重复规则加载

#### 修改文件

- apps/desktop/package.json
    - axios 从 devDependencies → dependencies（运行时依赖）
    - 新增 devDependency: sass 1.102.0（Vite SCSS 预处理）

- package.json（根）
    - 新增 devDependency: stylelint-config-standard-scss 17.0.0

- stylelint.config.ts
    - extends 替换：stylelint-config-standard → stylelint-config-standard-scss
      （SCSS config 已内含 standard，无需重复继承）

---

## [1.0.1] - 2026-07-25

### 新增 — Google 团队开发风格约束体系

#### 决策说明

以 Google TypeScript Style Guide (gts) 为基准，通过多工具分层约束：
- Prettier 负责纯格式化（缩进/引号/分号/行宽），避免 ESLint 在格式上浪费 CI 时间
- ESLint 负责代码质量和规范（命名/异步/类型使用）
- Stylelint 负责 CSS/Vue <style> 块规范
- EditorConfig 兜底跨编辑器一致性（IDE 不用 VSCode 也适用）
- Husky + lint-staged 在 git commit 时只检查暂存文件，不全量扫描，性能友好

Google 与原有配置的主要变化：
- semi: false → true（Google 要求分号）
- printWidth: 100 → 80（Google 标准 80 列）
- arrowParens: avoid → always（gts 要求箭头函数参数始终加括号）

#### 新增文件

- .editorconfig                  — 跨编辑器基础规范（UTF-8/LF/2空格/trim尾部空格）
- .prettierignore                — 排除 dist/out/release/lock 文件
- .vscode/settings.json         — 保存时自动 ESLint fix + Prettier 格式化
- .vscode/extensions.json       — 推荐团队安装的 VSCode 扩展列表
- stylelint.config.ts           — CSS/Vue <style> 块规范（standard + Vue）
- .husky/pre-commit             — 提交前自动执行 lint-staged

#### 修改文件

- .prettierrc                   — 对齐 Google style：semi:true、80cols、arrowParens:always
- eslint.config.ts              — 重写为 flat config，集成：
                                   typescript-eslint 8.65.0
                                   eslint-plugin-vue 10.10.0
                                   Google 命名规范（camelCase/PascalCase/UPPER_CASE）
                                   异步 no-floating-promises
                                   Vue3：multi-word-name/script-setup/define-macros-order
- package.json（根）             — 新增 devDependencies 和 scripts：
                                   @eslint/js 10.0.1
                                   typescript-eslint 8.65.0
                                   eslint-plugin-vue 10.10.0
                                   stylelint 17.14.1 + config
                                   postcss-html 1.8.1（stylelint 解析 Vue SFC）
                                   husky 9.1.7
                                   lint-staged 17.2.0
                                   新增 lint:style / format:check / prepare 脚本
                                   新增 lint-staged 配置块

---

## [1.0.0] - 2026-07-25

### 项目初始化 — Electron + Vue3 Monorepo 骨架

#### 技术决策

- 采用 pnpm workspace monorepo 结构：apps/desktop + packages/{core,ui,db,sync}
- 公共包（core/ui）设计为跨平台可复用，以后接入小程序/H5时直接引用
- vite 锁定 7.3.6（而非 8.x），原因：electron-vite 5.0.0 peer 仅支持到 vite 7
- 本地数据库选用 better-sqlite3 13.0.1（同步 API、性能最佳），要求 Node >=22
- 时间单位全链路统一为 ms（毫秒），界面展示时换算为分钟

#### 新增文件

根目录配置：
- pnpm-workspace.yaml        — workspace 声明
- package.json               — 根 scripts（dev/build/typecheck/lint/format）
- tsconfig.base.json         — 共享 TS 配置
- eslint.config.ts           — ESLint flat config
- .prettierrc                — 代码风格（单引号、无分号、100列）
- .npmrc                     — shamefully-hoist，兼容 Electron 原生模块
- .gitignore
- .env.example               — 环境变量示例（VITE_SYNC_SERVER_URL 等）

packages/core：
- src/http/client.ts         — axios 实例工厂，支持多实例、token注入、统一响应拦截
- src/http/composables.ts    — TanStack Vue Query 封装（useRequest/useMutation）
- src/http/types.ts          — HttpConfig/RequestOptions 接口
- src/utils/time.ts          — dayjs 封装 + 时间单位换算（minutesToMs/msToMinutes 等）
- src/utils/format.ts        — 金额/年龄/文件大小/脱敏格式化
- src/utils/validators.ts    — zod Schema 封装（手机/身份证/邮箱/URL）
- src/types/index.ts         — 公共类型（ApiResponse/SyncConfig/ChangeRecord 等）

packages/ui：
- uno.config.ts              — UnoCSS 配置（presetUno/Attributify/Icons，快捷方式定义）
- src/components/BaseButton.vue
- src/components/BaseTable.vue
- src/components/BaseChart.vue  — ECharts 按需封装（Bar/Line/Pie）
- src/components/BaseEmpty.vue
- src/components/BaseLoading.vue
- src/components/BasePage.vue
- src/components/BaseModal.vue
- src/components/BaseTag.vue
- src/components/AnimFade.vue   — 淡入淡出动画容器
- src/components/AnimSlide.vue  — 滑入动画容器（支持四方向）
- src/composables/useTheme.ts   — 亮暗主题切换（含系统跟随）

packages/db：
- src/schema.ts              — SQLite 表结构 DDL + TS 接口（change_log/sync_config/sync_history/elderly）
- src/migrations/index.ts   — 轻量迁移系统（v1~v3，事务保证原子性）
- src/repositories/change-log.repo.ts
- src/repositories/sync-config.repo.ts
- src/repositories/elderly.repo.ts
- src/index.ts               — initDatabase/createRepos，WAL 模式

packages/sync：
- src/types.ts
- src/engine.ts              — 上传/下载核心（批量读取 change_log，标记已同步）
- src/scheduler.ts           — 调度管理（手动/auto/cron/固定时间，防重入）

apps/desktop：
- electron.vite.config.ts   — 主进程/预加载/渲染三端构建配置，含 manualChunks 分包
- electron-builder.config.ts — Win/Mac/Linux 打包配置
- src/main/index.ts          — 主进程入口
- src/main/ipc/sync.handler.ts
- src/main/ipc/elderly.handler.ts
- src/main/ipc/config.handler.ts
- src/preload/index.ts       — contextBridge 安全 API 暴露（window.api）
- src/renderer/index.html
- src/renderer/src/main.ts   — Vue 入口（Pinia/Router/VueQuery/Motion）
- src/renderer/src/App.vue   — 根组件（naive-ui Provider，中文 locale）
- src/renderer/src/router/index.ts
- src/renderer/src/stores/sync.store.ts
- src/renderer/src/stores/elderly.store.ts
- src/renderer/src/layouts/DefaultLayout.vue
- src/renderer/src/views/dashboard/DashboardView.vue
- src/renderer/src/views/elderly/ElderlyListView.vue
- src/renderer/src/views/elderly/ElderlyDetailView.vue
- src/renderer/src/views/sync/SyncView.vue
- src/renderer/src/views/settings/SettingsView.vue
- src/renderer/src/views/NotFoundView.vue
- src/renderer/src/env.d.ts

docs：
- docs/TECH-STACK.md
- docs/ARCHITECTURE.md
- docs/SYNC.md
- docs/CHANGELOG.md（本文件）

---

## 后续迭代留痕模板

复制以下模板，在文件顶部（---之后）追加，每次开发留下记录：

  [x.y.z] - YYYY-MM-DD

  变更类型（新增/修复/重构/优化/文档）

  决策说明：
  （为什么这么做，有什么权衡取舍）

  新增文件：
  - path/to/file.ts — 说明

  修改文件：
  - path/to/file.ts — 变更内容说明

  废弃/删除：
  - path/to/file.ts — 删除原因
