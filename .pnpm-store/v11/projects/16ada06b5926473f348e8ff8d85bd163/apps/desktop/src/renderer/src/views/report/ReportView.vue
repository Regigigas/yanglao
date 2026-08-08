<script setup lang="ts">
defineOptions({ name: 'Report' })
import { NCard, NGrid, NGi, NStatistic, NTag, NDatePicker } from 'naive-ui'
import { BasePage, BaseChart } from '@yanglao/ui'
import { useElderlyStore } from '../../stores/elderly.store'
import { useBuildingStore } from '../../stores/building.store'
import { useFeeStore } from '../../stores/fee.store'
import { onMounted, ref, computed, watch } from 'vue'
import type { EChartsOption } from 'echarts'

const elderlyStore = useElderlyStore()
const buildingStore = useBuildingStore()
const feeStore = useFeeStore()

const selectedMonthTs = ref(Date.now())
const selectedMonth = computed(() => new Date(selectedMonthTs.value).toISOString().slice(0, 7))
const feeStats = ref({ total_billed: 0, total_paid: 0, overdue: 0 })

onMounted(async () => {
  await Promise.all([elderlyStore.fetchList(), buildingStore.fetchAll()])
  await loadFeeStats()
})

watch(selectedMonth, () => loadFeeStats())

async function loadFeeStats() {
  try {
    feeStats.value = await feeStore.getStats(selectedMonth.value)
  } catch {}
}

// ── 入住率 ─────────────────────────────────────
const occupancyRate = computed(() => {
  const total = buildingStore.bedStats.total
  if (!total) return 0
  return Math.round((buildingStore.bedStats.occupied / total) * 100)
})

// ── 老人状态分布 ─────────────────────────────────
const elderlyStatusChart = computed<EChartsOption>(() => {
  const active = elderlyStore.list.filter(e => e.status === 'active').length
  const inactive = elderlyStore.list.filter(e => e.status === 'inactive').length
  const left = elderlyStore.list.filter(e => e.status === 'left').length
  return {
    tooltip: { trigger: 'item', confine: true },
    legend: { type: 'scroll', bottom: 0, left: 'center', itemWidth: 12, itemHeight: 8 },
    series: [{
      type: 'pie', radius: ['34%', '58%'], center: ['50%', '43%'],
      label: { show: false },
      labelLine: { show: false },
      emphasis: { label: { show: false } },
      data: [
        { value: active, name: '在院', itemStyle: { color: '#18a058' } },
        { value: inactive, name: '暂离', itemStyle: { color: '#f0a020' } },
        { value: left, name: '离院', itemStyle: { color: '#d03050' } },
      ],
    }],
  }
})

// ── 护理级别分布 ─────────────────────────────────
const careLevelChart = computed<EChartsOption>(() => {
  const levels: Record<string, number> = {}
  const labelMap: Record<string, string> = { level1: '一级（自理）', level2: '二级（半自理）', level3: '三级（不能自理）', level4: '四级（完全不能自理）' }
  elderlyStore.list.filter(e => e.status === 'active' && e.care_level).forEach(e => {
    const key = e.care_level!
    levels[key] = (levels[key] ?? 0) + 1
  })
  return {
    tooltip: { trigger: 'item', confine: true },
    legend: { type: 'scroll', bottom: 0, left: 'center', itemWidth: 12, itemHeight: 8 },
    series: [{
      type: 'pie', radius: '58%', center: ['50%', '41%'],
      label: { show: false },
      labelLine: { show: false },
      emphasis: { label: { show: false } },
      data: Object.entries(levels).map(([k, v]) => ({ value: v, name: labelMap[k] ?? k })),
    }],
  }
})

// ── 性别分布 ─────────────────────────────────────
const genderChart = computed<EChartsOption>(() => {
  const male = elderlyStore.list.filter(e => e.gender === 'male' && e.status !== 'left').length
  const female = elderlyStore.list.filter(e => e.gender === 'female' && e.status !== 'left').length
  return {
    tooltip: { trigger: 'item', confine: true },
    legend: { type: 'scroll', bottom: 0, left: 'center', itemWidth: 12, itemHeight: 8 },
    series: [{
      type: 'pie', radius: '58%', center: ['50%', '43%'],
      label: { show: false },
      labelLine: { show: false },
      emphasis: { label: { show: false } },
      data: [
        { value: male, name: '男', itemStyle: { color: '#409eff' } },
        { value: female, name: '女', itemStyle: { color: '#f56c6c' } },
      ],
    }],
  }
})

