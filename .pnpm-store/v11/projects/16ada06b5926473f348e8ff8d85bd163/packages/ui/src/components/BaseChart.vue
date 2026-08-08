<script setup lang="ts">
  /**
   * BaseChart - ECharts 封装
   * 内置按需加载：BarChart、GaugeChart、LineChart、PieChart
   * 如需其他图表类型，在 use() 数组中追加即可，不影响主包体积
   */
  import { use } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { BarChart, GaugeChart, LineChart, PieChart } from 'echarts/charts'
  import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    DatasetComponent,
    TransformComponent,
  } from 'echarts/components'
  import VChart from 'vue-echarts'
  import type { EChartsOption } from 'echarts'
  import { computed } from 'vue'

  // 按需注册，减少打包体积
  use([
    CanvasRenderer,
    BarChart,
    GaugeChart,
    LineChart,
    PieChart,
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    DatasetComponent,
    TransformComponent,
  ])

  interface Props {
    option: EChartsOption
    height?: string
    loading?: boolean
    autoresize?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    height: '300px',
    loading: false,
    autoresize: true,
  })

  const style = computed(() => ({
    height: props.height,
    width: '100%',
    minWidth: 0,
    overflow: 'hidden',
  }))
</script>

<template>
  <VChart
    :option="option"
    :style="style"
    :loading="loading"
    :autoresize="autoresize"
  />
</template>
