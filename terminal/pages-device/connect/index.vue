<template>
  <view :class="['page-container', settingsStore.pageClass()]">
    <NavBar title="设备连接" :show-back="false" />

    <!-- 连接方式 Tab -->
    <view class="tab-switch">
      <view class="tab-item" :class="{ active: tab === 'bt' }" @tap="tab = 'bt'">
        <text class="iconfont icon-bluetooth"></text>
        <text>蓝牙连接</text>
      </view>
      <view class="tab-item" :class="{ active: tab === 'wifi' }" @tap="tab = 'wifi'">
        <text class="iconfont icon-wifi"></text>
        <text>WiFi 连接</text>
      </view>
    </view>

    <!-- ===== 蓝牙面板 ===== -->
    <view v-if="tab === 'bt'">
      <!-- 当前连接状态 -->
      <view class="card status-card">
        <view class="status-header">
          <text class="iconfont icon-bluetooth status-icon"
            :class="deviceStore.btConnectedDevice ? 'text-success' : 'text-info'"></text>
          <view>
            <text class="status-title">{{ deviceStore.btConnectedDevice ? '蓝牙已连接' : '蓝牙未连接' }}</text>
            <text class="status-sub">{{ deviceStore.btConnectedDevice ? deviceStore.btConnectedDevice.name : '点击下方扫描设备' }}</text>
          </view>
        </view>
        <view v-if="deviceStore.btConnectedDevice" class="disconnect-btn" @tap="handleDisconnect">
          <text class="iconfont icon-unlink"></text>
          <text>断开连接</text>
        </view>
      </view>

      <!-- 扫描控制 -->
      <view class="action-card">
        <view class="scan-btn"
          :class="deviceStore.btScanning ? 'btn-stop' : 'btn-scan'"
          @tap="toggleScan"
        >
          <text class="iconfont" :class="deviceStore.btScanning ? 'icon-close' : 'icon-scan'"></text>
          <text>{{ deviceStore.btScanning ? '停止扫描' : '扫描设备' }}</text>
        </view>
        <text v-if="deviceStore.btScanning" class="scanning-hint">正在扫描周边蓝牙设备...</text>
      </view>

      <!-- 发现的设备列表 -->
      <view v-if="deviceStore.btFoundDevices.length > 0" class="section-title-row">
        <text>发现设备 ({{ deviceStore.btFoundDevices.length }})</text>
      </view>
      <view
        v-for="dev in deviceStore.btFoundDevices"
        :key="dev.deviceId"
        class="card device-item"
        @tap="connectBluetooth(dev)"
      >
        <text class="iconfont icon-bluetooth device-icon"
          :class="dev.connected ? 'text-success' : 'text-info'"></text>
        <view class="device-info">
          <text class="device-name">{{ dev.name }}</text>
          <text class="device-id">{{ dev.deviceId }}</text>
        </view>
        <view class="device-rssi">
          <text class="iconfont icon-signal rssi-icon"></text>
          <text class="rssi-val">{{ dev.RSSI }} dBm</text>
        </view>
        <view v-if="dev.connected" class="connected-tag">已连接</view>
        <view v-else class="connect-tag" @tap.stop="connectBluetooth(dev)">连接</view>
      </view>
    </view>

    <!-- ===== WiFi 面板 ===== -->
    <view v-if="tab === 'wifi'">
      <!-- 当前 WiFi -->
      <view class="card status-card">
        <view class="status-header">
          <text class="iconfont icon-wifi status-icon"
            :class="deviceStore.wifiConnected ? 'text-success' : 'text-info'"></text>
          <view>
            <text class="status-title">{{ deviceStore.wifiConnected ? '已连接 WiFi' : '未连接 WiFi' }}</text>
            <text class="status-sub">{{ deviceStore.wifiInfo?.SSID || '点击下方扫描 WiFi' }}</text>
          </view>
        </view>
      </view>

      <!-- WiFi 扫描 -->
      <view class="action-card">
        <view class="scan-btn btn-scan" @tap="scanWifi">
          <text class="iconfont icon-search"></text>
          <text>{{ wifiScanning ? '扫描中...' : '扫描 WiFi' }}</text>
        </view>
      </view>

      <!-- WiFi 列表 -->
      <view v-if="wifiList.length > 0" class="section-title-row">
        <text>可用 WiFi ({{ wifiList.length }})</text>
      </view>
      <view
        v-for="wifi in wifiList"
        :key="wifi.BSSID"
        class="card device-item"
        @tap="showWifiPwd(wifi)"
      >
        <text class="iconfont icon-wifi device-icon text-info"></text>
        <view class="device-info">
          <text class="device-name">{{ wifi.SSID }}</text>
          <text class="device-id">{{ wifi.secure ? '已加密' : '开放' }}</text>
        </view>
        <view class="device-rssi">
          <text class="rssi-val">{{ wifi.signalStrength }}%</text>
        </view>
      </view>

      <!-- WiFi 密码输入 -->
      <view v-if="wifiTarget" class="modal-mask" @tap.self="wifiTarget = null">
        <view class="modal-card">
          <text class="modal-title-text">连接 {{ wifiTarget.SSID }}</text>
          <view class="form-item">
            <text class="iconfont icon-lock form-icon"></text>
            <input v-model="wifiPassword" :password="true" placeholder="请输入 WiFi 密码" class="form-input" />
          </view>
          <view class="modal-btns">
            <view class="modal-btn cancel" @tap="wifiTarget = null">取消</view>
            <view class="modal-btn confirm" @tap="connectWifi">连接</view>
          </view>
        </view>
      </view>
    </view>

    <BottomTabBar current="/pages-device/connect/index" />
  </view>
