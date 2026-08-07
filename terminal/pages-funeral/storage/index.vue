<template>
  <view :class="['page-container', settingsStore.pageClass()]">
    <NavBar title="证明材料存储" :show-back="true" />

    <view class="path-panel">
      <view class="path-head">
        <text class="iconfont icon-location"></text>
        <text>当前保存位置</text>
      </view>
      <text class="current-path">{{ displayPath }}</text>
      <view class="copy-path" @tap="copyPath"><text class="iconfont icon-record"></text><text>复制路径</text></view>
    </view>

    <view class="section-title">存储区域</view>
    <view class="location-list">
      <view
        v-for="location in locations"
        :key="location.id"
        class="location-option"
        :class="{ selected: config.location === location.id }"
        @tap="selectLocation(location)"
      >
        <view class="radio"><text v-if="config.location === location.id" class="iconfont icon-check"></text></view>
        <view class="location-copy">
          <text class="location-name">{{ location.label }}</text>
          <text class="location-description">{{ location.description }}</text>
          <text class="location-root">{{ location.virtualRoot }}</text>
        </view>
      </view>
    </view>

    <view class="section-title">目录名称</view>
    <view class="setting-panel">
      <input v-model="config.folder" class="folder-input" placeholder="请输入子目录" @input="clearResolvedPath" />
      <text class="setting-note">每个档案将在此目录下按“档案编号_姓名”建立独立文件夹。</text>
    </view>

    <view class="section-title">图片压缩质量</view>
    <view class="setting-panel">
      <view class="quality-options">
        <view
          v-for="item in qualities"
          :key="item.value"
          class="quality-item"
          :class="{ selected: config.quality === item.value }"
          @tap="config.quality = item.value"
        >
          <text class="quality-value">{{ item.value }}%</text>
          <text class="quality-label">{{ item.label }}</text>
        </view>
      </view>
      <text class="setting-note">所有证明图片先压缩再保存，原图不会复制到材料目录。</text>
    </view>

    <view class="storage-info">
      <text class="info-title">目录说明</text>
      <text class="info-row">公共文档：可在系统文件管理器的“文档”中查找。</text>
      <text class="info-row">公共下载：可在系统文件管理器的“下载”中查找。</text>
      <text class="info-row">应用专用：隐私性更高，卸载应用时可能一并删除。</text>
    </view>

    <view class="save-bar">
      <view class="save-button" @tap="saveConfig">
        <text class="iconfont icon-check"></text>
        <text>创建目录并保存设置</text>
      </view>
    </view>
  </view>
</template>

<script>
import { useSettingsStore } from '../../store/settings'
import {
  FUNERAL_STORAGE_LOCATIONS,
  getConfiguredStoragePath,
  getFuneralStorageConfig,
  prepareFuneralStorageDirectory,
  saveFuneralStorageConfig
} from '../../utils/funeral-storage'
import NavBar from '../../components/NavBar.vue'

