<script setup lang="ts">
  /**
   * SyncView - 数据同步配置页面
   * 支持：手动触发 / 自动间隔 / cron定时 / 固定时间
   * 时间单位：ms（毫秒）和 分钟（界面展示用分钟，实际存储 ms）
   */
  defineOptions({ name: 'SyncPanel' })
  import {
    NCard, NForm, NFormItem, NInput, NInputNumber, NSwitch, NSelect,
    NButton, NSpace, NTag, NDivider, NAlert, NText, useMessage,
  } from 'naive-ui'
  import { BasePage, AnimFade } from '@yanglao/ui'
  import { useSyncStore } from '../../stores/sync.store'
  import { msToMinutes, minutesToMs, formatDateTime } from '@yanglao/core'
  import { ref, computed, onMounted } from 'vue'

  const syncStore = useSyncStore()
  const message = useMessage()

  const saving = ref(false)
  const manualLoading = ref(false)
  const testing = ref(false)
  const testResult = ref<{ ok: boolean; latency?: number; error?: string } | null>(null)

  // 本地表单模型（以分钟为单位展示）
  const form = ref({
    enabled: false,
    trigger: 'manual' as 'manual' | 'auto' | 'scheduled' | 'timed',
    intervalMinutes: 5,       // 自动同步间隔（分钟），映射为 intervalMs
    cronExpression: '0 9 * * *',
    fixedTimesStr: '09:00,18:00',
    serverUrl: '',
    accessToken: '',
    direction: 'both' as 'upload' | 'download' | 'both',
  })

  onMounted(async () => {
    await syncStore.loadConfig()
    if (syncStore.config) {
      const c = syncStore.config
      form.value = {
        enabled: c.enabled,
        trigger: c.trigger,
        intervalMinutes: msToMinutes(c.intervalMs),
        cronExpression: c.cronExpression ?? '0 9 * * *',
        fixedTimesStr: c.fixedTimes?.join(',') ?? '09:00,18:00',
        serverUrl: c.serverUrl,
        accessToken: c.accessToken ?? '',
        direction: c.direction,
      }
    }
  })

  const triggerOptions = [
    { label: '手动触发', value: 'manual' },
    { label: '自动间隔', value: 'auto' },
    { label: 'Cron定时', value: 'scheduled' },
    { label: '固定时间', value: 'timed' },
  ]

  const directionOptions = [
    { label: '双向同步', value: 'both' },
    { label: '仅上传', value: 'upload' },
    { label: '仅下载', value: 'download' },
  ]

  const statusTag = computed(() => {
    const map: Record<string, { type: 'default' | 'success' | 'error' | 'warning' | 'info'; text: string }> = {
      idle: { type: 'default', text: '空闲' },
      syncing: { type: 'info', text: '同步中' },
      success: { type: 'success', text: '成功' },
      error: { type: 'error', text: '失败' },
      disabled: { type: 'default', text: '已禁用' },
    }
    return map[syncStore.status] ?? map.idle
  })

  async function handleSave() {
    saving.value = true
    try {
      await syncStore.saveConfig({
        enabled: form.value.enabled,
        trigger: form.value.trigger,
        intervalMs: minutesToMs(form.value.intervalMinutes),  // 分钟转 ms 存储
        cronExpression: form.value.trigger === 'scheduled' ? form.value.cronExpression : undefined,
        fixedTimes: form.value.trigger === 'timed'
          ? form.value.fixedTimesStr.split(',').map(s => s.trim()).filter(Boolean)
          : undefined,
        serverUrl: form.value.serverUrl,
        accessToken: form.value.accessToken,
        direction: form.value.direction,
      })
      message.success('配置已保存')
    } finally {
      saving.value = false
    }
  }

  async function handleManual() {
    manualLoading.value = true
    try {
      await syncStore.triggerManual()
      message.info('同步已触发，请稍候')
    } finally {
      manualLoading.value = false
    }
  }

  /** 测试与服务端（局域网主机或远程服务器）的连通性 */
  async function handleTestConnection() {
    if (!form.value.serverUrl) {
      message.error('请先填写服务端地址')
      return
    }
    testing.value = true
    testResult.value = null
    try {
      testResult.value = await window.api.lan.ping(form.value.serverUrl)
      const result = testResult.value
      if (result?.ok) {
        message.success(`连接成功，延迟 ${result.latency}ms`)
      } else {
        message.error(`连接失败：${result?.error}`)
      }
    } finally {
      testing.value = false
    }
  }
