<template>
  <view :class="['page-container', settingsStore.pageClass()]">
    <NavBar title="聊天连接设置" :show-back="true" />

    <view class="section-title">服务模式</view>
    <view class="mode-switch">
      <button :class="{ active: form.mode === CHAT_MODE_ONLINE }" @tap="selectMode(CHAT_MODE_ONLINE)">线上服务</button>
      <button :class="{ active: form.mode === CHAT_MODE_LOCAL }" @tap="selectMode(CHAT_MODE_LOCAL)">局域网本地</button>
    </view>

    <view v-if="form.mode === CHAT_MODE_ONLINE" class="card status-card">
      <text class="card-title">当前后台地址</text>
      <text class="address-text">{{ onlineUrl }}</text>
      <text class="description">聊天请求使用主业务登录状态，并通过当前后台服务转发。</text>
      <button class="primary-button" :loading="testing" @tap="testOnline">测试线上聊天</button>
      <text class="login-status" :class="statusClass">{{ statusText }}</text>
    </view>

    <view v-else class="local-content">
      <view class="card form-card">
        <label class="field">
          <text class="field-label">本地服务地址</text>
          <input v-model="form.localUrl" class="field-input" placeholder="192.168.1.20:9000" @blur="saveLocalForm(false)" />
        </label>
        <label class="field">
          <text class="field-label">访问密钥（可选）</text>
          <input v-model="form.secret" class="field-input" :password="true" placeholder="局域网服务 X-Secret" @blur="saveLocalForm(false)" />
        </label>
        <label class="field">
          <text class="field-label">用户名</text>
          <input v-model="form.username" class="field-input" autocomplete="username" placeholder="本地聊天账号" @blur="saveLocalForm(false)" />
        </label>
        <label class="field last-field">
          <text class="field-label">密码</text>
          <input v-model="password" class="field-input" :password="true" autocomplete="current-password" placeholder="仅用于本次登录，不会保存" />
        </label>
      </view>

      <view class="action-row">
        <button class="primary-button" :loading="loggingIn" :disabled="testing" @tap="loginLocal">本地登录</button>
        <button class="secondary-button" :loading="testing" :disabled="loggingIn" @tap="testLocal">测试连接</button>
      </view>
      <text class="login-status" :class="statusClass">{{ statusText }}</text>
    </view>
  </view>
</template>

<script>
import NavBar from '../../components/NavBar.vue'
import { getBaseUrl } from '../../api/request'
import { loginLocalChat, testChatConnection } from '../../api/chat'
import { useSettingsStore } from '../../store/settings'
import {
  CHAT_MODE_LOCAL,
  CHAT_MODE_ONLINE,
  getChatConfig,
  saveChatConfig
} from '../../utils/chat-config'

