<template>
  <view :class="['page-container', settingsStore.pageClass()]">
    <NavBar title="利润计算" :show-back="true" />

    <view v-if="records.length" class="case-picker card">
      <text class="field-label">白事档案</text>
      <picker :range="caseLabels" :value="selectedIndex" @change="selectCase">
        <view class="picker-value">{{ caseLabels[selectedIndex] }}</view>
      </picker>
    </view>

    <template v-if="record">
      <view class="profit-summary">
        <view><text class="summary-label">预估利润</text><text class="summary-value" :class="profitClass(calculation.estimatedProfit)">{{ formatProfit(calculation.estimatedProfit) }}</text><text v-if="calculation.estimatedProfit !== null" class="uppercase-link" @tap="showUppercase('预估利润', calculation.estimatedProfit)">查看大写金额</text></view>
        <view><text class="summary-label">真实利润</text><text class="summary-value" :class="profitClass(calculation.actualProfit)">{{ formatProfit(calculation.actualProfit) }}</text><text v-if="calculation.actualProfit !== null" class="uppercase-link" @tap="showUppercase('真实利润', calculation.actualProfit)">查看大写金额</text></view>
      </view>

      <view class="card">
        <text class="section-title">收入与初始成本</text>
        <view class="form-grid">
          <view class="form-field"><text class="field-label">预估收入（元）</text><input v-model="form.estimatedRevenue" type="digit" class="field-input" placeholder="0.00" /></view>
          <view class="form-field"><text class="field-label">真实收入（元）</text><input v-model="form.actualRevenue" type="digit" class="field-input" placeholder="0.00" /></view>
          <view class="form-field full"><text class="field-label">初始成本（元）</text><input v-model="form.initialCost" type="digit" class="field-input" placeholder="0.00" /></view>
        </view>
      </view>

      <view class="card">
        <view class="section-head"><view><text class="section-title">中间过程成本</text><text class="section-note">新增和调整均以补录状态保存</text></view><view class="add-btn" @tap="addCost">+ 补录</view></view>
        <view v-if="!form.intermediateCosts.length" class="empty-inline">暂无补录成本</view>
        <view v-for="(item, index) in form.intermediateCosts" :key="item.id" class="cost-row">
          <view class="cost-head"><view><text class="supplement-tag">补录</text><text v-if="item.updatedAt" class="cost-time">调整于 {{ formatDateTime(item.updatedAt) }}</text></view><text class="remove-btn" @tap="removeCost(index)">删除</text></view>
          <input v-model="item.name" class="field-input" placeholder="成本项目，如临时运输费" />
          <view class="cost-fields">
            <input v-model="item.amount" type="digit" class="field-input" placeholder="金额（元）" />
            <picker mode="date" :value="item.occurredAt" @change="item.occurredAt = $event.detail.value"><view class="field-input date-input">{{ item.occurredAt || '发生日期' }}</view></picker>
          </view>
        </view>
      </view>

      <view class="save-btn" @tap="saveFinance">保存利润数据</view>

      <view class="card thumbnail" @tap="showTable = true">
        <view class="section-head"><view><text class="section-title">利润统计表</text><text class="section-note">缩略图 · 点击查看大表</text></view><text class="expand">查看大表</text></view>
        <view class="mini-table">
          <view class="table-row head"><text>档案</text><text>总成本（元）</text><text>预估利润（元）</text><text>真实利润（元）</text></view>
          <view v-for="item in statistics.slice(0, 4)" :key="item.id" class="table-row"><text>{{ item.deceasedName }}</text><text>{{ formatMoney(item.totalCost) }}</text><text>{{ formatOptionalMoney(item.estimatedProfit) }}</text><text>{{ formatOptionalMoney(item.actualProfit) }}</text></view>
          <view class="table-row total"><text>合计</text><text>{{ formatMoney(totals.totalCost) }}</text><text>{{ formatOptionalMoney(totals.estimatedProfit, totals.estimatedCount) }}</text><text>{{ formatOptionalMoney(totals.actualProfit, totals.actualCount) }}</text></view>
        </view>
      </view>
    </template>

    <view v-else class="empty-state"><text class="empty-title">暂无白事档案</text><text class="section-note">请先在白事管理中建立档案</text></view>

    <view v-if="showTable" class="modal-mask" @tap.self="showTable = false">
      <view class="table-modal">
        <view class="modal-head"><text class="section-title">利润统计表</text><text class="close" @tap="showTable = false">×</text></view>
        <scroll-view scroll-x scroll-y class="table-scroll">
          <view class="large-table">
            <view class="large-row head"><text>档案编号</text><text>逝者</text><text>初始成本（元）</text><text>补录成本（元）</text><text>总成本（元）</text><text>预估收入（元）</text><text>预估利润（元）</text><text>真实收入（元）</text><text>真实利润（元）</text></view>
            <view v-for="item in statistics" :key="item.id" class="large-row"><text>{{ item.caseNo }}</text><text>{{ item.deceasedName }}</text><text>{{ formatMoney(item.initialCost) }}</text><text>{{ formatMoney(item.intermediateCost) }}</text><text>{{ formatMoney(item.totalCost) }}</text><text>{{ item.hasEstimatedRevenue ? formatMoney(item.estimatedRevenue) : '待录入' }}</text><text>{{ formatOptionalMoney(item.estimatedProfit) }}</text><text>{{ item.hasActualRevenue ? formatMoney(item.actualRevenue) : '待录入' }}</text><text>{{ formatOptionalMoney(item.actualProfit) }}</text></view>
            <view class="large-row total"><text>合计</text><text>{{ statistics.length }} 个档案</text><text>{{ formatMoney(totals.initialCost) }}</text><text>{{ formatMoney(totals.intermediateCost) }}</text><text>{{ formatMoney(totals.totalCost) }}</text><text>{{ formatOptionalMoney(totals.estimatedRevenue, totals.estimatedCount) }}</text><text>{{ formatOptionalMoney(totals.estimatedProfit, totals.estimatedCount) }}</text><text>{{ formatOptionalMoney(totals.actualRevenue, totals.actualCount) }}</text><text>{{ formatOptionalMoney(totals.actualProfit, totals.actualCount) }}</text></view>
          </view>
        </scroll-view>
      </view>
    </view>

    <view v-if="uppercaseModal.visible" class="modal-mask" @tap.self="uppercaseModal.visible = false">
      <view class="uppercase-modal">
        <view class="modal-head"><text class="section-title">{{ uppercaseModal.title }}大写金额</text><text class="close" @tap="uppercaseModal.visible = false">×</text></view>
        <text class="uppercase-amount">{{ uppercaseModal.content }}</text>
        <view class="copy-btn" @tap="copyUppercase">点击复制</view>
      </view>
    </view>
  </view>
