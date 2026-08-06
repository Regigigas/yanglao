import { _ as _sfc_main$2 } from "./BaseTable.vue_vue_type_script_setup_true_lang-Cd51FqA2.js";
import "./vendor-echarts-DEbY5nl3.js";
import { _ as _sfc_main$1 } from "./BasePage.vue_vue_type_script_setup_true_lang-D7sGS98F.js";
import "./index-rYee39mb.js";
import { S as defineStore, r as ref, l as defineComponent, U as createBlock, W as withCtx, u as unref, V as openBlock, X as createVNode, k as createTextVNode, a1 as createElementBlock, a6 as renderList, F as Fragment, a3 as createBaseVNode, a8 as toDisplayString, c as computed, q as h } from "./vendor-vue-Hc3ejqjp.js";
import { u as useElderlyStore } from "./elderly.store-isfnimJX.js";
import { f as formatDateTime } from "./validators-BfKhytEl.js";
import { u as usePageRefresh } from "./usePageRefresh-Wnx_lW1d.js";
import { u as useMessage, p as useDialog, v as NSpace, J as NSelect, B as Button, g as NCard, V as NTabs, U as NTabPane, i as NAlert, j as NForm, k as NFormItem, H as NDatePicker, l as NInput, o as NTag, h as NModal, T as NInputNumber, W as NProgress } from "./vendor-naive-HV2ECLT0.js";
import "./vendor-query-CFvMrhIw.js";
import "./vendor-utils-DD6FGs_H.js";
import "./useAutoRefresh-BeuDS8Br.js";
const useCareStore = defineStore("care", () => {
  const assessments = ref([]);
  const plans = ref([]);
  const records = ref([]);
  const loading = ref(false);
  async function fetchAssessments(elderlyId) {
    assessments.value = await window.api.care.assessment.list(elderlyId);
  }
  async function createAssessment(data) {
    const row = await window.api.care.assessment.create(data);
    assessments.value.unshift(row);
    return row;
  }
  async function deleteAssessment(id) {
    await window.api.care.assessment.delete(id);
    assessments.value = assessments.value.filter((a) => a.id !== id);
  }
  async function fetchPlans(elderlyId) {
    plans.value = await window.api.care.plan.list(elderlyId);
  }
  async function createPlan(data) {
    const row = await window.api.care.plan.create(data);
    plans.value.unshift(row);
    return row;
  }
  async function updatePlan(id, data) {
    await window.api.care.plan.update(id, data);
    const idx = plans.value.findIndex((p) => p.id === id);
    if (idx !== -1) plans.value[idx] = { ...plans.value[idx], ...data };
  }
  async function fetchRecords(elderlyId, date) {
    loading.value = true;
    try {
      records.value = await window.api.care.record.list(elderlyId, date);
    } finally {
      loading.value = false;
    }
  }
  async function createRecord(data) {
    const row = await window.api.care.record.create(data);
    records.value.unshift(row);
    return row;
  }
  async function deleteRecord(id) {
    await window.api.care.record.delete(id);
    records.value = records.value.filter((r) => r.id !== id);
  }
  return {
    assessments,
    plans,
    records,
    loading,
    fetchAssessments,
    createAssessment,
    deleteAssessment,
    fetchPlans,
    createPlan,
    updatePlan,
    fetchRecords,
    createRecord,
    deleteRecord
  };
});
const _hoisted_1 = { class: "text-gray-400" };
const _hoisted_2 = { class: "text-xl font-bold" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "Care" },
  __name: "CareView",
  setup(__props) {
    const careStore = useCareStore();
    const elderlyStore = useElderlyStore();
    const message = useMessage();
    const dialog = useDialog();
    const selectedElderlyId = ref(null);
    async function loadData() {
      await elderlyStore.fetchList();
    }
    const { refresh, refreshing } = usePageRefresh(loadData);
    const elderlyOptions = computed(
      () => elderlyStore.list.filter((e) => e.status === "active").map((e) => ({ label: e.name, value: e.id }))
    );
    async function onElderlyChange(id) {
      selectedElderlyId.value = id;
      await Promise.all([
        careStore.fetchAssessments(id),
        careStore.fetchPlans(id),
        careStore.fetchRecords(id)
      ]);
    }
    const showAssessModal = ref(false);
    const assessForm = ref({
      elderly_id: "",
      assess_date: formatDateTime(Date.now()),
      assessor: "",
      eating: 10,
      bathing: 5,
      grooming: 5,
      dressing: 10,
      bowel: 10,
      bladder: 10,
      toilet: 10,
      transfer: 15,
      mobility: 15,
      stairs: 10,
      remark: ""
    });
    const adlItems = [
      { key: "eating", label: "进食", max: 10 },
      { key: "bathing", label: "洗澡", max: 5 },
      { key: "grooming", label: "修饰", max: 5 },
      { key: "dressing", label: "穿衣", max: 10 },
      { key: "bowel", label: "大便控制", max: 10 },
      { key: "bladder", label: "小便控制", max: 10 },
      { key: "toilet", label: "如厕", max: 10 },
      { key: "transfer", label: "床椅转移", max: 15 },
      { key: "mobility", label: "平地行走", max: 15 },
      { key: "stairs", label: "上下楼梯", max: 10 }
    ];
    const totalScore = computed(
      () => adlItems.reduce((sum, item) => sum + assessForm.value[item.key], 0)
    );
    const careLevel = computed(() => {
      const s = totalScore.value;
      if (s >= 95) return { level: "level1", label: "自理（一级）", type: "success" };
      if (s >= 60) return { level: "level2", label: "半自理（二级）", type: "info" };
      if (s >= 40) return { level: "level3", label: "不能自理（三级）", type: "warning" };
      return { level: "level4", label: "完全不能自理（四级）", type: "error" };
    });
    async function saveAssessment() {
      if (!assessForm.value.elderly_id) return message.error("请选择老人");
      await careStore.createAssessment({
        ...assessForm.value,
        total_score: totalScore.value,
        care_level: careLevel.value.level,
        deleted_at: null
      });
      showAssessModal.value = false;
      message.success("评估完成，护理级别：" + careLevel.value.label);
      if (selectedElderlyId.value) await careStore.fetchAssessments(selectedElderlyId.value);
    }
    const showRecordModal = ref(false);
    const recordForm = ref({
      elderly_id: "",
      plan_id: null,
      record_date: formatDateTime(Date.now()),
      shift: "day",
      care_type: "",
      content: "",
      executor: "",
      status: "done",
      remark: ""
    });
    const careTypeOptions = [
      { label: "晨间护理", value: "晨间护理" },
      { label: "口腔护理", value: "口腔护理" },
      { label: "皮肤护理", value: "皮肤护理" },
      { label: "翻身拍背", value: "翻身拍背" },
      { label: "协助进餐", value: "协助进餐" },
      { label: "协助排泄", value: "协助排泄" },
      { label: "协助洗浴", value: "协助洗浴" },
      { label: "生命体征监测", value: "生命体征监测" },
      { label: "康复训练", value: "康复训练" },
      { label: "心理疏导", value: "心理疏导" },
      { label: "其他", value: "其他" }
    ];
    const shiftOptions = [
      { label: "白班 (7:00-15:00)", value: "day" },
      { label: "中班 (15:00-23:00)", value: "evening" },
      { label: "夜班 (23:00-7:00)", value: "night" }
    ];
    async function saveRecord() {
      if (!recordForm.value.elderly_id || !recordForm.value.care_type || !recordForm.value.content) {
        return message.error("请填写必填项");
      }
      await careStore.createRecord({ ...recordForm.value, deleted_at: null });
      showRecordModal.value = false;
      message.success("护理记录已保存");
      if (selectedElderlyId.value) await careStore.fetchRecords(selectedElderlyId.value);
    }
    const planCareLevelOptions = [
      { label: "自理（一级）", value: "level1" },
      { label: "半自理（二级）", value: "level2" },
      { label: "不能自理（三级）", value: "level3" },
      { label: "完全不能自理（四级）", value: "level4" }
    ];
    const showPlanModal = ref(false);
    const planForm = ref({
      elderly_id: "",
      care_level: "level2",
      start_date: formatDateTime(Date.now()),
      end_date: null,
      content: ""
    });
    const activePlan = computed(() => careStore.plans.find((p) => p.status === "active"));
    async function savePlan() {
      if (!planForm.value.elderly_id) return message.error("请选择老人");
      await careStore.createPlan({
        ...planForm.value,
        content: planForm.value.content || null,
        created_by: null,
        status: "active",
        deleted_at: null
      });
      showPlanModal.value = false;
      message.success("护理计划已创建");
      if (selectedElderlyId.value) await careStore.fetchPlans(selectedElderlyId.value);
    }
    async function endPlan(plan) {
      await careStore.updatePlan(plan.id, { status: "ended", end_date: formatDateTime(Date.now()) });
      message.success("护理计划已结束");
      if (selectedElderlyId.value) await careStore.fetchPlans(selectedElderlyId.value);
    }
    const planColumns = [
      { title: "护理级别", key: "care_level", width: 130, render: (r) => {
        const map = { level1: "自理（一级）", level2: "半自理（二级）", level3: "不能自理（三级）", level4: "完全不能自理（四级）" };
        return map[r.care_level] ?? r.care_level;
      } },
      { title: "开始日期", key: "start_date", width: 160, render: (r) => formatDateTime(r.start_date) },
      { title: "结束日期", key: "end_date", width: 160, render: (r) => r.end_date ? formatDateTime(r.end_date) : "进行中" },
      { title: "计划内容", key: "content", ellipsis: { tooltip: true }, render: (r) => r.content ?? "—" },
      { title: "状态", key: "status", width: 90, render: (r) => h(NTag, { type: r.status === "active" ? "success" : "default" }, () => r.status === "active" ? "进行中" : "已结束") },
      { title: "操作", key: "actions", width: 90, render: (r) => r.status === "active" ? h(Button, { size: "small", onClick: () => endPlan(r) }, "结束") : null }
    ];
    const assessColumns = [
      { title: "评估日期", key: "assess_date", width: 160, render: (r) => formatDateTime(r.assess_date) },
      { title: "评估人", key: "assessor", width: 100 },
      { title: "ADL总分", key: "total_score", width: 90 },
      { title: "护理级别", key: "care_level", width: 160, render: (r) => {
        const map = { level1: "自理（一级）", level2: "半自理（二级）", level3: "不能自理（三级）", level4: "完全不能自理（四级）" };
        const typeMap = { level1: "success", level2: "info", level3: "warning", level4: "error" };
        return h(NTag, { type: typeMap[r.care_level] ?? "default" }, () => map[r.care_level] ?? r.care_level);
      } },
      { title: "操作", key: "actions", width: 80, render: (r) => h(Button, { size: "small", type: "error", onClick: () => {
        dialog.warning({
          title: "删除",
          content: "确认删除此评估记录？",
          positiveText: "确定",
          negativeText: "取消",
          onPositiveClick: async () => {
            await careStore.deleteAssessment(r.id);
            message.success("已删除");
            if (selectedElderlyId.value) await careStore.fetchAssessments(selectedElderlyId.value);
          }
        });
      } }, "删除") }
    ];
    const recordColumns = [
      { title: "日期", key: "record_date", width: 160, render: (r) => formatDateTime(r.record_date) },
      { title: "班次", key: "shift", width: 90, render: (r) => ({ day: "白班", evening: "中班", night: "夜班" })[r.shift] },
      { title: "护理类型", key: "care_type", width: 110 },
      { title: "内容", key: "content", ellipsis: { tooltip: true } },
      { title: "执行人", key: "executor", width: 90 },
      { title: "状态", key: "status", width: 80, render: (r) => h(NTag, { type: r.status === "done" ? "success" : "warning" }, () => r.status === "done" ? "已完成" : "跳过") }
    ];
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), { title: "护理管理" }, {
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
                    placeholder: "请选择老人",
                    style: { "width": "200px" }
                  }, null, 8, ["value", "options"]),
                  createVNode(unref(Button), {
                    type: "primary",
                    disabled: !selectedElderlyId.value,
                    onClick: _cache[1] || (_cache[1] = () => {
                      assessForm.value.elderly_id = selectedElderlyId.value;
                      showAssessModal.value = true;
                    })
                  }, {
                    default: withCtx(() => [..._cache[24] || (_cache[24] = [
                      createTextVNode(" + 护理评估（ADL） ", -1)
                    ])]),
                    _: 1
                  }, 8, ["disabled"]),
                  createVNode(unref(Button), {
                    disabled: !selectedElderlyId.value,
                    onClick: _cache[2] || (_cache[2] = () => {
                      recordForm.value.elderly_id = selectedElderlyId.value;
                      recordForm.value.plan_id = activePlan.value?.id ?? null;
                      showRecordModal.value = true;
                    })
                  }, {
                    default: withCtx(() => [..._cache[25] || (_cache[25] = [
                      createTextVNode(" + 护理记录 ", -1)
                    ])]),
                    _: 1
                  }, 8, ["disabled"]),
                  createVNode(unref(Button), {
                    disabled: !selectedElderlyId.value,
                    onClick: _cache[3] || (_cache[3] = () => {
                      planForm.value.elderly_id = selectedElderlyId.value;
                      showPlanModal.value = true;
                    })
                  }, {
                    default: withCtx(() => [..._cache[26] || (_cache[26] = [
                      createTextVNode(" + 护理计划 ", -1)
                    ])]),
                    _: 1
                  }, 8, ["disabled"]),
                  createVNode(unref(Button), {
                    loading: unref(refreshing),
                    size: "small",
                    onClick: unref(refresh)
                  }, {
                    default: withCtx(() => [..._cache[27] || (_cache[27] = [
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
          selectedElderlyId.value ? (openBlock(), createBlock(unref(NTabs), {
            key: 0,
            type: "line",
            animated: ""
          }, {
            default: withCtx(() => [
              createVNode(unref(NTabPane), {
                name: "assessment",
                tab: "护理评估"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$2), {
                        columns: assessColumns,
                        data: unref(careStore).assessments,
                        loading: unref(careStore).loading,
                        pagination: { pageSize: 10 }
                      }, null, 8, ["data", "loading"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(NTabPane), {
                name: "plan",
                tab: "护理计划"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$2), {
                        columns: planColumns,
                        data: unref(careStore).plans,
                        loading: unref(careStore).loading,
                        pagination: { pageSize: 10 }
                      }, null, 8, ["data", "loading"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(NTabPane), {
                name: "records",
                tab: "护理记录"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$2), {
                        columns: recordColumns,
                        data: unref(careStore).records,
                        loading: unref(careStore).loading,
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
          })) : (openBlock(), createBlock(unref(NAlert), {
            key: 1,
            type: "info"
          }, {
            default: withCtx(() => [..._cache[28] || (_cache[28] = [
              createTextVNode("请先选择老人，查看其护理信息。", -1)
            ])]),
            _: 1
          })),
          createVNode(unref(NModal), {
            show: showAssessModal.value,
            "onUpdate:show": _cache[8] || (_cache[8] = ($event) => showAssessModal.value = $event),
            title: "ADL护理评估（Barthel量表）",
            preset: "card",
            style: { "width": "600px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[7] || (_cache[7] = ($event) => showAssessModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[29] || (_cache[29] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: saveAssessment
                  }, {
                    default: withCtx(() => [..._cache[30] || (_cache[30] = [
                      createTextVNode("提交评估", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(NForm), {
                model: assessForm.value,
                "label-placement": "left",
                "label-width": "100"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), { label: "评估日期" }, {
                    default: withCtx(() => [
                      createVNode(unref(NDatePicker), {
                        "formatted-value": assessForm.value.assess_date,
                        "onUpdate:formattedValue": _cache[4] || (_cache[4] = ($event) => assessForm.value.assess_date = $event),
                        "value-format": "yyyy-MM-dd HH:mm:ss",
                        type: "datetime",
                        style: { "width": "100%" }
                      }, null, 8, ["formatted-value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "评估人" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: assessForm.value.assessor,
                        "onUpdate:value": _cache[5] || (_cache[5] = ($event) => assessForm.value.assessor = $event),
                        placeholder: "护士/护理员姓名"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  (openBlock(), createElementBlock(Fragment, null, renderList(adlItems, (item) => {
                    return createVNode(unref(NFormItem), {
                      key: item.key,
                      label: item.label
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(NSpace), {
                          align: "center",
                          style: { "width": "100%" }
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(NInputNumber), {
                              value: assessForm.value[item.key],
                              "onUpdate:value": ($event) => assessForm.value[item.key] = $event,
                              min: 0,
                              max: item.max,
                              style: { "width": "100px" }
                            }, null, 8, ["value", "onUpdate:value", "max"]),
                            createBaseVNode("span", _hoisted_1, "/ " + toDisplayString(item.max) + "分", 1),
                            createVNode(unref(NProgress), {
                              type: "line",
                              percentage: Math.round(assessForm.value[item.key] / item.max * 100),
                              style: { "width": "120px" },
                              "show-indicator": false
                            }, null, 8, ["percentage"])
                          ]),
                          _: 2
                        }, 1024)
                      ]),
                      _: 2
                    }, 1032, ["label"]);
                  }), 64)),
                  createVNode(unref(NFormItem), { label: "总分" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSpace), { align: "center" }, {
                        default: withCtx(() => [
                          createBaseVNode("span", _hoisted_2, toDisplayString(totalScore.value), 1),
                          createVNode(unref(NTag), {
                            type: careLevel.value.type
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(careLevel.value.label), 1)
                            ]),
                            _: 1
                          }, 8, ["type"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "备注" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: assessForm.value.remark,
                        "onUpdate:value": _cache[6] || (_cache[6] = ($event) => assessForm.value.remark = $event),
                        type: "textarea",
                        rows: 2
                      }, null, 8, ["value"])
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
            show: showPlanModal.value,
            "onUpdate:show": _cache[14] || (_cache[14] = ($event) => showPlanModal.value = $event),
            title: "新增护理计划",
            preset: "card",
            style: { "width": "520px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[13] || (_cache[13] = ($event) => showPlanModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[31] || (_cache[31] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: savePlan
                  }, {
                    default: withCtx(() => [..._cache[32] || (_cache[32] = [
                      createTextVNode("创建", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(NForm), {
                model: planForm.value,
                "label-placement": "left",
                "label-width": "90"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), { label: "护理级别" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: planForm.value.care_level,
                        "onUpdate:value": _cache[9] || (_cache[9] = ($event) => planForm.value.care_level = $event),
                        options: planCareLevelOptions
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "开始日期",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NDatePicker), {
                        "formatted-value": planForm.value.start_date,
                        "onUpdate:formattedValue": _cache[10] || (_cache[10] = ($event) => planForm.value.start_date = $event),
                        "value-format": "yyyy-MM-dd HH:mm:ss",
                        type: "datetime",
                        style: { "width": "100%" }
                      }, null, 8, ["formatted-value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "结束日期" }, {
                    default: withCtx(() => [
                      createVNode(unref(NDatePicker), {
                        "formatted-value": planForm.value.end_date,
                        "onUpdate:formattedValue": _cache[11] || (_cache[11] = ($event) => planForm.value.end_date = $event),
                        "value-format": "yyyy-MM-dd HH:mm:ss",
                        type: "datetime",
                        clearable: "",
                        placeholder: "留空表示长期",
                        style: { "width": "100%" }
                      }, null, 8, ["formatted-value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "计划内容" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: planForm.value.content,
                        "onUpdate:value": _cache[12] || (_cache[12] = ($event) => planForm.value.content = $event),
                        type: "textarea",
                        rows: 3,
                        placeholder: "护理目标与具体措施"
                      }, null, 8, ["value"])
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
            show: showRecordModal.value,
            "onUpdate:show": _cache[23] || (_cache[23] = ($event) => showRecordModal.value = $event),
            title: "护理记录",
            preset: "card",
            style: { "width": "520px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[22] || (_cache[22] = ($event) => showRecordModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[33] || (_cache[33] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: saveRecord
                  }, {
                    default: withCtx(() => [..._cache[34] || (_cache[34] = [
                      createTextVNode("保存", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(NForm), {
                model: recordForm.value,
                "label-placement": "left",
                "label-width": "90"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), { label: "记录日期" }, {
                    default: withCtx(() => [
                      createVNode(unref(NDatePicker), {
                        "formatted-value": recordForm.value.record_date,
                        "onUpdate:formattedValue": _cache[15] || (_cache[15] = ($event) => recordForm.value.record_date = $event),
                        "value-format": "yyyy-MM-dd HH:mm:ss",
                        type: "datetime",
                        style: { "width": "100%" }
                      }, null, 8, ["formatted-value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "班次" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: recordForm.value.shift,
                        "onUpdate:value": _cache[16] || (_cache[16] = ($event) => recordForm.value.shift = $event),
                        options: shiftOptions
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "关联计划" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: recordForm.value.plan_id,
                        "onUpdate:value": _cache[17] || (_cache[17] = ($event) => recordForm.value.plan_id = $event),
                        options: unref(careStore).plans.filter((p) => p.status === "active").map((p) => ({ label: `${p.start_date} 起 · ${p.care_level}`, value: p.id })),
                        clearable: "",
                        placeholder: "可选，选择当前生效的护理计划"
                      }, null, 8, ["value", "options"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "护理类型",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: recordForm.value.care_type,
                        "onUpdate:value": _cache[18] || (_cache[18] = ($event) => recordForm.value.care_type = $event),
                        options: careTypeOptions
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "执行内容",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: recordForm.value.content,
                        "onUpdate:value": _cache[19] || (_cache[19] = ($event) => recordForm.value.content = $event),
                        type: "textarea",
                        rows: 3,
                        placeholder: "详细描述护理执行情况"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "执行人" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: recordForm.value.executor,
                        "onUpdate:value": _cache[20] || (_cache[20] = ($event) => recordForm.value.executor = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "备注" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: recordForm.value.remark,
                        "onUpdate:value": _cache[21] || (_cache[21] = ($event) => recordForm.value.remark = $event)
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
