import { _ as _sfc_main$2 } from "./BaseTable.vue_vue_type_script_setup_true_lang-Kf6svQhn.js";
import "./vendor-echarts-DEbY5nl3.js";
import { _ as _sfc_main$1 } from "./BasePage.vue_vue_type_script_setup_true_lang-CoKRdyPV.js";
import "./index-77IpmxCe.js";
import { u as useAttendanceStore } from "./attendance.store-Bl1he8rD.js";
import { u as useUserStore } from "./user.store-CgFXZFBa.js";
import { u as usePageRefresh } from "./usePageRefresh-Wnx_lW1d.js";
import { v as NSpace, H as NDatePicker, J as NSelect, B as Button, g as NCard, o as NTag } from "./vendor-naive-sdNTCZPI.js";
import { l as defineComponent, r as ref, U as createBlock, W as withCtx, u as unref, V as openBlock, X as createVNode, a3 as createBaseVNode, k as createTextVNode, c as computed, q as h } from "./vendor-vue-Hc3ejqjp.js";
import "./vendor-query-CFvMrhIw.js";
import "./useAutoRefresh-BeuDS8Br.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "AttendanceReport" },
  __name: "AttendanceReportView",
  setup(__props) {
    const attendanceStore = useAttendanceStore();
    const userStore = useUserStore();
    const today = /* @__PURE__ */ new Date();
    const rangeStart = ref(new Date(today.getFullYear(), today.getMonth(), 1).getTime());
    const rangeEnd = ref(today.getTime());
    const selectedUserId = ref(null);
    function toDateStr(ts) {
      return new Date(ts).toISOString().slice(0, 10);
    }
    async function loadData() {
      await userStore.fetchList();
      await loadReport();
    }
    const { refresh, refreshing } = usePageRefresh(loadData);
    async function loadReport() {
      await attendanceStore.fetchRange(toDateStr(rangeStart.value), toDateStr(rangeEnd.value), selectedUserId.value ?? void 0);
    }
    const userOptions = computed(() => userStore.list.map((u) => ({ label: u.real_name, value: u.id })));
    function userName(id) {
      return userStore.list.find((u) => u.id === id)?.real_name ?? "—";
    }
    const statusTagType = {
      normal: "success",
      late: "warning",
      early_leave: "warning",
      absent: "error"
    };
    const statusLabel = {
      normal: "正常",
      late: "迟到",
      early_leave: "早退",
      absent: "缺卡"
    };
    const columns = [
      { title: "员工", key: "user_id", width: 110, render: (r) => userName(r.user_id) },
      { title: "日期", key: "clock_date", width: 110 },
      { title: "类型", key: "clock_type", width: 90, render: (r) => r.clock_type === "clock_in" ? "上班" : "下班" },
      { title: "打卡时间", key: "clock_at", width: 180 },
      { title: "状态", key: "status", width: 90, render: (r) => h(NTag, { type: statusTagType[r.status] ?? "success" }, () => statusLabel[r.status] ?? r.status) }
    ];
    const summary = computed(() => {
      const map = {};
      for (const r of attendanceStore.rangeRecords) {
        if (!map[r.user_id]) map[r.user_id] = { late: 0, early: 0, total: 0 };
        map[r.user_id].total++;
        if (r.status === "late") map[r.user_id].late++;
        if (r.status === "early_leave") map[r.user_id].early++;
      }
      return Object.entries(map).map(([userId, s]) => ({ userId, ...s }));
    });
    const summaryColumns = [
      { title: "员工", key: "userId", width: 110, render: (r) => userName(r.userId) },
      { title: "打卡总次数", key: "total", width: 100 },
      { title: "迟到次数", key: "late", width: 100 },
      { title: "早退次数", key: "early", width: 100 }
    ];
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), { title: "考勤报表" }, {
        default: withCtx(() => [
          createVNode(unref(NCard), { class: "mb-4" }, {
            default: withCtx(() => [
              createVNode(unref(NSpace), { align: "center" }, {
                default: withCtx(() => [
                  _cache[5] || (_cache[5] = createBaseVNode("span", null, "统计区间：", -1)),
                  createVNode(unref(NDatePicker), {
                    value: rangeStart.value,
                    "onUpdate:value": [
                      _cache[0] || (_cache[0] = ($event) => rangeStart.value = $event),
                      loadReport
                    ],
                    type: "date",
                    style: { "width": "150px" }
                  }, null, 8, ["value"]),
                  _cache[6] || (_cache[6] = createBaseVNode("span", null, "至", -1)),
                  createVNode(unref(NDatePicker), {
                    value: rangeEnd.value,
                    "onUpdate:value": [
                      _cache[1] || (_cache[1] = ($event) => rangeEnd.value = $event),
                      loadReport
                    ],
                    type: "date",
                    style: { "width": "150px" }
                  }, null, 8, ["value"]),
                  createVNode(unref(NSelect), {
                    value: selectedUserId.value,
                    "onUpdate:value": [
                      _cache[2] || (_cache[2] = ($event) => selectedUserId.value = $event),
                      loadReport
                    ],
                    options: userOptions.value,
                    clearable: "",
                    filterable: "",
                    placeholder: "按员工筛选",
                    style: { "width": "160px" }
                  }, null, 8, ["value", "options"]),
                  createVNode(unref(Button), { onClick: loadReport }, {
                    default: withCtx(() => [..._cache[3] || (_cache[3] = [
                      createTextVNode("查询", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    loading: unref(refreshing),
                    size: "small",
                    onClick: unref(refresh)
                  }, {
                    default: withCtx(() => [..._cache[4] || (_cache[4] = [
                      createTextVNode("刷新", -1)
                    ])]),
                    _: 1
                  }, 8, ["loading", "onClick"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          createVNode(unref(NCard), {
            title: "汇总统计",
            class: "mb-4"
          }, {
            default: withCtx(() => [
              createVNode(unref(_sfc_main$2), {
                columns: summaryColumns,
                data: summary.value,
                pagination: false
              }, null, 8, ["data"])
            ]),
            _: 1
          }),
          createVNode(unref(NCard), { title: "打卡明细" }, {
            default: withCtx(() => [
              createVNode(unref(_sfc_main$2), {
                columns,
                data: unref(attendanceStore).rangeRecords,
                loading: unref(attendanceStore).loading,
                pagination: { pageSize: 20 }
              }, null, 8, ["data", "loading"])
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
