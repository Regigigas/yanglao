<template>
  <view :class="['page-container', settingsStore.pageClass()]">
    <NavBar title="健康告警" :show-back="true" />

    <!-- 筛选栏 -->
    <view class="filter-bar">
      <view
        v-for="f in filters"
        :key="f.val"
        class="filter-chip"
        :class="{ active: activeFilter === f.val }"
        @tap="activeFilter = f.val"
      >
        <text>{{ f.label }}</text>
      </view>
      <view class="read-all-btn" @tap="readAll">
        <text class="iconfont icon-check"></text>
        <text>全部已读</text>
      </view>
    </view>

    <view v-if="loading" class="loading-wrap">
      <text class="iconfont icon-loading"></text><text>加载中...</text>
    </view>

    <view v-else-if="filteredAlerts.length === 0" class="empty-wrap">
      <text class="iconfont icon-success empty-icon text-success"></text>
      <text class="empty-text">暂无告警信息</text>
    </view>

    <view v-else>
      <view
        v-for="alert in filteredAlerts"
        :key="alert.alertId"
        class="card alert-card"
        :class="{ unread: !alert.isRead }"
      >
        <view class="alert-level" :class="getLevelClass(alert.level)">
          <text class="iconfont icon-warning"></text>
          <text>{{ getLevelText(alert.level) }}</text>
        </view>
        <view class="alert-body">
          <view class="alert-top">
            <text class="alert-elder">{{ alert.elderlyName }}</text>
            <text class="alert-type">{{ alert.alertType }}</text>
          </view>
          <text class="alert-msg">{{ alert.message }}</text>
          <view class="alert-footer">
            <text class="alert-time">{{ alert.createTime }}</text>
            <view v-if="!alert.isRead" class="read-btn" @tap.stop="readAlert(alert)">
              <text>标为已读</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <BottomTabBar current="/pages-health/monitor/index" />
  </view>
</template>

<script>
import { useHealthStore }   from '../../store/health'
import { useSettingsStore } from '../../store/settings'
import { readAlert as apiRead, readAllAlerts } from '../../api/health'
import NavBar       from '../../components/NavBar.vue'
import BottomTabBar from '../../components/BottomTabBar.vue'

export default {
  name: 'HealthAlertsPage',
  components: { NavBar, BottomTabBar },
  setup() {
    return {
      healthStore:   useHealthStore(),
      settingsStore: useSettingsStore()
    }
  },
  data() {
    return {
      loading:      false,
      activeFilter: 'all',
      filters: [
        { val: 'all',      label: '全部' },
        { val: 'critical', label: '危急' },
        { val: 'warning',  label: '警告' },
        { val: 'unread',   label: '未读' }
      ]
    }
  },
  computed: {
    filteredAlerts() {
      let list = this.healthStore.healthAlerts
      if (this.activeFilter === 'critical') list = list.filter(a => a.level === 'critical')
      else if (this.activeFilter === 'warning') list = list.filter(a => a.level === 'warning')
      else if (this.activeFilter === 'unread')  list = list.filter(a => !a.isRead)
      return list
    }
  },
  onLoad() { this.loadData() },
  methods: {
    async loadData() {
      this.loading = true
      try { await this.healthStore.fetchAlerts() }
      finally { this.loading = false }
    },
    getLevelClass(lv) {
      if (lv === 'critical') return 'level-critical'
      if (lv === 'warning')  return 'level-warning'
      return 'level-info'
    },
    getLevelText(lv) {
      return { critical: '危急', warning: '警告', info: '提示' }[lv] || '告警'
    },
    async readAlert(alert) {
      await apiRead(alert.alertId).catch(() => {})
      alert.isRead = true
    },
    async readAll() {
      await readAllAlerts().catch(() => {})
      this.healthStore.healthAlerts.forEach(a => { a.isRead = true })
      uni.showToast({ title: '已全部标记已读', icon: 'success' })
    }
  }
}
</script>

<style scoped lang="scss">
.page-container { min-height: 100vh; background: var(--bg-page); padding-bottom: 130rpx; }

.filter-bar {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 16rpx 24rpx;
  flex-wrap: wrap;
}
.filter-chip {
  padding: 8rpx 24rpx;
  border-radius: 32rpx;
  background: var(--bg-card);
  color: var(--text-secondary);
  font-size: var(--font-xs, 20rpx);
  border: 1rpx solid var(--border-color);
  &.active { background: var(--primary-color); color: #fff; border-color: var(--primary-color); }
}
.read-all-btn {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 6rpx;
  color: var(--primary-color);
  font-size: var(--font-xs, 20rpx);
}

.loading-wrap, .empty-wrap {
  display: flex; flex-direction: column; align-items: center; padding: 100rpx 0;
  gap: 20rpx; color: var(--text-secondary);
  .iconfont { font-size: 80rpx; }
  .empty-text { font-size: var(--font-sm, 24rpx); }
}

.card {
  background: var(--bg-card); border-radius: 16rpx;
  box-shadow: var(--shadow); margin: 0 24rpx 20rpx;
  padding: 24rpx; display: flex; gap: 16rpx;
  &.unread { border-left: 6rpx solid #f56c6c; }
}

.alert-level {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-width: 64rpx;
  gap: 6rpx; font-size: var(--font-xs, 20rpx); border-radius: 12rpx; padding: 12rpx 10rpx;
  .iconfont { font-size: 36rpx; }
  &.level-critical { background: #fef0f0; color: #f56c6c; }
  &.level-warning  { background: #fef6ed; color: #e67e22; }
  &.level-info     { background: var(--primary-light); color: var(--primary-color); }
}

.alert-body { flex: 1; }
.alert-top {
  display: flex; justify-content: space-between; margin-bottom: 8rpx;
  .alert-elder { font-size: var(--font-md, 28rpx); font-weight: 600; color: var(--text-primary); }
  .alert-type  { font-size: var(--font-xs, 20rpx); color: var(--text-secondary); }
}
.alert-msg { font-size: var(--font-sm, 24rpx); color: var(--text-regular); margin-bottom: 12rpx; }
.alert-footer {
  display: flex; justify-content: space-between; align-items: center;
  .alert-time { font-size: var(--font-xs, 20rpx); color: var(--text-secondary); }
  .read-btn {
    padding: 6rpx 20rpx; background: var(--primary-light);
    color: var(--primary-color); border-radius: 24rpx; font-size: var(--font-xs, 20rpx);
  }
}
</style>
