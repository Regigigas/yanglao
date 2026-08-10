<template>
  <view :class="['page-container', settingsStore.pageClass()]">
    <NavBar title="新建采购申请" :show-back="true" />

    <view class="form-card card">
      <view class="form-item">
        <text class="form-label">采购日期</text>
        <picker mode="date" :value="form.orderDate" @change="e => form.orderDate = e.detail.value">
          <view class="picker-value">{{ form.orderDate || '请选择日期' }}</view>
        </picker>
      </view>

      <view class="form-item">
        <text class="form-label">备注说明</text>
        <textarea v-model="form.remark" class="form-textarea" placeholder="采购原因、用途说明..."></textarea>
      </view>

      <view class="section-divider">采购清单</view>

      <view v-for="(item, idx) in items" :key="idx" class="item-card">
        <view class="item-header">
          <text class="item-idx">物品 {{ idx + 1 }}</text>
          <view v-if="items.length > 1" class="remove-btn" @tap="items.splice(idx, 1)">
            <text class="iconfont icon-close"></text>
          </view>
        </view>
        <view class="item-row">
          <text class="item-label">物品名称</text>
          <input v-model="item.itemName" class="item-input" placeholder="如：护理垫" />
        </view>
        <view class="item-row">
          <text class="item-label">数量</text>
          <input v-model.number="item.quantity" type="digit" class="item-input" placeholder="数量" />
          <input v-model="item.unit" class="item-input short" placeholder="单位" />
        </view>
        <view class="item-row">
          <text class="item-label">备注</text>
          <input v-model="item.remark" class="item-input" placeholder="规格、说明（选填）" />
        </view>
      </view>

      <view class="add-item-btn" @tap="items.push({ itemName: '', quantity: 1, unit: '件', remark: '' })">
        <text class="iconfont icon-add"></text>
        <text>添加物品</text>
      </view>
    </view>

    <!-- 提交按钮 -->
    <view class="submit-bar">
      <view class="submit-btn draft" :class="{ disabled: submitting }" @tap="submitDraft">存为草稿</view>
      <view class="submit-btn confirm" :class="{ disabled: submitting }" @tap="submitApply">{{ submitting ? '提交中...' : '提交申请' }}</view>
    </view>
  </view>
</template>

<script>
import { useSettingsStore } from '../../store/settings'
import { createPurchaseRequest } from '../../api/purchase'
import { getFuneralCase, getFuneralPurchaseItems, saveFuneralCase, setFuneralLinkTask } from '../../utils/funeral'
import NavBar from '../../components/NavBar.vue'

