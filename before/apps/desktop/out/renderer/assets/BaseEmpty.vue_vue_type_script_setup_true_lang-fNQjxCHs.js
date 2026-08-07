import { D as NEmpty } from "./vendor-naive-DqQyyJr8.js";
import { l as defineComponent, V as openBlock, a1 as createElementBlock, X as createVNode, W as withCtx, s as renderSlot, u as unref } from "./vendor-vue-Hc3ejqjp.js";
const _hoisted_1 = { class: "flex items-center justify-center py-12" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BaseEmpty",
  props: {
    description: { default: "暂无数据" }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createVNode(unref(NEmpty), { description: __props.description }, {
          default: withCtx(() => [
            renderSlot(_ctx.$slots, "default")
          ]),
          _: 3
        }, 8, ["description"])
      ]);
    };
  }
});
export {
  _sfc_main as _
};
