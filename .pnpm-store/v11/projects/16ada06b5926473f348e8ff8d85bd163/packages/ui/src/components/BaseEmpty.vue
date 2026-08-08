<script setup lang="ts">
  import { NEmpty } from 'naive-ui'

  withDefaults(defineProps<{ description?: string }>(), {
    description: '暂无数据',
  })
</script>

<template>
  <div class="flex items-center justify-center py-12">
    <NEmpty :description="description">
      <template #default>
        <slot />
      </template>
    </NEmpty>
  </div>
</template>
