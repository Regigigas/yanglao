import { d as useMotion } from "./index-qSxYm2OB.js";
import { l as defineComponent, af as useAttrs, V as openBlock, a1 as createElementBlock, X as createVNode, ag as createSlots, a6 as renderList, v as mergeProps, u as unref, r as ref, c as computed, W as withCtx, s as renderSlot, ah as normalizeProps, ai as guardReactiveProps, q as h, y as isVNode } from "./vendor-vue-Hc3ejqjp.js";
import { a3 as NDataTable, A as NPopover, v as NSpace, B as Button } from "./vendor-naive-DqQyyJr8.js";
const DEFAULT_COLUMN_WIDTH = 120;
const DEFAULT_MAX_HEIGHT = 520;
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ inheritAttrs: false },
  __name: "BaseTable",
  props: {
    animated: { type: Boolean, default: true },
    rowKey: { type: Function, default: (row) => row?.id },
    maxVisibleActions: { default: 2 },
    actionColumnWidth: { default: 180 }
  },
  setup(__props) {
    const props = __props;
    const wrapper = ref();
    const attrs = useAttrs();
    function getLeafColumns(columns) {
      return columns.flatMap((column) => {
        if (Array.isArray(column.children)) return getLeafColumns(column.children);
        return [column];
      });
    }
    function flattenActionItems(value, items = []) {
      if (Array.isArray(value)) {
        value.forEach((item) => flattenActionItems(item, items));
      } else if (value !== null && value !== void 0 && value !== false) {
        items.push(value);
      }
      return items;
    }
    function getActionItems(content) {
      if (Array.isArray(content)) return flattenActionItems(content);
      if (!isVNode(content) || content.type !== NSpace) return void 0;
      const children = content.children;
      if (Array.isArray(children)) return flattenActionItems(children);
      if (!children || typeof children !== "object") return void 0;
      const defaultSlot = children.default;
      return typeof defaultSlot === "function" ? flattenActionItems(defaultSlot()) : void 0;
    }
    function renderActionOverflow(content) {
      const items = getActionItems(content);
      const visibleCount = Math.max(0, Math.floor(props.maxVisibleActions));
      if (!items || items.length <= visibleCount) return content;
      const visibleItems = items.slice(0, visibleCount);
      const overflowItems = items.slice(visibleCount);
      return h(NSpace, { align: "center", size: 4, wrap: false }, {
        default: () => [
          ...visibleItems,
          h(NPopover, {
            placement: "bottom-end",
            showArrow: false,
            trigger: "click"
          }, {
            trigger: () => h(Button, {
              "aria-label": "更多操作",
              circle: true,
              quaternary: true,
              size: "small",
              title: "更多操作"
            }, {
              default: () => h("span", {
                style: {
                  display: "block",
                  fontSize: "16px",
                  letterSpacing: 0,
                  lineHeight: 1,
                  transform: "translateY(-2px)"
                }
              }, "...")
            }),
            default: () => h(NSpace, {
              size: 4,
              style: { minWidth: "88px" },
              vertical: true
            }, { default: () => overflowItems })
          })
        ]
      });
    }
    function normalizeColumns(columns) {
      if (!Array.isArray(columns)) return void 0;
      const firstColumn = getLeafColumns(columns)[0];
      const mapColumns = (items) => items.map((column) => {
        if (Array.isArray(column.children)) {
          return { ...column, children: mapColumns(column.children) };
        }
        const isActionColumn = column.key === "actions" || column.title === "操作";
        const fixed = column.fixed ?? (column === firstColumn ? "left" : isActionColumn ? "right" : void 0);
        if (!fixed) return column;
        const originalRender = column.render;
        const render = isActionColumn && typeof originalRender === "function" ? (...args) => renderActionOverflow(originalRender(...args)) : originalRender;
        const configuredWidth = column.width ?? column.minWidth ?? props.actionColumnWidth;
        const width = isActionColumn ? Math.min(configuredWidth, props.actionColumnWidth) : column.width ?? column.minWidth ?? DEFAULT_COLUMN_WIDTH;
        return {
          ...column,
          fixed,
          render,
          width
        };
      });
      return mapColumns(columns);
    }
    function getScrollWidth(columns) {
      if (!Array.isArray(columns)) return DEFAULT_COLUMN_WIDTH;
      return getLeafColumns(columns).reduce((width, column) => {
        const columnWidth = column.width ?? column.minWidth;
        return width + (typeof columnWidth === "number" ? columnWidth : DEFAULT_COLUMN_WIDTH);
      }, 0);
    }
    function isTableDimension(value) {
      return typeof value === "string" || typeof value === "number";
    }
    const tableColumns = computed(() => normalizeColumns(attrs.columns ?? props.columns));
    const tableScrollX = computed(() => {
      const scrollX = attrs.scrollX ?? attrs["scroll-x"] ?? props.scrollX;
      return isTableDimension(scrollX) ? scrollX : getScrollWidth(tableColumns.value);
    });
    const tableMaxHeight = computed(() => {
      const maxHeight = attrs.maxHeight ?? attrs["max-height"] ?? props.maxHeight;
      return isTableDimension(maxHeight) ? maxHeight : DEFAULT_MAX_HEIGHT;
    });
    const tableAttrs = computed(() => {
      const { columns, scrollX, "scroll-x": scrollXKebab, maxHeight, "max-height": maxHeightKebab, ...rest } = attrs;
      return rest;
    });
    const tableProps = computed(() => {
      const { animated, maxVisibleActions, actionColumnWidth, ...rest } = props;
      return rest;
    });
    if (props.animated && typeof window !== "undefined") {
      useMotion(wrapper, {
        initial: { opacity: 0, y: 10 },
        enter: { opacity: 1, y: 0, transition: { duration: 300 } }
      });
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "wrapper",
        ref: wrapper,
        class: "base-table-wrapper"
      }, [
        createVNode(unref(NDataTable), mergeProps({ ...tableProps.value, ...tableAttrs.value }, {
          columns: tableColumns.value,
          "max-height": tableMaxHeight.value,
          "scroll-x": tableScrollX.value
        }), createSlots({ _: 2 }, [
          renderList(_ctx.$slots, (_, name) => {
            return {
              name,
              fn: withCtx((slotProps) => [
                renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps ?? {})))
              ])
            };
          })
        ]), 1040, ["columns", "max-height", "scroll-x"])
      ], 512);
    };
  }
});
export {
  _sfc_main as _
};
