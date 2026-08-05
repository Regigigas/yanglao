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
        <!-- 操作按钮 -->
        <view class="dev-actions">
          <view v-if="!dev.elderlyId" class="dev-btn btn-bind" @tap="showBind(dev)">
            <text class="iconfont icon-link"></text>
            <text>绑定老人</text>
          </view>
          <view v-else class="dev-btn btn-unbind" @tap="confirmUnbind(dev)">
            <text class="iconfont icon-unlink"></text>
            <text>解除绑定</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 绑定老人弹窗 -->
    <view v-if="showBindModal" class="modal-mask" @tap.self="showBindModal=false">
      <view class="modal-card">
        <text class="modal-title">选择绑定老人</text>
        <view v-for="elder in elderlyList" :key="elder.value"
          class="elder-option" :class="{ selected: selectedElderlyId === elder.value }"
          @tap="selectedElderlyId = elder.value">
          <text class="iconfont icon-elder"></text>
          <text class="elder-name">{{ elder.label }}</text>
          <text v-if="selectedElderlyId === elder.value" class="iconfont icon-check check-icon"></text>
        </view>
        <view class="modal-btns">
          <view class="modal-btn cancel" @tap="showBindModal=false">取消</view>
          <view class="modal-btn confirm" @tap="confirmBind">确认绑定</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { useDeviceStore }   from '../../store/device'
import { useSettingsStore } from '../../store/settings'
import { bindDeviceToElderly, unbindDevice } from '../../api/device'
import { getElderlyList } from '../../api/health'
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
  data() { return { loading: false, elderlyList: [], bindTarget: null, showBindModal: false, selectedElderlyId: '' } },
  computed: {
    devices()      { return this.deviceStore.devices },
    onlineCount()  { return this.devices.filter(d => d.status === 'online').length },
    offlineCount() { return this.devices.filter(d => d.status !== 'online').length }
  },
  onLoad() { this.loadData(); this.loadElderly() },
  methods: {
    async loadData() {
      this.loading = true
      try { await this.deviceStore.fetchDevices() }
      finally { this.loading = false }
    },
    async loadElderly() {
      const res = await getElderlyList({ pageSize: 200 }).catch(() => ({}))
      this.elderlyList = (res.rows || res.data || []).map(e => ({
        label: e.elderlyName || e.name,
        value: e.elderlyId || e.id
      }))
    },
    showBind(dev) {
      this.bindTarget = dev
      this.selectedElderlyId = ''
      this.showBindModal = true
    },
    async confirmBind() {
      if (!this.selectedElderlyId) return uni.showToast({ title: '请选择老人', icon: 'none' })
      await bindDeviceToElderly(this.bindTarget.id || this.bindTarget.deviceId, this.selectedElderlyId).catch(() => {})
      this.showBindModal = false
      uni.showToast({ title: '绑定成功', icon: 'success' })
      this.loadData()
    },
    confirmUnbind(dev) {
      uni.showModal({
        title: '解除绑定', content: `确认解除 ${dev.elderlyName} 与该设备的绑定？`,
        success: async ({ confirm }) => {
          if (!confirm) return
          await unbindDevice(dev.id || dev.deviceId).catch(() => {})
          uni.showToast({ title: '已解除绑定', icon: 'success' })
          this.loadData()
        }
      })
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

.dev-actions {
  display: flex; gap: 16rpx; margin-top: 16rpx; padding-top: 16rpx;
  border-top: 1rpx solid var(--divider-color);
}
.dev-btn {
  flex: 1; height: 68rpx; border-radius: 34rpx;
  display: flex; align-items: center; justify-content: center; gap: 8rpx;
  font-size: var(--font-xs, 20rpx); font-weight: 600;
  .iconfont { font-size: 26rpx; }
  &.btn-bind   { background: var(--primary-light); color: var(--primary-color); }
  &.btn-unbind { background: #fef0f0; color: #f56c6c; }
}

/* 绑定弹窗 */
.modal-mask {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 2000;
  display: flex; align-items: flex-end;
}
.modal-card {
  width: 100%; background: var(--bg-card); border-radius: 32rpx 32rpx 0 0;
  padding: 32rpx; max-height: 70vh; overflow-y: auto;
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
}
.modal-title { font-size: var(--font-lg, 32rpx); font-weight: 600; color: var(--text-primary); display: block; margin-bottom: 24rpx; }
.elder-option {
  display: flex; align-items: center; gap: 16rpx; padding: 20rpx 0;
  border-bottom: 1rpx solid var(--divider-color);
  .iconfont { font-size: 36rpx; color: var(--primary-color); }
  .elder-name { flex: 1; font-size: var(--font-sm, 24rpx); color: var(--text-primary); }
  .check-icon { color: var(--primary-color); }
  &.selected { background: var(--primary-light); padding-left: 16rpx; border-radius: 12rpx; }
}
.modal-btns { display: flex; gap: 24rpx; margin-top: 24rpx; }
.modal-btn {
  flex: 1; height: 88rpx; border-radius: 44rpx;
  display: flex; align-items: center; justify-content: center;
  font-size: var(--font-md, 28rpx); font-weight: 600;
  &.cancel  { background: var(--bg-page); color: var(--text-regular); border: 1rpx solid var(--border-color); }
  &.confirm { background: var(--primary-color); color: #fff; }
}
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