</script>

<template>
  <BasePage title="数据同步">
    <!-- 当前同步状态 -->
    <NCard class="mb-4">
      <NSpace align="center" justify="space-between">
        <NSpace align="center" :size="16">
          <span class="text-sm text-gray-600 dark:text-gray-300">同步状态：</span>
          <NTag :type="statusTag.type">{{ statusTag.text }}</NTag>
          <span v-if="syncStore.lastSyncAt" class="text-xs text-gray-400">
            上次同步: {{ formatDateTime(syncStore.lastSyncAt) }}
          </span>
        </NSpace>
        <NSpace>
          <NTag type="warning" v-if="syncStore.pendingCount > 0">
            {{ syncStore.pendingCount }} 条待上传
          </NTag>
          <NButton
            type="primary"
            :loading="manualLoading || syncStore.status === 'syncing'"
            @click="handleManual"
          >
            立即同步
          </NButton>
        </NSpace>
      </NSpace>
      <NAlert v-if="syncStore.lastError" type="error" class="mt-3" :title="syncStore.lastError" />
    </NCard>

    <!-- 同步配置表单 -->
    <NCard title="同步配置">
      <NForm :model="form" label-placement="left" label-width="110">
        <NFormItem label="服务端地址" path="serverUrl">
          <NSpace vertical style="width: 100%">
            <NSpace :wrap="false">
              <NInput
                v-model:value="form.serverUrl"
                placeholder="局域网主机示例：http://192.168.1.10:7788"
                clearable
                style="width: 320px"
              />
              <NButton :loading="testing" @click="handleTestConnection">测试连接</NButton>
            </NSpace>
            <NTag v-if="testResult" :type="testResult.ok ? 'success' : 'error'" size="small">
              {{ testResult.ok ? `连接正常（${testResult.latency}ms）` : `连接失败：${testResult.error}` }}
            </NTag>
            <NText depth="3" class="text-xs">
              若要连接同一局域网内的主机电脑，请在主机的"系统设置"页开启"局域网联机主机模式"，并填写其显示的地址。
            </NText>
          </NSpace>
        </NFormItem>

        <NFormItem label="访问令牌">
          <NInput
            v-model:value="form.accessToken"
            type="password"
            show-password-on="click"
            placeholder="RuoYi 登录后获得的 Bearer Token"
            clearable
            style="width: 320px"
          />
        </NFormItem>

        <NFormItem label="同步方向">
          <NSelect v-model:value="form.direction" :options="directionOptions" style="width: 160px" />
        </NFormItem>

        <NDivider />

        <NFormItem label="启用同步">
          <NSwitch v-model:value="form.enabled" />
        </NFormItem>

        <NFormItem label="触发方式" v-if="form.enabled">
          <NSelect v-model:value="form.trigger" :options="triggerOptions" style="width: 160px" />
        </NFormItem>

        <!-- 自动间隔配置 -->
        <AnimFade v-if="form.enabled && form.trigger === 'auto'">
          <NFormItem label="同步间隔（分钟）">
            <NInputNumber
              v-model:value="form.intervalMinutes"
              :min="1"
              :max="1440"
              placeholder="5"
              style="width: 160px"
            />
            <span class="ml-2 text-xs text-gray-400">= {{ minutesToMs(form.intervalMinutes) }} ms</span>
          </NFormItem>
        </AnimFade>

        <!-- cron 配置 -->
        <AnimFade v-if="form.enabled && form.trigger === 'scheduled'">
          <NFormItem label="Cron 表达式">
            <NInput v-model:value="form.cronExpression" placeholder="0 9 * * *" style="width: 220px" />
            <span class="ml-2 text-xs text-gray-400">（如每天9:00: 0 9 * * *）</span>
          </NFormItem>
        </AnimFade>

        <!-- 固定时间配置 -->
        <AnimFade v-if="form.enabled && form.trigger === 'timed'">
          <NFormItem label="固定触发时间">
            <NInput
              v-model:value="form.fixedTimesStr"
              placeholder="09:00,18:00"
              style="width: 220px"
            />
            <span class="ml-2 text-xs text-gray-400">多个时间用逗号分隔</span>
          </NFormItem>
        </AnimFade>

        <NFormItem>
          <NButton type="primary" :loading="saving" @click="handleSave">保存配置</NButton>
        </NFormItem>
      </NForm>
    </NCard>
  </BasePage>
</template>
