<script setup lang="ts">
  import { NModal, NCard } from 'naive-ui'

  interface Props {
    modelValue: boolean
    title?: string
    width?: string
    maskClosable?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    title: '',
    width: '520px',
    maskClosable: true,
  })

  const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    close: []
  }>()

  const handleClose = () => {
    emit('update:modelValue', false)
    emit('close')
  }
</script>

<template>
  <NModal
    :show="modelValue"
    :mask-closable="maskClosable"
    @update:show="(v) => (v ? emit('update:modelValue', true) : handleClose())"
  >
    <NCard
      :title="title"
      :style="{ width }"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <template #header-extra>
        <slot name="header-extra" />
      </template>
      <slot />
      <template v-if="$slots.footer" #footer>
        <slot name="footer" />
      </template>
    </NCard>
  </NModal>
</template>
