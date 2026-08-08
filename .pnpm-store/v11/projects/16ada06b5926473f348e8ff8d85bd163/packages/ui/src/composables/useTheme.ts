// packages/ui/src/composables/useTheme.ts
// naive-ui 亮/暗主题切换 composable

import { ref, computed } from 'vue'
import { darkTheme } from 'naive-ui'
import type { GlobalTheme } from 'naive-ui'

export type ThemeMode = 'light' | 'dark' | 'system'

const mode = ref<ThemeMode>(
  (() => {
    if (typeof localStorage !== 'undefined') {
      return (localStorage.getItem('theme') as ThemeMode) ?? 'light'
    }
    return 'light'
  })()
)

const systemDark = ref(
  typeof window !== 'undefined'
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : false
)

if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    systemDark.value = e.matches
  })
}

export function useTheme() {
  const isDark = computed(() => {
    if (mode.value === 'system') return systemDark.value
    return mode.value === 'dark'
  })

  const naiveTheme = computed<GlobalTheme | null>(() =>
    isDark.value ? darkTheme : null
  )

  const toggle = () => {
    mode.value = isDark.value ? 'light' : 'dark'
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', mode.value)
    }
  }

  const setMode = (m: ThemeMode) => {
    mode.value = m
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', m)
    }
  }

  return { mode, isDark, naiveTheme, toggle, setMode }
}