// ── 床位使用率 ─────────────────────────────────────
const bedUsageChart = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'item', confine: true },
  series: [{
    type: 'gauge',
    radius: '76%',
    center: ['50%', '50%'],
    startAngle: 90,
    endAngle: -270,
    pointer: { show: false },
    progress: { show: true, roundCap: true, width: 16 },
    axisLine: { lineStyle: { width: 16, color: [[1, '#e5e7eb']] } },
    axisTick: { show: false },
    splitLine: { show: false },
    axisLabel: { show: false },
    anchor: { show: false },
    title: { show: false },
    detail: { valueAnimation: true, fontSize: 30, fontWeight: 600, offsetCenter: [0, 0], formatter: '{value}%' },
    data: [{ value: occupancyRate.value, name: '床位使用率', itemStyle: { color: '#18a058' } }],
  }],
}))

// ── 年龄段分布 ─────────────────────────────────────
const ageGroupChart = computed<EChartsOption>(() => {
  const groups: Record<string, number> = { '60-69': 0, '70-79': 0, '80-89': 0, '90+': 0 }
  const currentYear = new Date().getFullYear()
  elderlyStore.list.filter(e => e.status === 'active' && e.birth_date).forEach(e => {
    const age = currentYear - parseInt(e.birth_date!.slice(0, 4))
    if (age < 70) groups['60-69']++
    else if (age < 80) groups['70-79']++
    else if (age < 90) groups['80-89']++
    else groups['90+']++
  })
  return {
    tooltip: { trigger: 'axis', confine: true },
    grid: { top: 24, right: 16, bottom: 8, left: 8, containLabel: true },
    xAxis: { type: 'category', data: Object.keys(groups), axisLabel: { hideOverlap: true } },
    yAxis: { type: 'value', name: '人数' },
    series: [{ type: 'bar', data: Object.values(groups), itemStyle: { color: '#6366f1' }, barWidth: '50%' }],
  }
})
</script>

<template>
  <BasePage title="统计报表">
    <NCard class="mb-4">
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-500">统计账期：</span>
        <NDatePicker v-model:value="selectedMonthTs" type="month" style="width:160px" />
      </div>
    </NCard>

    <!-- 核心指标 -->
    <NGrid :x-gap="16" :y-gap="16" :cols="4" class="mb-4">
      <NGi>
        <NCard>
          <NStatistic label="在院总人数" :value="elderlyStore.list.filter(e => e.status === 'active').length" />
        </NCard>
      </NGi>
      <NGi>
        <NCard>
          <NStatistic label="床位入住率" :value="occupancyRate" suffix="%" />
        </NCard>
      </NGi>
      <NGi>
        <NCard>
          <NStatistic label="本月应收(元)" :value="feeStats.total_billed" :precision="2" />
        </NCard>
      </NGi>
      <NGi>
        <NCard>
          <div class="flex items-center justify-between">
            <NStatistic label="本月欠费(元)" :value="feeStats.overdue" :precision="2" />
            <NTag v-if="feeStats.overdue > 0" type="error">待催收</NTag>
          </div>
        </NCard>
      </NGi>
    </NGrid>

    <!-- 图表区 -->
    <NGrid :x-gap="16" :y-gap="16" cols="1 620:2">
      <NGi>
        <NCard title="老人在院状态分布">
          <BaseChart :option="elderlyStatusChart" height="260px" />
        </NCard>
      </NGi>
      <NGi>
        <NCard title="床位使用率">
          <BaseChart :option="bedUsageChart" height="260px" />
        </NCard>
      </NGi>
      <NGi>
        <NCard title="护理级别分布">
          <BaseChart :option="careLevelChart" height="260px" />
        </NCard>
      </NGi>
      <NGi>
        <NCard title="性别分布（在院）">
          <BaseChart :option="genderChart" height="260px" />
        </NCard>
      </NGi>
      <NGi span="1 620:2">
        <NCard title="年龄段分布（在院）">
          <BaseChart :option="ageGroupChart" height="240px" />
        </NCard>
      </NGi>
    </NGrid>
  </BasePage>
</template>
