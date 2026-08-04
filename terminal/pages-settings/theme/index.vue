<template>
  <view :class="['page-container', settingsStore.pageClass()]">
    <NavBar title="主题换肤" :show-back="true" />

    <view class="hint-text">选择您喜欢的界面主题风格，即时生效</view>

    <!-- 主题选项 -->
    <view v-for="theme in themes" :key="theme.val" class="card theme-card" @tap="selectTheme(theme.val)">
      <!-- 预览色块 -->
      <view class="theme-preview" :style="{ background: theme.bg }">
        <view class="preview-nav" :style="{ background: theme.navBg }">
          <text class="preview-title">养老护理终端</text>
        </view>
        <view class="preview-body">
          <view class="preview-card" :style="{ background: theme.cardBg }">
            <view class="preview-dot" :style="{ background: theme.primary }"></view>
            <view class="preview-lines">
              <view class="preview-line" :style="{ background: theme.text, width: '60%' }"></view>
              <view class="preview-line" :style="{ background: theme.textLight, width: '40%', marginTop: '8rpx' }"></view>
            </view>
          </view>
        </view>
        <view class="preview-tabbar" :style="{ background: theme.tabBg }">
          <view v-for="i in 5" :key="i" class="preview-tab">
            <view class="preview-tab-dot" :style="{ background: i === 1 ? theme.primary : theme.tabInactive }"></view>
          </view>
        </view>
      </view>

      <!-- 主题信息 -->
      <view class="theme-info">
        <view class="theme-name-row">
          <text class="theme-name">{{ theme.label }}</text>
          <text class="theme-desc">{{ theme.desc }}</text>
        </view>
        <view class="theme-check" :class="{ active: settingsStore.theme === theme.val }">
          <text v-if="settingsStore.theme === theme.val" class="iconfont icon-check"></text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { useSettingsStore } from '../../store/settings'
import NavBar from '../../components/NavBar.vue'

export default {
  name: 'ThemePage',
  components: { NavBar },
  setup() { return { settingsStore: useSettingsStore() } },

  data() {
    return {
      themes: [
        {
          val: 'light', label: '晴空蓝（默认）', desc: '清爽明亮，专业医护风格',
          bg: '#F5F7FA', navBg: '#4A90D9', cardBg: '#fff', primary: '#4A90D9',
          text: '#303133', textLight: '#C0C4CC', tabBg: '#fff', tabInactive: '#C0C4CC'
        },
        {
          val: 'dark', label: '深夜护理', desc: '深色模式，保护眼睛',
          bg: '#1a1a2e', navBg: '#0f3460', cardBg: '#16213e', primary: '#5a9fd8',
          text: '#e0e0e0', textLight: '#606060', tabBg: '#16213e', tabInactive: '#404060'
        },
        {
          val: 'green', label: '护理绿', desc: '自然舒适，关爱生命',
          bg: '#f0f9f4', navBg: '#27ae60', cardBg: '#fff', primary: '#2ecc71',
          text: '#2c3e50', textLight: '#90a4ae', tabBg: '#fff', tabInactive: '#b2dfdb'
        },
        {
          val: 'warm', label: '暖橙关怀', desc: '温暖亲切，适合老人阅读',
          bg: '#fdf8f3', navBg: '#e67e22', cardBg: '#fff', primary: '#e67e22',
          text: '#3e2723', textLight: '#bcaaa4', tabBg: '#fff8f3', tabInactive: '#d7ccc8'
        }
      ]
    }
  },

  methods: {
    selectTheme(val) {
      this.settingsStore.setTheme(val)
      uni.showToast({ title: '主题已切换', icon: 'success' })
    }
  }
}
</script>

<style scoped lang="scss">
.page-container { min-height: 100vh; background: var(--bg-page); padding-bottom: 40rpx; }

.hint-text {
  padding: 16rpx 32rpx;
  font-size: var(--font-xs, 20rpx); color: var(--text-secondary);
}

.card {
  background: var(--bg-card); border-radius: 16rpx;
  box-shadow: var(--shadow); margin: 0 24rpx 20rpx; overflow: hidden;
}

/* 预览区域 */
.theme-preview {
  height: 200rpx; display: flex; flex-direction: column;
}
.preview-nav {
  height: 48rpx; display: flex; align-items: center; padding: 0 16rpx;
  .preview-title { font-size: 18rpx; color: #fff; font-weight: 600; }
}
.preview-body {
  flex: 1; padding: 10rpx 12rpx;
  .preview-card {
    border-radius: 8rpx; padding: 10rpx 12rpx; display: flex; align-items: center; gap: 8rpx;
    .preview-dot { width: 20rpx; height: 20rpx; border-radius: 50%; }
    .preview-lines { flex: 1; }
    .preview-line { height: 8rpx; border-radius: 4rpx; }
  }
}
.preview-tabbar {
  height: 36rpx; display: flex; align-items: center; justify-content: space-around;
  padding: 0 16rpx; border-top: 1rpx solid rgba(0,0,0,0.05);
  .preview-tab { display: flex; align-items: center; justify-content: center; }
  .preview-tab-dot { width: 16rpx; height: 16rpx; border-radius: 50%; }
}

/* 主题信息行 */
.theme-info {
  display: flex; align-items: center; padding: 20rpx 24rpx;
  .theme-name-row { flex: 1; }
  .theme-name { font-size: var(--font-sm, 24rpx); font-weight: 600; color: var(--text-primary); display: block; }
  .theme-desc { font-size: var(--font-xs, 20rpx); color: var(--text-secondary); margin-top: 4rpx; }
}

.theme-check {
  width: 48rpx; height: 48rpx; border-radius: 50%;
  border: 2rpx solid var(--border-color);
  display: flex; align-items: center; justify-content: center;
  .iconfont { font-size: 28rpx; color: #fff; }
  &.active { background: var(--primary-color); border-color: var(--primary-color); }
}
</style>
