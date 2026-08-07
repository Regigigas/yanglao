import { _ as _sfc_main$2 } from "./BaseTable.vue_vue_type_script_setup_true_lang-vD6Hc9gq.js";
import "./vendor-echarts-DEbY5nl3.js";
import { _ as _sfc_main$1 } from "./BasePage.vue_vue_type_script_setup_true_lang-CnaIdrBG.js";
import "./index-qSxYm2OB.js";
import { S as defineStore, r as ref, l as defineComponent, U as createBlock, W as withCtx, u as unref, V as openBlock, X as createVNode, k as createTextVNode, a9 as createCommentVNode, a8 as toDisplayString, c as computed, q as h } from "./vendor-vue-Hc3ejqjp.js";
import { u as useElderlyStore } from "./elderly.store-isfnimJX.js";
import { a as formatDate } from "./validators-BfKhytEl.js";
import { u as usePageRefresh } from "./usePageRefresh-Wnx_lW1d.js";
import { u as useMessage, p as useDialog, v as NSpace, J as NSelect, l as NInput, B as Button, g as NCard, j as NForm, k as NFormItem, H as NDatePicker, I as NTimePicker, T as NInputNumber, h as NModal, o as NTag } from "./vendor-naive-DqQyyJr8.js";
import "./vendor-query-CFvMrhIw.js";
import "./vendor-utils-DD6FGs_H.js";
import "./useAutoRefresh-BeuDS8Br.js";
const useActivityStore = defineStore("activity", () => {
  const list = ref([]);
  const attendance = ref([]);
  const loading = ref(false);
  async function fetchAll(status) {
    loading.value = true;
    try {
      list.value = await window.api.activity.list(status);
    } finally {
      loading.value = false;
    }
  }
  async function create(data) {
    const row = await window.api.activity.create(data);
    list.value.unshift(row);
    return row;
  }
  async function update(id, data) {
    await window.api.activity.update(id, data);
    const idx = list.value.findIndex((a) => a.id === id);
    if (idx !== -1) list.value[idx] = { ...list.value[idx], ...data };
  }
  async function remove(id) {
    await window.api.activity.delete(id);
    list.value = list.value.filter((a) => a.id !== id);
  }
  async function start(id) {
    await window.api.activity.start(id);
    updateListStatus(id, "ongoing");
  }
  async function complete(id) {
    await window.api.activity.complete(id);
    updateListStatus(id, "completed");
  }
  async function cancel(id) {
    await window.api.activity.cancel(id);
    updateListStatus(id, "cancelled");
  }
  async function fetchAttendance(activityId) {
    attendance.value = await window.api.activity.attendance.list(activityId);
  }
  async function register(activityId, elderlyId) {
    const row = await window.api.activity.attendance.register(activityId, elderlyId);
    attendance.value.push(row);
    return row;
  }
  async function checkIn(activityId, elderlyId) {
    await window.api.activity.attendance.checkIn(activityId, elderlyId);
    const idx = attendance.value.findIndex((a) => a.elderly_id === elderlyId);
    if (idx !== -1) attendance.value[idx] = { ...attendance.value[idx], status: "attended", check_in_at: Date.now() };
  }
  async function markAbsent(activityId, elderlyId) {
    await window.api.activity.attendance.absent(activityId, elderlyId);
    const idx = attendance.value.findIndex((a) => a.elderly_id === elderlyId);
    if (idx !== -1) attendance.value[idx] = { ...attendance.value[idx], status: "absent" };
  }
  async function removeAttendance(activityId, elderlyId) {
    await window.api.activity.attendance.remove(activityId, elderlyId);
    attendance.value = attendance.value.filter((a) => a.elderly_id !== elderlyId);
  }
  function updateListStatus(id, status) {
    const idx = list.value.findIndex((activity) => activity.id === id);
    if (idx !== -1) list.value[idx] = { ...list.value[idx], status };
  }
  return {
    list,
    attendance,
    loading,
    fetchAll,
    create,
    update,
    remove,
    start,
    complete,
    cancel,
    fetchAttendance,
    register,
    checkIn,
    markAbsent,
    removeAttendance
  };
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "Activity" },
  __name: "ActivityView",
  setup(__props) {
    const activityStore = useActivityStore();
    const elderlyStore = useElderlyStore();
    const message = useMessage();
    const dialog = useDialog();
    const saving = ref(false);
    const activityStatusFilter = ref(null);
    const activityKeyword = ref("");
    async function loadData() {
      await Promise.all([activityStore.fetchAll(), elderlyStore.fetchList()]);
    }
    const { refresh, refreshing } = usePageRefresh(loadData);
    const showActivityModal = ref(false);
    const editingActivityId = ref(null);
    function createActivityForm() {
      return {
        title: "",
        category: "entertainment",
        activity_date: formatDate(Date.now()),
        start_time: null,
        end_time: null,
        location: "",
        organizer: "",
        max_capacity: null,
        description: ""
      };
    }
    const activityForm = ref(createActivityForm());
    const categoryOptions = [
      { label: "文娱活动", value: "entertainment" },
      { label: "体育锻炼", value: "sports" },
      { label: "文化学习", value: "cultural" },
      { label: "健康保健", value: "health" },
      { label: "其他", value: "other" }
    ];
    const statusTagType = {
      planned: "info",
      ongoing: "warning",
      completed: "success",
      cancelled: "default"
    };
    const statusLabel = {
      planned: "计划中",
      ongoing: "进行中",
      completed: "已完成",
      cancelled: "已取消"
    };
    const statusOptions = [
      { label: "计划中", value: "planned" },
      { label: "进行中", value: "ongoing" },
      { label: "已完成", value: "completed" },
      { label: "已取消", value: "cancelled" }
    ];
    function errorMessage(error, fallback) {
      return error instanceof Error ? error.message : fallback;
    }
    function openActivityCreate() {
      editingActivityId.value = null;
      activityForm.value = createActivityForm();
      showActivityModal.value = true;
    }
    function openActivityEdit(activity) {
      editingActivityId.value = activity.id;
      activityForm.value = {
        title: activity.title,
        category: activity.category,
        activity_date: activity.activity_date.slice(0, 10),
        start_time: activity.start_time,
        end_time: activity.end_time,
        location: activity.location ?? "",
        organizer: activity.organizer ?? "",
        max_capacity: activity.max_capacity,
        description: activity.description ?? ""
      };
      showActivityModal.value = true;
    }
    async function saveActivity() {
      const form = activityForm.value;
      if (!form.title.trim() || !form.activity_date) return message.error("请填写活动标题和日期");
      if (form.end_time && !form.start_time) return message.error("请先填写开始时间");
      if (form.start_time && form.end_time && form.start_time >= form.end_time) return message.error("结束时间必须晚于开始时间");
      const data = {
        title: form.title.trim(),
        category: form.category,
        activity_date: form.activity_date,
        start_time: form.start_time,
        end_time: form.end_time,
        location: form.location.trim() || null,
        organizer: form.organizer.trim() || null,
        max_capacity: form.max_capacity,
        description: form.description.trim() || null
      };
      saving.value = true;
      try {
        if (editingActivityId.value) {
          await activityStore.update(editingActivityId.value, data);
          message.success("活动已更新");
        } else {
          await activityStore.create({ ...data, status: "planned", created_by: null, deleted_at: null });
          message.success("活动已创建");
        }
        showActivityModal.value = false;
        await activityStore.fetchAll();
      } catch (error) {
        message.error(errorMessage(error, "保存活动失败"));
      } finally {
        saving.value = false;
      }
    }
    const filteredActivities = computed(() => {
      const keyword = activityKeyword.value.trim().toLowerCase();
      return activityStore.list.filter((activity) => {
        const matchedStatus = !activityStatusFilter.value || activity.status === activityStatusFilter.value;
        const matchedKeyword = !keyword || [activity.title, activity.location ?? "", activity.organizer ?? ""].some((value) => value.toLowerCase().includes(keyword));
        return matchedStatus && matchedKeyword;
      });
    });
    function cancelActivity(activity) {
      dialog.warning({
        title: "取消活动",
        content: `确定取消“${activity.title}”吗？取消后不可恢复。`,
        positiveText: "确定取消",
        negativeText: "返回",
        onPositiveClick: async () => {
          try {
            await activityStore.cancel(activity.id);
            if (currentActivity.value?.id === activity.id) currentActivity.value = { ...currentActivity.value, status: "cancelled" };
            message.success("活动已取消");
          } catch (error) {
            message.error(errorMessage(error, "取消活动失败"));
          }
        }
      });
    }
    const activityColumns = [
      { title: "活动名称", key: "title", width: 150, ellipsis: { tooltip: true } },
      { title: "分类", key: "category", width: 100, render: (r) => categoryOptions.find((c) => c.value === r.category)?.label ?? r.category },
      { title: "日期", key: "activity_date", width: 120, render: (r) => formatDate(r.activity_date) },
      { title: "时间", key: "time", width: 120, render: (r) => r.start_time ? `${r.start_time}~${r.end_time ?? ""}` : "—" },
      { title: "地点", key: "location", width: 120 },
      { title: "状态", key: "status", width: 90, render: (r) => h(NTag, { type: statusTagType[r.status] ?? "default" }, () => statusLabel[r.status] ?? r.status) },
      {
        title: "操作",
        key: "actions",
        width: 320,
        render: (r) => h(NSpace, null, { default: () => [
          h(Button, { size: "small", onClick: () => openAttendance(r) }, "签到管理"),
          ...r.status === "planned" ? [
            h(Button, { size: "small", onClick: () => openActivityEdit(r) }, "编辑"),
            h(Button, { size: "small", type: "primary", onClick: () => startActivity(r) }, "开始")
          ] : [],
          ...r.status === "ongoing" ? [
            h(Button, { size: "small", type: "primary", onClick: () => finishActivity(r) }, "结束")
          ] : [],
          ...r.status === "planned" || r.status === "ongoing" ? [
            h(Button, { size: "small", onClick: () => cancelActivity(r) }, "取消")
          ] : [],
          h(Button, { size: "small", type: "error", onClick: () => {
            dialog.warning({
              title: "删除",
              content: "确认删除此活动？",
              positiveText: "确定",
              negativeText: "取消",
              onPositiveClick: async () => {
                await activityStore.remove(r.id);
                message.success("已删除");
                await refresh();
              }
            });
          } }, "删除")
        ] })
      }
    ];
    const showAttendanceModal = ref(false);
    const currentActivity = ref(null);
    const addElderlyId = ref(null);
    const elderlyOptions = computed(
      () => elderlyStore.list.filter((e) => e.status === "active").map((e) => ({ label: e.name, value: e.id }))
    );
    const availableElderlyOptions = computed(() => {
      const registeredIds = new Set(activityStore.attendance.map((row) => row.elderly_id));
      return elderlyOptions.value.filter((option) => !registeredIds.has(option.value));
    });
    const attendanceStats = computed(() => ({
      registered: activityStore.attendance.filter((row) => row.status === "registered").length,
      attended: activityStore.attendance.filter((row) => row.status === "attended").length,
      absent: activityStore.attendance.filter((row) => row.status === "absent").length
    }));
    const isAtCapacity = computed(() => currentActivity.value?.max_capacity !== null && currentActivity.value !== null && activityStore.attendance.length >= currentActivity.value.max_capacity);
    const canManageParticipants = computed(() => currentActivity.value?.status === "planned" || currentActivity.value?.status === "ongoing");
    const canCheckIn = computed(() => currentActivity.value?.status === "ongoing");
    async function openAttendance(activity) {
      currentActivity.value = activity;
      await activityStore.fetchAttendance(activity.id);
      showAttendanceModal.value = true;
    }
    async function startActivity(activity = currentActivity.value) {
      if (!activity) return;
      try {
        await activityStore.start(activity.id);
        if (currentActivity.value?.id === activity.id) currentActivity.value = { ...currentActivity.value, status: "ongoing" };
        message.success("活动已开始");
      } catch (error) {
        message.error(errorMessage(error, "开始活动失败"));
      }
    }
    function finishActivity(activity = currentActivity.value) {
      if (!activity) return;
      dialog.warning({
        title: "结束活动",
        content: "未签到的参与者将统一标记为缺席，确定结束此活动吗？",
        positiveText: "结束活动",
        negativeText: "返回",
        onPositiveClick: async () => {
          try {
            await activityStore.complete(activity.id);
            if (currentActivity.value?.id === activity.id) {
              currentActivity.value = { ...currentActivity.value, status: "completed" };
              await activityStore.fetchAttendance(activity.id);
            }
            message.success("活动已完成");
          } catch (error) {
            message.error(errorMessage(error, "结束活动失败"));
          }
        }
      });
    }
    async function addParticipant() {
      if (!addElderlyId.value || !currentActivity.value || isAtCapacity.value) return;
      try {
        await activityStore.register(currentActivity.value.id, addElderlyId.value);
        addElderlyId.value = null;
        message.success("已报名");
        await activityStore.fetchAttendance(currentActivity.value.id);
      } catch (error) {
        message.error(errorMessage(error, "报名失败"));
      }
    }
    async function doCheckIn(elderlyId) {
      if (!currentActivity.value || !canCheckIn.value) return;
      try {
        await activityStore.checkIn(currentActivity.value.id, elderlyId);
        message.success("签到成功");
        await activityStore.fetchAttendance(currentActivity.value.id);
      } catch (error) {
        message.error(errorMessage(error, "签到失败"));
      }
    }
    async function markAbsent(elderlyId) {
      if (!currentActivity.value || !canCheckIn.value) return;
      try {
        await activityStore.markAbsent(currentActivity.value.id, elderlyId);
        message.success("已标记缺席");
      } catch (error) {
        message.error(errorMessage(error, "标记缺席失败"));
      }
    }
    async function removeParticipant(elderlyId) {
      if (!currentActivity.value || !canManageParticipants.value) return;
      try {
        await activityStore.removeAttendance(currentActivity.value.id, elderlyId);
        message.success("已移除参与者");
      } catch (error) {
        message.error(errorMessage(error, "移除参与者失败"));
      }
    }
    const attendanceColumns = [
      { title: "老人", key: "elderly_id", width: 100, render: (r) => elderlyStore.list.find((e) => e.id === r.elderly_id)?.name ?? r.elderly_id },
      { title: "状态", key: "status", width: 90, render: (r) => h(NTag, {
        type: r.status === "attended" ? "success" : r.status === "absent" ? "error" : "info"
      }, () => ({ registered: "已报名", attended: "已签到", absent: "缺席" })[r.status] ?? r.status) },
      { title: "签到时间", key: "check_in_at", width: 160, render: (r) => r.check_in_at ? new Date(r.check_in_at).toLocaleString() : "—" },
      { title: "操作", key: "actions", width: 210, render: (r) => h(NSpace, null, { default: () => [
        h(Button, { size: "small", type: "primary", disabled: !canCheckIn.value || r.status !== "registered", onClick: () => doCheckIn(r.elderly_id) }, "签到"),
        h(Button, { size: "small", disabled: !canCheckIn.value || r.status !== "registered", onClick: () => markAbsent(r.elderly_id) }, "缺席"),
        h(Button, { size: "small", type: "error", disabled: !canManageParticipants.value || r.status !== "registered", onClick: () => removeParticipant(r.elderly_id) }, "移除")
      ] }) }
    ];
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), { title: "活动管理" }, {
        default: withCtx(() => [
          createVNode(unref(NCard), { class: "mb-4" }, {
            default: withCtx(() => [
              createVNode(unref(NSpace), null, {
                default: withCtx(() => [
                  createVNode(unref(NSelect), {
                    value: activityStatusFilter.value,
                    "onUpdate:value": _cache[0] || (_cache[0] = ($event) => activityStatusFilter.value = $event),
                    options: statusOptions,
                    clearable: "",
                    placeholder: "活动状态",
                    style: { "width": "130px" }
                  }, null, 8, ["value"]),
                  createVNode(unref(NInput), {
                    value: activityKeyword.value,
                    "onUpdate:value": _cache[1] || (_cache[1] = ($event) => activityKeyword.value = $event),
                    clearable: "",
                    placeholder: "搜索活动名称、地点或组织者",
                    style: { "width": "240px" }
                  }, null, 8, ["value"]),
                  createVNode(unref(Button), {
                    loading: unref(refreshing),
                    size: "small",
                    onClick: unref(refresh)
                  }, {
                    default: withCtx(() => [..._cache[18] || (_cache[18] = [
                      createTextVNode("刷新", -1)
                    ])]),
                    _: 1
                  }, 8, ["loading", "onClick"]),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: openActivityCreate
                  }, {
                    default: withCtx(() => [..._cache[19] || (_cache[19] = [
                      createTextVNode("+ 新增活动", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          createVNode(unref(NCard), null, {
            default: withCtx(() => [
              createVNode(unref(_sfc_main$2), {
                columns: activityColumns,
                data: filteredActivities.value,
                loading: unref(activityStore).loading,
                pagination: { pageSize: 15 }
              }, null, 8, ["data", "loading"])
            ]),
            _: 1
          }),
          createVNode(unref(NModal), {
            show: showActivityModal.value,
            "onUpdate:show": _cache[12] || (_cache[12] = ($event) => showActivityModal.value = $event),
            title: editingActivityId.value ? "编辑活动" : "新增活动",
            preset: "card",
            style: { "width": "520px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[11] || (_cache[11] = ($event) => showActivityModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[20] || (_cache[20] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    loading: saving.value,
                    onClick: saveActivity
                  }, {
                    default: withCtx(() => [..._cache[21] || (_cache[21] = [
                      createTextVNode("保存", -1)
                    ])]),
                    _: 1
                  }, 8, ["loading"])
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(NForm), {
                model: activityForm.value,
                "label-placement": "left",
                "label-width": "80"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), {
                    label: "活动名称",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: activityForm.value.title,
                        "onUpdate:value": _cache[2] || (_cache[2] = ($event) => activityForm.value.title = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "分类" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: activityForm.value.category,
                        "onUpdate:value": _cache[3] || (_cache[3] = ($event) => activityForm.value.category = $event),
                        options: categoryOptions
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "活动日期",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NDatePicker), {
                        "formatted-value": activityForm.value.activity_date,
                        "onUpdate:formattedValue": _cache[4] || (_cache[4] = ($event) => activityForm.value.activity_date = $event),
                        "value-format": "yyyy-MM-dd",
                        type: "date",
                        style: { "width": "100%" }
                      }, null, 8, ["formatted-value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "开始时间" }, {
                    default: withCtx(() => [
                      createVNode(unref(NTimePicker), {
                        "formatted-value": activityForm.value.start_time,
                        "onUpdate:formattedValue": _cache[5] || (_cache[5] = ($event) => activityForm.value.start_time = $event),
                        "value-format": "HH:mm",
                        format: "HH:mm",
                        style: { "width": "100%" }
                      }, null, 8, ["formatted-value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "结束时间" }, {
                    default: withCtx(() => [
                      createVNode(unref(NTimePicker), {
                        "formatted-value": activityForm.value.end_time,
                        "onUpdate:formattedValue": _cache[6] || (_cache[6] = ($event) => activityForm.value.end_time = $event),
                        "value-format": "HH:mm",
                        format: "HH:mm",
                        style: { "width": "100%" }
                      }, null, 8, ["formatted-value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "活动地点" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: activityForm.value.location,
                        "onUpdate:value": _cache[7] || (_cache[7] = ($event) => activityForm.value.location = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "组织者" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: activityForm.value.organizer,
                        "onUpdate:value": _cache[8] || (_cache[8] = ($event) => activityForm.value.organizer = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "人数上限" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInputNumber), {
                        value: activityForm.value.max_capacity,
                        "onUpdate:value": _cache[9] || (_cache[9] = ($event) => activityForm.value.max_capacity = $event),
                        min: 1,
                        placeholder: "不填表示不限人数",
                        style: { "width": "100%" }
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "活动描述" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: activityForm.value.description,
                        "onUpdate:value": _cache[10] || (_cache[10] = ($event) => activityForm.value.description = $event),
                        type: "textarea",
                        rows: 3
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["model"])
            ]),
            _: 1
          }, 8, ["show", "title"]),
          createVNode(unref(NModal), {
            show: showAttendanceModal.value,
            "onUpdate:show": _cache[17] || (_cache[17] = ($event) => showAttendanceModal.value = $event),
            title: `${currentActivity.value?.title} - 签到管理`,
            preset: "card",
            style: { "width": "600px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[16] || (_cache[16] = ($event) => showAttendanceModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[25] || (_cache[25] = [
                      createTextVNode("关闭", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(NSpace), { class: "mb-3" }, {
                default: withCtx(() => [
                  createVNode(unref(NSelect), {
                    value: addElderlyId.value,
                    "onUpdate:value": _cache[13] || (_cache[13] = ($event) => addElderlyId.value = $event),
                    options: availableElderlyOptions.value,
                    filterable: "",
                    clearable: "",
                    placeholder: "搜索老人",
                    style: { "width": "180px" },
                    disabled: !canManageParticipants.value || isAtCapacity.value
                  }, null, 8, ["value", "options", "disabled"]),
                  createVNode(unref(Button), {
                    type: "primary",
                    disabled: !addElderlyId.value || !canManageParticipants.value || isAtCapacity.value,
                    onClick: addParticipant
                  }, {
                    default: withCtx(() => [..._cache[22] || (_cache[22] = [
                      createTextVNode("添加参与者", -1)
                    ])]),
                    _: 1
                  }, 8, ["disabled"]),
                  currentActivity.value?.status === "planned" ? (openBlock(), createBlock(unref(Button), {
                    key: 0,
                    onClick: _cache[14] || (_cache[14] = () => startActivity())
                  }, {
                    default: withCtx(() => [..._cache[23] || (_cache[23] = [
                      createTextVNode("开始活动", -1)
                    ])]),
                    _: 1
                  })) : createCommentVNode("", true),
                  currentActivity.value?.status === "ongoing" ? (openBlock(), createBlock(unref(Button), {
                    key: 1,
                    onClick: _cache[15] || (_cache[15] = () => finishActivity())
                  }, {
                    default: withCtx(() => [..._cache[24] || (_cache[24] = [
                      createTextVNode("结束活动", -1)
                    ])]),
                    _: 1
                  })) : createCommentVNode("", true)
                ]),
                _: 1
              }),
              createVNode(unref(NSpace), { class: "mb-3" }, {
                default: withCtx(() => [
                  createVNode(unref(NTag), { type: "info" }, {
                    default: withCtx(() => [
                      createTextVNode("报名 " + toDisplayString(unref(activityStore).attendance.length) + toDisplayString(currentActivity.value?.max_capacity != null ? ` / ${currentActivity.value.max_capacity}` : ""), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NTag), { type: "success" }, {
                    default: withCtx(() => [
                      createTextVNode("已签到 " + toDisplayString(attendanceStats.value.attended), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NTag), { type: "error" }, {
                    default: withCtx(() => [
                      createTextVNode("缺席 " + toDisplayString(attendanceStats.value.absent), 1)
                    ]),
                    _: 1
                  }),
                  attendanceStats.value.registered ? (openBlock(), createBlock(unref(NTag), {
                    key: 0,
                    type: "warning"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("待签到 " + toDisplayString(attendanceStats.value.registered), 1)
                    ]),
                    _: 1
                  })) : createCommentVNode("", true)
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$2), {
                columns: attendanceColumns,
                data: unref(activityStore).attendance,
                pagination: false
              }, null, 8, ["data"])
            ]),
            _: 1
          }, 8, ["show", "title"])
        ]),
        _: 1
      });
    };
  }
});
export {
  _sfc_main as default
};
