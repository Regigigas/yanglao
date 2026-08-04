<template>
  <view :class="['page-container', settingsStore.pageClass()]">
    <NavBar title="采购单详情" :show-back="true" />

    <view v-if="loading" class="loading-wrap">
      <text class="iconfont icon-loading"></text>
      <text>加载中...</text>
    </view>

    <view v-else-if="order">
      <!-- 基本信息卡片 -->
      <view class="card info-card">
        <view class="info-header">
          <text class="order-no">{{ order.orderNo }}</text>
          <view class="status-badge" :class="getStatusClass(order.status)">
            <text>{{ getStatusText(order.status) }}</text>
          </view>
        </view>
        <view class="info-grid">
          <view class="info-item">
            <text class="info-label">供应商</text>
            <text class="info-value">{{ order.supplierName || '—' }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">采购日期</text>
            <text class="info-value">{{ order.orderDate }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">预计到货</text>
            <text class="info-value">{{ order.expectDate || '—' }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">申请人</text>
            <text class="info-value">{{ order.applicant || '—' }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">总金额</text>
            <text class="info-value amount">¥{{ order.totalAmount }}</text>
          </view>
          <view v-if="order.approver" class="info-item">
            <text class="info-label">审批人</text>
            <text class="info-value">{{ order.approver }}</text>
          </view>
        </view>
        <view v-if="order.remark" class="remark-row">
          <text class="info-label">备注</text>
          <text class="remark-text">{{ order.remark }}</text>
        </view>
      </view>

      <!-- 采购明细 -->
      <view class="section-title">采购清单（{{ items.length }} 项）</view>
      <view v-for="(item, idx) in items" :key="item.id" class="card item-card">
        <view class="item-header">
          <text class="item-name">{{ idx + 1 }}. {{ item.itemName }}</text>
          <text class="item-amount">¥{{ item.amount }}</text>
        </view>
        <view class="item-meta">
          <text>{{ item.category | categoryLabel }}  ·  {{ item.specification || '—' }}</text>
          <text>{{ item.quantity }} {{ item.unit }} × ¥{{ item.unitPrice }}</text>
        </view>
        <view v-if="item.receivedQty > 0" class="received-row">
          <text class="received-label">已入库</text>
          <text class="received-val">{{ item.receivedQty }} {{ item.unit }}</text>
        </view>
      </view>

      <!-- 操作按钮区 -->
      <view class="action-bar">
        <view v-if="order.status === 'draft'" class="action-btn submit" @tap="submitApply">
          <text class="iconfont icon-check"></text>
          <text>提交审批</text>
        </view>
        <view v-if="order.status === 'pending'" class="action-btn approve" @tap="approveOrder">
          <text class="iconfont icon-success"></text>
          <text>审批通过</text>
        </view>
        <view v-if="order.status === 'approved'" class="action-btn receive" @tap="receiveOrder">
          <text class="iconfont icon-record"></text>
          <text>确认入库</text>
        </view>
        <view v-if="['draft','pending'].includes(order.status)" class="action-btn cancel" @tap="cancelOrder">
          <text class="iconfont icon-close"></text>
          <text>取消</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { useSettingsStore } from '../../store/settings'
import {
  getPurchaseOrderDetail, getPurchaseOrderItems,
  updatePurchaseStatus
} from '../../api/purchase'
import NavBar from '../../components/NavBar.vue'

const CATEGORY_MAP = {
  medicine: '药品/医疗', care_supply: '护理用品',
  food: '食材/餐饮', equipment: '设备器械', other: '其他'
}

export default {
  name: 'PurchaseDetailPage',
  components: { NavBar },
  filters: {
    categoryLabel: (v) => CATEGORY_MAP[v] || v
  },
  setup() { return { settingsStore: useSettingsStore() } },

  data() {
    return { orderId: '', order: null, items: [], loading: false }
  },

  onLoad(options) {
    this.orderId = options.id
    this.loadData()
  },

  methods: {
    async loadData() {
      this.loading = true
      try {
        const [orderRes, itemsRes] = await Promise.all([
          getPurchaseOrderDetail(this.orderId),
          getPurchaseOrderItems(this.orderId)
        ])
        this.order = orderRes.data || orderRes
        this.items = itemsRes.data || itemsRes || []
      } catch (_) {
        uni.showToast({ title: '加载失败', icon: 'none' })
      } finally {
        this.loading = false
      }
    },

    getStatusClass(s) {
      return { draft:'s-draft', pending:'s-pending', approved:'s-approved', received:'s-received', cancelled:'s-cancelled' }[s] || ''
    },
    getStatusText(s) {
      return { draft:'草稿', pending:'待审批', approved:'已审批', received:'已入库', cancelled:'已取消' }[s] || s
    },

    async changeStatus(status, msg) {
      await updatePurchaseStatus(this.orderId, status)
      uni.showToast({ title: msg, icon: 'success' })
      this.order.status = status
    },

    submitApply() { this.changeStatus('pending', '已提交审批') },
    approveOrder() {
      uni.showModal({
        title: '审批确认', content: '确认审批通过该采购单？',
        success: ({ confirm }) => { if (confirm) this.changeStatus('approved', '审批通过') }
      })
    },
    receiveOrder() {
      uni.showModal({
        title: '入库确认', content: '确认所有物品已入库？',
        success: ({ confirm }) => { if (confirm) this.changeStatus('received', '已标记入库') }
      })
    },
    cancelOrder() {
      uni.showModal({
        title: '取消采购', content: '确认取消该采购单？',
        success: ({ confirm }) => { if (confirm) this.changeStatus('cancelled', '已取消') }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.page-container { min-height: 100vh; background: var(--bg-page); padding-bottom: 40rpx; }

.loading-wrap {
  display: flex; align-items: center; justify-content: center; gap: 16rpx;
  padding: 100rpx 0; color: var(--text-secondary);
  .iconfont { font-size: 40rpx; }
}

.card { background: var(--bg-card); border-radius: 16rpx; box-shadow: var(--shadow); margin: 20rpx 24rpx; padding: 24rpx; }

.info-card {
  .info-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20rpx; }
  .order-no { font-size: var(--font-md, 28rpx); font-weight: 700; color: var(--text-primary); }
}

.status-badge {
  padding: 6rpx 20rpx; border-radius: 20rpx; font-size: var(--font-xs, 20rpx);
  &.s-draft     { background: #f0f0f0; color: #666; }
  &.s-pending   { background: #fef6ed; color: #e67e22; }
  &.s-approved  { background: var(--primary-light); color: var(--primary-color); }
  &.s-received  { background: #e8f8f0; color: #27ae60; }
  &.s-cancelled { background: #fef0f0; color: #f56c6c; }
}

.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16rpx; }
.info-item { .info-label { font-size: var(--font-xs, 20rpx); color: var(--text-secondary); display: block; } }
.info-value { font-size: var(--font-sm, 24rpx); color: var(--text-regular); &.amount { color: var(--primary-color); font-weight: 700; } }
.remark-row { margin-top: 16rpx; border-top: 1rpx solid var(--divider-color); padding-top: 12rpx; }
.remark-text { font-size: var(--font-xs, 20rpx); color: var(--text-regular); }

.section-title {
  padding: 16rpx 32rpx 8rpx;
  font-size: var(--font-sm, 24rpx); font-weight: 600; color: var(--text-regular);
}

.item-card { padding: 20rpx 24rpx; }
.item-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8rpx; }
.item-name   { font-size: var(--font-sm, 24rpx); font-weight: 600; color: var(--text-primary); flex: 1; }
.item-amount { font-size: var(--font-sm, 24rpx); font-weight: 700; color: var(--primary-color); }
.item-meta   { font-size: var(--font-xs, 20rpx); color: var(--text-secondary); display: flex; justify-content: space-between; }
.received-row { display: flex; gap: 12rpx; margin-top: 8rpx; font-size: var(--font-xs, 20rpx); }
.received-label { color: var(--text-secondary); }
.received-val   { color: #27ae60; font-weight: 600; }

/* 操作按钮栏 */
.action-bar {
  display: flex; gap: 16rpx; margin: 24rpx 24rpx 0; flex-wrap: wrap;
}
.action-btn {
  flex: 1; min-width: 160rpx; height: 80rpx; border-radius: 40rpx;
  display: flex; align-items: center; justify-content: center; gap: 8rpx;
  font-size: var(--font-sm, 24rpx); font-weight: 600;
  .iconfont { font-size: 28rpx; }
  &.submit  { background: var(--primary-color); color: #fff; }
  &.approve { background: #e8f8f0; color: #27ae60; }
  &.receive { background: #e8f3ff; color: #4A90D9; }
  &.cancel  { background: #fef0f0; color: #f56c6c; }
}
</style>
