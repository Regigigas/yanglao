import { u as useElderlyStore } from "./elderly.store-isfnimJX.js";
import { a as useSyncStore } from "./index-qSxYm2OB.js";
import { u as useBuildingStore } from "./building.store-ZepJ20td.js";
import { u as useNotificationStore } from "./notification.store-B8v7vQtJ.js";
import { u as useContractStore } from "./contract.store-D4-s-5Zg.js";
import { _ as _sfc_main$2 } from "./BaseChart.vue_vue_type_script_setup_true_lang-CDtSpnW2.js";
import { _ as _sfc_main$1 } from "./BasePage.vue_vue_type_script_setup_true_lang-CnaIdrBG.js";
import { f as formatDateTime } from "./validators-BfKhytEl.js";
import { c as calcAge } from "./format-o5PpBUQO.js";
import { l as defineComponent, U as createBlock, W as withCtx, u as unref, V as openBlock, X as createVNode, a3 as createBaseVNode, a8 as toDisplayString, a1 as createElementBlock, a6 as renderList, F as Fragment, k as createTextVNode, a9 as createCommentVNode, a2 as useRouter, c as computed } from "./vendor-vue-Hc3ejqjp.js";
import { u as usePageRefresh } from "./usePageRefresh-Wnx_lW1d.js";
import { M as NGridItem, g as NCard, O as NStatistic, P as NGrid, E as NList, B as Button, x as NBadge, K as NListItem, L as NThing, o as NTag } from "./vendor-naive-DqQyyJr8.js";
import "./vendor-query-CFvMrhIw.js";
import "./vendor-echarts-DEbY5nl3.js";
import "./vendor-utils-DD6FGs_H.js";
import "./useAutoRefresh-BeuDS8Br.js";
const _hoisted_1 = { class: "text-xs text-gray-400 mt-2" };
const _hoisted_2 = { class: "text-xs text-gray-400 mt-2" };
const _hoisted_3 = { class: "text-xs text-orange-500 mt-2" };
const _hoisted_4 = { class: "text-xs text-gray-400 mt-2" };
const _hoisted_5 = {
  key: 0,
  class: "text-gray-400 text-sm text-center py-4"
};
const _hoisted_6 = { class: "ml-2 text-gray-400 text-xs" };
const _hoisted_7 = {
  key: 0,
  class: "text-gray-400 text-sm text-center py-4"
};
const _hoisted_8 = {
  key: 0,
  class: "text-gray-400 text-sm text-center py-4"
};
const _hoisted_9 = { class: "text-xs text-gray-400" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "Dashboard" },
  __name: "DashboardView",
  setup(__props) {
    const elderlyStore = useElderlyStore();
    const syncStore = useSyncStore();
    const buildingStore = useBuildingStore();
    const notifyStore = useNotificationStore();
    const contractStore = useContractStore();
    const router = useRouter();
    async function loadData() {
      await Promise.all([
        elderlyStore.fetchList(),
        buildingStore.fetchBedStats(),
        notifyStore.fetchUnreadCount(),
        notifyStore.fetchAll(),
        contractStore.fetchExpiring(30)
      ]);
    }
    const { refresh, refreshing } = usePageRefresh(loadData);
    const activeCount = computed(() => elderlyStore.list.filter((e) => e.status === "active").length);
    const inactiveCount = computed(() => elderlyStore.list.filter((e) => e.status === "inactive").length);
    const total = computed(() => elderlyStore.list.length);
    const occupancyRate = computed(() => {
      const t = buildingStore.bedStats.total;
      return t ? Math.round(buildingStore.bedStats.occupied / t * 100) : 0;
    });
    const upcomingBirthdays = computed(() => {
      const today = /* @__PURE__ */ new Date();
      return elderlyStore.list.filter((e) => {
        if (!e.birth_date || e.status !== "active") return false;
        const bd = new Date(e.birth_date);
        const thisYear = new Date(today.getFullYear(), bd.getMonth(), bd.getDate());
        const diff = Math.ceil((thisYear.getTime() - today.getTime()) / 864e5);
        return diff >= 0 && diff <= 7;
      }).map((e) => {
        const bd = new Date(e.birth_date);
        const thisYear = new Date(today.getFullYear(), bd.getMonth(), bd.getDate());
        const diff = Math.ceil((thisYear.getTime() - today.getTime()) / 864e5);
        return { ...e, daysLeft: diff };
      });
    });
    const genderChartOption = computed(() => {
      const male = elderlyStore.list.filter((e) => e.gender === "male" && e.status !== "left").length;
      const female = elderlyStore.list.filter((e) => e.gender === "female" && e.status !== "left").length;
      return {
        tooltip: { trigger: "item", confine: true },
        legend: { type: "scroll", bottom: 0, left: "center", itemWidth: 12, itemHeight: 8 },
        series: [{
          type: "pie",
          radius: "58%",
          center: ["50%", "43%"],
          label: { show: false },
          labelLine: { show: false },
          emphasis: { label: { show: false } },
          data: [
            { value: male, name: "男", itemStyle: { color: "#409eff" } },
            { value: female, name: "女", itemStyle: { color: "#f56c6c" } }
          ]
        }]
      };
    });
    const careLevelChartOption = computed(() => {
      const labelMap = {
        level1: "一级（自理）",
        level2: "二级（半自理）",
        level3: "三级（不能自理）",
        level4: "四级（完全不能自理）"
      };
      const counts = {};
      elderlyStore.list.filter((e) => e.status === "active" && e.care_level).forEach((e) => {
        counts[e.care_level] = (counts[e.care_level] ?? 0) + 1;
      });
      return {
        tooltip: { trigger: "item", confine: true },
        legend: { type: "scroll", bottom: 0, left: "center", itemWidth: 12, itemHeight: 8 },
        series: [{
          type: "pie",
          radius: ["32%", "56%"],
          center: ["50%", "40%"],
          label: { show: false },
          labelLine: { show: false },
          emphasis: { label: { show: false } },
          data: Object.entries(counts).map(([k, v]) => ({ name: labelMap[k] ?? k, value: v }))
        }]
      };
    });
    const statusChartOption = computed(() => ({
      tooltip: { trigger: "axis", confine: true },
      grid: { top: 24, right: 12, bottom: 8, left: 8, containLabel: true },
      xAxis: { type: "category", data: ["在院", "暂离", "离院"], axisLabel: { hideOverlap: true } },
      yAxis: { type: "value", name: "人数" },
      series: [{
        type: "bar",
        barWidth: "50%",
        data: [
          { value: elderlyStore.list.filter((e) => e.status === "active").length, itemStyle: { color: "#18a058" } },
          { value: elderlyStore.list.filter((e) => e.status === "inactive").length, itemStyle: { color: "#f0a020" } },
          { value: elderlyStore.list.filter((e) => e.status === "left").length, itemStyle: { color: "#d03050" } }
        ]
      }]
    }));
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), { title: "首页概览" }, {
        "header-extra": withCtx(() => [
          createVNode(unref(Button), {
            loading: unref(refreshing),
            size: "small",
            onClick: unref(refresh)
          }, {
            default: withCtx(() => [..._cache[5] || (_cache[5] = [
              createTextVNode("刷新", -1)
            ])]),
            _: 1
          }, 8, ["loading", "onClick"])
        ]),
        default: withCtx(() => [
          createVNode(unref(NGrid), {
            "x-gap": 16,
            "y-gap": 16,
            cols: 4,
            class: "mb-4"
          }, {
            default: withCtx(() => [
              createVNode(unref(NGridItem), null, {
                default: withCtx(() => [
                  createVNode(unref(NCard), {
                    hoverable: "",
                    onClick: _cache[0] || (_cache[0] = ($event) => unref(router).push("/elderly")),
                    style: { "cursor": "pointer" }
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NStatistic), {
                        label: "老人总数",
                        value: total.value
                      }, null, 8, ["value"]),
                      createBaseVNode("div", _hoisted_1, "在院 " + toDisplayString(activeCount.value) + " | 暂离 " + toDisplayString(inactiveCount.value), 1)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(NGridItem), null, {
                default: withCtx(() => [
                  createVNode(unref(NCard), {
                    hoverable: "",
                    onClick: _cache[1] || (_cache[1] = ($event) => unref(router).push("/bed")),
                    style: { "cursor": "pointer" }
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NStatistic), {
                        label: "床位使用率",
                        value: occupancyRate.value,
                        suffix: "%"
                      }, null, 8, ["value"]),
                      createBaseVNode("div", _hoisted_2, "共 " + toDisplayString(unref(buildingStore).bedStats.total) + " 张 | 空闲 " + toDisplayString(unref(buildingStore).bedStats.available) + " 张", 1)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(NGridItem), null, {
                default: withCtx(() => [
                  createVNode(unref(NCard), {
                    hoverable: "",
                    onClick: _cache[2] || (_cache[2] = ($event) => unref(router).push("/contract")),
                    style: { "cursor": "pointer" }
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NStatistic), {
                        label: "合同到期提醒",
                        value: unref(contractStore).expiring.length
                      }, null, 8, ["value"]),
                      createBaseVNode("div", _hoisted_3, toDisplayString(unref(contractStore).expiring.length > 0 ? "30天内到期，请关注" : "暂无即将到期合同"), 1)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(NGridItem), null, {
                default: withCtx(() => [
                  createVNode(unref(NCard), {
                    hoverable: "",
                    onClick: _cache[3] || (_cache[3] = ($event) => unref(router).push("/sync")),
                    style: { "cursor": "pointer" }
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NStatistic), {
                        label: "待同步条数",
                        value: unref(syncStore).pendingCount
                      }, null, 8, ["value"]),
                      createBaseVNode("div", _hoisted_4, toDisplayString(unref(syncStore).lastSyncAt ? "上次：" + unref(formatDateTime)(unref(syncStore).lastSyncAt) : "尚未同步"), 1)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          createVNode(unref(NGrid), {
            "x-gap": 16,
            "y-gap": 16,
            cols: "1 560:2 900:3"
          }, {
            default: withCtx(() => [
              createVNode(unref(NGridItem), null, {
                default: withCtx(() => [
                  createVNode(unref(NCard), { title: "性别分布" }, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$2), {
                        option: genderChartOption.value,
                        height: "220px"
                      }, null, 8, ["option"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(NGridItem), null, {
                default: withCtx(() => [
                  createVNode(unref(NCard), { title: "护理级别分布" }, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$2), {
                        option: careLevelChartOption.value,
                        height: "220px"
                      }, null, 8, ["option"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(NGridItem), null, {
                default: withCtx(() => [
                  createVNode(unref(NCard), { title: "在院状态分布" }, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$2), {
                        option: statusChartOption.value,
                        height: "220px"
                      }, null, 8, ["option"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(NGridItem), null, {
                default: withCtx(() => [
                  createVNode(unref(NCard), { title: "近7天生日" }, {
                    default: withCtx(() => [
                      upcomingBirthdays.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_5, "近7天暂无老人生日")) : (openBlock(), createBlock(unref(NList), { key: 1 }, {
                        default: withCtx(() => [
                          (openBlock(true), createElementBlock(Fragment, null, renderList(upcomingBirthdays.value, (e) => {
                            return openBlock(), createBlock(unref(NListItem), {
                              key: e.id
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(NThing), {
                                  title: e.name
                                }, {
                                  description: withCtx(() => [
                                    createVNode(unref(NTag), {
                                      type: e.daysLeft === 0 ? "error" : "warning",
                                      size: "small"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(e.daysLeft === 0 ? "今天生日" : `${e.daysLeft}天后`), 1)
                                      ]),
                                      _: 2
                                    }, 1032, ["type"]),
                                    createBaseVNode("span", _hoisted_6, toDisplayString(unref(calcAge)(e.birth_date)) + " 岁", 1)
                                  ]),
                                  _: 2
                                }, 1032, ["title"])
                              ]),
                              _: 2
                            }, 1024);
                          }), 128))
                        ]),
                        _: 1
                      }))
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(NGridItem), null, {
                default: withCtx(() => [
                  createVNode(unref(NCard), { title: "合同即将到期" }, {
                    default: withCtx(() => [
                      unref(contractStore).expiring.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_7, "暂无即将到期合同")) : (openBlock(), createBlock(unref(NList), { key: 1 }, {
                        default: withCtx(() => [
                          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(contractStore).expiring.slice(0, 5), (c) => {
                            return openBlock(), createBlock(unref(NListItem), {
                              key: c.id
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(NThing), {
                                  title: c.contract_no
                                }, {
                                  description: withCtx(() => [
                                    createVNode(unref(NTag), {
                                      type: "warning",
                                      size: "small"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(unref(formatDateTime)(c.end_date)) + " 到期", 1)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1032, ["title"])
                              ]),
                              _: 2
                            }, 1024);
                          }), 128))
                        ]),
                        _: 1
                      })),
                      unref(contractStore).expiring.length > 0 ? (openBlock(), createBlock(unref(Button), {
                        key: 2,
                        text: "",
                        type: "primary",
                        class: "mt-2",
                        onClick: _cache[4] || (_cache[4] = ($event) => unref(router).push("/contract"))
                      }, {
                        default: withCtx(() => [..._cache[6] || (_cache[6] = [
                          createTextVNode(" 查看全部 → ", -1)
                        ])]),
                        _: 1
                      })) : createCommentVNode("", true)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(NGridItem), null, {
                default: withCtx(() => [
                  createVNode(unref(NCard), { title: "系统通知" }, {
                    "header-extra": withCtx(() => [
                      unref(notifyStore).unreadCount > 0 ? (openBlock(), createBlock(unref(NBadge), {
                        key: 0,
                        value: unref(notifyStore).unreadCount,
                        max: 99
                      }, null, 8, ["value"])) : createCommentVNode("", true)
                    ]),
                    default: withCtx(() => [
                      unref(notifyStore).list.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_8, "暂无通知")) : (openBlock(), createBlock(unref(NList), { key: 1 }, {
                        default: withCtx(() => [
                          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(notifyStore).list.slice(0, 5), (n) => {
                            return openBlock(), createBlock(unref(NListItem), {
                              key: n.id,
                              style: { "cursor": "pointer" },
                              onClick: ($event) => unref(notifyStore).markRead(n.id)
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(NThing), {
                                  title: n.title
                                }, {
                                  "header-extra": withCtx(() => [
                                    !n.is_read ? (openBlock(), createBlock(unref(NTag), {
                                      key: 0,
                                      type: "error",
                                      size: "small"
                                    }, {
                                      default: withCtx(() => [..._cache[7] || (_cache[7] = [
                                        createTextVNode("新", -1)
                                      ])]),
                                      _: 1
                                    })) : createCommentVNode("", true)
                                  ]),
                                  description: withCtx(() => [
                                    createBaseVNode("span", _hoisted_9, toDisplayString(n.content), 1)
                                  ]),
                                  _: 2
                                }, 1032, ["title"])
                              ]),
                              _: 2
                            }, 1032, ["onClick"]);
                          }), 128))
                        ]),
                        _: 1
                      }))
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
