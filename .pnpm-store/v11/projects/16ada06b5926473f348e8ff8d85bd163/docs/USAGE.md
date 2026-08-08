# 使用手册（傻瓜版）

> 从零开始开发一个新功能的完整流程，看这一个文件就够了。

---

## 目录

1. [第一次运行项目](#1-第一次运行项目)
2. [新建一个页面](#2-新建一个页面)
3. [发起 HTTP 请求](#3-发起-http-请求)
4. [用 TanStack Query 管理数据](#4-用-tanstack-query-管理数据)
5. [用 Pinia 管理状态](#5-用-pinia-管理状态)
6. [使用 naive-ui 组件](#6-使用-naive-ui-组件)
7. [用 UnoCSS 写样式](#7-用-unocss-写样式)
8. [写 SCSS 样式](#8-写-scss-样式)
9. [加动画效果](#9-加动画效果)
10. [用 ECharts 画图表](#10-用-echarts-画图表)
11. [处理时间和日期](#11-处理时间和日期)
12. [配置数据同步](#12-配置数据同步)
13. [新增数据库表](#13-新增数据库表)
14. [打包发布](#14-打包发布)
15. [常用命令速查](#15-常用命令速查)

---

## 官方文档速查表

> 遇到不懂的 API，直接点对应链接去官网查。

### 核心框架

| 库 | 版本 | 官方文档 |
|---|---|---|
| Vue 3 | 3.5.40 | https://cn.vuejs.org |
| Vite | 7.3.6 | https://cn.vitejs.dev |
| TypeScript | 7.0.2 | https://www.typescriptlang.org/zh |
| Electron | 43.2.0 | https://www.electronjs.org/zh/docs/latest |
| electron-vite | 5.0.0 | https://cn.electron-vite.org |
| electron-builder | 26.15.3 | https://www.electron.build |

### 状态与路由

| 库 | 版本 | 官方文档 |
|---|---|---|
| Vue Router | 5.2.0 | https://router.vuejs.org/zh |
| Pinia | 4.0.2 | https://pinia.vuejs.org/zh |
| TanStack Vue Query | 5.101.4 | https://tanstack.com/query/latest/docs/framework/vue/overview |

### UI / 样式 / 动画

| 库 | 版本 | 官方文档 |
|---|---|---|
| naive-ui | 2.44.1 | https://www.naiveui.com/zh-CN/os-theme |
| UnoCSS | 66.7.5 | https://unocss.dev |
| SASS | 1.102.0 | https://sass-lang.com/documentation |
| @vueuse/core | 14.3.0 | https://vueuse.org |
| @vueuse/motion | 3.0.3 | https://motion.vueuse.org |
| Iconify 图标搜索 | — | https://icones.js.org |

### 数据 / 请求 / 工具

| 库 | 版本 | 官方文档 |
|---|---|---|
| Axios | 1.18.1 | https://axios-http.com/zh/docs/intro |
| ECharts | 6.1.0 | https://echarts.apache.org/zh/index.html |
| vue-echarts | 8.0.1 | https://vue-echarts.dev |
| dayjs | 1.11.21 | https://day.js.org/zh-CN |
| zod | 4.4.3 | https://zod.dev |
| better-sqlite3 | 13.0.1 | https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md |
| node-cron | 4.6.0 | https://github.com/node-cron/node-cron |
| nanoid | 6.0.0 | https://github.com/ai/nanoid |

### 代码规范

| 库 | 版本 | 官方文档 |
|---|---|---|
| ESLint | 10.8.0 | https://eslint.org/docs/latest |
| Prettier | 3.9.6 | https://prettier.io/docs/en |
| Stylelint | 17.14.1 | https://stylelint.io/user-guide/get-started |
| Husky | 9.1.7 | https://typicode.github.io/husky |

---

## 1. 第一次运行项目

```bash
# 第一步：安装依赖
pnpm install

# 第二步：重建本地数据库模块（只需执行一次）
pnpm rebuild

# 第三步：启动开发
pnpm dev
```

启动后会自动打开 Electron 窗口，热更新已开启，改代码实时生效。

> **Node 版本必须 >= 22**，用 `node -v` 检查

---

## 2. 新建一个页面

> 相关文档：[Vue 3](https://cn.vuejs.org/guide/essentials/component-basics) · [Vue Router](https://router.vuejs.org/zh/guide/) · [electron-vite](https://cn.electron-vite.org)

### 第一步：新建 Vue 文件

在 `apps/desktop/src/renderer/src/views/` 下按模块建文件夹：

```
views/
└── resident/              ← 新模块文件夹
    └── ResidentView.vue   ← 新页面
```

`ResidentView.vue` 最基础的结构：

```vue
<script setup lang="ts">
  import { BasePage } from '@yanglao/ui';

  // 页面逻辑写在这里
</script>

<template>
  <BasePage title="住户管理">
    <!-- 页面内容写在这里 -->
    <p>Hello World</p>
  </BasePage>
</template>
```

### 第二步：注册路由

打开 `apps/desktop/src/renderer/src/router/index.ts`，在 `children` 数组里加一条：

```ts
{
  path: 'resident',
  name: 'Resident',
  component: () => import('../views/resident/ResidentView.vue'), // 懒加载
  meta: { title: '住户管理', icon: 'i-ion:person-outline' },
},
```

### 第三步：加到侧边栏菜单

打开 `apps/desktop/src/renderer/src/layouts/DefaultLayout.vue`，
在 `menuOptions` 数组里加一项：

```ts
{
  label: () => h(RouterLink, { to: '/resident' }, { default: () => '住户管理' }),
  key: '/resident',
  icon: () => h('i', { class: 'i-ion:person-outline inline-block' }),
},
```

完成！现在侧边栏会出现"住户管理"菜单项。

---

## 3. 发起 HTTP 请求

> 相关文档：[Axios 中文](https://axios-http.com/zh/docs/intro) · [Axios 拦截器](https://axios-http.com/zh/docs/interceptors) · [Axios 取消请求](https://axios-http.com/zh/docs/cancellation)

所有业务请求都从 `@/http` 引入（自动带 Token、错误提示、重试）：

```ts
import { get, post, put, del } from '@/http';

// GET 请求
const res = await get<住户类型[]>('/residents');
const list = res.data.data; // ApiResponse<T>.data

// GET + 查询参数
const res = await get('/residents', { page: 1, pageSize: 20 });

// POST 请求
await post('/residents', { name: '张三', roomNo: '101' });

// PUT 请求
await put(`/residents/${id}`, { name: '李四' });

// DELETE 请求
await del(`/residents/${id}`);
```

### 带取消 key（切换页面时自动取消上一个请求）

```ts
import { get, cancelRequest } from '@/http';

// 发请求时加 cancelKey
const res = await get('/residents', {}, { cancelKey: 'resident-list' });

// 离开页面时取消（在 onBeforeUnmount 里）
import { onBeforeUnmount } from 'vue';
onBeforeUnmount(() => cancelRequest('resident-list'));
```

### 静默模式（不弹错误提示）

```ts
// 加 silent: true，错误不弹 toast，自己在 catch 里处理
try {
  await post('/sync', payload, { silent: true });
} catch (err) {
  console.error(err);
}
```

---

## 4. 用 TanStack Query 管理数据

> 相关文档：[TanStack Vue Query](https://tanstack.com/query/latest/docs/framework/vue/overview) · [useQuery](https://tanstack.com/query/latest/docs/framework/vue/reference/useQuery) · [useMutation](https://tanstack.com/query/latest/docs/framework/vue/reference/useMutation) · [QueryClient](https://tanstack.com/query/latest/docs/reference/QueryClient)

TanStack Query 负责**自动缓存 + 自动刷新**，不用自己管 loading 和 error 状态。

### 查询列表

```vue
<script setup lang="ts">
  import { useRequest, useQueryClient, getErrorMessage } from '@yanglao/core';
  import { get } from '@/http';

  const { data, isPending, error } = useRequest(
    ['residents'],                          // 缓存 key（数组）
    () => get<Resident[]>('/residents'),    // 请求函数
    { staleTime: 60_000 },                 // 数据 1分钟内不重新请求
  );
</script>

<template>
  <div>
    <BaseLoading v-if="isPending" />
    <BaseEmpty v-else-if="!data?.length" />
    <div v-else>
      <div v-for="item in data" :key="item.id">{{ item.name }}</div>
    </div>
  </div>
</template>
```

### 查询详情（依赖 id 变化自动重查）

```ts
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const id = computed(() => route.params.id as string);

const { data } = useRequest(
  computed(() => ['residents', id.value]),  // id变化时自动重新请求
  () => get(`/residents/${id.value}`),
);
```

### 新增 / 修改 / 删除

```ts
import { useMutation, useQueryClient } from '@yanglao/core';
import { post } from '@/http';
import { useMessage } from 'naive-ui';

const message = useMessage();
const qc = useQueryClient();

const { mutate: createResident, isPending: creating } = useMutation(
  (form: CreateResidentDto) => post('/residents', form),
  {
    onSuccess: () => {
      message.success('创建成功');
      qc.invalidateQueries({ queryKey: ['residents'] }); // 自动刷新列表
    },
    onError: (err) => {
      message.error(getErrorMessage(err));
    },
  },
);

// 调用
createResident({ name: '张三', roomNo: '101' });
```

---

## 5. 用 Pinia 管理状态

> 相关文档：[Pinia 中文](https://pinia.vuejs.org/zh/) · [defineStore](https://pinia.vuejs.org/zh/core-concepts/) · [Pinia 插件](https://pinia.vuejs.org/zh/core-concepts/plugins.html)

### 新建一个 Store

在 `apps/desktop/src/renderer/src/stores/` 新建文件：

```ts
// stores/resident.store.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useResidentStore = defineStore('resident', () => {
  // 状态
  const selectedId = ref<string | null>(null);
  const keyword = ref('');

  // 方法
  function selectResident(id: string) {
    selectedId.value = id;
  }

  function clearKeyword() {
    keyword.value = '';
  }

  return { selectedId, keyword, selectResident, clearKeyword };
});
```

### 在组件中使用

```vue
<script setup lang="ts">
  import { useResidentStore } from '../stores/resident.store';

  const store = useResidentStore();

  // 读取状态
  console.log(store.keyword);

  // 调用方法
  store.selectResident('abc-123');
</script>
```

---

## 6. 使用 naive-ui 组件

> 相关文档：[naive-ui 组件列表](https://www.naiveui.com/zh-CN/os-theme/components/button) · [全局 API（useMessage 等）](https://www.naiveui.com/zh-CN/os-theme/components/message) · [主题定制](https://www.naiveui.com/zh-CN/os-theme/docs/customize-theme)

naive-ui 已配置**自动按需导入**，直接在模板里写，**不需要手动 import**：

```vue
<template>
  <!-- 按钮 -->
  <NButton type="primary" @click="handleSave">保存</NButton>
  <NButton type="error" ghost @click="handleDelete">删除</NButton>

  <!-- 表单 -->
  <NForm :model="form" label-placement="left" label-width="80">
    <NFormItem label="姓名" path="name">
      <NInput v-model:value="form.name" placeholder="请输入姓名" />
    </NFormItem>
    <NFormItem label="性别">
      <NSelect
        v-model:value="form.gender"
        :options="[
          { label: '男', value: 'male' },
          { label: '女', value: 'female' },
        ]"
      />
    </NFormItem>
  </NForm>

  <!-- 表格 -->
  <NDataTable :columns="columns" :data="list" :loading="loading" />

  <!-- 弹窗 -->
  <NModal v-model:show="showModal">
    <NCard title="新增住户" style="width: 520px">
      内容
    </NCard>
  </NModal>

  <!-- 提示 -->
  <NTag type="success">在院</NTag>
  <NTag type="warning">暂离</NTag>
  <NTag type="error">离院</NTag>
</template>
```

### 手动触发 message / dialog / notification

```ts
import { useMessage, useDialog, useNotification } from 'naive-ui';

const message = useMessage();
const dialog = useDialog();

// 消息提示
message.success('操作成功');
message.error('操作失败');
message.warning('请注意');

// 确认弹窗
dialog.warning({
  title: '确认删除',
  content: '删除后不可恢复，确认吗？',
  positiveText: '确定',
  negativeText: '取消',
  onPositiveClick: () => {
    // 执行删除
  },
});
```

> `useMessage` 等必须在 **`<NMessageProvider>` 内部的组件** 里调用，
> App.vue 已全局注册，正常开发无需关心。

---

## 7. 用 UnoCSS 写样式

> 相关文档：[UnoCSS 官网](https://unocss.dev) · [预设 Uno（Tailwind 兼容）](https://unocss.dev/presets/uno) · [图标预设](https://unocss.dev/presets/icons) · [Iconify 图标搜索](https://icones.js.org)

直接在模板上写原子类，**无需引入任何 CSS 文件**：

```vue
<template>
  <!-- 布局 -->
  <div class="flex items-center justify-between gap-4 p-4">
    <span class="text-lg font-bold text-gray-800">标题</span>
    <NButton>操作</NButton>
  </div>

  <!-- 常用快捷方式（项目已定义） -->
  <div class="flex-center">居中内容</div>
  <div class="flex-between">两端对齐</div>
  <div class="card">卡片样式</div>
  <p class="text-ellipsis w-40">超长文本自动省略号...</p>

  <!-- 响应式 -->
  <div class="w-full md:w-1/2 lg:w-1/3">响应式宽度</div>

  <!-- 深色模式自动适配 -->
  <div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
    自动深色模式
  </div>

  <!-- 图标（直接用 class，无需 import） -->
  <i class="i-ion:home-outline text-xl text-primary" />
  <i class="i-ion:person-outline text-2xl" />
</template>
```

### 项目内已定义的快捷方式

| 类名 | 等价于 |
|---|---|
| `flex-center` | `flex items-center justify-center` |
| `flex-between` | `flex items-center justify-between` |
| `flex-col-center` | `flex flex-col items-center justify-center` |
| `card` | `bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4` |
| `text-ellipsis` | `overflow-hidden whitespace-nowrap text-ellipsis` |

### 主题色变量

```
text-primary    → 绿色 #18a058
text-danger     → 红色 #d03050
text-warning    → 黄色 #f0a020
text-info       → 蓝色 #2080f0
```

---

## 8. 写 SCSS 样式

> 相关文档：[SASS 中文](https://sass-lang.com/documentation) · [变量](https://sass-lang.com/documentation/variables/) · [嵌套](https://sass-lang.com/documentation/style-rules/declarations/#nesting) · [Mixin](https://sass-lang.com/documentation/at-rules/mixin/) · [Vue scoped + :deep()](https://cn.vuejs.org/api/sfc-css-features#scoped-css)

在 `.vue` 文件的 `<style>` 块里加 `lang="scss"`：

```vue
<style lang="scss" scoped>
  // scoped 表示样式只作用于当前组件

  $primary: #18a058;  // 变量

  .page-header {
    display: flex;
    align-items: center;
    gap: 8px;

    &__title {
      font-size: 18px;
      font-weight: 600;
      color: $primary;
    }

    &__desc {
      font-size: 13px;
      color: #999;
    }
  }

  // 修改子组件样式（穿透 scoped）
  :deep(.n-button) {
    border-radius: 6px;
  }
</style>
```

---

## 9. 加动画效果

> 相关文档：[@vueuse/motion 官网](https://motion.vueuse.org) · [useMotion](https://motion.vueuse.org/api/use-motion) · [动画预设](https://motion.vueuse.org/features/presets) · [过渡属性](https://motion.vueuse.org/features/motion-properties)

### 方式一：用封装好的动画组件（推荐，开箱即用）

```vue
<template>
  <!-- 淡入淡出 -->
  <AnimFade :duration-ms="300">
    <div>内容出现时淡入</div>
  </AnimFade>

  <!-- 从下往上滑入 -->
  <AnimSlide direction="up" :distance="20" :duration-ms="400">
    <NCard>卡片滑入</NCard>
  </AnimSlide>

  <!-- 从左滑入，延迟 100ms -->
  <AnimSlide direction="left" :delay-ms="100">
    <p>延迟出现</p>
  </AnimSlide>
</template>
```

### 方式二：用 `useMotion` 自定义动画

```vue
<script setup lang="ts">
  import { ref } from 'vue';
  import { useMotion } from '@vueuse/motion';

  const el = ref<HTMLElement>();

  useMotion(el, {
    initial: { opacity: 0, scale: 0.9 },           // 初始状态
    enter: {
      opacity: 1,
      scale: 1,
      transition: { duration: 300, ease: 'easeOut' },  // 持续 300ms
    },
  });
</script>

<template>
  <div ref="el">动画元素</div>
</template>
```

---

## 10. 用 ECharts 画图表

> 相关文档：[ECharts 中文](https://echarts.apache.org/zh/index.html) · [配置项手册](https://echarts.apache.org/zh/option.html) · [示例库](https://echarts.apache.org/examples/zh/index.html) · [vue-echarts](https://vue-echarts.dev)

直接用封装好的 `BaseChart`，传入 option 配置即可：

```vue
<script setup lang="ts">
  import { computed } from 'vue';
  import { BaseChart } from '@yanglao/ui';
  import type { EChartsOption } from 'echarts';

  // 折线图
  const lineOption = computed<EChartsOption>(() => ({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月'] },
    yAxis: { type: 'value' },
    series: [{ type: 'line', data: [120, 132, 101, 134], smooth: true }],
  }));

  // 柱状图
  const barOption = computed<EChartsOption>(() => ({
    xAxis: { type: 'category', data: ['在院', '暂离', '离院'] },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: [80, 12, 8] }],
  }));

  // 饼图
  const pieOption = computed<EChartsOption>(() => ({
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie',
      radius: '70%',
      data: [
        { value: 55, name: '男' },
        { value: 45, name: '女' },
      ],
    }],
  }));
</script>

<template>
  <BaseChart :option="lineOption" height="300px" />
  <BaseChart :option="barOption" height="260px" :loading="isPending" />
</template>
```

> 如果需要其他图表类型（如散点图、雷达图），在
> `packages/ui/src/components/BaseChart.vue` 里追加 `use([ScatterChart, ...])` 即可。

---

## 11. 处理时间和日期

> 相关文档：[dayjs 中文](https://day.js.org/zh-CN/docs/en/installation/installation) · [格式化](https://day.js.org/zh-CN/docs/en/display/format) · [相对时间插件](https://day.js.org/zh-CN/docs/en/plugin/relative-time) · [dayjs 所有插件](https://day.js.org/zh-CN/docs/en/plugin/plugin)

从 `@yanglao/core` 引入，已配置中文 locale：

```ts
import {
  dayjs,
  formatDateTime,
  formatDate,
  fromNow,
  nowMs,
  minutesToMs,
  msToMinutes,
  calcAge,
} from '@yanglao/core';

// 格式化
formatDateTime(Date.now())      // "2026-07-25 09:00:00"
formatDate('2000-01-01')        // "2000-01-01"
fromNow(Date.now() - 60_000)    // "1 分钟前"

// 获取当前时间戳（ms）
const ts = nowMs();             // 1722000000000

// 计算年龄
calcAge('1950-03-15')           // 76

// 时间单位换算（同步配置时会用到）
minutesToMs(5)                  // 300000
msToMinutes(300_000)            // 5

// 直接用 dayjs 做复杂操作
dayjs().add(7, 'day').format('YYYY-MM-DD')  // 7天后
dayjs('2026-01-01').isBefore(dayjs())       // true
```

---

## 12. 配置数据同步

> 相关文档：[node-cron（cron 表达式）](https://github.com/node-cron/node-cron#cron-syntax) · [Cron 表达式在线生成](https://crontab.guru) · 同步详细说明见 [docs/SYNC.md](./SYNC.md)

打开应用后进入 **"数据同步"** 页面，或通过代码配置：

### 四种同步模式

| 模式 | 适合场景 | 配置示例 |
|---|---|---|
| 手动 | 自己决定何时同步 | 点击"立即同步"按钮 |
| 自动间隔 | 每隔 N 分钟自动同步 | `intervalMs: 300_000`（5分钟） |
| Cron 定时 | 精确周期，如每小时 | `cronExpression: '0 * * * *'` |
| 固定时间 | 每天上午9点和下午6点 | `fixedTimes: ['09:00', '18:00']` |

### 通过代码直接保存配置

```ts
import { useSyncStore } from '@/stores/sync.store';
import { minutesToMs } from '@yanglao/core';

const syncStore = useSyncStore();

// 设置为"每5分钟自动同步"
await syncStore.saveConfig({
  enabled: true,
  trigger: 'auto',
  intervalMs: minutesToMs(5),   // 5分钟 = 300_000ms
  serverUrl: 'https://your-server.com/api/sync',
  direction: 'both',
});

// 手动立即触发一次
await syncStore.triggerManual();
```

---

## 13. 新增数据库表

> 相关文档：[better-sqlite3 API](https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md) · [better-sqlite3 事务](https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#transactionfunction---function) · [SQLite 数据类型](https://www.sqlite.org/datatype3.html)

以新增"房间表"为例，走完整流程：

### 第一步：在 `schema.ts` 定义表结构和 TypeScript 接口

打开 `packages/db/src/schema.ts`，追加：

```ts
export const CREATE_ROOM = `
CREATE TABLE IF NOT EXISTS room (
  id         TEXT    PRIMARY KEY,
  room_no    TEXT    NOT NULL UNIQUE,
  floor      INTEGER NOT NULL,
  capacity   INTEGER NOT NULL DEFAULT 2,
  status     TEXT    NOT NULL DEFAULT 'available',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
`

export interface RoomRow {
  id: string;
  room_no: string;
  floor: number;
  capacity: number;
  status: 'available' | 'occupied' | 'maintenance';
  created_at: number;
  updated_at: number;
}
```

### 第二步：添加迁移

打开 `packages/db/src/migrations/index.ts`，在 `migrations` 数组末尾追加（version 递增）：

```ts
{
  version: 4,
  description: '创建房间表',
  up: (db) => {
    db.exec(`
      CREATE TABLE IF NOT EXISTS room (
        id         TEXT    PRIMARY KEY,
        room_no    TEXT    NOT NULL UNIQUE,
        floor      INTEGER NOT NULL,
        capacity   INTEGER NOT NULL DEFAULT 2,
        status     TEXT    NOT NULL DEFAULT 'available',
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
    `);
  },
},
```

### 第三步：新建 Repository

新建 `packages/db/src/repositories/room.repo.ts`：

```ts
import type { Database } from 'better-sqlite3';
import { nanoid } from 'nanoid';
import type { RoomRow } from '../schema';
import { ChangeLogRepo } from './change-log.repo';

export class RoomRepo {
  private changeLog: ChangeLogRepo;

  constructor(private db: Database) {
    this.changeLog = new ChangeLogRepo(db);
  }

  findAll(): RoomRow[] {
    return this.db
      .prepare<[], RoomRow>('SELECT * FROM room ORDER BY floor, room_no')
      .all() as RoomRow[];
  }

  insert(data: Omit<RoomRow, 'id' | 'created_at' | 'updated_at'>): RoomRow {
    const now = Date.now();
    const row: RoomRow = { ...data, id: nanoid(), created_at: now, updated_at: now };
    this.db
      .prepare(
        `INSERT INTO room (id, room_no, floor, capacity, status, created_at, updated_at)
         VALUES (@id, @room_no, @floor, @capacity, @status, @created_at, @updated_at)`,
      )
      .run(row);
    // 记录变更，供同步使用
    this.changeLog.insert({ table_name: 'room', record_id: row.id, operation: 'INSERT', payload: JSON.stringify(row) });
    return row;
  }
}
```

### 第四步：注册到 `createRepos()`

打开 `packages/db/src/index.ts`，加入新 repo：

```ts
import { RoomRepo } from './repositories/room.repo';  // 新增

export function createRepos(db = getDatabase()) {
  return {
    changeLog: new ChangeLogRepo(db),
    syncConfig: new SyncConfigRepo(db),
    elderly: new ElderlyRepo(db),
    room: new RoomRepo(db),                            // 新增
  };
}
```

### 第五步：暴露 IPC 接口

新建 `apps/desktop/src/main/ipc/room.handler.ts`，参考 `elderly.handler.ts` 写即可。
然后在 `src/preload/index.ts` 里暴露 `window.api.room`。

完成！下次启动应用会自动执行 migration v4，建好房间表。

---

## 14. 打包发布

> 相关文档：[electron-builder 配置](https://www.electron.build/configuration/configuration) · [Windows 打包](https://www.electron.build/configuration/win) · [macOS 打包](https://www.electron.build/configuration/mac) · [自动更新](https://www.electron.build/auto-update)

```bash
# 打包 Windows 安装包（.exe）
pnpm build:win

# 打包 macOS（.dmg）
pnpm build:mac

# 打包 Linux（.AppImage）
pnpm build:linux
```

打包产物在 `apps/desktop/release/` 目录下。

> **注意**：打包前确保执行过 `pnpm rebuild`，否则 better-sqlite3 原生模块在目标平台可能无法运行。

---

## 15. 常用命令速查

```bash
# 开发
pnpm dev              # 启动开发

# 检查代码
pnpm typecheck        # TypeScript 类型检查
pnpm lint             # ESLint 检查
pnpm lint:fix         # ESLint 自动修复
pnpm lint:style       # Stylelint CSS/SCSS 检查
pnpm format           # Prettier 格式化
pnpm format:check     # 格式检查（只报错不修改，用于 CI）

# 构建
pnpm build:win
pnpm build:mac
pnpm build:linux

# 其他
pnpm rebuild          # 重建原生模块（更换 Node/Electron 版本后执行）
```

---

## 快速参考：从哪里导入

| 需要什么 | 从哪里导入 |
|---|---|
| `axios` 请求 | `import { get, post, put, del } from '@/http'` |
| TanStack Query | `import { useRequest, useMutation, useQueryClient } from '@yanglao/core'` |
| 错误处理工具 | `import { getErrorMessage, isBizError } from '@yanglao/core'` |
| 时间工具 | `import { dayjs, formatDate, fromNow, minutesToMs } from '@yanglao/core'` |
| 格式化工具 | `import { formatYuan, maskPhone, calcAge } from '@yanglao/core'` |
| 表单验证 | `import { phoneSchema, validate } from '@yanglao/core'` |
| 公共 UI 组件 | `import { BasePage, BaseChart, BaseTable, AnimFade } from '@yanglao/ui'` |
| 主题切换 | `import { useTheme } from '@yanglao/ui'` |
| 同步状态 | `import { useSyncStore } from '@/stores/sync.store'` |
| naive-ui 提示 | `import { useMessage, useDialog } from 'naive-ui'` |
| VueUse 工具 | `import { useLocalStorage, useToggle } from '@vueuse/core'` |
| 动画 | `import { useMotion } from '@vueuse/motion'` |