</template>

<script>
import { useDeviceStore }   from '../../store/device'
import { useSettingsStore } from '../../store/settings'
import {
  initBluetooth, startScan, stopScan,
  connectDevice, disconnectDevice
} from '../../utils/bluetooth'
import {
  initWifi, scanWifiList, connectWifi as utilConnectWifi, getConnectedWifi
} from '../../utils/wifi'
import NavBar       from '../../components/NavBar.vue'
import BottomTabBar from '../../components/BottomTabBar.vue'

export default {
  name: 'DeviceConnectPage',
  components: { NavBar, BottomTabBar },
  setup() {
    return {
      deviceStore:   useDeviceStore(),
      settingsStore: useSettingsStore()
    }
  },
  data() {
    return {
      tab:          'bt',
      wifiList:     [],
      wifiScanning: false,
      wifiTarget:   null,
      wifiPassword: ''
    }
  },
  onLoad() {
    this.initBt()
    getConnectedWifi().catch(() => {})
  },
  onUnload() {
    if (this.deviceStore.btScanning) stopScan()
  },
  methods: {
    async initBt() {
      try {
        await initBluetooth()
      } catch (e) {
        uni.showToast({ title: e.message, icon: 'none' })
      }
    },

    async toggleScan() {
      if (this.deviceStore.btScanning) {
        stopScan()
      } else {
        try {
          await initBluetooth()
          await startScan()
        } catch (e) {
          uni.showToast({ title: e.message, icon: 'none' })
        }
      }
    },

    async connectBluetooth(dev) {
      if (dev.connected) return
      uni.showLoading({ title: '连接中...' })
      try {
        await connectDevice(dev.deviceId)
        dev.connected = true
        uni.showToast({ title: '连接成功', icon: 'success' })
        stopScan()
      } catch (e) {
        uni.showToast({ title: e.message, icon: 'none' })
      } finally {
        uni.hideLoading()
      }
    },

    async handleDisconnect() {
      const { deviceId } = this.deviceStore.btConnectedDevice
      uni.showLoading({ title: '断开中...' })
      try {
        await disconnectDevice(deviceId)
        uni.showToast({ title: '已断开连接', icon: 'success' })
      } catch (e) {
        uni.showToast({ title: e.message, icon: 'none' })
      } finally {
        uni.hideLoading()
      }
    },

    async scanWifi() {
      this.wifiScanning = true
      try {
        await initWifi()
        const list = await scanWifiList()
        this.wifiList = list
      } catch (e) {
        uni.showToast({ title: e.message, icon: 'none' })
      } finally {
        this.wifiScanning = false
      }
    },

    showWifiPwd(wifi) {
      this.wifiTarget = wifi
      this.wifiPassword = ''
    },

    async connectWifi() {
      if (!this.wifiPassword && this.wifiTarget?.secure) {
        return uni.showToast({ title: '请输入 WiFi 密码', icon: 'none' })
      }
      uni.showLoading({ title: '连接中...' })
      try {
        await utilConnectWifi(this.wifiTarget.SSID, this.wifiPassword, this.wifiTarget.BSSID)
        this.wifiTarget = null
        getConnectedWifi().catch(() => {})
      } catch (e) {
        uni.showToast({ title: e.message, icon: 'none' })
      } finally {
        uni.hideLoading()
      }
    }
  }
}
</script>

<style scoped lang="scss">
.page-container { min-height: 100vh; background: var(--bg-page); padding-bottom: 130rpx; }