export default {
  name: 'FuneralStoragePage',
  components: { NavBar },
  setup() { return { settingsStore: useSettingsStore() } },
  data() {
    return {
      config: getFuneralStorageConfig(),
      locations: FUNERAL_STORAGE_LOCATIONS,
      qualities: [
        { value: 50, label: '较小文件' },
        { value: 65, label: '节省空间' },
        { value: 70, label: '推荐' },
        { value: 85, label: '清晰优先' }
      ]
    }
  },
  computed: {
    displayPath() { return this.config.resolvedPath || getConfiguredStoragePath(this.config) }
  },
  methods: {
    selectLocation(location) {
      const oldLocation = this.locations.find((item) => item.id === this.config.location)
      const shouldResetFolder = !this.config.folder || this.config.folder === oldLocation?.defaultFolder
      this.config.location = location.id
      if (shouldResetFolder) this.config.folder = location.defaultFolder
      this.clearResolvedPath()
    },
    clearResolvedPath() { this.config.resolvedPath = '' },
    copyPath() {
      uni.setClipboardData({ data: this.displayPath, success: () => uni.showToast({ title: '路径已复制', icon: 'success' }) })
    },
    async saveConfig() {
      if (!String(this.config.folder || '').trim()) return uni.showToast({ title: '目录名称不能为空', icon: 'none' })
      uni.showLoading({ title: '正在创建目录', mask: true })
      try {
        const prepared = await prepareFuneralStorageDirectory(this.config)
        this.config.resolvedPath = prepared.absolutePath
        this.config = saveFuneralStorageConfig(this.config)
        uni.hideLoading()
        uni.showModal({
          title: '存储设置已保存',
          content: `证明图片将保存到：\n${this.displayPath}`,
          showCancel: false
        })
      } catch (error) {
        uni.hideLoading()
        uni.showModal({ title: '目录创建失败', content: error?.message || '请检查存储权限后重试', showCancel: false })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.page-container { min-height: 100vh; background: var(--bg-page); padding-bottom: 144rpx; }
.path-panel { margin: 18rpx 24rpx 24rpx; padding: 24rpx; background: #34404b; border-radius: 8rpx; color: #fff; }
.path-head { display: flex; align-items: center; gap: 10rpx; color: #dce1e5; font-size: var(--font-xs, 20rpx); .iconfont { font-size: 30rpx; } }
.current-path { display: block; color: #fff; font-size: var(--font-sm, 24rpx); line-height: 1.5; margin: 14rpx 0; word-break: break-all; }
.copy-path { display: inline-flex; align-items: center; gap: 6rpx; color: #f0c36a; font-size: var(--font-xs, 20rpx); .iconfont { font-size: 24rpx; } }
.section-title { color: var(--text-secondary); font-size: var(--font-xs, 20rpx); font-weight: 600; padding: 0 30rpx 10rpx; }
.location-list, .setting-panel { margin: 0 24rpx 24rpx; background: var(--bg-card); border-radius: 8rpx; box-shadow: var(--shadow); padding: 0 22rpx; }
.location-option { display: flex; align-items: center; gap: 18rpx; padding: 22rpx 0; border-bottom: 1rpx solid var(--divider-color); &:last-child { border-bottom: 0; } }
.radio { flex: 0 0 40rpx; width: 40rpx; height: 40rpx; border-radius: 50%; border: 2rpx solid #98a4ae; display: flex; align-items: center; justify-content: center; .selected & { background: #52606d; border-color: #52606d; color: #fff; } .iconfont { font-size: 22rpx; } }
.location-copy { flex: 1; min-width: 0; }
.location-name { display: block; color: var(--text-primary); font-size: var(--font-sm, 24rpx); font-weight: 600; }
.location-description { display: block; color: var(--text-secondary); font-size: var(--font-xs, 20rpx); margin-top: 3rpx; }
.location-root { display: block; color: #52606d; font-size: 18rpx; margin-top: 3rpx; }
.setting-panel { padding: 22rpx; }
.folder-input { height: 80rpx; padding: 0 18rpx; color: var(--text-primary); background: var(--bg-page); border: 1rpx solid var(--border-color); border-radius: 8rpx; font-size: var(--font-sm, 24rpx); }
.setting-note { display: block; color: var(--text-secondary); font-size: var(--font-xs, 20rpx); line-height: 1.5; margin-top: 14rpx; }
.quality-options { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10rpx; }
.quality-item { min-width: 0; height: 108rpx; border: 1rpx solid var(--border-color); border-radius: 8rpx; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--text-secondary); &.selected { border: 2rpx solid #52606d; color: #34404b; background: #eef2f5; } }
.quality-value { display: block; font-size: var(--font-sm, 24rpx); font-weight: 700; }
.quality-label { display: block; font-size: 18rpx; margin-top: 4rpx; white-space: nowrap; }
.storage-info { margin: 0 24rpx; padding: 22rpx; background: #eef2f5; border-left: 6rpx solid #81909c; border-radius: 8rpx; }
.info-title { display: block; color: #34404b; font-size: var(--font-sm, 24rpx); font-weight: 600; margin-bottom: 10rpx; }
.info-row { display: block; color: #687683; font-size: var(--font-xs, 20rpx); line-height: 1.65; }
.save-bar { position: fixed; left: 0; right: 0; bottom: 0; padding: 14rpx 24rpx; padding-bottom: calc(14rpx + env(safe-area-inset-bottom)); background: var(--bg-card); box-shadow: 0 -2rpx 12rpx rgba(0,0,0,.08); }
.save-button { height: 88rpx; border-radius: 8rpx; background: #52606d; color: #fff; display: flex; align-items: center; justify-content: center; gap: 10rpx; font-size: var(--font-md, 28rpx); font-weight: 600; .iconfont { font-size: 30rpx; } }
</style>
