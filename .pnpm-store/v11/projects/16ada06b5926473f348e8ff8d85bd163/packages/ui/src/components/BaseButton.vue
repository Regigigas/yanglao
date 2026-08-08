<script setup lang="ts">
  import { NButton } from 'naive-ui'
  import type { ButtonProps } from 'naive-ui'
  import { useMotion } from '@vueuse/motion'
  import { ref } from 'vue'

  interface Props extends /* @vue-ignore */ ButtonProps {
    /** 是否带入场动画（默认 true） */
    animated?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    animated: true,
    type: 'default',
  })

  const el = ref<HTMLElement>()
  // 仅在宿主环境支持时启用动画（小程序不支持，但组件库在小程序场景下不使用此组件）
  if (props.animated && typeof window !== 'undefined') {
    useMotion(el, {
      initial: { opacity: 0, scale: 0.95 },
      enter: { opacity: 1, scale: 1, transition: { duration: 200 } },
    })
  }
</script>

<template>
  <NButton ref="el" v-bind="$props">
    <slot />
  </NButton>
</template>
