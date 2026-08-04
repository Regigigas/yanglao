# 技术栈文档

> 版本锁定时间：2026-07-25  
> 适用平台：Electron 桌面端（可跨平台复用 packages/core 和 packages/ui）

---

## 核心版本锁定表

| 类别 | 包名 | 版本 | 说明 |
|---|---|---|---|
| 框架 | vue | 3.5.40 | 最新稳定版 |
| 框架 | vue-router | 5.2.0 | 最新稳定版（2026-07-15 发布） |
| 构建 | vite | 7.3.6 | 与 electron-vite 5.0.0 peer 兼容 |
| 构建 | electron-vite | 5.0.0 | peer 要求 vite ^5~^7，选 7.3.6 |
| 状态 | pinia | 4.0.2 | 最新稳定版（2026-07-15 发布），peer 要求 vite ^7.3.0 |
| 类型 | typescript | 7.0.2 | latest 稳定版（7.1 处于 dev 阶段） |
| UI 组件 | naive-ui | 2.44.1 | Vue3 原生，按需加载 |
| 工具类 | @vueuse/core | 14.3.0 | 组合式工具合集 |
| 动画 | @vueuse/motion | 3.0.3 | 声明式动画，轻量（~10kb） |
| 图表 | echarts | 6.1.0 | 按需导入减少包体积 |
| 图表 | vue-echarts | 8.0.1 | Vue3 封装层 |
| 原子CSS | unocss | 66.7.5 | 按需生成，零冗余 |
| 时间 | dayjs | 1.11.21 | 轻量时间处理 |
| 请求 | axios | 1.18.1 | HTTP 客户端 |
| 查询 | @tanstack/vue-query | 5.101.4 | 服务端状态管理 |
| 验证 | zod | 4.4.3 | TypeScript 优先的 Schema 验证 |
| 图标 | @iconify/vue | 5.0.1 | 海量图标按需加载 |
| 本地DB | better-sqlite3 | 13.0.1 | 同步 API，性能最佳，node>=22 |
| 定时 | node-cron | 4.6.0 | cron 表达式调度 |
| 日志 | electron-log | 5.4.4 | 主进程/渲染进程统一日志 |
| 更新 | electron-updater | 6.8.9 | 自动更新 |
| 打包 | electron-builder | 26.15.3 | 多平台打包 |
| 原生重建 | @electron/rebuild | 4.2.0 | 重建 better-sqlite3 原生模块 |
| 代码格式 | prettier | 3.9.6 | |
| 代码检查 | eslint | 10.8.0 | |
| Node 版本要求 | — | >=22 | better-sqlite3 13.x 要求 |
| pnpm 版本要求 | — | >=11 | workspace 协议支持 |

---

## 兼容性约束说明

### vite 为何用 7.3.6 而非 8.x

`electron-vite 5.0.0` 的 peerDependencies 为：

```json
{
  "vite": "^5.0.0 || ^6.0.0 || ^7.0.0"
}
```

vite 8 不在其支持范围内，升级 electron-vite 前**不要升级 vite 到 8.x**。

### pinia 4 的 peer 要求

pinia 4.0.2 要求 `vite ^7.3.0 || ^8.0.0`，与 vite 7.3.6 兼容。

### better-sqlite3 原生模块

- 需要 Node >=22（已满足：当前 22.20.0）
- Electron 打包时必须针对 Electron 的 Node 版本重建：
  ```bash
  pnpm -F @yanglao/desktop rebuild
  # 等价于: electron-rebuild -f -w better-sqlite3
  ```

---

## 未来升级到其他平台的注意事项

### 小程序（uni-app）

- `packages/core`（axios、dayjs、zod、TanStack Query）：
  - axios 需替换为 `uni.request` 封装，已在 `src/http/client.ts` 抽象了 `HttpConfig` 接口，替换成本低
  - TanStack Query 在小程序中需确认是否支持（uni-app x 基本支持）
  - dayjs 全平台可用
- `packages/ui`（naive-ui、@vueuse/motion）：
  - naive-ui 是 Web 组件库，**小程序不可用**，需重新实现 UI 层
  - 可新建 `packages/ui-mp`（小程序 UI 包），与 `packages/ui` 同级，复用相同接口

### H5

- `packages/core` 完全可复用
- `packages/ui` 可复用（naive-ui 支持 H5）

---

## 包体积控制策略

| 策略 | 实现位置 | 说明 |
|---|---|---|
| 路由级代码分割 | `router/index.ts` | 每个 view 独立 chunk |
| ECharts 按需导入 | `packages/ui/BaseChart.vue` | 只 `use()` 用到的图表类型 |
| naive-ui 按需导入 | `unplugin-vue-components` + `NaiveUiResolver` | 自动按需 |
| vendor 拆包 | `electron.vite.config.ts` manualChunks | vue/naive/echarts/utils 各独立 |
| UnoCSS 原子化 | `unocss/vite` | 按需生成，零冗余 CSS |
| 图标按需加载 | `@iconify/vue` + UnoCSS icons | 只打包用到的图标 |
