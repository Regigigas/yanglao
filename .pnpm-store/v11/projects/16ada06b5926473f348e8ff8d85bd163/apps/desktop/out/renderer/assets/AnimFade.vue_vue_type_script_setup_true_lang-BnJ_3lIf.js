import { d as useMotion } from "./index-Y_pGVxO7.js";
import { l as defineComponent, V as openBlock, a1 as createElementBlock, s as renderSlot, r as ref } from "./vendor-vue-C6_copC_.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AnimFade",
  props: {
    durationMs: { default: 300 },
    delayMs: { default: 0 }
  },
  setup(__props) {
    const props = __props;
    const el = ref();
    useMotion(el, {
      initial: { opacity: 0 },
      enter: {
        opacity: 1,
        transition: { duration: props.durationMs, delay: props.delayMs }
      },
      leave: { opacity: 0, transition: { duration: props.durationMs } }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "el",
        ref: el
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 512);
    };
  }
});
export {
  _sfc_main as _
};
