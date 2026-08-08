// apps/desktop/src/renderer/src/env.d.ts
// 环境变量与全局类型声明

/// <reference types="vite/client" />
/// <reference types="@vueuse/core" />

import type { API } from '../../preload/index'

declare global {
  interface Window {
    /** 通过 contextBridge 暴露的安全 API */
    api: API
  }

  // 手动声明 ImportMeta.env（避免 vite 包不在直接依赖路径时 TS 报错）
  interface ImportMetaEnv {
    readonly VITE_API_BASE_URL?: string
    readonly VITE_REQUEST_TIMEOUT_MS?: string
    readonly [key: string]: string | boolean | undefined
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent
  export default component
}
