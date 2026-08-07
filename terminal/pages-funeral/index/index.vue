<template>
  <view :class="['page-container', settingsStore.pageClass()]">
    <NavBar title="白事管理" :show-back="true">
      <template #right>
        <view class="nav-action" @tap="goToStorage">
          <text class="iconfont icon-location"></text>
        </view>
      </template>
    </NavBar>

    <view class="storage-strip" @tap="goToStorage">
      <text class="iconfont icon-location storage-icon"></text>
      <view class="storage-copy">
        <text class="storage-label">证明材料保存位置</text>
        <text class="storage-path">{{ storagePath }}</text>
      </view>
      <text class="iconfont icon-arrow-right strip-arrow"></text>
    </view>

    <view class="stats-row">
      <view class="stat-item">
        <text class="stat-number">{{ records.length }}</text>
        <text class="stat-label">全部档案</text>
      </view>
      <view class="stat-item">
        <text class="stat-number processing">{{ processingCount }}</text>
        <text class="stat-label">办理中</text>
      </view>
      <view class="stat-item">
        <text class="stat-number completed">{{ completedCount }}</text>
        <text class="stat-label">已办结</text>
      </view>
    </view>

    <view class="toolbar">
      <view class="filters">
        <view
          v-for="item in filters"
          :key="item.value"
          class="filter-item"
          :class="{ active: filter === item.value }"
          @tap="filter = item.value"
        >{{ item.label }}</view>
      </view>
      <view class="new-btn" @tap="openCreate">
        <text class="iconfont icon-add"></text>
        <text>新建档案</text>
      </view>
    </view>

    <view v-if="filteredRecords.length === 0" class="empty-state">
      <text class="iconfont icon-checklist empty-icon"></text>
      <text class="empty-title">暂无白事档案</text>
      <text class="empty-subtitle">新建档案后可按流程归档证明材料</text>
    </view>

    <view v-else class="case-list">
      <view v-for="record in filteredRecords" :key="record.id" class="case-card" @tap="openDetail(record)">
        <view class="case-head">
          <view>
            <text class="case-name">{{ record.deceasedName }}</text>
            <text class="case-no">{{ record.caseNo }}</text>
          </view>
          <text class="status-tag" :class="record.status">{{ record.status === 'completed' ? '已办结' : '办理中' }}</text>
        </view>
        <view class="case-info">
          <text>离世日期：{{ record.deathDate || '未填写' }}</text>
          <text>房间/床位：{{ record.roomNo || '未填写' }}</text>
          <text>经办家属：{{ record.familyContact || '未填写' }}</text>
          <text>证明材料：{{ record.proofs?.length || 0 }} 份</text>
        </view>
        <view class="progress-head">
          <text>办理进度</text>
          <text>{{ progressOf(record) }}%</text>
        </view>
        <view class="progress-track"><view class="progress-value" :style="{ width: progressOf(record) + '%' }"></view></view>
      </view>
    </view>

    <view v-if="showCreate" class="modal-mask" @tap.self="showCreate = false">
      <view class="modal-panel">
        <view class="modal-head">
          <text class="modal-title">新建白事档案</text>
          <view class="close-btn" @tap="showCreate = false"><text class="iconfont icon-close"></text></view>
        </view>
        <scroll-view scroll-y class="form-scroll">
          <view class="form-grid">
            <view class="form-field full">
              <text class="field-label required">逝者姓名</text>
              <input v-model="form.deceasedName" class="field-input" placeholder="请输入姓名" />
            </view>
            <view class="form-field">
              <text class="field-label required">离世日期</text>
              <picker mode="date" :value="form.deathDate" @change="form.deathDate = $event.detail.value">
                <view class="field-picker">{{ form.deathDate || '请选择' }}</view>
              </picker>
            </view>
            <view class="form-field">
              <text class="field-label">离世时间</text>
              <picker mode="time" :value="form.deathTime" @change="form.deathTime = $event.detail.value">
                <view class="field-picker">{{ form.deathTime || '请选择' }}</view>
              </picker>
            </view>
            <view class="form-field">
              <text class="field-label">房间/床位</text>
              <input v-model="form.roomNo" class="field-input" placeholder="如 302-A" />
            </view>
            <view class="form-field">
              <text class="field-label">机构负责人</text>
              <input v-model="form.responsible" class="field-input" placeholder="经办人员" />
            </view>
            <view class="form-field">
              <text class="field-label">经办家属</text>
              <input v-model="form.familyContact" class="field-input" placeholder="家属姓名" />
            </view>
            <view class="form-field">
              <text class="field-label">家属电话</text>
              <input v-model="form.familyPhone" type="number" class="field-input" placeholder="联系电话" />
            </view>
          </view>

          <view class="folk-toggle">
            <view>
              <text class="folk-title">家属自愿提供民俗信息</text>
              <text class="folk-note">非办事必填，不自动推算命格</text>
            </view>
            <switch :checked="form.folkCustomEnabled" color="#52606d" @change="form.folkCustomEnabled = $event.detail.value" />
          </view>

          <view v-if="form.folkCustomEnabled" class="folk-fields">
            <view class="form-grid">
              <view class="form-field">
                <text class="field-label">出生日期</text>
                <picker mode="date" :value="form.birthDate" @change="form.birthDate = $event.detail.value">
                  <view class="field-picker">{{ form.birthDate || '请选择' }}</view>
                </picker>
              </view>
              <view class="form-field">
                <text class="field-label">出生时辰</text>
                <picker mode="time" :value="form.birthTime" @change="form.birthTime = $event.detail.value">
                  <view class="field-picker">{{ form.birthTime || '请选择' }}</view>
                </picker>
              </view>
              <view class="form-field full">
                <text class="field-label">农历生辰</text>
                <input v-model="form.lunarBirth" class="field-input" placeholder="按家属提供内容填写" />
              </view>
              <view class="form-field full">
                <text class="field-label">生辰八字</text>
                <input v-model="form.eightCharacters" class="field-input" placeholder="按家属提供内容填写，不由系统推算" />
              </view>
              <view class="form-field full">
                <text class="field-label">民俗备注</text>
                <textarea v-model="form.folkCustomNotes" class="field-textarea" placeholder="命格、忌宜或当地习俗等家属提供的信息"></textarea>
              </view>
            </view>
          </view>

          <view class="form-field remark-field">
            <text class="field-label">其他备注</text>
            <textarea v-model="form.remark" class="field-textarea" placeholder="特殊情况或交代事项"></textarea>
          </view>
        </scroll-view>
        <view class="modal-actions">
          <view class="modal-button secondary" @tap="showCreate = false">取消</view>
          <view class="modal-button primary" @tap="createRecord">建立档案</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { useSettingsStore } from '../../store/settings'
