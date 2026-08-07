<template>
  <view :class="['page-container', settingsStore.pageClass()]">
    <NavBar title="白事档案详情" :show-back="true">
      <template #right>
        <view class="nav-action" @tap="goToStorage"><text class="iconfont icon-location"></text></view>
      </template>
    </NavBar>

    <template v-if="record">
      <view class="case-summary">
        <view class="summary-head">
          <view>
            <text class="person-name">{{ record.deceasedName }}</text>
            <text class="case-no">{{ record.caseNo }}</text>
          </view>
          <text class="status-tag" :class="record.status">{{ record.status === 'completed' ? '已办结' : '办理中' }}</text>
        </view>
        <view class="summary-grid">
          <text>离世：{{ record.deathDate }} {{ record.deathTime }}</text>
          <text>房间/床位：{{ record.roomNo || '未填写' }}</text>
          <text>经办家属：{{ record.familyContact || '未填写' }}</text>
          <text>联系电话：{{ record.familyPhone || '未填写' }}</text>
        </view>
        <view class="progress-head"><text>流程进度</text><text>{{ progress }}%</text></view>
        <view class="progress-track"><view class="progress-value" :style="{ width: progress + '%' }"></view></view>
      </view>

      <view class="info-section">
        <view class="section-heading">
          <view>
            <text class="section-title">民俗信息</text>
            <text class="section-subtitle">家属自愿提供，非办事必填</text>
          </view>
          <view class="text-action" @tap="openFolkEditor"><text class="iconfont icon-edit"></text><text>编辑</text></view>
        </view>
        <view v-if="record.folkCustomEnabled && record.folkCustom" class="folk-grid">
          <view><text class="info-label">出生日期/时辰</text><text class="info-value">{{ joinedBirth }}</text></view>
          <view><text class="info-label">农历生辰</text><text class="info-value">{{ record.folkCustom.lunarBirth || '未填写' }}</text></view>
          <view><text class="info-label">生辰八字</text><text class="info-value">{{ record.folkCustom.eightCharacters || '未填写' }}</text></view>
          <view><text class="info-label">民俗备注</text><text class="info-value">{{ record.folkCustom.notes || '未填写' }}</text></view>
        </view>
        <text v-else class="empty-inline">未采集民俗信息</text>
      </view>

      <view class="section-heading page-heading">
        <view>
          <text class="section-title">办理流程</text>
          <text class="section-subtitle">关键步骤完成前需上传标为必需的证明</text>
        </view>
      </view>
      <view class="step-list">
        <view v-for="(step, index) in record.steps" :key="step.id" class="step-row" :class="{ done: step.completed }">
          <view class="step-index" @tap="toggleStep(step)">
            <text v-if="step.completed" class="iconfont icon-check"></text>
            <text v-else>{{ index + 1 }}</text>
          </view>
          <view class="step-content">
            <text class="step-title">{{ step.title }}</text>
            <text class="step-description">{{ step.description }}</text>
            <text v-if="step.completedAt" class="step-time">完成于 {{ formatDateTime(step.completedAt) }}</text>
          </view>
          <view class="step-action" @tap="toggleStep(step)">{{ step.completed ? '撤销' : '完成' }}</view>
        </view>
      </view>

      <view class="section-heading page-heading material-heading">
        <view>
          <text class="section-title">相关证明</text>
          <text class="section-subtitle">拍照或选图后自动压缩至 {{ storageConfig.quality }}% 质量</text>
        </view>
      </view>

      <view class="storage-location" @tap="goToStorage">
        <text class="iconfont icon-location"></text>
        <view>
          <text class="location-label">当前保存目录</text>
          <text class="location-path">{{ storageBasePath }}/{{ caseFolder }}</text>
        </view>
        <text class="iconfont icon-arrow-right arrow"></text>
      </view>

      <view class="proof-list">
        <view v-for="group in proofGroups" :key="group.id" class="proof-group">
          <view class="proof-head">
            <view>
              <text class="proof-title">{{ group.label }}</text>
              <text v-if="group.required" class="required-tag">必需</text>
            </view>
            <view class="add-proof" @tap="addProof(group)">
              <text class="iconfont icon-add"></text><text>添加图片</text>
            </view>
          </view>
          <view v-if="group.files.length" class="proof-files">
            <view v-for="file in group.files" :key="file.id" class="proof-file">
              <image class="proof-image" :src="file.filePath" mode="aspectFill" @tap="previewProof(file)"></image>
              <view class="file-body">
                <text class="file-name">{{ file.name }}</text>
                <text class="file-size">{{ formatSize(file.originalSize) }} → {{ formatSize(file.compressedSize) }}</text>
                <text class="file-path" @tap="copyPath(file.storagePath)">{{ file.storagePath }}</text>
              </view>
              <view class="delete-file" @tap="removeProof(file)"><text class="iconfont icon-delete"></text></view>
            </view>
          </view>
          <text v-else class="no-proof">尚未上传</text>
        </view>
      </view>

      <view v-if="record.remark" class="remark-section">
        <text class="section-title">档案备注</text>
        <text class="remark-text">{{ record.remark }}</text>
      </view>
    </template>

    <view v-else class="not-found">档案不存在或已被移除</view>

    <view v-if="showFolkEditor && record" class="modal-mask" @tap.self="showFolkEditor = false">
      <view class="modal-panel">
        <view class="modal-head">
          <text class="modal-title">民俗信息</text>
          <view class="close-btn" @tap="showFolkEditor = false"><text class="iconfont icon-close"></text></view>
        </view>
        <scroll-view scroll-y class="editor-scroll">
          <view class="folk-toggle">
            <view>
              <text class="folk-title">家属自愿提供</text>
              <text class="folk-note">关闭后将清除已填写的民俗信息</text>
            </view>
            <switch :checked="folkForm.enabled" color="#52606d" @change="folkForm.enabled = $event.detail.value" />
          </view>
          <view v-if="folkForm.enabled" class="form-grid">
            <view class="form-field">
              <text class="field-label">出生日期</text>
              <picker mode="date" :value="folkForm.birthDate" @change="folkForm.birthDate = $event.detail.value">
                <view class="field-picker">{{ folkForm.birthDate || '请选择' }}</view>
              </picker>
            </view>
            <view class="form-field">
              <text class="field-label">出生时辰</text>
              <picker mode="time" :value="folkForm.birthTime" @change="folkForm.birthTime = $event.detail.value">
                <view class="field-picker">{{ folkForm.birthTime || '请选择' }}</view>
              </picker>
            </view>
            <view class="form-field full"><text class="field-label">农历生辰</text><input v-model="folkForm.lunarBirth" class="field-input" placeholder="按家属提供内容填写" /></view>
            <view class="form-field full"><text class="field-label">生辰八字</text><input v-model="folkForm.eightCharacters" class="field-input" placeholder="不由系统推算" /></view>
            <view class="form-field full"><text class="field-label">民俗备注</text><textarea v-model="folkForm.notes" class="field-textarea" placeholder="命格、忌宜或当地习俗等家属提供的信息"></textarea></view>
          </view>
        </scroll-view>
        <view class="modal-actions">
          <view class="modal-button secondary" @tap="showFolkEditor = false">取消</view>
          <view class="modal-button primary" @tap="saveFolkInfo">保存</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { useSettingsStore } from '../../store/settings'
