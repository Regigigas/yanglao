<template>
  <view :class="['page-container', settingsStore.pageClass()]">
    <!-- 自定义顶部导航 -->
    <NavBar title="养老护理终端">
      <template #right>
        <view class="nav-btn" @tap="refreshData">
          <text class="iconfont icon-refresh nav-right-icon"></text>
        </view>
      </template>
    </NavBar>

    <!-- 用户信息卡片 -->
    <view class="card user-card">
      <view class="user-info">
        <view class="avatar">
          <text class="iconfont icon-user-circle avatar-icon"></text>
        </view>
        <view class="user-text">
          <text class="user-name">{{ userStore.userInfo?.nickName || userStore.userInfo?.userName || '护理人员' }}</text>
          <text class="user-role">{{ currentTime }}</text>
        </view>
      </view>
      <!-- 连接状态 -->
      <view class="conn-status">
        <view class="conn-item" :class="{ connected: deviceStore.btConnectedDevice }">
          <text class="iconfont" :class="deviceStore.btConnectedDevice ? 'icon-bluetooth-on' : 'icon-bluetooth'"></text>
          <text class="conn-text">{{ deviceStore.btConnectedDevice ? '蓝牙已连' : '蓝牙未连' }}</text>
        </view>
        <view class="conn-item" :class="{ connected: deviceStore.wifiConnected }">
          <text class="iconfont" :class="deviceStore.wifiConnected ? 'icon-wifi-on' : 'icon-wifi'"></text>
          <text class="conn-text">{{ deviceStore.wifiConnected ? deviceStore.wifiInfo?.SSID || 'WiFi已连' : 'WiFi未连' }}</text>
        </view>
      </view>
    </view>

    <!-- 数据概览 -->
    <view class="stat-grid">
      <view class="stat-item card" @tap="goTo('/pages-health/monitor/index')">
        <text class="iconfont icon-heart stat-icon text-danger"></text>
        <text class="stat-num">{{ healthStore.healthList.length }}</text>
        <text class="stat-label">监测老人</text>
      </view>
      <view class="stat-item card" @tap="goTo('/pages-health/alerts/index')">
        <text class="iconfont icon-warning stat-icon text-warning"></text>
        <text class="stat-num">{{ healthStore.unreadAlerts }}</text>
        <text class="stat-label">健康告警</text>
        <view v-if="healthStore.criticalCount > 0" class="badge stat-badge">!</view>
      </view>
      <view class="stat-item card" @tap="goTo('/pages-care/tasks/index')">
        <text class="iconfont icon-task stat-icon" style="color: var(--primary-color)"></text>
        <text class="stat-num">{{ todayTaskCount }}</text>
        <text class="stat-label">今日任务</text>
      </view>
      <view class="stat-item card" @tap="goTo('/pages-device/connect/index')">
        <text class="iconfont icon-device stat-icon text-success"></text>
        <text class="stat-num">{{ deviceStore.onlineDevices }}</text>
        <text class="stat-label">在线设备</text>
      </view>
    </view>

    <!-- 快捷功能入口 -->
    <view class="section-title">
      <text class="iconfont icon-menu"></text>
      <text class="section-text">快捷入口</text>
    </view>

    <view class="quick-grid">
      <view
        v-for="item in quickItems"
        :key="item.path"
        class="quick-item card"
        @tap="goTo(item.path)"
      >
        <text class="iconfont quick-icon" :class="item.icon" :style="{ color: item.color }"></text>
        <text class="quick-label">{{ item.label }}</text>
      </view>
    </view>

    <!-- 最新告警 -->
    <view v-if="healthStore.healthAlerts.length > 0" class="section-title">
      <text class="iconfont icon-alert"></text>
      <text class="section-text">最新告警</text>
    </view>

    <view v-for="alert in healthStore.healthAlerts.slice(0, 3)" :key="alert.alertId" class="card alert-item">
      <text class="iconfont icon-warning alert-icon text-warning"></text>
      <view class="alert-content">
        <text class="alert-name">{{ alert.elderlyName || '未知' }}</text>
        <text class="alert-msg">{{ alert.message }}</text>
      </view>
      <text class="alert-time">{{ formatTime(alert.createTime) }}</text>
    </view>

    <!-- 底部导航 -->
    <BottomTabBar current="/pages/index/index" />
  </view>
</template>

<script>
import { useUserStore }     from '../../store/user'
import { useDeviceStore }   from '../../store/device'
import { useHealthStore }   from '../../store/health'
import { useSettingsStore } from '../../store/settings'
import NavBar       from '../../components/NavBar.vue'
import BottomTabBar from '../../components/BottomTabBar.vue'