import { createFuneralCase, funeralProgress, getFuneralCases, saveFuneralCase } from '../../utils/funeral'
import { getConfiguredStoragePath, getFuneralStorageConfig } from '../../utils/funeral-storage'
import NavBar from '../../components/NavBar.vue'

function emptyForm() {
  const now = new Date()
  return {
    deceasedName: '',
    deathDate: now.toISOString().slice(0, 10),
    deathTime: '',
    roomNo: '',
    responsible: '',
    familyContact: '',
    familyPhone: '',
    remark: '',
    folkCustomEnabled: false,
    birthDate: '',
    birthTime: '',
    lunarBirth: '',
    eightCharacters: '',
    folkCustomNotes: ''
  }
}

export default {
  name: 'FuneralIndexPage',
  components: { NavBar },
  setup() { return { settingsStore: useSettingsStore() } },
  data() {
    return {
      records: [],
      filter: 'all',
      showCreate: false,
      form: emptyForm(),
      storageConfig: getFuneralStorageConfig(),
      filters: [
        { value: 'all', label: '全部' },
        { value: 'processing', label: '办理中' },
        { value: 'completed', label: '已办结' }
      ]
    }
  },
  computed: {
    processingCount() { return this.records.filter((item) => item.status !== 'completed').length },
    completedCount() { return this.records.filter((item) => item.status === 'completed').length },
    filteredRecords() {
      return this.filter === 'all' ? this.records : this.records.filter((item) => item.status === this.filter)
    },
    storagePath() {
      return this.storageConfig.resolvedPath || getConfiguredStoragePath(this.storageConfig)
    }
  },
  onShow() {
    this.records = getFuneralCases()
    this.storageConfig = getFuneralStorageConfig()
  },
  methods: {
    progressOf: funeralProgress,
    goToStorage() { uni.navigateTo({ url: '/pages-funeral/storage/index' }) },
    openCreate() {
      this.form = emptyForm()
      this.showCreate = true
    },
    createRecord() {
      if (!this.form.deceasedName.trim()) return uni.showToast({ title: '请填写逝者姓名', icon: 'none' })
      if (!this.form.deathDate) return uni.showToast({ title: '请选择离世日期', icon: 'none' })
      const record = saveFuneralCase(createFuneralCase(this.form))
      this.records = getFuneralCases()
      this.showCreate = false
      uni.navigateTo({ url: `/pages-funeral/detail/index?id=${record.id}` })
    },
    openDetail(record) {
      uni.navigateTo({ url: `/pages-funeral/detail/index?id=${record.id}` })
    }
  }
}
</script>

