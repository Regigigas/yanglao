<template>
  <view :class="['update-page', settingsStore.pageClass()]">
    <view class="version-band">
      <view>
        <text class="version-label">当前版本</text>
        <text class="version-value">{{ runtime.appVersion }}</text>
      </view>
      <text class="version-code">Build {{ runtime.versionCode || '--' }}</text>
    </view>

    <view class="section-title">线上更新</view>
    <view class="surface source-panel">
      <view class="source-switch">
        <button :class="{ active: settings.source === 'default' }" @tap="setSource('default')">默认地址</button>
        <button :class="{ active: settings.source === 'custom' }" @tap="setSource('custom')">自定义地址</button>
      </view>
      <text v-if="settings.source === 'default'" class="address-value">{{ currentDefaultUrl }}</text>
      <textarea
        v-else
        v-model="settings.customUrl"
        class="address-input"
        maxlength="500"
        placeholder="https://example.com/system/app-update/latest"
      />
      <view class="action-row">
        <button class="secondary-button" @tap="persistSettings">保存设置</button>
        <button class="primary-button" :disabled="checking || downloading" @tap="checkOnline">
          {{ checking ? '检测中...' : '检测更新' }}
        </button>
      </view>
    </view>

    <view v-if="statusMessage" class="status-strip" :class="`is-${statusType}`">{{ statusMessage }}</view>

    <view v-if="onlineUpdate" class="surface release-panel">
      <view class="release-heading">
        <view>
          <text class="release-title">{{ onlineUpdate.title }}</text>
          <text class="release-version">{{ onlineUpdate.versionName }} · {{ packageLabel }}</text>
        </view>
        <text v-if="onlineUpdate.mandatory" class="mandatory">必须更新</text>
      </view>
      <text v-if="onlineUpdate.description" class="release-notes">{{ onlineUpdate.description }}</text>
      <text class="release-meta">来源 {{ onlineUpdate.sourceHost }}{{ onlineUpdate.size ? ` · ${formatBytes(onlineUpdate.size)}` : '' }}</text>
      <view v-if="downloading" class="download-block">
        <view class="progress-track"><view class="progress-value" :style="{ width: `${downloadProgress}%` }"></view></view>
        <view class="progress-copy"><text>下载中 {{ downloadProgress }}%</text><text @tap="cancelDownload">取消</text></view>
      </view>
      <button v-else class="primary-button full" @tap="startOnlineUpdate">{{ onlineActionLabel }}</button>
    </view>

    <view class="section-title">本地更新</view>
    <view class="surface local-panel">
      <view>
        <text class="release-title">选择本地更新包</text>
        <text class="release-version">Android APK / WGT</text>
      </view>
      <button class="secondary-button full" :disabled="installing || runtime.platform !== 'android'" @tap="selectLocalPackage">
        {{ installing ? '正在处理...' : runtime.platform === 'android' ? '选择更新包' : '当前平台不可用' }}
      </button>
    </view>
  </view>
</template>

<script>
import { useSettingsStore } from '../../store/settings'
import {
  activeUpdateUrl,
  checkForUpdate,
  chooseLocalUpdatePackage,
  createUpdateDownload,
  defaultUpdateUrl,
  getRuntimeInfo,
  getUpdateSettings,
  installUpdatePackage,
  openExternalUrl,
  packageType,
  saveUpdateSettings,
  verifyUpdatePackage
} from '../../utils/app-update'

