<template>
  <view :class="['page-container', settingsStore.pageClass()]">
    <NavBar title="系统设置" :show-back="false" />

    <!-- 用户信息 -->
    <view class="card user-card">
      <view class="user-avatar">
        <text class="iconfont icon-user-circle avatar-icon"></text>
      </view>
      <view class="user-info">
        <text class="user-name">{{ userStore.userInfo?.nickName || userStore.userInfo?.userName || '—' }}</text>
        <text class="user-dept">{{ userStore.userInfo?.dept?.deptName || '' }}</text>
        <text class="user-roles">{{ userRoleText }}</text>
      </view>
    </view>

    <!-- 设置分组：界面 -->
    <view class="group-title">界面设置</view>
    <view class="card group-card">
      <view class="setting-item" @tap="goTo('/pages-settings/theme/index')">
        <text class="iconfont icon-theme item-icon" style="color:#f39c12"></text>
        <text class="item-label">主题换肤</text>
        <text class="item-value">{{ themeLabel }}</text>
        <text class="iconfont icon-arrow-right item-arrow"></text>
      </view>
      <view class="setting-item" @tap="goTo('/pages-settings/font/index')">
        <text class="iconfont icon-font-size item-icon" style="color:#9b59b6"></text>
        <text class="item-label">字体大小</text>
        <text class="item-value">{{ fontLabel }}</text>
        <text class="iconfont icon-arrow-right item-arrow"></text>
      </view>
    </view>

    <!-- 设置分组：设备 -->
    <view class="group-title">设备管理</view>
    <view class="card group-card">
      <view class="setting-item" @tap="goTo('/pages-device/connect/index')">
        <text class="iconfont icon-bluetooth item-icon" style="color:#2ecc71"></text>
        <text class="item-label">蓝牙连接</text>
        <text class="item-value">{{ deviceStore.btConnectedDevice ? deviceStore.btConnectedDevice.name : '未连接' }}</text>
        <text class="iconfont icon-arrow-right item-arrow"></text>
      </view>
      <view class="setting-item" @tap="goTo('/pages-device/list/index')">
        <text class="iconfont icon-device item-icon" style="color:#1abc9c"></text>
        <text class="item-label">设备列表</text>
        <text class="item-value">{{ deviceStore.onlineDevices }} 台在线</text>
        <text class="iconfont icon-arrow-right item-arrow"></text>
      </view>
    </view>

    <!-- 设置分组：资料存储 -->
    <view class="group-title">资料存储</view>
    <view class="card group-card">
      <view class="setting-item" @tap="goTo('/pages-funeral/storage/index')">
        <text class="iconfont icon-location item-icon" style="color:#52606d"></text>
        <text class="item-label">白事证明材料</text>
        <text class="item-value storage-value">{{ funeralStoragePath }}</text>
        <text class="iconfont icon-arrow-right item-arrow"></text>
      </view>
    </view>

    <!-- 设置分组：网络 -->
    <view class="group-title">网络配置</view>
    <view class="card group-card">
      <view class="setting-item" @tap="editServerUrl">
        <text class="iconfont icon-link item-icon" style="color:#4A90D9"></text>
        <text class="item-label">后台服务器地址</text>
        <text class="item-value server-url">{{ currentServerUrl }}</text>
        <text class="iconfont icon-edit item-arrow"></text>
      </view>
      <view class="setting-item" @tap="testConnection">
        <text class="iconfont icon-signal item-icon" style="color:#2ecc71"></text>
        <text class="item-label">测试连接</text>
        <text class="item-value" :class="connStatusClass">{{ connStatusText }}</text>
      </view>
      <view class="setting-item" @tap="goTo('/pages-settings/chat/index')">
        <text class="iconfont icon-link item-icon" style="color:#1abc9c"></text>
        <text class="item-label">聊天连接设置</text>
        <text class="item-value">{{ chatModeLabel }}</text>
        <text class="iconfont icon-arrow-right item-arrow"></text>
      </view>
    </view>

    <!-- 编辑服务器地址弹窗 -->
    <view v-if="showUrlEditor" class="modal-mask" @tap.self="showUrlEditor = false">
      <view class="modal-card">
        <text class="modal-title-text">
          <text class="iconfont icon-link"></text> 设置服务器地址
        </text>
        <text class="modal-hint">填写后台部署的 IP 和端口，如：http://192.168.1.100:8080</text>
        <view class="url-input-wrap">
          <input
            v-model="editingUrl"
            class="url-input"
            placeholder="http://192.168.x.x:8080"
            confirm-type="done"
            @confirm="saveServerUrl"
          />
          <text v-if="editingUrl" class="url-clear" @tap="editingUrl = ''">
            <text class="iconfont icon-close"></text>
          </text>
        </view>
        <view class="modal-btns">
          <view class="modal-btn cancel" @tap="showUrlEditor = false">取消</view>
          <view class="modal-btn confirm" @tap="saveServerUrl">保存</view>
        </view>
      </view>
    </view>

    <!-- 设置分组：账号 -->
    <view class="group-title">账号信息</view>
    <view class="card group-card">
      <view class="setting-item">
        <text class="iconfont icon-user item-icon" style="color:#4A90D9"></text>
        <text class="item-label">用户账号</text>
        <text class="item-value">{{ userStore.userInfo?.userName || '—' }}</text>
      </view>
      <view class="setting-item">
        <text class="iconfont icon-shield item-icon" style="color:#67c23a"></text>
        <text class="item-label">账号注销</text>
        <text class="item-value hint">需在后台系统操作</text>
      </view>
    </view>

    <!-- 设置分组：关于 -->
    <view class="group-title">关于</view>
    <view class="card group-card">
      <view class="setting-item" @tap="goTo('/pages-settings/update/index')">
        <text class="iconfont icon-version item-icon" style="color:#909399"></text>
        <text class="item-label">软件更新</text>
        <text class="item-value">v1.1.0</text>
        <text class="iconfont icon-arrow-right item-arrow"></text>
      </view>
      <view class="setting-item">
        <text class="iconfont icon-about item-icon" style="color:#909399"></text>
        <text class="item-label">系统名称</text>
        <text class="item-value">养老护理管理系统</text>
      </view>
    </view>

    <!-- 退出登录 -->
    <view class="logout-btn" @tap="handleLogout">
      <text class="iconfont icon-logout"></text>
      <text>退出登录</text>
    </view>

    <BottomTabBar current="/pages-settings/index/index" />
  </view>
