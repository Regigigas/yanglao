import { _ as _sfc_main$2 } from "./BaseTable.vue_vue_type_script_setup_true_lang-Kf6svQhn.js";
import "./vendor-echarts-DEbY5nl3.js";
import { _ as _sfc_main$1 } from "./BasePage.vue_vue_type_script_setup_true_lang-CoKRdyPV.js";
import "./index-77IpmxCe.js";
import { u as useHealthStore } from "./health.store-B_Sa4TVa.js";
import { u as useElderlyStore } from "./elderly.store-isfnimJX.js";
import { f as formatDateTime } from "./validators-BfKhytEl.js";
import { u as usePageRefresh } from "./usePageRefresh-Wnx_lW1d.js";
import { u as useMessage, p as useDialog, v as NSpace, J as NSelect, B as Button, g as NCard, T as NTabPane, l as NInput, U as NTabs, j as NForm, k as NFormItem, H as NDatePicker, h as NModal, m as NCheckbox, o as NTag } from "./vendor-naive-sdNTCZPI.js";
import { l as defineComponent, r as ref, U as createBlock, W as withCtx, u as unref, V as openBlock, X as createVNode, m as withDirectives, k as createTextVNode, a3 as createBaseVNode, a1 as createElementBlock, a6 as renderList, F as Fragment, a9 as createCommentVNode, a8 as toDisplayString, c as computed, q as h, ae as resolveDirective } from "./vendor-vue-Hc3ejqjp.js";
import "./vendor-query-CFvMrhIw.js";
import "./vendor-utils-DD6FGs_H.js";
import "./useAutoRefresh-BeuDS8Br.js";
const _hoisted_1 = { class: "flex flex-wrap gap-2" };
const _hoisted_2 = {
  key: 0,
  class: "text-gray-400 text-sm"
};
const _hoisted_3 = { key: 1 };
const _hoisted_4 = { style: { "white-space": "pre-wrap" } };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "Exam" },
  __name: "ExamView",
  setup(__props) {
    const healthStore = useHealthStore();
    const elderlyStore = useElderlyStore();
    const message = useMessage();
    const dialog = useDialog();
    const selectedElderlyId = ref(null);
    const activeTab = ref("appointment");
    const appointmentStatusFilter = ref(null);
    const resultKeyword = ref("");
    const saving = ref(false);
    async function loadData() {
      await Promise.all([
        elderlyStore.fetchList(),
        healthStore.fetchExamAppointments(),
        healthStore.fetchExamResults()
      ]);
    }
    const { refresh, refreshing } = usePageRefresh(loadData);
    const elderlyOptions = computed(
      () => elderlyStore.list.filter((e) => e.status !== "left").map((e) => ({ label: e.name, value: e.id }))
    );
    async function onElderlyChange(id) {
      selectedElderlyId.value = id;
      await refreshExamData();
    }
    async function refreshExamData() {
      await Promise.all([
        healthStore.fetchExamAppointments(selectedElderlyId.value ?? void 0),
        healthStore.fetchExamResults(selectedElderlyId.value ?? void 0)
      ]);
    }
    function errorMessage(error, fallback) {
      return error instanceof Error ? error.message : fallback;
    }
    function elderlyName(id) {
      return elderlyStore.list.find((e) => e.id === id)?.name ?? "—";
    }
    const showApptModal = ref(false);
    const editingAppointmentId = ref(null);
    const apptForm = ref({
      elderly_id: "",
      exam_date: formatDateTime(Date.now()),
      institution: "",
      exam_items: "",
      remark: "",
      created_by: null
    });
    function openApptCreate() {
      editingAppointmentId.value = null;
      apptForm.value = {
        elderly_id: selectedElderlyId.value ?? "",
        exam_date: formatDateTime(Date.now()),
        institution: "",
        exam_items: "",
        remark: "",
        created_by: null
      };
      showApptModal.value = true;
    }
    function openApptEdit(appointment) {
      editingAppointmentId.value = appointment.id;
      apptForm.value = {
        elderly_id: appointment.elderly_id,
        exam_date: appointment.exam_date,
        institution: appointment.institution ?? "",
        exam_items: appointment.exam_items ?? "",
        remark: appointment.remark ?? "",
        created_by: appointment.created_by
      };
      showApptModal.value = true;
    }
    async function saveAppointment() {
      if (!apptForm.value.elderly_id || !apptForm.value.exam_date) return message.error("请选择老人和体检时间");
      const data = {
        ...apptForm.value,
        institution: apptForm.value.institution.trim() || null,
        exam_items: apptForm.value.exam_items.trim() || null,
        remark: apptForm.value.remark.trim() || null
      };
      saving.value = true;
      try {
        if (editingAppointmentId.value) {
          await healthStore.updateExamAppointment(editingAppointmentId.value, data);
          message.success("体检预约已更新");
        } else {
          await healthStore.createExamAppointment(data);
          message.success("体检预约已创建");
        }
        showApptModal.value = false;
        await refreshExamData();
      } catch (error) {
        message.error(errorMessage(error, "保存体检预约失败"));
      } finally {
        saving.value = false;
      }
    }
    function cancelAppt(row) {
      dialog.warning({
        title: "取消预约",
        content: "确定要取消这条体检预约吗？",
        positiveText: "确定",
        negativeText: "取消",
        onPositiveClick: async () => {
          try {
            await healthStore.cancelExamAppointment(row.id);
            message.success("预约已取消");
            await refreshExamData();
          } catch (error) {
            message.error(errorMessage(error, "取消预约失败"));
          }
        }
      });
    }
    const apptStatusTagType = { pending: "warning", completed: "success", cancelled: "default" };
    const apptStatusLabel = { pending: "待体检", completed: "已完成", cancelled: "已取消" };
    const appointmentStatusOptions = [
      { label: "待体检", value: "pending" },
      { label: "已完成", value: "completed" },
      { label: "已取消", value: "cancelled" }
    ];
    const filteredAppointments = computed(
      () => appointmentStatusFilter.value ? healthStore.examAppointments.filter((appointment) => appointment.status === appointmentStatusFilter.value) : healthStore.examAppointments
    );
    const apptColumns = [
      { title: "老人", key: "elderly_id", width: 100, render: (r) => elderlyName(r.elderly_id) },
      { title: "预约时间", key: "exam_date", width: 170, render: (r) => formatDateTime(r.exam_date) },
      { title: "体检机构", key: "institution", width: 150, render: (r) => r.institution ?? "—" },
      { title: "体检项目", key: "exam_items", render: (r) => r.exam_items ?? "—" },
      { title: "状态", key: "status", width: 90, render: (r) => h(NTag, { type: apptStatusTagType[r.status] }, () => apptStatusLabel[r.status]) },
      {
        title: "操作",
        key: "actions",
        width: 190,
        render: (r) => r.status === "pending" ? h(NSpace, null, { default: () => [
          h(Button, { size: "small", type: "primary", onClick: () => openResultFromAppt(r) }, "录入结果"),
          h(Button, { size: "small", onClick: () => openApptEdit(r) }, "编辑"),
          h(Button, { size: "small", onClick: () => cancelAppt(r) }, "取消")
        ] }) : null
      }
    ];
    const showResultModal = ref(false);
    const showResultDetail = ref(false);
    const editingResultId = ref(null);
    const selectedResult = ref(null);
    const resultForm = ref({
      elderly_id: "",
      appointment_id: null,
      exam_date: formatDateTime(Date.now()),
      institution: "",
      conclusion: "",
      created_by: null
    });
    const itemInput = ref({ name: "", value: "", unit: "", abnormal: false });
    const itemList = ref([]);
    function openResultCreate() {
      editingResultId.value = null;
      resultForm.value = {
        elderly_id: selectedElderlyId.value ?? "",
        appointment_id: null,
        exam_date: formatDateTime(Date.now()),
        institution: "",
        conclusion: "",
        created_by: null
      };
      itemList.value = [];
      itemInput.value = { name: "", value: "", unit: "", abnormal: false };
      showResultModal.value = true;
    }
    function openResultFromAppt(appt) {
      editingResultId.value = null;
      resultForm.value = {
        elderly_id: appt.elderly_id,
        appointment_id: appt.id,
        exam_date: formatDateTime(Date.now()),
        institution: appt.institution ?? "",
        conclusion: "",
        created_by: null
      };
      itemList.value = [];
      itemInput.value = { name: "", value: "", unit: "", abnormal: false };
      showResultModal.value = true;
    }
    function openResultEdit(result) {
      editingResultId.value = result.id;
      resultForm.value = {
        elderly_id: result.elderly_id,
        appointment_id: result.appointment_id,
        exam_date: result.exam_date,
        institution: result.institution ?? "",
        conclusion: result.conclusion ?? "",
        created_by: result.created_by
      };
      itemList.value = parseItems(result.items);
      itemInput.value = { name: "", value: "", unit: "", abnormal: false };
      showResultModal.value = true;
    }
    function openResultDetail(result) {
      selectedResult.value = result;
      showResultDetail.value = true;
    }
    function addItem() {
      if (!itemInput.value.name || !itemInput.value.value) return message.error("请填写检查项名称和数值");
      itemList.value.push({
        name: itemInput.value.name,
        value: itemInput.value.value,
        unit: itemInput.value.unit,
        abnormal: itemInput.value.abnormal ? 1 : 0
      });
      itemInput.value = { name: "", value: "", unit: "", abnormal: false };
    }
    function removeItem(idx) {
      itemList.value.splice(idx, 1);
    }
    async function saveResult() {
      if (!resultForm.value.elderly_id || !resultForm.value.exam_date) return message.error("请选择老人和体检日期");
      if (!itemList.value.length && !resultForm.value.conclusion.trim()) return message.error("请至少录入一项检查结果或体检结论");
      const data = {
        ...resultForm.value,
        institution: resultForm.value.institution.trim() || null,
        conclusion: resultForm.value.conclusion.trim() || null,
        items: JSON.stringify(itemList.value),
        attachment_path: null
      };
      saving.value = true;
      try {
        if (editingResultId.value) {
          await healthStore.updateExamResult(editingResultId.value, {
            exam_date: data.exam_date,
            institution: data.institution,
            conclusion: data.conclusion,
            items: data.items,
            attachment_path: data.attachment_path
          });
          if (selectedResult.value?.id === editingResultId.value) selectedResult.value = { ...selectedResult.value, ...data };
          message.success("体检结果已更新");
        } else {
          await healthStore.createExamResult(data);
          message.success("体检结果已保存");
        }
        showResultModal.value = false;
        activeTab.value = "result";
        await refreshExamData();
      } catch (error) {
        message.error(errorMessage(error, "保存体检结果失败"));
      } finally {
        saving.value = false;
      }
    }
    function parseItems(json) {
      try {
        const items = JSON.parse(json);
        return Array.isArray(items) ? items.filter(
          (item) => typeof item === "object" && item !== null && "name" in item && "value" in item
        ) : [];
      } catch {
        return [];
      }
    }
    const filteredResults = computed(() => {
      const keyword = resultKeyword.value.trim().toLowerCase();
      if (!keyword) return healthStore.examResults;
      return healthStore.examResults.filter((result) => [
        elderlyName(result.elderly_id),
        result.institution ?? "",
        result.conclusion ?? "",
        result.items
      ].some((value) => value.toLowerCase().includes(keyword)));
    });
    function deleteResult(result) {
      dialog.warning({
        title: "删除体检结果",
        content: result.appointment_id ? "删除后，关联预约将恢复为待体检，可重新录入结果。" : "确认删除此体检结果吗？",
        positiveText: "确认删除",
        negativeText: "取消",
        onPositiveClick: async () => {
          try {
            await healthStore.deleteExamResult(result.id);
            if (selectedResult.value?.id === result.id) showResultDetail.value = false;
            message.success("体检结果已删除");
            await refreshExamData();
          } catch (error) {
            message.error(errorMessage(error, "删除体检结果失败"));
          }
        }
      });
    }
    const resultColumns = [
      { title: "老人", key: "elderly_id", width: 100, render: (r) => elderlyName(r.elderly_id) },
      { title: "体检日期", key: "exam_date", width: 170, render: (r) => formatDateTime(r.exam_date) },
      { title: "机构", key: "institution", width: 150, render: (r) => r.institution ?? "—" },
      {
        title: "检查结果",
        key: "items",
        render: (r) => {
          const items = parseItems(r.items);
          if (!items.length) return "—";
          return h(NSpace, null, { default: () => items.map(
            (it) => h(NTag, { size: "small", type: it.abnormal ? "error" : "default" }, () => `${it.name}: ${it.value}${it.unit}`)
          ) });
        }
      },
      { title: "结论", key: "conclusion", render: (r) => r.conclusion ?? "—" },
      {
        title: "操作",
        key: "actions",
        width: 190,
        render: (r) => h(NSpace, null, { default: () => [
          h(Button, { size: "small", onClick: () => openResultDetail(r) }, "查看"),
          h(Button, { size: "small", onClick: () => openResultEdit(r) }, "编辑"),
          h(Button, { size: "small", type: "error", onClick: () => deleteResult(r) }, "删除")
        ] })
      }
    ];
    return (_ctx, _cache) => {
      const _directive_perm = resolveDirective("perm");
      return openBlock(), createBlock(unref(_sfc_main$1), { title: "体检管理" }, {
        default: withCtx(() => [
          createVNode(unref(NCard), { class: "mb-4" }, {
            default: withCtx(() => [
              createVNode(unref(NSpace), null, {
                default: withCtx(() => [
                  createVNode(unref(NSelect), {
                    value: selectedElderlyId.value,
                    "onUpdate:value": [
                      _cache[0] || (_cache[0] = ($event) => selectedElderlyId.value = $event),
                      onElderlyChange
                    ],
                    options: elderlyOptions.value,
                    filterable: "",
                    clearable: "",
                    placeholder: "筛选老人",
                    style: { "width": "200px" }
                  }, null, 8, ["value", "options"]),
                  createVNode(unref(NSelect), {
                    value: appointmentStatusFilter.value,
                    "onUpdate:value": _cache[1] || (_cache[1] = ($event) => appointmentStatusFilter.value = $event),
                    options: appointmentStatusOptions,
                    clearable: "",
                    placeholder: "预约状态",
                    style: { "width": "130px" }
                  }, null, 8, ["value"]),
                  withDirectives((openBlock(), createBlock(unref(Button), {
                    type: "primary",
                    onClick: openApptCreate
                  }, {
                    default: withCtx(() => [..._cache[24] || (_cache[24] = [
                      createTextVNode("+ 预约体检", -1)
                    ])]),
                    _: 1
                  })), [
                    [_directive_perm, "exam:create"]
                  ]),
                  withDirectives((openBlock(), createBlock(unref(Button), { onClick: openResultCreate }, {
                    default: withCtx(() => [..._cache[25] || (_cache[25] = [
                      createTextVNode("+ 录入体检结果", -1)
                    ])]),
                    _: 1
                  })), [
                    [_directive_perm, "exam:create"]
                  ]),
                  createVNode(unref(Button), {
                    loading: unref(refreshing),
                    size: "small",
                    onClick: unref(refresh)
                  }, {
                    default: withCtx(() => [..._cache[26] || (_cache[26] = [
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
            value: activeTab.value,
            "onUpdate:value": _cache[3] || (_cache[3] = ($event) => activeTab.value = $event),
            type: "line",
            animated: ""
          }, {
            default: withCtx(() => [
              createVNode(unref(NTabPane), {
                name: "appointment",
                tab: "体检预约"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$2), {
                        columns: apptColumns,
                        data: filteredAppointments.value,
                        loading: unref(healthStore).loading,
                        pagination: { pageSize: 15 }
                      }, null, 8, ["data", "loading"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(NTabPane), {
                name: "result",
                tab: "体检结果"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    "header-extra": withCtx(() => [
                      createVNode(unref(NInput), {
                        value: resultKeyword.value,
                        "onUpdate:value": _cache[2] || (_cache[2] = ($event) => resultKeyword.value = $event),
                        clearable: "",
                        placeholder: "搜索老人、机构、结论或项目",
                        style: { "width": "260px" }
                      }, null, 8, ["value"])
                    ]),
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$2), {
                        columns: resultColumns,
                        data: filteredResults.value,
                        loading: unref(healthStore).loading,
                        pagination: { pageSize: 15 }
                      }, null, 8, ["data", "loading"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["value"]),
          createVNode(unref(NModal), {
            show: showApptModal.value,
            "onUpdate:show": _cache[10] || (_cache[10] = ($event) => showApptModal.value = $event),
            title: editingAppointmentId.value ? "编辑体检预约" : "预约体检",
            preset: "card",
            style: { "width": "480px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[9] || (_cache[9] = ($event) => showApptModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[27] || (_cache[27] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    loading: saving.value,
                    onClick: saveAppointment
                  }, {
                    default: withCtx(() => [..._cache[28] || (_cache[28] = [
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
                model: apptForm.value,
                "label-placement": "left",
                "label-width": "90",
                "show-require-mark": true
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), {
                    label: "老人",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: apptForm.value.elderly_id,
                        "onUpdate:value": _cache[4] || (_cache[4] = ($event) => apptForm.value.elderly_id = $event),
                        options: elderlyOptions.value,
                        filterable: ""
                      }, null, 8, ["value", "options"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "预约时间",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NDatePicker), {
                        "formatted-value": apptForm.value.exam_date,
                        "onUpdate:formattedValue": _cache[5] || (_cache[5] = ($event) => apptForm.value.exam_date = $event),
                        "value-format": "yyyy-MM-dd HH:mm:ss",
                        type: "datetime",
                        style: { "width": "100%" }
                      }, null, 8, ["formatted-value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "体检机构" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: apptForm.value.institution,
                        "onUpdate:value": _cache[6] || (_cache[6] = ($event) => apptForm.value.institution = $event),
                        placeholder: "如：市人民医院体检中心"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "体检项目" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: apptForm.value.exam_items,
                        "onUpdate:value": _cache[7] || (_cache[7] = ($event) => apptForm.value.exam_items = $event),
                        type: "textarea",
                        rows: 2,
                        placeholder: "如：血常规、心电图、腹部B超"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "备注" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: apptForm.value.remark,
                        "onUpdate:value": _cache[8] || (_cache[8] = ($event) => apptForm.value.remark = $event)
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
            show: showResultModal.value,
            "onUpdate:show": _cache[20] || (_cache[20] = ($event) => showResultModal.value = $event),
            title: editingResultId.value ? "编辑体检结果" : "录入体检结果",
            preset: "card",
            style: { "width": "560px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[19] || (_cache[19] = ($event) => showResultModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[31] || (_cache[31] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    loading: saving.value,
                    onClick: saveResult
                  }, {
                    default: withCtx(() => [..._cache[32] || (_cache[32] = [
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
                model: resultForm.value,
                "label-placement": "left",
                "label-width": "90",
                "show-require-mark": true
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), {
                    label: "老人",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: resultForm.value.elderly_id,
                        "onUpdate:value": _cache[11] || (_cache[11] = ($event) => resultForm.value.elderly_id = $event),
                        options: elderlyOptions.value,
                        filterable: "",
                        disabled: !!resultForm.value.appointment_id || !!editingResultId.value
                      }, null, 8, ["value", "options", "disabled"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "体检日期",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NDatePicker), {
                        "formatted-value": resultForm.value.exam_date,
                        "onUpdate:formattedValue": _cache[12] || (_cache[12] = ($event) => resultForm.value.exam_date = $event),
                        "value-format": "yyyy-MM-dd HH:mm:ss",
                        type: "datetime",
                        style: { "width": "100%" }
                      }, null, 8, ["formatted-value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "体检机构" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: resultForm.value.institution,
                        "onUpdate:value": _cache[13] || (_cache[13] = ($event) => resultForm.value.institution = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "检查项" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSpace), {
                        vertical: "",
                        style: { "width": "100%" }
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(NSpace), { wrap: false }, {
                            default: withCtx(() => [
                              createVNode(unref(NInput), {
                                value: itemInput.value.name,
                                "onUpdate:value": _cache[14] || (_cache[14] = ($event) => itemInput.value.name = $event),
                                placeholder: "项目名，如：血压",
                                style: { "width": "120px" }
                              }, null, 8, ["value"]),
                              createVNode(unref(NInput), {
                                value: itemInput.value.value,
                                "onUpdate:value": _cache[15] || (_cache[15] = ($event) => itemInput.value.value = $event),
                                placeholder: "数值，如：130/85",
                                style: { "width": "110px" }
                              }, null, 8, ["value"]),
                              createVNode(unref(NInput), {
                                value: itemInput.value.unit,
                                "onUpdate:value": _cache[16] || (_cache[16] = ($event) => itemInput.value.unit = $event),
                                placeholder: "单位，如：mmHg",
                                style: { "width": "90px" }
                              }, null, 8, ["value"]),
                              createVNode(unref(NCheckbox), {
                                checked: itemInput.value.abnormal,
                                "onUpdate:checked": _cache[17] || (_cache[17] = ($event) => itemInput.value.abnormal = $event)
                              }, {
                                default: withCtx(() => [..._cache[29] || (_cache[29] = [
                                  createTextVNode("异常", -1)
                                ])]),
                                _: 1
                              }, 8, ["checked"]),
                              createVNode(unref(Button), { onClick: addItem }, {
                                default: withCtx(() => [..._cache[30] || (_cache[30] = [
                                  createTextVNode("添加", -1)
                                ])]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createBaseVNode("div", _hoisted_1, [
                            (openBlock(true), createElementBlock(Fragment, null, renderList(itemList.value, (it, idx) => {
                              return openBlock(), createBlock(unref(NTag), {
                                key: idx,
                                type: it.abnormal ? "error" : "default",
                                closable: "",
                                onClose: ($event) => removeItem(idx)
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(it.name) + ": " + toDisplayString(it.value) + toDisplayString(it.unit), 1)
                                ]),
                                _: 2
                              }, 1032, ["type", "onClose"]);
                            }), 128)),
                            !itemList.value.length ? (openBlock(), createElementBlock("span", _hoisted_2, "暂无检查项，请添加")) : createCommentVNode("", true)
                          ])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "体检结论" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: resultForm.value.conclusion,
                        "onUpdate:value": _cache[18] || (_cache[18] = ($event) => resultForm.value.conclusion = $event),
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
            show: showResultDetail.value,
            "onUpdate:show": _cache[23] || (_cache[23] = ($event) => showResultDetail.value = $event),
            title: `${selectedResult.value ? elderlyName(selectedResult.value.elderly_id) : ""}的体检结果`,
            preset: "card",
            style: { "width": "560px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[21] || (_cache[21] = ($event) => showResultDetail.value = false)
                  }, {
                    default: withCtx(() => [..._cache[33] || (_cache[33] = [
                      createTextVNode("关闭", -1)
                    ])]),
                    _: 1
                  }),
                  selectedResult.value ? (openBlock(), createBlock(unref(Button), {
                    key: 0,
                    onClick: _cache[22] || (_cache[22] = ($event) => {
                      showResultDetail.value = false;
                      openResultEdit(selectedResult.value);
                    })
                  }, {
                    default: withCtx(() => [..._cache[34] || (_cache[34] = [
                      createTextVNode("编辑", -1)
                    ])]),
                    _: 1
                  })) : createCommentVNode("", true)
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              selectedResult.value ? (openBlock(), createBlock(unref(NForm), {
                key: 0,
                "label-placement": "left",
                "label-width": "90"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), { label: "体检日期" }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(formatDateTime)(selectedResult.value.exam_date)), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "体检机构" }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(selectedResult.value.institution || "—"), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "关联预约" }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(selectedResult.value.appointment_id ? "已关联预约" : "独立录入"), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "检查项目" }, {
                    default: withCtx(() => [
                      parseItems(selectedResult.value.items).length ? (openBlock(), createBlock(unref(NSpace), {
                        key: 0,
                        wrap: ""
                      }, {
                        default: withCtx(() => [
                          (openBlock(true), createElementBlock(Fragment, null, renderList(parseItems(selectedResult.value.items), (item, index) => {
                            return openBlock(), createBlock(unref(NTag), {
                              key: index,
                              type: item.abnormal ? "error" : "default"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(item.name) + ": " + toDisplayString(item.value) + toDisplayString(item.unit) + toDisplayString(item.abnormal ? "（异常）" : ""), 1)
                              ]),
                              _: 2
                            }, 1032, ["type"]);
                          }), 128))
                        ]),
                        _: 1
                      })) : (openBlock(), createElementBlock("span", _hoisted_3, "—"))
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "体检结论" }, {
                    default: withCtx(() => [
                      createBaseVNode("span", _hoisted_4, toDisplayString(selectedResult.value.conclusion || "—"), 1)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })) : createCommentVNode("", true)
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