export default {
  name: 'PurchaseApplyPage',
  components: { NavBar },
  setup() { return { settingsStore: useSettingsStore() } },

  data() {
    const today = new Date().toISOString().slice(0, 10)
    return {
      form: { orderDate: today, remark: '' },
      items: [{ itemName: '', quantity: 1, unit: '件', remark: '' }],
      funeralCaseId: '',
      submitting: false
    }
  },
  onLoad(options = {}) {
    if (options.source === 'funeral' && options.caseId) {
      this.applyFuneralTemplate(options.caseId)
    }
  },

  methods: {
    applyFuneralTemplate(caseId) {
      const record = getFuneralCase(caseId)
      if (!record) return
      this.funeralCaseId = record.id
      this.items = getFuneralPurchaseItems()
      this.form.remark = [
        `白事档案：${record.caseNo}`,
        `逝者：${record.deceasedName}`,
        record.roomNo ? `房间/床位：${record.roomNo}` : '',
        '请按家属意愿和实际库存调整采购清单。'
      ].filter(Boolean).join('\n')
    },

    validate() {
      if (!this.form.orderDate) {
        uni.showToast({ title: '请选择采购日期', icon: 'none' })
        return false
      }
      if (!this.items.length || this.items.some(it => !it.itemName || it.quantity <= 0)) {
        uni.showToast({ title: '请完整填写采购清单', icon: 'none' })
        return false
      }
      return true
    },

    async submitDraft() {
      await this.submitRequest('draft')
    },

    async submitApply() {
      await this.submitRequest('pending')
    },

    async submitRequest(status) {
      if (this.submitting || !this.validate()) return
      this.submitting = true
      const data = {
        ...this.form,
        items: this.items.map((item) => ({ ...item })),
        status,
        source: this.funeralCaseId ? 'funeral' : undefined,
        sourceId: this.funeralCaseId || undefined
      }
      try {
        await createPurchaseRequest(data)
        if (status === 'pending' && this.funeralCaseId) {
          const record = getFuneralCase(this.funeralCaseId)
          if (record) saveFuneralCase(setFuneralLinkTask(record, 'funeral-purchase', true))
        }
        uni.showToast({ title: status === 'draft' ? '草稿已保存' : '申请已提交', icon: 'success' })
        setTimeout(() => uni.navigateBack(), 1000)
      } catch (_) {
        uni.showToast({ title: status === 'draft' ? '草稿保存失败，请重试' : '申请提交失败，请重试', icon: 'none' })
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
.page-container { min-height: 100vh; background: var(--bg-page); padding-bottom: 140rpx; }

.card { background: var(--bg-card); border-radius: 16rpx; box-shadow: var(--shadow); margin: 20rpx 24rpx; padding: 24rpx; }

.form-item { margin-bottom: 24rpx; }
.form-label { font-size: var(--font-sm, 24rpx); color: var(--text-regular); display: block; margin-bottom: 10rpx; }
.picker-value {
  background: var(--bg-page); border-radius: 12rpx; padding: 16rpx 20rpx;
  font-size: var(--font-sm, 24rpx); color: var(--text-primary);
  border: 1rpx solid var(--border-color);
}
.form-textarea {
  width: 100%; background: var(--bg-page); border-radius: 12rpx;
  padding: 16rpx 20rpx; font-size: var(--font-sm, 24rpx); color: var(--text-primary);
  border: 1rpx solid var(--border-color); height: 120rpx;
}

.section-divider {
  font-size: var(--font-md, 28rpx); font-weight: 600; color: var(--text-primary);
  margin: 24rpx 0 16rpx; padding-bottom: 12rpx;
  border-bottom: 2rpx solid var(--primary-color);
}

.item-card {
  background: var(--bg-page); border-radius: 12rpx; padding: 20rpx; margin-bottom: 16rpx;
  border: 1rpx solid var(--divider-color);
}
.item-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16rpx; }
.item-idx { font-size: var(--font-sm, 24rpx); font-weight: 600; color: var(--primary-color); }
.remove-btn {
  width: 44rpx; height: 44rpx; border-radius: 50%; background: #fef0f0; color: #f56c6c;
  display: flex; align-items: center; justify-content: center;
  .iconfont { font-size: 24rpx; }
}

.item-row {
  display: flex; align-items: center; margin-bottom: 12rpx;
  .item-label { min-width: 120rpx; font-size: var(--font-xs, 20rpx); color: var(--text-secondary); }
  .item-input {
    flex: 1; height: 64rpx; background: #fff; border-radius: 8rpx;
    padding: 0 16rpx; font-size: var(--font-sm, 24rpx); color: var(--text-primary);
    border: 1rpx solid var(--border-color);
    &.short { flex: 0 0 120rpx; margin-left: 12rpx; }
  }
}

.add-item-btn {
  display: flex; align-items: center; justify-content: center; gap: 8rpx;
  background: var(--primary-light); color: var(--primary-color);
  border-radius: 12rpx; padding: 20rpx 0; font-size: var(--font-sm, 24rpx);
  .iconfont { font-size: 28rpx; }
}

.submit-bar {
  position: fixed; bottom: 0; left: 0; right: 0;
  display: flex; gap: 16rpx; padding: 16rpx 24rpx;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  background: var(--bg-card); box-shadow: 0 -2rpx 12rpx rgba(0,0,0,0.08);
}
.submit-btn {
  flex: 1; height: 88rpx; border-radius: 44rpx;
  display: flex; align-items: center; justify-content: center;
  font-size: var(--font-md, 28rpx); font-weight: 600;
  &.draft   { background: var(--bg-page); color: var(--text-regular); border: 1rpx solid var(--border-color); }
  &.confirm { background: var(--primary-color); color: #fff; }
  &.disabled { opacity: 0.55; }
}

@media screen and (min-width: 768px) {
  .form-card { max-width: 960rpx; margin-right: auto; margin-left: auto; }
  .submit-bar { justify-content: center; }
  .submit-btn { flex: 0 1 420rpx; }
}
</style>
