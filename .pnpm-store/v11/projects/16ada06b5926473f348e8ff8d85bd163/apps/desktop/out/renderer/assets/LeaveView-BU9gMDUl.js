import { _ as _sfc_main$2 } from "./BaseTable.vue_vue_type_script_setup_true_lang-DzS_Zf-X.js";
import "./vendor-echarts-Bn4I93f0.js";
import { _ as _sfc_main$1 } from "./BasePage.vue_vue_type_script_setup_true_lang--gRmLkOT.js";
import { u as useAuthStore } from "./index-Y_pGVxO7.js";
import { u as useAttendanceStore } from "./attendance.store-DgJZ3qF5.js";
import { u as useUserStore } from "./user.store-B7RNEw26.js";
import { f as formatDateTime } from "./validators-BfKhytEl.js";
import { u as usePageRefresh } from "./usePageRefresh-C1gnRN9Y.js";
import { u as useMessage, p as useDialog, v as NSpace, B as Button, g as NCard, T as NTabPane, S as NTabs, j as NForm, k as NFormItem, J as NSelect, H as NDatePicker, l as NInput, h as NModal, o as NTag } from "./vendor-naive-CeveemIE.js";
import { l as defineComponent, r as ref, U as createBlock, W as withCtx, u as unref, V as openBlock, X as createVNode, k as createTextVNode, m as withDirectives, c as computed, q as h, ag as resolveDirective } from "./vendor-vue-C6_copC_.js";
import "./vendor-query-DzdY0EvJ.js";
import "./vendor-utils-DD6FGs_H.js";
import "./useAutoRefresh-BeuDS8Br.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "Leave" },
  __name: "LeaveView",
  setup(__props) {
    const attendanceStore = useAttendanceStore();
    const userStore = useUserStore();
    const authStore = useAuthStore();
    const message = useMessage();
    const dialog = useDialog();
    async function loadData() {
      await Promise.all([userStore.fetchList(), attendanceStore.fetchLeaves()]);
    }
    const { refresh, refreshing } = usePageRefresh(loadData);
    function userName(id) {
      return userStore.list.find((u) => u.id === id)?.real_name ?? "—";
    }
    const myLeaves = computed(
      () => attendanceStore.leaves.filter((l) => l.user_id === authStore.currentUser?.id)
    );
    const pendingLeaves = computed(() => attendanceStore.leaves.filter((l) => l.status === "pending"));
    const showLeaveModal = ref(false);
    const leaveForm = ref({
      leave_type: "personal",
      start_date: formatDateTime(Date.now()),
      end_date: formatDateTime(Date.now()),
      reason: ""
    });
    const leaveTypeOptions = [
      { label: "病假", value: "sick" },
      { label: "年假", value: "annual" },
      { label: "事假", value: "personal" },
      { label: "其他", value: "other" }
    ];
    const leaveTypeLabel = { sick: "病假", annual: "年假", personal: "事假", other: "其他" };
    async function saveLeave() {
      if (!authStore.currentUser) return;
      if (!leaveForm.value.start_date || !leaveForm.value.end_date) return message.error("请选择起止时间");
      await attendanceStore.createLeave({
        user_id: authStore.currentUser.id,
        leave_type: leaveForm.value.leave_type,
        start_date: leaveForm.value.start_date,
        end_date: leaveForm.value.end_date,
        reason: leaveForm.value.reason || null
      });
      showLeaveModal.value = false;
      message.success("请假申请已提交");
      await refresh();
    }
    function approve(row, approved) {
      dialog.warning({
        title: approved ? "批准请假" : "驳回请假",
        content: `确定要${approved ? "批准" : "驳回"}该请假申请吗？`,
        positiveText: "确定",
        negativeText: "取消",
        onPositiveClick: async () => {
          await attendanceStore.approveLeave(row.id, approved);
          message.success(approved ? "已批准" : "已驳回");
          await refresh();
        }
      });
    }
    const statusTagType = { pending: "warning", approved: "success", rejected: "error" };
    const statusLabel = { pending: "待审批", approved: "已批准", rejected: "已驳回" };
    const myColumns = [
      { title: "类型", key: "leave_type", width: 90, render: (r) => leaveTypeLabel[r.leave_type] ?? r.leave_type },
      { title: "开始时间", key: "start_date", width: 160 },
      { title: "结束时间", key: "end_date", width: 160 },
      { title: "原因", key: "reason", render: (r) => r.reason ?? "—" },
      { title: "状态", key: "status", width: 90, render: (r) => h(NTag, { type: statusTagType[r.status] }, () => statusLabel[r.status]) }
    ];
    const pendingColumns = [
      { title: "申请人", key: "user_id", width: 100, render: (r) => userName(r.user_id) },
      { title: "类型", key: "leave_type", width: 90, render: (r) => leaveTypeLabel[r.leave_type] ?? r.leave_type },
      { title: "开始时间", key: "start_date", width: 160 },
      { title: "结束时间", key: "end_date", width: 160 },
      { title: "原因", key: "reason", render: (r) => r.reason ?? "—" },
      {
        title: "操作",
        key: "actions",
        width: 160,
        render: (r) => h(NSpace, null, { default: () => [
          h(Button, { size: "small", type: "primary", onClick: () => approve(r, true) }, "批准"),
          h(Button, { size: "small", type: "error", onClick: () => approve(r, false) }, "驳回")
        ] })
      }
    ];
    return (_ctx, _cache) => {
      const _directive_perm = resolveDirective("perm");
      return openBlock(), createBlock(unref(_sfc_main$1), { title: "请假管理" }, {
        default: withCtx(() => [
          createVNode(unref(NCard), { class: "mb-4" }, {
            default: withCtx(() => [
              createVNode(unref(NSpace), null, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: _cache[0] || (_cache[0] = ($event) => showLeaveModal.value = true)
                  }, {
                    default: withCtx(() => [..._cache[7] || (_cache[7] = [
                      createTextVNode("+ 申请请假", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    loading: unref(refreshing),
                    size: "small",
                    onClick: unref(refresh)
                  }, {
                    default: withCtx(() => [..._cache[8] || (_cache[8] = [
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
          createVNode(unref(NTabs), {
            type: "line",
            animated: ""
          }, {
            default: withCtx(() => [
              createVNode(unref(NTabPane), {
                name: "mine",
                tab: "我的请假"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$2), {
                        columns: myColumns,
                        data: myLeaves.value,
                        pagination: { pageSize: 15 }
                      }, null, 8, ["data"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(NTabPane), {
                name: "pending",
                tab: `待审批（${pendingLeaves.value.length}）`
              }, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    default: withCtx(() => [
                      withDirectives(createVNode(unref(_sfc_main$2), {
                        columns: pendingColumns,
                        data: pendingLeaves.value,
                        pagination: { pageSize: 15 }
                      }, null, 8, ["data"]), [
                        [_directive_perm, "leave:approve"]
                      ])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["tab"])
            ]),
            _: 1
          }),
          createVNode(unref(NModal), {
            show: showLeaveModal.value,
            "onUpdate:show": _cache[6] || (_cache[6] = ($event) => showLeaveModal.value = $event),
            title: "申请请假",
            preset: "card",
            style: { "width": "480px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[5] || (_cache[5] = ($event) => showLeaveModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[9] || (_cache[9] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: saveLeave
                  }, {
                    default: withCtx(() => [..._cache[10] || (_cache[10] = [
                      createTextVNode("提交申请", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(NForm), {
                model: leaveForm.value,
                "label-placement": "left",
                "label-width": "90"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), { label: "请假类型" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: leaveForm.value.leave_type,
                        "onUpdate:value": _cache[1] || (_cache[1] = ($event) => leaveForm.value.leave_type = $event),
                        options: leaveTypeOptions
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "开始时间",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NDatePicker), {
                        "formatted-value": leaveForm.value.start_date,
                        "onUpdate:formattedValue": _cache[2] || (_cache[2] = ($event) => leaveForm.value.start_date = $event),
                        "value-format": "yyyy-MM-dd HH:mm:ss",
                        type: "datetime",
                        style: { "width": "100%" }
                      }, null, 8, ["formatted-value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "结束时间",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NDatePicker), {
                        "formatted-value": leaveForm.value.end_date,
                        "onUpdate:formattedValue": _cache[3] || (_cache[3] = ($event) => leaveForm.value.end_date = $event),
                        "value-format": "yyyy-MM-dd HH:mm:ss",
                        type: "datetime",
                        style: { "width": "100%" }
                      }, null, 8, ["formatted-value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "请假原因" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: leaveForm.value.reason,
                        "onUpdate:value": _cache[4] || (_cache[4] = ($event) => leaveForm.value.reason = $event),
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
          }, 8, ["show"])
        ]),
        _: 1
      });
    };
  }
});
export {
  _sfc_main as default
};
