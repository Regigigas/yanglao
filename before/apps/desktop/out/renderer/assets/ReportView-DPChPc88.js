import { _ as _sfc_main$2 } from "./BaseChart.vue_vue_type_script_setup_true_lang-CDtSpnW2.js";
import { _ as _sfc_main$1 } from "./BasePage.vue_vue_type_script_setup_true_lang-CoKRdyPV.js";
import "./index-77IpmxCe.js";
import { u as useElderlyStore } from "./elderly.store-isfnimJX.js";
import { u as useBuildingStore } from "./building.store-ZepJ20td.js";
import { u as useFeeStore } from "./fee.store-hhm9SzRA.js";
import { l as defineComponent, o as onMounted, w as watch, U as createBlock, W as withCtx, u as unref, c as computed, r as ref, V as openBlock, X as createVNode, a3 as createBaseVNode, k as createTextVNode, a9 as createCommentVNode } from "./vendor-vue-Hc3ejqjp.js";
import { H as NDatePicker, g as NCard, M as NGi, O as NStatistic, o as NTag, P as NGrid } from "./vendor-naive-sdNTCZPI.js";
import "./vendor-echarts-DEbY5nl3.js";
import "./vendor-query-CFvMrhIw.js";
const _hoisted_1 = { class: "flex items-center gap-2" };
const _hoisted_2 = { class: "flex items-center justify-between" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "Report" },
  __name: "ReportView",
  setup(__props) {
    const elderlyStore = useElderlyStore();
    const buildingStore = useBuildingStore();
    const feeStore = useFeeStore();
    const selectedMonthTs = ref(Date.now());
    const selectedMonth = computed(() => new Date(selectedMonthTs.value).toISOString().slice(0, 7));
    const feeStats = ref({ total_billed: 0, total_paid: 0, overdue: 0 });
    onMounted(async () => {
      await Promise.all([elderlyStore.fetchList(), buildingStore.fetchAll()]);
      await loadFeeStats();
    });
    watch(selectedMonth, () => loadFeeStats());
    async function loadFeeStats() {
      try {
        feeStats.value = await feeStore.getStats(selectedMonth.value);
      } catch {
      }
    }
    const occupancyRate = computed(() => {
      const total = buildingStore.bedStats.total;
      if (!total) return 0;
      return Math.round(buildingStore.bedStats.occupied / total * 100);
    });
    const elderlyStatusChart = computed(() => {
      const active = elderlyStore.list.filter((e) => e.status === "active").length;
      const inactive = elderlyStore.list.filter((e) => e.status === "inactive").length;
      const left = elderlyStore.list.filter((e) => e.status === "left").length;
      return {
        tooltip: { trigger: "item", confine: true },
        legend: { type: "scroll", bottom: 0, left: "center", itemWidth: 12, itemHeight: 8 },
        series: [{
          type: "pie",
          radius: ["34%", "58%"],
          center: ["50%", "43%"],
          label: { show: false },
          labelLine: { show: false },
          emphasis: { label: { show: false } },
          data: [
            { value: active, name: "在院", itemStyle: { color: "#18a058" } },
            { value: inactive, name: "暂离", itemStyle: { color: "#f0a020" } },
            { value: left, name: "离院", itemStyle: { color: "#d03050" } }
          ]
        }]
      };
    });
    const careLevelChart = computed(() => {
      const levels = {};
      const labelMap = { level1: "一级（自理）", level2: "二级（半自理）", level3: "三级（不能自理）", level4: "四级（完全不能自理）" };
      elderlyStore.list.filter((e) => e.status === "active" && e.care_level).forEach((e) => {
        const key = e.care_level;
        levels[key] = (levels[key] ?? 0) + 1;
      });
      return {
        tooltip: { trigger: "item", confine: true },
        legend: { type: "scroll", bottom: 0, left: "center", itemWidth: 12, itemHeight: 8 },
        series: [{
          type: "pie",
          radius: "58%",
          center: ["50%", "41%"],
          label: { show: false },
          labelLine: { show: false },
          emphasis: { label: { show: false } },
          data: Object.entries(levels).map(([k, v]) => ({ value: v, name: labelMap[k] ?? k }))
        }]
      };
    });
    const genderChart = computed(() => {
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
    const bedUsageChart = computed(() => ({
      tooltip: { trigger: "item", confine: true },
      series: [{
        type: "gauge",
        radius: "76%",
        center: ["50%", "50%"],
        startAngle: 90,
        endAngle: -270,
        pointer: { show: false },
        progress: { show: true, roundCap: true, width: 16 },
        axisLine: { lineStyle: { width: 16, color: [[1, "#e5e7eb"]] } },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        anchor: { show: false },
        title: { show: false },
        detail: { valueAnimation: true, fontSize: 30, fontWeight: 600, offsetCenter: [0, 0], formatter: "{value}%" },
        data: [{ value: occupancyRate.value, name: "床位使用率", itemStyle: { color: "#18a058" } }]
      }]
    }));
    const ageGroupChart = computed(() => {
      const groups = { "60-69": 0, "70-79": 0, "80-89": 0, "90+": 0 };
      const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
      elderlyStore.list.filter((e) => e.status === "active" && e.birth_date).forEach((e) => {
        const age = currentYear - parseInt(e.birth_date.slice(0, 4));
        if (age < 70) groups["60-69"]++;
        else if (age < 80) groups["70-79"]++;
        else if (age < 90) groups["80-89"]++;
        else groups["90+"]++;
      });
      return {
        tooltip: { trigger: "axis", confine: true },
        grid: { top: 24, right: 16, bottom: 8, left: 8, containLabel: true },
        xAxis: { type: "category", data: Object.keys(groups), axisLabel: { hideOverlap: true } },
        yAxis: { type: "value", name: "人数" },
        series: [{ type: "bar", data: Object.values(groups), itemStyle: { color: "#6366f1" }, barWidth: "50%" }]
      };
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), { title: "统计报表" }, {
        default: withCtx(() => [
          createVNode(unref(NCard), { class: "mb-4" }, {
            default: withCtx(() => [
              createBaseVNode("div", _hoisted_1, [
                _cache[1] || (_cache[1] = createBaseVNode("span", { class: "text-sm text-gray-500" }, "统计账期：", -1)),
                createVNode(unref(NDatePicker), {
                  value: selectedMonthTs.value,
                  "onUpdate:value": _cache[0] || (_cache[0] = ($event) => selectedMonthTs.value = $event),
                  type: "month",
                  style: { "width": "160px" }
                }, null, 8, ["value"])
              ])
            ]),
            _: 1
          }),
          createVNode(unref(NGrid), {
            "x-gap": 16,
            "y-gap": 16,
            cols: 4,
            class: "mb-4"
          }, {
            default: withCtx(() => [
              createVNode(unref(NGi), null, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    default: withCtx(() => [
                      createVNode(unref(NStatistic), {
                        label: "在院总人数",
                        value: unref(elderlyStore).list.filter((e) => e.status === "active").length
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(NGi), null, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    default: withCtx(() => [
                      createVNode(unref(NStatistic), {
                        label: "床位入住率",
                        value: occupancyRate.value,
                        suffix: "%"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(NGi), null, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    default: withCtx(() => [
                      createVNode(unref(NStatistic), {
                        label: "本月应收(元)",
                        value: feeStats.value.total_billed,
                        precision: 2
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(NGi), null, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    default: withCtx(() => [
                      createBaseVNode("div", _hoisted_2, [
                        createVNode(unref(NStatistic), {
                          label: "本月欠费(元)",
                          value: feeStats.value.overdue,
                          precision: 2
                        }, null, 8, ["value"]),
                        feeStats.value.overdue > 0 ? (openBlock(), createBlock(unref(NTag), {
                          key: 0,
                          type: "error"
                        }, {
                          default: withCtx(() => [..._cache[2] || (_cache[2] = [
                            createTextVNode("待催收", -1)
                          ])]),
                          _: 1
                        })) : createCommentVNode("", true)
                      ])
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
            cols: "1 620:2"
          }, {
            default: withCtx(() => [
              createVNode(unref(NGi), null, {
                default: withCtx(() => [
                  createVNode(unref(NCard), { title: "老人在院状态分布" }, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$2), {
                        option: elderlyStatusChart.value,
                        height: "260px"
                      }, null, 8, ["option"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(NGi), null, {
                default: withCtx(() => [
                  createVNode(unref(NCard), { title: "床位使用率" }, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$2), {
                        option: bedUsageChart.value,
                        height: "260px"
                      }, null, 8, ["option"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(NGi), null, {
                default: withCtx(() => [
                  createVNode(unref(NCard), { title: "护理级别分布" }, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$2), {
                        option: careLevelChart.value,
                        height: "260px"
                      }, null, 8, ["option"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(NGi), null, {
                default: withCtx(() => [
                  createVNode(unref(NCard), { title: "性别分布（在院）" }, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$2), {
                        option: genderChart.value,
                        height: "260px"
                      }, null, 8, ["option"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(NGi), { span: "1 620:2" }, {
                default: withCtx(() => [
                  createVNode(unref(NCard), { title: "年龄段分布（在院）" }, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$2), {
                        option: ageGroupChart.value,
                        height: "240px"
                      }, null, 8, ["option"])
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
