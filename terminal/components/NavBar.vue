<template>
  <!-- 自定义顶部导航栏 -->
  <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px', background: bgColor }">
    <view class="nav-inner" :style="{ height: navHeight + 'px' }">
      <!-- 左侧区域：返回按钮 / 自定义 -->
      <view class="nav-left" @tap="handleBack">
        <slot name="left">
          <text v-if="showBack" class="iconfont icon-back nav-icon"></text>
        </slot>
      </view>

      <!-- 中间标题 -->
      <view class="nav-title">
        <slot name="title">
          <text class="title-text" :style="{ color: textColor }">{{ title }}</text>
        </slot>
      </view>

      <!-- 右侧区域 -->
      <view class="nav-right">
        <slot name="right"></slot>
      </view>
    </view>
  </view>
  <!-- 占位，撑开页面内容避免被导航栏遮挡 -->
  <view :style="{ height: totalHeight + 'px' }"></view>
</template>

<script>
export default {
  name: 'NavBar',

  props: {
    title:    { type: String, default: '养老护理终端' },
    showBack: { type: Boolean, default: false },
    bgColor:  { type: String, default: 'var(--bg-nav, #4A90D9)' },
    textColor:{ type: String, default: '#ffffff' }
  },

  emits: ['back'],

  data() {
    const info = uni.getSystemInfoSync()
    return {
      statusBarHeight: info.statusBarHeight || 20,
      navHeight:       44
    }
  },

  computed: {
    totalHeight() {
      return this.statusBarHeight + this.navHeight
    }
  },

  methods: {
    handleBack() {
      this.$emit('back')
      if (getCurrentPages().length > 1) {
        uni.navigateBack()
      } else {
        uni.reLaunch({ url: '/pages/index/index' })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.nav-inner {
  display: flex;
  align-items: center;
  padding: 0 24rpx;
}

.nav-left, .nav-right {
  width: 80rpx;
  display: flex;
  align-items: center;
}

.nav-right {
  justify-content: flex-end;
}

.nav-icon {
  font-size: 40rpx;
  color: #ffffff;
  padding: 10rpx;
}

.nav-title {
  flex: 1;
  text-align: center;
}

.title-text {
  font-size: var(--font-lg, 32rpx);
  font-weight: 600;
}
</style>
