<template>
  <view :class="['page-container', settingsStore.pageClass()]">
    <NavBar title="护理任务" :show-back="false" />

    <!-- 状态筛选 -->
    <view class="filter-bar">
      <view
        v-for="f in filters"
        :key="f.val"
        class="filter-chip"
        :class="{ active: activeFilter === f.val }"
        @tap="activeFilter = f.val"
      >{{ f.label }}</view>
    </view>

    <!-- 统计概览 -->
    <view class="stat-row">
      <view class="stat-mini">
        <text class="stat-num text-warning">{{ pendingCount }}</text>
        <text class="stat-label">待执行</text>
      </view>
      <view class="stat-mini">
        <text class="stat-num" style="color:var(--primary-color)">{{ doingCount }}</text>
        <text class="stat-label">执行中</text>
      </view>
      <view class="stat-mini">
        <text class="stat-num text-success">{{ doneCount }}</text>
        <text class="stat-label">已完成</text>
      </view>
    </view>

    <view v-if="loading" class="loading-wrap">
      <text class="iconfont icon-loading"></text><text>加载中...</text>
    </view>
    <view v-else-if="filteredTasks.length === 0" class="empty-wrap">
      <text class="iconfont icon-checklist empty-icon"></text>
      <text class="empty-text">暂无护理任务</text>
    </view>
    <view v-else>
      <view
        v-for="task in filteredTasks"
        :key="task.taskId"
        class="card task-card"
        @tap="viewTask(task)"
      >
        <view class="task-left">
          <view class="task-status-dot" :class="getStatusClass(task.status)"></view>
        </view>
        <view class="task-body">
          <view class="task-top">
            <text class="task-name">{{ task.taskName }}</text>
            <view class="task-tag" :class="getStatusClass(task.status)">{{ getStatusText(task.status) }}</view>
          </view>
          <view class="task-info">
            <text class="iconfont icon-elder"></text>
            <text class="info-text">{{ task.elderlyName }}</text>
            <text class="iconfont icon-time" style="margin-left:16rpx"></text>
            <text class="info-text">{{ task.planTime }}</text>
          </view>
          <text class="task-desc">{{ task.remark }}</text>
        </view>
        <!-- 执行按钮 -->
        <view v-if="task.status === 'pending'" class="action-btn btn-start" @tap.stop="startTask(task)">
          <text>开始</text>
        </view>
        <view v-else-if="task.status === 'doing'" class="action-btn btn-done" @tap.stop="completeTask(task)">
          <text>完成</text>
        </view>
      </view>
    </view>

    <BottomTabBar current="/pages-care/tasks/index" />
  </view>
</template>

<script>
import { useSettingsStore } from '../../store/settings'
import { getCareTaskList, startTask as apiStart, completeTask as apiComplete } from '../../api/care'
import NavBar       from '../../components/NavBar.vue'
import BottomTabBar from '../../components/BottomTabBar.vue'