import {
  FUNERAL_PROOF_TYPES,
  funeralProgress,
  getFuneralCase,
  saveFuneralCase,
  setFuneralStep
} from '../../utils/funeral'
import {
  deleteFuneralProofImage,
  getConfiguredStoragePath,
  getFuneralStorageConfig,
  sanitizeFileSegment,
  saveFuneralProofImage
} from '../../utils/funeral-storage'
import NavBar from '../../components/NavBar.vue'

export default {
  name: 'FuneralDetailPage',
  components: { NavBar },
  setup() { return { settingsStore: useSettingsStore() } },
  data() {
    return {
      recordId: '',
      record: null,
      storageConfig: getFuneralStorageConfig(),
      showFolkEditor: false,
      folkForm: { enabled: false, birthDate: '', birthTime: '', lunarBirth: '', eightCharacters: '', notes: '' }
    }
  },
  computed: {
    progress() { return funeralProgress(this.record) },
    caseFolder() { return sanitizeFileSegment(`${this.record?.caseNo || ''}_${this.record?.deceasedName || ''}`) },
    storageBasePath() { return this.storageConfig.resolvedPath || getConfiguredStoragePath(this.storageConfig) },
    joinedBirth() {
      const folk = this.record?.folkCustom || {}
      return [folk.birthDate, folk.birthTime].filter(Boolean).join(' ') || '未填写'
    },
    proofGroups() {
      const files = this.record?.proofs || []
      return FUNERAL_PROOF_TYPES.map((type) => ({ ...type, files: files.filter((file) => file.typeId === type.id) }))
    }
  },
  onLoad(options) {
    this.recordId = options.id || ''
  },
  onShow() {
    this.loadRecord()
    this.storageConfig = getFuneralStorageConfig()
  },
  methods: {
    loadRecord() { this.record = getFuneralCase(this.recordId) },
    persist() { this.record = saveFuneralCase(this.record) },
    goToStorage() { uni.navigateTo({ url: '/pages-funeral/storage/index' }) },
    formatDateTime(value) { return value ? String(value).replace('T', ' ').slice(0, 16) : '' },
    formatSize(value) {
      const size = Number(value) || 0
      if (!size) return '未知大小'
      return size >= 1024 * 1024 ? `${(size / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(size / 1024))} KB`
    },
    toggleStep(step) {
      if (!step.completed) {
        const missing = FUNERAL_PROOF_TYPES.filter((type) => type.stepId === step.id && type.required)
          .filter((type) => !(this.record.proofs || []).some((file) => file.typeId === type.id))
        if (missing.length) {
          return uni.showModal({
            title: '证明材料未齐',
            content: `请先上传：${missing.map((item) => item.label).join('、')}`,
            showCancel: false
          })
        }
      }
      uni.showModal({
        title: step.completed ? '撤销完成状态' : '确认步骤完成',
        content: step.completed ? `确认将“${step.title}”恢复为待办理？` : `确认“${step.title}”已完成？`,
        success: ({ confirm }) => {
          if (!confirm) return
          this.record = setFuneralStep(this.record, step.id, !step.completed)
          this.persist()
        }
      })
    },
    async addProof(type) {
      try {
        const selected = await new Promise((resolve, reject) => {
          uni.chooseImage({ count: 9, sizeType: ['original'], sourceType: ['camera', 'album'], success: resolve, fail: reject })
        })
        const files = selected.tempFiles?.length
          ? selected.tempFiles
          : (selected.tempFilePaths || []).map((path) => ({ path, size: 0 }))
        if (!files.length) return

        uni.showLoading({ title: '压缩并保存中', mask: true })
        let savedCount = 0
        for (const source of files) {
          try {
            const result = await saveFuneralProofImage(source.path || source.tempFilePath, this.caseFolder, source.size, this.storageConfig)
            this.record.proofs.push({
              id: `proof-${Date.now()}-${savedCount}`,
              typeId: type.id,
              name: `${type.label}-${(this.record.proofs || []).filter((item) => item.typeId === type.id).length + 1}`,
              filePath: result.localPath,
              storagePath: result.absolutePath,
              originalSize: result.originalSize,
              compressedSize: result.compressedSize,
              quality: result.quality,
              persistent: result.persistent,
              createdAt: new Date().toISOString()
            })
            savedCount += 1
          } catch (_) {}
        }
        if (savedCount) this.persist()
        uni.hideLoading()
        uni.showToast({ title: savedCount === files.length ? `已保存 ${savedCount} 张` : `已保存 ${savedCount}/${files.length} 张`, icon: savedCount ? 'success' : 'none' })
      } catch (_) {
        uni.hideLoading()
      }
    },
    previewProof(file) {
      const urls = (this.record.proofs || []).map((item) => item.filePath)
      uni.previewImage({ current: file.filePath, urls })
    },
    removeProof(file) {
      uni.showModal({
        title: '删除证明图片',
        content: '图片文件和档案记录将同时删除，是否继续？',
        confirmColor: '#c64545',
        success: async ({ confirm }) => {
          if (!confirm) return
          await deleteFuneralProofImage(file.filePath)
          this.record.proofs = this.record.proofs.filter((item) => item.id !== file.id)
          this.persist()
          uni.showToast({ title: '已删除', icon: 'success' })
        }
      })
    },
    copyPath(path) {
      uni.setClipboardData({ data: path, success: () => uni.showToast({ title: '路径已复制', icon: 'success' }) })
    },
    openFolkEditor() {
      const folk = this.record.folkCustom || {}
      this.folkForm = {
        enabled: Boolean(this.record.folkCustomEnabled),
        birthDate: folk.birthDate || '',
        birthTime: folk.birthTime || '',
        lunarBirth: folk.lunarBirth || '',
        eightCharacters: folk.eightCharacters || '',
        notes: folk.notes || ''
      }
      this.showFolkEditor = true
    },
    saveFolkInfo() {
      this.record.folkCustomEnabled = this.folkForm.enabled
      this.record.folkCustom = this.folkForm.enabled ? {
        birthDate: this.folkForm.birthDate.trim(),
        birthTime: this.folkForm.birthTime.trim(),
        lunarBirth: this.folkForm.lunarBirth.trim(),
        eightCharacters: this.folkForm.eightCharacters.trim(),
        notes: this.folkForm.notes.trim()
      } : null
      this.persist()
      this.showFolkEditor = false
      uni.showToast({ title: '已保存', icon: 'success' })
    }
  }
}
</script>

