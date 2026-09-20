import "./vendor-echarts-dbJmlwEq.js";
import { _ as _sfc_main$1 } from "./BasePage.vue_vue_type_script_setup_true_lang-CTneexfB.js";
import "./index-4Egxykc2.js";
import { u as useElderlyStore } from "./elderly.store-D40oP61q.js";
import { u as useHealthStore } from "./health.store-Dhphi8R_.js";
import { u as useMealStore } from "./meal.store-BSQnGjaL.js";
import { u as usePageRefresh } from "./usePageRefresh-D9DPHtoi.js";
import { i as NAlert, O as NStatistic, g as NCard, v as NSpace, J as NSelect, Q as NDescriptions, R as NDescriptionsItem, l as NInput, B as Button, D as NEmpty, Z as NDrawerContent, _ as NDrawer, o as NTag } from "./vendor-naive-DlmVkmqb.js";
import { l as defineComponent, U as createBlock, W as withCtx, u as unref, V as openBlock, X as createVNode, k as createTextVNode, a3 as createBaseVNode, a9 as toDisplayString, a1 as createElementBlock, F as Fragment, a6 as renderList, a7 as createCommentVNode, r as ref, c as computed } from "./vendor-vue-Ccw0-9Al.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./vendor-query-Q9Uykhde.js";
import "./useAutoRefresh-BeuDS8Br.js";
const _hoisted_1 = { class: "summary-grid mb-4" };
const _hoisted_2 = {
  key: 0,
  class: "recipe-grid"
};
const _hoisted_3 = { class: "recipe-title" };
const _hoisted_4 = { class: "recipe-summary" };
const _hoisted_5 = { class: "drawer-summary" };
const _hoisted_6 = { class: "detail-section" };
const _hoisted_7 = { class: "detail-section" };
const _hoisted_8 = { class: "detail-section" };
const _hoisted_9 = { class: "detail-section" };
const _hoisted_10 = { class: "caution-list" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "FoodTherapy" },
  __name: "FoodTherapyView",
  setup(__props) {
    const goalOptions = [
      { label: "均衡膳食", value: "balanced" },
      { label: "细软易食", value: "soft" },
      { label: "补充优质蛋白", value: "protein" },
      { label: "清淡少盐", value: "low_salt" },
      { label: "控糖搭配", value: "sugar_control" }
    ];
    const mealPeriodOptions = [
      { label: "早餐", value: "breakfast" },
      { label: "午餐", value: "lunch" },
      { label: "晚餐", value: "dinner" },
      { label: "加餐", value: "snack" }
    ];
    const goalLabels = Object.fromEntries(
      goalOptions.map((item) => [item.value, item.label])
    );
    const mealPeriodLabels = Object.fromEntries(
      mealPeriodOptions.map((item) => [item.value, item.label])
    );
    const dietTypeLabels = {
      normal: "普通均衡膳食",
      diabetes: "糖尿病膳食",
      hypertension: "低盐控压膳食",
      low_purine: "低嘌呤膳食",
      soft: "软食/易咀嚼膳食",
      malnutrition: "营养改善膳食",
      other: "其他个性化膳食"
    };
    const recipes = [
      {
        id: "chicken-vegetable-congee",
        name: "香菇鸡肉青菜粥",
        summary: "谷物、禽肉和蔬菜同煮，质地可按咀嚼能力调整。",
        goals: ["balanced", "soft", "protein"],
        mealPeriods: ["breakfast", "dinner"],
        ingredients: [
          "大米 25g",
          "鸡肉 30g",
          "鲜香菇 20g",
          "青菜 50g",
          "植物油 3g"
        ],
        steps: [
          "鸡肉切碎并彻底加热。",
          "大米煮至软烂后加入香菇和鸡肉。",
          "出锅前加入切碎青菜，少油少盐调味。"
        ],
        highlights: ["食物种类较丰富", "质地可调", "含优质蛋白"],
        cautions: [
          "吞咽困难者需由专业人员评估食物稠度。",
          "对香菇或禽肉过敏者不适用。"
        ]
      },
      {
        id: "fish-tofu-soup",
        name: "鲫鱼豆腐汤",
        summary: "鱼类与豆制品搭配，适合作为正餐中的蛋白质菜品。",
        goals: ["balanced", "protein", "low_salt"],
        mealPeriods: ["lunch", "dinner"],
        ingredients: ["鲫鱼 60g", "北豆腐 50g", "姜片 2g", "青菜 50g"],
        steps: [
          "鲫鱼处理干净，煎制时控制用油。",
          "加水和姜片煮熟后放入豆腐。",
          "加入青菜并彻底煮熟，少盐调味。"
        ],
        highlights: ["鱼类蛋白", "搭配豆制品", "清淡烹调"],
        cautions: [
          "供餐前必须仔细去除鱼刺。",
          "肾功能异常者的蛋白质摄入量需遵循医嘱。"
        ]
      },
      {
        id: "shrimp-steamed-egg",
        name: "虾仁蒸蛋",
        summary: "蒸制后细软，适合咀嚼能力较弱但可安全吞咽的人群。",
        goals: ["soft", "protein", "low_salt"],
        mealPeriods: ["lunch", "dinner"],
        ingredients: ["鸡蛋 50g", "虾仁 30g", "温水 80ml", "香葱少量"],
        steps: [
          "鸡蛋与温水搅匀后过滤。",
          "虾仁切碎放入蛋液。",
          "蒸至完全凝固，少盐调味。"
        ],
        highlights: ["细软易咀嚼", "含优质蛋白", "少油烹调"],
        cautions: [
          "对蛋类或甲壳类食物过敏者不适用。",
          "必须确保蛋和虾完全熟透。"
        ]
      },
      {
        id: "pumpkin-millet-congee",
        name: "南瓜小米粥",
        summary: "口感细软，可与蛋、奶或豆制品搭配形成更完整的一餐。",
        goals: ["soft"],
        mealPeriods: ["breakfast", "dinner"],
        ingredients: ["小米 35g", "南瓜 80g", "清水适量"],
        steps: [
          "南瓜去皮切小块。",
          "小米与南瓜同煮至软烂。",
          "不额外加糖，按进食能力调整稠度。"
        ],
        highlights: ["质地细软", "制作简单", "不额外加糖"],
        cautions: [
          "不能替代完整正餐，建议搭配蛋白质食物。",
          "控糖人群应将其计入当餐主食总量。"
        ]
      },
      {
        id: "oat-milk",
        name: "燕麦牛奶羹",
        summary: "全谷物与奶类组合，适合作为早餐或加餐。",
        goals: ["balanced", "soft", "protein", "sugar_control"],
        mealPeriods: ["breakfast", "snack"],
        ingredients: ["燕麦片 30g", "低脂牛奶 250ml", "核桃碎 5g"],
        steps: [
          "燕麦片加水煮软。",
          "加入牛奶小火加热，不长时间沸煮。",
          "出锅后撒少量核桃碎，不额外加糖。"
        ],
        highlights: ["含全谷物", "含奶类蛋白", "不额外加糖"],
        cautions: [
          "乳糖不耐受者可改用无乳糖奶。",
          "坚果需切碎，吞咽困难者不添加颗粒。"
        ]
      },
      {
        id: "beef-tomato-stew",
        name: "番茄牛肉软烩",
        summary: "瘦肉与蔬菜慢炖至软烂，可配少量杂粮主食。",
        goals: ["balanced", "soft", "protein"],
        mealPeriods: ["lunch", "dinner"],
        ingredients: ["瘦牛肉 60g", "番茄 150g", "胡萝卜 50g", "洋葱 20g"],
        steps: [
          "牛肉切小块焯水。",
          "番茄、胡萝卜和牛肉同炖至软烂。",
          "利用番茄增味，减少盐和含钠调味品。"
        ],
        highlights: ["含瘦肉蛋白", "搭配多种蔬菜", "软烂易咀嚼"],
        cautions: [
          "咀嚼能力弱者需切碎或制成适宜质地。",
          "痛风急性期或需限制肉类者遵循医嘱。"
        ]
      },
      {
        id: "tofu-broccoli-fungus",
        name: "豆腐西兰花烩木耳",
        summary: "豆制品与多种蔬菜搭配，采用焯水后少油烩制。",
        goals: ["balanced", "low_salt", "sugar_control"],
        mealPeriods: ["lunch", "dinner"],
        ingredients: ["北豆腐 80g", "西兰花 100g", "胡萝卜 30g", "干木耳 5g"],
        steps: [
          "木耳充分泡发、清洗并煮熟。",
          "西兰花和胡萝卜焯水。",
          "与豆腐少油烩制，少盐调味。"
        ],
        highlights: ["含豆制品", "蔬菜种类丰富", "清淡少油"],
        cautions: [
          "木耳应现泡现用并彻底加热。",
          "需限制钾或磷者应由营养专业人员调整食材和份量。"
        ]
      },
      {
        id: "winter-melon-mushroom-soup",
        name: "冬瓜菌菇汤",
        summary: "以蔬菜和菌菇提供鲜味，减少对盐和复合调味料的依赖。",
        goals: ["low_salt", "balanced"],
        mealPeriods: ["lunch", "dinner"],
        ingredients: ["冬瓜 150g", "鲜香菇 30g", "白玉菇 30g", "瘦肉 20g"],
        steps: [
          "所有食材洗净切成适口大小。",
          "菌菇和瘦肉彻底煮熟后加入冬瓜。",
          "以天然食材增味，少放盐和鸡精。"
        ],
        highlights: ["少盐思路", "增加蔬菜摄入", "食材天然增味"],
        cautions: [
          "不把汤水作为治疗水肿或降压的方法。",
          "需要限水者按医嘱控制汤量。"
        ]
      },
      {
        id: "multigrain-rice",
        name: "杂粮蔬菜饭",
        summary: "用部分全谷物和杂豆替代精白米，搭配蔬菜和蛋白质菜品。",
        goals: ["balanced", "sugar_control"],
        mealPeriods: ["lunch", "dinner"],
        ingredients: [
          "大米 50g",
          "糙米 15g",
          "小米 10g",
          "杂豆 10g",
          "胡萝卜 30g"
        ],
        steps: [
          "杂豆和糙米提前浸泡。",
          "与大米、小米和胡萝卜同煮。",
          "按咀嚼能力延长烹煮时间，并搭配一荤一素。"
        ],
        highlights: ["含全谷物杂豆", "主食粗细搭配", "不额外加糖"],
        cautions: [
          "吞咽或消化能力较弱者应减少粗杂粮比例并煮软。",
          "控糖人群仍需控制当餐主食总量。"
        ]
      }
    ];
    const elderlyStore = useElderlyStore();
    const healthStore = useHealthStore();
    const mealStore = useMealStore();
    const keyword = ref("");
    const selectedGoal = ref(null);
    const selectedMealPeriod = ref(null);
    const selectedElderlyId = ref(null);
    const selectedRecipe = ref(null);
    const showRecipeDrawer = ref(false);
    const elderlyOptions = computed(
      () => elderlyStore.list.filter((elderly) => elderly.status === "active").map((elderly) => ({ label: elderly.name, value: elderly.id }))
    );
    const currentNutritionPlan = computed(
      () => mealStore.nutritionPlans.find((plan) => plan.status === "active") ?? null
    );
    const filteredRecipes = computed(() => {
      const normalizedKeyword = keyword.value.trim().toLowerCase();
      return recipes.filter((recipe) => {
        const matchesGoal = !selectedGoal.value || recipe.goals.includes(selectedGoal.value);
        const matchesMealPeriod = !selectedMealPeriod.value || recipe.mealPeriods.includes(selectedMealPeriod.value);
        const searchableText = [
          recipe.name,
          recipe.summary,
          ...recipe.ingredients,
          ...recipe.highlights
        ].join(" ").toLowerCase();
        return matchesGoal && matchesMealPeriod && (!normalizedKeyword || searchableText.includes(normalizedKeyword));
      });
    });
    async function loadData() {
      await elderlyStore.fetchList();
      if (selectedElderlyId.value) {
        await Promise.all([
          healthStore.fetchAll(selectedElderlyId.value),
          mealStore.fetchNutritionPlans(selectedElderlyId.value, false)
        ]);
      }
    }
    const { refresh, refreshing } = usePageRefresh(loadData);
    async function onElderlyChange(elderlyId) {
      selectedElderlyId.value = elderlyId;
      healthStore.profile = null;
      mealStore.nutritionPlans = [];
      if (!elderlyId) {
        return;
      }
      await Promise.all([
        healthStore.fetchAll(elderlyId),
        mealStore.fetchNutritionPlans(elderlyId, false)
      ]);
    }
    function clearFilters() {
      keyword.value = "";
      selectedGoal.value = null;
      selectedMealPeriod.value = null;
    }
    function openRecipe(recipe) {
      selectedRecipe.value = recipe;
      showRecipeDrawer.value = true;
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), {
        title: "食补",
        description: "面向养老照护场景的食养参考，可结合健康档案与营养方案筛选日常食谱"
      }, {
        actions: withCtx(() => [
          createVNode(unref(Button), {
            loading: unref(refreshing),
            onClick: unref(refresh)
          }, {
            default: withCtx(() => [..._cache[5] || (_cache[5] = [
              createTextVNode(" 刷新档案 ", -1)
            ])]),
            _: 1
          }, 8, ["loading", "onClick"])
        ]),
        default: withCtx(() => [
          createVNode(unref(NAlert), {
            type: "warning",
            class: "mb-4"
          }, {
            default: withCtx(() => [..._cache[6] || (_cache[6] = [
              createTextVNode(" 食补内容仅用于日常膳食参考，不能替代诊断、药物或临床营养治疗。涉及糖尿病、肾病、吞咽障碍、食物过敏或药物相互作用时，应由医师、药师或营养专业人员确认。 ", -1)
            ])]),
            _: 1
          }),
          createBaseVNode("div", _hoisted_1, [
            createVNode(unref(NCard), { size: "small" }, {
              default: withCtx(() => [
                createVNode(unref(NStatistic), {
                  label: "食补方案",
                  value: recipes.length
                }, {
                  suffix: withCtx(() => [..._cache[7] || (_cache[7] = [
                    createTextVNode(" 项 ", -1)
                  ])]),
                  _: 1
                }, 8, ["value"])
              ]),
              _: 1
            }),
            createVNode(unref(NCard), { size: "small" }, {
              default: withCtx(() => [
                createVNode(unref(NStatistic), {
                  label: "当前筛选",
                  value: filteredRecipes.value.length
                }, {
                  suffix: withCtx(() => [..._cache[8] || (_cache[8] = [
                    createTextVNode(" 项 ", -1)
                  ])]),
                  _: 1
                }, 8, ["value"])
              ]),
              _: 1
            }),
            createVNode(unref(NCard), { size: "small" }, {
              default: withCtx(() => [
                createVNode(unref(NStatistic), {
                  label: "调养方向",
                  value: goalOptions.length
                }, {
                  suffix: withCtx(() => [..._cache[9] || (_cache[9] = [
                    createTextVNode(" 类 ", -1)
                  ])]),
                  _: 1
                }, 8, ["value"])
              ]),
              _: 1
            })
          ]),
          createVNode(unref(NCard), {
            title: "个人档案参考",
            class: "mb-4"
          }, {
            default: withCtx(() => [
              createVNode(unref(NSpace), {
                align: "center",
                class: "mb-3"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NSelect), {
                    value: selectedElderlyId.value,
                    "onUpdate:value": [
                      _cache[0] || (_cache[0] = ($event) => selectedElderlyId.value = $event),
                      onElderlyChange
                    ],
                    options: elderlyOptions.value,
                    clearable: "",
                    filterable: "",
                    placeholder: "可选：选择老人查看饮食提醒",
                    style: { "width": "280px" }
                  }, null, 8, ["value", "options"])
                ]),
                _: 1
              }),
              selectedElderlyId.value ? (openBlock(), createBlock(unref(NDescriptions), {
                key: 0,
                columns: 3,
                bordered: "",
                "label-placement": "left"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NDescriptionsItem), { label: "过敏信息" }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(healthStore).profile?.allergy || "未记录"), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NDescriptionsItem), { label: "慢性病" }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(healthStore).profile?.chronic_disease || "未记录"), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NDescriptionsItem), { label: "饮食要求" }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(healthStore).profile?.diet_require || "未记录"), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NDescriptionsItem), { label: "当前膳食类型" }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(currentNutritionPlan.value ? dietTypeLabels[currentNutritionPlan.value.diet_type] ?? currentNutritionPlan.value.diet_type : "未配置执行中的营养方案"), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NDescriptionsItem), { label: "忌口食物" }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(currentNutritionPlan.value?.avoid_foods || "未记录"), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NDescriptionsItem), { label: "营养方案建议" }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(currentNutritionPlan.value?.meal_advice || "未记录"), 1)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })) : (openBlock(), createBlock(unref(NAlert), {
                key: 1,
                type: "info",
                bordered: false
              }, {
                default: withCtx(() => [..._cache[10] || (_cache[10] = [
                  createTextVNode(" 选择老人后，会并列展示健康档案与当前营养方案，便于人工核对过敏、忌口和饮食要求。 ", -1)
                ])]),
                _: 1
              }))
            ]),
            _: 1
          }),
          createVNode(unref(NCard), { title: "食补方案库" }, {
            default: withCtx(() => [
              createVNode(unref(NSpace), {
                class: "filter-bar",
                align: "center"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NInput), {
                    value: keyword.value,
                    "onUpdate:value": _cache[1] || (_cache[1] = ($event) => keyword.value = $event),
                    clearable: "",
                    placeholder: "搜索食谱、食材或特点",
                    style: { "width": "260px" }
                  }, null, 8, ["value"]),
                  createVNode(unref(NSelect), {
                    value: selectedGoal.value,
                    "onUpdate:value": _cache[2] || (_cache[2] = ($event) => selectedGoal.value = $event),
                    options: goalOptions,
                    clearable: "",
                    placeholder: "调养方向",
                    style: { "width": "180px" }
                  }, null, 8, ["value"]),
                  createVNode(unref(NSelect), {
                    value: selectedMealPeriod.value,
                    "onUpdate:value": _cache[3] || (_cache[3] = ($event) => selectedMealPeriod.value = $event),
                    options: mealPeriodOptions,
                    clearable: "",
                    placeholder: "适用餐次",
                    style: { "width": "150px" }
                  }, null, 8, ["value"]),
                  createVNode(unref(Button), { onClick: clearFilters }, {
                    default: withCtx(() => [..._cache[11] || (_cache[11] = [
                      createTextVNode(" 重置 ", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              filteredRecipes.value.length ? (openBlock(), createElementBlock("div", _hoisted_2, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(filteredRecipes.value, (recipe) => {
                  return openBlock(), createBlock(unref(NCard), {
                    key: recipe.id,
                    size: "small",
                    hoverable: "",
                    class: "recipe-card"
                  }, {
                    header: withCtx(() => [
                      createBaseVNode("div", _hoisted_3, toDisplayString(recipe.name), 1)
                    ]),
                    "header-extra": withCtx(() => [
                      createVNode(unref(NTag), {
                        size: "small",
                        bordered: false,
                        type: "success"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(recipe.mealPeriods.map((period) => unref(mealPeriodLabels)[period]).join(" / ")), 1)
                        ]),
                        _: 2
                      }, 1024)
                    ]),
                    footer: withCtx(() => [
                      createVNode(unref(Button), {
                        text: "",
                        type: "primary",
                        onClick: ($event) => openRecipe(recipe)
                      }, {
                        default: withCtx(() => [..._cache[12] || (_cache[12] = [
                          createTextVNode(" 查看食材、做法与慎用提示 ", -1)
                        ])]),
                        _: 1
                      }, 8, ["onClick"])
                    ]),
                    default: withCtx(() => [
                      createBaseVNode("p", _hoisted_4, toDisplayString(recipe.summary), 1),
                      createVNode(unref(NSpace), { size: "small" }, {
                        default: withCtx(() => [
                          (openBlock(true), createElementBlock(Fragment, null, renderList(recipe.goals, (goal) => {
                            return openBlock(), createBlock(unref(NTag), {
                              key: goal,
                              size: "small",
                              bordered: false
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(unref(goalLabels)[goal]), 1)
                              ]),
                              _: 2
                            }, 1024);
                          }), 128))
                        ]),
                        _: 2
                      }, 1024)
                    ]),
                    _: 2
                  }, 1024);
                }), 128))
              ])) : (openBlock(), createBlock(unref(NEmpty), {
                key: 1,
                description: "没有符合当前条件的食补方案",
                class: "empty-state"
              }, {
                extra: withCtx(() => [
                  createVNode(unref(Button), { onClick: clearFilters }, {
                    default: withCtx(() => [..._cache[13] || (_cache[13] = [
                      createTextVNode(" 清除筛选 ", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              }))
            ]),
            _: 1
          }),
          createVNode(unref(NAlert), {
            type: "info",
            class: "mt-4",
            bordered: false
          }, {
            default: withCtx(() => [..._cache[14] || (_cache[14] = [
              createTextVNode(" 内容编制参考国家卫生健康委《老年人膳食指导》、老年人膳食指南核心推荐及慢性病食养指南，强调食物多样、质地适宜、足量蛋白和个体化调整。 ", -1)
            ])]),
            _: 1
          }),
          createVNode(unref(NDrawer), {
            show: showRecipeDrawer.value,
            "onUpdate:show": _cache[4] || (_cache[4] = ($event) => showRecipeDrawer.value = $event),
            width: 520
          }, {
            default: withCtx(() => [
              selectedRecipe.value ? (openBlock(), createBlock(unref(NDrawerContent), {
                key: 0,
                title: selectedRecipe.value.name,
                closable: ""
              }, {
                default: withCtx(() => [
                  createBaseVNode("p", _hoisted_5, toDisplayString(selectedRecipe.value.summary), 1),
                  createBaseVNode("section", _hoisted_6, [
                    _cache[15] || (_cache[15] = createBaseVNode("h3", null, "主要食材", -1)),
                    createBaseVNode("ul", null, [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(selectedRecipe.value.ingredients, (ingredient) => {
                        return openBlock(), createElementBlock("li", { key: ingredient }, toDisplayString(ingredient), 1);
                      }), 128))
                    ])
                  ]),
                  createBaseVNode("section", _hoisted_7, [
                    _cache[16] || (_cache[16] = createBaseVNode("h3", null, "参考做法", -1)),
                    createBaseVNode("ol", null, [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(selectedRecipe.value.steps, (step) => {
                        return openBlock(), createElementBlock("li", { key: step }, toDisplayString(step), 1);
                      }), 128))
                    ])
                  ]),
                  createBaseVNode("section", _hoisted_8, [
                    _cache[17] || (_cache[17] = createBaseVNode("h3", null, "搭配特点", -1)),
                    createVNode(unref(NSpace), null, {
                      default: withCtx(() => [
                        (openBlock(true), createElementBlock(Fragment, null, renderList(selectedRecipe.value.highlights, (highlight) => {
                          return openBlock(), createBlock(unref(NTag), {
                            key: highlight,
                            type: "success"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(highlight), 1)
                            ]),
                            _: 2
                          }, 1024);
                        }), 128))
                      ]),
                      _: 1
                    })
                  ]),
                  createBaseVNode("section", _hoisted_9, [
                    _cache[18] || (_cache[18] = createBaseVNode("h3", null, "慎用提示", -1)),
                    createVNode(unref(NAlert), {
                      type: "warning",
                      bordered: false
                    }, {
                      default: withCtx(() => [
                        createBaseVNode("ul", _hoisted_10, [
                          (openBlock(true), createElementBlock(Fragment, null, renderList(selectedRecipe.value.cautions, (caution) => {
                            return openBlock(), createElementBlock("li", { key: caution }, toDisplayString(caution), 1);
                          }), 128))
                        ])
                      ]),
                      _: 1
                    })
                  ])
                ]),
                _: 1
              }, 8, ["title"])) : createCommentVNode("", true)
            ]),
            _: 1
          }, 8, ["show"])
        ]),
        _: 1
      });
    };
  }
});
const FoodTherapyView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-586d4f11"]]);
export {
  FoodTherapyView as default
};
