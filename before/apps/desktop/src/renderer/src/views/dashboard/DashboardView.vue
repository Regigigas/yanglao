<script setup lang="ts">
defineOptions({ name: 'Dashboard' })
import { NGrid, NGi, NStatistic, NCard, NTag, NButton, NList, NListItem, NThing, NBadge } from 'naive-ui'
import { useElderlyStore } from '../../stores/elderly.store'
import { useSyncStore } from '../../stores/sync.store'
import { useBuildingStore } from '../../stores/building.store'
import { useNotificationStore } from '../../stores/notification.store'
import { useContractStore } from '../../stores/contract.store'
import { BasePage, BaseChart } from '@yanglao/ui'
import { formatDateTime, calcAge } from '@yanglao/core'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePageRefresh } from '../../composables/usePageRefresh'
import type { EChartsOption } from 'echarts'

const elderlyStore = useElderlyStore()
const syncStore = useSyncStore()
const buildingStore = useBuildingStore()
const notifyStore = useNotificationStore()
const contractStore = useContractStore()
const router = useRouter()

async function loadData() {
  await Promise.all([
    elderlyStore.fetchList(),
    buildingStore.fetchBedStats(),
    notifyStore.fetchUnreadCount(),
    notifyStore.fetchAll(),
    contractStore.fetchExpiring(30),
  ])
}
const { refresh, refreshing } = usePageRefresh(loadData)

// ── 统计指标 ─────────────────────────────────────
const activeCount   = computed(() => elderlyStore.list.filter(e => e.status === 'active').length)
const inactiveCount = computed(() => elderlyStore.list.filter(e => e.status === 'inactive').length)
const total         = computed(() => elderlyStore.list.length)

const occupancyRate = computed(() => {
  const t = buildingStore.bedStats.total
  return t ? Math.round(buildingStore.bedStats.occupied / t * 100) : 0
})

// ── 即将生日老人（7天内）─────────────────────────
const upcomingBirthdays = computed(() => {
  const today = new Date()
  return elderlyStore.list.filter(e => {
    if (!e.birth_date || e.status !== 'active') return false
    const bd = new Date(e.birth_date)
    const thisYear = new Date(today.getFullYear(), bd.getMonth(), bd.getDate())
    const diff = Math.ceil((thisYear.getTime() - today.getTime()) / 86400000)
    return diff >= 0 && diff <= 7
  }).map(e => {
    const bd = new Date(e.birth_date!)
    const thisYear = new Date(today.getFullYear(), bd.getMonth(), bd.getDate())
    const diff = Math.ceil((thisYear.getTime() - today.getTime()) / 86400000)
    return { ...e, daysLeft: diff }
  })
})

// ── 图表 ─────────────────────────────────────────
const genderChartOption = computed<EChartsOption>(() => {
  const male   = elderlyStore.list.filter(e => e.gender === 'male'   && e.status !== 'left').length
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
        { value: male,   name: '男', itemStyle: { color: '#409eff' } },
        { value: female, name: '女', itemStyle: { color: '#f56c6c' } },
      ],
    }],
  }
})

const careLevelChartOption = computed<EChartsOption>(() => {
  const labelMap: Record<string, string> = {
    level1: '一级（自理）', level2: '二级（半自理）',
    level3: '三级（不能自理）', level4: '四级（完全不能自理）',
  }
  const counts: Record<string, number> = {}
  elderlyStore.list.filter(e => e.status === 'active' && e.care_level).forEach(e => {
    counts[e.care_level!] = (counts[e.care_level!] ?? 0) + 1
  })
  return {
    tooltip: { trigger: 'item', confine: true },
    legend: { type: 'scroll', bottom: 0, left: 'center', itemWidth: 12, itemHeight: 8 },
    series: [{
      type: 'pie', radius: ['32%', '56%'], center: ['50%', '40%'],
      label: { show: false },
      labelLine: { show: false },
      emphasis: { label: { show: false } },
      data: Object.entries(counts).map(([k, v]) => ({ name: labelMap[k] ?? k, value: v })),
    }],
  }
})

const statusChartOption = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'axis', confine: true },
  grid: { top: 24, right: 12, bottom: 8, left: 8, containLabel: true },
  xAxis: { type: 'category', data: ['在院', '暂离', '离院'], axisLabel: { hideOverlap: true } },
  yAxis: { type: 'value', name: '人数' },
  series: [{
    type: 'bar', barWidth: '50%',
    data: [
      { value: elderlyStore.list.filter(e => e.status === 'active').length,   itemStyle: { color: '#18a058' } },
      { value: elderlyStore.list.filter(e => e.status === 'inactive').length, itemStyle: { color: '#f0a020' } },
      { value: elderlyStore.list.filter(e => e.status === 'left').length,     itemStyle: { color: '#d03050' } },
    ],
  }],
}))
</script>

