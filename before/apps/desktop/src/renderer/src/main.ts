// apps/desktop/src/renderer/src/main.ts
// Vue 应用入口

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { MotionPlugin } from '@vueuse/motion'
import 'virtual:uno.css'
import './assets/iconfont.css'

import App from './App.vue'
import { router } from './router/index'
import { permDirective } from './directives/perm'

// TanStack Query 客户端配置
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 窗口重新聚焦时自动重新请求
      refetchOnWindowFocus: false,
      // 失败后重试 1 次
      retry: 1,
      // 数据过期时间 5 分钟（ms）
      staleTime: 5 * 60 * 1000,
    },
    mutations: {
      retry: 0,
    },
  },
})

const app = createApp(App)

app
  .use(createPinia())
  .use(router)
  .use(VueQueryPlugin, { queryClient })
  .use(MotionPlugin)
  .directive('perm', permDirective)
  .mount('#app')