export default {
  name: 'AppUpdatePage',
  setup() {
    return { settingsStore: useSettingsStore() }
  },
  data() {
    return {
      runtime: { appVersion: '--', versionCode: 0, platform: '' },
      settings: getUpdateSettings(),
      checking: false,
      downloading: false,
      installing: false,
      downloadProgress: 0,
      onlineUpdate: null,
      statusType: 'info',
      statusMessage: '',
      activeDownload: null
    }
  },
  computed: {
    currentDefaultUrl() { return defaultUpdateUrl() },
    packageLabel() {
      return this.onlineUpdate?.type === 'wgt' ? '资源更新'
        : this.onlineUpdate?.type === 'store' ? '应用商店' : '完整安装包'
    },
    onlineActionLabel() {
      return this.runtime.platform === 'ios' || this.onlineUpdate?.type === 'store' ? '前往更新'
        : ['web', 'h5'].includes(this.runtime.platform) ? '打开下载地址' : '下载并安装'
    }
  },
  async onLoad() {
    this.runtime = await getRuntimeInfo()
  },
  onUnload() {
    this.activeDownload?.abort()
  },
  methods: {
    setSource(source) {
      this.settings.source = source
      this.onlineUpdate = null
      this.statusMessage = ''
    },
    persistSettings(showToast = true) {
      try {
        this.settings = saveUpdateSettings(this.settings)
        if (showToast) uni.showToast({ title: '设置已保存', icon: 'success' })
        return true
      } catch (error) {
        uni.showToast({ title: error.message, icon: 'none' })
        return false
      }
    },
    async checkOnline() {
      if (!this.persistSettings(false)) return
      this.checking = true
      this.onlineUpdate = null
      this.setStatus('info', '正在连接更新服务...')
      try {
        const result = await checkForUpdate(activeUpdateUrl(this.settings), this.runtime)
        this.onlineUpdate = result.available ? result : null
        this.setStatus(result.available ? 'update' : 'success', result.available ? `发现版本 ${result.versionName}` : result.message)
      } catch (error) {
        this.setStatus('error', error.message || '检测更新失败')
      } finally {
        this.checking = false
      }
    },
    async startOnlineUpdate() {
      const update = this.onlineUpdate
      if (!update) return
      if (this.runtime.platform === 'ios' || update.type === 'store' || ['web', 'h5'].includes(this.runtime.platform)) {
        openExternalUrl(update.storeUrl || update.packageUrl)
        return
      }
      const confirmed = await this.confirm({
        title: `更新到 ${update.versionName}`,
        content: update.mandatory ? '此版本为必须更新，是否立即下载并安装？' : '是否立即下载并安装此更新？',
        showCancel: !update.mandatory
      })
      if (!confirmed) return
      this.downloading = true
      this.downloadProgress = 0
      this.activeDownload = createUpdateDownload(update.packageUrl, value => { this.downloadProgress = value })
      try {
        const filePath = await this.activeDownload.promise
        this.downloading = false
        this.installing = true
        this.setStatus('info', '安装包已下载，正在校验...')
        await verifyUpdatePackage(filePath, update)
        this.setStatus('info', '校验通过，正在调用系统安装...')
        await installUpdatePackage(filePath, update.type)
        this.setStatus('success', update.type === 'wgt' ? '更新完成，应用即将重启' : '已打开系统安装界面')
      } catch (error) {
        this.setStatus('error', error.message || '更新失败')
      } finally {
        this.activeDownload = null
        this.downloading = false
        this.installing = false
      }
    },
    cancelDownload() { this.activeDownload?.abort() },
    async selectLocalPackage() {
      this.installing = true
      try {
        const file = await chooseLocalUpdatePackage()
        const type = packageType(file.name)
        const confirmed = await this.confirm({ title: '安装本地更新', content: `${file.name}\n${this.formatBytes(file.size)}\n确认安装此更新包？` })
        if (!confirmed) return
        await installUpdatePackage(file.path, type)
        this.setStatus('success', type === 'wgt' ? '更新完成，应用即将重启' : '已打开系统安装界面')
      } catch (error) {
        if (error.message !== '已取消选择') this.setStatus('error', error.message || '本地更新失败')
      } finally {
        this.installing = false
      }
    },
    confirm(options) {
      return new Promise(resolve => uni.showModal({ ...options, success: result => resolve(result.confirm), fail: () => resolve(false) }))
    },
    setStatus(type, message) { this.statusType = type; this.statusMessage = message },
    formatBytes(bytes) {
      const value = Number(bytes || 0)
      if (value < 1024) return `${value} B`
      if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`
      return `${(value / 1024 / 1024).toFixed(1)} MB`
    }
  }
}
</script>

<style scoped lang="scss">
.update-page { min-height: 100vh; padding: 28rpx 28rpx calc(48rpx + env(safe-area-inset-bottom)); box-sizing: border-box; background: var(--bg-page); color: var(--text-primary); }
.version-band { padding: 30rpx 28rpx; display: flex; align-items: flex-end; justify-content: space-between; border-left: 8rpx solid #f0b94d; background: var(--bg-nav); color: #fff; }
.version-label, .version-value, .release-title, .release-version, .release-notes, .release-meta { display: block; }
.version-label { color: rgba(255,255,255,.72); font-size: 21rpx; }
.version-value { margin-top: 8rpx; font-size: 40rpx; font-weight: 700; }
.version-code { color: rgba(255,255,255,.8); font-size: 22rpx; }
.section-title { padding: 28rpx 4rpx 12rpx; color: var(--text-secondary); font-size: 22rpx; }
.surface { padding: 24rpx; border: 1rpx solid var(--border-color); border-radius: 8rpx; background: var(--bg-card); }
.source-switch { height: 72rpx; padding: 4rpx; display: grid; grid-template-columns: 1fr 1fr; border-radius: 8rpx; background: var(--bg-page); }
.source-switch button { height: 64rpx; margin: 0; border-radius: 6rpx; background: transparent; color: var(--text-secondary); font-size: 24rpx; line-height: 64rpx; }
.source-switch button.active { background: var(--bg-card); color: var(--primary-color); font-weight: 600; }
.address-value { margin-top: 20rpx; padding: 18rpx; display: block; overflow-wrap: anywhere; border: 1rpx solid var(--border-color); color: var(--text-secondary); font-size: 21rpx; line-height: 1.5; }
.address-input { width: 100%; height: 130rpx; margin-top: 20rpx; padding: 16rpx; box-sizing: border-box; border: 1rpx solid var(--border-color); border-radius: 6rpx; background: var(--bg-page); font-size: 23rpx; }
.action-row { margin-top: 20rpx; display: grid; grid-template-columns: 1fr 1.4fr; gap: 14rpx; }
.primary-button, .secondary-button { height: 76rpx; margin: 0; border-radius: 8rpx; font-size: 24rpx; font-weight: 600; line-height: 76rpx; }
.primary-button { background: var(--primary-color); color: #fff; }
.secondary-button { border: 1rpx solid var(--border-color); background: var(--bg-card); color: var(--primary-color); }
.full { width: 100%; margin-top: 22rpx; }
.status-strip { margin-top: 18rpx; padding: 17rpx 19rpx; border-left: 6rpx solid #6d8294; background: #edf2f6; color: #455868; font-size: 23rpx; }
.status-strip.is-success { border-color: #4d9168; background: #e9f4ed; color: #31714b; }
.status-strip.is-update { border-color: #bd821f; background: #fff2d9; color: #805200; }
.status-strip.is-error { border-color: #b34d45; background: #fae9e7; color: #943d37; }
.release-panel { margin-top: 18rpx; }
.release-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 20rpx; }
.release-title { font-size: 27rpx; font-weight: 650; }
.release-version { margin-top: 7rpx; color: var(--text-secondary); font-size: 21rpx; }
.mandatory { flex: none; padding: 6rpx 10rpx; border-radius: 4rpx; background: #fae9e7; color: #a03d36; font-size: 19rpx; }
.release-notes { margin-top: 20rpx; color: var(--text-regular); font-size: 23rpx; line-height: 1.7; white-space: pre-wrap; }
.release-meta { margin-top: 18rpx; padding-top: 16rpx; border-top: 1rpx solid var(--divider-color); color: var(--text-secondary); font-size: 20rpx; }
.download-block { margin-top: 22rpx; }
.progress-track { height: 12rpx; overflow: hidden; border-radius: 6rpx; background: var(--bg-page); }
.progress-value { height: 100%; background: var(--primary-color); }
.progress-copy { margin-top: 10rpx; display: flex; justify-content: space-between; color: var(--text-secondary); font-size: 21rpx; }
.local-panel { display: block; }
</style>
