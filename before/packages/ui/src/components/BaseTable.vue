<script setup lang="ts">
  import { NDataTable } from 'naive-ui'
  import type { DataTableProps } from 'naive-ui'
  import { useMotion } from '@vueuse/motion'
  import { computed, ref, useAttrs } from 'vue'

  defineOptions({ inheritAttrs: false })

  interface Props extends /* @vue-ignore */ Partial<DataTableProps> {
    /** 是否启用入场动画 */
    animated?: boolean
    /** 行 key，默认取 row.id */
    rowKey?: (row: any) => string | number
  }

  const props = withDefaults(defineProps<Props>(), {
    animated: true,
    striped: true,
    size: 'medium',
    rowKey: (row: any) => row?.id,
  })

  const wrapper = ref<HTMLElement>()
  const attrs = useAttrs()

  const DEFAULT_COLUMN_WIDTH = 120
  const DEFAULT_MAX_HEIGHT = 520

  type TableColumn = Record<string, any>
  type TableColumns = NonNullable<DataTableProps['columns']>
  type TableDimension = NonNullable<DataTableProps['scrollX']>

  function getLeafColumns(columns: TableColumn[]): TableColumn[] {
    return columns.flatMap((column) => {
      if (Array.isArray(column.children)) return getLeafColumns(column.children)
      return [column]
    })
  }

  function normalizeColumns(columns: unknown): TableColumns | undefined {
    if (!Array.isArray(columns)) return undefined

    const firstColumn = getLeafColumns(columns as TableColumn[])[0]
    const mapColumns = (items: TableColumn[]): TableColumn[] => items.map((column) => {
      if (Array.isArray(column.children)) {
        return { ...column, children: mapColumns(column.children) }
      }

      const isActionColumn = column.key === 'actions' || column.title === '操作'
      const fixed = column.fixed ?? (column === firstColumn ? 'left' : isActionColumn ? 'right' : undefined)
      if (!fixed) return column
      if (column.fixed && column.width !== undefined) return column

      return {
        ...column,
        fixed,
        width: column.width ?? column.minWidth ?? DEFAULT_COLUMN_WIDTH,
      }
    })

    return mapColumns(columns as TableColumn[]) as TableColumns
  }

  function getScrollWidth(columns: TableColumns | undefined) {
    if (!Array.isArray(columns)) return DEFAULT_COLUMN_WIDTH
    return getLeafColumns(columns as TableColumn[]).reduce((width, column) => {
      const columnWidth = column.width ?? column.minWidth
      return width + (typeof columnWidth === 'number' ? columnWidth : DEFAULT_COLUMN_WIDTH)
    }, 0)
  }

  function isTableDimension(value: unknown): value is TableDimension {
    return typeof value === 'string' || typeof value === 'number'
  }

  const tableColumns = computed(() => normalizeColumns(attrs.columns ?? props.columns))
  const tableScrollX = computed<TableDimension>(() => {
    const scrollX = attrs.scrollX ?? attrs['scroll-x'] ?? props.scrollX
    return isTableDimension(scrollX) ? scrollX : getScrollWidth(tableColumns.value)
  })
  const tableMaxHeight = computed<TableDimension>(() => {
    const maxHeight = attrs.maxHeight ?? attrs['max-height'] ?? props.maxHeight
    return isTableDimension(maxHeight) ? maxHeight : DEFAULT_MAX_HEIGHT
  })
  const tableAttrs = computed(() => {
    const { columns, scrollX, 'scroll-x': scrollXKebab, maxHeight, 'max-height': maxHeightKebab, ...rest } = attrs
    return rest
  })

  if (props.animated && typeof window !== 'undefined') {
    useMotion(wrapper, {
      initial: { opacity: 0, y: 10 },
      enter: { opacity: 1, y: 0, transition: { duration: 300 } },
    })
  }
</script>

<template>
  <div ref="wrapper" class="base-table-wrapper">
    <NDataTable
      v-bind="{ ...$props, ...tableAttrs }"
      :columns="tableColumns"
      :max-height="tableMaxHeight"
      :scroll-x="tableScrollX"
    >
      <template v-for="(_, name) in $slots" #[name]="slotProps">
        <slot :name="name" v-bind="slotProps ?? {}" />
      </template>
    </NDataTable>
  </div>
</template>
