<template>
  <view :class="['page-container', settingsStore.pageClass()]">
    <NavBar title="健康监测" :show-back="false" />

    <!-- 搜索栏 -->
    <view class="search-bar">
      <text class="iconfont icon-search search-icon"></text>
      <input
        v-model="keyword"
        class="search-input"
        placeholder="搜索老人姓名..."
        placeholder-class="placeholder"
        @input="onSearch"
      />
    </view>

    <!-- 刷新提示 -->
    <view class="refresh-bar">
      <text class="refresh-label">最后更新：{{ lastUpdate }}</text>
      <view class="refresh-btn" @tap="loadData">
        <text class="iconfont icon-refresh"></text>
        <text>刷新</text>
      </view>
    </view>

    <!-- 健康数据列表 -->
    <view v-if="loading" class="loading-wrap">
      <text class="iconfont icon-loading loading-icon"></text>
      <text class="loading-text">加载中...</text>
    </view>

    <view v-else-if="filteredList.length === 0" class="empty-wrap">
      <text class="iconfont icon-monitor empty-icon"></text>
      <text class="empty-text">暂无监测数据</text>
    </view>

    <view v-else>
      <view
        v-for="item in filteredList"
        :key="item.elderlyId"
        class="card health-card"
        @tap="viewDetail(item)"
      >
        <!-- 老人基本信息 -->
        <view class="card-header">
          <view class="elder-info">
            <text class="iconfont icon-elder elder-icon"></text>
            <view>
              <text class="elder-name">{{ item.elderlyName }}</text>
              <text class="elder-room">{{ item.roomNo ? item.roomNo + '室' : '' }} {{ item.bedNo ? item.bedNo + '床' : '' }}</text>
            </view>
          </view>
          <view class="status-tag" :class="getStatusClass(item)">
            <text>{{ getStatusText(item) }}</text>
          </view>
        </view>

        <!-- 健康指标 -->
        <view class="health-metrics">
          <view class="metric-item">
            <text class="iconfont icon-heartbeat metric-icon text-danger"></text>
            <text class="metric-val">{{ item.heartRate || '--' }}</text>
            <text class="metric-unit">次/分</text>
            <text class="metric-name">心率</text>
          </view>
          <view class="metric-divider"></view>
          <view class="metric-item">
            <text class="iconfont icon-blood-pressure metric-icon" style="color:#9b59b6"></text>
            <text class="metric-val">{{ item.systolic || '--' }}/{{ item.diastolic || '--' }}</text>
            <text class="metric-unit">mmHg</text>
            <text class="metric-name">血压</text>
          </view>
          <view class="metric-divider"></view>
          <view class="metric-item">
            <text class="iconfont icon-temperature metric-icon text-warning"></text>
            <text class="metric-val">{{ item.temperature || '--' }}</text>
            <text class="metric-unit">℃</text>
            <text class="metric-name">体温</text>
          </view>
          <view class="metric-divider"></view>
          <view class="metric-item">
            <text class="iconfont icon-oxygen metric-icon" style="color:#2ecc71"></text>
            <text class="metric-val">{{ item.bloodOxygen || '--' }}</text>
            <text class="metric-unit">%</text>
            <text class="metric-name">血氧</text>
          </view>
        </view>

        <!-- 更新时间 -->
        <text class="update-time">{{ item.updateTime || item.createTime }}</text>
      </view>
    </view>

    <BottomTabBar current="/pages-health/monitor/index" />
  </view>
</template>

<script>
import { useHealthStore }   from '../../store/health'
import { useSettingsStore } from '../../store/settings'
import NavBar       from '../../components/NavBar.vue'
import BottomTabBar from '../../components/BottomTabBar.vue'

