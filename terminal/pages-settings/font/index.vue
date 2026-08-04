<template>
  <view :class="['page-container', settingsStore.pageClass()]">
    <NavBar title="字体大小" :show-back="true" />

    <!-- 预览区 -->
    <view class="preview-area card">
      <text class="preview-label">预览效果</text>
      <text class="preview-title-text">养老护理终端</text>
      <text class="preview-body-text">张奶奶 · 301室 · 1床 · 心率 72次/分</text>
      <text class="preview-small-text">最后更新：今天 09:30</text>
    </view>

    <!-- 字体大小选项 -->
    <view class="hint-text">适当放大字体可帮助护理人员更清晰地读取信息</view>

    <view v-for="opt in fontOptions" :key="opt.val" class="card font-option" @tap="selectFont(opt.val)">
      <view class="option-left">
        <text class="option-icon" :style="{ fontSize: opt.previewSize }">A</text>
      </view>
      <view class="option-info">
        <text class="option-label">{{ opt.label }}</text>
        <text class="option-desc">{{ opt.desc }}</text>
      </view>
      <view class="option-check" :class="{ active: settingsStore.fontSize === opt.val }">
        <text v-if="settingsStore.fontSize === opt.val" class="iconfont icon-check"></text>
      </view>
    </view>

    <!-- 滑动调节 -->
    <view class="card slider-card">
      <text class="slider-label">拖动快速调节</text>
      <view class="slider-wrap">
        <text class="slider-a small-a">A</text>
        <slider
          :value="sliderValue"
          :min="0" :max="3" :step="1"
          :activeColor="'var(--primary-color)'"
          :block-size="28"
          class="font-slider"
          @change="onSliderChange"
        />
        <text class="slider-a large-a">A</text>
      </view>
      <view class="slider-labels">
        <text v-for="opt in fontOptions" :key="opt.val" class="slider-step">{{ opt.shortLabel }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { useSettingsStore } from '../../store/settings'
import NavBar from '../../components/NavBar.vue'

const FONT_VALS = ['sm', 'md', 'lg', 'xl']

export default {
  name: 'FontSizePage',
  components: { NavBar },
  setup() { return { settingsStore: useSettingsStore() } },

  data() {
    return {
      fontOptions: [
        { val: 'sm', label: '小字体', shortLabel: '小', previewSize: '28rpx', desc: '显示更多内容，适合年轻护理人员' },
        { val: 'md', label: '标准字体（推荐）', shortLabel: '中', previewSize: '36rpx', desc: '默认大小，平衡显示效果' },
        { val: 'lg', label: '大字体', shortLabel: '大', previewSize: '46rpx', desc: '文字更清晰，方便阅读' },
        { val: 'xl', label: '超大字体', shortLabel: '超大', previewSize: '56rpx', desc: '最大字体，视力不佳时推荐' }
      ]
    }
  },

  computed: {
    sliderValue() {
      return FONT_VALS.indexOf(this.settingsStore.fontSize)
    }
  },

  methods: {
    selectFont(val) {
      this.settingsStore.setFontSize(val)
    },

    onSliderChange(e) {
      const idx = Math.round(e.detail.value)
      const val = FONT_VALS[idx] || 'md'
      this.settingsStore.setFontSize(val)
    }
  }
}
</script>

<style scoped lang="scss">
.page-container { min-height: 100vh; background: var(--bg-page); padding-bottom: 40rpx; }

.card {
  background: var(--bg-card); border-radius: 16rpx;
  box-shadow: var(--shadow); margin: 0 24rpx 20rpx; padding: 24rpx;
}

/* 预览区 */
.preview-area { margin-top: 16rpx; }
.preview-label {
  font-size: var(--font-xs, 20rpx); color: var(--text-secondary);
  display: block; margin-bottom: 16rpx;
}
.preview-title-text {
  font-size: var(--font-title, 40rpx); font-weight: 700;
  color: var(--text-primary); display: block; margin-bottom: 8rpx;
}
.preview-body-text {
  font-size: var(--font-md, 28rpx); color: var(--text-regular); display: block; margin-bottom: 6rpx;
}
.preview-small-text {
  font-size: var(--font-xs, 20rpx); color: var(--text-secondary); display: block;
}

.hint-text {
  padding: 4rpx 32rpx 12rpx;
  font-size: var(--font-xs, 20rpx); color: var(--text-secondary);
}

/* 字体选项 */
.font-option {
  display: flex; align-items: center; gap: 20rpx; padding: 20rpx 24rpx;
  .option-left {
    width: 64rpx; display: flex; align-items: center; justify-content: center;
    .option-icon { font-weight: 700; color: var(--primary-color); }
  }
  .option-info { flex: 1; }
  .option-label { font-size: var(--font-sm, 24rpx); font-weight: 600; color: var(--text-primary); display: block; }
  .option-desc  { font-size: var(--font-xs, 20rpx); color: var(--text-secondary); margin-top: 4rpx; }
  .option-check {
    width: 48rpx; height: 48rpx; border-radius: 50%;
    border: 2rpx solid var(--border-color);
    display: flex; align-items: center; justify-content: center;
    .iconfont { font-size: 28rpx; color: #fff; }
    &.active { background: var(--primary-color); border-color: var(--primary-color); }
  }
}

/* 滑块 */
.slider-card {
  .slider-label { font-size: var(--font-sm, 24rpx); font-weight: 600; color: var(--text-primary); display: block; margin-bottom: 20rpx; }
  .slider-wrap { display: flex; align-items: center; gap: 12rpx; }
  .slider-a { font-weight: 700; color: var(--primary-color); }
  .small-a { font-size: 24rpx; }
  .large-a { font-size: 44rpx; }
  .font-slider { flex: 1; }
  .slider-labels {
    display: flex; justify-content: space-between; margin-top: 8rpx; padding: 0 12rpx;
    .slider-step { font-size: var(--font-xs, 20rpx); color: var(--text-secondary); }
  }
}
</style>
