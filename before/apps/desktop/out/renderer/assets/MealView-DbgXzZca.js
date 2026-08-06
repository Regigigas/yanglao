import { l as defineComponent, U as createBlock, W as withCtx, u as unref, V as openBlock, X as createVNode, a3 as createBaseVNode, k as createTextVNode, a1 as createElementBlock, a6 as renderList, F as Fragment, a4 as withKeys, a9 as createCommentVNode, r as ref, q as h, a8 as toDisplayString, c as computed } from "./vendor-vue-Hc3ejqjp.js";
import { _ as _sfc_main$2 } from "./BaseTable.vue_vue_type_script_setup_true_lang-Cd51FqA2.js";
import "./vendor-echarts-DEbY5nl3.js";
import { _ as _sfc_main$1 } from "./BasePage.vue_vue_type_script_setup_true_lang-D7sGS98F.js";
import "./index-rYee39mb.js";
import { u as useMealStore } from "./meal.store-8tS4lhc2.js";
import { u as useElderlyStore } from "./elderly.store-isfnimJX.js";
import { f as formatDateTime } from "./validators-BfKhytEl.js";
import { u as usePageRefresh } from "./usePageRefresh-Wnx_lW1d.js";
import { u as useMessage, v as NSpace, H as NDatePicker, B as Button, g as NCard, U as NTabPane, V as NTabs, j as NForm, k as NFormItem, l as NInput, T as NInputNumber, h as NModal, o as NTag, J as NSelect } from "./vendor-naive-HV2ECLT0.js";
import "./vendor-query-CFvMrhIw.js";
import "./vendor-utils-DD6FGs_H.js";
import "./useAutoRefresh-BeuDS8Br.js";
const _hoisted_1 = { class: "grid grid-cols-3 gap-4" };
const _hoisted_2 = { key: 0 };
const _hoisted_3 = {
  key: 0,
  class: "text-gray-400 text-sm mt-2"
};
const _hoisted_4 = {
  key: 1,
  class: "text-gray-400 text-center py-4"
};
const _hoisted_5 = { class: "flex flex-wrap gap-2" };
const _hoisted_6 = {
  key: 0,
  class: "text-gray-400"
};
const _hoisted_7 = { class: "max-h-96 overflow-auto" };
const _hoisted_8 = { class: "w-full text-sm" };
const _hoisted_9 = { class: "p-2" };
const _hoisted_10 = { class: "p-2" };
const _hoisted_11 = { class: "p-2" };
const _hoisted_12 = { class: "p-2" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "Meal" },
  __name: "MealView",
  setup(__props) {
    const mealStore = useMealStore();
    const elderlyStore = useElderlyStore();
    const message = useMessage();
    const today = formatDateTime(Date.now());
    const selectedDate = ref(today);
    async function loadData() {
      await Promise.all([
        elderlyStore.fetchList(),
        mealStore.fetchMenuByDate(selectedDate.value),
        mealStore.fetchRecordsByDate(selectedDate.value)
      ]);
    }
    const { refresh, refreshing } = usePageRefresh(loadData);
    async function onDateChange() {
      await Promise.all([
        mealStore.fetchMenuByDate(selectedDate.value),
        mealStore.fetchRecordsByDate(selectedDate.value)
      ]);
    }
    const showMenuModal = ref(false);
    const menuForm = ref({
      menu_date: today,
      meal_type: "lunch",
      dishes: "[]",
      calories: null,
      remark: "",
      created_by: ""
    });
    const dishInput = ref("");
    const dishList = ref([]);
    const editingMenuId = ref(null);
    function openMenuModal(mealType) {
      const existing = menuByType.value[mealType];
      editingMenuId.value = existing?.id ?? null;
      if (existing) {
        menuForm.value = {
          menu_date: existing.menu_date,
          meal_type: existing.meal_type,
          dishes: existing.dishes,
          calories: existing.calories,
          remark: existing.remark ?? "",
          created_by: ""
        };
        dishList.value = JSON.parse(existing.dishes);
      } else {
        menuForm.value = { menu_date: selectedDate.value, meal_type: mealType, dishes: "[]", calories: null, remark: "", created_by: "" };
        dishList.value = [];
      }
      dishInput.value = "";
      showMenuModal.value = true;
    }
    function addDish() {
      if (dishInput.value.trim()) {
        dishList.value.push(dishInput.value.trim());
        dishInput.value = "";
      }
    }
    function removeDish(idx) {
      dishList.value.splice(idx, 1);
    }
    async function saveMenu() {
      const payload = { ...menuForm.value, dishes: JSON.stringify(dishList.value) };
      if (editingMenuId.value) {
        await mealStore.updateMenu(editingMenuId.value, payload);
      } else {
        await mealStore.createMenu({ ...payload, deleted_at: null });
      }
      showMenuModal.value = false;
      await mealStore.fetchMenuByDate(selectedDate.value);
      message.success("菜单已保存");
    }
    const mealTypeMap = { breakfast: "早餐", lunch: "午餐", dinner: "晚餐" };
    const mealTypeOrder = ["breakfast", "lunch", "dinner"];
    const menuByType = computed(() => {
      const result = {};
      for (const t of mealTypeOrder) {
        result[t] = mealStore.menus.find((m) => m.meal_type === t);
      }
      return result;
    });
    const showMealRecordModal = ref(false);
    const recordBatch = ref([]);
    function openBatchRecord(mealType) {
      recordBatch.value = elderlyStore.list.filter((e) => e.status === "active").map((e) => ({ elderly_id: e.id, meal_type: mealType, status: "normal", intake_rate: 100, remark: "" }));
      showMealRecordModal.value = true;
    }
    async function saveBatchRecord() {
      const batchMealType = recordBatch.value[0]?.meal_type ?? "lunch";
      for (const r of recordBatch.value) {
        await mealStore.createRecord({ ...r, record_date: selectedDate.value, recorder: null, deleted_at: null });
      }
      showMealRecordModal.value = false;
      await mealStore.fetchRecordsByDate(selectedDate.value);
      message.success(`${mealTypeMap[batchMealType]}用餐记录已保存`);
    }
    const mealRecordColumns = [
      { title: "老人", key: "elderly_id", width: 100, render: (r) => elderlyStore.list.find((e) => e.id === r.elderly_id)?.name ?? r.elderly_id },
      { title: "餐次", key: "meal_type", width: 80, render: (r) => mealTypeMap[r.meal_type] ?? r.meal_type },
      { title: "状态", key: "status", width: 90, render: (r) => h(NTag, { type: { normal: "success", absent: "error", special: "warning" }[r.status] }, () => ({ normal: "正常", absent: "未用餐", special: "特殊饮食" })[r.status] ?? r.status) },
      { title: "进食率", key: "intake_rate", width: 80, render: (r) => `${r.intake_rate}%` },
      { title: "备注", key: "remark" }
    ];
    const statusOptions = [
      { label: "正常", value: "normal" },
      { label: "未用餐", value: "absent" },
      { label: "特殊饮食", value: "special" }
    ];
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), { title: "餐饮管理" }, {
        default: withCtx(() => [
          createVNode(unref(NCard), { class: "mb-4" }, {
            default: withCtx(() => [
              createVNode(unref(NSpace), { align: "center" }, {
                default: withCtx(() => [
                  _cache[14] || (_cache[14] = createBaseVNode("span", null, "日期：", -1)),
                  createVNode(unref(NDatePicker), {
                    "formatted-value": selectedDate.value,
                    "onUpdate:formattedValue": [
                      _cache[0] || (_cache[0] = ($event) => selectedDate.value = $event),
                      onDateChange
                    ],
                    "value-format": "yyyy-MM-dd HH:mm:ss",
                    type: "datetime",
                    style: { "width": "220px" }
                  }, null, 8, ["formatted-value"]),
                  createVNode(unref(Button), { onClick: onDateChange }, {
                    default: withCtx(() => [..._cache[12] || (_cache[12] = [
                      createTextVNode("查询", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    loading: unref(refreshing),
                    size: "small",
                    onClick: unref(refresh)
                  }, {
                    default: withCtx(() => [..._cache[13] || (_cache[13] = [
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
                name: "menu",
                tab: "今日菜单"
              }, {
                default: withCtx(() => [
                  createBaseVNode("div", _hoisted_1, [
                    (openBlock(), createElementBlock(Fragment, null, renderList(mealTypeOrder, (mealType) => {
                      return createVNode(unref(NCard), {
                        key: mealType,
                        title: mealTypeMap[mealType]
                      }, {
                        "header-extra": withCtx(() => [
                          createVNode(unref(Button), {
                            size: "small",
                            type: "primary",
                            onClick: ($event) => openMenuModal(mealType)
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(menuByType.value[mealType] ? "修改" : "录入") + "菜单 ", 1)
                            ]),
                            _: 2
                          }, 1032, ["onClick"])
                        ]),
                        default: withCtx(() => [
                          menuByType.value[mealType] ? (openBlock(), createElementBlock("div", _hoisted_2, [
                            (openBlock(true), createElementBlock(Fragment, null, renderList(JSON.parse(menuByType.value[mealType].dishes), (dish, idx) => {
                              return openBlock(), createElementBlock("div", {
                                key: idx,
                                class: "py-1 border-b border-gray-100 last:border-0"
                              }, toDisplayString(dish), 1);
                            }), 128)),
                            menuByType.value[mealType].calories ? (openBlock(), createElementBlock("div", _hoisted_3, "约 " + toDisplayString(menuByType.value[mealType].calories) + " 千卡", 1)) : createCommentVNode("", true)
                          ])) : (openBlock(), createElementBlock("div", _hoisted_4, "暂无菜单"))
                        ]),
                        _: 2
                      }, 1032, ["title"]);
                    }), 64))
                  ])
                ]),
                _: 1
              }),
              createVNode(unref(NTabPane), {
                name: "records",
                tab: "用餐记录"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    "header-extra": withCtx(() => [
                      createVNode(unref(NSpace), null, {
                        default: withCtx(() => [
                          createVNode(unref(Button), {
                            size: "small",
                            onClick: _cache[1] || (_cache[1] = ($event) => openBatchRecord("breakfast"))
                          }, {
                            default: withCtx(() => [..._cache[15] || (_cache[15] = [
                              createTextVNode("批量录入早餐", -1)
                            ])]),
                            _: 1
                          }),
                          createVNode(unref(Button), {
                            size: "small",
                            onClick: _cache[2] || (_cache[2] = ($event) => openBatchRecord("lunch"))
                          }, {
                            default: withCtx(() => [..._cache[16] || (_cache[16] = [
                              createTextVNode("批量录入午餐", -1)
                            ])]),
                            _: 1
                          }),
                          createVNode(unref(Button), {
                            size: "small",
                            onClick: _cache[3] || (_cache[3] = ($event) => openBatchRecord("dinner"))
                          }, {
                            default: withCtx(() => [..._cache[17] || (_cache[17] = [
                              createTextVNode("批量录入晚餐", -1)
                            ])]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$2), {
                        columns: mealRecordColumns,
                        data: unref(mealStore).records,
                        loading: unref(mealStore).loading,
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
          }),
          createVNode(unref(NModal), {
            show: showMenuModal.value,
            "onUpdate:show": _cache[9] || (_cache[9] = ($event) => showMenuModal.value = $event),
            title: `${mealTypeMap[menuForm.value.meal_type]}菜单`,
            preset: "card",
            style: { "width": "480px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[8] || (_cache[8] = ($event) => showMenuModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[19] || (_cache[19] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: saveMenu
                  }, {
                    default: withCtx(() => [..._cache[20] || (_cache[20] = [
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
                model: menuForm.value,
                "label-placement": "left",
                "label-width": "80"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), { label: "菜单日期" }, {
                    default: withCtx(() => [
                      createVNode(unref(NDatePicker), {
                        "formatted-value": menuForm.value.menu_date,
                        "onUpdate:formattedValue": _cache[4] || (_cache[4] = ($event) => menuForm.value.menu_date = $event),
                        "value-format": "yyyy-MM-dd HH:mm:ss",
                        type: "datetime",
                        style: { "width": "100%" }
                      }, null, 8, ["formatted-value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "添加菜品" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSpace), null, {
                        default: withCtx(() => [
                          createVNode(unref(NInput), {
                            value: dishInput.value,
                            "onUpdate:value": _cache[5] || (_cache[5] = ($event) => dishInput.value = $event),
                            placeholder: "输入菜品名称",
                            onKeydown: withKeys(addDish, ["enter"])
                          }, null, 8, ["value"]),
                          createVNode(unref(Button), { onClick: addDish }, {
                            default: withCtx(() => [..._cache[18] || (_cache[18] = [
                              createTextVNode("添加", -1)
                            ])]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "菜单" }, {
                    default: withCtx(() => [
                      createBaseVNode("div", _hoisted_5, [
                        (openBlock(true), createElementBlock(Fragment, null, renderList(dishList.value, (dish, idx) => {
                          return openBlock(), createBlock(unref(NTag), {
                            key: idx,
                            closable: "",
                            onClose: ($event) => removeDish(idx)
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(dish), 1)
                            ]),
                            _: 2
                          }, 1032, ["onClose"]);
                        }), 128)),
                        !dishList.value.length ? (openBlock(), createElementBlock("span", _hoisted_6, "暂无菜品")) : createCommentVNode("", true)
                      ])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "热量(千卡)" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInputNumber), {
                        value: menuForm.value.calories,
                        "onUpdate:value": _cache[6] || (_cache[6] = ($event) => menuForm.value.calories = $event),
                        min: 0
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "备注" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: menuForm.value.remark,
                        "onUpdate:value": _cache[7] || (_cache[7] = ($event) => menuForm.value.remark = $event)
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
            show: showMealRecordModal.value,
            "onUpdate:show": _cache[11] || (_cache[11] = ($event) => showMealRecordModal.value = $event),
            title: "批量录入用餐记录",
            preset: "card",
            style: { "width": "680px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[10] || (_cache[10] = ($event) => showMealRecordModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[22] || (_cache[22] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: saveBatchRecord
                  }, {
                    default: withCtx(() => [..._cache[23] || (_cache[23] = [
                      createTextVNode("批量保存", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createBaseVNode("div", _hoisted_7, [
                createBaseVNode("table", _hoisted_8, [
                  _cache[21] || (_cache[21] = createBaseVNode("thead", null, [
                    createBaseVNode("tr", { class: "bg-gray-50" }, [
                      createBaseVNode("th", { class: "p-2 text-left" }, "老人"),
                      createBaseVNode("th", { class: "p-2" }, "状态"),
                      createBaseVNode("th", { class: "p-2" }, "进食率(%)"),
                      createBaseVNode("th", { class: "p-2" }, "备注")
                    ])
                  ], -1)),
                  createBaseVNode("tbody", null, [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(recordBatch.value, (r, idx) => {
                      return openBlock(), createElementBlock("tr", {
                        key: idx,
                        class: "border-b"
                      }, [
                        createBaseVNode("td", _hoisted_9, toDisplayString(unref(elderlyStore).list.find((e) => e.id === r.elderly_id)?.name), 1),
                        createBaseVNode("td", _hoisted_10, [
                          createVNode(unref(NSelect), {
                            value: r.status,
                            "onUpdate:value": ($event) => r.status = $event,
                            options: statusOptions,
                            size: "small",
                            style: { "width": "110px" }
                          }, null, 8, ["value", "onUpdate:value"])
                        ]),
                        createBaseVNode("td", _hoisted_11, [
                          createVNode(unref(NInputNumber), {
                            value: r.intake_rate,
                            "onUpdate:value": ($event) => r.intake_rate = $event,
                            min: 0,
                            max: 100,
                            size: "small",
                            style: { "width": "90px" }
                          }, null, 8, ["value", "onUpdate:value"])
                        ]),
                        createBaseVNode("td", _hoisted_12, [
                          createVNode(unref(NInput), {
                            value: r.remark,
                            "onUpdate:value": ($event) => r.remark = $event,
                            size: "small",
                            placeholder: "备注"
                          }, null, 8, ["value", "onUpdate:value"])
                        ])
                      ]);
                    }), 128))
                  ])
                ])
              ])
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
