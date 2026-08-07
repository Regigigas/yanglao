import "./vendor-echarts-DEbY5nl3.js";
import { _ as _sfc_main$1 } from "./BasePage.vue_vue_type_script_setup_true_lang-CnaIdrBG.js";
import { _ as _sfc_main$2 } from "./AnimFade.vue_vue_type_script_setup_true_lang-D6lpagD7.js";
import { a as useSyncStore } from "./index-qSxYm2OB.js";
import { m as msToMinutes, f as formatDateTime, b as minutesToMs } from "./validators-BfKhytEl.js";
import { u as useMessage, v as NSpace, o as NTag, B as Button, i as NAlert, g as NCard, j as NForm, k as NFormItem, l as NInput, y as NText, J as NSelect, X as NDivider, _ as NSwitch, T as NInputNumber } from "./vendor-naive-DqQyyJr8.js";
import { l as defineComponent, o as onMounted, U as createBlock, W as withCtx, u as unref, r as ref, V as openBlock, X as createVNode, a3 as createBaseVNode, k as createTextVNode, a8 as toDisplayString, a1 as createElementBlock, a9 as createCommentVNode, c as computed } from "./vendor-vue-Hc3ejqjp.js";
import "./vendor-query-CFvMrhIw.js";
import "./vendor-utils-DD6FGs_H.js";
const _hoisted_1 = {
  key: 0,
  class: "text-xs text-gray-400"
};
const _hoisted_2 = { class: "ml-2 text-xs text-gray-400" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "SyncPanel" },
  __name: "SyncView",
  setup(__props) {
    const syncStore = useSyncStore();
    const message = useMessage();
    const saving = ref(false);
    const manualLoading = ref(false);
    const testing = ref(false);
    const testResult = ref(null);
    const form = ref({
      enabled: false,
      trigger: "manual",
      intervalMinutes: 5,
      // 自动同步间隔（分钟），映射为 intervalMs
      cronExpression: "0 9 * * *",
      fixedTimesStr: "09:00,18:00",
      serverUrl: "",
      accessToken: "",
      direction: "both"
    });
    onMounted(async () => {
      await syncStore.loadConfig();
      if (syncStore.config) {
        const c = syncStore.config;
        form.value = {
          enabled: c.enabled,
          trigger: c.trigger,
          intervalMinutes: msToMinutes(c.intervalMs),
          cronExpression: c.cronExpression ?? "0 9 * * *",
          fixedTimesStr: c.fixedTimes?.join(",") ?? "09:00,18:00",
          serverUrl: c.serverUrl,
          accessToken: c.accessToken ?? "",
          direction: c.direction
        };
      }
    });
    const triggerOptions = [
      { label: "手动触发", value: "manual" },
      { label: "自动间隔", value: "auto" },
      { label: "Cron定时", value: "scheduled" },
      { label: "固定时间", value: "timed" }
    ];
    const directionOptions = [
      { label: "双向同步", value: "both" },
      { label: "仅上传", value: "upload" },
      { label: "仅下载", value: "download" }
    ];
    const statusTag = computed(() => {
      const map = {
        idle: { type: "default", text: "空闲" },
        syncing: { type: "info", text: "同步中" },
        success: { type: "success", text: "成功" },
        error: { type: "error", text: "失败" },
        disabled: { type: "default", text: "已禁用" }
      };
      return map[syncStore.status] ?? map.idle;
    });
    async function handleSave() {
      saving.value = true;
      try {
        await syncStore.saveConfig({
          enabled: form.value.enabled,
          trigger: form.value.trigger,
          intervalMs: minutesToMs(form.value.intervalMinutes),
          // 分钟转 ms 存储
          cronExpression: form.value.trigger === "scheduled" ? form.value.cronExpression : void 0,
          fixedTimes: form.value.trigger === "timed" ? form.value.fixedTimesStr.split(",").map((s) => s.trim()).filter(Boolean) : void 0,
          serverUrl: form.value.serverUrl,
          accessToken: form.value.accessToken,
          direction: form.value.direction
        });
        message.success("配置已保存");
      } finally {
        saving.value = false;
      }
    }
    async function handleManual() {
      manualLoading.value = true;
      try {
        await syncStore.triggerManual();
        message.info("同步已触发，请稍候");
      } finally {
        manualLoading.value = false;
      }
    }
    async function handleTestConnection() {
      if (!form.value.serverUrl) {
        message.error("请先填写服务端地址");
        return;
      }
      testing.value = true;
      testResult.value = null;
      try {
        testResult.value = await window.api.lan.ping(form.value.serverUrl);
        const result = testResult.value;
        if (result?.ok) {
          message.success(`连接成功，延迟 ${result.latency}ms`);
        } else {
          message.error(`连接失败：${result?.error}`);
        }
      } finally {
        testing.value = false;
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), { title: "数据同步" }, {
        default: withCtx(() => [
          createVNode(unref(NCard), { class: "mb-4" }, {
            default: withCtx(() => [
              createVNode(unref(NSpace), {
                align: "center",
                justify: "space-between"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NSpace), {
                    align: "center",
                    size: 16
                  }, {
                    default: withCtx(() => [
                      _cache[8] || (_cache[8] = createBaseVNode("span", { class: "text-sm text-gray-600 dark:text-gray-300" }, "同步状态：", -1)),
                      createVNode(unref(NTag), {
                        type: statusTag.value.type
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(statusTag.value.text), 1)
                        ]),
                        _: 1
                      }, 8, ["type"]),
                      unref(syncStore).lastSyncAt ? (openBlock(), createElementBlock("span", _hoisted_1, " 上次同步: " + toDisplayString(unref(formatDateTime)(unref(syncStore).lastSyncAt)), 1)) : createCommentVNode("", true)
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NSpace), null, {
                    default: withCtx(() => [
                      unref(syncStore).pendingCount > 0 ? (openBlock(), createBlock(unref(NTag), {
                        key: 0,
                        type: "warning"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(unref(syncStore).pendingCount) + " 条待上传 ", 1)
                        ]),
                        _: 1
                      })) : createCommentVNode("", true),
                      createVNode(unref(Button), {
                        type: "primary",
                        loading: manualLoading.value || unref(syncStore).status === "syncing",
                        onClick: handleManual
                      }, {
                        default: withCtx(() => [..._cache[9] || (_cache[9] = [
                          createTextVNode(" 立即同步 ", -1)
                        ])]),
                        _: 1
                      }, 8, ["loading"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              unref(syncStore).lastError ? (openBlock(), createBlock(unref(NAlert), {
                key: 0,
                type: "error",
                class: "mt-3",
                title: unref(syncStore).lastError
              }, null, 8, ["title"])) : createCommentVNode("", true)
            ]),
            _: 1
          }),
          createVNode(unref(NCard), { title: "同步配置" }, {
            default: withCtx(() => [
              createVNode(unref(NForm), {
                model: form.value,
                "label-placement": "left",
                "label-width": "110"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), {
                    label: "服务端地址",
                    path: "serverUrl"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NSpace), {
                        vertical: "",
                        style: { "width": "100%" }
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(NSpace), { wrap: false }, {
                            default: withCtx(() => [
                              createVNode(unref(NInput), {
                                value: form.value.serverUrl,
                                "onUpdate:value": _cache[0] || (_cache[0] = ($event) => form.value.serverUrl = $event),
                                placeholder: "局域网主机示例：http://192.168.1.10:7788",
                                clearable: "",
                                style: { "width": "320px" }
                              }, null, 8, ["value"]),
                              createVNode(unref(Button), {
                                loading: testing.value,
                                onClick: handleTestConnection
                              }, {
                                default: withCtx(() => [..._cache[10] || (_cache[10] = [
                                  createTextVNode("测试连接", -1)
                                ])]),
                                _: 1
                              }, 8, ["loading"])
                            ]),
                            _: 1
                          }),
                          testResult.value ? (openBlock(), createBlock(unref(NTag), {
                            key: 0,
                            type: testResult.value.ok ? "success" : "error",
                            size: "small"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(testResult.value.ok ? `连接正常（${testResult.value.latency}ms）` : `连接失败：${testResult.value.error}`), 1)
                            ]),
                            _: 1
                          }, 8, ["type"])) : createCommentVNode("", true),
                          createVNode(unref(NText), {
                            depth: "3",
                            class: "text-xs"
                          }, {
                            default: withCtx(() => [..._cache[11] || (_cache[11] = [
                              createTextVNode(' 若要连接同一局域网内的主机电脑，请在主机的"系统设置"页开启"局域网联机主机模式"，并填写其显示的地址。 ', -1)
                            ])]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "访问令牌" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: form.value.accessToken,
                        "onUpdate:value": _cache[1] || (_cache[1] = ($event) => form.value.accessToken = $event),
                        type: "password",
                        "show-password-on": "click",
                        placeholder: "RuoYi 登录后获得的 Bearer Token",
                        clearable: "",
                        style: { "width": "320px" }
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "同步方向" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: form.value.direction,
                        "onUpdate:value": _cache[2] || (_cache[2] = ($event) => form.value.direction = $event),
                        options: directionOptions,
                        style: { "width": "160px" }
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NDivider)),
                  createVNode(unref(NFormItem), { label: "启用同步" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSwitch), {
                        value: form.value.enabled,
                        "onUpdate:value": _cache[3] || (_cache[3] = ($event) => form.value.enabled = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  form.value.enabled ? (openBlock(), createBlock(unref(NFormItem), {
                    key: 0,
                    label: "触发方式"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: form.value.trigger,
                        "onUpdate:value": _cache[4] || (_cache[4] = ($event) => form.value.trigger = $event),
                        options: triggerOptions,
                        style: { "width": "160px" }
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  })) : createCommentVNode("", true),
                  form.value.enabled && form.value.trigger === "auto" ? (openBlock(), createBlock(unref(_sfc_main$2), { key: 1 }, {
                    default: withCtx(() => [
                      createVNode(unref(NFormItem), { label: "同步间隔（分钟）" }, {
                        default: withCtx(() => [
                          createVNode(unref(NInputNumber), {
                            value: form.value.intervalMinutes,
                            "onUpdate:value": _cache[5] || (_cache[5] = ($event) => form.value.intervalMinutes = $event),
                            min: 1,
                            max: 1440,
                            placeholder: "5",
                            style: { "width": "160px" }
                          }, null, 8, ["value"]),
                          createBaseVNode("span", _hoisted_2, "= " + toDisplayString(unref(minutesToMs)(form.value.intervalMinutes)) + " ms", 1)
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })) : createCommentVNode("", true),
                  form.value.enabled && form.value.trigger === "scheduled" ? (openBlock(), createBlock(unref(_sfc_main$2), { key: 2 }, {
                    default: withCtx(() => [
                      createVNode(unref(NFormItem), { label: "Cron 表达式" }, {
                        default: withCtx(() => [
                          createVNode(unref(NInput), {
                            value: form.value.cronExpression,
                            "onUpdate:value": _cache[6] || (_cache[6] = ($event) => form.value.cronExpression = $event),
                            placeholder: "0 9 * * *",
                            style: { "width": "220px" }
                          }, null, 8, ["value"]),
                          _cache[12] || (_cache[12] = createBaseVNode("span", { class: "ml-2 text-xs text-gray-400" }, "（如每天9:00: 0 9 * * *）", -1))
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })) : createCommentVNode("", true),
                  form.value.enabled && form.value.trigger === "timed" ? (openBlock(), createBlock(unref(_sfc_main$2), { key: 3 }, {
                    default: withCtx(() => [
                      createVNode(unref(NFormItem), { label: "固定触发时间" }, {
                        default: withCtx(() => [
                          createVNode(unref(NInput), {
                            value: form.value.fixedTimesStr,
                            "onUpdate:value": _cache[7] || (_cache[7] = ($event) => form.value.fixedTimesStr = $event),
                            placeholder: "09:00,18:00",
                            style: { "width": "220px" }
                          }, null, 8, ["value"]),
                          _cache[13] || (_cache[13] = createBaseVNode("span", { class: "ml-2 text-xs text-gray-400" }, "多个时间用逗号分隔", -1))
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })) : createCommentVNode("", true),
                  createVNode(unref(NFormItem), null, {
                    default: withCtx(() => [
                      createVNode(unref(Button), {
                        type: "primary",
                        loading: saving.value,
                        onClick: handleSave
                      }, {
                        default: withCtx(() => [..._cache[14] || (_cache[14] = [
                          createTextVNode("保存配置", -1)
                        ])]),
                        _: 1
                      }, 8, ["loading"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["model"])
            ]),
            _: 1
          })
        ]),
        _: 1
      });
    };
  }
});
export {
  _sfc_main as default
};
