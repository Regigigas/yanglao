<script setup lang="ts">
  /**
   * BasePage - 页面容器，带入场动画
   */
  import { useMotion } from '@vueuse/motion';
  import { ref } from 'vue';

  const props = withDefaults(
    defineProps<{ title?: string; padding?: string }>(),
    {
      padding: '24px',
    },
  );

  const el = ref<HTMLElement>();
  useMotion(el, {
    initial: { opacity: 0, y: 16 },
    enter: { opacity: 1, y: 0, transition: { duration: 280, ease: 'easeOut' } },
  });
</script>

<template>
  <div ref="el" :style="{ padding: padding }" class="page-container min-h-full">
    <div
      v-if="title || $slots['header-extra']"
      class="page-header mb-4 flex items-center justify-between gap-4"
    >
      <h2
        v-if="title"
        class="text-xl font-semibold text-gray-800 dark:text-gray-100"
      >
        {{ title }}
      </h2>
      <slot name="header-extra" />
    </div>
    <slot />
  </div>
</template>