export default {
  name: 'ChatConnectionSettingsPage',
  components: { NavBar },
  setup() {
    return { settingsStore: useSettingsStore() }
  },
  data() {
    const config = getChatConfig()
    return {
      CHAT_MODE_LOCAL,
      CHAT_MODE_ONLINE,
      onlineUrl: getBaseUrl(),
      form: {
        mode: config.mode,
        localUrl: config.localUrl,
        secret: config.secret,
        username: config.username
      },
      password: '',
      loggingIn: false,
      testing: false,
      statusText: config.token ? '已保存本地登录凭证' : '尚未登录本地聊天',
      statusClass: config.token ? 'success' : ''
    }
  },
  methods: {
    selectMode(mode) {
      this.form.mode = mode
      saveChatConfig({ mode })
      this.statusText = mode === CHAT_MODE_LOCAL ? '已切换到局域网本地聊天' : '已切换到线上聊天'
      this.statusClass = 'success'
    },
    saveLocalForm(showToast = true) {
      try {
        const config = saveChatConfig(this.form)
        this.form.localUrl = config.localUrl
        if (showToast) uni.showToast({ title: '连接配置已保存', icon: 'success' })
        return true
      } catch (error) {
        this.statusText = error.message
        this.statusClass = 'error'
        if (showToast) uni.showToast({ title: error.message, icon: 'none' })
        return false
      }
    },
    async loginLocal() {
      if (!this.saveLocalForm(false)) return
      this.loggingIn = true
      this.statusText = '正在登录本地聊天...'
      this.statusClass = ''
      try {
        const result = await loginLocalChat(this.form.username, this.password)
        this.password = ''
        this.statusText = `登录成功${result.user?.nickName ? `：${result.user.nickName}` : ''}`
        this.statusClass = 'success'
      } catch (error) {
        this.statusText = error.message || '本地聊天登录失败'
        this.statusClass = 'error'
      } finally {
        this.loggingIn = false
      }
    },
    async testLocal() {
      if (!this.saveLocalForm(false)) return
      await this.runTest('本地聊天连接正常')
    },
    async testOnline() {
      saveChatConfig({ mode: CHAT_MODE_ONLINE })
      await this.runTest('线上聊天连接正常')
    },
    async runTest(successText) {
      this.testing = true
      this.statusText = '正在测试连接...'
      this.statusClass = ''
      try {
        await testChatConnection()
        this.statusText = successText
        this.statusClass = 'success'
      } catch (error) {
        this.statusText = error.message || '聊天连接失败'
        this.statusClass = 'error'
      } finally {
        this.testing = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
.page-container { min-height: 100vh; padding-bottom: calc(48rpx + env(safe-area-inset-bottom)); box-sizing: border-box; background: var(--bg-page); color: var(--text-primary); }
.section-title { padding: 24rpx 32rpx 12rpx; color: var(--text-secondary); font-size: var(--font-xs, 20rpx); }
.mode-switch { height: 76rpx; margin: 0 24rpx 20rpx; padding: 5rpx; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); box-sizing: border-box; border-radius: 10rpx; background: var(--bg-card); box-shadow: var(--shadow); }
.mode-switch button { width: 100%; height: 66rpx; margin: 0; padding: 0 12rpx; border-radius: 7rpx; background: transparent; color: var(--text-secondary); font-size: var(--font-sm, 24rpx); line-height: 66rpx; }
.mode-switch button.active { background: var(--primary-color); color: #fff; font-weight: 600; }
.card { margin: 0 24rpx 20rpx; padding: 24rpx; box-sizing: border-box; border-radius: 16rpx; background: var(--bg-card); box-shadow: var(--shadow); }
.status-card { display: flex; flex-direction: column; }
.card-title { font-size: var(--font-sm, 24rpx); font-weight: 600; }
.address-text { margin-top: 16rpx; padding: 18rpx; overflow-wrap: anywhere; border: 1rpx solid var(--border-color); border-radius: 8rpx; background: var(--bg-page); color: var(--primary-color); font-size: var(--font-xs, 20rpx); }
.description { margin: 18rpx 0 24rpx; color: var(--text-secondary); font-size: var(--font-xs, 20rpx); line-height: 1.6; }
.form-card { padding-top: 4rpx; padding-bottom: 4rpx; }
.field { padding: 22rpx 0; display: block; border-bottom: 1rpx solid var(--divider-color); }
.last-field { border-bottom: 0; }
.field-label { display: block; margin-bottom: 12rpx; font-size: var(--font-sm, 24rpx); font-weight: 500; }
.field-input { width: 100%; height: 76rpx; padding: 0 18rpx; box-sizing: border-box; border: 1rpx solid var(--border-color); border-radius: 8rpx; background: var(--bg-page); color: var(--text-primary); font-size: var(--font-sm, 24rpx); }
.action-row { margin: 0 24rpx; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 16rpx; }
.primary-button, .secondary-button { width: 100%; height: 82rpx; margin: 0; padding: 0 12rpx; border-radius: 8rpx; font-size: var(--font-sm, 24rpx); line-height: 82rpx; }
.primary-button { background: var(--primary-color); color: #fff; }
.secondary-button { border: 1rpx solid var(--primary-color); background: var(--bg-card); color: var(--primary-color); }
.login-status { margin: 18rpx 32rpx 0; display: block; overflow-wrap: anywhere; color: var(--text-secondary); font-size: var(--font-xs, 20rpx); text-align: center; }
.login-status.success { color: #67c23a; }
.login-status.error { color: #f56c6c; }
</style>