<template>
  <BasePage title="首页概览">
    <template #header-extra>
      <NButton :loading="refreshing" size="small" @click="refresh">刷新</NButton>
    </template>
    <!-- 核心统计卡片 -->
    <NGrid :x-gap="16" :y-gap="16" :cols="4" class="mb-4">
      <NGi>
        <NCard hoverable @click="router.push('/elderly')" style="cursor:pointer">
          <NStatistic label="老人总数" :value="total" />
          <div class="text-xs text-gray-400 mt-2">在院 {{ activeCount }} | 暂离 {{ inactiveCount }}</div>
        </NCard>
      </NGi>
      <NGi>
        <NCard hoverable @click="router.push('/bed')" style="cursor:pointer">
          <NStatistic label="床位使用率" :value="occupancyRate" suffix="%" />
          <div class="text-xs text-gray-400 mt-2">共 {{ buildingStore.bedStats.total }} 张 | 空闲 {{ buildingStore.bedStats.available }} 张</div>
        </NCard>
      </NGi>
      <NGi>
        <NCard hoverable @click="router.push('/contract')" style="cursor:pointer">
          <NStatistic label="合同到期提醒" :value="contractStore.expiring.length" />
          <div class="text-xs text-orange-500 mt-2">{{ contractStore.expiring.length > 0 ? '30天内到期，请关注' : '暂无即将到期合同' }}</div>
        </NCard>
      </NGi>
      <NGi>
        <NCard hoverable @click="router.push('/sync')" style="cursor:pointer">
          <NStatistic label="待同步条数" :value="syncStore.pendingCount" />
          <div class="text-xs text-gray-400 mt-2">{{ syncStore.lastSyncAt ? '上次：' + formatDateTime(syncStore.lastSyncAt) : '尚未同步' }}</div>
        </NCard>
      </NGi>
    </NGrid>

    <!-- 图表区 + 通知侧栏 -->
    <NGrid :x-gap="16" :y-gap="16" cols="1 560:2 900:3">
      <!-- 性别分布 -->
      <NGi>
        <NCard title="性别分布">
          <BaseChart :option="genderChartOption" height="220px" />
        </NCard>
      </NGi>
      <!-- 护理级别 -->
      <NGi>
        <NCard title="护理级别分布">
          <BaseChart :option="careLevelChartOption" height="220px" />
        </NCard>
      </NGi>
      <!-- 在院状态 -->
      <NGi>
        <NCard title="在院状态分布">
          <BaseChart :option="statusChartOption" height="220px" />
        </NCard>
      </NGi>

      <!-- 生日提醒 -->
      <NGi>
        <NCard title="近7天生日">
          <div v-if="upcomingBirthdays.length === 0" class="text-gray-400 text-sm text-center py-4">近7天暂无老人生日</div>
          <NList v-else>
            <NListItem v-for="e in upcomingBirthdays" :key="e.id">
              <NThing :title="e.name">
                <template #description>
                  <NTag :type="e.daysLeft === 0 ? 'error' : 'warning'" size="small">
                    {{ e.daysLeft === 0 ? '今天生日' : `${e.daysLeft}天后` }}
                  </NTag>
                  <span class="ml-2 text-gray-400 text-xs">{{ calcAge(e.birth_date!) }} 岁</span>
                </template>
              </NThing>
            </NListItem>
          </NList>
        </NCard>
      </NGi>

      <!-- 合同到期 -->
      <NGi>
        <NCard title="合同即将到期">
          <div v-if="contractStore.expiring.length === 0" class="text-gray-400 text-sm text-center py-4">暂无即将到期合同</div>
          <NList v-else>
            <NListItem v-for="c in contractStore.expiring.slice(0, 5)" :key="c.id">
              <NThing :title="c.contract_no">
                <template #description>
                  <NTag type="warning" size="small">{{ formatDateTime(c.end_date) }} 到期</NTag>
                </template>
              </NThing>
            </NListItem>
          </NList>
          <NButton v-if="contractStore.expiring.length > 0" text type="primary" class="mt-2" @click="router.push('/contract')">
            查看全部 →
          </NButton>
        </NCard>
      </NGi>

      <!-- 系统通知 -->
      <NGi>
        <NCard title="系统通知">
          <template #header-extra>
            <NBadge v-if="notifyStore.unreadCount > 0" :value="notifyStore.unreadCount" :max="99" />
          </template>
          <div v-if="notifyStore.list.length === 0" class="text-gray-400 text-sm text-center py-4">暂无通知</div>
          <NList v-else>
            <NListItem v-for="n in notifyStore.list.slice(0, 5)" :key="n.id" style="cursor:pointer" @click="notifyStore.markRead(n.id)">
              <NThing :title="n.title">
                <template #header-extra>
                  <NTag v-if="!n.is_read" type="error" size="small">新</NTag>
                </template>
                <template #description>
                  <span class="text-xs text-gray-400">{{ n.content }}</span>
                </template>
              </NThing>
            </NListItem>
          </NList>
        </NCard>
      </NGi>
    </NGrid>
  </BasePage>
</template>
