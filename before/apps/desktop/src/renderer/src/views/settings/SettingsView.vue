<script setup lang="ts">
  defineOptions({ name: 'Settings' })
  import { BasePage } from '@yanglao/ui'
  import {
    NCard, NFormItem, NSwitch, NForm, NInput, NInputNumber,
    NButton, NSpace, NTag, NAlert, NDivider, NText, NSelect, useMessage
  } from 'naive-ui'
  import { useTheme } from '@ui/composables/useTheme'
  import { useLanStore } from '../../stores/lan.store'
  import { onMounted, ref, computed } from 'vue'
  import { initAutoRefresh } from '../../composables/useAutoRefresh'
  import DatabaseSafetyPanel from '../../components/DatabaseSafetyPanel.vue'

  const { isDark, toggle } = useTheme()
  const lanStore = useLanStore()
  const message = useMessage()

  const starting = ref(false)
  const portInput = ref(7788)
  const secretInput = ref('')
  const allowWrite = ref(true)

  // ── 数据库文件位置 ────────────────────────────────────────────
  const dbPathInfo = ref<{ current: string; default: string; isCustom: boolean } | null>(null)
  const dbPathSaving = ref(false)

  // ── 自动刷新配置 ──────────────────────────────────────────────
  const autoRefreshSec = ref(0)   // 0 = 关闭
  const autoRefreshSaving = ref(false)

  const autoRefreshPresets = [
    { label: '关闭（手动刷新）', value: 0 },
    { label: '每 30 秒', value: 30 },
    { label: '每 1 分钟', value: 60 },
    { label: '每 5 分钟', value: 300 },
    { label: '每 10 分钟', value: 600 },
    { label: '每 30 分钟', value: 1800 },
    { label: '自定义秒数', value: -1 },
  ]

  const useCustomInterval = computed(() =>
    autoRefreshSec.value > 0
    && !autoRefreshPresets.some(p => p.value === autoRefreshSec.value && p.value !== -1)
  )

  const presetSelected = computed({
    get() {
      const found = autoRefreshPresets.find(p => p.value === autoRefreshSec.value)
      return found ? found.value : -1
    },
    set(v: number) {
      if (v === -1) {
        // 自定义模式：保留当前值（或设为 60）
        if (autoRefreshSec.value <= 0) autoRefreshSec.value = 60
      } else {
        autoRefreshSec.value = v
      }
    },
  })

  onMounted(async () => {
    await lanStore.fetchAll()
    if (lanStore.config) {
      portInput.value = lanStore.config.port
      secretInput.value = lanStore.config.secret ?? ''
      allowWrite.value = lanStore.config.allow_write === 1
    }
    // 加载当前数据库路径信息
    dbPathInfo.value = await window.api.db.getPath()
    // 加载自动刷新配置
    const appCfg = await window.api.config.app.get()
    autoRefreshSec.value = appCfg.autoRefreshSec ?? 0
  })

  const running = computed(() => lanStore.status.running)

  async function handleToggleHost(value: boolean) {
    starting.value = true
    try {
      if (value) {
        await lanStore.saveConfig({
          port: portInput.value,
          allow_write: allowWrite.value ? 1 : 0,
          secret: secretInput.value || null,
        })
        const res = await lanStore.start(portInput.value)
        if (res.ok) {
          await lanStore.fetchAll()
          secretInput.value = lanStore.config?.secret ?? ''
          message.success('局域网主机服务已启动')
        } else {
          message.error(res.error ?? '启动失败')
        }
      } else {
        await lanStore.stop()
        message.info('局域网主机服务已停止')
      }
    } finally {
      starting.value = false
    }
  }

  async function handleSaveHostConfig() {
    await lanStore.saveConfig({
      port: portInput.value,
      allow_write: allowWrite.value ? 1 : 0,
      secret: secretInput.value || null,
    })
    await lanStore.fetchAll()
    secretInput.value = lanStore.config?.secret ?? ''
    message.success('配置已保存')
    if (running.value) {
      message.warning('端口变更需重启主机服务才能生效')
    }
  }

  function copyUrl(url: string) {
    navigator.clipboard?.writeText(url)
    message.success('已复制：' + url)
  }

  async function handleSelectDbPath() {
    const result = await window.api.db.selectPath()
    if (result.canceled || !result.path) return
    dbPathSaving.value = true
    try {
      await window.api.db.setPath(result.path)
      dbPathInfo.value = await window.api.db.getPath()
      message.warning('数据库路径已更改，重启应用后新路径生效。新路径不含原有数据，需要手动复制原数据库文件。')
    } finally {
      dbPathSaving.value = false
    }
  }

  async function handleResetDbPath() {
    dbPathSaving.value = true
    try {
      await window.api.db.resetPath()
      dbPathInfo.value = await window.api.db.getPath()
      message.warning('已恢复为默认路径，重启应用后生效。')
    } finally {
      dbPathSaving.value = false
    }
  }

  /** 保存自动刷新配置并立即生效 */
  async function handleSaveAutoRefresh() {
    if (autoRefreshSec.value < 0) autoRefreshSec.value = 0
    autoRefreshSaving.value = true
    try {
      await window.api.config.app.set({ autoRefreshSec: autoRefreshSec.value })
      // 立即在当前运行时生效，无需重启
      initAutoRefresh(autoRefreshSec.value)
      if (autoRefreshSec.value > 0) {
        message.success(`自动刷新已启用，每 ${autoRefreshSec.value} 秒刷新一次`)
      } else {
        message.info('自动刷新已关闭')
      }
    } finally {
      autoRefreshSaving.value = false
    }
  }
