<script setup lang="ts">
  import { NTag } from 'naive-ui'
  import type { TagProps } from 'naive-ui'

  interface Props extends /* @vue-ignore */ Partial<TagProps> {}
  defineProps<Props>()
</script>

<template>
  <NTag v-bind="$props">
    <slot />
  </NTag>
</template>