export default {
  name: 'IndexPage',
  components: { NavBar, BottomTabBar },

  data() {
    return {
      currentTime:    '',
      todayTaskCount: 0,
      timer:          null,
      quickItems: [
        { label: '健康监测', icon: 'icon-monitor',  path: '/pages-health/monitor/index',  color: '#e74c3c' },
        { label: '健康告警', icon: 'icon-alert',    path: '/pages-health/alerts/index',   color: '#e67e22' },
        { label: '护理任务', icon: 'icon-task',     path: '/pages-care/tasks/index',      color: '#4A90D9' },
        { label: '护理记录', icon: 'icon-record',   path: '/pages-care/records/index',    color: '#9b59b6' },
        { label: '设备连接', icon: 'icon-bluetooth',path: '/pages-device/connect/index',  color: '#2ecc71' },
        { label: '设备列表', icon: 'icon-device',   path: '/pages-device/list/index',     color: '#1abc9c' },
        { label: '主题换肤', icon: 'icon-theme',    path: '/pages-settings/theme/index',  color: '#f39c12' },
        { label: '系统设置', icon: 'icon-settings', path: '/pages-settings/index/index',  color: '#7f8c8d' }
      ]
    }
  },

  setup() {
    return {
      userStore:     useUserStore(),
      deviceStore:   useDeviceStore(),
      healthStore:   useHealthStore(),
      settingsStore: useSettingsStore()
    }
  },

  onLoad() {
    this.userStore.restoreFromStorage()
    this.updateTime()
    this.timer = setInterval(this.updateTime, 1000)
    this.refreshData()
  },

  onUnload() {
    if (this.timer) clearInterval(this.timer)
  },

  onShow() {
    this.healthStore.fetchAlerts()
  },

  methods: {
    updateTime() {
      const now = new Date()
      this.currentTime = `${now.toLocaleDateString('zh-CN')} ${now.toLocaleTimeString('zh-CN', { hour12: false })}`
    },

    async refreshData() {
      await Promise.all([
        this.healthStore.fetchHealthList({ pageSize: 100 }),
        this.healthStore.fetchAlerts(),
        this.deviceStore.fetchDevices(),
        this.deviceStore.fetchAlerts()
      ]).catch(() => {})
    },

    goTo(path) {
      uni.navigateTo({ url: path })
    },

    formatTime(t) {
      if (!t) return ''
      return String(t).slice(11, 16)
    }
  }
}
</script>

<style scoped lang="scss">
.page-container {
  min-height: 100vh;
  background: var(--bg-page, #F5F7FA);
  padding-bottom: 130rpx;
}

.card {
  background: var(--bg-card, #fff);
  border-radius: 16rpx;
  box-shadow: var(--shadow, 0 2rpx 12rpx rgba(0,0,0,0.08));
  margin: 0 24rpx 20rpx;
  padding: 24rpx;
}

/* 用户卡片 */
.user-card {
  background: var(--bg-nav, #4A90D9) !important;
  color: #fff;
  margin-top: 12rpx;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.avatar-icon { font-size: 50rpx; color: #fff; }

.user-name {
  font-size: var(--font-lg, 32rpx);
  font-weight: 600;
  color: #fff;
  display: block;
}

.user-role {
  font-size: var(--font-xs, 22rpx);
  color: rgba(255,255,255,0.8);
  display: block;
  margin-top: 6rpx;
}

.conn-status {
  display: flex;
  gap: 24rpx;
}

.conn-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 8rpx 20rpx;
  background: rgba(255,255,255,0.15);
  border-radius: 24rpx;
  font-size: var(--font-xs, 20rpx);
  color: rgba(255,255,255,0.7);

  .iconfont { font-size: 28rpx; color: rgba(255,255,255,0.7); }

  &.connected {
    background: rgba(255,255,255,0.3);
    color: #fff;
    .iconfont { color: #fff; }
  }
}

.conn-text { font-size: var(--font-xs, 20rpx); }

/* 统计格 */
.stat-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
  padding: 0 24rpx;
  margin-bottom: 20rpx;
}

.stat-item {
  margin: 0 !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28rpx 0;
  position: relative;

  .stat-icon { font-size: 48rpx; margin-bottom: 8rpx; }
  .stat-num {
    font-size: var(--font-xl, 36rpx);
    font-weight: 700;
    color: var(--text-primary, #303133);
  }
  .stat-label {
    font-size: var(--font-xs, 20rpx);
    color: var(--text-secondary, #909399);
    margin-top: 4rpx;
  }
  .stat-badge {
    position: absolute;
    top: 12rpx;
    right: 12rpx;
  }
}

/* 标题 */
.section-title {
  display: flex;
  align-items: center;
  gap: 10rpx;
  padding: 0 32rpx;
  margin-bottom: 16rpx;

  .iconfont { font-size: 32rpx; color: var(--primary-color, #4A90D9); }
  .section-text {
    font-size: var(--font-md, 28rpx);
    font-weight: 600;
    color: var(--text-primary, #303133);
  }
}

/* 快捷功能 */
.quick-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16rpx;
  padding: 0 24rpx;
  margin-bottom: 20rpx;
}

.quick-item {
  margin: 0 !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24rpx 0;
  .quick-icon { font-size: 44rpx; margin-bottom: 10rpx; }
  .quick-label { font-size: var(--font-xs, 20rpx); color: var(--text-regular, #606266); }
}

/* 告警 */
.alert-item {
  display: flex;
  align-items: center;
  padding: 20rpx 24rpx;

  .alert-icon { font-size: 40rpx; margin-right: 16rpx; }
  .alert-content { flex: 1; }
  .alert-name {
    font-size: var(--font-sm, 24rpx);
    font-weight: 600;
    color: var(--text-primary, #303133);
    display: block;
  }
  .alert-msg {
    font-size: var(--font-xs, 20rpx);
    color: var(--text-secondary, #909399);
  }
  .alert-time {
    font-size: var(--font-xs, 20rpx);
    color: var(--text-secondary, #909399);
  }
}

.nav-btn { padding: 10rpx; }
.nav-right-icon { font-size: 40rpx; color: #fff; }
</style>
