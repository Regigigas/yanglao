import { u as use, s as src_default, i as install, a as install$1, b as install$2, c as install$3, d as install$4, e as install$5, f as install$6, g as install$7, h as install$8, j as install$9, k as install$a } from "./vendor-echarts-Bn4I93f0.js";
import { l as defineComponent, V as openBlock, U as createBlock, u as unref, aa as normalizeStyle, c as computed } from "./vendor-vue-C6_copC_.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BaseChart",
  props: {
    option: {},
    height: { default: "300px" },
    loading: { type: Boolean, default: false },
    autoresize: { type: Boolean, default: true }
  },
  setup(__props) {
    use([
      install,
      install$1,
      install$2,
      install$3,
      install$4,
      install$5,
      install$6,
      install$7,
      install$8,
      install$9,
      install$a
    ]);
    const props = __props;
    const style = computed(() => ({
      height: props.height,
      width: "100%",
      minWidth: 0,
      overflow: "hidden"
    }));
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(src_default), {
        option: __props.option,
        style: normalizeStyle(style.value),
        loading: __props.loading,
        autoresize: __props.autoresize
      }, null, 8, ["option", "style", "loading", "autoresize"]);
    };
  }
});
export {
  _sfc_main as _
};
