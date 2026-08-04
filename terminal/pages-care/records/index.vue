<template>
  <view :class="['page-container', settingsStore.pageClass()]">
    <NavBar title="护理记录" :show-back="true" />

    <!-- 新增记录按钮 -->
    <view class="add-bar">
      <view class="add-btn" @tap="showAddForm = true">
        <text class="iconfont icon-add"></text>
        <text>新增护理记录</text>
      </view>
    </view>

    <view v-if="loading" class="loading-wrap">
      <text class="iconfont icon-loading"></text><text>加载中...</text>
    </view>
    <view v-else-if="records.length === 0" class="empty-wrap">
      <text class="iconfont icon-record empty-icon"></text>
      <text class="empty-text">暂无护理记录</text>
    </view>
    <view v-else>
      <view v-for="rec in records" :key="rec.recordId" class="card record-card">
        <view class="record-header">
          <view class="rec-elder">
            <text class="iconfont icon-elder"></text>
            <text class="elder-name">{{ rec.elderlyName }}</text>
          </view>
          <view class="rec-actions">
            <text class="rec-time">{{ rec.createTime }}</text>
            <view class="delete-btn" @tap.stop="confirmDelete(rec)">
              <text class="iconfont icon-delete"></text>
            </view>
          </view>
        </view>
        <view class="care-tags">
          <text v-for="tag in (rec.careItems || []).slice(0, 3)" :key="tag" class="care-tag">{{ tag }}</text>
        </view>
        <text class="rec-remark">{{ rec.remark || '—' }}</text>
        <text class="rec-nurse">护理人：{{ rec.nurseName || '—' }}</text>
      </view>
    </view>

    <!-- 新增护理记录弹窗 -->
    <view v-if="showAddForm" class="modal-mask" @tap.self="showAddForm = false">
      <view class="modal-card">
        <view class="modal-title">
          <text class="iconfont icon-record"></text>
          <text>新增护理记录</text>
        </view>
        <view class="form-item">
          <text class="form-label">老人姓名</text>
          <input v-model="newRecord.elderlyName" class="form-input" placeholder="请输入老人姓名" />
        </view>
        <view class="form-item">
          <text class="form-label">护理项目</text>
          <input v-model="newRecord.careItems" class="form-input" placeholder="如：翻身、服药、洗漱" />
        </view>
        <view class="form-item">
          <text class="form-label">护理备注</text>
          <textarea v-model="newRecord.remark" class="form-textarea" placeholder="护理情况说明..."></textarea>
        </view>
        <view class="modal-btns">
          <view class="modal-btn cancel" @tap="showAddForm = false">取消</view>
          <view class="modal-btn confirm" @tap="submitRecord">提交</view>
        </view>
      </view>
    </view>

    <BottomTabBar current="/pages-care/tasks/index" />
  </view>
</template>

<script>
import { useSettingsStore } from '../../store/settings'
import { getCareRecordList, addCareRecord, deleteCareRecord } from '../../api/care'
import NavBar       from '../../components/NavBar.vue'
import BottomTabBar from '../../components/BottomTabBar.vue'