export default {
  name: 'CareTasksPage',
  components: { NavBar, BottomTabBar },
  setup() { return { settingsStore: useSettingsStore() } },
  data() {
    return {
      loading: false,
      tasks: [],
      activeFilter: 'all',
      filters: [
        { val: 'all',     label: '全部' },
        { val: 'pending', label: '待执行' },
        { val: 'doing',   label: '执行中' },
        { val: 'done',    label: '已完成' }
      ]
    }
  },
  computed: {
    filteredTasks() {
      if (this.activeFilter === 'all') return this.tasks
      return this.tasks.filter(t => t.status === this.activeFilter)
    },
    pendingCount() { return this.tasks.filter(t => t.status === 'pending').length },
    doingCount()   { return this.tasks.filter(t => t.status === 'doing').length },
    doneCount()    { return this.tasks.filter(t => t.status === 'done').length }
  },
  onLoad()  { this.loadData() },
  onShow()  { this.loadData() },
  methods: {
    async loadData() {
      this.loading = true
      try {
        const res = await getCareTaskList({ pageSize: 100 })
        this.tasks = res.rows || res.data || []
      } finally { this.loading = false }
    },
    getStatusClass(s) {
      return { pending: 'status-pending', doing: 'status-doing', done: 'status-done' }[s] || ''
    },
    getStatusText(s) {
      return { pending: '待执行', doing: '执行中', done: '已完成' }[s] || s
    },
    viewTask(task) {
      uni.navigateTo({ url: `/pages-care/records/index?taskId=${task.taskId}` })
    },
    async startTask(task) {
      await apiStart(task.taskId).catch(() => {})
      task.status = 'doing'
      uni.showToast({ title: '任务已开始', icon: 'success' })
    },
    async completeTask(task) {
      uni.showModal({
        title: '完成任务',
        editable: true,
        placeholderText: '输入完成备注（可选）',
        success: async ({ confirm, content }) => {
          if (!confirm) return
          await apiComplete(task.taskId, content || '').catch(() => {})
          task.status = 'done'
          uni.showToast({ title: '任务已完成', icon: 'success' })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.page-container { min-height: 100vh; background: var(--bg-page); padding-bottom: 130rpx; }

.filter-bar {
  display: flex; gap: 12rpx; padding: 16rpx 24rpx;
}
.filter-chip {
  padding: 8rpx 24rpx; border-radius: 32rpx;
  background: var(--bg-card); color: var(--text-secondary);
  font-size: var(--font-xs, 20rpx); border: 1rpx solid var(--border-color);
  &.active { background: var(--primary-color); color: #fff; border-color: transparent; }
}

.stat-row {
  display: flex; margin: 0 24rpx 16rpx;
  background: var(--bg-card); border-radius: 16rpx; overflow: hidden;
  .stat-mini {
    flex: 1; display: flex; flex-direction: column; align-items: center; padding: 20rpx 0;
    &:not(:last-child) { border-right: 1rpx solid var(--divider-color); }
    .stat-num { font-size: var(--font-xl, 36rpx); font-weight: 700; }
    .stat-label { font-size: var(--font-xs, 20rpx); color: var(--text-secondary); }
  }
}

.loading-wrap, .empty-wrap {
  display: flex; flex-direction: column; align-items: center;
  padding: 100rpx 0; gap: 20rpx; color: var(--text-secondary);
  .iconfont, .empty-icon { font-size: 80rpx; }
  .empty-text { font-size: var(--font-sm, 24rpx); }
}

.card {
  background: var(--bg-card); border-radius: 16rpx;
  box-shadow: var(--shadow); margin: 0 24rpx 20rpx;
  padding: 24rpx; display: flex; gap: 16rpx; align-items: flex-start;
}

.task-left {
  padding-top: 8rpx;
  .task-status-dot {
    width: 16rpx; height: 16rpx; border-radius: 50%;
    &.status-pending { background: #e67e22; }
    &.status-doing   { background: var(--primary-color); }
    &.status-done    { background: #67c23a; }
  }
}

.task-body { flex: 1; }
.task-top  { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10rpx; }
.task-name { font-size: var(--font-md, 28rpx); font-weight: 600; color: var(--text-primary); }

.task-tag {
  padding: 4rpx 16rpx; border-radius: 16rpx; font-size: var(--font-xs, 20rpx);
  &.status-pending { background: #fef6ed; color: #e67e22; }
  &.status-doing   { background: var(--primary-light); color: var(--primary-color); }
  &.status-done    { background: #e8f8f0; color: #27ae60; }
}

.task-info {
  display: flex; align-items: center; gap: 6rpx; margin-bottom: 8rpx;
  .iconfont { font-size: 24rpx; color: var(--text-secondary); }
  .info-text { font-size: var(--font-xs, 20rpx); color: var(--text-secondary); }
}

.task-desc { font-size: var(--font-xs, 20rpx); color: var(--text-secondary); }

.action-btn {
  padding: 12rpx 24rpx; border-radius: 24rpx; font-size: var(--font-xs, 20rpx);
  font-weight: 600; white-space: nowrap; align-self: center;
  &.btn-start { background: var(--primary-light); color: var(--primary-color); }
  &.btn-done  { background: #e8f8f0; color: #27ae60; }
}
</style>
