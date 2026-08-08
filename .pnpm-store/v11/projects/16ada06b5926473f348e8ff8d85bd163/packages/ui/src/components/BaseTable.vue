<script setup lang="ts">
  import { NButton, NDataTable, NPopover, NSpace } from 'naive-ui'
  import type { DataTableProps } from 'naive-ui'
  import { useMotion } from '@vueuse/motion'
  import { computed, h, isVNode, ref, useAttrs } from 'vue'

  defineOptions({ inheritAttrs: false })

  interface Props extends /* @vue-ignore */ Partial<DataTableProps> {
    /** 是否启用入场动画 */
    animated?: boolean
    /** 行 key，默认取 row.id */
    rowKey?: (row: any) => string | number
    /** 操作列直接展示的最大操作数 */
    maxVisibleActions?: number
    /** 操作列的最大宽度 */
    actionColumnWidth?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    animated: true,
    striped: true,
    size: 'medium',
    rowKey: (row: any) => row?.id,
    maxVisibleActions: 2,
    actionColumnWidth: 180,
  })

  const wrapper = ref<HTMLElement>()
  const attrs = useAttrs()

  const DEFAULT_COLUMN_WIDTH = 120
  const DEFAULT_MAX_HEIGHT = 520

  type TableColumn = Record<string, any>
  type TableColumns = NonNullable<DataTableProps['columns']>
  type TableDimension = NonNullable<DataTableProps['scrollX']>
  type SlotChildren = { default?: () => unknown }

  function getLeafColumns(columns: TableColumn[]): TableColumn[] {
    return columns.flatMap((column) => {
      if (Array.isArray(column.children)) return getLeafColumns(column.children)
      return [column]
    })
  }

  function flattenActionItems(value: unknown, items: unknown[] = []): unknown[] {
    if (Array.isArray(value)) {
      value.forEach((item) => flattenActionItems(item, items))
    } else if (value !== null && value !== undefined && value !== false) {
      items.push(value)
    }
    return items
  }

  function getActionItems(content: unknown): unknown[] | undefined {
    if (Array.isArray(content)) return flattenActionItems(content)
    if (!isVNode(content) || content.type !== NSpace) return undefined

    const children = content.children
    if (Array.isArray(children)) return flattenActionItems(children)
    if (!children || typeof children !== 'object') return undefined

    const defaultSlot = (children as SlotChildren).default
    return typeof defaultSlot === 'function'
      ? flattenActionItems(defaultSlot())
      : undefined
  }

  function renderActionOverflow(content: unknown) {
    const items = getActionItems(content)
    const visibleCount = Math.max(0, Math.floor(props.maxVisibleActions))
    if (!items || items.length <= visibleCount) return content

    const visibleItems = items.slice(0, visibleCount)
    const overflowItems = items.slice(visibleCount)

    return h(NSpace, { align: 'center', size: 4, wrap: false }, {
      default: () => [
        ...visibleItems,
        h(NPopover, {
          placement: 'bottom-end',
          showArrow: false,
          trigger: 'click',
        }, {
          trigger: () => h(NButton, {
            'aria-label': '更多操作',
            circle: true,
            quaternary: true,
            size: 'small',
            title: '更多操作',
          }, {
            default: () => h('span', {
              style: {
                display: 'block',
                fontSize: '16px',
                letterSpacing: 0,
                lineHeight: 1,
                transform: 'translateY(-2px)',
              },
            }, '...'),
          }),
          default: () => h(NSpace, {
            size: 4,
            style: { minWidth: '88px' },
            vertical: true,
          }, { default: () => overflowItems }),
        }),
      ],
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

      const originalRender = column.render
      const render = isActionColumn && typeof originalRender === 'function'
        ? (...args: any[]) => renderActionOverflow(originalRender(...args))
        : originalRender
      const configuredWidth = column.width ?? column.minWidth ?? props.actionColumnWidth
      const width = isActionColumn
        ? Math.min(configuredWidth, props.actionColumnWidth)
        : column.width ?? column.minWidth ?? DEFAULT_COLUMN_WIDTH

      return {
        ...column,
        fixed,
        render,
        width,
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
  const tableProps = computed(() => {
    const { animated, maxVisibleActions, actionColumnWidth, ...rest } = props
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
      v-bind="{ ...tableProps, ...tableAttrs }"
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