</template>

<script>
import { useSettingsStore } from '../../store/settings'
import { addCentAmounts, calculateFuneralProfit, centToChineseUppercase, centToYuan, convertFuneralFinanceYuanToCent, getFuneralCases, isValidYuanAmount, saveFuneralCase } from '../../utils/funeral'
import NavBar from '../../components/NavBar.vue'

export default {
  name: 'FuneralProfitPage', components: { NavBar }, setup() { return { settingsStore: useSettingsStore() } },
  data() { return { records: [], selectedIndex: 0, record: null, form: { estimatedRevenue: '', actualRevenue: '', initialCost: '', intermediateCosts: [] }, showTable: false, uppercaseModal: { visible: false, title: '', content: '' } } },
  computed: {
    caseLabels() { return this.records.map((item) => `${item.deceasedName}（${item.caseNo}）`) },
    calculation() { return calculateFuneralProfit(convertFuneralFinanceYuanToCent({ ...this.form, hasEstimatedRevenue: this.form.estimatedRevenue !== '', hasActualRevenue: this.form.actualRevenue !== '' })) },
    statistics() { return this.records.map((item) => ({ ...item, ...calculateFuneralProfit(item.finance) })) },
    totals() {
      return this.statistics.reduce((total, item) => {
        total.initialCost = addCentAmounts(total.initialCost, item.initialCost)
        total.intermediateCost = addCentAmounts(total.intermediateCost, item.intermediateCost)
        total.totalCost = addCentAmounts(total.totalCost, item.totalCost)
        if (item.hasEstimatedRevenue) { total.estimatedCount += 1; total.estimatedRevenue = addCentAmounts(total.estimatedRevenue, item.estimatedRevenue); total.estimatedProfit = addCentAmounts(total.estimatedProfit, item.estimatedProfit) }
        if (item.hasActualRevenue) { total.actualCount += 1; total.actualRevenue = addCentAmounts(total.actualRevenue, item.actualRevenue); total.actualProfit = addCentAmounts(total.actualProfit, item.actualProfit) }
        return total
      }, { initialCost: '0', intermediateCost: '0', totalCost: '0', estimatedRevenue: '0', estimatedProfit: '0', actualRevenue: '0', actualProfit: '0', estimatedCount: 0, actualCount: 0 })
    }
  },
  onShow() { this.loadRecords() },
  methods: {
    emptyFinance() { return { estimatedRevenue: '', actualRevenue: '', initialCost: '', intermediateCosts: [] } },
    loadRecords() { this.records = getFuneralCases(); if (this.records.length) this.loadCase(Math.min(this.selectedIndex, this.records.length - 1)) },
    loadCase(index) { this.selectedIndex = index; this.record = this.records[index]; const finance = calculateFuneralProfit(this.record.finance); this.form = { estimatedRevenue: finance.hasEstimatedRevenue ? centToYuan(finance.estimatedRevenue) : '', actualRevenue: finance.hasActualRevenue ? centToYuan(finance.actualRevenue) : '', initialCost: finance.initialCost ? centToYuan(finance.initialCost) : '', intermediateCosts: finance.intermediateCosts.map((item) => ({ ...item, amount: centToYuan(item.amount) })) } },
    selectCase(event) { this.loadCase(Number(event.detail.value)) },
    addCost() { const now = new Date().toISOString(); this.form.intermediateCosts.push({ id: `supplement-${Date.now()}`, name: '', amount: '', occurredAt: now.slice(0, 10), status: 'supplemented', createdAt: now, updatedAt: now }) },
    removeCost(index) { uni.showModal({ title: '删除补录成本', content: `确认删除“${this.form.intermediateCosts[index].name || '未命名成本'}”？`, confirmColor: '#c64545', success: ({ confirm }) => { if (confirm) this.form.intermediateCosts.splice(index, 1) } }) },
    saveFinance() {
      const mainAmounts = [this.form.estimatedRevenue, this.form.actualRevenue, this.form.initialCost]
      if (mainAmounts.some((value) => !isValidYuanAmount(value, true))) return uni.showToast({ title: '金额应为不超过两位小数的非负数', icon: 'none' })
      if (this.form.intermediateCosts.some((item) => !item.name.trim() || !isValidYuanAmount(item.amount) || !item.occurredAt)) return uni.showToast({ title: '请完整填写补录项目、金额和日期', icon: 'none' })
      const now = new Date().toISOString()
      const financeInYuan = { ...this.form, hasEstimatedRevenue: this.form.estimatedRevenue !== '', hasActualRevenue: this.form.actualRevenue !== '', intermediateCosts: this.form.intermediateCosts.map((item) => ({ ...item, status: 'supplemented', createdAt: item.createdAt || now, updatedAt: now })) }
      this.record.finance = convertFuneralFinanceYuanToCent(financeInYuan)
      this.record = saveFuneralCase(this.record)
      this.records = getFuneralCases()
      this.loadCase(this.records.findIndex((item) => item.id === this.record.id))
      uni.showToast({ title: '利润数据已保存', icon: 'success' })
    },
    formatMoney(value) { return centToYuan(value) },
    formatOptionalMoney(value, count = 1) { return value === null || !count ? '待录入' : this.formatMoney(value) },
    formatProfit(value) { return value === null ? '待录入' : `¥${this.formatMoney(value)}` },
    formatDateTime(value) { return value ? String(value).replace('T', ' ').slice(0, 16) : '' },
    profitClass(value) { return value === null ? 'pending' : String(value).startsWith('-') ? 'loss' : 'profit' },
    showUppercase(title, value) { this.uppercaseModal = { visible: true, title, content: centToChineseUppercase(value) } },
    copyUppercase() { uni.setClipboardData({ data: this.uppercaseModal.content, success: () => uni.showToast({ title: '大写金额已复制', icon: 'success' }) }) }
  }
}
</script>