</template>

<script>
import { useUserStore }     from '../../store/user'
import { useDeviceStore }   from '../../store/device'
import { useSettingsStore } from '../../store/settings'
import { getBaseUrl, setBaseUrl } from '../../api/request'
import { CHAT_MODE_LOCAL, getChatConfig } from '../../utils/chat-config'
import { getConfiguredStoragePath, getFuneralStorageConfig } from '../../utils/funeral-storage'
import NavBar       from '../../components/NavBar.vue'
import BottomTabBar from '../../components/BottomTabBar.vue'

const THEME_LABELS = { light: '浅色', dark: '深色', green: '护理绿', warm: '暖橙' }
const FONT_LABELS  = { sm: '小', md: '中（推荐）', lg: '大', xl: '超大' }

export default {
  name: 'SettingsIndexPage',
  components: { NavBar, BottomTabBar },
  setup() {
    return {
      userStore:     useUserStore(),
      deviceStore:   useDeviceStore(),
      settingsStore: useSettingsStore()
    }
  },
  data() {
    return {
      showUrlEditor:   false,
      editingUrl:      '',
      currentServerUrl: getBaseUrl(),
      connStatusText:  '点击测试',
      connStatusClass: '',
      chatMode: getChatConfig().mode,
      funeralStorageConfig: getFuneralStorageConfig()
    }
  },
  computed: {
    themeLabel() { return THEME_LABELS[this.settingsStore.theme] || '浅色' },
    fontLabel()  { return FONT_LABELS[this.settingsStore.fontSize] || '中' },
    chatModeLabel() { return this.chatMode === CHAT_MODE_LOCAL ? '局域网本地' : '线上服务' },
    funeralStoragePath() {
      return this.funeralStorageConfig.resolvedPath || getConfiguredStoragePath(this.funeralStorageConfig)
    },
    userRoleText() {
      return (this.userStore.roles || []).map(r => r.roleName || r).join('、') || '护理人员'
    }
  },
  onShow() {
    this.userStore.restoreFromStorage()
    this.currentServerUrl = getBaseUrl()
    this.chatMode = getChatConfig().mode
    this.funeralStorageConfig = getFuneralStorageConfig()
  },
  methods: {
    goTo(path) {
      uni.navigateTo({ url: path })
    },

    /** 打开服务器地址编辑弹窗 */
    editServerUrl() {
      this.editingUrl    = getBaseUrl()
      this.showUrlEditor = true
    },

    /** 保存服务器地址 */
    saveServerUrl() {
      const url = this.editingUrl.trim()
      if (!url) {
        return uni.showToast({ title: '地址不能为空', icon: 'none' })
      }
      if (!/^https?:\/\/.+/.test(url)) {
        return uni.showToast({ title: '请以 http:// 或 https:// 开头', icon: 'none' })
      }
      setBaseUrl(url)
      this.currentServerUrl = url
      this.showUrlEditor    = false
      this.connStatusText   = '点击测试'
      this.connStatusClass  = ''
      uni.showToast({ title: '地址已保存', icon: 'success' })
    },

    /** 测试后台连通性 */
    testConnection() {
      this.connStatusText  = '测试中...'
      this.connStatusClass = ''
      const baseUrl = getBaseUrl()
      uni.request({
        url:     baseUrl + '/actuator/health',   // Spring Boot 健康检查端点
        method:  'GET',
        timeout: 8000,
        success: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 400) {
            this.connStatusText  = '连接正常 ✓'
            this.connStatusClass = 'conn-ok'
          } else {
            this.connStatusText  = `响应 ${res.statusCode}`
            this.connStatusClass = 'conn-warn'
          }
        },
        fail: () => {
          this.connStatusText  = '无法连接 ✗'
          this.connStatusClass = 'conn-fail'
        }
      })
    },

    handleLogout() {
      uni.showModal({
        title: '退出登录',
        content: '确定退出当前账号吗？',
        success: async ({ confirm }) => {
          if (!confirm) return
          await this.userStore.logout()
          uni.reLaunch({ url: '/pages-auth/login/index' })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.page-container { min-height: 100vh; background: var(--bg-page); padding-bottom: 130rpx; }

.card {
  background: var(--bg-card); border-radius: 16rpx;
  box-shadow: var(--shadow); margin: 0 24rpx 12rpx;
}

/* 用户卡片 */
.user-card {
  display: flex; align-items: center; gap: 24rpx;
  padding: 32rpx 24rpx; margin-top: 16rpx;
}
.user-avatar {
  width: 100rpx; height: 100rpx; border-radius: 50%;
  background: var(--primary-light); display: flex; align-items: center; justify-content: center;
  .avatar-icon { font-size: 64rpx; color: var(--primary-color); }
}
.user-info { flex: 1; }
.user-name { font-size: var(--font-lg, 32rpx); font-weight: 600; color: var(--text-primary); display: block; }
.user-dept { font-size: var(--font-xs, 20rpx); color: var(--text-secondary); display: block; margin-top: 4rpx; }
.user-roles{ font-size: var(--font-xs, 20rpx); color: var(--text-secondary); }

/* 分组标题 */
.group-title {
  font-size: var(--font-xs, 20rpx); color: var(--text-secondary);
  padding: 16rpx 36rpx 8rpx; font-weight: 500;
}

.group-card { padding: 0 24rpx; }

/* 设置项 */
.setting-item {
  display: flex; align-items: center; padding: 28rpx 0;
  border-bottom: 1rpx solid var(--divider-color);
  &:last-child { border-bottom: none; }
}
.item-icon  { font-size: 40rpx; margin-right: 16rpx; width: 44rpx; text-align: center; }
.item-label { font-size: var(--font-sm, 24rpx); color: var(--text-primary); flex: 1; }
.item-value {
  font-size: var(--font-xs, 20rpx); color: var(--text-secondary); margin-right: 8rpx;
  &.hint { color: #e67e22; font-style: italic; }
}
.item-arrow { font-size: 24rpx; color: var(--text-secondary); }

/* 服务器地址 */
.server-url {
  max-width: 300rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.storage-value {
  max-width: 260rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.conn-ok   { color: #67c23a !important; }
.conn-warn { color: #e6a23c !important; }
.conn-fail { color: #f56c6c !important; }

/* 编辑弹窗 */
.modal-mask {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5);
  z-index: 2000; display: flex; align-items: flex-end;
}
.modal-card {
  width: 100%; background: var(--bg-card);
  border-radius: 32rpx 32rpx 0 0;
  padding: 40rpx 32rpx;
  box-sizing: border-box;
  padding-bottom: calc(40rpx + env(safe-area-inset-bottom));
}
.modal-title-text {
  font-size: var(--font-lg, 32rpx); font-weight: 600;
  color: var(--text-primary); display: block; margin-bottom: 12rpx;
  .iconfont { font-size: 32rpx; color: var(--primary-color); margin-right: 8rpx; }
}
.modal-hint {
  font-size: var(--font-xs, 20rpx); color: var(--text-secondary);
  display: block; margin-bottom: 24rpx;
}
.url-input-wrap {
  display: flex; align-items: center;
  background: var(--bg-page); border-radius: 12rpx;
  border: 1rpx solid var(--border-color);
  padding: 0 20rpx; margin-bottom: 32rpx;
}
.url-input {
  flex: 1; height: 88rpx;
  font-size: var(--font-sm, 24rpx); color: var(--text-primary);
}
.url-clear {
  padding: 10rpx;
  .iconfont { font-size: 28rpx; color: var(--text-secondary); }
}
.modal-btns { display: flex; gap: 24rpx; }
.modal-btn {
  flex: 1; height: 88rpx; border-radius: 44rpx;
  display: flex; align-items: center; justify-content: center;
  font-size: var(--font-md, 28rpx); font-weight: 600;
  &.cancel  { background: var(--bg-page); color: var(--text-regular); border: 1rpx solid var(--border-color); }
  &.confirm { background: var(--primary-color); color: #fff; }
}

/* 退出按钮 */
.logout-btn {
  display: flex; align-items: center; justify-content: center; gap: 12rpx;
  margin: 40rpx 24rpx 0; padding: 32rpx 0;
  background: var(--bg-card); border-radius: 16rpx;
  color: #f56c6c; font-size: var(--font-md, 28rpx); font-weight: 600;
  box-shadow: var(--shadow);
  .iconfont { font-size: 36rpx; }
}
</style>