<style scoped lang="scss">
.page-container { min-height: 100vh; background: var(--bg-page); padding-bottom: 48rpx; }
.nav-action { width: 72rpx; height: 72rpx; display: flex; align-items: center; justify-content: center; color: #fff; .iconfont { font-size: 38rpx; } }
.storage-strip { margin: 18rpx 24rpx; padding: 20rpx 24rpx; display: flex; align-items: center; background: #eef2f5; border-left: 6rpx solid #52606d; border-radius: 8rpx; }
.storage-icon { color: #52606d; font-size: 40rpx; margin-right: 16rpx; }
.storage-copy { flex: 1; min-width: 0; }
.storage-label { display: block; color: #34404b; font-size: var(--font-sm, 24rpx); font-weight: 600; }
.storage-path { display: block; color: #687683; font-size: var(--font-xs, 20rpx); margin-top: 4rpx; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.strip-arrow { color: #7b8792; font-size: 26rpx; }
.stats-row { display: flex; margin: 0 24rpx 20rpx; background: var(--bg-card); box-shadow: var(--shadow); border-radius: 8rpx; }
.stat-item { flex: 1; padding: 24rpx 8rpx; text-align: center; border-right: 1rpx solid var(--divider-color); &:last-child { border-right: 0; } }
.stat-number { display: block; color: var(--text-primary); font-size: var(--font-xl, 36rpx); font-weight: 700; &.processing { color: #c78119; } &.completed { color: #27855c; } }
.stat-label { display: block; color: var(--text-secondary); font-size: var(--font-xs, 20rpx); margin-top: 4rpx; }
.toolbar { display: flex; align-items: center; padding: 0 24rpx 18rpx; gap: 16rpx; }
.filters { display: flex; flex: 1; gap: 8rpx; }
.filter-item { padding: 12rpx 22rpx; font-size: var(--font-xs, 20rpx); color: var(--text-secondary); border-bottom: 4rpx solid transparent; &.active { color: #34404b; border-color: #52606d; font-weight: 600; } }
.new-btn { display: flex; align-items: center; gap: 6rpx; background: #52606d; color: #fff; padding: 14rpx 20rpx; border-radius: 8rpx; font-size: var(--font-xs, 20rpx); .iconfont { font-size: 26rpx; } }
.case-list { padding: 0 24rpx; }
.case-card { background: var(--bg-card); box-shadow: var(--shadow); border-radius: 8rpx; padding: 24rpx; margin-bottom: 18rpx; }
.case-head { display: flex; align-items: flex-start; justify-content: space-between; padding-bottom: 18rpx; border-bottom: 1rpx solid var(--divider-color); }
.case-name { display: block; color: var(--text-primary); font-size: var(--font-lg, 32rpx); font-weight: 700; }
.case-no { display: block; color: var(--text-secondary); font-size: var(--font-xs, 20rpx); margin-top: 4rpx; }
.status-tag { padding: 7rpx 16rpx; border-radius: 6rpx; font-size: var(--font-xs, 20rpx); background: #fff5e8; color: #a9670c; &.completed { background: #e9f6ef; color: #23744f; } }
.case-info { display: grid; grid-template-columns: 1fr 1fr; gap: 12rpx 20rpx; padding: 18rpx 0; color: var(--text-regular); font-size: var(--font-xs, 20rpx); }
.progress-head { display: flex; justify-content: space-between; color: var(--text-secondary); font-size: var(--font-xs, 20rpx); margin-bottom: 8rpx; }
.progress-track { height: 10rpx; background: var(--divider-color); border-radius: 5rpx; overflow: hidden; }
.progress-value { height: 100%; background: #52606d; transition: width .2s; }
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 100rpx 24rpx; }
.empty-icon { color: #9aa5af; font-size: 92rpx; }
.empty-title { color: var(--text-primary); font-size: var(--font-md, 28rpx); font-weight: 600; margin-top: 20rpx; }
.empty-subtitle { color: var(--text-secondary); font-size: var(--font-xs, 20rpx); margin-top: 8rpx; }
.modal-mask { position: fixed; inset: 0; z-index: 2000; background: rgba(22, 29, 37, .56); display: flex; align-items: flex-end; }
.modal-panel { width: 100%; max-height: 90vh; background: var(--bg-card); border-radius: 16rpx 16rpx 0 0; padding-bottom: env(safe-area-inset-bottom); }
.modal-head { height: 96rpx; padding: 0 28rpx; display: flex; align-items: center; justify-content: space-between; border-bottom: 1rpx solid var(--divider-color); }
.modal-title { color: var(--text-primary); font-size: var(--font-lg, 32rpx); font-weight: 700; }
.close-btn { width: 64rpx; height: 64rpx; display: flex; align-items: center; justify-content: center; color: var(--text-secondary); }
.form-scroll { max-height: calc(90vh - 196rpx); }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20rpx; padding: 26rpx 28rpx; }
.form-field { min-width: 0; &.full { grid-column: 1 / -1; } }
.field-label { display: block; color: var(--text-regular); font-size: var(--font-xs, 20rpx); margin-bottom: 8rpx; &.required::after { content: ' *'; color: #d44f4f; } }
.field-input, .field-picker { height: 76rpx; background: var(--bg-page); border: 1rpx solid var(--border-color); border-radius: 8rpx; padding: 0 18rpx; color: var(--text-primary); font-size: var(--font-sm, 24rpx); }
.field-picker { display: flex; align-items: center; }
.field-textarea { width: 100%; height: 112rpx; background: var(--bg-page); border: 1rpx solid var(--border-color); border-radius: 8rpx; padding: 16rpx 18rpx; color: var(--text-primary); font-size: var(--font-sm, 24rpx); }
.folk-toggle { margin: 0 28rpx; padding: 22rpx; display: flex; align-items: center; justify-content: space-between; background: #eef2f5; border-radius: 8rpx; }
.folk-title { display: block; color: #34404b; font-size: var(--font-sm, 24rpx); font-weight: 600; }
.folk-note { display: block; color: #687683; font-size: var(--font-xs, 20rpx); margin-top: 4rpx; }
.folk-fields { margin-top: 4rpx; }
.remark-field { margin: 0 28rpx 28rpx; }
.modal-actions { height: 100rpx; padding: 12rpx 28rpx; display: flex; gap: 16rpx; border-top: 1rpx solid var(--divider-color); }
.modal-button { flex: 1; display: flex; align-items: center; justify-content: center; border-radius: 8rpx; font-size: var(--font-md, 28rpx); font-weight: 600; &.secondary { color: var(--text-regular); background: var(--bg-page); border: 1rpx solid var(--border-color); } &.primary { color: #fff; background: #52606d; } }
</style>
