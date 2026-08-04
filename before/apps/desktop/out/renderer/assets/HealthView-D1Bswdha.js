import { _ as _sfc_main$3 } from "./BaseTable.vue_vue_type_script_setup_true_lang-Kf6svQhn.js";
import { _ as _sfc_main$2 } from "./BaseChart.vue_vue_type_script_setup_true_lang-CDtSpnW2.js";
import { _ as _sfc_main$1 } from "./BasePage.vue_vue_type_script_setup_true_lang-CoKRdyPV.js";
import "./index-77IpmxCe.js";
import { u as useHealthStore } from "./health.store-B_Sa4TVa.js";
import { u as useElderlyStore } from "./elderly.store-isfnimJX.js";
import { f as formatDateTime } from "./validators-BfKhytEl.js";
import { u as usePageRefresh } from "./usePageRefresh-Wnx_lW1d.js";
import { u as useMessage, p as useDialog, v as NSpace, J as NSelect, B as Button, g as NCard, U as NTabs, T as NTabPane, j as NForm, k as NFormItem, l as NInput, i as NAlert, H as NDatePicker, S as NInputNumber, h as NModal, o as NTag } from "./vendor-naive-sdNTCZPI.js";
import { l as defineComponent, r as ref, U as createBlock, W as withCtx, u as unref, V as openBlock, X as createVNode, a1 as createElementBlock, k as createTextVNode, F as Fragment, a9 as createCommentVNode, c as computed, q as h } from "./vendor-vue-Hc3ejqjp.js";
import "./vendor-echarts-DEbY5nl3.js";
import "./vendor-query-CFvMrhIw.js";
import "./vendor-utils-DD6FGs_H.js";
import "./useAutoRefresh-BeuDS8Br.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "Health" },
  __name: "HealthView",
  setup(__props) {
    const healthStore = useHealthStore();
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
      await healthStore.fetchAll(id);
      Object.assign(profileForm.value, {
        elderly_id: id,
        blood_type: healthStore.profile?.blood_type ?? "",
        allergy: healthStore.profile?.allergy ?? "",
        chronic_disease: healthStore.profile?.chronic_disease ?? "",
        surgery_history: healthStore.profile?.surgery_history ?? "",
        family_history: healthStore.profile?.family_history ?? "",
        disability: healthStore.profile?.disability ?? "",
        diet_require: healthStore.profile?.diet_require ?? "",
        remark: healthStore.profile?.remark ?? ""
      });
    }
    const profileForm = ref({
      elderly_id: "",
      blood_type: "",
      allergy: "",
      chronic_disease: "",
      surgery_history: "",
      family_history: "",
      disability: "",
      diet_require: "",
      remark: ""
    });
    async function saveProfile() {
      if (!profileForm.value.elderly_id) return message.error("请选择老人");
      await healthStore.saveProfile(profileForm.value.elderly_id, {
        blood_type: profileForm.value.blood_type || null,
        allergy: profileForm.value.allergy || null,
        chronic_disease: profileForm.value.chronic_disease || null,
        surgery_history: profileForm.value.surgery_history || null,
        family_history: profileForm.value.family_history || null,
        disability: profileForm.value.disability || null,
        diet_require: profileForm.value.diet_require || null,
        remark: profileForm.value.remark || null
      });
      message.success("健康档案已保存");
    }
    const showVitalModal = ref(false);
    const vitalForm = ref({
      elderly_id: "",
      record_date: formatDateTime(Date.now()),
      record_time: (/* @__PURE__ */ new Date()).toTimeString().slice(0, 5),
      temperature: null,
      pulse: null,
      respiration: null,
      systolic_bp: null,
      diastolic_bp: null,
      blood_sugar: null,
      weight: null,
      spo2: null,
      recorder: "",
      remark: ""
    });
    async function saveVital() {
      if (!vitalForm.value.elderly_id) return message.error("请选择老人");
      await healthStore.createVital({ ...vitalForm.value, deleted_at: null });
      showVitalModal.value = false;
      message.success("体征记录已保存");
      if (selectedElderlyId.value) await healthStore.fetchAll(selectedElderlyId.value);
    }
    const bpChartOption = computed(() => {
      const data = healthStore.vitals.slice(0, 20).reverse();
      return {
        tooltip: { trigger: "axis", confine: true },
        legend: { top: 0, data: ["收缩压", "舒张压"] },
        grid: { top: 40, right: 16, bottom: 8, left: 8, containLabel: true },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: data.map((v) => v.record_date.slice(5, 16)),
          axisLabel: { hideOverlap: true }
        },
        yAxis: { type: "value", name: "mmHg" },
        series: [
          { name: "收缩压", type: "line", data: data.map((v) => v.systolic_bp), smooth: true, itemStyle: { color: "#f56c6c" } },
          { name: "舒张压", type: "line", data: data.map((v) => v.diastolic_bp), smooth: true, itemStyle: { color: "#409eff" } }
        ]
      };
    });
    const vitalColumns = [
      { title: "日期", key: "record_date", width: 160, render: (r) => formatDateTime(r.record_date) },
      { title: "时间", key: "record_time", width: 70 },
      { title: "体温(℃)", key: "temperature", width: 90 },
      { title: "脉搏", key: "pulse", width: 70 },
      { title: "收缩压", key: "systolic_bp", width: 80 },
      { title: "舒张压", key: "diastolic_bp", width: 80 },
      { title: "血糖", key: "blood_sugar", width: 80 },
      { title: "体重(kg)", key: "weight", width: 90 },
      { title: "血氧(%)", key: "spo2", width: 80 },
      { title: "记录人", key: "recorder", width: 90 },
      { title: "操作", key: "actions", width: 80, render: (r) => h(Button, { size: "small", type: "error", onClick: () => {
        dialog.warning({ title: "删除", content: "确认删除？", positiveText: "确定", negativeText: "取消", onPositiveClick: async () => {
          await healthStore.deleteVital(r.id);
          message.success("已删除");
          if (selectedElderlyId.value) await healthStore.fetchAll(selectedElderlyId.value);
        } });
      } }, "删除") }
    ];
    const showMedOrderModal = ref(false);
    const medOrderForm = ref({
      elderly_id: "",
      drug_name: "",
      drug_spec: "",
      dosage: "",
      frequency: "",
      route: "oral",
      start_date: formatDateTime(Date.now()),
      end_date: null,
      prescriber: "",
      status: "active",
      remark: ""
    });
    const routeOptions = [
      { label: "口服", value: "oral" },
      { label: "肌肉注射", value: "im" },
      { label: "静脉注射", value: "iv" },
      { label: "外用", value: "external" },
      { label: "吸入", value: "inhalation" },
      { label: "其他", value: "other" }
    ];
    async function saveMedOrder() {
      if (!medOrderForm.value.drug_name || !medOrderForm.value.dosage || !medOrderForm.value.frequency) {
        return message.error("请填写药品名称、剂量和频次");
      }
      await healthStore.createMedOrder({ ...medOrderForm.value, deleted_at: null, prescriber: medOrderForm.value.prescriber || null });
      showMedOrderModal.value = false;
      message.success("医嘱已添加");
      if (selectedElderlyId.value) await healthStore.fetchAll(selectedElderlyId.value);
    }
    const medOrderColumns = [
      { title: "药品名称", key: "drug_name", width: 120 },
      { title: "规格", key: "drug_spec", width: 90 },
      { title: "剂量", key: "dosage", width: 80 },
      { title: "频次", key: "frequency", width: 90 },
      { title: "给药方式", key: "route", width: 90, render: (r) => ({ oral: "口服", im: "肌注", iv: "静注", external: "外用", inhalation: "吸入", other: "其他" })[r.route] ?? r.route },
      { title: "开始日期", key: "start_date", width: 160, render: (r) => formatDateTime(r.start_date) },
      { title: "结束日期", key: "end_date", width: 160, render: (r) => r.end_date ? formatDateTime(r.end_date) : "长期" },
      { title: "状态", key: "status", width: 80, render: (r) => h(NTag, { type: r.status === "active" ? "success" : "default" }, () => r.status === "active" ? "执行中" : "已停用") },
      {
        title: "操作",
        key: "actions",
        width: 160,
        render: (r) => h(NSpace, null, { default: () => [
          h(Button, { size: "small", type: "primary", disabled: r.status !== "active", onClick: () => openMedRecordModal(r) }, "执行记录"),
          h(Button, { size: "small", disabled: r.status !== "active", onClick: async () => {
            await healthStore.stopMedOrder(r.id);
            message.success("医嘱已停用");
            if (selectedElderlyId.value) await healthStore.fetchAll(selectedElderlyId.value);
          } }, "停用")
        ] })
      }
    ];
    const showMedRecordModal = ref(false);
    const medRecordForm = ref({
      elderly_id: "",
      order_id: "",
      take_date: formatDateTime(Date.now()),
      take_time: (/* @__PURE__ */ new Date()).toTimeString().slice(0, 5),
      shift: "morning",
      status: "taken",
      executor: "",
      remark: ""
    });
    const shiftOptions = [
      { label: "早晨", value: "morning" },
      { label: "中午", value: "noon" },
      { label: "晚上", value: "evening" },
      { label: "睡前", value: "bedtime" }
    ];
    const medRecordStatusOptions = [
      { label: "已服用", value: "taken" },
      { label: "拒绝服用", value: "refused" },
      { label: "漏服", value: "missed" }
    ];
    function openMedRecordModal(order) {
      medRecordForm.value = {
        elderly_id: order.elderly_id,
        order_id: order.id,
        take_date: formatDateTime(Date.now()),
        take_time: (/* @__PURE__ */ new Date()).toTimeString().slice(0, 5),
        shift: "morning",
        status: "taken",
        executor: "",
        remark: ""
      };
      showMedRecordModal.value = true;
    }
    async function saveMedRecord() {
      await healthStore.createMedRecord({ ...medRecordForm.value, deleted_at: null });
      showMedRecordModal.value = false;
      message.success("用药执行记录已保存");
      if (selectedElderlyId.value) await healthStore.fetchAll(selectedElderlyId.value);
    }
    const medRecordColumns = [
      { title: "日期", key: "take_date", width: 160, render: (r) => formatDateTime(r.take_date) },
      { title: "时间", key: "take_time", width: 80 },
      { title: "药品", key: "order_id", width: 130, render: (r) => healthStore.medOrders.find((o) => o.id === r.order_id)?.drug_name ?? r.order_id },
      { title: "班次", key: "shift", width: 80, render: (r) => ({ morning: "早晨", noon: "中午", evening: "晚上", bedtime: "睡前" })[r.shift] ?? r.shift },
      { title: "状态", key: "status", width: 90, render: (r) => h(NTag, { type: r.status === "taken" ? "success" : r.status === "refused" ? "warning" : "error" }, () => ({ taken: "已服用", refused: "拒绝服用", missed: "漏服" })[r.status] ?? r.status) },
      { title: "执行人", key: "executor", width: 90 }
    ];
    const showVisitModal = ref(false);
    const visitForm = ref({
      elderly_id: "",
      visit_date: formatDateTime(Date.now()),
      hospital: "",
      department: "",
      doctor: "",
      diagnosis: "",
      treatment: "",
      cost: null,
      escort: "",
      remark: ""
    });
    async function saveVisit() {
      if (!visitForm.value.elderly_id || !visitForm.value.visit_date) return message.error("请填写必填项");
      await healthStore.createVisit({ ...visitForm.value, deleted_at: null });
      showVisitModal.value = false;
      message.success("就医记录已保存");
      if (selectedElderlyId.value) await healthStore.fetchAll(selectedElderlyId.value);
    }
    const visitColumns = [
      { title: "就医日期", key: "visit_date", width: 160, render: (r) => formatDateTime(r.visit_date) },
      { title: "医院", key: "hospital", width: 150 },
      { title: "科室", key: "department", width: 100 },
      { title: "诊断", key: "diagnosis", ellipsis: { tooltip: true } },
      { title: "费用", key: "cost", width: 90, render: (r) => r.cost != null ? `¥${r.cost}` : "—" },
      { title: "陪同人", key: "escort", width: 90 },
      { title: "操作", key: "actions", width: 80, render: (r) => h(Button, { size: "small", type: "error", onClick: () => {
        dialog.warning({ title: "删除", content: "确认删除？", positiveText: "确定", negativeText: "取消", onPositiveClick: async () => {
          await healthStore.deleteVisit(r.id);
          message.success("已删除");
          if (selectedElderlyId.value) await healthStore.fetchAll(selectedElderlyId.value);
        } });
      } }, "删除") }
    ];
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), { title: "健康管理" }, {
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
                  selectedElderlyId.value ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                    createVNode(unref(Button), {
                      type: "primary",
                      onClick: _cache[1] || (_cache[1] = () => {
                        vitalForm.value.elderly_id = selectedElderlyId.value;
                        showVitalModal.value = true;
                      })
                    }, {
                      default: withCtx(() => [..._cache[52] || (_cache[52] = [
                        createTextVNode("+ 体征记录", -1)
                      ])]),
                      _: 1
                    }),
                    createVNode(unref(Button), {
                      onClick: _cache[2] || (_cache[2] = () => {
                        medOrderForm.value.elderly_id = selectedElderlyId.value;
                        showMedOrderModal.value = true;
                      })
                    }, {
                      default: withCtx(() => [..._cache[53] || (_cache[53] = [
                        createTextVNode("+ 用药医嘱", -1)
                      ])]),
                      _: 1
                    }),
                    createVNode(unref(Button), {
                      onClick: _cache[3] || (_cache[3] = () => {
                        visitForm.value.elderly_id = selectedElderlyId.value;
                        showVisitModal.value = true;
                      })
                    }, {
                      default: withCtx(() => [..._cache[54] || (_cache[54] = [
                        createTextVNode("+ 就医记录", -1)
                      ])]),
                      _: 1
                    })
                  ], 64)) : createCommentVNode("", true),
                  createVNode(unref(Button), {
                    loading: unref(refreshing),
                    size: "small",
                    onClick: unref(refresh)
                  }, {
                    default: withCtx(() => [..._cache[55] || (_cache[55] = [
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
                name: "vital",
                tab: "生命体征"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NCard), {
                    class: "mb-3",
                    title: "血压趋势"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$2), {
                        option: bpChartOption.value,
                        height: "200px"
                      }, null, 8, ["option"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NCard), { title: "体征记录" }, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$3), {
                        columns: vitalColumns,
                        data: unref(healthStore).vitals,
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
                name: "medication",
                tab: "用药管理"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NCard), {
                    class: "mb-3",
                    title: "用药医嘱"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$3), {
                        columns: medOrderColumns,
                        data: unref(healthStore).medOrders,
                        loading: unref(healthStore).loading,
                        pagination: { pageSize: 15 }
                      }, null, 8, ["data", "loading"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NCard), { title: "用药执行记录" }, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$3), {
                        columns: medRecordColumns,
                        data: unref(healthStore).medRecords,
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
                name: "visit",
                tab: "就医记录"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$3), {
                        columns: visitColumns,
                        data: unref(healthStore).visits,
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
                name: "profile",
                tab: "健康档案"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    default: withCtx(() => [
                      createVNode(unref(NForm), {
                        model: profileForm.value,
                        "label-placement": "left",
                        "label-width": "100"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(NFormItem), { label: "血型" }, {
                            default: withCtx(() => [
                              createVNode(unref(NInput), {
                                value: profileForm.value.blood_type,
                                "onUpdate:value": _cache[4] || (_cache[4] = ($event) => profileForm.value.blood_type = $event),
                                placeholder: "如：A型"
                              }, null, 8, ["value"])
                            ]),
                            _: 1
                          }),
                          createVNode(unref(NFormItem), { label: "过敏史" }, {
                            default: withCtx(() => [
                              createVNode(unref(NInput), {
                                value: profileForm.value.allergy,
                                "onUpdate:value": _cache[5] || (_cache[5] = ($event) => profileForm.value.allergy = $event),
                                type: "textarea",
                                rows: 2
                              }, null, 8, ["value"])
                            ]),
                            _: 1
                          }),
                          createVNode(unref(NFormItem), { label: "慢性病史" }, {
                            default: withCtx(() => [
                              createVNode(unref(NInput), {
                                value: profileForm.value.chronic_disease,
                                "onUpdate:value": _cache[6] || (_cache[6] = ($event) => profileForm.value.chronic_disease = $event),
                                type: "textarea",
                                rows: 2
                              }, null, 8, ["value"])
                            ]),
                            _: 1
                          }),
                          createVNode(unref(NFormItem), { label: "手术史" }, {
                            default: withCtx(() => [
                              createVNode(unref(NInput), {
                                value: profileForm.value.surgery_history,
                                "onUpdate:value": _cache[7] || (_cache[7] = ($event) => profileForm.value.surgery_history = $event),
                                type: "textarea",
                                rows: 2
                              }, null, 8, ["value"])
                            ]),
                            _: 1
                          }),
                          createVNode(unref(NFormItem), { label: "家族病史" }, {
                            default: withCtx(() => [
                              createVNode(unref(NInput), {
                                value: profileForm.value.family_history,
                                "onUpdate:value": _cache[8] || (_cache[8] = ($event) => profileForm.value.family_history = $event),
                                type: "textarea",
                                rows: 2
                              }, null, 8, ["value"])
                            ]),
                            _: 1
                          }),
                          createVNode(unref(NFormItem), { label: "残疾情况" }, {
                            default: withCtx(() => [
                              createVNode(unref(NInput), {
                                value: profileForm.value.disability,
                                "onUpdate:value": _cache[9] || (_cache[9] = ($event) => profileForm.value.disability = $event)
                              }, null, 8, ["value"])
                            ]),
                            _: 1
                          }),
                          createVNode(unref(NFormItem), { label: "饮食要求" }, {
                            default: withCtx(() => [
                              createVNode(unref(NInput), {
                                value: profileForm.value.diet_require,
                                "onUpdate:value": _cache[10] || (_cache[10] = ($event) => profileForm.value.diet_require = $event),
                                type: "textarea",
                                rows: 2
                              }, null, 8, ["value"])
                            ]),
                            _: 1
                          }),
                          createVNode(unref(NFormItem), { label: "备注" }, {
                            default: withCtx(() => [
                              createVNode(unref(NInput), {
                                value: profileForm.value.remark,
                                "onUpdate:value": _cache[11] || (_cache[11] = ($event) => profileForm.value.remark = $event),
                                type: "textarea",
                                rows: 2
                              }, null, 8, ["value"])
                            ]),
                            _: 1
                          }),
                          createVNode(unref(NFormItem), null, {
                            default: withCtx(() => [
                              createVNode(unref(Button), {
                                type: "primary",
                                onClick: saveProfile
                              }, {
                                default: withCtx(() => [..._cache[56] || (_cache[56] = [
                                  createTextVNode("保存档案", -1)
                                ])]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }, 8, ["model"])
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
            default: withCtx(() => [..._cache[57] || (_cache[57] = [
              createTextVNode("请先选择老人，查看其健康信息。", -1)
            ])]),
            _: 1
          })),
          createVNode(unref(NModal), {
            show: showVitalModal.value,
            "onUpdate:show": _cache[23] || (_cache[23] = ($event) => showVitalModal.value = $event),
            title: "生命体征记录",
            preset: "card",
            style: { "width": "520px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[22] || (_cache[22] = ($event) => showVitalModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[58] || (_cache[58] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: saveVital
                  }, {
                    default: withCtx(() => [..._cache[59] || (_cache[59] = [
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
                model: vitalForm.value,
                "label-placement": "left",
                "label-width": "90"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), { label: "记录日期" }, {
                    default: withCtx(() => [
                      createVNode(unref(NDatePicker), {
                        "formatted-value": vitalForm.value.record_date,
                        "onUpdate:formattedValue": _cache[12] || (_cache[12] = ($event) => vitalForm.value.record_date = $event),
                        "value-format": "yyyy-MM-dd HH:mm:ss",
                        type: "datetime",
                        style: { "width": "100%" }
                      }, null, 8, ["formatted-value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "记录时间" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: vitalForm.value.record_time,
                        "onUpdate:value": _cache[13] || (_cache[13] = ($event) => vitalForm.value.record_time = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "体温(℃)" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInputNumber), {
                        value: vitalForm.value.temperature,
                        "onUpdate:value": _cache[14] || (_cache[14] = ($event) => vitalForm.value.temperature = $event),
                        precision: 1,
                        min: 35,
                        max: 42
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "脉搏(次/分)" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInputNumber), {
                        value: vitalForm.value.pulse,
                        "onUpdate:value": _cache[15] || (_cache[15] = ($event) => vitalForm.value.pulse = $event),
                        min: 30,
                        max: 200
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "收缩压" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInputNumber), {
                        value: vitalForm.value.systolic_bp,
                        "onUpdate:value": _cache[16] || (_cache[16] = ($event) => vitalForm.value.systolic_bp = $event),
                        min: 60,
                        max: 250
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "舒张压" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInputNumber), {
                        value: vitalForm.value.diastolic_bp,
                        "onUpdate:value": _cache[17] || (_cache[17] = ($event) => vitalForm.value.diastolic_bp = $event),
                        min: 40,
                        max: 150
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "血糖(mmol/L)" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInputNumber), {
                        value: vitalForm.value.blood_sugar,
                        "onUpdate:value": _cache[18] || (_cache[18] = ($event) => vitalForm.value.blood_sugar = $event),
                        precision: 1,
                        min: 1,
                        max: 30
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "体重(kg)" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInputNumber), {
                        value: vitalForm.value.weight,
                        "onUpdate:value": _cache[19] || (_cache[19] = ($event) => vitalForm.value.weight = $event),
                        precision: 1,
                        min: 20,
                        max: 200
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "血氧饱和度(%)" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInputNumber), {
                        value: vitalForm.value.spo2,
                        "onUpdate:value": _cache[20] || (_cache[20] = ($event) => vitalForm.value.spo2 = $event),
                        min: 70,
                        max: 100
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "记录人" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: vitalForm.value.recorder,
                        "onUpdate:value": _cache[21] || (_cache[21] = ($event) => vitalForm.value.recorder = $event)
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
            show: showMedOrderModal.value,
            "onUpdate:show": _cache[33] || (_cache[33] = ($event) => showMedOrderModal.value = $event),
            title: "新增用药医嘱",
            preset: "card",
            style: { "width": "520px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[32] || (_cache[32] = ($event) => showMedOrderModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[60] || (_cache[60] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: saveMedOrder
                  }, {
                    default: withCtx(() => [..._cache[61] || (_cache[61] = [
                      createTextVNode("添加医嘱", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(NForm), {
                model: medOrderForm.value,
                "label-placement": "left",
                "label-width": "90"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), {
                    label: "药品名称",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: medOrderForm.value.drug_name,
                        "onUpdate:value": _cache[24] || (_cache[24] = ($event) => medOrderForm.value.drug_name = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "规格" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: medOrderForm.value.drug_spec,
                        "onUpdate:value": _cache[25] || (_cache[25] = ($event) => medOrderForm.value.drug_spec = $event),
                        placeholder: "如：100mg/片"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "剂量",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: medOrderForm.value.dosage,
                        "onUpdate:value": _cache[26] || (_cache[26] = ($event) => medOrderForm.value.dosage = $event),
                        placeholder: "如：1片"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "频次",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: medOrderForm.value.frequency,
                        "onUpdate:value": _cache[27] || (_cache[27] = ($event) => medOrderForm.value.frequency = $event),
                        placeholder: "如：每日三次"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "给药途径" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: medOrderForm.value.route,
                        "onUpdate:value": _cache[28] || (_cache[28] = ($event) => medOrderForm.value.route = $event),
                        options: routeOptions
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "开始日期" }, {
                    default: withCtx(() => [
                      createVNode(unref(NDatePicker), {
                        "formatted-value": medOrderForm.value.start_date,
                        "onUpdate:formattedValue": _cache[29] || (_cache[29] = ($event) => medOrderForm.value.start_date = $event),
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
                        "formatted-value": medOrderForm.value.end_date,
                        "onUpdate:formattedValue": _cache[30] || (_cache[30] = ($event) => medOrderForm.value.end_date = $event),
                        "value-format": "yyyy-MM-dd HH:mm:ss",
                        type: "datetime",
                        clearable: "",
                        placeholder: "留空表示长期",
                        style: { "width": "100%" }
                      }, null, 8, ["formatted-value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "开方医生" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: medOrderForm.value.prescriber,
                        "onUpdate:value": _cache[31] || (_cache[31] = ($event) => medOrderForm.value.prescriber = $event)
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
            show: showMedRecordModal.value,
            "onUpdate:show": _cache[41] || (_cache[41] = ($event) => showMedRecordModal.value = $event),
            title: "用药执行记录",
            preset: "card",
            style: { "width": "480px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[40] || (_cache[40] = ($event) => showMedRecordModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[62] || (_cache[62] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: saveMedRecord
                  }, {
                    default: withCtx(() => [..._cache[63] || (_cache[63] = [
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
                model: medRecordForm.value,
                "label-placement": "left",
                "label-width": "90"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), { label: "服药日期" }, {
                    default: withCtx(() => [
                      createVNode(unref(NDatePicker), {
                        "formatted-value": medRecordForm.value.take_date,
                        "onUpdate:formattedValue": _cache[34] || (_cache[34] = ($event) => medRecordForm.value.take_date = $event),
                        "value-format": "yyyy-MM-dd HH:mm:ss",
                        type: "datetime",
                        style: { "width": "100%" }
                      }, null, 8, ["formatted-value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "服药时间" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: medRecordForm.value.take_time,
                        "onUpdate:value": _cache[35] || (_cache[35] = ($event) => medRecordForm.value.take_time = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "班次" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: medRecordForm.value.shift,
                        "onUpdate:value": _cache[36] || (_cache[36] = ($event) => medRecordForm.value.shift = $event),
                        options: shiftOptions
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "执行状态" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: medRecordForm.value.status,
                        "onUpdate:value": _cache[37] || (_cache[37] = ($event) => medRecordForm.value.status = $event),
                        options: medRecordStatusOptions
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "执行人" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: medRecordForm.value.executor,
                        "onUpdate:value": _cache[38] || (_cache[38] = ($event) => medRecordForm.value.executor = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "备注" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: medRecordForm.value.remark,
                        "onUpdate:value": _cache[39] || (_cache[39] = ($event) => medRecordForm.value.remark = $event)
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
            show: showVisitModal.value,
            "onUpdate:show": _cache[51] || (_cache[51] = ($event) => showVisitModal.value = $event),
            title: "就医/转诊记录",
            preset: "card",
            style: { "width": "520px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[50] || (_cache[50] = ($event) => showVisitModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[64] || (_cache[64] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: saveVisit
                  }, {
                    default: withCtx(() => [..._cache[65] || (_cache[65] = [
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
                model: visitForm.value,
                "label-placement": "left",
                "label-width": "90"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), {
                    label: "就医日期",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NDatePicker), {
                        "formatted-value": visitForm.value.visit_date,
                        "onUpdate:formattedValue": _cache[42] || (_cache[42] = ($event) => visitForm.value.visit_date = $event),
                        "value-format": "yyyy-MM-dd HH:mm:ss",
                        type: "datetime",
                        style: { "width": "100%" }
                      }, null, 8, ["formatted-value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "医院" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: visitForm.value.hospital,
                        "onUpdate:value": _cache[43] || (_cache[43] = ($event) => visitForm.value.hospital = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "科室" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: visitForm.value.department,
                        "onUpdate:value": _cache[44] || (_cache[44] = ($event) => visitForm.value.department = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "医生" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: visitForm.value.doctor,
                        "onUpdate:value": _cache[45] || (_cache[45] = ($event) => visitForm.value.doctor = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "诊断" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: visitForm.value.diagnosis,
                        "onUpdate:value": _cache[46] || (_cache[46] = ($event) => visitForm.value.diagnosis = $event),
                        type: "textarea",
                        rows: 2
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "治疗方案" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: visitForm.value.treatment,
                        "onUpdate:value": _cache[47] || (_cache[47] = ($event) => visitForm.value.treatment = $event),
                        type: "textarea",
                        rows: 2
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "费用(元)" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInputNumber), {
                        value: visitForm.value.cost,
                        "onUpdate:value": _cache[48] || (_cache[48] = ($event) => visitForm.value.cost = $event),
                        min: 0,
                        precision: 2
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "陪同人员" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: visitForm.value.escort,
                        "onUpdate:value": _cache[49] || (_cache[49] = ($event) => visitForm.value.escort = $event)
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
