<script setup lang="ts">
  import { NConfigProvider, NMessageProvider, NDialogProvider, NNotificationProvider, NGlobalStyle } from 'naive-ui'
  import { RouterView } from 'vue-router'
  import { useTheme } from '@yanglao/ui'
  import { useSyncStore } from './stores/sync.store'

  const { naiveTheme } = useTheme()
  const syncStore = useSyncStore()
  // 初始化同步状态监听（监听主进程推送的同步事件）
  syncStore.initListener()
</script>

<template>
  <NConfigProvider :theme="naiveTheme" :locale="zhCN" :date-locale="dateZhCN">
    <NGlobalStyle />
    <NMessageProvider>
      <NNotificationProvider>
        <NDialogProvider>
          <RouterView />
        </NDialogProvider>
      </NNotificationProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>

<script lang="ts">
  // 在 setup 之外引入 naive-ui locale（避免 defineComponent 冲突）
  import { zhCN, dateZhCN } from 'naive-ui'
  export { zhCN, dateZhCN }
</script>