export default {
  name: 'CareRecordsPage',
  components: { NavBar, BottomTabBar },
  setup() { return { settingsStore: useSettingsStore() } },
  data() {
    return {
      records: [], loading: false, showAddForm: false,
      newRecord: { elderlyName: '', careItems: '', remark: '' }
    }
  },
  onLoad() { this.loadData() },
  methods: {
    async loadData() {
      this.loading = true
      try {
        const res = await getCareRecordList({ pageSize: 50 })
        this.records = res.rows || res.data || []
      } finally { this.loading = false }
    },
    async submitRecord() {
      if (!this.newRecord.elderlyName.trim()) {
        return uni.showToast({ title: '请填写老人姓名', icon: 'none' })
      }
      const data = {
        ...this.newRecord,
        careItems: this.newRecord.careItems.split(/[,，、]/).map(s => s.trim()).filter(Boolean)
      }
      await addCareRecord(data).catch(() => {})
      uni.showToast({ title: '记录已提交', icon: 'success' })
      this.showAddForm = false
      this.newRecord = { elderlyName: '', careItems: '', remark: '' }
      this.loadData()
    },

    confirmDelete(rec) {
      uni.showModal({
        title: '删除确认',
        content: `确认删除 ${rec.elderlyName} 的这条护理记录？`,
        success: async ({ confirm }) => {
          if (!confirm) return
          await deleteCareRecord(rec.recordId).catch(() => {})
          this.records = this.records.filter(r => r.recordId !== rec.recordId)
          uni.showToast({ title: '已删除', icon: 'success' })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.page-container { min-height: 100vh; background: var(--bg-page); padding-bottom: 130rpx; }

.add-bar { padding: 20rpx 24rpx; }
.add-btn {
  display: flex; align-items: center; justify-content: center; gap: 10rpx;
  background: var(--primary-color); color: #fff; border-radius: 16rpx; padding: 24rpx 0;
  font-size: var(--font-md, 28rpx); font-weight: 600;
  .iconfont { font-size: 32rpx; }
}

.loading-wrap, .empty-wrap {
  display: flex; flex-direction: column; align-items: center;
  padding: 100rpx 0; gap: 20rpx; color: var(--text-secondary);
  .iconfont, .empty-icon { font-size: 80rpx; }
  .empty-text { font-size: var(--font-sm, 24rpx); }
}

.card { background: var(--bg-card); border-radius: 16rpx; box-shadow: var(--shadow); margin: 0 24rpx 20rpx; padding: 24rpx; }

.record-header {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 12rpx;
  .rec-elder { display: flex; align-items: center; gap: 8rpx; .iconfont { font-size: 30rpx; color: var(--primary-color); } }
  .elder-name { font-size: var(--font-md, 28rpx); font-weight: 600; color: var(--text-primary); }
  .rec-time { font-size: var(--font-xs, 20rpx); color: var(--text-secondary); }
}

.care-tags { display: flex; flex-wrap: wrap; gap: 10rpx; margin-bottom: 12rpx; }
.care-tag {
  padding: 6rpx 18rpx; background: var(--primary-light); color: var(--primary-color);
  border-radius: 20rpx; font-size: var(--font-xs, 20rpx);
}

.rec-remark { font-size: var(--font-sm, 24rpx); color: var(--text-regular); margin-bottom: 8rpx; display: block; }
.rec-nurse  { font-size: var(--font-xs, 20rpx); color: var(--text-secondary); display: block; }

.record-header {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 12rpx;
  .rec-elder { display: flex; align-items: center; gap: 8rpx; .iconfont { font-size: 30rpx; color: var(--primary-color); } }
  .elder-name { font-size: var(--font-md, 28rpx); font-weight: 600; color: var(--text-primary); }
  .rec-actions { display: flex; align-items: center; gap: 12rpx; }
  .rec-time { font-size: var(--font-xs, 20rpx); color: var(--text-secondary); }
  .delete-btn {
    width: 48rpx; height: 48rpx; border-radius: 50%;
    background: #fef0f0; display: flex; align-items: center; justify-content: center;
    .iconfont { font-size: 26rpx; color: #f56c6c; }
  }
}
.modal-card {
  width: 100%; background: var(--bg-card); border-radius: 32rpx 32rpx 0 0;
  padding: 40rpx 32rpx; padding-bottom: calc(40rpx + env(safe-area-inset-bottom));
}
.modal-title {
  display: flex; align-items: center; gap: 12rpx; font-size: var(--font-lg, 32rpx);
  font-weight: 600; color: var(--text-primary); margin-bottom: 32rpx;
  .iconfont { font-size: 36rpx; color: var(--primary-color); }
}
.form-item { margin-bottom: 24rpx; }
.form-label { font-size: var(--font-sm, 24rpx); color: var(--text-regular); display: block; margin-bottom: 10rpx; }
.form-input, .form-textarea {
  width: 100%; background: var(--bg-page); border-radius: 12rpx;
  padding: 16rpx 20rpx; font-size: var(--font-sm, 24rpx); color: var(--text-primary);
  border: 1rpx solid var(--border-color);
}
.form-textarea { height: 120rpx; }
.modal-btns { display: flex; gap: 24rpx; margin-top: 8rpx; }
.modal-btn {
  flex: 1; height: 88rpx; border-radius: 44rpx; display: flex;
  align-items: center; justify-content: center; font-size: var(--font-md, 28rpx); font-weight: 600;
  &.cancel  { background: var(--bg-page); color: var(--text-regular); border: 1rpx solid var(--border-color); }
  &.confirm { background: var(--primary-color); color: #fff; }
}
</style>
