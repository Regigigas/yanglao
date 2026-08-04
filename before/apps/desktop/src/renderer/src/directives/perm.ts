// apps/desktop/src/renderer/src/directives/perm.ts
// v-perm 按钮级权限指令：v-perm="'elderly:create'" 无权限时移除该元素
//
// 用法：<NButton v-perm="'user:create'">新增账号</NButton>

import type { Directive } from 'vue'
import { useAuthStore } from '../stores/auth.store'

export const permDirective: Directive<HTMLElement, string> = {
  mounted(el, binding) {
    applyPerm(el, binding.value)
  },
  updated(el, binding) {
    applyPerm(el, binding.value)
  },
}

function applyPerm(el: HTMLElement, key: string) {
  const authStore = useAuthStore()
  if (!key || authStore.canUseButton(key)) return
  el.remove()
}
