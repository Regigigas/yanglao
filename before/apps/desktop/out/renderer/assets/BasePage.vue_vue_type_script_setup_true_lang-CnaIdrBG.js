import { d as useMotion } from "./index-qSxYm2OB.js";
import { l as defineComponent, a1 as createElementBlock, a8 as toDisplayString, a9 as createCommentVNode, s as renderSlot, aa as normalizeStyle, V as openBlock, r as ref } from "./vendor-vue-Hc3ejqjp.js";
const _hoisted_1 = {
  key: 0,
  class: "page-header mb-4 flex items-center justify-between gap-4"
};
const _hoisted_2 = {
  key: 0,
  class: "text-xl font-semibold text-gray-800 dark:text-gray-100"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BasePage",
  props: {
    title: {},
    padding: { default: "24px" }
  },
  setup(__props) {
    const el = ref();
    useMotion(el, {
      initial: { opacity: 0, y: 16 },
      enter: { opacity: 1, y: 0, transition: { duration: 280, ease: "easeOut" } }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "el",
        ref: el,
        style: normalizeStyle({ padding: __props.padding }),
        class: "page-container min-h-full"
      }, [
        __props.title || _ctx.$slots["header-extra"] ? (openBlock(), createElementBlock("div", _hoisted_1, [
          __props.title ? (openBlock(), createElementBlock("h2", _hoisted_2, toDisplayString(__props.title), 1)) : createCommentVNode("", true),
          renderSlot(_ctx.$slots, "header-extra")
        ])) : createCommentVNode("", true),
        renderSlot(_ctx.$slots, "default")
      ], 4);
    };
  }
});
export {
  _sfc_main as _
};
