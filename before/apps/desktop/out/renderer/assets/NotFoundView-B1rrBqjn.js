import { l as defineComponent, a1 as createElementBlock, X as createVNode, W as withCtx, u as unref, V as openBlock, k as createTextVNode, a2 as useRouter } from "./vendor-vue-Hc3ejqjp.js";
import { a3 as NResult, B as Button } from "./vendor-naive-HV2ECLT0.js";
const _hoisted_1 = { class: "flex-col-center h-full" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "NotFoundView",
  setup(__props) {
    const router = useRouter();
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createVNode(unref(NResult), {
          status: "404",
          title: "页面不存在",
          description: "你访问的页面可能已被删除或地址有误"
        }, {
          footer: withCtx(() => [
            createVNode(unref(Button), {
              type: "primary",
              onClick: _cache[0] || (_cache[0] = ($event) => unref(router).push("/"))
            }, {
              default: withCtx(() => [..._cache[1] || (_cache[1] = [
                createTextVNode("返回首页", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })
      ]);
    };
  }
});
export {
  _sfc_main as default
};
