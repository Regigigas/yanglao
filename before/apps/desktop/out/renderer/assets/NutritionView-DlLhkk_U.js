import { f as formatDateTime } from "./validators-BfKhytEl.js";
import { _ as _sfc_main$2 } from "./BaseTable.vue_vue_type_script_setup_true_lang-Kf6svQhn.js";
import "./vendor-echarts-DEbY5nl3.js";
import { _ as _sfc_main$1 } from "./BasePage.vue_vue_type_script_setup_true_lang-CoKRdyPV.js";
import "./index-77IpmxCe.js";
import { u as useElderlyStore } from "./elderly.store-isfnimJX.js";
import { u as useMealStore } from "./meal.store-8tS4lhc2.js";
import { u as usePageRefresh } from "./usePageRefresh-Wnx_lW1d.js";
import { u as useMessage, p as useDialog, v as NSpace, J as NSelect, B as Button, g as NCard, i as NAlert, j as NForm, k as NFormItem, X as NDynamicTags, S as NInputNumber, H as NDatePicker, l as NInput, h as NModal, o as NTag } from "./vendor-naive-sdNTCZPI.js";
import { l as defineComponent, U as createBlock, W as withCtx, u as unref, V as openBlock, X as createVNode, k as createTextVNode, a1 as createElementBlock, a3 as createBaseVNode, a8 as toDisplayString, a9 as createCommentVNode, F as Fragment, r as ref, c as computed, q as h } from "./vendor-vue-Hc3ejqjp.js";
import "./vendor-utils-DD6FGs_H.js";
import "./vendor-query-CFvMrhIw.js";
import "./useAutoRefresh-BeuDS8Br.js";
const _hoisted_1 = { class: "grid grid-cols-4 gap-4 text-sm" };
const _hoisted_2 = {
  key: 0,
  class: "mt-3 text-sm text-gray-600"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "Nutrition" },
  __name: "NutritionView",
  setup(__props) {
    const elderlyStore = useElderlyStore();
    const mealStore = useMealStore();
    const message = useMessage();
    const dialog = useDialog();
    const selectedElderlyId = ref(null);
    const showPlanModal = ref(false);
    const editingPlanId = ref(null);
    const today = formatDateTime(Date.now());
    const dietTypeOptions = [
      { label: "普通均衡膳食", value: "normal" },
      { label: "糖尿病膳食", value: "diabetes" },
      { label: "低盐控压膳食", value: "hypertension" },
      { label: "低嘌呤膳食", value: "low_purine" },
      { label: "软食/易咀嚼膳食", value: "soft" },
      { label: "营养改善膳食", value: "malnutrition" },
      { label: "其他个性化膳食", value: "other" }
    ];
    const dietTypeMap = Object.fromEntries(dietTypeOptions.map((item) => [item.value, item.label]));
    const statusOptions = [
      { label: "执行中", value: "active" },
      { label: "已停用", value: "inactive" }
    ];
    const planForm = ref({
      elderly_id: "",
      diet_type: "normal",
      allergies: [],
      avoid_foods: [],
      daily_calories: null,
      protein_target: null,
      meal_advice: "",
      effective_date: today,
      expiry_date: null,
      status: "active",
      remark: ""
    });
    const elderlyOptions = computed(
      () => elderlyStore.list.filter((elderly) => elderly.status === "active").map((elderly) => ({ label: elderly.name, value: elderly.id }))
    );
    const currentPlan = computed(() => mealStore.nutritionPlans.find((plan) => plan.status === "active"));
    async function loadData() {
      await elderlyStore.fetchList();
      if (selectedElderlyId.value) await mealStore.fetchNutritionPlans(selectedElderlyId.value);
    }
    const { refresh, refreshing } = usePageRefresh(loadData);
    async function onElderlyChange(elderlyId) {
      selectedElderlyId.value = elderlyId;
      await mealStore.fetchNutritionPlans(elderlyId);
    }
    function splitTags(value) {
      return value ? value.split(/[，,\n]/).map((item) => item.trim()).filter(Boolean) : [];
    }
    function resetPlanForm() {
      planForm.value = {
        elderly_id: selectedElderlyId.value ?? "",
        diet_type: "normal",
        allergies: [],
        avoid_foods: [],
        daily_calories: null,
        protein_target: null,
        meal_advice: "",
        effective_date: today,
        expiry_date: null,
        status: "active",
        remark: ""
      };
    }
    function openCreatePlan() {
      if (!selectedElderlyId.value) return message.error("请先选择老人");
      editingPlanId.value = null;
      resetPlanForm();
      showPlanModal.value = true;
    }
    function openEditPlan(plan) {
      editingPlanId.value = plan.id;
      planForm.value = {
        elderly_id: plan.elderly_id,
        diet_type: plan.diet_type,
        allergies: splitTags(plan.allergies),
        avoid_foods: splitTags(plan.avoid_foods),
        daily_calories: plan.daily_calories,
        protein_target: plan.protein_target,
        meal_advice: plan.meal_advice ?? "",
        effective_date: plan.effective_date,
        expiry_date: plan.expiry_date,
        status: plan.status,
        remark: plan.remark ?? ""
      };
      showPlanModal.value = true;
    }
    async function savePlan() {
      if (!planForm.value.elderly_id || !planForm.value.effective_date) return message.error("请填写生效日期");
      const payload = {
        ...planForm.value,
        allergies: planForm.value.allergies.join("、") || null,
        avoid_foods: planForm.value.avoid_foods.join("、") || null,
        meal_advice: planForm.value.meal_advice || null,
        remark: planForm.value.remark || null
      };
      if (editingPlanId.value) {
        await mealStore.updateNutritionPlan(editingPlanId.value, payload);
      } else {
        await mealStore.createNutritionPlan({ ...payload, created_by: null, deleted_at: null });
      }
      showPlanModal.value = false;
      await mealStore.fetchNutritionPlans(planForm.value.elderly_id);
      message.success("营养方案已保存");
    }
    function deletePlan(plan) {
      dialog.warning({
        title: "删除营养方案",
        content: "删除后不可恢复，确认继续？",
        positiveText: "删除",
        negativeText: "取消",
        onPositiveClick: async () => {
          await mealStore.deleteNutritionPlan(plan.id);
          message.success("营养方案已删除");
        }
      });
    }
    const planColumns = [
      { title: "适用膳食", key: "diet_type", width: 150, render: (plan) => dietTypeMap[plan.diet_type] ?? plan.diet_type },
      { title: "生效日期", key: "effective_date", width: 165 },
      { title: "目标能量", key: "daily_calories", width: 110, render: (plan) => plan.daily_calories ? `${plan.daily_calories} 千卡` : "-" },
      { title: "蛋白目标", key: "protein_target", width: 110, render: (plan) => plan.protein_target ? `${plan.protein_target} g` : "-" },
      { title: "过敏/忌口", key: "avoid_foods", ellipsis: { tooltip: true }, render: (plan) => [plan.allergies, plan.avoid_foods].filter(Boolean).join("；") || "-" },
      { title: "状态", key: "status", width: 90, render: (plan) => h(NTag, { type: plan.status === "active" ? "success" : "default" }, () => plan.status === "active" ? "执行中" : "已停用") },
      {
        title: "操作",
        key: "actions",
        width: 150,
        render: (plan) => h(NSpace, null, {
          default: () => [
            h(Button, { size: "small", onClick: () => openEditPlan(plan) }, () => "编辑"),
            h(Button, { size: "small", type: "error", onClick: () => deletePlan(plan) }, () => "删除")
          ]
        })
      }
    ];
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), { title: "营养搭配" }, {
        default: withCtx(() => [
          createVNode(unref(NCard), { class: "mb-4" }, {
            default: withCtx(() => [
              createVNode(unref(NSpace), { align: "center" }, {
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
                    style: { "width": "220px" }
                  }, null, 8, ["value", "options"]),
                  createVNode(unref(Button), {
                    type: "primary",
                    disabled: !selectedElderlyId.value,
                    onClick: openCreatePlan
                  }, {
                    default: withCtx(() => [..._cache[13] || (_cache[13] = [
                      createTextVNode("新增营养方案", -1)
                    ])]),
                    _: 1
                  }, 8, ["disabled"]),
                  createVNode(unref(Button), {
                    size: "small",
                    loading: unref(refreshing),
                    onClick: unref(refresh)
                  }, {
                    default: withCtx(() => [..._cache[14] || (_cache[14] = [
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
          selectedElderlyId.value ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
            currentPlan.value ? (openBlock(), createBlock(unref(NCard), {
              key: 0,
              class: "mb-4",
              title: "当前执行方案"
            }, {
              default: withCtx(() => [
                createBaseVNode("div", _hoisted_1, [
                  createBaseVNode("div", null, [
                    _cache[15] || (_cache[15] = createBaseVNode("span", { class: "text-gray-400" }, "膳食类型：", -1)),
                    createTextVNode(toDisplayString(unref(dietTypeMap)[currentPlan.value.diet_type]), 1)
                  ]),
                  createBaseVNode("div", null, [
                    _cache[16] || (_cache[16] = createBaseVNode("span", { class: "text-gray-400" }, "每日能量：", -1)),
                    createTextVNode(toDisplayString(currentPlan.value.daily_calories ? `${currentPlan.value.daily_calories} 千卡` : "未设置"), 1)
                  ]),
                  createBaseVNode("div", null, [
                    _cache[17] || (_cache[17] = createBaseVNode("span", { class: "text-gray-400" }, "蛋白目标：", -1)),
                    createTextVNode(toDisplayString(currentPlan.value.protein_target ? `${currentPlan.value.protein_target} g` : "未设置"), 1)
                  ]),
                  createBaseVNode("div", null, [
                    _cache[18] || (_cache[18] = createBaseVNode("span", { class: "text-gray-400" }, "生效日期：", -1)),
                    createTextVNode(toDisplayString(currentPlan.value.effective_date), 1)
                  ])
                ]),
                currentPlan.value.meal_advice ? (openBlock(), createElementBlock("div", _hoisted_2, "三餐建议：" + toDisplayString(currentPlan.value.meal_advice), 1)) : createCommentVNode("", true)
              ]),
              _: 1
            })) : (openBlock(), createBlock(unref(NAlert), {
              key: 1,
              class: "mb-4",
              type: "info"
            }, {
              default: withCtx(() => [..._cache[19] || (_cache[19] = [
                createTextVNode("该老人尚未配置执行中的营养方案。", -1)
              ])]),
              _: 1
            })),
            createVNode(unref(NCard), { title: "营养方案记录" }, {
              default: withCtx(() => [
                createVNode(unref(_sfc_main$2), {
                  columns: planColumns,
                  data: unref(mealStore).nutritionPlans,
                  loading: unref(mealStore).loading,
                  pagination: { pageSize: 15 }
                }, null, 8, ["data", "loading"])
              ]),
              _: 1
            })
          ], 64)) : (openBlock(), createBlock(unref(NAlert), {
            key: 1,
            type: "info"
          }, {
            default: withCtx(() => [..._cache[20] || (_cache[20] = [
              createTextVNode("请选择老人后维护其个性化营养方案。", -1)
            ])]),
            _: 1
          })),
          createVNode(unref(NModal), {
            show: showPlanModal.value,
            "onUpdate:show": _cache[12] || (_cache[12] = ($event) => showPlanModal.value = $event),
            title: editingPlanId.value ? "编辑营养方案" : "新增营养方案",
            preset: "card",
            style: { "width": "620px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[11] || (_cache[11] = ($event) => showPlanModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[23] || (_cache[23] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: savePlan
                  }, {
                    default: withCtx(() => [..._cache[24] || (_cache[24] = [
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
                model: planForm.value,
                "label-placement": "left",
                "label-width": "100"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), {
                    label: "膳食类型",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: planForm.value.diet_type,
                        "onUpdate:value": _cache[1] || (_cache[1] = ($event) => planForm.value.diet_type = $event),
                        options: dietTypeOptions
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "过敏食物" }, {
                    default: withCtx(() => [
                      createVNode(unref(NDynamicTags), {
                        value: planForm.value.allergies,
                        "onUpdate:value": _cache[2] || (_cache[2] = ($event) => planForm.value.allergies = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "忌口食物" }, {
                    default: withCtx(() => [
                      createVNode(unref(NDynamicTags), {
                        value: planForm.value.avoid_foods,
                        "onUpdate:value": _cache[3] || (_cache[3] = ($event) => planForm.value.avoid_foods = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "每日能量" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInputNumber), {
                        value: planForm.value.daily_calories,
                        "onUpdate:value": _cache[4] || (_cache[4] = ($event) => planForm.value.daily_calories = $event),
                        min: 0,
                        precision: 0
                      }, {
                        suffix: withCtx(() => [..._cache[21] || (_cache[21] = [
                          createTextVNode("千卡", -1)
                        ])]),
                        _: 1
                      }, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "蛋白目标" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInputNumber), {
                        value: planForm.value.protein_target,
                        "onUpdate:value": _cache[5] || (_cache[5] = ($event) => planForm.value.protein_target = $event),
                        min: 0,
                        precision: 1
                      }, {
                        suffix: withCtx(() => [..._cache[22] || (_cache[22] = [
                          createTextVNode("g/天", -1)
                        ])]),
                        _: 1
                      }, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "生效日期",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NDatePicker), {
                        "formatted-value": planForm.value.effective_date,
                        "onUpdate:formattedValue": _cache[6] || (_cache[6] = ($event) => planForm.value.effective_date = $event),
                        "value-format": "yyyy-MM-dd HH:mm:ss",
                        type: "datetime",
                        style: { "width": "100%" }
                      }, null, 8, ["formatted-value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "截止日期" }, {
                    default: withCtx(() => [
                      createVNode(unref(NDatePicker), {
                        "formatted-value": planForm.value.expiry_date,
                        "onUpdate:formattedValue": _cache[7] || (_cache[7] = ($event) => planForm.value.expiry_date = $event),
                        "value-format": "yyyy-MM-dd HH:mm:ss",
                        type: "datetime",
                        clearable: "",
                        style: { "width": "100%" }
                      }, null, 8, ["formatted-value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "执行状态" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: planForm.value.status,
                        "onUpdate:value": _cache[8] || (_cache[8] = ($event) => planForm.value.status = $event),
                        options: statusOptions
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "三餐建议" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: planForm.value.meal_advice,
                        "onUpdate:value": _cache[9] || (_cache[9] = ($event) => planForm.value.meal_advice = $event),
                        type: "textarea",
                        rows: 3,
                        placeholder: "例如：早餐搭配全谷物和蛋类，午晚餐控制精制主食比例"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "备注" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: planForm.value.remark,
                        "onUpdate:value": _cache[10] || (_cache[10] = ($event) => planForm.value.remark = $event)
                      }, null, 8, ["value"])
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
export {
  _sfc_main as default
};
