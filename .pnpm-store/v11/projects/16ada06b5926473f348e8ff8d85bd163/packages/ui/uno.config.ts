// packages/ui/uno.config.ts
// UnoCSS 配置 - 供 apps/desktop 和未来其他平台引用

import {
  defineConfig,
  presetUno,
  presetAttributify,
  presetIcons,
  transformerVariantGroup,
  transformerDirectives,
} from 'unocss'

export default defineConfig({
  // 排班单元格的 BEM 类被图标提取器错误拼接为图标名，精确忽略该伪类名。
  blocklist: [/^i-ion:day-cell--clickable-alarm$/],
  presets: [
    // 默认原子化 CSS（Tailwind/Windi 兼容）
    presetUno(),
    // 属性化模式：<div flex items-center />
    presetAttributify(),
    // 图标预设（配合 @iconify/vue）
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
  ],
  transformers: [
    // 分组变体：hover:(bg-red text-white)
    transformerVariantGroup(),
    // @apply / @screen 指令支持
    transformerDirectives(),
  ],
  shortcuts: {
    // 常用布局快捷方式
    'flex-center': 'flex items-center justify-center',
    'flex-between': 'flex items-center justify-between',
    'flex-col-center': 'flex flex-col items-center justify-center',
    // 文本截断
    'text-ellipsis': 'overflow-hidden whitespace-nowrap text-ellipsis',
    // 卡片容器
    'card': 'bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4',
    // 表单输入统一样式
    'form-item': 'flex flex-col gap-1 mb-4',
  },
  theme: {
    colors: {
      // 主色调（与 naive-ui 主题保持一致，可按需调整）
      primary: '#18a058',
      danger: '#d03050',
      warning: '#f0a020',
      info: '#2080f0',
    },
    fontFamily: {
      sans: ['PingFang SC', 'Microsoft YaHei', 'sans-serif'],
    },
  },
})
