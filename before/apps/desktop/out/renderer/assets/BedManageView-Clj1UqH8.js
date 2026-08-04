import { _ as _sfc_main$2 } from "./BaseTable.vue_vue_type_script_setup_true_lang-Kf6svQhn.js";
import "./vendor-echarts-DEbY5nl3.js";
import { _ as _sfc_main$1 } from "./BasePage.vue_vue_type_script_setup_true_lang-CoKRdyPV.js";
import "./index-77IpmxCe.js";
import { u as useBuildingStore } from "./building.store-ZepJ20td.js";
import { u as usePageRefresh } from "./usePageRefresh-Wnx_lW1d.js";
import { u as useMessage, p as useDialog, M as NGi, g as NCard, P as NGrid, v as NSpace, B as Button, J as NSelect, j as NForm, k as NFormItem, l as NInput, S as NInputNumber, h as NModal, o as NTag } from "./vendor-naive-sdNTCZPI.js";
import { l as defineComponent, U as createBlock, W as withCtx, u as unref, V as openBlock, X as createVNode, a3 as createBaseVNode, a8 as toDisplayString, k as createTextVNode, r as ref, c as computed, q as h } from "./vendor-vue-Hc3ejqjp.js";
import "./vendor-query-CFvMrhIw.js";
import "./useAutoRefresh-BeuDS8Br.js";
const _hoisted_1 = { class: "text-center" };
const _hoisted_2 = { class: "text-2xl font-bold text-blue-600" };
const _hoisted_3 = { class: "text-center" };
const _hoisted_4 = { class: "text-2xl font-bold text-green-600" };
const _hoisted_5 = { class: "text-center" };
const _hoisted_6 = { class: "text-2xl font-bold text-orange-500" };
const _hoisted_7 = { class: "text-center" };
const _hoisted_8 = { class: "text-2xl font-bold text-red-500" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "BedManage" },
  __name: "BedManageView",
  setup(__props) {
    const store = useBuildingStore();
    const message = useMessage();
    const dialog = useDialog();
    async function loadData() {
      await store.fetchAll();
    }
    const { refresh, refreshing } = usePageRefresh(loadData);
    const selectedBuildingId = ref(null);
    const roomOptions = computed(
      () => store.rooms.map((r) => ({ label: `${r.room_no}（${r.floor}层）`, value: r.id }))
    );
    const buildingOptions = computed(
      () => store.buildings.map((b) => ({ label: b.name, value: b.id }))
    );
    const showBuildingModal = ref(false);
    const buildingForm = ref({ name: "", floors: 1, remark: "" });
    const editingBuildingId = ref(null);
    function openNewBuilding() {
      editingBuildingId.value = null;
      buildingForm.value = { name: "", floors: 1, remark: "" };
      showBuildingModal.value = true;
    }
    function openEditBuilding(row) {
      editingBuildingId.value = row.id;
      buildingForm.value = { name: row.name, floors: row.floors, remark: row.remark ?? "" };
      showBuildingModal.value = true;
    }
    const savingBuilding = ref(false);
    async function saveBuilding() {
      if (!buildingForm.value.name) return message.error("请填写楼栋名称");
      if (savingBuilding.value) return;
      savingBuilding.value = true;
      try {
        if (editingBuildingId.value) {
          await store.updateBuilding(editingBuildingId.value, { ...buildingForm.value });
        } else {
          await store.createBuilding({ ...buildingForm.value, sort_order: store.buildings.length });
        }
        showBuildingModal.value = false;
        message.success("保存成功");
        await refresh();
      } catch (err) {
        console.error("保存楼栋失败:", err);
        message.error(`保存失败：${err instanceof Error ? err.message : String(err)}`);
      } finally {
        savingBuilding.value = false;
      }
    }
    const buildingColumns = [
      { title: "楼栋名称", key: "name", width: 150 },
      { title: "楼层数", key: "floors", width: 100 },
      { title: "备注", key: "remark", ellipsis: { tooltip: true } },
      {
        title: "操作",
        key: "actions",
        width: 140,
        render: (row) => h(NSpace, null, {
          default: () => [
            h(Button, { size: "small", onClick: () => openEditBuilding(row) }, "编辑"),
            h(Button, { size: "small", type: "error", onClick: () => {
              dialog.warning({
                title: "确认删除",
                content: `确定删除楼栋 ${row.name}？`,
                positiveText: "确定",
                negativeText: "取消",
                onPositiveClick: async () => {
                  await store.deleteBuilding(row.id);
                  message.success("删除成功");
                  await refresh();
                }
              });
            } }, "删除")
          ]
        })
      }
    ];
    const showRoomModal = ref(false);
    const roomForm = ref({ building_id: "", floor: 1, room_no: "", room_type: "single", capacity: 1, price: 0, status: "available", remark: "" });
    const editingRoomId = ref(null);
    const filteredRooms = computed(
      () => selectedBuildingId.value ? store.rooms.filter((r) => r.building_id === selectedBuildingId.value) : store.rooms
    );
    function openNewRoom() {
      editingRoomId.value = null;
      roomForm.value = { building_id: selectedBuildingId.value ?? "", floor: 1, room_no: "", room_type: "single", capacity: 1, price: 0, status: "available", remark: "" };
      showRoomModal.value = true;
    }
    function openEditRoom(row) {
      editingRoomId.value = row.id;
      roomForm.value = { building_id: row.building_id, floor: row.floor, room_no: row.room_no, room_type: row.room_type, capacity: row.capacity, price: row.price, status: row.status, remark: row.remark ?? "" };
      showRoomModal.value = true;
    }
    const savingRoom = ref(false);
    async function saveRoom() {
      if (!roomForm.value.building_id) return message.error("请选择所在楼栋");
      if (!roomForm.value.floor && roomForm.value.floor !== 0) return message.error("请填写楼层");
      if (!roomForm.value.room_no) return message.error("请填写房间号");
      if (savingRoom.value) return;
      savingRoom.value = true;
      try {
        if (editingRoomId.value) {
          await store.updateRoom(editingRoomId.value, { ...roomForm.value });
        } else {
          await store.createRoom({ ...roomForm.value });
        }
        showRoomModal.value = false;
        message.success("保存成功");
        await refresh();
      } catch (err) {
        console.error("保存房间失败:", err);
        message.error(`保存失败：${err instanceof Error ? err.message : String(err)}`);
      } finally {
        savingRoom.value = false;
      }
    }
    const roomColumns = [
      { title: "房间号", key: "room_no", width: 100 },
      { title: "楼层", key: "floor", width: 80 },
      { title: "类型", key: "room_type", width: 100, render: (r) => ({ single: "单人间", double: "双人间", triple: "三人间", ward: "大间" })[r.room_type] ?? r.room_type },
      { title: "床位数", key: "capacity", width: 80 },
      { title: "月租金(元)", key: "price", width: 120 },
      { title: "状态", key: "status", width: 90, render: (r) => h(NTag, { type: { available: "success", occupied: "warning", maintenance: "error" }[r.status] }, () => ({ available: "空闲", occupied: "占用", maintenance: "维修" })[r.status]) },
      { title: "操作", key: "actions", width: 140, render: (r) => h(NSpace, null, { default: () => [h(Button, { size: "small", onClick: () => openEditRoom(r) }, "编辑"), h(Button, { size: "small", type: "error", onClick: () => {
        dialog.warning({ title: "删除", content: "确认删除？", positiveText: "确定", negativeText: "取消", onPositiveClick: async () => {
          await store.deleteRoom(r.id);
          message.success("删除成功");
          await refresh();
        } });
      } }, "删除")] }) }
    ];
    const showBedModal = ref(false);
    const bedForm = ref({ room_id: "", bed_no: "", status: "available", remark: "" });
    const editingBedId = ref(null);
    const filterRoomId = ref(null);
    const filteredBeds = computed(
      () => filterRoomId.value ? store.beds.filter((b) => b.room_id === filterRoomId.value) : store.beds
    );
    function openNewBed() {
      editingBedId.value = null;
      bedForm.value = { room_id: filterRoomId.value ?? "", bed_no: "", status: "available", remark: "" };
      showBedModal.value = true;
    }
    function openEditBed(row) {
      editingBedId.value = row.id;
      bedForm.value = { room_id: row.room_id, bed_no: row.bed_no, status: row.status, remark: row.remark ?? "" };
      showBedModal.value = true;
    }
    const savingBed = ref(false);
    async function saveBed() {
      if (!bedForm.value.room_id) return message.error("请选择所在房间");
      if (!bedForm.value.bed_no) return message.error("请填写床位号");
      if (savingBed.value) return;
      savingBed.value = true;
      try {
        if (editingBedId.value) {
          await store.updateBed(editingBedId.value, { ...bedForm.value });
        } else {
          await store.createBed({ ...bedForm.value, elderly_id: null });
        }
        showBedModal.value = false;
        message.success("保存成功");
        await refresh();
      } catch (err) {
        console.error("保存床位失败:", err);
        message.error(`保存失败：${err instanceof Error ? err.message : String(err)}`);
      } finally {
        savingBed.value = false;
      }
    }
    const bedColumns = [
      { title: "床位号", key: "bed_no", width: 100 },
      { title: "所在房间", key: "room_id", width: 120, render: (b) => store.rooms.find((r) => r.id === b.room_id)?.room_no ?? b.room_id },
      { title: "状态", key: "status", width: 90, render: (b) => h(NTag, { type: { available: "success", occupied: "warning", maintenance: "error" }[b.status] }, () => ({ available: "空闲", occupied: "占用", maintenance: "维修" })[b.status]) },
      { title: "备注", key: "remark" },
      { title: "操作", key: "actions", width: 140, render: (b) => h(NSpace, null, { default: () => [h(Button, { size: "small", onClick: () => openEditBed(b) }, "编辑"), h(Button, { size: "small", type: "error", onClick: () => {
        dialog.warning({ title: "删除", content: "确认删除？", positiveText: "确定", negativeText: "取消", onPositiveClick: async () => {
          await store.deleteBed(b.id);
          message.success("删除成功");
          await refresh();
        } });
      } }, "删除")] }) }
    ];
    const roomTypeOptions = [
      { label: "单人间", value: "single" },
      { label: "双人间", value: "double" },
      { label: "三人间", value: "triple" },
      { label: "大间/病房", value: "ward" }
    ];
    const statusOptions = [
      { label: "空闲", value: "available" },
      { label: "占用", value: "occupied" },
      { label: "维修中", value: "maintenance" }
    ];
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), { title: "床位管理" }, {
        default: withCtx(() => [
          createVNode(unref(NGrid), {
            "x-gap": 16,
            "y-gap": 16,
            cols: 4,
            class: "mb-4"
          }, {
            default: withCtx(() => [
              createVNode(unref(NGi), null, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    default: withCtx(() => [
                      createBaseVNode("div", _hoisted_1, [
                        createBaseVNode("div", _hoisted_2, toDisplayString(unref(store).bedStats.total), 1),
                        _cache[22] || (_cache[22] = createBaseVNode("div", { class: "text-gray-500 mt-1" }, "总床位", -1))
                      ])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(NGi), null, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    default: withCtx(() => [
                      createBaseVNode("div", _hoisted_3, [
                        createBaseVNode("div", _hoisted_4, toDisplayString(unref(store).bedStats.available), 1),
                        _cache[23] || (_cache[23] = createBaseVNode("div", { class: "text-gray-500 mt-1" }, "空闲", -1))
                      ])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(NGi), null, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    default: withCtx(() => [
                      createBaseVNode("div", _hoisted_5, [
                        createBaseVNode("div", _hoisted_6, toDisplayString(unref(store).bedStats.occupied), 1),
                        _cache[24] || (_cache[24] = createBaseVNode("div", { class: "text-gray-500 mt-1" }, "占用", -1))
                      ])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(NGi), null, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    default: withCtx(() => [
                      createBaseVNode("div", _hoisted_7, [
                        createBaseVNode("div", _hoisted_8, toDisplayString(unref(store).bedStats.maintenance), 1),
                        _cache[25] || (_cache[25] = createBaseVNode("div", { class: "text-gray-500 mt-1" }, "维修", -1))
                      ])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          createVNode(unref(NCard), {
            class: "mb-4",
            title: "楼栋管理"
          }, {
            "header-extra": withCtx(() => [
              createVNode(unref(NSpace), null, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    loading: unref(refreshing),
                    size: "small",
                    onClick: unref(refresh)
                  }, {
                    default: withCtx(() => [..._cache[26] || (_cache[26] = [
                      createTextVNode("刷新", -1)
                    ])]),
                    _: 1
                  }, 8, ["loading", "onClick"]),
                  createVNode(unref(Button), {
                    type: "primary",
                    size: "small",
                    onClick: openNewBuilding
                  }, {
                    default: withCtx(() => [..._cache[27] || (_cache[27] = [
                      createTextVNode("+ 新增楼栋", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(_sfc_main$2), {
                columns: buildingColumns,
                data: unref(store).buildings,
                loading: unref(store).loading,
                pagination: false
              }, null, 8, ["data", "loading"])
            ]),
            _: 1
          }),
          createVNode(unref(NCard), {
            class: "mb-4",
            title: "房间管理"
          }, {
            "header-extra": withCtx(() => [
              createVNode(unref(NSpace), null, {
                default: withCtx(() => [
                  createVNode(unref(NSelect), {
                    value: selectedBuildingId.value,
                    "onUpdate:value": _cache[0] || (_cache[0] = ($event) => selectedBuildingId.value = $event),
                    options: buildingOptions.value,
                    clearable: "",
                    placeholder: "筛选楼栋",
                    style: { "width": "150px" }
                  }, null, 8, ["value", "options"]),
                  createVNode(unref(Button), {
                    type: "primary",
                    size: "small",
                    onClick: openNewRoom
                  }, {
                    default: withCtx(() => [..._cache[28] || (_cache[28] = [
                      createTextVNode("+ 新增房间", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(_sfc_main$2), {
                columns: roomColumns,
                data: filteredRooms.value,
                loading: unref(store).loading,
                pagination: { pageSize: 10 }
              }, null, 8, ["data", "loading"])
            ]),
            _: 1
          }),
          createVNode(unref(NCard), { title: "床位管理" }, {
            "header-extra": withCtx(() => [
              createVNode(unref(NSpace), null, {
                default: withCtx(() => [
                  createVNode(unref(NSelect), {
                    value: filterRoomId.value,
                    "onUpdate:value": _cache[1] || (_cache[1] = ($event) => filterRoomId.value = $event),
                    options: roomOptions.value,
                    clearable: "",
                    placeholder: "筛选房间",
                    style: { "width": "180px" }
                  }, null, 8, ["value", "options"]),
                  createVNode(unref(Button), {
                    type: "primary",
                    size: "small",
                    onClick: openNewBed
                  }, {
                    default: withCtx(() => [..._cache[29] || (_cache[29] = [
                      createTextVNode("+ 新增床位", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(_sfc_main$2), {
                columns: bedColumns,
                data: filteredBeds.value,
                loading: unref(store).loading,
                pagination: { pageSize: 15 }
              }, null, 8, ["data", "loading"])
            ]),
            _: 1
          }),
          createVNode(unref(NModal), {
            show: showBuildingModal.value,
            "onUpdate:show": _cache[6] || (_cache[6] = ($event) => showBuildingModal.value = $event),
            title: "楼栋信息",
            preset: "card",
            style: { "width": "440px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[5] || (_cache[5] = ($event) => showBuildingModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[30] || (_cache[30] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    loading: savingBuilding.value,
                    onClick: saveBuilding
                  }, {
                    default: withCtx(() => [..._cache[31] || (_cache[31] = [
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
                model: buildingForm.value,
                "label-placement": "left",
                "label-width": "80"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), {
                    label: "楼栋名称",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: buildingForm.value.name,
                        "onUpdate:value": _cache[2] || (_cache[2] = ($event) => buildingForm.value.name = $event),
                        placeholder: "如：A栋"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "楼层数" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInputNumber), {
                        value: buildingForm.value.floors,
                        "onUpdate:value": _cache[3] || (_cache[3] = ($event) => buildingForm.value.floors = $event),
                        min: 1,
                        max: 50
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "备注" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: buildingForm.value.remark,
                        "onUpdate:value": _cache[4] || (_cache[4] = ($event) => buildingForm.value.remark = $event),
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
            show: showRoomModal.value,
            "onUpdate:show": _cache[15] || (_cache[15] = ($event) => showRoomModal.value = $event),
            title: "房间信息",
            preset: "card",
            style: { "width": "480px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[14] || (_cache[14] = ($event) => showRoomModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[32] || (_cache[32] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    loading: savingRoom.value,
                    onClick: saveRoom
                  }, {
                    default: withCtx(() => [..._cache[33] || (_cache[33] = [
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
                model: roomForm.value,
                "label-placement": "left",
                "label-width": "80"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), {
                    label: "所在楼栋",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: roomForm.value.building_id,
                        "onUpdate:value": _cache[7] || (_cache[7] = ($event) => roomForm.value.building_id = $event),
                        options: buildingOptions.value
                      }, null, 8, ["value", "options"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "楼层",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInputNumber), {
                        value: roomForm.value.floor,
                        "onUpdate:value": _cache[8] || (_cache[8] = ($event) => roomForm.value.floor = $event),
                        min: 1
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "房间号",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: roomForm.value.room_no,
                        "onUpdate:value": _cache[9] || (_cache[9] = ($event) => roomForm.value.room_no = $event),
                        placeholder: "如：101"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "房间类型" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: roomForm.value.room_type,
                        "onUpdate:value": _cache[10] || (_cache[10] = ($event) => roomForm.value.room_type = $event),
                        options: roomTypeOptions
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "床位数" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInputNumber), {
                        value: roomForm.value.capacity,
                        "onUpdate:value": _cache[11] || (_cache[11] = ($event) => roomForm.value.capacity = $event),
                        min: 1
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "月租金(元)" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInputNumber), {
                        value: roomForm.value.price,
                        "onUpdate:value": _cache[12] || (_cache[12] = ($event) => roomForm.value.price = $event),
                        min: 0,
                        precision: 2
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "状态" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: roomForm.value.status,
                        "onUpdate:value": _cache[13] || (_cache[13] = ($event) => roomForm.value.status = $event),
                        options: statusOptions
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
            show: showBedModal.value,
            "onUpdate:show": _cache[21] || (_cache[21] = ($event) => showBedModal.value = $event),
            title: "床位信息",
            preset: "card",
            style: { "width": "440px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[20] || (_cache[20] = ($event) => showBedModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[34] || (_cache[34] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    loading: savingBed.value,
                    onClick: saveBed
                  }, {
                    default: withCtx(() => [..._cache[35] || (_cache[35] = [
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
                model: bedForm.value,
                "label-placement": "left",
                "label-width": "80"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), {
                    label: "所在房间",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: bedForm.value.room_id,
                        "onUpdate:value": _cache[16] || (_cache[16] = ($event) => bedForm.value.room_id = $event),
                        options: roomOptions.value
                      }, null, 8, ["value", "options"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "床位号",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: bedForm.value.bed_no,
                        "onUpdate:value": _cache[17] || (_cache[17] = ($event) => bedForm.value.bed_no = $event),
                        placeholder: "如：A床"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "状态" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: bedForm.value.status,
                        "onUpdate:value": _cache[18] || (_cache[18] = ($event) => bedForm.value.status = $event),
                        options: statusOptions
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "备注" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: bedForm.value.remark,
                        "onUpdate:value": _cache[19] || (_cache[19] = ($event) => bedForm.value.remark = $event),
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