<style scoped lang="scss">
.page-container { min-height: 100vh; background: var(--bg-page); padding-bottom: 48rpx; }
.nav-action { width: 72rpx; height: 72rpx; display: flex; align-items: center; justify-content: center; color: #fff; .iconfont { font-size: 38rpx; } }
.case-summary { margin: 18rpx 24rpx; padding: 26rpx; border-radius: 8rpx; background: #34404b; color: #fff; }
.summary-head { display: flex; justify-content: space-between; align-items: flex-start; }
.person-name { display: block; font-size: var(--font-xl, 36rpx); font-weight: 700; color: #fff; }
.case-no { display: block; font-size: var(--font-xs, 20rpx); color: #c8d0d7; margin-top: 4rpx; }
.status-tag { padding: 8rpx 16rpx; border-radius: 6rpx; font-size: var(--font-xs, 20rpx); color: #ffe1b6; background: rgba(213, 145, 46, .22); &.completed { color: #c2f0d6; background: rgba(56, 151, 103, .24); } }
.summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10rpx 20rpx; margin: 24rpx 0; font-size: var(--font-xs, 20rpx); color: #dce1e5; }
.progress-head { display: flex; justify-content: space-between; font-size: var(--font-xs, 20rpx); color: #dce1e5; margin-bottom: 8rpx; }
.progress-track { height: 10rpx; border-radius: 5rpx; background: rgba(255,255,255,.2); overflow: hidden; }
.progress-value { height: 100%; background: #f0c36a; }
.info-section, .remark-section { margin: 0 24rpx 22rpx; padding: 24rpx; background: var(--bg-card); border-radius: 8rpx; box-shadow: var(--shadow); }
.section-heading { display: flex; align-items: center; justify-content: space-between; }
.page-heading { padding: 8rpx 28rpx 14rpx; }
.section-title { display: block; color: var(--text-primary); font-size: var(--font-md, 28rpx); font-weight: 700; }
.section-subtitle { display: block; color: var(--text-secondary); font-size: var(--font-xs, 20rpx); margin-top: 4rpx; }
.text-action, .add-proof { display: flex; align-items: center; gap: 6rpx; color: #52606d; font-size: var(--font-xs, 20rpx); .iconfont { font-size: 26rpx; } }
.folk-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20rpx; margin-top: 22rpx; }
.info-label { display: block; color: var(--text-secondary); font-size: var(--font-xs, 20rpx); }
.info-value { display: block; color: var(--text-primary); font-size: var(--font-sm, 24rpx); margin-top: 6rpx; word-break: break-all; }
.empty-inline, .no-proof { display: block; color: var(--text-secondary); font-size: var(--font-xs, 20rpx); margin-top: 20rpx; }
.step-list { margin: 0 24rpx 24rpx; background: var(--bg-card); border-radius: 8rpx; box-shadow: var(--shadow); padding: 4rpx 24rpx; }
.step-row { display: flex; align-items: flex-start; gap: 18rpx; padding: 24rpx 0; border-bottom: 1rpx solid var(--divider-color); &:last-child { border-bottom: 0; } &.done .step-title { color: #27855c; } }
.step-index { flex: 0 0 48rpx; width: 48rpx; height: 48rpx; border: 2rpx solid #97a3ad; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #64717c; font-size: 22rpx; .done & { color: #fff; background: #27855c; border-color: #27855c; } .iconfont { font-size: 24rpx; } }
.step-content { flex: 1; min-width: 0; }
.step-title { display: block; color: var(--text-primary); font-size: var(--font-sm, 24rpx); font-weight: 600; }
.step-description { display: block; color: var(--text-secondary); font-size: var(--font-xs, 20rpx); line-height: 1.55; margin-top: 6rpx; }
.step-time { display: block; color: #27855c; font-size: 18rpx; margin-top: 6rpx; }
.step-action { flex: 0 0 76rpx; text-align: right; color: #52606d; font-size: var(--font-xs, 20rpx); padding-top: 6rpx; }
.material-heading { padding-top: 2rpx; }
.storage-location { margin: 0 24rpx 16rpx; padding: 18rpx 22rpx; display: flex; align-items: center; gap: 14rpx; background: #eef2f5; border-radius: 8rpx; color: #52606d; > .iconfont { font-size: 34rpx; } > view { flex: 1; min-width: 0; } .arrow { font-size: 24rpx; } }
.location-label { display: block; color: #34404b; font-size: var(--font-xs, 20rpx); font-weight: 600; }
.location-path { display: block; color: #687683; font-size: 18rpx; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-top: 3rpx; }
.proof-list { margin: 0 24rpx; }
.proof-group { background: var(--bg-card); border-radius: 8rpx; box-shadow: var(--shadow); padding: 22rpx; margin-bottom: 16rpx; }
.proof-head { display: flex; align-items: center; justify-content: space-between; }
.proof-title { color: var(--text-primary); font-size: var(--font-sm, 24rpx); font-weight: 600; }
.required-tag { color: #b83b3b; background: #fcecec; border-radius: 4rpx; padding: 3rpx 8rpx; margin-left: 10rpx; font-size: 18rpx; }
.proof-files { margin-top: 16rpx; }
.proof-file { display: flex; align-items: center; gap: 14rpx; padding: 14rpx 0; border-top: 1rpx solid var(--divider-color); }
.proof-image { flex: 0 0 112rpx; width: 112rpx; height: 84rpx; border-radius: 6rpx; background: var(--bg-page); }
.file-body { flex: 1; min-width: 0; }
.file-name { display: block; color: var(--text-primary); font-size: var(--font-xs, 20rpx); font-weight: 600; }
.file-size { display: block; color: #27855c; font-size: 18rpx; margin-top: 3rpx; }
.file-path { display: block; color: var(--text-secondary); font-size: 17rpx; margin-top: 3rpx; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.delete-file { flex: 0 0 56rpx; width: 56rpx; height: 56rpx; display: flex; align-items: center; justify-content: center; color: #c64545; .iconfont { font-size: 30rpx; } }
.remark-text { display: block; color: var(--text-regular); font-size: var(--font-sm, 24rpx); line-height: 1.6; margin-top: 14rpx; }
.not-found { padding: 120rpx 24rpx; text-align: center; color: var(--text-secondary); font-size: var(--font-sm, 24rpx); }
.modal-mask { position: fixed; inset: 0; z-index: 2000; background: rgba(22, 29, 37, .56); display: flex; align-items: flex-end; }
.modal-panel { width: 100%; max-height: 82vh; background: var(--bg-card); border-radius: 16rpx 16rpx 0 0; padding-bottom: env(safe-area-inset-bottom); }
.modal-head { height: 96rpx; padding: 0 28rpx; display: flex; align-items: center; justify-content: space-between; border-bottom: 1rpx solid var(--divider-color); }
.modal-title { color: var(--text-primary); font-size: var(--font-lg, 32rpx); font-weight: 700; }
.close-btn { width: 64rpx; height: 64rpx; display: flex; align-items: center; justify-content: center; color: var(--text-secondary); }
.editor-scroll { max-height: calc(82vh - 196rpx); }
.folk-toggle { margin: 24rpx 28rpx 0; padding: 22rpx; display: flex; align-items: center; justify-content: space-between; background: #eef2f5; border-radius: 8rpx; }
.folk-title { display: block; color: #34404b; font-size: var(--font-sm, 24rpx); font-weight: 600; }
.folk-note { display: block; color: #687683; font-size: var(--font-xs, 20rpx); margin-top: 4rpx; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20rpx; padding: 24rpx 28rpx; }
.form-field { min-width: 0; &.full { grid-column: 1 / -1; } }
.field-label { display: block; color: var(--text-regular); font-size: var(--font-xs, 20rpx); margin-bottom: 8rpx; }
.field-input, .field-picker { height: 76rpx; background: var(--bg-page); border: 1rpx solid var(--border-color); border-radius: 8rpx; padding: 0 18rpx; color: var(--text-primary); font-size: var(--font-sm, 24rpx); }
.field-picker { display: flex; align-items: center; }
.field-textarea { width: 100%; height: 112rpx; background: var(--bg-page); border: 1rpx solid var(--border-color); border-radius: 8rpx; padding: 16rpx 18rpx; color: var(--text-primary); font-size: var(--font-sm, 24rpx); }
.modal-actions { height: 100rpx; padding: 12rpx 28rpx; display: flex; gap: 16rpx; border-top: 1rpx solid var(--divider-color); }
.modal-button { flex: 1; display: flex; align-items: center; justify-content: center; border-radius: 8rpx; font-size: var(--font-md, 28rpx); font-weight: 600; &.secondary { color: var(--text-regular); background: var(--bg-page); border: 1rpx solid var(--border-color); } &.primary { color: #fff; background: #52606d; } }
</style>
