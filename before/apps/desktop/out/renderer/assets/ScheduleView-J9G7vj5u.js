import { l as defineComponent, r as ref, w as watch, U as createBlock, W as withCtx, u as unref, V as openBlock, X as createVNode, k as createTextVNode, a3 as createBaseVNode, a8 as toDisplayString, a1 as createElementBlock, a9 as createCommentVNode, F as Fragment, a6 as renderList, a5 as withModifiers, c as computed, J as normalizeClass, aa as normalizeStyle } from "./vendor-vue-Hc3ejqjp.js";
import "./vendor-echarts-DEbY5nl3.js";
import { _ as _sfc_main$1 } from "./BasePage.vue_vue_type_script_setup_true_lang-DqZb80g7.js";
import { u as useAuthStore } from "./index-BSVdjrbM.js";
import { u as useAttendanceStore } from "./attendance.store-Bl1he8rD.js";
import { u as useUserStore } from "./user.store-CgFXZFBa.js";
import { u as useRoleStore } from "./role.store-USVCZhNx.js";
import { u as usePageRefresh } from "./usePageRefresh-Wnx_lW1d.js";
import { u as useMessage, p as useDialog, v as NSpace, B as Button, g as NCard, D as NEmpty, j as NForm, k as NFormItem, H as NDatePicker, J as NSelect, l as NInput, Z as NSwitch, I as NTimePicker, _ as NCheckboxGroup, $ as NPopconfirm, h as NModal, W as NDivider, w as NTooltip, m as NCheckbox, o as NTag } from "./vendor-naive-sdNTCZPI.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./vendor-query-CFvMrhIw.js";
import "./useAutoRefresh-BeuDS8Br.js";
const _hoisted_1 = { class: "text-sm text-gray-500 ml-2" };
const _hoisted_2 = {
  key: 0,
  class: "text-sm text-gray-500"
};
const _hoisted_3 = {
  key: 0,
  class: "py-10"
};
const _hoisted_4 = {
  key: 1,
  class: "schedule-grid-wrapper",
  style: { "overflow-x": "auto" }
};
const _hoisted_5 = { class: "schedule-grid" };
const _hoisted_6 = ["onClick"];
const _hoisted_7 = { key: 0 };
const _hoisted_8 = {
  key: 0,
  class: "text-xs text-primary mt-1"
};
const _hoisted_9 = { class: "employee-col font-medium" };
const _hoisted_10 = ["onClick"];
const _hoisted_11 = {
  key: 0,
  class: "empty-cell"
};
const _hoisted_12 = {
  key: 1,
  class: "cell-content"
};
const _hoisted_13 = ["onClick"];
const _hoisted_14 = {
  key: 1,
  class: "text-xs opacity-80 ml-1"
};
const _hoisted_15 = { class: "date-banner mb-4" };
const _hoisted_16 = { class: "font-bold text-base" };
const _hoisted_17 = {
  key: 0,
  class: "text-sm text-gray-400 ml-2"
};
const _hoisted_18 = {
  key: 1,
  class: "ml-2 text-blue-500 text-sm font-medium"
};
const _hoisted_19 = { class: "reminder-section" };
const _hoisted_20 = {
  key: 0,
  class: "text-xs text-green-500"
};
const _hoisted_21 = {
  key: 0,
  class: "reminder-section__body"
};
const _hoisted_22 = { key: 1 };
const _hoisted_23 = {
  key: 0,
  class: "py-4 text-center text-gray-400"
};
const _hoisted_24 = {
  key: 1,
  class: "shift-list mb-3"
};
const _hoisted_25 = { class: "text-sm text-gray-500 ml-2" };
const _hoisted_26 = {
  key: 1,
  class: "text-xs text-gray-400 ml-2"
};
const _hoisted_27 = {
  key: 1,
  class: "shift-edit-inline"
};
const _hoisted_28 = { key: 2 };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "Schedule" },
  __name: "ScheduleView",
  setup(__props) {
    const attendanceStore = useAttendanceStore();
    const userStore = useUserStore();
    const roleStore = useRoleStore();
    const authStore = useAuthStore();
    const message = useMessage();
    const dialog = useDialog();
    function startOfWeek(d) {
      const date = new Date(d);
      const day = date.getDay();
      const diff = day === 0 ? -6 : 1 - day;
      date.setDate(date.getDate() + diff);
      date.setHours(0, 0, 0, 0);
      return date;
    }
    function toDateStr(d) {
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    }
    const weekStart = ref(startOfWeek(/* @__PURE__ */ new Date()));
    const weekDates = computed(() => {
      const arr = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(weekStart.value);
        d.setDate(d.getDate() + i);
        arr.push(toDateStr(d));
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
    const reminderMap = ref({});
    async function loadSchedules() {
      await attendanceStore.fetchSchedules(weekDates.value[0], weekDates.value[6]);
      await loadReminders();
    }
    async function loadReminders() {
      const ids = attendanceStore.schedules.map((s) => s.id);
      reminderMap.value = ids.length ? await window.api.reminder.byScheduleIds(ids) : {};
    }
    async function loadData() {
      await Promise.all([userStore.fetchList(), attendanceStore.fetchShifts(), roleStore.fetchList()]);
      await loadSchedules();
    }
    const { refresh, refreshing } = usePageRefresh(loadData);
    watch(weekStart, () => {
      loadSchedules();
    });
    const employeeOptions = computed(() => userStore.list.filter((u) => u.status === "active").map((u) => ({ label: u.real_name, value: u.id })));
    const shiftOptions = computed(() => attendanceStore.shifts.map((s) => ({ label: `${s.name}（${s.start_time}-${s.end_time}）`, value: s.id })));
    function shiftName(id) {
      const s = attendanceStore.shifts.find((s2) => s2.id === id);
      return s ? s.name : "—";
    }
    function shiftColor(id) {
      const palette = ["#2c5f8a", "#3a8a5f", "#a86c2c", "#7a4fa8", "#b03a5f", "#2c8aa8"];
      const idx = attendanceStore.shifts.findIndex((s) => s.id === id);
      return palette[idx % palette.length] ?? "#888";
    }
    const gridRows = computed(() => {
      return employeeOptions.value;
    });
    function cellSchedules(userId, date) {
      return attendanceStore.schedules.filter((s) => s.user_id === userId && s.work_date === date);
    }
    const selectedDate = ref(null);
    function selectDate(date) {
      selectedDate.value = selectedDate.value === date ? null : date;
    }
    function isToday(date) {
      return date === toDateStr(/* @__PURE__ */ new Date());
    }
    const showEditModal = ref(false);
    const editingId = ref(null);
    const editForm = ref({
      user_id: "",
      shift_id: "",
      work_date: "",
      task_type: null,
      task_target: "",
      remark: ""
    });
    const taskTypeOptions = [
      { label: "巡房", value: "巡房" },
      { label: "护理", value: "护理" },
      { label: "餐饮", value: "餐饮" },
      { label: "活动", value: "活动" },
      { label: "前台", value: "前台" }
    ];
    const enableReminder = ref(false);
    const reminderForm = ref({
      remind_at: "08:00",
      repeat_type: "none",
      repeat_days: []
    });
    const existingReminder = ref(null);
    const weekDayCheckOptions = [
      { label: "周日", value: 0 },
      { label: "周一", value: 1 },
      { label: "周二", value: 2 },
      { label: "周三", value: 3 },
      { label: "周四", value: 4 },
      { label: "周五", value: 5 },
      { label: "周六", value: 6 }
    ];
    const monthDayCheckOptions = Array.from({ length: 31 }, (_, i) => ({ label: `${i + 1}日`, value: i + 1 }));
    function openCreateCell(userId, date) {
      editingId.value = null;
      editForm.value = { user_id: userId, shift_id: "", work_date: date, task_type: null, task_target: "", remark: "" };
      enableReminder.value = false;
      reminderForm.value = { remind_at: "08:00", repeat_type: "none", repeat_days: [] };
      existingReminder.value = null;
      showEditModal.value = true;
    }
    function openCreateFromToolbar() {
      const date = selectedDate.value ?? toDateStr(/* @__PURE__ */ new Date());
      editingId.value = null;
      editForm.value = { user_id: "", shift_id: "", work_date: date, task_type: null, task_target: "", remark: "" };
      enableReminder.value = false;
      reminderForm.value = { remind_at: "08:00", repeat_type: "none", repeat_days: [] };
      existingReminder.value = null;
      showEditModal.value = true;
    }
    function openEditCell(row) {
      editingId.value = row.id;
      editForm.value = {
        user_id: row.user_id,
        shift_id: row.shift_id,
        work_date: row.work_date,
        task_type: row.task_type,
        task_target: row.task_target ?? "",
        remark: row.remark ?? ""
      };
      const linked = reminderMap.value[row.id];
      if (linked) {
        existingReminder.value = linked;
        enableReminder.value = true;
        reminderForm.value = {
          remind_at: linked.remind_at,
          repeat_type: linked.repeat_type,
          repeat_days: linked.repeat_days ? JSON.parse(linked.repeat_days) : []
        };
      } else {
        existingReminder.value = null;
        enableReminder.value = false;
        reminderForm.value = { remind_at: "08:00", repeat_type: "none", repeat_days: [] };
      }
      showEditModal.value = true;
    }
    async function saveCell() {
      if (!editForm.value.user_id || !editForm.value.shift_id) return message.error("请选择员工和班次");
      if (enableReminder.value) {
        if (reminderForm.value.repeat_type === "weekly" && !reminderForm.value.repeat_days.length) {
          return message.error("每周重复请至少勾选一天");
        }
        if (reminderForm.value.repeat_type === "monthly" && !reminderForm.value.repeat_days.length) {
          return message.error("每月重复请至少选择一个日期");
        }
      }
      const payload = {
        ...editForm.value,
        task_target: editForm.value.task_target || null
      };
      let scheduleId = editingId.value;
      if (editingId.value) {
        const res = await attendanceStore.updateSchedule(editingId.value, payload);
        if (!res.ok) return message.error(res.error ?? "更新失败");
      } else {
        const res = await attendanceStore.createSchedule(payload);
        if (!res.ok) return message.error(res.error ?? "排班失败");
        scheduleId = res.row.id;
      }
      if (scheduleId) await syncReminder(scheduleId);
      showEditModal.value = false;
      message.success(editingId.value ? "排班已更新" : "排班成功");
      await loadSchedules();
    }
    async function syncReminder(scheduleId) {
      const title = editForm.value.task_type ? `${editForm.value.task_type}${editForm.value.task_target ? "：" + editForm.value.task_target : ""}` : `排班任务提醒（${shiftName(editForm.value.shift_id)}）`;
      if (enableReminder.value) {
        const payload = {
          title,
          description: editForm.value.remark || null,
          remind_at: reminderForm.value.remind_at,
          remind_date: editForm.value.work_date,
          repeat_type: reminderForm.value.repeat_type,
          repeat_days: ["weekly", "monthly"].includes(reminderForm.value.repeat_type) ? JSON.stringify(reminderForm.value.repeat_days) : null,
          creator_id: authStore.currentUser?.id ?? editForm.value.user_id,
          assignee_id: editForm.value.user_id,
          status: "active",
          schedule_id: scheduleId
        };
        try {
          if (existingReminder.value) {
            await window.api.reminder.update(existingReminder.value.id, payload);
          } else {
            await window.api.reminder.create(payload);
          }
        } catch {
          message.warning('排班已保存，但提醒设置失败，请稍后到"任务提醒"页手动检查');
        }
      } else if (existingReminder.value) {
        try {
          await window.api.reminder.cancel(existingReminder.value.id);
        } catch {
        }
      }
    }
    function removeSchedule(row) {
      dialog.warning({
        title: "删除排班",
        content: reminderMap.value[row.id] ? "该排班已关联提醒，删除排班将同时取消该提醒。确定删除吗？" : "确定要删除此条排班记录吗？",
        positiveText: "确定",
        negativeText: "取消",
        onPositiveClick: async () => {
          const linked = reminderMap.value[row.id];
          if (linked) {
            try {
              await window.api.reminder.cancel(linked.id);
            } catch {
            }
          }
          await attendanceStore.removeSchedule(row.id);
          await loadSchedules();
          message.success("已删除");
        }
      });
    }
    const showShiftModal = ref(false);
    const editingShiftId = ref(null);
    const shiftForm = ref({ name: "", start_time: "08:00", end_time: "17:00", remark: "" });
    const showShiftAddForm = ref(false);
    function openShiftModal() {
      editingShiftId.value = null;
      shiftForm.value = { name: "", start_time: "08:00", end_time: "17:00", remark: "" };
      showShiftAddForm.value = false;
      showShiftModal.value = true;
    }
    function openEditShift(shift) {
      editingShiftId.value = shift.id;
      shiftForm.value = {
        name: shift.name,
        start_time: shift.start_time,
        end_time: shift.end_time,
        remark: shift.remark ?? ""
      };
      showShiftAddForm.value = true;
    }
    function cancelEditShift() {
      editingShiftId.value = null;
      shiftForm.value = { name: "", start_time: "08:00", end_time: "17:00", remark: "" };
      showShiftAddForm.value = false;
    }
    async function saveShift() {
      if (!shiftForm.value.name.trim()) return message.error("请填写班次名称");
      if (!shiftForm.value.start_time || !shiftForm.value.end_time) return message.error("请选择上班和下班时间");
      if (shiftForm.value.start_time >= shiftForm.value.end_time) return message.error("下班时间必须晚于上班时间");
      try {
        if (editingShiftId.value) {
          await attendanceStore.updateShift(editingShiftId.value, {
            name: shiftForm.value.name.trim(),
            start_time: shiftForm.value.start_time,
            end_time: shiftForm.value.end_time,
            remark: shiftForm.value.remark || null
          });
          message.success("上班时间已更新");
        } else {
          await attendanceStore.createShift({ ...shiftForm.value, name: shiftForm.value.name.trim() });
          message.success("班次已添加");
        }
        cancelEditShift();
        await attendanceStore.fetchShifts();
      } catch (error) {
        message.error(error instanceof Error ? error.message : "保存上班时间失败");
      }
    }
    async function deleteShift(id) {
      try {
        await attendanceStore.deleteShift(id);
        message.success("班次已删除");
      } catch (error) {
        message.error(error instanceof Error ? error.message : "删除班次失败");
      }
    }
    async function setDefaultShift(shift) {
      try {
        await attendanceStore.setDefaultShift(shift.id);
        message.success(`已将「${shift.name}」设为默认班次`);
      } catch (error) {
        message.error(error instanceof Error ? error.message : "设置默认班次失败");
      }
    }
    const showAddEmployeeModal = ref(false);
    const addEmployeeSubmitting = ref(false);
    const addEmployeeForm = ref({
      username: "",
      password: "",
      real_name: "",
      phone: "",
      position: "",
      role_id: ""
    });
    const roleOptions = computed(() => roleStore.list.map((r) => ({ label: r.name, value: r.id })));
    const positionOptions = [
      { label: "护士", value: "护士" },
      { label: "护理员", value: "护理员" },
      { label: "前台", value: "前台" },
      { label: "后勤", value: "后勤" },
      { label: "厨师", value: "厨师" },
      { label: "管理员", value: "管理员" }
    ];
    function openAddEmployee() {
      addEmployeeForm.value = {
        username: "",
        password: "",
        real_name: "",
        phone: "",
        position: "",
        role_id: roleStore.list[0]?.id ?? ""
      };
      showAddEmployeeModal.value = true;
    }
    async function saveAddEmployee() {
      const f = addEmployeeForm.value;
      if (!f.real_name.trim()) return message.error("请填写员工姓名");
      if (!f.username.trim()) return message.error("请填写登录用户名");
      if (!f.password || f.password.length < 6) return message.error("初始密码至少6位");
      if (!f.role_id) return message.error("请选择角色");
      addEmployeeSubmitting.value = true;
      try {
        const res = await userStore.create({
          username: f.username.trim(),
          password: f.password,
          real_name: f.real_name.trim(),
          phone: f.phone || null,
          role_id: f.role_id,
          status: "active",
          must_change_pw: 0,
          position: f.position || null,
          department: null,
          remark: null
        });
        if (!res.ok) return message.error(res.error ?? "添加失败");
        showAddEmployeeModal.value = false;
        message.success(`员工「${f.real_name}」已添加，已自动出现在排班表中`);
        await userStore.fetchList();
      } finally {
        addEmployeeSubmitting.value = false;
      }
    }
    const showBatchModal = ref(false);
    const batchForm = ref({
      user_id: "",
      shift_id: "",
      date_range: [Date.now(), Date.now() + 6 * 864e5],
      weekdays: [1, 2, 3, 4, 5],
      // 默认周一到周五
      task_type: null,
      task_target: "",
      remark: ""
    });
    const batchSubmitting = ref(false);
    function openBatch() {
      batchForm.value = {
        user_id: "",
        shift_id: "",
        date_range: [weekStart.value.getTime(), weekStart.value.getTime() + 6 * 864e5],
        weekdays: [1, 2, 3, 4, 5],
        task_type: null,
        task_target: "",
        remark: ""
      };
      showBatchModal.value = true;
    }
    async function saveBatch() {
      if (!batchForm.value.user_id || !batchForm.value.shift_id) return message.error("请选择员工和班次");
      if (!batchForm.value.weekdays.length) return message.error("请至少选择一个星期");
      const [start, end] = batchForm.value.date_range;
      const dates = [];
      const cur = new Date(start);
      const endDate = new Date(end);
      while (cur.getTime() <= endDate.getTime()) {
        if (batchForm.value.weekdays.includes(cur.getDay())) {
          dates.push(toDateStr(cur));
        }
        cur.setDate(cur.getDate() + 1);
      }
      if (!dates.length) return message.error("所选日期范围内没有匹配的星期");
      batchSubmitting.value = true;
      let successCount = 0;
      let failCount = 0;
      try {
        for (const date of dates) {
          const res = await attendanceStore.createSchedule({
            user_id: batchForm.value.user_id,
            shift_id: batchForm.value.shift_id,
            work_date: date,
            task_type: batchForm.value.task_type,
            task_target: batchForm.value.task_target || null,
            remark: batchForm.value.remark || null
          });
          if (res.ok) successCount++;
          else failCount++;
        }
      } finally {
        batchSubmitting.value = false;
      }
      showBatchModal.value = false;
      await loadSchedules();
      if (failCount) {
        message.warning(`批量排班完成：成功 ${successCount} 条，失败 ${failCount} 条（可能与已有排班冲突）`);
      } else {
        message.success(`批量排班成功，共创建 ${successCount} 条排班记录`);
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), { title: "排班管理" }, {
        default: withCtx(() => [
          createVNode(unref(NCard), { class: "mb-4" }, {
            default: withCtx(() => [
              createVNode(unref(NSpace), {
                align: "center",
                justify: "space-between"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NSpace), { align: "center" }, {
                    default: withCtx(() => [
                      createVNode(unref(Button), {
                        size: "small",
                        onClick: prevWeek
                      }, {
                        default: withCtx(() => [..._cache[45] || (_cache[45] = [
                          createTextVNode("← 上一周", -1)
                        ])]),
                        _: 1
                      }),
                      createVNode(unref(Button), {
                        size: "small",
                        onClick: thisWeek
                      }, {
                        default: withCtx(() => [..._cache[46] || (_cache[46] = [
                          createTextVNode("本周", -1)
                        ])]),
                        _: 1
                      }),
                      createVNode(unref(Button), {
                        size: "small",
                        onClick: nextWeek
                      }, {
                        default: withCtx(() => [..._cache[47] || (_cache[47] = [
                          createTextVNode("下一周 →", -1)
                        ])]),
                        _: 1
                      }),
                      createBaseVNode("span", _hoisted_1, toDisplayString(weekRangeText.value), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NSpace), { align: "center" }, {
                    default: withCtx(() => [
                      selectedDate.value ? (openBlock(), createElementBlock("span", _hoisted_2, [
                        _cache[48] || (_cache[48] = createTextVNode(" 已选：", -1)),
                        createBaseVNode("b", null, toDisplayString(selectedDate.value), 1)
                      ])) : createCommentVNode("", true),
                      createVNode(unref(Button), {
                        type: "primary",
                        onClick: openCreateFromToolbar
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(selectedDate.value ? `为 ${selectedDate.value.slice(5)} 添加排班` : "+ 添加排班"), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(unref(Button), { onClick: openShiftModal }, {
                        default: withCtx(() => [..._cache[49] || (_cache[49] = [
                          createTextVNode("上班时间设置", -1)
                        ])]),
                        _: 1
                      }),
                      createVNode(unref(Button), { onClick: openBatch }, {
                        default: withCtx(() => [..._cache[50] || (_cache[50] = [
                          createTextVNode("批量排班", -1)
                        ])]),
                        _: 1
                      }),
                      createVNode(unref(Button), { onClick: openAddEmployee }, {
                        default: withCtx(() => [..._cache[51] || (_cache[51] = [
                          createTextVNode("+ 添加员工", -1)
                        ])]),
                        _: 1
                      }),
                      createVNode(unref(Button), {
                        loading: unref(refreshing),
                        onClick: unref(refresh)
                      }, {
                        default: withCtx(() => [..._cache[52] || (_cache[52] = [
                          createTextVNode("刷新", -1)
                        ])]),
                        _: 1
                      }, 8, ["loading", "onClick"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          createVNode(unref(NCard), { bordered: true }, {
            default: withCtx(() => [
              !gridRows.value.length ? (openBlock(), createElementBlock("div", _hoisted_3, [
                createVNode(unref(NEmpty), { description: "暂无在职员工，请先添加员工" }, {
                  extra: withCtx(() => [
                    createVNode(unref(Button), {
                      type: "primary",
                      onClick: openAddEmployee
                    }, {
                      default: withCtx(() => [..._cache[53] || (_cache[53] = [
                        createTextVNode("+ 添加员工", -1)
                      ])]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ])) : (openBlock(), createElementBlock("div", _hoisted_4, [
                createBaseVNode("table", _hoisted_5, [
                  createBaseVNode("thead", null, [
                    createBaseVNode("tr", null, [
                      _cache[54] || (_cache[54] = createBaseVNode("th", { class: "employee-col" }, "员工", -1)),
                      (openBlock(true), createElementBlock(Fragment, null, renderList(weekDates.value, (date, i) => {
                        return openBlock(), createElementBlock("th", {
                          key: date,
                          class: normalizeClass(["day-col", { "day-col--selected": selectedDate.value === date, "day-col--today": isToday(date) }]),
                          style: { "cursor": "pointer" },
                          onClick: ($event) => selectDate(date)
                        }, [
                          createBaseVNode("div", null, toDisplayString(weekDayLabels[i]), 1),
                          createBaseVNode("div", {
                            class: normalizeClass(["text-xs", isToday(date) ? "text-blue-500 font-bold" : "text-gray-400"])
                          }, [
                            createTextVNode(toDisplayString(date.slice(5)) + " ", 1),
                            isToday(date) ? (openBlock(), createElementBlock("span", _hoisted_7, " 今天")) : createCommentVNode("", true)
                          ], 2),
                          selectedDate.value === date ? (openBlock(), createElementBlock("div", _hoisted_8, "▼ 已选")) : createCommentVNode("", true)
                        ], 10, _hoisted_6);
                      }), 128))
                    ])
                  ]),
                  createBaseVNode("tbody", null, [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(gridRows.value, (emp) => {
                      return openBlock(), createElementBlock("tr", {
                        key: emp.value
                      }, [
                        createBaseVNode("td", _hoisted_9, toDisplayString(emp.label), 1),
                        (openBlock(true), createElementBlock(Fragment, null, renderList(weekDates.value, (date) => {
                          return openBlock(), createElementBlock("td", {
                            key: date,
                            class: normalizeClass(["day-cell", {
                              "day-cell--selected-col": selectedDate.value === date,
                              "day-cell--clickable": cellSchedules(emp.value, date).length === 0
                            }]),
                            onClick: ($event) => cellSchedules(emp.value, date).length === 0 ? (selectDate(date), openCreateCell(emp.value, date)) : void 0
                          }, [
                            cellSchedules(emp.value, date).length === 0 ? (openBlock(), createElementBlock("div", _hoisted_11, [..._cache[55] || (_cache[55] = [
                              createBaseVNode("span", { class: "add-hint" }, "+", -1)
                            ])])) : (openBlock(), createElementBlock("div", _hoisted_12, [
                              (openBlock(true), createElementBlock(Fragment, null, renderList(cellSchedules(emp.value, date), (sc) => {
                                return openBlock(), createElementBlock("div", {
                                  key: sc.id,
                                  class: "shift-tag",
                                  style: normalizeStyle({ background: shiftColor(sc.shift_id) }),
                                  onClick: withModifiers(($event) => openEditCell(sc), ["stop"])
                                }, [
                                  createBaseVNode("span", null, toDisplayString(shiftName(sc.shift_id)), 1),
                                  reminderMap.value[sc.id] ? (openBlock(), createBlock(unref(NTooltip), { key: 0 }, {
                                    trigger: withCtx(() => [..._cache[56] || (_cache[56] = [
                                      createBaseVNode("i", { class: "i-ion:alarm text-xs ml-1" }, null, -1)
                                    ])]),
                                    default: withCtx(() => [
                                      createTextVNode(" 已设置提醒：" + toDisplayString(reminderMap.value[sc.id].remind_at), 1)
                                    ]),
                                    _: 2
                                  }, 1024)) : createCommentVNode("", true),
                                  sc.task_type ? (openBlock(), createElementBlock("span", _hoisted_14, toDisplayString(sc.task_type), 1)) : createCommentVNode("", true)
                                ], 12, _hoisted_13);
                              }), 128))
                            ]))
                          ], 10, _hoisted_10);
                        }), 128))
                      ]);
                    }), 128))
                  ])
                ])
              ]))
            ]),
            _: 1
          }),
          createVNode(unref(NModal), {
            show: showEditModal.value,
            "onUpdate:show": _cache[15] || (_cache[15] = ($event) => showEditModal.value = $event),
            title: editingId.value ? "编辑排班" : "添加排班",
            preset: "card",
            style: { "width": "500px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "space-between" }, {
                default: withCtx(() => [
                  editingId.value ? (openBlock(), createBlock(unref(NPopconfirm), {
                    key: 0,
                    onPositiveClick: _cache[13] || (_cache[13] = ($event) => {
                      removeSchedule({ id: editingId.value });
                      showEditModal.value = false;
                    })
                  }, {
                    trigger: withCtx(() => [
                      createVNode(unref(Button), { type: "error" }, {
                        default: withCtx(() => [..._cache[60] || (_cache[60] = [
                          createTextVNode("删除排班", -1)
                        ])]),
                        _: 1
                      })
                    ]),
                    default: withCtx(() => [
                      createTextVNode(" 确认删除该排班记录？" + toDisplayString(existingReminder.value ? "关联提醒也会被取消。" : ""), 1)
                    ]),
                    _: 1
                  })) : (openBlock(), createElementBlock("span", _hoisted_22)),
                  createVNode(unref(NSpace), null, {
                    default: withCtx(() => [
                      createVNode(unref(Button), {
                        onClick: _cache[14] || (_cache[14] = ($event) => showEditModal.value = false)
                      }, {
                        default: withCtx(() => [..._cache[61] || (_cache[61] = [
                          createTextVNode("取消", -1)
                        ])]),
                        _: 1
                      }),
                      createVNode(unref(Button), {
                        type: "primary",
                        onClick: saveCell
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(editingId.value ? "保存修改" : "确认添加"), 1)
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
            default: withCtx(() => [
              createBaseVNode("div", _hoisted_15, [
                _cache[57] || (_cache[57] = createBaseVNode("i", { class: "i-ion:calendar-outline mr-2" }, null, -1)),
                createBaseVNode("span", _hoisted_16, toDisplayString(editForm.value.work_date || "请选择日期"), 1),
                editForm.value.work_date ? (openBlock(), createElementBlock("span", _hoisted_17, toDisplayString(weekDayLabels[(/* @__PURE__ */ new Date(editForm.value.work_date + "T00:00:00")).getDay() === 0 ? 6 : (/* @__PURE__ */ new Date(editForm.value.work_date + "T00:00:00")).getDay() - 1]), 1)) : createCommentVNode("", true),
                isToday(editForm.value.work_date) ? (openBlock(), createElementBlock("span", _hoisted_18, "今天")) : createCommentVNode("", true)
              ]),
              createVNode(unref(NForm), {
                model: editForm.value,
                "label-placement": "left",
                "label-width": "80"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), {
                    label: "日期",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NDatePicker), {
                        "formatted-value": editForm.value.work_date,
                        "onUpdate:formattedValue": _cache[0] || (_cache[0] = ($event) => editForm.value.work_date = $event),
                        "value-format": "yyyy-MM-dd",
                        type: "date",
                        style: { "width": "100%" },
                        disabled: !!editingId.value
                      }, null, 8, ["formatted-value", "disabled"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "员工",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: editForm.value.user_id,
                        "onUpdate:value": _cache[1] || (_cache[1] = ($event) => editForm.value.user_id = $event),
                        options: employeeOptions.value,
                        filterable: "",
                        disabled: !!editingId.value
                      }, null, 8, ["value", "options", "disabled"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "班次",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: editForm.value.shift_id,
                        "onUpdate:value": _cache[2] || (_cache[2] = ($event) => editForm.value.shift_id = $event),
                        options: shiftOptions.value
                      }, null, 8, ["value", "options"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "任务类型" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: editForm.value.task_type,
                        "onUpdate:value": _cache[3] || (_cache[3] = ($event) => editForm.value.task_type = $event),
                        options: taskTypeOptions,
                        clearable: "",
                        placeholder: "可选"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "负责区域" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: editForm.value.task_target,
                        "onUpdate:value": _cache[4] || (_cache[4] = ($event) => editForm.value.task_target = $event),
                        placeholder: "如：3楼A区、1-10号床，可选"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "备注" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: editForm.value.remark,
                        "onUpdate:value": _cache[5] || (_cache[5] = ($event) => editForm.value.remark = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createBaseVNode("div", _hoisted_19, [
                    createBaseVNode("div", {
                      class: "reminder-section__header",
                      onClick: _cache[8] || (_cache[8] = ($event) => enableReminder.value = !enableReminder.value)
                    }, [
                      createVNode(unref(NSpace), { align: "center" }, {
                        default: withCtx(() => [
                          _cache[58] || (_cache[58] = createBaseVNode("i", { class: "i-ion:alarm-outline text-base" }, null, -1)),
                          _cache[59] || (_cache[59] = createBaseVNode("span", { class: "font-medium" }, "到点提醒", -1)),
                          createVNode(unref(NSwitch), {
                            value: enableReminder.value,
                            "onUpdate:value": _cache[6] || (_cache[6] = ($event) => enableReminder.value = $event),
                            onClick: _cache[7] || (_cache[7] = withModifiers(() => {
                            }, ["stop"]))
                          }, null, 8, ["value"]),
                          existingReminder.value && enableReminder.value ? (openBlock(), createElementBlock("span", _hoisted_20, "已设置")) : createCommentVNode("", true)
                        ]),
                        _: 1
                      })
                    ]),
                    enableReminder.value ? (openBlock(), createElementBlock("div", _hoisted_21, [
                      createVNode(unref(NFormItem), {
                        label: "提醒时间",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(NTimePicker), {
                            "formatted-value": reminderForm.value.remind_at,
                            "onUpdate:formattedValue": _cache[9] || (_cache[9] = ($event) => reminderForm.value.remind_at = $event),
                            "value-format": "HH:mm",
                            format: "HH:mm",
                            style: { "width": "100%" }
                          }, null, 8, ["formatted-value"])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NFormItem), { label: "重复规则" }, {
                        default: withCtx(() => [
                          createVNode(unref(NSelect), {
                            value: reminderForm.value.repeat_type,
                            "onUpdate:value": _cache[10] || (_cache[10] = ($event) => reminderForm.value.repeat_type = $event),
                            options: [
                              { label: "仅当天（不重复）", value: "none" },
                              { label: "每天", value: "daily" },
                              { label: "每周", value: "weekly" },
                              { label: "每月", value: "monthly" }
                            ]
                          }, null, 8, ["value"])
                        ]),
                        _: 1
                      }),
                      reminderForm.value.repeat_type === "weekly" ? (openBlock(), createBlock(unref(NFormItem), {
                        key: 0,
                        label: "重复星期"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(NCheckboxGroup), {
                            value: reminderForm.value.repeat_days,
                            "onUpdate:value": _cache[11] || (_cache[11] = ($event) => reminderForm.value.repeat_days = $event)
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(NSpace), { wrap: "" }, {
                                default: withCtx(() => [
                                  (openBlock(), createElementBlock(Fragment, null, renderList(weekDayCheckOptions, (opt) => {
                                    return createVNode(unref(NCheckbox), {
                                      key: opt.value,
                                      value: opt.value,
                                      label: opt.label
                                    }, null, 8, ["value", "label"]);
                                  }), 64))
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }, 8, ["value"])
                        ]),
                        _: 1
                      })) : createCommentVNode("", true),
                      reminderForm.value.repeat_type === "monthly" ? (openBlock(), createBlock(unref(NFormItem), {
                        key: 1,
                        label: "重复日期"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(NCheckboxGroup), {
                            value: reminderForm.value.repeat_days,
                            "onUpdate:value": _cache[12] || (_cache[12] = ($event) => reminderForm.value.repeat_days = $event)
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(NSpace), {
                                wrap: "",
                                style: { "max-width": "340px" }
                              }, {
                                default: withCtx(() => [
                                  (openBlock(true), createElementBlock(Fragment, null, renderList(unref(monthDayCheckOptions), (opt) => {
                                    return openBlock(), createBlock(unref(NCheckbox), {
                                      key: opt.value,
                                      value: opt.value,
                                      label: opt.label
                                    }, null, 8, ["value", "label"]);
                                  }), 128))
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }, 8, ["value"])
                        ]),
                        _: 1
                      })) : createCommentVNode("", true)
                    ])) : createCommentVNode("", true)
                  ])
                ]),
                _: 1
              }, 8, ["model"])
            ]),
            _: 1
          }, 8, ["show", "title"]),
          createVNode(unref(NModal), {
            show: showShiftModal.value,
            "onUpdate:show": _cache[27] || (_cache[27] = ($event) => showShiftModal.value = $event),
            title: "上班时间设置",
            preset: "card",
            style: { "width": "600px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[26] || (_cache[26] = ($event) => showShiftModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[72] || (_cache[72] = [
                      createTextVNode("关闭", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              unref(attendanceStore).shifts.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_23, " 暂无班次，请在下方添加 ")) : (openBlock(), createElementBlock("div", _hoisted_24, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(unref(attendanceStore).shifts, (shift) => {
                  return openBlock(), createElementBlock("div", {
                    key: shift.id,
                    class: "shift-list-row"
                  }, [
                    editingShiftId.value !== shift.id ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                      createVNode(unref(NTag), {
                        type: "info",
                        bordered: false,
                        style: { "font-size": "13px" }
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(shift.name), 1)
                        ]),
                        _: 2
                      }, 1024),
                      shift.is_default ? (openBlock(), createBlock(unref(NTag), {
                        key: 0,
                        type: "success",
                        bordered: false,
                        size: "small"
                      }, {
                        default: withCtx(() => [..._cache[62] || (_cache[62] = [
                          createTextVNode("默认", -1)
                        ])]),
                        _: 1
                      })) : createCommentVNode("", true),
                      createBaseVNode("span", _hoisted_25, toDisplayString(shift.start_time) + " — " + toDisplayString(shift.end_time), 1),
                      shift.remark ? (openBlock(), createElementBlock("span", _hoisted_26, toDisplayString(shift.remark), 1)) : createCommentVNode("", true),
                      createVNode(unref(NSpace), {
                        class: "ml-auto",
                        size: "small"
                      }, {
                        default: withCtx(() => [
                          !shift.is_default ? (openBlock(), createBlock(unref(Button), {
                            key: 0,
                            size: "tiny",
                            onClick: ($event) => setDefaultShift(shift)
                          }, {
                            default: withCtx(() => [..._cache[63] || (_cache[63] = [
                              createTextVNode("设为默认", -1)
                            ])]),
                            _: 1
                          }, 8, ["onClick"])) : createCommentVNode("", true),
                          createVNode(unref(Button), {
                            size: "tiny",
                            onClick: ($event) => openEditShift(shift)
                          }, {
                            default: withCtx(() => [..._cache[64] || (_cache[64] = [
                              createTextVNode("编辑", -1)
                            ])]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(unref(NPopconfirm), {
                            onPositiveClick: ($event) => deleteShift(shift.id)
                          }, {
                            trigger: withCtx(() => [
                              createVNode(unref(Button), {
                                size: "tiny",
                                type: "error",
                                disabled: unref(attendanceStore).shifts.length <= 1
                              }, {
                                default: withCtx(() => [..._cache[65] || (_cache[65] = [
                                  createTextVNode("删除", -1)
                                ])]),
                                _: 1
                              }, 8, ["disabled"])
                            ]),
                            default: withCtx(() => [
                              createTextVNode(" 删除班次「" + toDisplayString(shift.name) + "」？已使用该班次的历史排班记录将保留。 ", 1)
                            ]),
                            _: 2
                          }, 1032, ["onPositiveClick"])
                        ]),
                        _: 2
                      }, 1024)
                    ], 64)) : (openBlock(), createElementBlock("div", _hoisted_27, [
                      createVNode(unref(NInput), {
                        value: shiftForm.value.name,
                        "onUpdate:value": _cache[16] || (_cache[16] = ($event) => shiftForm.value.name = $event),
                        placeholder: "班次名称",
                        size: "small",
                        style: { "width": "100px" }
                      }, null, 8, ["value"]),
                      createVNode(unref(NTimePicker), {
                        "formatted-value": shiftForm.value.start_time,
                        "onUpdate:formattedValue": _cache[17] || (_cache[17] = ($event) => shiftForm.value.start_time = $event),
                        "value-format": "HH:mm",
                        format: "HH:mm",
                        size: "small",
                        style: { "width": "110px" }
                      }, null, 8, ["formatted-value"]),
                      createVNode(unref(NTimePicker), {
                        "formatted-value": shiftForm.value.end_time,
                        "onUpdate:formattedValue": _cache[18] || (_cache[18] = ($event) => shiftForm.value.end_time = $event),
                        "value-format": "HH:mm",
                        format: "HH:mm",
                        size: "small",
                        style: { "width": "110px" }
                      }, null, 8, ["formatted-value"]),
                      createVNode(unref(NInput), {
                        value: shiftForm.value.remark,
                        "onUpdate:value": _cache[19] || (_cache[19] = ($event) => shiftForm.value.remark = $event),
                        placeholder: "备注",
                        size: "small",
                        style: { "width": "100px" }
                      }, null, 8, ["value"]),
                      createVNode(unref(Button), {
                        size: "small",
                        type: "primary",
                        onClick: saveShift
                      }, {
                        default: withCtx(() => [..._cache[66] || (_cache[66] = [
                          createTextVNode("保存", -1)
                        ])]),
                        _: 1
                      }),
                      createVNode(unref(Button), {
                        size: "small",
                        onClick: cancelEditShift
                      }, {
                        default: withCtx(() => [..._cache[67] || (_cache[67] = [
                          createTextVNode("取消", -1)
                        ])]),
                        _: 1
                      })
                    ]))
                  ]);
                }), 128))
              ])),
              createVNode(unref(NDivider), { style: { "margin": "8px 0" } }),
              !editingShiftId.value ? (openBlock(), createElementBlock("div", _hoisted_28, [
                createBaseVNode("div", {
                  class: "text-sm font-medium mb-2 cursor-pointer flex items-center gap-1",
                  onClick: _cache[20] || (_cache[20] = ($event) => showShiftAddForm.value = !showShiftAddForm.value)
                }, [
                  createBaseVNode("span", null, toDisplayString(showShiftAddForm.value ? "▾" : "▸"), 1),
                  _cache[68] || (_cache[68] = createTextVNode(" 新增班次 ", -1))
                ]),
                showShiftAddForm.value ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                  createVNode(unref(NForm), {
                    model: shiftForm.value,
                    "label-placement": "left",
                    "label-width": "80",
                    size: "small"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NFormItem), {
                        label: "班次名称",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(NInput), {
                            value: shiftForm.value.name,
                            "onUpdate:value": _cache[21] || (_cache[21] = ($event) => shiftForm.value.name = $event),
                            placeholder: "如：白班、夜班"
                          }, null, 8, ["value"])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NFormItem), {
                        label: "上班时间",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(NTimePicker), {
                            "formatted-value": shiftForm.value.start_time,
                            "onUpdate:formattedValue": _cache[22] || (_cache[22] = ($event) => shiftForm.value.start_time = $event),
                            "value-format": "HH:mm",
                            format: "HH:mm",
                            style: { "width": "100%" }
                          }, null, 8, ["formatted-value"])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NFormItem), {
                        label: "下班时间",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(NTimePicker), {
                            "formatted-value": shiftForm.value.end_time,
                            "onUpdate:formattedValue": _cache[23] || (_cache[23] = ($event) => shiftForm.value.end_time = $event),
                            "value-format": "HH:mm",
                            format: "HH:mm",
                            style: { "width": "100%" }
                          }, null, 8, ["formatted-value"])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NFormItem), { label: "备注" }, {
                        default: withCtx(() => [
                          createVNode(unref(NInput), {
                            value: shiftForm.value.remark,
                            "onUpdate:value": _cache[24] || (_cache[24] = ($event) => shiftForm.value.remark = $event)
                          }, null, 8, ["value"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["model"]),
                  createVNode(unref(NSpace), { justify: "end" }, {
                    default: withCtx(() => [
                      createVNode(unref(Button), { onClick: cancelEditShift }, {
                        default: withCtx(() => [..._cache[69] || (_cache[69] = [
                          createTextVNode("取消", -1)
                        ])]),
                        _: 1
                      }),
                      createVNode(unref(Button), {
                        type: "primary",
                        onClick: saveShift
                      }, {
                        default: withCtx(() => [..._cache[70] || (_cache[70] = [
                          createTextVNode("添加班次", -1)
                        ])]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ], 64)) : (openBlock(), createBlock(unref(Button), {
                  key: 1,
                  size: "small",
                  dashed: "",
                  onClick: _cache[25] || (_cache[25] = ($event) => showShiftAddForm.value = true),
                  style: { "width": "100%" }
                }, {
                  default: withCtx(() => [..._cache[71] || (_cache[71] = [
                    createTextVNode("+ 新增班次", -1)
                  ])]),
                  _: 1
                }))
              ])) : createCommentVNode("", true)
            ]),
            _: 1
          }, 8, ["show"]),
          createVNode(unref(NModal), {
            show: showAddEmployeeModal.value,
            "onUpdate:show": _cache[35] || (_cache[35] = ($event) => showAddEmployeeModal.value = $event),
            title: "快速添加员工",
            preset: "card",
            style: { "width": "460px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[34] || (_cache[34] = ($event) => showAddEmployeeModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[73] || (_cache[73] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    loading: addEmployeeSubmitting.value,
                    onClick: saveAddEmployee
                  }, {
                    default: withCtx(() => [..._cache[74] || (_cache[74] = [
                      createTextVNode("确认添加", -1)
                    ])]),
                    _: 1
                  }, 8, ["loading"])
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(NForm), {
                model: addEmployeeForm.value,
                "label-placement": "left",
                "label-width": "90"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), {
                    label: "员工姓名",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: addEmployeeForm.value.real_name,
                        "onUpdate:value": _cache[28] || (_cache[28] = ($event) => addEmployeeForm.value.real_name = $event),
                        placeholder: "真实姓名"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "登录用户名",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: addEmployeeForm.value.username,
                        "onUpdate:value": _cache[29] || (_cache[29] = ($event) => addEmployeeForm.value.username = $event),
                        placeholder: "用于登录的账号"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "初始密码",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: addEmployeeForm.value.password,
                        "onUpdate:value": _cache[30] || (_cache[30] = ($event) => addEmployeeForm.value.password = $event),
                        type: "password",
                        "show-password-on": "click",
                        placeholder: "至少6位"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "手机号" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: addEmployeeForm.value.phone,
                        "onUpdate:value": _cache[31] || (_cache[31] = ($event) => addEmployeeForm.value.phone = $event),
                        placeholder: "可选"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "职位" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: addEmployeeForm.value.position,
                        "onUpdate:value": _cache[32] || (_cache[32] = ($event) => addEmployeeForm.value.position = $event),
                        options: positionOptions,
                        filterable: "",
                        tag: "",
                        placeholder: "选择或输入职位（可选）",
                        clearable: ""
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "角色",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: addEmployeeForm.value.role_id,
                        "onUpdate:value": _cache[33] || (_cache[33] = ($event) => addEmployeeForm.value.role_id = $event),
                        options: roleOptions.value,
                        placeholder: "请选择角色"
                      }, null, 8, ["value", "options"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["model"])
            ]),
            _: 1
          }, 8, ["show"]),
          createVNode(unref(NModal), {
            show: showBatchModal.value,
            "onUpdate:show": _cache[44] || (_cache[44] = ($event) => showBatchModal.value = $event),
            title: "批量排班",
            preset: "card",
            style: { "width": "480px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[43] || (_cache[43] = ($event) => showBatchModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[75] || (_cache[75] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    loading: batchSubmitting.value,
                    onClick: saveBatch
                  }, {
                    default: withCtx(() => [..._cache[76] || (_cache[76] = [
                      createTextVNode("批量创建", -1)
                    ])]),
                    _: 1
                  }, 8, ["loading"])
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(NForm), {
                model: batchForm.value,
                "label-placement": "left",
                "label-width": "90"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), {
                    label: "员工",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: batchForm.value.user_id,
                        "onUpdate:value": _cache[36] || (_cache[36] = ($event) => batchForm.value.user_id = $event),
                        options: employeeOptions.value,
                        filterable: ""
                      }, null, 8, ["value", "options"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "班次",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: batchForm.value.shift_id,
                        "onUpdate:value": _cache[37] || (_cache[37] = ($event) => batchForm.value.shift_id = $event),
                        options: shiftOptions.value
                      }, null, 8, ["value", "options"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "日期范围",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NDatePicker), {
                        value: batchForm.value.date_range,
                        "onUpdate:value": _cache[38] || (_cache[38] = ($event) => batchForm.value.date_range = $event),
                        type: "daterange",
                        style: { "width": "100%" }
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "重复星期",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NCheckboxGroup), {
                        value: batchForm.value.weekdays,
                        "onUpdate:value": _cache[39] || (_cache[39] = ($event) => batchForm.value.weekdays = $event)
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(NSpace), { wrap: "" }, {
                            default: withCtx(() => [
                              (openBlock(), createElementBlock(Fragment, null, renderList(weekDayCheckOptions, (opt) => {
                                return createVNode(unref(NCheckbox), {
                                  key: opt.value,
                                  value: opt.value,
                                  label: opt.label
                                }, null, 8, ["value", "label"]);
                              }), 64))
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "任务类型" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: batchForm.value.task_type,
                        "onUpdate:value": _cache[40] || (_cache[40] = ($event) => batchForm.value.task_type = $event),
                        options: taskTypeOptions,
                        clearable: "",
                        placeholder: "可选"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "负责区域" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: batchForm.value.task_target,
                        "onUpdate:value": _cache[41] || (_cache[41] = ($event) => batchForm.value.task_target = $event),
                        placeholder: "可选"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "备注" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: batchForm.value.remark,
                        "onUpdate:value": _cache[42] || (_cache[42] = ($event) => batchForm.value.remark = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["model"]),
              _cache[77] || (_cache[77] = createBaseVNode("div", { class: "text-xs text-gray-400 mb-2" }, " 将在所选日期范围内，匹配勾选星期的每一天创建一条排班记录（与已有排班冲突的日期会自动跳过）。 ", -1))
            ]),
            _: 1
          }, 8, ["show"])
        ]),
        _: 1
      });
    };
  }
});
const ScheduleView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-08e32f84"]]);
export {
  ScheduleView as default
};
