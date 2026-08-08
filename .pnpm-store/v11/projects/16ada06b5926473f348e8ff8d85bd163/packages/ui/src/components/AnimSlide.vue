<script setup lang="ts">
  /**
   * AnimSlide - 滑入动画容器（方向可配置）
   */
  import { useMotion } from '@vueuse/motion'
  import { ref, computed } from 'vue'

  const props = withDefaults(
    defineProps<{
      direction?: 'up' | 'down' | 'left' | 'right'
      /** 滑动距离（px），默认 20 */
      distance?: number
      /** 动画持续时间（ms），默认 300 */
      durationMs?: number
      /** 延迟（ms），默认 0 */
      delayMs?: number
    }>(),
    { direction: 'up', distance: 20, durationMs: 300, delayMs: 0 }
  )

  const offset = computed(() => {
    switch (props.direction) {
      case 'up': return { y: props.distance }
      case 'down': return { y: -props.distance }
      case 'left': return { x: props.distance }
      case 'right': return { x: -props.distance }
    }
  })

  const el = ref<HTMLElement>()
  useMotion(el, {
    initial: { opacity: 0, ...offset.value },
    enter: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: props.durationMs, delay: props.delayMs, ease: 'easeOut' },
    },
  })
</script>

<template>
  <div ref="el">
    <slot />
  </div>
</template>
