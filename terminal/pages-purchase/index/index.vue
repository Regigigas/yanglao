<template>
  <view :class="['page-container', settingsStore.pageClass()]">
    <NavBar title="采购管理" :show-back="true" />

    <!-- 统计卡片 -->
    <view class="stats-row">
      <view class="stat-box" @tap="statusFilter = 'pending'">
        <text class="stat-num text-warning">{{ stats.pending }}</text>
        <text class="stat-label">待审批</text>
      </view>
      <view class="stat-box" @tap="statusFilter = 'approved'">
        <text class="stat-num text-primary">{{ stats.approved }}</text>
        <text class="stat-label">已审批</text>
      </view>
      <view class="stat-box" @tap="statusFilter = 'received'">
        <text class="stat-num text-success">{{ stats.received }}</text>
        <text class="stat-label">已入库</text>
      </view>
    </view>

    <!-- 筛选栏 -->
    <view class="filter-bar">
      <view
        v-for="f in filters"
        :key="f.val"
        class="filter-chip"
        :class="{ active: statusFilter === f.val }"
        @tap="statusFilter = f.val"
      >{{ f.label }}</view>
      <view class="add-btn" @tap="goToApply">
        <text class="iconfont icon-add"></text>
        <text>新建</text>
      </view>
    </view>

    <!-- 采购单列表 -->
    <view v-if="loading" class="loading-wrap">
      <text class="iconfont icon-loading"></text><text>加载中...</text>
    </view>
    <view v-else-if="filteredList.length === 0" class="empty-wrap">
      <text class="iconfont icon-task empty-icon"></text>
      <text class="empty-text">暂无采购单</text>
    </view>
    <view v-else>
      <view
        v-for="order in filteredList"
        :key="order.id"
        class="card order-card"
        @tap="viewDetail(order)"
      >
        <view class="order-header">
          <text class="order-no">{{ order.orderNo }}</text>
          <view class="order-status" :class="getStatusClass(order.status)">
            <text>{{ getStatusText(order.status) }}</text>
          </view>
        </view>
          <view class="order-info">
            <view class="info-row">
              <text class="info-label">供应商</text>
              <text class="info-value">{{ order.supplierName || '—' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">采购日期</text>
              <text class="info-value">{{ order.orderDate }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">金额</text>
              <text class="info-value amount">¥{{ order.totalAmount }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">申请人</text>
              <text class="info-value">{{ order.applicant || '—' }}</text>
            </view>
          </view>
          <!-- 状态操作按钮 -->
          <view class="order-actions">
            <view v-if="order.status === 'draft'" class="order-btn btn-submit" @tap.stop="submitOrder(order)">提交审批</view>
            <view v-if="['draft','pending'].includes(order.status)" class="order-btn btn-cancel" @tap.stop="cancelOrder(order)">取消</view>
            <view class="order-btn btn-detail" @tap.stop="viewDetail(order)">查看详情</view>
          </view>
      </view>
    </view>

  </view>
</template>

<script>
import { useSettingsStore } from '../../store/settings'
import { getPurchaseOrderList, getPurchaseStats, updatePurchaseStatus } from '../../api/purchase'
import NavBar from '../../components/NavBar.vue'

export default {
  name: 'PurchaseIndexPage',
  components: { NavBar },
  setup() { return { settingsStore: useSettingsStore() } },

  data() {
    return {
      orders: [],
      loading: false,
      statusFilter: null,
      stats: { pending: 0, approved: 0, received: 0 },
      filters: [
        { val: null,       label: '全部' },
        { val: 'draft',    label: '草稿' },
        { val: 'pending',  label: '待审批' },
        { val: 'approved', label: '已审批' },
        { val: 'received', label: '已入库' },
      ]
    }
  },

  computed: {
    filteredList() {
      if (!this.statusFilter) return this.orders
      return this.orders.filter(o => o.status === this.statusFilter)
    }
  },

  onLoad() { this.loadData() },
  onShow() { this.loadData() },

  methods: {
    async loadData() {
      this.loading = true
      try {
        const [ordersRes, statsRes] = await Promise.all([
          getPurchaseOrderList({ pageSize: 100 }),
          getPurchaseStats()
        ])
        this.orders = ordersRes.rows || ordersRes.data || []
        this.stats  = statsRes.data || statsRes || { pending: 0, approved: 0, received: 0 }
      } finally {
        this.loading = false
      }
    },

    getStatusClass(s) {
      return {
        draft: 'status-draft', pending: 'status-pending',
        approved: 'status-approved', received: 'status-received', cancelled: 'status-cancelled'
      }[s] || ''
    },

    getStatusText(s) {
      return { draft: '草稿', pending: '待审批', approved: '已审批', received: '已入库', cancelled: '已取消' }[s] || s
    },

    goToApply() {
      uni.navigateTo({ url: '/pages-purchase/apply/index' })
    },

    viewDetail(order) {
      uni.navigateTo({ url: `/pages-purchase/detail/index?id=${order.id}` })
    },

    async submitOrder(order) {
      await updatePurchaseStatus(order.id, 'pending').catch(() => {})
      order.status = 'pending'
      uni.showToast({ title: '已提交审批', icon: 'success' })
    },

    cancelOrder(order) {
      uni.showModal({
        title: '取消确认', content: '确认取消该采购单？',
        success: async ({ confirm }) => {
          if (!confirm) return
          await updatePurchaseStatus(order.id, 'cancelled').catch(() => {})
          order.status = 'cancelled'
          uni.showToast({ title: '已取消', icon: 'success' })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.page-container { min-height: 100vh; background: var(--bg-page); padding-bottom: 40rpx; }

.stats-row {
  display: flex; margin: 20rpx 24rpx; gap: 16rpx;
  .stat-box {
    flex: 1; background: var(--bg-card); border-radius: 16rpx;
    box-shadow: var(--shadow); padding: 24rpx; text-align: center;
    .stat-num { font-size: var(--font-xl, 36rpx); font-weight: 700; display: block; }
    .stat-label { font-size: var(--font-xs, 20rpx); color: var(--text-secondary); margin-top: 6rpx; }
  }
}

.filter-bar {
  display: flex; align-items: center; gap: 12rpx; padding: 0 24rpx 16rpx;
  .filter-chip {
    padding: 8rpx 24rpx; border-radius: 32rpx;
    background: var(--bg-card); color: var(--text-secondary);
    font-size: var(--font-xs, 20rpx); border: 1rpx solid var(--border-color);
    &.active { background: var(--primary-color); color: #fff; border-color: transparent; }
  }
  .add-btn {
    margin-left: auto; display: flex; align-items: center; gap: 6rpx;
    color: var(--primary-color); font-size: var(--font-xs, 20rpx);
    .iconfont { font-size: 26rpx; }
  }
}

.loading-wrap, .empty-wrap {
  display: flex; flex-direction: column; align-items: center; padding: 100rpx 0;
  gap: 20rpx; color: var(--text-secondary);
  .iconfont, .empty-icon { font-size: 80rpx; }
}

.card {
  background: var(--bg-card); border-radius: 16rpx;
  box-shadow: var(--shadow); margin: 0 24rpx 20rpx; padding: 24rpx;
}

.order-card {
  .order-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16rpx; }
  .order-no { font-size: var(--font-md, 28rpx); font-weight: 600; color: var(--text-primary); }
  .order-status {
    padding: 6rpx 20rpx; border-radius: 20rpx; font-size: var(--font-xs, 20rpx);
    &.status-draft     { background: #f0f0f0; color: #666; }
    &.status-pending   { background: #fef6ed; color: #e67e22; }
    &.status-approved  { background: #e8f3ff; color: var(--primary-color); }
    &.status-received  { background: #e8f8f0; color: #27ae60; }
    &.status-cancelled { background: #fef0f0; color: #f56c6c; }
  }
}

.order-info { border-top: 1rpx solid var(--divider-color); padding-top: 16rpx; }
.info-row {
  display: flex; justify-content: space-between; padding: 8rpx 0;
  .info-label { font-size: var(--font-xs, 20rpx); color: var(--text-secondary); }
  .info-value { font-size: var(--font-xs, 20rpx); color: var(--text-regular); }
  .amount { font-weight: 600; color: var(--primary-color); }
}

.order-actions {
  display: flex; gap: 12rpx; margin-top: 16rpx; padding-top: 16rpx;
  border-top: 1rpx solid var(--divider-color);
  justify-content: flex-end;
}
.order-btn {
  padding: 10rpx 24rpx; border-radius: 28rpx; font-size: var(--font-xs, 20rpx); font-weight: 600;
  &.btn-submit { background: var(--primary-light); color: var(--primary-color); }
  &.btn-cancel { background: #fef0f0; color: #f56c6c; }
  &.btn-detail { background: var(--bg-page); color: var(--text-regular); border: 1rpx solid var(--border-color); }
}
</style>
