import "./vendor-echarts-DEbY5nl3.js";
import { _ as _sfc_main$1 } from "./BasePage.vue_vue_type_script_setup_true_lang-D7sGS98F.js";
import { b as useTheme } from "./index-rYee39mb.js";
import { S as defineStore, r as ref, l as defineComponent, o as onMounted, U as createBlock, W as withCtx, u as unref, V as openBlock, X as createVNode, k as createTextVNode, a3 as createBaseVNode, a8 as toDisplayString, a9 as createCommentVNode, a1 as createElementBlock, F as Fragment, a6 as renderList, c as computed } from "./vendor-vue-Hc3ejqjp.js";
import { i as initAutoRefresh } from "./useAutoRefresh-BeuDS8Br.js";
import { D as DatabaseSafetyPanel } from "./DatabaseSafetyPanel-B3C15HhC.js";
import { u as useMessage, k as NFormItem, _ as NSwitch, g as NCard, i as NAlert, j as NForm, v as NSpace, o as NTag, y as NText, B as Button, J as NSelect, T as NInputNumber, X as NDivider, l as NInput } from "./vendor-naive-HV2ECLT0.js";
import "./vendor-query-CFvMrhIw.js";
import "./iconify-DIn4WxPo.js";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
const useLanStore = defineStore("lan", () => {
  const config = ref(null);
  const status = ref({ running: false, port: 7788, urls: [] });
  const ips = ref([]);
  const loading = ref(false);
  async function fetchConfig() {
    config.value = await window.api.lan.getConfig();
  }
  async function fetchStatus() {
    status.value = await window.api.lan.getStatus();
  }
  async function fetchIPs() {
    ips.value = await window.api.lan.getIPs();
  }
  async function fetchAll() {
    loading.value = true;
    try {
      await Promise.all([fetchConfig(), fetchStatus(), fetchIPs()]);
    } finally {
      loading.value = false;
    }
  }
  async function saveConfig(cfg) {
    await window.api.lan.saveConfig(cfg);
    await fetchConfig();
  }
  async function start(port) {
    const res = await window.api.lan.start(port);
    if (res.ok) {
      status.value = res.status;
      await saveConfig({ enabled: 1, port: port ?? config.value?.port });
    }
    return res;
  }
  async function stop() {
    const res = await window.api.lan.stop();
    status.value = res.status;
    await saveConfig({ enabled: 0 });
    return res;
  }
  async function pingUrl(url) {
    return window.api.lan.ping(url);
  }
  return {
    config,
    status,
    ips,
    loading,
    fetchAll,
    fetchConfig,
    fetchStatus,
    fetchIPs,
    saveConfig,
    start,
    stop,
    pingUrl
  };
});
const _hoisted_1 = {
  key: 0,
  class: "mb-4"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "Settings" },
  __name: "SettingsView",
  setup(__props) {
    const { isDark, toggle } = useTheme();
    const lanStore = useLanStore();
    const message = useMessage();
    const starting = ref(false);
    const portInput = ref(7788);
    const secretInput = ref("");
    const allowWrite = ref(true);
    const dbPathInfo = ref(null);
    const dbPathSaving = ref(false);
    const autoRefreshSec = ref(0);
    const autoRefreshSaving = ref(false);
    const autoRefreshPresets = [
      { label: "关闭（手动刷新）", value: 0 },
      { label: "每 30 秒", value: 30 },
      { label: "每 1 分钟", value: 60 },
      { label: "每 5 分钟", value: 300 },
      { label: "每 10 分钟", value: 600 },
      { label: "每 30 分钟", value: 1800 },
      { label: "自定义秒数", value: -1 }
    ];
    const useCustomInterval = computed(
      () => autoRefreshSec.value > 0 && !autoRefreshPresets.some((p) => p.value === autoRefreshSec.value && p.value !== -1)
    );
    const presetSelected = computed({
      get() {
        const found = autoRefreshPresets.find((p) => p.value === autoRefreshSec.value);
        return found ? found.value : -1;
      },
      set(v) {
        if (v === -1) {
          if (autoRefreshSec.value <= 0) autoRefreshSec.value = 60;
        } else {
          autoRefreshSec.value = v;
        }
      }
    });
    onMounted(async () => {
      await lanStore.fetchAll();
      if (lanStore.config) {
        portInput.value = lanStore.config.port;
        secretInput.value = lanStore.config.secret ?? "";
        allowWrite.value = lanStore.config.allow_write === 1;
      }
      dbPathInfo.value = await window.api.db.getPath();
      const appCfg = await window.api.config.app.get();
      autoRefreshSec.value = appCfg.autoRefreshSec ?? 0;
    });
    const running = computed(() => lanStore.status.running);
    async function handleToggleHost(value) {
      starting.value = true;
      try {
        if (value) {
          await lanStore.saveConfig({
            port: portInput.value,
            allow_write: allowWrite.value ? 1 : 0,
            secret: secretInput.value || null
          });
          const res = await lanStore.start(portInput.value);
          if (res.ok) {
            await lanStore.fetchAll();
            secretInput.value = lanStore.config?.secret ?? "";
            message.success("局域网主机服务已启动");
          } else {
            message.error(res.error ?? "启动失败");
          }
        } else {
          await lanStore.stop();
          message.info("局域网主机服务已停止");
        }
      } finally {
        starting.value = false;
      }
    }
    async function handleSaveHostConfig() {
      await lanStore.saveConfig({
        port: portInput.value,
        allow_write: allowWrite.value ? 1 : 0,
        secret: secretInput.value || null
      });
      await lanStore.fetchAll();
      secretInput.value = lanStore.config?.secret ?? "";
      message.success("配置已保存");
      if (running.value) {
        message.warning("端口变更需重启主机服务才能生效");
      }
    }
    function copyUrl(url) {
      navigator.clipboard?.writeText(url);
      message.success("已复制：" + url);
    }
    async function handleSelectDbPath() {
      const result = await window.api.db.selectPath();
      if (result.canceled || !result.path) return;
      dbPathSaving.value = true;
      try {
        await window.api.db.setPath(result.path);
        dbPathInfo.value = await window.api.db.getPath();
        message.warning("数据库路径已更改，重启应用后新路径生效。新路径不含原有数据，需要手动复制原数据库文件。");
      } finally {
        dbPathSaving.value = false;
      }
    }
    async function handleResetDbPath() {
      dbPathSaving.value = true;
      try {
        await window.api.db.resetPath();
        dbPathInfo.value = await window.api.db.getPath();
        message.warning("已恢复为默认路径，重启应用后生效。");
      } finally {
        dbPathSaving.value = false;
      }
    }
    async function handleSaveAutoRefresh() {
      if (autoRefreshSec.value < 0) autoRefreshSec.value = 0;
      autoRefreshSaving.value = true;
      try {
        await window.api.config.app.set({ autoRefreshSec: autoRefreshSec.value });
        initAutoRefresh(autoRefreshSec.value);
        if (autoRefreshSec.value > 0) {
          message.success(`自动刷新已启用，每 ${autoRefreshSec.value} 秒刷新一次`);
        } else {
          message.info("自动刷新已关闭");
        }
      } finally {
        autoRefreshSaving.value = false;
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), { title: "系统设置" }, {
        default: withCtx(() => [
          createVNode(unref(NCard), {
            title: "外观",
            class: "mb-4"
          }, {
            default: withCtx(() => [
              createVNode(unref(NFormItem), { label: "深色模式" }, {
                default: withCtx(() => [
                  createVNode(unref(NSwitch), {
                    value: unref(isDark),
                    "onUpdate:value": unref(toggle)
                  }, null, 8, ["value", "onUpdate:value"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          createVNode(unref(NCard), {
            title: "数据安全与备份",
            class: "mb-4"
          }, {
            default: withCtx(() => [
              createVNode(DatabaseSafetyPanel)
            ]),
            _: 1
          }),
          createVNode(unref(NCard), {
            title: "数据库文件位置",
            class: "mb-4"
          }, {
            default: withCtx(() => [
              createVNode(unref(NAlert), {
                type: "info",
                class: "mb-4"
              }, {
                default: withCtx(() => [..._cache[5] || (_cache[5] = [
                  createTextVNode(" 应用数据存储在本地 SQLite 文件中。默认保存在系统 userData 目录，您可以将其指向网络共享目录（NAS/局域网盘） 以实现多台电脑共用同一数据库，", -1),
                  createBaseVNode("b", null, "但请确保同一时刻只有一台电脑写入", -1),
                  createTextVNode("，否则可能导致数据损坏。 修改路径需要", -1),
                  createBaseVNode("b", null, "重启应用", -1),
                  createTextVNode("后才能生效，且新路径下不含原有数据——如需迁移，请在修改前手动将原数据库文件复制到新位置。 ", -1)
                ])]),
                _: 1
              }),
              createVNode(unref(NForm), {
                "label-placement": "left",
                "label-width": "100"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), { label: "当前路径" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSpace), {
                        vertical: "",
                        style: { "width": "100%" }
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(NSpace), {
                            align: "center",
                            wrap: false
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(NTag), {
                                type: dbPathInfo.value?.isCustom ? "warning" : "default",
                                size: "small"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(dbPathInfo.value?.isCustom ? "自定义" : "默认"), 1)
                                ]),
                                _: 1
                              }, 8, ["type"]),
                              createVNode(unref(NText), {
                                style: { "font-family": "monospace", "font-size": "12px", "word-break": "break-all", "flex": "1" },
                                depth: "2"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(dbPathInfo.value?.current ?? "加载中..."), 1)
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          dbPathInfo.value?.isCustom ? (openBlock(), createBlock(unref(NText), {
                            key: 0,
                            depth: "3",
                            class: "text-xs"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" 默认路径：" + toDisplayString(dbPathInfo.value.default), 1)
                            ]),
                            _: 1
                          })) : createCommentVNode("", true)
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), null, {
                    default: withCtx(() => [
                      createVNode(unref(NSpace), null, {
                        default: withCtx(() => [
                          createVNode(unref(Button), {
                            type: "primary",
                            loading: dbPathSaving.value,
                            onClick: handleSelectDbPath
                          }, {
                            default: withCtx(() => [..._cache[6] || (_cache[6] = [
                              createTextVNode(" 更改位置... ", -1)
                            ])]),
                            _: 1
                          }, 8, ["loading"]),
                          dbPathInfo.value?.isCustom ? (openBlock(), createBlock(unref(Button), {
                            key: 0,
                            loading: dbPathSaving.value,
                            onClick: handleResetDbPath
                          }, {
                            default: withCtx(() => [..._cache[7] || (_cache[7] = [
                              createTextVNode(" 恢复默认 ", -1)
                            ])]),
                            _: 1
                          }, 8, ["loading"])) : createCommentVNode("", true)
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          createVNode(unref(NCard), {
            title: "数据自动刷新",
            class: "mb-4"
          }, {
            default: withCtx(() => [
              createVNode(unref(NAlert), {
                type: "info",
                class: "mb-4"
              }, {
                default: withCtx(() => [..._cache[8] || (_cache[8] = [
                  createTextVNode(' 开启后，各数据页面会按设定的间隔自动从数据库重新获取最新数据（无需手动点击刷新按钮）。 每个页面右上角也提供了"刷新"按钮，可随时手动刷新当前页面数据。 ', -1)
                ])]),
                _: 1
              }),
              createVNode(unref(NForm), {
                "label-placement": "left",
                "label-width": "100"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), { label: "刷新间隔" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSpace), { align: "center" }, {
                        default: withCtx(() => [
                          createVNode(unref(NSelect), {
                            value: presetSelected.value,
                            "onUpdate:value": _cache[0] || (_cache[0] = ($event) => presetSelected.value = $event),
                            options: autoRefreshPresets,
                            style: { "width": "180px" }
                          }, null, 8, ["value"]),
                          useCustomInterval.value || presetSelected.value === -1 ? (openBlock(), createBlock(unref(NInputNumber), {
                            key: 0,
                            value: autoRefreshSec.value,
                            "onUpdate:value": _cache[1] || (_cache[1] = ($event) => autoRefreshSec.value = $event),
                            min: 5,
                            max: 3600,
                            style: { "width": "140px" }
                          }, null, 8, ["value"])) : createCommentVNode("", true),
                          autoRefreshSec.value > 0 ? (openBlock(), createBlock(unref(NText), {
                            key: 1,
                            depth: "3",
                            class: "text-xs"
                          }, {
                            default: withCtx(() => [..._cache[9] || (_cache[9] = [
                              createTextVNode("秒", -1)
                            ])]),
                            _: 1
                          })) : createCommentVNode("", true)
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), null, {
                    default: withCtx(() => [
                      createVNode(unref(Button), {
                        type: "primary",
                        loading: autoRefreshSaving.value,
                        onClick: handleSaveAutoRefresh
                      }, {
                        default: withCtx(() => [..._cache[10] || (_cache[10] = [
                          createTextVNode(" 保存并立即生效 ", -1)
                        ])]),
                        _: 1
                      }, 8, ["loading"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          createVNode(unref(NCard), {
            title: "局域网联机 · 主机模式",
            class: "mb-4"
          }, {
            default: withCtx(() => [
              createVNode(unref(NAlert), {
                type: "info",
                class: "mb-4"
              }, {
                default: withCtx(() => [..._cache[11] || (_cache[11] = [
                  createTextVNode(' 开启后，本机将作为局域网内的数据同步中心。其他电脑只需在"数据同步"页面， 将服务端地址设置为本机的局域网地址（如下方列出），即可与本机互通数据，无需额外服务器。 ', -1)
                ])]),
                _: 1
              }),
              createVNode(unref(NSpace), {
                align: "center",
                class: "mb-4"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NSwitch), {
                    value: running.value,
                    loading: starting.value,
                    "onUpdate:value": handleToggleHost
                  }, null, 8, ["value", "loading"]),
                  createVNode(unref(NTag), {
                    type: running.value ? "success" : "default"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(running.value ? "运行中" : "已停止"), 1)
                    ]),
                    _: 1
                  }, 8, ["type"]),
                  running.value ? (openBlock(), createBlock(unref(NText), {
                    key: 0,
                    depth: "3",
                    class: "text-sm"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("监听端口：" + toDisplayString(unref(lanStore).status.port), 1)
                    ]),
                    _: 1
                  })) : createCommentVNode("", true)
                ]),
                _: 1
              }),
              running.value && unref(lanStore).status.urls.length ? (openBlock(), createElementBlock("div", _hoisted_1, [
                createVNode(unref(NText), {
                  depth: "2",
                  class: "text-sm"
                }, {
                  default: withCtx(() => [..._cache[12] || (_cache[12] = [
                    createTextVNode('其他电脑请填写以下任一地址作为"服务端地址"：', -1)
                  ])]),
                  _: 1
                }),
                createVNode(unref(NSpace), {
                  vertical: "",
                  class: "mt-2"
                }, {
                  default: withCtx(() => [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(unref(lanStore).status.urls, (url) => {
                      return openBlock(), createBlock(unref(NSpace), {
                        key: url,
                        align: "center"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(NTag), {
                            type: "info",
                            size: "large",
                            style: { "font-family": "monospace" }
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(url), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(Button), {
                            size: "small",
                            onClick: ($event) => copyUrl(url)
                          }, {
                            default: withCtx(() => [..._cache[13] || (_cache[13] = [
                              createTextVNode("复制", -1)
                            ])]),
                            _: 1
                          }, 8, ["onClick"])
                        ]),
                        _: 2
                      }, 1024);
                    }), 128))
                  ]),
                  _: 1
                })
              ])) : running.value && !unref(lanStore).status.urls.length ? (openBlock(), createBlock(unref(NAlert), {
                key: 1,
                type: "warning",
                class: "mb-4"
              }, {
                default: withCtx(() => [..._cache[14] || (_cache[14] = [
                  createTextVNode(" 未检测到局域网网卡地址，请确认本机已连接局域网/WiFi。 ", -1)
                ])]),
                _: 1
              })) : createCommentVNode("", true),
              createVNode(unref(NDivider)),
              createVNode(unref(NForm), {
                "label-placement": "left",
                "label-width": "120"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), { label: "监听端口" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInputNumber), {
                        value: portInput.value,
                        "onUpdate:value": _cache[2] || (_cache[2] = ($event) => portInput.value = $event),
                        min: 1024,
                        max: 65535,
                        style: { "width": "160px" }
                      }, null, 8, ["value"]),
                      createVNode(unref(NText), {
                        depth: "3",
                        class: "ml-2 text-xs"
                      }, {
                        default: withCtx(() => [..._cache[15] || (_cache[15] = [
                          createTextVNode("默认 7788，如被占用可修改", -1)
                        ])]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "允许客户端写入" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSwitch), {
                        value: allowWrite.value,
                        "onUpdate:value": _cache[3] || (_cache[3] = ($event) => allowWrite.value = $event)
                      }, null, 8, ["value"]),
                      createVNode(unref(NText), {
                        depth: "3",
                        class: "ml-2 text-xs"
                      }, {
                        default: withCtx(() => [..._cache[16] || (_cache[16] = [
                          createTextVNode("关闭后仅允许其他电脑下载数据，不能上传变更", -1)
                        ])]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "访问密钥" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: secretInput.value,
                        "onUpdate:value": _cache[4] || (_cache[4] = ($event) => secretInput.value = $event),
                        placeholder: "留空启动时自动生成",
                        style: { "width": "260px" }
                      }, null, 8, ["value"]),
                      createVNode(unref(NText), {
                        depth: "3",
                        class: "ml-2 text-xs"
                      }, {
                        default: withCtx(() => [..._cache[17] || (_cache[17] = [
                          createTextVNode("其他电脑请将此密钥填入数据同步的访问令牌", -1)
                        ])]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), null, {
                    default: withCtx(() => [
                      createVNode(unref(Button), {
                        type: "primary",
                        onClick: handleSaveHostConfig
                      }, {
                        default: withCtx(() => [..._cache[18] || (_cache[18] = [
                          createTextVNode("保存配置", -1)
                        ])]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
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