</script>

<template>
  <BasePage title="系统设置">
    <NCard title="外观" class="mb-4">
      <NFormItem label="深色模式">
        <NSwitch :value="isDark" @update:value="toggle" />
      </NFormItem>
    </NCard>

    <!-- 数据安全与备份 -->
    <NCard title="数据安全与备份" class="mb-4">
      <DatabaseSafetyPanel />
    </NCard>

    <!-- 数据库文件位置 -->
    <NCard title="数据库文件位置" class="mb-4">
      <NAlert type="info" class="mb-4">
        应用数据存储在本地 SQLite 文件中。默认保存在系统 userData 目录，您可以将其指向网络共享目录（NAS/局域网盘）
        以实现多台电脑共用同一数据库，<b>但请确保同一时刻只有一台电脑写入</b>，否则可能导致数据损坏。
        修改路径需要<b>重启应用</b>后才能生效，且新路径下不含原有数据——如需迁移，请在修改前手动将原数据库文件复制到新位置。
      </NAlert>

      <NForm label-placement="left" label-width="100">
        <NFormItem label="当前路径">
          <NSpace vertical style="width:100%">
            <NSpace align="center" :wrap="false">
              <NTag :type="dbPathInfo?.isCustom ? 'warning' : 'default'" size="small">
                {{ dbPathInfo?.isCustom ? '自定义' : '默认' }}
              </NTag>
              <NText
                style="font-family:monospace;font-size:12px;word-break:break-all;flex:1"
                depth="2"
              >
                {{ dbPathInfo?.current ?? '加载中...' }}
              </NText>
            </NSpace>
            <NText v-if="dbPathInfo?.isCustom" depth="3" class="text-xs">
              默认路径：{{ dbPathInfo.default }}
            </NText>
          </NSpace>
        </NFormItem>

        <NFormItem>
          <NSpace>
            <NButton
              type="primary"
              :loading="dbPathSaving"
              @click="handleSelectDbPath"
            >
              更改位置...
            </NButton>
            <NButton
              v-if="dbPathInfo?.isCustom"
              :loading="dbPathSaving"
              @click="handleResetDbPath"
            >
              恢复默认
            </NButton>
          </NSpace>
        </NFormItem>
      </NForm>
    </NCard>

    <!-- 数据自动刷新 -->
    <NCard title="数据自动刷新" class="mb-4">
      <NAlert type="info" class="mb-4">
        开启后，各数据页面会按设定的间隔自动从数据库重新获取最新数据（无需手动点击刷新按钮）。
        每个页面右上角也提供了"刷新"按钮，可随时手动刷新当前页面数据。
      </NAlert>

      <NForm label-placement="left" label-width="100">
        <NFormItem label="刷新间隔">
          <NSpace align="center">
            <NSelect v-model:value="presetSelected" :options="autoRefreshPresets" style="width: 180px" />
            <NInputNumber
              v-if="useCustomInterval || presetSelected === -1"
              v-model:value="autoRefreshSec"
              :min="5"
              :max="3600"
              style="width: 140px"
            />
            <NText v-if="autoRefreshSec > 0" depth="3" class="text-xs">秒</NText>
          </NSpace>
        </NFormItem>
        <NFormItem>
          <NButton type="primary" :loading="autoRefreshSaving" @click="handleSaveAutoRefresh">
            保存并立即生效
          </NButton>
        </NFormItem>
      </NForm>
    </NCard>

    <!-- 局域网主机模式 -->
    <NCard title="局域网联机 · 主机模式" class="mb-4">
      <NAlert type="info" class="mb-4">
        开启后，本机将作为局域网内的数据同步中心。其他电脑只需在"数据同步"页面，
        将服务端地址设置为本机的局域网地址（如下方列出），即可与本机互通数据，无需额外服务器。
      </NAlert>

      <NSpace align="center" class="mb-4">
        <NSwitch :value="running" :loading="starting" @update:value="handleToggleHost" />
        <NTag :type="running ? 'success' : 'default'">{{ running ? '运行中' : '已停止' }}</NTag>
        <NText v-if="running" depth="3" class="text-sm">监听端口：{{ lanStore.status.port }}</NText>
      </NSpace>

      <!-- 本机访问地址 -->
      <div v-if="running && lanStore.status.urls.length" class="mb-4">
        <NText depth="2" class="text-sm">其他电脑请填写以下任一地址作为"服务端地址"：</NText>
        <NSpace vertical class="mt-2">
          <NSpace v-for="url in lanStore.status.urls" :key="url" align="center">
            <NTag type="info" size="large" style="font-family: monospace">{{ url }}</NTag>
            <NButton size="small" @click="copyUrl(url)">复制</NButton>
          </NSpace>
        </NSpace>
      </div>
      <NAlert v-else-if="running && !lanStore.status.urls.length" type="warning" class="mb-4">
        未检测到局域网网卡地址，请确认本机已连接局域网/WiFi。
      </NAlert>

      <NDivider />

      <NForm label-placement="left" label-width="120">
        <NFormItem label="监听端口">
          <NInputNumber v-model:value="portInput" :min="1024" :max="65535" style="width: 160px" />
          <NText depth="3" class="ml-2 text-xs">默认 7788，如被占用可修改</NText>
        </NFormItem>
        <NFormItem label="允许客户端写入">
          <NSwitch v-model:value="allowWrite" />
          <NText depth="3" class="ml-2 text-xs">关闭后仅允许其他电脑下载数据，不能上传变更</NText>
        </NFormItem>
        <NFormItem label="访问密钥">
          <NInput v-model:value="secretInput" placeholder="留空启动时自动生成" style="width: 260px" />
          <NText depth="3" class="ml-2 text-xs">其他电脑请将此密钥填入数据同步的访问令牌</NText>
        </NFormItem>
        <NFormItem>
          <NButton type="primary" @click="handleSaveHostConfig">保存配置</NButton>
        </NFormItem>
      </NForm>
    </NCard>
  </BasePage>
</template>