export default {
  name: 'HealthMonitorPage',
  components: { NavBar, BottomTabBar },

  setup() {
    return {
      healthStore:   useHealthStore(),
      settingsStore: useSettingsStore()
    }
  },

  data() {
    return {
      keyword:    '',
      loading:    false,
      lastUpdate: '—'
    }
  },

  computed: {
    filteredList() {
      if (!this.keyword) return this.healthStore.healthList
      return this.healthStore.healthList.filter(it =>
        (it.elderlyName || '').includes(this.keyword)
      )
    }
  },

  onLoad() { this.loadData() },
  onShow()  { this.loadData() },

  methods: {
    async loadData() {
      this.loading = true
      try {
        await this.healthStore.fetchHealthList({ pageSize: 100 })
        const now = new Date()
        this.lastUpdate = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`
      } finally {
        this.loading = false
      }
    },

    onSearch(e) { this.keyword = e.detail.value },

    getStatusClass(item) {
      if (item.isAbnormal || item.alertLevel === 'critical') return 'status-danger'
      if (item.alertLevel === 'warning') return 'status-warning'
      return 'status-normal'
    },

    getStatusText(item) {
      if (item.isAbnormal || item.alertLevel === 'critical') return '异常'
      if (item.alertLevel === 'warning') return '注意'
      return '正常'
    },

    viewDetail(item) {
      uni.navigateTo({ url: `/pages-health/alerts/index?elderlyId=${item.elderlyId}` })
    }
  }
}
</script>

<style scoped lang="scss">
.page-container {
  min-height: 100vh;
  background: var(--bg-page);
  padding-bottom: 130rpx;
}

.search-bar {
  display: flex;
  align-items: center;
  background: var(--bg-card);
  margin: 20rpx 24rpx;
  border-radius: 48rpx;
  padding: 0 24rpx;
  box-shadow: var(--shadow);

  .search-icon { font-size: 32rpx; color: var(--text-secondary); margin-right: 12rpx; }
  .search-input {
    flex: 1;
    height: 72rpx;
    font-size: var(--font-sm, 24rpx);
    color: var(--text-primary);
  }
}

.placeholder { color: var(--text-secondary) !important; }

.refresh-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 32rpx 12rpx;
  .refresh-label { font-size: var(--font-xs, 20rpx); color: var(--text-secondary); }
  .refresh-btn {
    display: flex;
    align-items: center;
    gap: 6rpx;
    color: var(--primary-color);
    font-size: var(--font-xs, 20rpx);
    .iconfont { font-size: 26rpx; }
  }
}

.loading-wrap, .empty-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 0;
  .loading-icon, .empty-icon { font-size: 80rpx; color: var(--text-secondary); margin-bottom: 20rpx; }
  .loading-text, .empty-text { font-size: var(--font-sm, 24rpx); color: var(--text-secondary); }
}

.card {
  background: var(--bg-card);
  border-radius: 16rpx;
  box-shadow: var(--shadow);
  margin: 0 24rpx 20rpx;
  padding: 24rpx;
}

.health-card {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
  }
  .elder-info {
    display: flex;
    align-items: center;
    gap: 12rpx;
    .elder-icon { font-size: 40rpx; color: var(--primary-color); }
    .elder-name { font-size: var(--font-md, 28rpx); font-weight: 600; color: var(--text-primary); display: block; }
    .elder-room { font-size: var(--font-xs, 20rpx); color: var(--text-secondary); }
  }
}

.status-tag {
  padding: 6rpx 20rpx;
  border-radius: 24rpx;
  font-size: var(--font-xs, 20rpx);
  &.status-normal  { background: #e8f8f0; color: #27ae60; }
  &.status-warning { background: #fef6ed; color: #e67e22; }
  &.status-danger  { background: #fef0f0; color: #f56c6c; }
}

.health-metrics {
  display: flex;
  align-items: center;
  padding: 16rpx 0;
  .metric-divider {
    width: 1rpx;
    height: 50rpx;
    background: var(--divider-color);
    margin: 0 8rpx;
  }
}

.metric-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
  .metric-icon { font-size: 32rpx; }
  .metric-val  { font-size: var(--font-sm, 24rpx); font-weight: 700; color: var(--text-primary); }
  .metric-unit { font-size: 18rpx; color: var(--text-secondary); }
  .metric-name { font-size: var(--font-xs, 20rpx); color: var(--text-secondary); }
}

.update-time {
  display: block;
  font-size: var(--font-xs, 20rpx);
  color: var(--text-secondary);
  margin-top: 12rpx;
  text-align: right;
}
</style>