<style scoped lang="scss">
.page-container { min-height: 100vh; background: var(--bg-page); padding-bottom: 48rpx; }
.card { margin: 20rpx 24rpx; padding: 24rpx; border-radius: 10rpx; background: var(--bg-card); box-shadow: var(--shadow); }
.field-label, .section-note { display: block; color: var(--text-secondary); font-size: var(--font-xs, 20rpx); margin-bottom: 8rpx; }
.picker-value, .field-input { box-sizing: border-box; width: 100%; height: 70rpx; padding: 0 18rpx; border: 1rpx solid var(--border-color); border-radius: 8rpx; background: var(--bg-page); color: var(--text-primary); font-size: var(--font-sm, 24rpx); }
.profit-summary { display: grid; grid-template-columns: 1fr 1fr; gap: 16rpx; margin: 20rpx 24rpx; }
.profit-summary > view { padding: 24rpx; border-radius: 10rpx; background: #34404b; }
.summary-label { display: block; color: #c8d0d7; font-size: var(--font-xs, 20rpx); }.summary-value { display: block; margin-top: 8rpx; color: #c2f0d6; font-size: var(--font-xl, 36rpx); font-weight: 700; }.summary-value.loss { color: #ffc4bd; }.summary-value.pending { color: #c8d0d7; font-size: var(--font-md, 28rpx); }.uppercase-link { display: inline-block; margin-top: 14rpx; color: #dce9e2; font-size: 20rpx; text-decoration: underline; }
.section-title { display: block; color: var(--text-primary); font-size: var(--font-md, 28rpx); font-weight: 700; }.section-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 18rpx; }.section-head .section-note { margin-top: 6rpx; margin-bottom: 0; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18rpx; margin-top: 20rpx; }.form-field.full { grid-column: 1 / -1; }
.add-btn, .expand { color: #23744f; font-size: var(--font-sm, 24rpx); }.cost-row { margin-top: 16rpx; padding: 18rpx; border: 1rpx solid var(--divider-color); border-radius: 8rpx; }.cost-head { display: flex; justify-content: space-between; margin-bottom: 12rpx; }.supplement-tag { padding: 4rpx 12rpx; border-radius: 6rpx; background: #fff5e8; color: #94600f; font-size: 20rpx; }.cost-time { margin-left: 12rpx; color: var(--text-secondary); font-size: 18rpx; }.remove-btn { color: #c64545; font-size: 22rpx; }.cost-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 12rpx; margin-top: 12rpx; }.date-input { display: flex; align-items: center; }
.save-btn { margin: 24rpx; height: 82rpx; display: flex; align-items: center; justify-content: center; border-radius: 8rpx; color: #fff; background: #23744f; font-size: var(--font-md, 28rpx); font-weight: 600; }.empty-inline, .empty-state { padding: 36rpx; text-align: center; color: var(--text-secondary); }.empty-title { display: block; color: var(--text-primary); font-size: 28rpx; }
.thumbnail { overflow: hidden; }.mini-table { font-size: 18rpx; transform-origin: top left; }.table-row { display: grid; grid-template-columns: 1.3fr repeat(3, 1fr); min-width: 620rpx; }.table-row text { overflow: hidden; padding: 10rpx 6rpx; border-bottom: 1rpx solid var(--divider-color); white-space: nowrap; text-overflow: ellipsis; }.table-row.head { background: var(--bg-page); font-weight: 600; }.table-row.total, .large-row.total { background: #e9f6ef; color: #1f6646; font-weight: 700; }
.modal-mask { position: fixed; inset: 0; z-index: 99; display: flex; align-items: center; justify-content: center; padding: 28rpx; background: rgba(0,0,0,.55); }.table-modal { width: 100%; max-height: 82vh; padding: 24rpx; border-radius: 12rpx; background: var(--bg-card); }.modal-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18rpx; }.close { padding: 8rpx 16rpx; font-size: 40rpx; color: var(--text-secondary); }.table-scroll { max-height: 66vh; }.large-table { min-width: 1500rpx; }.large-row { display: grid; grid-template-columns: 240rpx 120rpx repeat(7, 160rpx); }.large-row text { padding: 16rpx 10rpx; border-right: 1rpx solid var(--divider-color); border-bottom: 1rpx solid var(--divider-color); font-size: 22rpx; }.large-row.head { background: #34404b; color: #fff; font-weight: 600; }
.uppercase-modal { width: 620rpx; max-width: 92vw; padding: 28rpx; border-radius: 12rpx; background: var(--bg-card); }.uppercase-amount { display: block; min-height: 100rpx; padding: 24rpx; border-radius: 8rpx; background: var(--bg-page); color: var(--text-primary); font-size: var(--font-md, 28rpx); line-height: 1.8; word-break: break-all; }.copy-btn { height: 76rpx; margin-top: 22rpx; display: flex; align-items: center; justify-content: center; border-radius: 8rpx; background: #23744f; color: #fff; font-size: var(--font-sm, 24rpx); font-weight: 600; }
@media screen and (min-width: 768px) { .card, .profit-summary, .save-btn { max-width: 1000rpx; margin-right: auto; margin-left: auto; }.table-modal { max-width: 1400rpx; } }
</style>
