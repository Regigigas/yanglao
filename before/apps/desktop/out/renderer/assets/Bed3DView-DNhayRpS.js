import { _ as _sfc_main$2 } from "./BaseTable.vue_vue_type_script_setup_true_lang-DzS_Zf-X.js";
import "./vendor-echarts-Bn4I93f0.js";
import { _ as _sfc_main$1 } from "./BasePage.vue_vue_type_script_setup_true_lang--gRmLkOT.js";
import "./index-Y_pGVxO7.js";
import { l as defineComponent, U as createBlock, W as withCtx, u as unref, V as openBlock, X as createVNode, a3 as createBaseVNode, k as createTextVNode, a2 as useRouter, r as ref, c as computed, q as h } from "./vendor-vue-C6_copC_.js";
import { B as Building3DViewer } from "./Building3DViewer-CyOVdDDA.js";
import { u as usePageRefresh } from "./usePageRefresh-C1gnRN9Y.js";
import { u as useBuildingStore } from "./building.store-DKypuXf4.js";
import { u as useMessage, p as useDialog, v as NSpace, J as NSelect, B as Button, P as NGrid, M as NGridItem, g as NCard, O as NStatistic, j as NForm, k as NFormItem, l as NInput, U as NInputNumber, m as NCheckbox, h as NModal, o as NTag } from "./vendor-naive-CeveemIE.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./vendor-query-DzdY0EvJ.js";
import "./index-C-8AyLEj.js";
import "./Cube-BnGD7jlY.js";
import "./useAutoRefresh-BeuDS8Br.js";
const _hoisted_1 = { class: "viewer-header" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "Bed3DView" },
  __name: "Bed3DView",
  setup(__props) {
    const store = useBuildingStore();
    const router = useRouter();
    const message = useMessage();
    const dialog = useDialog();
    const selectedBuildingId = ref(null);
    async function loadData() {
      await store.fetchAll();
      if (!selectedBuildingId.value && store.buildings.length) {
        selectedBuildingId.value = store.buildings[0].id;
      }
    }
    const { refresh, refreshing } = usePageRefresh(loadData);
    const buildingOptions = computed(
      () => store.buildings.map((item) => ({ label: item.name, value: item.id }))
    );
    const selectedRooms = computed(
      () => selectedBuildingId.value ? store.rooms.filter((item) => item.building_id === selectedBuildingId.value) : store.rooms
    );
    const selectedRoomIds = computed(() => new Set(selectedRooms.value.map((item) => item.id)));
    const selectedBeds = computed(
      () => store.beds.filter((item) => selectedRoomIds.value.has(item.room_id))
    );
    const availableBeds = computed(
      () => selectedBeds.value.filter((item) => item.status === "available").length
    );
    const occupiedBeds = computed(
      () => selectedBeds.value.filter((item) => item.status === "occupied").length
    );
    const maintenanceBeds = computed(
      () => selectedBeds.value.filter((item) => item.status === "maintenance").length
    );
    const showRoomTypeModal = ref(false);
    const editingRoomTypeId = ref(null);
    const savingRoomType = ref(false);
    const roomTypeForm = ref({
      code: "",
      name: "",
      default_capacity: 1,
      default_price: 0,
      area: null,
      has_window: 1,
      has_private_bathroom: 0,
      care_equipment: "",
      status: "active",
      remark: "",
      sort_order: 0
    });
    const roomTypeStatusOptions = [
      { label: "启用", value: "active" },
      { label: "停用", value: "inactive" }
    ];
    function resetRoomTypeForm() {
      editingRoomTypeId.value = null;
      roomTypeForm.value = {
        code: "",
        name: "",
        default_capacity: 1,
        default_price: 0,
        area: null,
        has_window: 1,
        has_private_bathroom: 0,
        care_equipment: "",
        status: "active",
        remark: "",
        sort_order: store.roomTypes.length + 1
      };
    }
    function openNewRoomType() {
      resetRoomTypeForm();
      showRoomTypeModal.value = true;
    }
    function openEditRoomType(row) {
      editingRoomTypeId.value = row.id;
      roomTypeForm.value = {
        code: row.code,
        name: row.name,
        default_capacity: row.default_capacity,
        default_price: row.default_price,
        area: row.area,
        has_window: row.has_window,
        has_private_bathroom: row.has_private_bathroom,
        care_equipment: row.care_equipment ?? "",
        status: row.status,
        remark: row.remark ?? "",
        sort_order: row.sort_order
      };
      showRoomTypeModal.value = true;
    }
    async function saveRoomType() {
      if (!roomTypeForm.value.name.trim()) return message.error("请填写房型名称");
      if (!roomTypeForm.value.code.trim()) return message.error("请填写房型编码");
      if (savingRoomType.value) return;
      savingRoomType.value = true;
      try {
        const payload = {
          ...roomTypeForm.value,
          code: roomTypeForm.value.code.trim(),
          name: roomTypeForm.value.name.trim(),
          care_equipment: roomTypeForm.value.care_equipment.trim() || null,
          remark: roomTypeForm.value.remark.trim() || null
        };
        if (editingRoomTypeId.value) await store.updateRoomType(editingRoomTypeId.value, payload);
        else await store.createRoomType(payload);
        showRoomTypeModal.value = false;
        message.success("房型已保存");
        await refresh();
      } catch (err) {
        message.error(`保存失败：${err instanceof Error ? err.message : String(err)}`);
      } finally {
        savingRoomType.value = false;
      }
    }
    const roomTypeColumns = [
      { title: "房型", key: "name", width: 130 },
      { title: "编码", key: "code", width: 110 },
      { title: "床位数", key: "default_capacity", width: 90 },
      { title: "默认价格", key: "default_price", width: 100 },
      { title: "面积", key: "area", width: 80, render: (row) => row.area ? `${row.area}㎡` : "-" },
      {
        title: "设施",
        key: "facility",
        render: (row) => [
          row.has_window ? "有窗" : "无窗",
          row.has_private_bathroom ? "独卫" : "公卫",
          row.care_equipment
        ].filter(Boolean).join(" / ")
      },
      {
        title: "状态",
        key: "status",
        width: 90,
        render: (row) => h(
          NTag,
          { type: row.status === "active" ? "success" : "default" },
          () => row.status === "active" ? "启用" : "停用"
        )
      },
      {
        title: "操作",
        key: "actions",
        width: 140,
        render: (row) => h(NSpace, null, {
          default: () => [
            h(Button, { size: "small", onClick: () => openEditRoomType(row) }, () => "编辑"),
            h(Button, {
              size: "small",
              type: "error",
              onClick: () => dialog.warning({
                title: "删除房型",
                content: `确定删除 ${row.name}？已引用的房间会保留文本类型，并解除房型引用。`,
                positiveText: "确定",
                negativeText: "取消",
                onPositiveClick: async () => {
                  await store.deleteRoomType(row.id);
                  message.success("删除成功");
                  await refresh();
                }
              })
            }, () => "删除")
          ]
        })
      }
    ];
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), { title: "床位三维图" }, {
        default: withCtx(() => [
          createVNode(unref(NSpace), {
            vertical: "",
            size: 16
          }, {
            default: withCtx(() => [
              createBaseVNode("div", _hoisted_1, [
                createVNode(unref(NSpace), {
                  align: "center",
                  wrap: ""
                }, {
                  default: withCtx(() => [
                    createVNode(unref(NSelect), {
                      value: selectedBuildingId.value,
                      "onUpdate:value": _cache[0] || (_cache[0] = ($event) => selectedBuildingId.value = $event),
                      options: buildingOptions.value,
                      clearable: "",
                      placeholder: "选择楼栋",
                      style: { "width": "220px" }
                    }, null, 8, ["value", "options"]),
                    createVNode(unref(Button), {
                      loading: unref(refreshing),
                      onClick: unref(refresh)
                    }, {
                      default: withCtx(() => [..._cache[16] || (_cache[16] = [
                        createTextVNode("刷新", -1)
                      ])]),
                      _: 1
                    }, 8, ["loading", "onClick"]),
                    createVNode(unref(Button), {
                      secondary: "",
                      type: "primary",
                      onClick: _cache[1] || (_cache[1] = ($event) => unref(router).push("/bed"))
                    }, {
                      default: withCtx(() => [..._cache[17] || (_cache[17] = [
                        createTextVNode("进入床位管理", -1)
                      ])]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              createVNode(unref(NGrid), {
                cols: 4,
                "x-gap": 12,
                "y-gap": 12,
                responsive: "screen"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NGridItem), null, {
                    default: withCtx(() => [
                      createVNode(unref(NCard), null, {
                        default: withCtx(() => [
                          createVNode(unref(NStatistic), {
                            label: "房间",
                            value: selectedRooms.value.length
                          }, null, 8, ["value"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NGridItem), null, {
                    default: withCtx(() => [
                      createVNode(unref(NCard), null, {
                        default: withCtx(() => [
                          createVNode(unref(NStatistic), {
                            label: "空闲床位",
                            value: availableBeds.value
                          }, null, 8, ["value"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NGridItem), null, {
                    default: withCtx(() => [
                      createVNode(unref(NCard), null, {
                        default: withCtx(() => [
                          createVNode(unref(NStatistic), {
                            label: "占用床位",
                            value: occupiedBeds.value
                          }, null, 8, ["value"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NGridItem), null, {
                    default: withCtx(() => [
                      createVNode(unref(NCard), null, {
                        default: withCtx(() => [
                          createVNode(unref(NStatistic), {
                            label: "维修床位",
                            value: maintenanceBeds.value
                          }, null, 8, ["value"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(Building3DViewer, {
                modelValue: selectedBuildingId.value,
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => selectedBuildingId.value = $event),
                buildings: unref(store).buildings,
                corridors: unref(store).corridors,
                rooms: unref(store).rooms,
                beds: unref(store).beds
              }, null, 8, ["modelValue", "buildings", "corridors", "rooms", "beds"]),
              createVNode(unref(NCard), { title: "房型配置" }, {
                default: withCtx(() => [
                  createVNode(unref(NSpace), {
                    vertical: "",
                    size: 12
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NSpace), {
                        justify: "space-between",
                        align: "center"
                      }, {
                        default: withCtx(() => [
                          _cache[19] || (_cache[19] = createBaseVNode("span", { class: "section-note" }, "维护单人间、双人间、护理房等房型，批量生成房间时会直接带入默认床位数和价格。", -1)),
                          createVNode(unref(Button), {
                            type: "primary",
                            onClick: openNewRoomType
                          }, {
                            default: withCtx(() => [..._cache[18] || (_cache[18] = [
                              createTextVNode("新增房型", -1)
                            ])]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$2), {
                        columns: roomTypeColumns,
                        data: unref(store).roomTypes,
                        loading: unref(store).loading,
                        pagination: { pageSize: 8 }
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
            show: showRoomTypeModal.value,
            "onUpdate:show": _cache[15] || (_cache[15] = ($event) => showRoomTypeModal.value = $event),
            preset: "card",
            title: "房型配置",
            style: { "width": "560px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[14] || (_cache[14] = ($event) => showRoomTypeModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[22] || (_cache[22] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    loading: savingRoomType.value,
                    onClick: saveRoomType
                  }, {
                    default: withCtx(() => [..._cache[23] || (_cache[23] = [
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
                model: roomTypeForm.value,
                "label-placement": "left",
                "label-width": "100"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NGrid), {
                    cols: 2,
                    "x-gap": 12
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NGridItem), null, {
                        default: withCtx(() => [
                          createVNode(unref(NFormItem), {
                            label: "房型名称",
                            required: ""
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(NInput), {
                                value: roomTypeForm.value.name,
                                "onUpdate:value": _cache[3] || (_cache[3] = ($event) => roomTypeForm.value.name = $event),
                                placeholder: "如 单人间"
                              }, null, 8, ["value"])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NGridItem), null, {
                        default: withCtx(() => [
                          createVNode(unref(NFormItem), {
                            label: "房型编码",
                            required: ""
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(NInput), {
                                value: roomTypeForm.value.code,
                                "onUpdate:value": _cache[4] || (_cache[4] = ($event) => roomTypeForm.value.code = $event),
                                placeholder: "如 single"
                              }, null, 8, ["value"])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NGridItem), null, {
                        default: withCtx(() => [
                          createVNode(unref(NFormItem), {
                            label: "默认床位",
                            required: ""
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(NInputNumber), {
                                value: roomTypeForm.value.default_capacity,
                                "onUpdate:value": _cache[5] || (_cache[5] = ($event) => roomTypeForm.value.default_capacity = $event),
                                min: 1
                              }, null, 8, ["value"])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NGridItem), null, {
                        default: withCtx(() => [
                          createVNode(unref(NFormItem), { label: "默认价格" }, {
                            default: withCtx(() => [
                              createVNode(unref(NInputNumber), {
                                value: roomTypeForm.value.default_price,
                                "onUpdate:value": _cache[6] || (_cache[6] = ($event) => roomTypeForm.value.default_price = $event),
                                min: 0
                              }, null, 8, ["value"])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NGridItem), null, {
                        default: withCtx(() => [
                          createVNode(unref(NFormItem), { label: "面积" }, {
                            default: withCtx(() => [
                              createVNode(unref(NInputNumber), {
                                value: roomTypeForm.value.area,
                                "onUpdate:value": _cache[7] || (_cache[7] = ($event) => roomTypeForm.value.area = $event),
                                min: 0,
                                clearable: ""
                              }, null, 8, ["value"])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NGridItem), null, {
                        default: withCtx(() => [
                          createVNode(unref(NFormItem), { label: "状态" }, {
                            default: withCtx(() => [
                              createVNode(unref(NSelect), {
                                value: roomTypeForm.value.status,
                                "onUpdate:value": _cache[8] || (_cache[8] = ($event) => roomTypeForm.value.status = $event),
                                options: roomTypeStatusOptions
                              }, null, 8, ["value"])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NGridItem), null, {
                        default: withCtx(() => [
                          createVNode(unref(NFormItem), { label: "设施" }, {
                            default: withCtx(() => [
                              createVNode(unref(NSpace), null, {
                                default: withCtx(() => [
                                  createVNode(unref(NCheckbox), {
                                    checked: roomTypeForm.value.has_window,
                                    "onUpdate:checked": _cache[9] || (_cache[9] = ($event) => roomTypeForm.value.has_window = $event),
                                    "checked-value": 1,
                                    "unchecked-value": 0
                                  }, {
                                    default: withCtx(() => [..._cache[20] || (_cache[20] = [
                                      createTextVNode("有窗", -1)
                                    ])]),
                                    _: 1
                                  }, 8, ["checked"]),
                                  createVNode(unref(NCheckbox), {
                                    checked: roomTypeForm.value.has_private_bathroom,
                                    "onUpdate:checked": _cache[10] || (_cache[10] = ($event) => roomTypeForm.value.has_private_bathroom = $event),
                                    "checked-value": 1,
                                    "unchecked-value": 0
                                  }, {
                                    default: withCtx(() => [..._cache[21] || (_cache[21] = [
                                      createTextVNode("独卫", -1)
                                    ])]),
                                    _: 1
                                  }, 8, ["checked"])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NGridItem), null, {
                        default: withCtx(() => [
                          createVNode(unref(NFormItem), { label: "排序" }, {
                            default: withCtx(() => [
                              createVNode(unref(NInputNumber), {
                                value: roomTypeForm.value.sort_order,
                                "onUpdate:value": _cache[11] || (_cache[11] = ($event) => roomTypeForm.value.sort_order = $event),
                                min: 0
                              }, null, 8, ["value"])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "护理设施" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: roomTypeForm.value.care_equipment,
                        "onUpdate:value": _cache[12] || (_cache[12] = ($event) => roomTypeForm.value.care_equipment = $event),
                        placeholder: "如 护理床、呼叫器"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "备注" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: roomTypeForm.value.remark,
                        "onUpdate:value": _cache[13] || (_cache[13] = ($event) => roomTypeForm.value.remark = $event),
                        type: "textarea"
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
const Bed3DView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-cbac0899"]]);
export {
  Bed3DView as default
};
