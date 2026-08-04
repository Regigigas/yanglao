<template>
  <view :class="['login-page', settingsStore.pageClass()]">
    <!-- Logo 区 -->
    <view class="logo-area">
      <view class="logo-icon">
        <text class="iconfont icon-shield logo-icon-text"></text>
      </view>
      <text class="app-name">养老护理终端</text>
      <text class="app-sub">护理管理系统 · 终端接入</text>
    </view>

    <!-- 登录表单 -->
    <view class="form-card">
      <view class="form-item">
        <text class="iconfont icon-user form-icon"></text>
        <input
          v-model="form.username"
          class="form-input"
          placeholder="请输入用户名"
          placeholder-class="placeholder"
          maxlength="50"
        />
      </view>
      <view class="form-item">
        <text class="iconfont icon-lock form-icon"></text>
        <input
          v-model="form.password"
          class="form-input"
          placeholder="请输入密码"
          placeholder-class="placeholder"
          :password="true"
          maxlength="50"
          @confirm="handleLogin"
        />
      </view>

      <!-- 服务器地址配置（可展开） -->
      <view class="server-toggle" @tap="showServer = !showServer">
        <text class="iconfont icon-settings"></text>
        <text class="server-text">服务器配置</text>
        <text class="iconfont" :class="showServer ? 'icon-arrow-down' : 'icon-arrow-right'"></text>
      </view>
      <view v-if="showServer" class="form-item">
        <text class="iconfont icon-link form-icon"></text>
        <input
          v-model="serverUrl"
          class="form-input"
          placeholder="http://192.168.x.x:8080"
          maxlength="200"
        />
      </view>

      <button class="login-btn" :loading="loading" @tap="handleLogin">
        登 录
      </button>

      <text class="hint-text">账号管理请联系系统管理员在后台操作</text>
    </view>

    <!-- 版本信息 -->
    <text class="version-text">v1.0.0 · 养老管理系统终端</text>
  </view>
</template>

<script>
import { useUserStore }     from '../../store/user'
import { useSettingsStore } from '../../store/settings'

export default {
  name: 'LoginPage',

  setup() {
    return {
      userStore:     useUserStore(),
      settingsStore: useSettingsStore()
    }
  },

  data() {
    return {
      form: { username: '', password: '' },
      loading:    false,
      showServer: false,
      serverUrl:  uni.getStorageSync('yl_server_url') || 'http://192.168.1.100:8080'
    }
  },

  onLoad() {
    // 已登录则直接跳首页
    const token = uni.getStorageSync('yl_token')
    if (token) uni.reLaunch({ url: '/pages/index/index' })
  },

  methods: {
    async handleLogin() {
      if (!this.form.username.trim()) {
        return uni.showToast({ title: '请输入用户名', icon: 'none' })
      }
      if (!this.form.password) {
        return uni.showToast({ title: '请输入密码', icon: 'none' })
      }

      // 保存服务器地址
      if (this.serverUrl) {
        uni.setStorageSync('yl_server_url', this.serverUrl)
      }

      this.loading = true
      try {
        await this.userStore.login(this.form.username.trim(), this.form.password)
        uni.showToast({ title: '登录成功', icon: 'success' })
        setTimeout(() => {
          uni.reLaunch({ url: '/pages/index/index' })
        }, 800)
      } catch (e) {
        // 错误提示由 request.js 统一处理
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  background: var(--bg-nav, #4A90D9);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 48rpx;
}

.logo-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 0 60rpx;
}

.logo-icon {
  width: 140rpx;
  height: 140rpx;
  background: rgba(255,255,255,0.2);
  border-radius: 36rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24rpx;
}

.logo-icon-text { font-size: 80rpx; color: #fff; }

.app-name {
  font-size: var(--font-title, 40rpx);
  font-weight: 700;
  color: #fff;
  margin-bottom: 10rpx;
}

.app-sub {
  font-size: var(--font-sm, 24rpx);
  color: rgba(255,255,255,0.75);
}

.form-card {
  width: 100%;
  background: var(--bg-card, #fff);
  border-radius: 24rpx;
  padding: 40rpx 32rpx;
  box-shadow: 0 8rpx 32rpx rgba(0,0,0,0.15);
}

.form-item {
  display: flex;
  align-items: center;
  border-bottom: 1rpx solid var(--divider-color, #EBEEF5);
  margin-bottom: 16rpx;
  padding: 8rpx 0;
}

.form-icon {
  font-size: 36rpx;
  color: var(--primary-color, #4A90D9);
  margin-right: 16rpx;
  width: 44rpx;
  text-align: center;
}

.form-input {
  flex: 1;
  height: 80rpx;
  font-size: var(--font-md, 28rpx);
  color: var(--text-primary, #303133);
}

.placeholder { color: var(--text-secondary, #909399) !important; }

.server-toggle {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 0;
  margin-bottom: 8rpx;
  color: var(--text-secondary, #909399);
  font-size: var(--font-sm, 24rpx);
  .iconfont { font-size: 28rpx; }
}

.login-btn {
  width: 100%;
  height: 96rpx;
  background: var(--primary-color, #4A90D9) !important;
  color: #fff !important;
  border-radius: 48rpx;
  font-size: var(--font-lg, 32rpx) !important;
  font-weight: 600;
  margin-top: 32rpx;
  margin-bottom: 24rpx;
  border: none;
}

.hint-text {
  display: block;
  text-align: center;
  font-size: var(--font-xs, 20rpx);
  color: var(--text-secondary, #909399);
}

.version-text {
  margin-top: auto;
  padding: 40rpx 0 60rpx;
  font-size: var(--font-xs, 20rpx);
  color: rgba(255,255,255,0.5);
}
</style>
