import { d as useMotion } from "./index-CFdyZwJX.js";
import { l as defineComponent, W as openBlock, a2 as createElementBlock, s as renderSlot, r as ref } from "./vendor-vue-2vV4mHq_.js";
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
