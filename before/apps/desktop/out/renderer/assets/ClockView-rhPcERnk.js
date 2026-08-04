import { _ as _sfc_main$2 } from "./BaseTable.vue_vue_type_script_setup_true_lang-Kf6svQhn.js";
import "./vendor-echarts-DEbY5nl3.js";
import { _ as _sfc_main$1 } from "./BasePage.vue_vue_type_script_setup_true_lang-CoKRdyPV.js";
import { u as useAuthStore } from "./index-77IpmxCe.js";
import { u as useAttendanceStore } from "./attendance.store-Bl1he8rD.js";
import { d as dayjs, f as formatDateTime } from "./validators-BfKhytEl.js";
import { u as usePageRefresh } from "./usePageRefresh-Wnx_lW1d.js";
import { u as useMessage, M as NGi, g as NCard, O as NStatistic, o as NTag, v as NSpace, B as Button, P as NGrid, U as NTabs, T as NTabPane, Y as NCalendar, A as NPopover, V as NProgress } from "./vendor-naive-sdNTCZPI.js";
import { l as defineComponent, o as onMounted, I as onUnmounted, r as ref, w as watch, U as createBlock, W as withCtx, u as unref, c as computed, V as openBlock, X as createVNode, a3 as createBaseVNode, k as createTextVNode, a8 as toDisplayString, a1 as createElementBlock, a6 as renderList, F as Fragment, a9 as createCommentVNode, aa as normalizeStyle, q as h, J as normalizeClass } from "./vendor-vue-Hc3ejqjp.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./vendor-query-CFvMrhIw.js";
import "./vendor-utils-DD6FGs_H.js";
import "./useAutoRefresh-BeuDS8Br.js";
const _hoisted_1 = { class: "mt-2" };
const _hoisted_2 = { class: "text-sm font-medium ml-2" };
const _hoisted_3 = { class: "text-sm text-gray-500 ml-2" };
const _hoisted_4 = { class: "week-grid mb-4" };
const _hoisted_5 = { class: "week-day-label" };
const _hoisted_6 = { class: "week-day-date" };
const _hoisted_7 = {
  key: 0,
  class: "week-day-times"
};
const _hoisted_8 = { class: "cal-cell-wrap" };
const _hoisted_9 = { class: "cal-popover" };
const _hoisted_10 = { class: "cal-popover-title" };
const _hoisted_11 = { class: "text-xs text-gray-500" };
const _hoisted_12 = { class: "text-xs text-gray-500" };
const _hoisted_13 = { class: "legend-row mt-3" };
const _hoisted_14 = { class: "text-sm font-medium ml-2" };
const _hoisted_15 = { class: "year-grid" };
const _hoisted_16 = { class: "month-card__title" };
const _hoisted_17 = { class: "month-card__rate" };
const _hoisted_18 = { class: "text-xs text-gray-400" };
const _hoisted_19 = {
  key: 0,
  class: "text-xs text-gray-400"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "Clock" },
  __name: "ClockView",
  setup(__props) {
    const attendanceStore = useAttendanceStore();
    const authStore = useAuthStore();
    const message = useMessage();
    const userId = computed(() => authStore.currentUser?.id ?? "");
    const today = computed(() => dayjs().format("YYYY-MM-DD"));
    const now = ref(/* @__PURE__ */ new Date());
    let clockTimer = null;
    onMounted(() => {
      clockTimer = window.setInterval(() => {
        now.value = /* @__PURE__ */ new Date();
      }, 1e3);
    });
    onUnmounted(() => {
      if (clockTimer) window.clearInterval(clockTimer);
    });
    const nowText = computed(() => formatDateTime(now.value.getTime()));
    const clockedIn = computed(() => attendanceStore.todayRecords.some((r) => r.clock_type === "clock_in"));
    const clockedOut = computed(() => attendanceStore.todayRecords.some((r) => r.clock_type === "clock_out"));
    const workTimeText = computed(() => {
      const shift = attendanceStore.workRule?.shift;
      return shift ? `${shift.start_time} - ${shift.end_time}` : "未设置";
    });
    async function doClock(type) {
      if (!userId.value) return;
      if (!attendanceStore.workRule) return message.error("尚未设置上班时间");
      const res = await attendanceStore.clock({
        userId: userId.value,
        clockType: type,
        clockAt: formatDateTime(Date.now()),
        remark: null
      });
      if (!res.ok) return message.error(res.error ?? "打卡失败");
      message.success(type === "clock_in" ? "上班打卡成功" : "下班打卡成功");
      await refresh();
    }
    const periodTab = ref("day");
    const selectedDay = ref(today.value);
    function prevDay() {
      selectedDay.value = dayjs(selectedDay.value).subtract(1, "day").format("YYYY-MM-DD");
    }
    function nextDay() {
      const next = dayjs(selectedDay.value).add(1, "day");
      if (next.isAfter(dayjs(), "day")) return;
      selectedDay.value = next.format("YYYY-MM-DD");
    }
    function gotoToday() {
      selectedDay.value = today.value;
    }
    const isViewingToday = computed(() => selectedDay.value === today.value);
    function startOfWeek(d) {
      const date = new Date(d);
      const day = date.getDay();
      const diff = day === 0 ? -6 : 1 - day;
      date.setDate(date.getDate() + diff);
      date.setHours(0, 0, 0, 0);
      return date;
    }
    const weekStart = ref(startOfWeek(/* @__PURE__ */ new Date()));
    const weekDates = computed(() => {
      const arr = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(weekStart.value);
        d.setDate(d.getDate() + i);
        arr.push(dayjs(d).format("YYYY-MM-DD"));
      }
      return arr;
    });
    const weekDayLabels = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
    const weekRangeText = computed(() => `${weekDates.value[0]} 至 ${weekDates.value[6]}`);
    function prevWeek() {
      const d = new Date(weekStart.value);
      d.setDate(d.getDate() - 7);
      weekStart.value = d;
    }
    function nextWeek() {
      const d = new Date(weekStart.value);
      d.setDate(d.getDate() + 7);
      weekStart.value = d;
    }
    function thisWeek() {
      weekStart.value = startOfWeek(/* @__PURE__ */ new Date());
    }
    const calendarYear = ref(dayjs().year());
    const calendarMonth = ref(dayjs().month() + 1);
    function handlePanelChange(info) {
      calendarYear.value = info.year;
      calendarMonth.value = info.month;
    }
    function monthRange(year, month) {
      const start = dayjs(`${year}-${String(month).padStart(2, "0")}-01`);
      return { start: start.format("YYYY-MM-DD"), end: start.endOf("month").format("YYYY-MM-DD") };
    }
    const selectedYear = ref(dayjs().year());
    function prevYear() {
      selectedYear.value--;
    }
    function nextYear() {
      selectedYear.value++;
    }
    function thisYear() {
      selectedYear.value = dayjs().year();
    }
    function yearRange(year) {
      return { start: `${year}-01-01`, end: `${year}-12-31` };
    }
    const activeRange = computed(() => {
      switch (periodTab.value) {
        case "day":
          return { start: selectedDay.value, end: selectedDay.value };
        case "week":
          return { start: weekDates.value[0], end: weekDates.value[6] };
        case "month":
          return monthRange(calendarYear.value, calendarMonth.value);
        case "year":
          return yearRange(selectedYear.value);
      }
    });
    async function loadRangeForActiveTab() {
      if (!userId.value) return;
      const { start, end } = activeRange.value;
      await attendanceStore.fetchRange(start, end, userId.value);
    }
    watch(activeRange, () => {
      loadRangeForActiveTab();
    });
    const { refresh, refreshing } = usePageRefresh(async () => {
      if (!userId.value) return;
      await Promise.all([
        attendanceStore.fetchToday(userId.value, today.value),
        attendanceStore.fetchLeaves(userId.value, "approved"),
        attendanceStore.fetchWorkRule(userId.value, today.value),
        loadRangeForActiveTab()
      ]);
    });
    const recordsByDate = computed(() => {
      const map = {};
      for (const r of attendanceStore.rangeRecords) {
        (map[r.clock_date] ??= []).push(r);
      }
      return map;
    });
    const approvedLeaveRanges = computed(
      () => attendanceStore.leaves.filter((l) => l.status === "approved").map((l) => ({ start: dayjs(l.start_date), end: dayjs(l.end_date) }))
    );
    function clockInRecord(dateStr) {
      return recordsByDate.value[dateStr]?.find((r) => r.clock_type === "clock_in");
    }
    function clockOutRecord(dateStr) {
      return recordsByDate.value[dateStr]?.find((r) => r.clock_type === "clock_out");
    }
    function clockInTime(dateStr) {
      return clockInRecord(dateStr)?.clock_at?.slice(11, 16) ?? "--:--";
    }
    function clockOutTime(dateStr) {
      return clockOutRecord(dateStr)?.clock_at?.slice(11, 16) ?? "--:--";
    }
    function dayCategory(dateStr) {
      const d = dayjs(dateStr);
      if (d.isAfter(dayjs(), "day")) return "future";
      const onLeave = approvedLeaveRanges.value.some((l) => d.isBetween(l.start, l.end, "day", "[]"));
      if (onLeave) return "leave";
      const isWeekend = [0, 6].includes(d.day());
      const inR = clockInRecord(dateStr);
      const outR = clockOutRecord(dateStr);
      if (!inR && !outR) return isWeekend ? "weekend" : "absent";
      if (inR?.status === "late" || outR?.status === "early_leave") return "abnormal";
      if (inR && outR) return "normal";
      return "incomplete";
    }
    const categoryMeta = {
      normal: { label: "正常", color: "#18a058", tagType: "success" },
      abnormal: { label: "异常", color: "#f0a020", tagType: "warning" },
      absent: { label: "缺勤", color: "#d03050", tagType: "error" },
      incomplete: { label: "缺卡", color: "#8a2be2", tagType: "error" },
      leave: { label: "请假", color: "#2080f0", tagType: "info" },
      weekend: { label: "休息", color: "#c2c2c2", tagType: "default" },
      future: { label: "—", color: "#e5e5e5", tagType: "default" }
    };
    function periodStats(startStr, endStr) {
      let expected = 0, present = 0, late = 0, early = 0, absent = 0, leaveDays = 0, incomplete = 0;
      let cur = dayjs(startStr);
      const boundEnd = dayjs(endStr).isAfter(dayjs()) ? dayjs() : dayjs(endStr);
      while (cur.isSameOrBefore(boundEnd, "day")) {
        const dateStr = cur.format("YYYY-MM-DD");
        const cat = dayCategory(dateStr);
        if (cat === "leave") {
          leaveDays++;
        } else if (cat !== "weekend") {
          expected++;
          if (cat === "normal") present++;
          else if (cat === "abnormal") {
            present++;
            if (clockInRecord(dateStr)?.status === "late") late++;
            if (clockOutRecord(dateStr)?.status === "early_leave") early++;
          } else if (cat === "incomplete") {
            present++;
            incomplete++;
          } else if (cat === "absent") absent++;
        }
        cur = cur.add(1, "day");
      }
      const rate = expected > 0 ? Math.round(present / expected * 100) : 0;
      return { expected, present, late, early, absent, leaveDays, incomplete, rate };
    }
    const weekStats = computed(() => periodStats(weekDates.value[0], weekDates.value[6]));
    const monthStats = computed(() => {
      const r = monthRange(calendarYear.value, calendarMonth.value);
      return periodStats(r.start, r.end);
    });
    function monthStatsFor(year, month) {
      const r = monthRange(year, month);
      return periodStats(r.start, r.end);
    }
    const yearMonthStats = computed(
      () => Array.from({ length: 12 }, (_, i) => ({ month: i + 1, ...monthStatsFor(selectedYear.value, i + 1) }))
    );
    function isCurrentMonth(m) {
      return selectedYear.value === dayjs().year() && m === dayjs().month() + 1;
    }
    function ymdToStr(year, month, date) {
      return `${year}-${String(month).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
    }
    function dayCategoryYMD(year, month, date) {
      return dayCategory(ymdToStr(year, month, date));
    }
    const dayDuration = computed(() => {
      const inR = clockInRecord(selectedDay.value);
      const outR = clockOutRecord(selectedDay.value);
      if (!inR || !outR) return null;
      const mins = dayjs(outR.clock_at).diff(dayjs(inR.clock_at), "minute");
      if (mins < 0) return null;
      return `${Math.floor(mins / 60)}小时${mins % 60}分钟`;
    });
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
    const dayColumns = [
      { title: "打卡类型", key: "clock_type", width: 100, render: (r) => r.clock_type === "clock_in" ? "上班" : "下班" },
      { title: "打卡时间", key: "clock_at", width: 180 },
      { title: "状态", key: "status", width: 90, render: (r) => h(NTag, { type: statusTagType[r.status] ?? "success" }, () => statusLabel[r.status] ?? r.status) }
    ];
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), { title: "考勤打卡" }, {
        default: withCtx(() => [
          createVNode(unref(NGrid), {
            "x-gap": 16,
            "y-gap": 16,
            cols: "1 620:3",
            class: "mb-4"
          }, {
            default: withCtx(() => [
              createVNode(unref(NGi), null, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    default: withCtx(() => [
                      createVNode(unref(NStatistic), {
                        label: "当前时间",
                        value: nowText.value
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
                        label: "今日上班时间",
                        value: workTimeText.value
                      }, null, 8, ["value"]),
                      createBaseVNode("div", _hoisted_1, [
                        unref(attendanceStore).workRule ? (openBlock(), createBlock(unref(NTag), {
                          key: 0,
                          size: "small",
                          type: unref(attendanceStore).workRule.source === "schedule" ? "info" : "default"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(unref(attendanceStore).workRule.shift.name) + " · " + toDisplayString(unref(attendanceStore).workRule.source === "schedule" ? "今日排班" : "默认班次"), 1)
                          ]),
                          _: 1
                        }, 8, ["type"])) : (openBlock(), createBlock(unref(NTag), {
                          key: 1,
                          size: "small",
                          type: "error"
                        }, {
                          default: withCtx(() => [..._cache[3] || (_cache[3] = [
                            createTextVNode("未配置班次", -1)
                          ])]),
                          _: 1
                        }))
                      ])
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
                      createVNode(unref(NSpace), {
                        align: "center",
                        size: "large"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Button), {
                            type: "primary",
                            size: "large",
                            disabled: !unref(attendanceStore).workRule || clockedIn.value,
                            onClick: _cache[0] || (_cache[0] = ($event) => doClock("clock_in"))
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(clockedIn.value ? "已上班打卡" : "上班打卡"), 1)
                            ]),
                            _: 1
                          }, 8, ["disabled"]),
                          createVNode(unref(Button), {
                            type: "warning",
                            size: "large",
                            disabled: !unref(attendanceStore).workRule || !clockedIn.value || clockedOut.value,
                            onClick: _cache[1] || (_cache[1] = ($event) => doClock("clock_out"))
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(clockedOut.value ? "已下班打卡" : "下班打卡"), 1)
                            ]),
                            _: 1
                          }, 8, ["disabled"])
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
          createVNode(unref(NCard), { title: "打卡记录" }, {
            "header-extra": withCtx(() => [
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
            default: withCtx(() => [
              createVNode(unref(NTabs), {
                value: periodTab.value,
                "onUpdate:value": _cache[2] || (_cache[2] = ($event) => periodTab.value = $event),
                type: "line",
                animated: ""
              }, {
                default: withCtx(() => [
                  createVNode(unref(NTabPane), {
                    name: "day",
                    tab: "日"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NSpace), {
                        align: "center",
                        justify: "space-between",
                        class: "mb-3"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(NSpace), { align: "center" }, {
                            default: withCtx(() => [
                              createVNode(unref(Button), {
                                size: "small",
                                onClick: prevDay
                              }, {
                                default: withCtx(() => [..._cache[5] || (_cache[5] = [
                                  createTextVNode("← 前一天", -1)
                                ])]),
                                _: 1
                              }),
                              createVNode(unref(Button), {
                                size: "small",
                                disabled: isViewingToday.value,
                                onClick: gotoToday
                              }, {
                                default: withCtx(() => [..._cache[6] || (_cache[6] = [
                                  createTextVNode("今天", -1)
                                ])]),
                                _: 1
                              }, 8, ["disabled"]),
                              createVNode(unref(Button), {
                                size: "small",
                                disabled: isViewingToday.value,
                                onClick: nextDay
                              }, {
                                default: withCtx(() => [..._cache[7] || (_cache[7] = [
                                  createTextVNode("后一天 →", -1)
                                ])]),
                                _: 1
                              }, 8, ["disabled"]),
                              createBaseVNode("span", _hoisted_2, toDisplayString(selectedDay.value), 1),
                              createVNode(unref(NTag), {
                                type: categoryMeta[dayCategory(selectedDay.value)].tagType,
                                size: "small"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(categoryMeta[dayCategory(selectedDay.value)].label), 1)
                                ]),
                                _: 1
                              }, 8, ["type"])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NGrid), {
                        "x-gap": 12,
                        cols: 3,
                        class: "mb-4"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(NGi), null, {
                            default: withCtx(() => [
                              createVNode(unref(NCard), { size: "small" }, {
                                default: withCtx(() => [
                                  createVNode(unref(NStatistic), {
                                    label: "上班时间",
                                    value: clockInTime(selectedDay.value)
                                  }, null, 8, ["value"])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(unref(NGi), null, {
                            default: withCtx(() => [
                              createVNode(unref(NCard), { size: "small" }, {
                                default: withCtx(() => [
                                  createVNode(unref(NStatistic), {
                                    label: "下班时间",
                                    value: clockOutTime(selectedDay.value)
                                  }, null, 8, ["value"])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(unref(NGi), null, {
                            default: withCtx(() => [
                              createVNode(unref(NCard), { size: "small" }, {
                                default: withCtx(() => [
                                  createVNode(unref(NStatistic), {
                                    label: "工作时长",
                                    value: dayDuration.value ?? "—"
                                  }, null, 8, ["value"])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$2), {
                        columns: dayColumns,
                        data: recordsByDate.value[selectedDay.value] ?? [],
                        pagination: false
                      }, null, 8, ["data"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NTabPane), {
                    name: "week",
                    tab: "周"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NSpace), {
                        align: "center",
                        justify: "space-between",
                        class: "mb-3"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(NSpace), { align: "center" }, {
                            default: withCtx(() => [
                              createVNode(unref(Button), {
                                size: "small",
                                onClick: prevWeek
                              }, {
                                default: withCtx(() => [..._cache[8] || (_cache[8] = [
                                  createTextVNode("← 上一周", -1)
                                ])]),
                                _: 1
                              }),
                              createVNode(unref(Button), {
                                size: "small",
                                onClick: thisWeek
                              }, {
                                default: withCtx(() => [..._cache[9] || (_cache[9] = [
                                  createTextVNode("本周", -1)
                                ])]),
                                _: 1
                              }),
                              createVNode(unref(Button), {
                                size: "small",
                                onClick: nextWeek
                              }, {
                                default: withCtx(() => [..._cache[10] || (_cache[10] = [
                                  createTextVNode("下一周 →", -1)
                                ])]),
                                _: 1
                              }),
                              createBaseVNode("span", _hoisted_3, toDisplayString(weekRangeText.value), 1)
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createBaseVNode("div", _hoisted_4, [
                        (openBlock(true), createElementBlock(Fragment, null, renderList(weekDates.value, (date, i) => {
                          return openBlock(), createElementBlock("div", {
                            key: date,
                            class: normalizeClass(["week-day-card", { "week-day-card--today": date === today.value }])
                          }, [
                            createBaseVNode("div", _hoisted_5, toDisplayString(weekDayLabels[i]), 1),
                            createBaseVNode("div", _hoisted_6, toDisplayString(date.slice(5)), 1),
                            createVNode(unref(NTag), {
                              type: categoryMeta[dayCategory(date)].tagType,
                              size: "small",
                              class: "mt-1"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(categoryMeta[dayCategory(date)].label), 1)
                              ]),
                              _: 2
                            }, 1032, ["type"]),
                            !["weekend", "future"].includes(dayCategory(date)) ? (openBlock(), createElementBlock("div", _hoisted_7, [
                              createBaseVNode("div", null, "上 " + toDisplayString(clockInTime(date)), 1),
                              createBaseVNode("div", null, "下 " + toDisplayString(clockOutTime(date)), 1)
                            ])) : createCommentVNode("", true)
                          ], 2);
                        }), 128))
                      ]),
                      createVNode(unref(NGrid), {
                        "x-gap": 12,
                        cols: 5
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(NGi), null, {
                            default: withCtx(() => [
                              createVNode(unref(NCard), { size: "small" }, {
                                default: withCtx(() => [
                                  createVNode(unref(NStatistic), {
                                    label: "应出勤",
                                    value: weekStats.value.expected
                                  }, null, 8, ["value"])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(unref(NGi), null, {
                            default: withCtx(() => [
                              createVNode(unref(NCard), { size: "small" }, {
                                default: withCtx(() => [
                                  createVNode(unref(NStatistic), {
                                    label: "出勤",
                                    value: weekStats.value.present
                                  }, null, 8, ["value"])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(unref(NGi), null, {
                            default: withCtx(() => [
                              createVNode(unref(NCard), { size: "small" }, {
                                default: withCtx(() => [
                                  createVNode(unref(NStatistic), {
                                    label: "迟到",
                                    value: weekStats.value.late
                                  }, null, 8, ["value"])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(unref(NGi), null, {
                            default: withCtx(() => [
                              createVNode(unref(NCard), { size: "small" }, {
                                default: withCtx(() => [
                                  createVNode(unref(NStatistic), {
                                    label: "早退",
                                    value: weekStats.value.early
                                  }, null, 8, ["value"])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(unref(NGi), null, {
                            default: withCtx(() => [
                              createVNode(unref(NCard), { size: "small" }, {
                                default: withCtx(() => [
                                  createVNode(unref(NStatistic), {
                                    label: "缺勤",
                                    value: weekStats.value.absent
                                  }, null, 8, ["value"])
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
                  createVNode(unref(NTabPane), {
                    name: "month",
                    tab: "月"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NGrid), {
                        "x-gap": 12,
                        cols: 4,
                        class: "mb-4"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(NGi), null, {
                            default: withCtx(() => [
                              createVNode(unref(NCard), { size: "small" }, {
                                default: withCtx(() => [
                                  createVNode(unref(NStatistic), {
                                    label: "出勤率",
                                    value: `${monthStats.value.rate}%`
                                  }, null, 8, ["value"])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(unref(NGi), null, {
                            default: withCtx(() => [
                              createVNode(unref(NCard), { size: "small" }, {
                                default: withCtx(() => [
                                  createVNode(unref(NStatistic), {
                                    label: "出勤天数",
                                    value: `${monthStats.value.present}/${monthStats.value.expected}`
                                  }, null, 8, ["value"])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(unref(NGi), null, {
                            default: withCtx(() => [
                              createVNode(unref(NCard), { size: "small" }, {
                                default: withCtx(() => [
                                  createVNode(unref(NStatistic), {
                                    label: "迟到/早退",
                                    value: `${monthStats.value.late}/${monthStats.value.early}`
                                  }, null, 8, ["value"])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(unref(NGi), null, {
                            default: withCtx(() => [
                              createVNode(unref(NCard), { size: "small" }, {
                                default: withCtx(() => [
                                  createVNode(unref(NStatistic), {
                                    label: "缺勤/请假",
                                    value: `${monthStats.value.absent}/${monthStats.value.leaveDays}`
                                  }, null, 8, ["value"])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NCalendar), { onPanelChange: handlePanelChange }, {
                        default: withCtx(({ year, month, date }) => [
                          createBaseVNode("div", _hoisted_8, [
                            dayCategoryYMD(year, month, date) !== "future" ? (openBlock(), createBlock(unref(NPopover), {
                              key: 0,
                              trigger: "click",
                              placement: "top"
                            }, {
                              trigger: withCtx(() => [
                                createBaseVNode("span", {
                                  class: "cal-dot",
                                  style: normalizeStyle({ background: categoryMeta[dayCategoryYMD(year, month, date)].color })
                                }, null, 4)
                              ]),
                              default: withCtx(() => [
                                createBaseVNode("div", _hoisted_9, [
                                  createBaseVNode("div", _hoisted_10, toDisplayString(ymdToStr(year, month, date)) + " · " + toDisplayString(categoryMeta[dayCategoryYMD(year, month, date)].label), 1),
                                  !["weekend", "absent", "leave"].includes(dayCategoryYMD(year, month, date)) ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                                    createBaseVNode("div", _hoisted_11, "上班：" + toDisplayString(clockInTime(ymdToStr(year, month, date))), 1),
                                    createBaseVNode("div", _hoisted_12, "下班：" + toDisplayString(clockOutTime(ymdToStr(year, month, date))), 1)
                                  ], 64)) : createCommentVNode("", true)
                                ])
                              ]),
                              _: 2
                            }, 1024)) : createCommentVNode("", true)
                          ])
                        ]),
                        _: 1
                      }),
                      createBaseVNode("div", _hoisted_13, [
                        (openBlock(), createElementBlock(Fragment, null, renderList(["normal", "abnormal", "incomplete", "absent", "leave", "weekend"], (key) => {
                          return createBaseVNode("span", {
                            key,
                            class: "legend-item"
                          }, [
                            createBaseVNode("span", {
                              class: "legend-dot",
                              style: normalizeStyle({ background: categoryMeta[key].color })
                            }, null, 4),
                            createTextVNode(" " + toDisplayString(categoryMeta[key].label), 1)
                          ]);
                        }), 64))
                      ])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NTabPane), {
                    name: "year",
                    tab: "年"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NSpace), {
                        align: "center",
                        class: "mb-4"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Button), {
                            size: "small",
                            onClick: prevYear
                          }, {
                            default: withCtx(() => [..._cache[11] || (_cache[11] = [
                              createTextVNode("← 上一年", -1)
                            ])]),
                            _: 1
                          }),
                          createVNode(unref(Button), {
                            size: "small",
                            onClick: thisYear
                          }, {
                            default: withCtx(() => [..._cache[12] || (_cache[12] = [
                              createTextVNode("今年", -1)
                            ])]),
                            _: 1
                          }),
                          createVNode(unref(Button), {
                            size: "small",
                            onClick: nextYear
                          }, {
                            default: withCtx(() => [..._cache[13] || (_cache[13] = [
                              createTextVNode("下一年 →", -1)
                            ])]),
                            _: 1
                          }),
                          createBaseVNode("span", _hoisted_14, toDisplayString(selectedYear.value) + " 年", 1)
                        ]),
                        _: 1
                      }),
                      createBaseVNode("div", _hoisted_15, [
                        (openBlock(true), createElementBlock(Fragment, null, renderList(yearMonthStats.value, (ms) => {
                          return openBlock(), createBlock(unref(NCard), {
                            key: ms.month,
                            size: "small",
                            class: normalizeClass({ "month-card--current": isCurrentMonth(ms.month) })
                          }, {
                            default: withCtx(() => [
                              createBaseVNode("div", _hoisted_16, toDisplayString(ms.month) + "月", 1),
                              createVNode(unref(NProgress), {
                                type: "line",
                                percentage: ms.rate,
                                height: 8,
                                "show-indicator": false,
                                color: ms.rate >= 95 ? "#18a058" : ms.rate >= 80 ? "#f0a020" : "#d03050"
                              }, null, 8, ["percentage", "color"]),
                              createBaseVNode("div", _hoisted_17, toDisplayString(ms.rate) + "%", 1),
                              createBaseVNode("div", _hoisted_18, "出勤 " + toDisplayString(ms.present) + "/" + toDisplayString(ms.expected) + " 天", 1),
                              ms.late || ms.early || ms.absent ? (openBlock(), createElementBlock("div", _hoisted_19, " 迟到" + toDisplayString(ms.late) + "·早退" + toDisplayString(ms.early) + "·缺勤" + toDisplayString(ms.absent), 1)) : createCommentVNode("", true)
                            ]),
                            _: 2
                          }, 1032, ["class"]);
                        }), 128))
                      ])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["value"])
            ]),
            _: 1
          })
        ]),
        _: 1
      });
    };
  }
});
const ClockView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-1389e39b"]]);
export {
  ClockView as default
};
