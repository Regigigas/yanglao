<template>
  <view class="tab-bar" :style="{ background: 'var(--tabbar-bg, #fff)' }">
    <view
      v-for="tab in tabs"
      :key="tab.path"
      class="tab-item"
      :class="{ active: currentPath === tab.path }"
      @tap="switchTab(tab)"
    >
      <!-- iconfont 图标 -->
      <view class="icon-wrap">
        <text class="iconfont" :class="[currentPath === tab.path ? tab.activeIcon : tab.icon]"></text>
        <!-- 角标 -->
        <text v-if="getBadge(tab.key) > 0" class="tab-badge">
          {{ getBadge(tab.key) > 99 ? '99+' : getBadge(tab.key) }}
        </text>
      </view>
      <text class="tab-label">{{ tab.label }}</text>
    </view>
  </view>
</template>

<script>
import { useHealthStore } from '../store/health'
import { useDeviceStore } from '../store/device'

const TABS = [
  {
    path:       '/pages/index/index',
    label:      '首页',
    icon:       'icon-home',
    activeIcon: 'icon-home',
    key:        'home'
  },
  {
    path:       '/pages-health/monitor/index',
    label:      '健康',
    icon:       'icon-heart',
    activeIcon: 'icon-heartbeat',
    key:        'health'
  },
  {
    path:       '/pages-care/tasks/index',
    label:      '护理',
    icon:       'icon-care',
    activeIcon: 'icon-nurse',
    key:        'care'
  },
  {
    path:       '/pages-device/connect/index',
    label:      '设备',
    icon:       'icon-device',
    activeIcon: 'icon-link',
    key:        'device'
  },
  {
    path:       '/pages-settings/index/index',
    label:      '设置',
    icon:       'icon-settings',
    activeIcon: 'icon-settings',
    key:        'settings'
  }
]

export default {
  name: 'BottomTabBar',

  props: {
    // 当前激活的 tab 路径，由各页面传入
    current: {
      type: String,
      default: ''
    }
  },

  data() {
    return { tabs: TABS }
  },

  computed: {
    currentPath() {
      return this.current || (getCurrentPages().length
        ? '/' + getCurrentPages().slice(-1)[0].route
        : '/pages/index/index')
    }
  },

  methods: {
    getBadge(key) {
      if (key === 'health') {
        const store = useHealthStore()
        return store.unreadAlerts || 0
      }
      if (key === 'device') {
        const store = useDeviceStore()
        return store.unreadAlerts || 0
      }
      return 0
    },

    switchTab(tab) {
      if (this.currentPath === tab.path) return
      uni.reLaunch({ url: tab.path })
    }
  }
}
</script>

<style scoped lang="scss">
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 112rpx;
  display: flex;
  align-items: center;
  border-top: 1rpx solid var(--divider-color, #EBEEF5);
  z-index: 999;
  padding-bottom: env(safe-area-inset-bottom);
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8rpx 0;
  cursor: pointer;

  .icon-wrap {
    position: relative;
    width: 56rpx;
    height: 56rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .iconfont {
    font-size: 44rpx;
    color: var(--tabbar-inactive, #999);
    transition: color 0.2s;
  }

  .tab-label {
    font-size: var(--font-xs, 20rpx);
    color: var(--tabbar-inactive, #999);
    margin-top: 4rpx;
    transition: color 0.2s;
  }

  .tab-badge {
    position: absolute;
    top: -8rpx;
    right: -12rpx;
    min-width: 28rpx;
    height: 28rpx;
    line-height: 28rpx;
    padding: 0 6rpx;
    background: #f56c6c;
    color: #fff;
    font-size: 18rpx;
    border-radius: 14rpx;
    text-align: center;
  }

  &.active {
    .iconfont, .tab-label {
      color: var(--tabbar-active, #4A90D9);
    }
  }
}
</style>
