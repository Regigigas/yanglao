import { _ as _sfc_main$2 } from "./BaseTable.vue_vue_type_script_setup_true_lang-Kf6svQhn.js";
import "./vendor-echarts-DEbY5nl3.js";
import { _ as _sfc_main$1 } from "./BasePage.vue_vue_type_script_setup_true_lang-CoKRdyPV.js";
import { u as useAuthStore } from "./index-77IpmxCe.js";
import { S as defineStore, r as ref, l as defineComponent, U as createBlock, W as withCtx, u as unref, c as computed, V as openBlock, X as createVNode, a3 as createBaseVNode, a1 as createElementBlock, a8 as toDisplayString, a9 as createCommentVNode, k as createTextVNode, a6 as renderList, F as Fragment, q as h } from "./vendor-vue-Hc3ejqjp.js";
import { u as useUserStore } from "./user.store-CgFXZFBa.js";
import { u as usePageRefresh } from "./usePageRefresh-Wnx_lW1d.js";
import { u as useMessage, Y as NCalendar, v as NSpace, B as Button, g as NCard, U as NTabs, T as NTabPane, x as NBadge, j as NForm, k as NFormItem, l as NInput, H as NDatePicker, I as NTimePicker, J as NSelect, _ as NCheckboxGroup, w as NTooltip, h as NModal, m as NCheckbox, $ as NPopconfirm, o as NTag } from "./vendor-naive-sdNTCZPI.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./vendor-query-CFvMrhIw.js";
import "./useAutoRefresh-BeuDS8Br.js";
const useTaskReminderStore = defineStore("taskReminder", () => {
  const myList = ref([]);
  const createdList = ref([]);
  async function fetchMine(userId, includeInactive = false) {
    myList.value = await window.api.reminder.listMine(userId, includeInactive);
  }
  async function fetchCreated(userId) {
    createdList.value = await window.api.reminder.listCreated(userId);
  }
  async function create(data) {
    const row = await window.api.reminder.create(data);
    myList.value.unshift(row);
    return row;
  }
  async function update(id, data) {
    await window.api.reminder.update(id, data);
    const idx = myList.value.findIndex((r) => r.id === id);
    if (idx !== -1) Object.assign(myList.value[idx], data);
  }
  async function markDone(id) {
    await window.api.reminder.done(id);
    const item = myList.value.find((r) => r.id === id);
    if (item) item.status = "done";
  }
  async function cancel(id) {
    await window.api.reminder.cancel(id);
    const item = myList.value.find((r) => r.id === id);
    if (item) item.status = "cancelled";
  }
  async function remove(id) {
    await window.api.reminder.delete(id);
    myList.value = myList.value.filter((r) => r.id !== id);
    createdList.value = createdList.value.filter((r) => r.id !== id);
  }
  return {
    myList,
    createdList,
    fetchMine,
    fetchCreated,
    create,
    update,
    markDone,
    cancel,
    remove
  };
});
const _hoisted_1 = { class: "cal-cell-extra" };
const _hoisted_2 = {
  key: 0,
  class: "cal-dot-badge"
};
const _hoisted_3 = { style: { "flex": "1", "min-height": "0", "padding": "12px 16px" } };
const _hoisted_4 = { style: { "flex": "1", "min-height": "0", "padding": "0 16px 12px" } };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "TaskReminder" },
  __name: "TaskReminderView",
  setup(__props) {
    const message = useMessage();
    const auth = useAuthStore();
    const store = useTaskReminderStore();
    const users = useUserStore();
    const canAssign = computed(() => auth.canUseButton("reminder:assign"));
    const myId = computed(() => auth.currentUser?.id ?? "");
    const activeTab = ref("mine");
    async function loadData() {
      if (!myId.value) return;
      await Promise.all([
        store.fetchMine(myId.value, true),
        store.fetchCreated(myId.value),
        users.fetchList()
      ]);
    }
    const { refresh, refreshing } = usePageRefresh(loadData);
    const userOptions = computed(
      () => users.list.filter((u) => u.status === "active").map((u) => ({ label: `${u.real_name}${u.position ? ` · ${u.position}` : ""}`, value: u.id }))
    );
    function getUserName(userId) {
      return users.list.find((u) => u.id === userId)?.real_name ?? userId;
    }
    const repeatTypeOptions = [
      { label: "不重复", value: "none" },
      { label: "每天", value: "daily" },
      { label: "每周", value: "weekly" },
      { label: "每月", value: "monthly" }
    ];
    const weekDayOptions = [
      { label: "周日", value: 0 },
      { label: "周一", value: 1 },
      { label: "周二", value: 2 },
      { label: "周三", value: 3 },
      { label: "周四", value: 4 },
      { label: "周五", value: 5 },
      { label: "周六", value: 6 }
    ];
    const monthDayOptions = Array.from({ length: 31 }, (_, i) => ({ label: `${i + 1}日`, value: i + 1 }));
    const showModal = ref(false);
    const editingId = ref(null);
    const submitting = ref(false);
    const defaultForm = () => ({
      title: "",
      description: "",
      remind_at: "09:00",
      remind_date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      repeat_type: "none",
      repeat_days: [],
      assignee_id: myId.value
    });
    const form = ref(defaultForm());
    function openCreate(presetDate) {
      editingId.value = null;
      form.value = defaultForm();
      form.value.assignee_id = myId.value;
      if (presetDate) form.value.remind_date = presetDate;
      showModal.value = true;
    }
    function openEdit(row) {
      editingId.value = row.id;
      form.value = {
        title: row.title,
        description: row.description ?? "",
        remind_at: row.remind_at,
        remind_date: row.remind_date,
        repeat_type: row.repeat_type,
        repeat_days: row.repeat_days ? JSON.parse(row.repeat_days) : [],
        assignee_id: row.assignee_id
      };
      showModal.value = true;
    }
    async function handleSave() {
      if (!form.value.title.trim()) return message.error("请填写任务标题");
      if (!form.value.remind_at) return message.error("请选择提醒时间");
      if (!form.value.remind_date) return message.error("请选择日期");
      if (form.value.repeat_type === "weekly" && !form.value.repeat_days.length) {
        return message.error("每周重复请至少勾选一天");
      }
      if (form.value.repeat_type === "monthly" && !form.value.repeat_days.length) {
        return message.error("每月重复请至少选择一个日期");
      }
      const payload = {
        title: form.value.title.trim(),
        description: form.value.description.trim() || null,
        remind_at: form.value.remind_at,
        remind_date: form.value.remind_date,
        repeat_type: form.value.repeat_type,
        repeat_days: ["weekly", "monthly"].includes(form.value.repeat_type) ? JSON.stringify(form.value.repeat_days) : null,
        creator_id: myId.value,
        assignee_id: form.value.assignee_id,
        status: "active"
      };
      submitting.value = true;
      try {
        if (editingId.value) {
          await store.update(editingId.value, payload);
          await store.fetchMine(myId.value, true);
          await store.fetchCreated(myId.value);
          message.success("提醒已更新");
        } else {
          await store.create(payload);
          await store.fetchMine(myId.value, true);
          await store.fetchCreated(myId.value);
          message.success("提醒已创建");
        }
        showModal.value = false;
      } finally {
        submitting.value = false;
      }
    }
    async function handleDone(id) {
      await store.markDone(id);
      message.success("已标记完成");
    }
    async function handleCancel(id) {
      await store.cancel(id);
      message.success("已取消提醒");
    }
    async function handleDelete(id) {
      await store.remove(id);
      message.success("已删除");
    }
    function repeatLabel(row) {
      switch (row.repeat_type) {
        case "none":
          return "仅一次";
        case "daily":
          return "每天";
        case "weekly": {
          const names = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
          const days = row.repeat_days ? JSON.parse(row.repeat_days) : [];
          return `每周 ${days.map((d) => names[d]).join("、")}`;
        }
        case "monthly": {
          const days = row.repeat_days ? JSON.parse(row.repeat_days) : [];
          return `每月 ${days.join("、")} 号`;
        }
        default:
          return row.repeat_type;
      }
    }
    function statusTag(row) {
      const map = {
        active: { type: "info", label: "进行中" },
        done: { type: "success", label: "已完成" },
        cancelled: { type: "default", label: "已取消" }
      };
      const cfg = map[row.status] ?? { type: "default", label: row.status };
      return h(NTag, { type: cfg.type, size: "small" }, () => cfg.label);
    }
    const myColumns = computed(() => [
      { title: "任务标题", key: "title", width: 180, ellipsis: { tooltip: true } },
      {
        title: "提醒时间",
        key: "remind_at",
        width: 90,
        render: (r) => `${r.remind_date} ${r.remind_at}`
      },
      { title: "重复规则", key: "repeat_type", width: 160, render: (r) => repeatLabel(r) },
      { title: "创建人", key: "creator_id", width: 90, render: (r) => getUserName(r.creator_id) },
      { title: "状态", key: "status", width: 80, render: statusTag },
      { title: "备注", key: "description", width: 150, ellipsis: { tooltip: true }, render: (r) => r.description || "—" },
      {
        title: "操作",
        key: "actions",
        width: 220,
        render: (r) => h(NSpace, { size: 4 }, { default: () => [
          h(Button, { size: "small", onClick: () => openEdit(r), disabled: r.status !== "active" }, "编辑"),
          r.status === "active" ? h(NPopconfirm, {
            onPositiveClick: () => handleDone(r.id)
          }, {
            trigger: () => h(Button, { size: "small", type: "success" }, "完成"),
            default: () => "标记为已完成？"
          }) : null,
          r.status === "active" ? h(NPopconfirm, {
            onPositiveClick: () => handleCancel(r.id)
          }, {
            trigger: () => h(Button, { size: "small", type: "warning" }, "取消"),
            default: () => "取消该提醒？"
          }) : null,
          h(NPopconfirm, {
            onPositiveClick: () => handleDelete(r.id)
          }, {
            trigger: () => h(Button, { size: "small", type: "error" }, "删除"),
            default: () => "确认删除？"
          })
        ].filter(Boolean) })
      }
    ]);
    const createdColumns = computed(() => [
      { title: "任务标题", key: "title", width: 180, ellipsis: { tooltip: true } },
      { title: "负责人", key: "assignee_id", width: 100, render: (r) => getUserName(r.assignee_id) },
      {
        title: "提醒时间",
        key: "remind_at",
        width: 160,
        render: (r) => `${r.remind_date} ${r.remind_at}`
      },
      { title: "重复规则", key: "repeat_type", width: 160, render: (r) => repeatLabel(r) },
      { title: "状态", key: "status", width: 80, render: statusTag },
      {
        title: "操作",
        key: "actions",
        width: 100,
        render: (r) => h(NPopconfirm, {
          onPositiveClick: () => handleDelete(r.id)
        }, {
          trigger: () => h(Button, { size: "small", type: "error" }, "删除"),
          default: () => "确认删除该分配的任务？"
        })
      }
    ]);
    const myActiveCount = computed(() => store.myList.filter((r) => r.status === "active").length);
    const calendarReminders = computed(() => {
      const map = /* @__PURE__ */ new Map();
      for (const r of store.myList) map.set(r.id, r);
      for (const r of store.createdList) map.set(r.id, r);
      return Array.from(map.values()).filter((r) => r.status === "active");
    });
    function padZero(n) {
      return String(n).padStart(2, "0");
    }
    function toDateKey(year, month, date) {
      return `${year}-${padZero(month)}-${padZero(date)}`;
    }
    function occursOnDate(row, dateStr) {
      if (dateStr < row.remind_date) return false;
      switch (row.repeat_type) {
        case "none":
          return dateStr === row.remind_date;
        case "daily":
          return true;
        case "weekly": {
          const days = row.repeat_days ? JSON.parse(row.repeat_days) : [];
          const dow = (/* @__PURE__ */ new Date(`${dateStr}T00:00:00`)).getDay();
          return days.includes(dow);
        }
        case "monthly": {
          const days = row.repeat_days ? JSON.parse(row.repeat_days) : [];
          const dom = (/* @__PURE__ */ new Date(`${dateStr}T00:00:00`)).getDate();
          return days.includes(dom);
        }
        default:
          return false;
      }
    }
    function reminderCountOnDate(year, month, date) {
      const dateStr = toDateKey(year, month, date);
      let count = 0;
      for (const r of calendarReminders.value) {
        if (occursOnDate(r, dateStr)) count++;
      }
      return count;
    }
    function onCalendarSelect(_value, time) {
      openCreate(toDateKey(time.year, time.month, time.date));
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), {
        title: "任务提醒",
        class: "page-reminder"
      }, {
        default: withCtx(() => [
          createVNode(unref(NCard), {
            class: "calendar-card mb-4",
            bordered: true
          }, {
            header: withCtx(() => [..._cache[13] || (_cache[13] = [
              createBaseVNode("span", { class: "text-sm text-gray-500" }, "点击日期可快速新建提醒，有提醒的日期下方显示数量角标", -1)
            ])]),
            "header-extra": withCtx(() => [
              createVNode(unref(NSpace), null, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    loading: unref(refreshing),
                    size: "small",
                    onClick: unref(refresh)
                  }, {
                    default: withCtx(() => [..._cache[14] || (_cache[14] = [
                      createTextVNode("刷新", -1)
                    ])]),
                    _: 1
                  }, 8, ["loading", "onClick"]),
                  createVNode(unref(Button), {
                    type: "primary",
                    size: "small",
                    onClick: _cache[0] || (_cache[0] = ($event) => openCreate())
                  }, {
                    default: withCtx(() => [..._cache[15] || (_cache[15] = [
                      createTextVNode("+ 新建提醒", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(NCalendar), { "onUpdate:value": onCalendarSelect }, {
                default: withCtx(({ year, month, date }) => [
                  createBaseVNode("div", _hoisted_1, [
                    reminderCountOnDate(year, month, date) > 0 ? (openBlock(), createElementBlock("span", _hoisted_2, toDisplayString(reminderCountOnDate(year, month, date)), 1)) : createCommentVNode("", true)
                  ])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          createVNode(unref(NCard), {
            class: "list-card",
            bordered: true,
            "content-style": "display:flex;flex-direction:column;padding:0;height:100%"
          }, {
            default: withCtx(() => [
              createVNode(unref(NTabs), {
                value: activeTab.value,
                "onUpdate:value": _cache[1] || (_cache[1] = ($event) => activeTab.value = $event),
                type: "line",
                animated: "",
                style: { "height": "100%", "display": "flex", "flex-direction": "column" },
                "pane-wrapper-style": "flex:1;overflow:hidden",
                "pane-style": "height:100%"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NTabPane), {
                    name: "mine",
                    style: { "height": "100%", "display": "flex", "flex-direction": "column" }
                  }, {
                    tab: withCtx(() => [
                      createVNode(unref(NBadge), {
                        value: myActiveCount.value,
                        max: 99,
                        show: myActiveCount.value > 0,
                        type: "info"
                      }, {
                        default: withCtx(() => [..._cache[16] || (_cache[16] = [
                          createTextVNode(" 我的提醒 ", -1)
                        ])]),
                        _: 1
                      }, 8, ["value", "show"])
                    ]),
                    default: withCtx(() => [
                      createBaseVNode("div", _hoisted_3, [
                        createVNode(unref(_sfc_main$2), {
                          "flex-height": "",
                          style: { "height": "100%" },
                          columns: myColumns.value,
                          data: unref(store).myList,
                          "row-key": (row) => row.id
                        }, null, 8, ["columns", "data", "row-key"])
                      ])
                    ]),
                    _: 1
                  }),
                  canAssign.value ? (openBlock(), createBlock(unref(NTabPane), {
                    key: 0,
                    name: "created",
                    style: { "height": "100%", "display": "flex", "flex-direction": "column" }
                  }, {
                    tab: withCtx(() => [..._cache[17] || (_cache[17] = [
                      createTextVNode("我分配的任务", -1)
                    ])]),
                    default: withCtx(() => [
                      _cache[18] || (_cache[18] = createBaseVNode("div", { class: "text-sm text-gray-400 px-4 pt-3 pb-1" }, "这里显示您分配给其他人的任务提醒，对方在自己设备登录后会收到闹钟提醒。", -1)),
                      createBaseVNode("div", _hoisted_4, [
                        createVNode(unref(_sfc_main$2), {
                          "flex-height": "",
                          style: { "height": "100%" },
                          columns: createdColumns.value,
                          data: unref(store).createdList.filter((r) => r.assignee_id !== myId.value),
                          "row-key": (row) => row.id
                        }, null, 8, ["columns", "data", "row-key"])
                      ])
                    ]),
                    _: 1
                  })) : createCommentVNode("", true)
                ]),
                _: 1
              }, 8, ["value"])
            ]),
            _: 1
          }),
          createVNode(unref(NModal), {
            show: showModal.value,
            "onUpdate:show": _cache[12] || (_cache[12] = ($event) => showModal.value = $event),
            title: editingId.value ? "编辑任务提醒" : "新建任务提醒",
            preset: "card",
            style: { "width": "520px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[11] || (_cache[11] = ($event) => showModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[20] || (_cache[20] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    loading: submitting.value,
                    onClick: handleSave
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(editingId.value ? "保存修改" : "创建提醒"), 1)
                    ]),
                    _: 1
                  }, 8, ["loading"])
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(NForm), {
                model: form.value,
                "label-placement": "left",
                "label-width": "80"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), {
                    label: "任务标题",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: form.value.title,
                        "onUpdate:value": _cache[2] || (_cache[2] = ($event) => form.value.title = $event),
                        placeholder: "请输入任务标题，如：巡查3号楼",
                        maxlength: "60",
                        "show-count": ""
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "备注说明" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: form.value.description,
                        "onUpdate:value": _cache[3] || (_cache[3] = ($event) => form.value.description = $event),
                        type: "textarea",
                        rows: 2,
                        placeholder: "可填写任务详情、注意事项等（选填）"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "提醒日期",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NDatePicker), {
                        "formatted-value": form.value.remind_date,
                        "onUpdate:formattedValue": _cache[4] || (_cache[4] = ($event) => form.value.remind_date = $event),
                        "value-format": "yyyy-MM-dd",
                        type: "date",
                        style: { "width": "100%" }
                      }, null, 8, ["formatted-value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "提醒时间",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NTimePicker), {
                        "formatted-value": form.value.remind_at,
                        "onUpdate:formattedValue": _cache[5] || (_cache[5] = ($event) => form.value.remind_at = $event),
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
                        value: form.value.repeat_type,
                        "onUpdate:value": _cache[6] || (_cache[6] = ($event) => form.value.repeat_type = $event),
                        options: repeatTypeOptions
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  form.value.repeat_type === "weekly" ? (openBlock(), createBlock(unref(NFormItem), {
                    key: 0,
                    label: "重复星期"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NCheckboxGroup), {
                        value: form.value.repeat_days,
                        "onUpdate:value": _cache[7] || (_cache[7] = ($event) => form.value.repeat_days = $event)
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(NSpace), { wrap: "" }, {
                            default: withCtx(() => [
                              (openBlock(), createElementBlock(Fragment, null, renderList(weekDayOptions, (opt) => {
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
                  form.value.repeat_type === "monthly" ? (openBlock(), createBlock(unref(NFormItem), {
                    key: 1,
                    label: "重复日期"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NCheckboxGroup), {
                        value: form.value.repeat_days,
                        "onUpdate:value": _cache[8] || (_cache[8] = ($event) => form.value.repeat_days = $event)
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(NSpace), { wrap: "" }, {
                            default: withCtx(() => [
                              (openBlock(true), createElementBlock(Fragment, null, renderList(unref(monthDayOptions), (opt) => {
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
                  })) : createCommentVNode("", true),
                  createVNode(unref(NFormItem), { label: "负责人" }, {
                    default: withCtx(() => [
                      !canAssign.value ? (openBlock(), createBlock(unref(NTooltip), {
                        key: 0,
                        disabled: canAssign.value
                      }, {
                        trigger: withCtx(() => [
                          createVNode(unref(NSelect), {
                            value: form.value.assignee_id,
                            "onUpdate:value": _cache[9] || (_cache[9] = ($event) => form.value.assignee_id = $event),
                            options: userOptions.value,
                            disabled: !canAssign.value,
                            filterable: ""
                          }, null, 8, ["value", "options", "disabled"])
                        ]),
                        default: withCtx(() => [
                          _cache[19] || (_cache[19] = createTextVNode(" 您没有分配任务给他人的权限 ", -1))
                        ]),
                        _: 1
                      }, 8, ["disabled"])) : (openBlock(), createBlock(unref(NSelect), {
                        key: 1,
                        value: form.value.assignee_id,
                        "onUpdate:value": _cache[10] || (_cache[10] = ($event) => form.value.assignee_id = $event),
                        options: userOptions.value,
                        filterable: "",
                        placeholder: "选择负责人（默认为自己）"
                      }, null, 8, ["value", "options"]))
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["model"])
            ]),
            _: 1
          }, 8, ["show", "title"])
        ]),
        _: 1
      });
    };
  }
});
const TaskReminderView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-f5f0b1c9"]]);
export {
  TaskReminderView as default
};