.tab-switch {
  display: flex; margin: 20rpx 24rpx;
  background: var(--bg-card); border-radius: 16rpx; overflow: hidden;
  .tab-item {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 10rpx;
    padding: 24rpx 0; font-size: var(--font-sm, 24rpx); color: var(--text-secondary);
    .iconfont { font-size: 30rpx; }
    &.active {
      background: var(--primary-color); color: #fff;
    }
  }
}

.card {
  background: var(--bg-card); border-radius: 16rpx;
  box-shadow: var(--shadow); margin: 0 24rpx 20rpx; padding: 24rpx;
}

.status-card {
  .status-header { display: flex; align-items: center; gap: 20rpx; margin-bottom: 16rpx; }
  .status-icon   { font-size: 60rpx; }
  .status-title  { font-size: var(--font-md, 28rpx); font-weight: 600; color: var(--text-primary); display: block; }
  .status-sub    { font-size: var(--font-xs, 20rpx); color: var(--text-secondary); }
  .disconnect-btn {
    display: flex; align-items: center; justify-content: center; gap: 8rpx;
    background: #fef0f0; color: #f56c6c; border-radius: 12rpx; padding: 16rpx 0;
    font-size: var(--font-sm, 24rpx);
    .iconfont { font-size: 28rpx; }
  }
}

.action-card {
  background: var(--bg-card); border-radius: 16rpx;
  box-shadow: var(--shadow); margin: 0 24rpx 20rpx; padding: 24rpx;
  .scan-btn {
    display: flex; align-items: center; justify-content: center; gap: 10rpx;
    border-radius: 12rpx; padding: 24rpx 0; font-size: var(--font-md, 28rpx); font-weight: 600;
    .iconfont { font-size: 36rpx; }
    &.btn-scan { background: var(--primary-color); color: #fff; }
    &.btn-stop { background: #fef0f0; color: #f56c6c; }
  }
  .scanning-hint {
    display: block; text-align: center; margin-top: 16rpx;
    font-size: var(--font-xs, 20rpx); color: var(--text-secondary);
  }
}

.section-title-row {
  padding: 0 32rpx 12rpx;
  font-size: var(--font-sm, 24rpx); font-weight: 600; color: var(--text-regular);
}

.device-item {
  display: flex; align-items: center; gap: 16rpx;
  .device-icon { font-size: 44rpx; }
  .device-info { flex: 1; }
  .device-name { font-size: var(--font-sm, 24rpx); font-weight: 600; color: var(--text-primary); display: block; }
  .device-id   { font-size: var(--font-xs, 20rpx); color: var(--text-secondary); }
  .device-rssi { display: flex; align-items: center; gap: 4rpx; }
  .rssi-icon   { font-size: 24rpx; color: var(--text-secondary); }
  .rssi-val    { font-size: var(--font-xs, 20rpx); color: var(--text-secondary); }
  .connected-tag {
    padding: 6rpx 20rpx; background: #e8f8f0; color: #27ae60; border-radius: 20rpx; font-size: var(--font-xs, 20rpx);
  }
  .connect-tag {
    padding: 6rpx 20rpx; background: var(--primary-light); color: var(--primary-color); border-radius: 20rpx; font-size: var(--font-xs, 20rpx);
  }
}

/* WiFi 密码弹窗 */
.modal-mask {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 2000;
  display: flex; align-items: flex-end;
}
.modal-card {
  width: 100%; background: var(--bg-card); border-radius: 32rpx 32rpx 0 0;
  padding: 40rpx 32rpx; padding-bottom: calc(40rpx + env(safe-area-inset-bottom));
}
.modal-title-text {
  font-size: var(--font-lg, 32rpx); font-weight: 600; color: var(--text-primary);
  display: block; margin-bottom: 32rpx;
}
.form-item {
  display: flex; align-items: center; margin-bottom: 24rpx;
  border-bottom: 1rpx solid var(--divider-color);
  .form-icon { font-size: 36rpx; color: var(--primary-color); margin-right: 16rpx; }
  .form-input { flex: 1; height: 80rpx; font-size: var(--font-md, 28rpx); color: var(--text-primary); }
}
.modal-btns { display: flex; gap: 24rpx; margin-top: 8rpx; }
.modal-btn {
  flex: 1; height: 88rpx; border-radius: 44rpx; display: flex;
  align-items: center; justify-content: center; font-size: var(--font-md, 28rpx); font-weight: 600;
  &.cancel  { background: var(--bg-page); color: var(--text-regular); border: 1rpx solid var(--border-color); }
  &.confirm { background: var(--primary-color); color: #fff; }
}
</style>
