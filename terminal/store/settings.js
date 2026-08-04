/**
 * settings.js — 主题与字体大小状态管理
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  // 主题：light | dark | green | warm
  const theme = ref('light')
  // 字体大小：sm | md | lg | xl
  const fontSize = ref('md')

  /** 从本地存储初始化 */
  function initFromStorage() {
    const savedTheme = uni.getStorageSync('yl_theme')
    const savedFont  = uni.getStorageSync('yl_font_size')
    if (savedTheme)  theme.value    = savedTheme
    if (savedFont)   fontSize.value = savedFont
  }

  /** 设置主题 */
  function setTheme(val) {
    theme.value = val
    uni.setStorageSync('yl_theme', val)
  }

  /** 设置字体大小 */
  function setFontSize(val) {
    fontSize.value = val
    uni.setStorageSync('yl_font_size', val)
  }

  /** 获取页面根节点 class（主题 + 字体） */
  function pageClass() {
    return `theme-${theme.value} font-${fontSize.value}`
  }

  return { theme, fontSize, initFromStorage, setTheme, setFontSize, pageClass }
})
