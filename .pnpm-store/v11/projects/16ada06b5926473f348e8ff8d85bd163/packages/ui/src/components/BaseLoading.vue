<script setup lang="ts">
  import { NSpin } from 'naive-ui'

  withDefaults(defineProps<{ size?: 'small' | 'medium' | 'large'; tip?: string }>(), {
    size: 'medium',
  })
</script>

<template>
  <div class="flex items-center justify-center w-full py-8">
    <NSpin :size="size" :description="tip" />
  </div>
</template>
