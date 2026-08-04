<script setup lang="ts">
  import { NResult, NButton } from 'naive-ui'
  import { useRouter } from 'vue-router'
  const router = useRouter()
</script>

<template>
  <div class="flex-col-center h-full">
    <NResult status="404" title="页面不存在" description="你访问的页面可能已被删除或地址有误">
      <template #footer>
        <NButton type="primary" @click="router.push('/')">返回首页</NButton>
      </template>
    </NResult>
  </div>
</template>
