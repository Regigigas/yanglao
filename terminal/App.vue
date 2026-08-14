<script>
import { useSettingsStore } from './store/settings'

export default {
  onLaunch() {
    // 登录页也需要沿用已保存的主题和字体。
    try {
      const settings = useSettingsStore()
      settings.initFromStorage()
      this.applyGlobalSettings(settings)
    } catch (_) {
      // Pinia 尚未就绪（极少发生），跳过主题初始化，页面自行处理
    }

    const token = uni.getStorageSync('yl_token')
    if (!token) {
      // 延迟一帧，确保路由系统就绪
      setTimeout(() => uni.reLaunch({ url: '/pages-auth/login/index' }), 0)
    }
  },

  onShow() {},
  onHide() {},

  methods: {
    applyGlobalSettings(settings) {
      // 设置导航栏颜色
      const navColors = {
        light: { bg: '#4A90D9', text: 'white' },
        dark:  { bg: '#0f3460', text: 'white' },
        green: { bg: '#27ae60', text: 'white' },
        warm:  { bg: '#e67e22', text: 'white' }
      }
      const c = navColors[settings.theme] || navColors.light
      const result = uni.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: c.bg,
        fail: () => {}
      })
      if (result && typeof result.catch === 'function') result.catch(() => {})
    }
  }
}
</script>

<style lang="scss">
/* 引入 iconfont */
@import './static/iconfont/iconfont.css';

/* 引入全局变量 */
@import './uni.scss';

/* 全局基础样式 */
* {
  box-sizing: border-box;
}

view, text, input, button {
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', sans-serif;
}

button {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  line-height: normal;
  &::after {
    border: none;
  }
}

/* 页面容器 — 应用主题与字体类 */
.page-container {
  min-height: 100vh;
  background: var(--bg-page, #F5F7FA);
  padding-bottom: 120rpx; /* 留出底部导航栏空间 */
}

.page-container.has-bottom-tab {
  padding-bottom: calc(128rpx + constant(safe-area-inset-bottom)) !important;
  padding-bottom: calc(128rpx + env(safe-area-inset-bottom)) !important;
}

/* 通用卡片 */
.card {
  background: var(--bg-card, #ffffff);
  border-radius: 16rpx;
  box-shadow: var(--shadow, 0 2rpx 12rpx rgba(0,0,0,0.08));
  padding: 24rpx;
  margin-bottom: 20rpx;
}

/* 通用列表项 */
.list-item {
  display: flex;
  align-items: center;
  padding: 28rpx 0;
  border-bottom: 1rpx solid var(--divider-color, #EBEEF5);
  &:last-child {
    border-bottom: none;
  }
}

/* 徽标 */
.badge {
  display: inline-block;
  min-width: 32rpx;
  height: 32rpx;
  line-height: 32rpx;
  padding: 0 8rpx;
  background: #f56c6c;
  color: #fff;
  font-size: 20rpx;
  border-radius: 16rpx;
  text-align: center;
}

/* 状态颜色 */
.text-danger  { color: #f56c6c; }
.text-warning { color: #e6a23c; }
.text-success { color: #67c23a; }
.text-info    { color: #909399; }
.text-primary { color: var(--primary-color, #4A90D9); }
</style>
