<template>
  <view :class="['page-container', settingsStore.pageClass()]">
    <NavBar title="设备列表" :show-back="true" />

    <view class="summary-bar">
      <text class="summary-text">在线：<text class="text-success">{{ onlineCount }}</text></text>
      <text class="summary-text">离线：<text class="text-info">{{ offlineCount }}</text></text>
      <view class="refresh-btn" @tap="loadData">
        <text class="iconfont icon-refresh"></text>
        <text>刷新</text>
      </view>
    </view>

    <view v-if="loading" class="loading-wrap">
      <text class="iconfont icon-loading"></text><text>加载中...</text>
    </view>
    <view v-else-if="devices.length === 0" class="empty-wrap">
      <text class="iconfont icon-device empty-icon"></text>
      <text class="empty-text">暂无注册设备</text>
    </view>
    <view v-else>
      <view
        v-for="dev in devices"
        :key="dev.id"
        class="card device-card"
      >
        <view class="dev-header">
          <view class="dev-title">
            <text class="iconfont icon-device dev-icon"
              :class="dev.status === 'online' ? 'text-success' : 'text-info'"></text>
            <text class="dev-name">{{ dev.deviceName || dev.name }}</text>
          </view>
          <view class="dev-status" :class="dev.status === 'online' ? 'online' : 'offline'">
            <text>{{ dev.status === 'online' ? '在线' : '离线' }}</text>
          </view>
        </view>
        <view class="dev-info">
          <view class="info-row">
            <text class="info-label">设备编号</text>
            <text class="info-value">{{ dev.deviceCode || dev.id }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">设备类型</text>
            <text class="info-value">{{ dev.deviceType || '—' }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">绑定老人</text>
            <text class="info-value">{{ dev.elderlyName || '未绑定' }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">最后通信</text>
            <text class="info-value">{{ dev.lastOnlineTime || '—' }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { useDeviceStore }   from '../../store/device'
import { useSettingsStore } from '../../store/settings'
import NavBar from '../../components/NavBar.vue'

export default {
  name: 'DeviceListPage',
  components: { NavBar },
  setup() {
    return {
      deviceStore:   useDeviceStore(),
      settingsStore: useSettingsStore()
    }
  },
  data() { return { loading: false } },
  computed: {
    devices()      { return this.deviceStore.devices },
    onlineCount()  { return this.devices.filter(d => d.status === 'online').length },
    offlineCount() { return this.devices.filter(d => d.status !== 'online').length }
  },
  onLoad() { this.loadData() },
  methods: {
    async loadData() {
      this.loading = true
      try { await this.deviceStore.fetchDevices() }
      finally { this.loading = false }
    }
  }
}
</script>

<style scoped lang="scss">
.page-container { min-height: 100vh; background: var(--bg-page); padding-bottom: 40rpx; }

.summary-bar {
  display: flex; align-items: center; gap: 24rpx; padding: 16rpx 32rpx;
  .summary-text { font-size: var(--font-sm, 24rpx); color: var(--text-regular); }
  .refresh-btn {
    margin-left: auto; display: flex; align-items: center; gap: 6rpx;
    color: var(--primary-color); font-size: var(--font-xs, 20rpx);
    .iconfont { font-size: 26rpx; }
  }
}

.loading-wrap, .empty-wrap {
  display: flex; flex-direction: column; align-items: center;
  padding: 100rpx 0; gap: 20rpx; color: var(--text-secondary);
  .iconfont, .empty-icon { font-size: 80rpx; }
  .empty-text { font-size: var(--font-sm, 24rpx); }
}

.card { background: var(--bg-card); border-radius: 16rpx; box-shadow: var(--shadow); margin: 0 24rpx 20rpx; padding: 24rpx; }

.dev-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20rpx; }
.dev-title  { display: flex; align-items: center; gap: 12rpx; }
.dev-icon   { font-size: 40rpx; }
.dev-name   { font-size: var(--font-md, 28rpx); font-weight: 600; color: var(--text-primary); }

.dev-status {
  padding: 6rpx 20rpx; border-radius: 20rpx; font-size: var(--font-xs, 20rpx);
  &.online  { background: #e8f8f0; color: #27ae60; }
  &.offline { background: var(--divider-color); color: var(--text-secondary); }
}

.dev-info { border-top: 1rpx solid var(--divider-color); padding-top: 16rpx; }
.info-row {
  display: flex; justify-content: space-between; padding: 8rpx 0;
  .info-label { font-size: var(--font-xs, 20rpx); color: var(--text-secondary); }
  .info-value { font-size: var(--font-xs, 20rpx); color: var(--text-regular); }
}
</style>
