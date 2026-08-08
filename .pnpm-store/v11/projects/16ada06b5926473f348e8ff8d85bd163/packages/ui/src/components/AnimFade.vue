<script setup lang="ts">
  /**
   * AnimFade - 淡入/淡出动画容器
   * 使用 @vueuse/motion
   */
  import { useMotion } from '@vueuse/motion'
  import { ref } from 'vue'

  const props = withDefaults(
    defineProps<{
      /** 动画持续时间（ms），默认 300ms */
      durationMs?: number
      /** 延迟（ms），默认 0 */
      delayMs?: number
    }>(),
    { durationMs: 300, delayMs: 0 }
  )

  const el = ref<HTMLElement>()
  useMotion(el, {
    initial: { opacity: 0 },
    enter: {
      opacity: 1,
      transition: { duration: props.durationMs, delay: props.delayMs },
    },
    leave: { opacity: 0, transition: { duration: props.durationMs } },
  })
</script>

<template>
  <div ref="el">
    <slot />
  </div>
</template>
