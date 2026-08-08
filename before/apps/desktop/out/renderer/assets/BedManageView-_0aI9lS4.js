import { _ as _sfc_main$2 } from "./BaseTable.vue_vue_type_script_setup_true_lang-DzS_Zf-X.js";
import "./vendor-echarts-Bn4I93f0.js";
import { _ as _sfc_main$1 } from "./BasePage.vue_vue_type_script_setup_true_lang--gRmLkOT.js";
import "./index-Y_pGVxO7.js";
import { u as usePageRefresh } from "./usePageRefresh-C1gnRN9Y.js";
import { u as useBuildingStore } from "./building.store-DKypuXf4.js";
import { B as Building3DViewer } from "./Building3DViewer-CyOVdDDA.js";
import { u as useMessage, p as useDialog, M as NGridItem, g as NCard, P as NGrid, S as NTabs, T as NTabPane, i as NAlert, j as NForm, k as NFormItem, J as NSelect, U as NInputNumber, l as NInput, m as NCheckbox, v as NSpace, B as Button, h as NModal, o as NTag } from "./vendor-naive-CeveemIE.js";
import { l as defineComponent, w as watch, U as createBlock, W as withCtx, u as unref, r as ref, V as openBlock, X as createVNode, a3 as createBaseVNode, a8 as toDisplayString, k as createTextVNode, c as computed, q as h } from "./vendor-vue-C6_copC_.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./vendor-query-DzdY0EvJ.js";
import "./useAutoRefresh-BeuDS8Br.js";
import "./index-C-8AyLEj.js";
import "./Cube-BnGD7jlY.js";
const _hoisted_1 = { class: "stat-card" };
const _hoisted_2 = { class: "stat-num text-blue-600" };
const _hoisted_3 = { class: "stat-card" };
const _hoisted_4 = { class: "stat-num text-green-600" };
const _hoisted_5 = { class: "stat-card" };
const _hoisted_6 = { class: "stat-num text-orange-500" };
const _hoisted_7 = { class: "stat-card" };
const _hoisted_8 = { class: "stat-num text-red-500" };
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
    const filterRoomId = ref(null);
    const buildingOptions = computed(
      () => store.buildings.map((item) => ({ label: item.name, value: item.id }))
    );
    const roomTypeOptions = computed(
      () => store.roomTypes.filter((item) => item.status === "active").map((item) => ({ label: `${item.name} (${item.default_capacity}床)`, value: item.id }))
    );
    const corridorOptions = computed(
      () => store.corridors.filter((item) => !selectedBuildingId.value || item.building_id === selectedBuildingId.value).map((item) => ({ label: `${buildingName(item.building_id)} ${item.floor}F · ${item.name}`, value: item.id }))
    );
    const roomOptions = computed(
      () => store.rooms.map((item) => ({ label: `${roomLabel(item)} (${item.floor}层)`, value: item.id }))
    );
    const filteredRooms = computed(
      () => selectedBuildingId.value ? store.rooms.filter((item) => item.building_id === selectedBuildingId.value) : store.rooms
    );
    const filteredBeds = computed(
      () => filterRoomId.value ? store.beds.filter((item) => item.room_id === filterRoomId.value) : store.beds
    );
    const statusOptions = [
      { label: "空闲", value: "available" },
      { label: "占用", value: "occupied" },
      { label: "维修中", value: "maintenance" }
    ];
    const layoutSideOptions = [
      { label: "不区分", value: "none" },
      { label: "左侧", value: "left" },
      { label: "右侧", value: "right" }
    ];
    const generateSideOptions = [
      { label: "不区分", value: "none" },
      { label: "左侧", value: "left" },
      { label: "右侧", value: "right" },
      { label: "左右两侧", value: "both" }
    ];
    const directionOptions = [
      { label: "东西向", value: "east_west" },
      { label: "南北向", value: "north_south" }
    ];
    const roomStatusMap = {
      available: { label: "空闲", type: "success" },
      occupied: { label: "占用", type: "warning" },
      maintenance: { label: "维修", type: "error" }
    };
    function buildingName(id) {
      return store.buildings.find((item) => item.id === id)?.name ?? id;
    }
    function roomTypeName(room) {
      return store.roomTypes.find((item) => item.id === room.room_type_id)?.name ?? ({ single: "单人间", double: "双人间", triple: "三人间", ward: "多人间/病房" }[room.room_type] ?? room.room_type);
    }
    function corridorName(id) {
      if (!id) return "未分区";
      const corridor = store.corridors.find((item) => item.id === id);
      return corridor ? `${corridor.floor}F · ${corridor.name}` : "未分区";
    }
    function roomLabel(room) {
      const building = store.buildings.find((item) => item.id === room.building_id)?.name;
      return `${building ? `${building} ` : ""}${room.room_no}`;
    }
    function applyRoomTypeToRoomForm(roomTypeId) {
      const type = store.roomTypes.find((item) => item.id === roomTypeId);
      if (!type) return;
      roomForm.value.room_type_id = type.id;
      roomForm.value.room_type = type.code;
      roomForm.value.capacity = type.default_capacity;
      roomForm.value.price = type.default_price;
    }
    function applyRoomTypeToGenerate(roomTypeId) {
      const type = store.roomTypes.find((item) => item.id === roomTypeId);
      if (!type) return;
      generateForm.value.room_type_id = type.id;
      generateForm.value.room_type = type.code;
      generateForm.value.capacity = type.default_capacity;
      generateForm.value.price = type.default_price;
    }
    const showBuildingModal = ref(false);
    const buildingForm = ref({ name: "", floors: 1, remark: "" });
    const editingBuildingId = ref(null);
    const savingBuilding = ref(false);
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
    async function saveBuilding() {
      if (!buildingForm.value.name.trim()) return message.error("请填写楼栋名称");
      if (savingBuilding.value) return;
      savingBuilding.value = true;
      try {
        if (editingBuildingId.value) {
          await store.updateBuilding(editingBuildingId.value, { ...buildingForm.value, name: buildingForm.value.name.trim() });
        } else {
          await store.createBuilding({ ...buildingForm.value, name: buildingForm.value.name.trim(), sort_order: store.buildings.length });
        }
        showBuildingModal.value = false;
        message.success("保存成功");
        await refresh();
      } catch (err) {
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
            h(Button, {
              size: "small",
              type: "error",
              onClick: () => dialog.warning({
                title: "确认删除",
                content: `确定删除楼栋 ${row.name}？已有房间不会被物理删除，但会失去楼栋入口。`,
                positiveText: "确定",
                negativeText: "取消",
                onPositiveClick: async () => {
                  await store.deleteBuilding(row.id);
                  message.success("删除成功");
                  await refresh();
                }
              })
            }, "删除")
          ]
        })
      }
    ];
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
    function openNewRoomType() {
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
        message.success("保存成功");
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
      { title: "默认床位", key: "default_capacity", width: 90 },
      { title: "默认价格", key: "default_price", width: 100 },
      { title: "面积", key: "area", width: 80, render: (row) => row.area ? `${row.area}㎡` : "—" },
      { title: "设施", key: "facility", render: (row) => [row.has_window ? "有窗" : "无窗", row.has_private_bathroom ? "独卫" : "公卫", row.care_equipment].filter(Boolean).join(" / ") },
      { title: "状态", key: "status", width: 90, render: (row) => h(NTag, { type: row.status === "active" ? "success" : "default" }, () => row.status === "active" ? "启用" : "停用") },
      {
        title: "操作",
        key: "actions",
        width: 140,
        render: (row) => h(NSpace, null, {
          default: () => [
            h(Button, { size: "small", onClick: () => openEditRoomType(row) }, "编辑"),
            h(Button, {
              size: "small",
              type: "error",
              onClick: () => dialog.warning({
                title: "删除房型",
                content: `确定删除 ${row.name}？已引用房间会保留文本类型，并解除房型引用。`,
                positiveText: "确定",
                negativeText: "取消",
                onPositiveClick: async () => {
                  await store.deleteRoomType(row.id);
                  message.success("删除成功");
                  await refresh();
                }
              })
            }, "删除")
          ]
        })
      }
    ];
    const showCorridorModal = ref(false);
    const editingCorridorId = ref(null);
    const savingCorridor = ref(false);
    const corridorForm = ref({
      building_id: "",
      floor: 1,
      name: "",
      direction: "east_west",
      sort_order: 0,
      remark: ""
    });
    function openNewCorridor() {
      editingCorridorId.value = null;
      corridorForm.value = {
        building_id: selectedBuildingId.value ?? store.buildings[0]?.id ?? "",
        floor: 1,
        name: "",
        direction: "east_west",
        sort_order: store.corridors.length + 1,
        remark: ""
      };
      showCorridorModal.value = true;
    }
    function openEditCorridor(row) {
      editingCorridorId.value = row.id;
      corridorForm.value = {
        building_id: row.building_id,
        floor: row.floor,
        name: row.name,
        direction: row.direction,
        sort_order: row.sort_order,
        remark: row.remark ?? ""
      };
      showCorridorModal.value = true;
    }
    async function saveCorridor() {
      if (!corridorForm.value.building_id) return message.error("请选择所在楼栋");
      if (!corridorForm.value.name.trim()) return message.error("请填写走廊/分区名称");
      if (savingCorridor.value) return;
      savingCorridor.value = true;
      try {
        const payload = { ...corridorForm.value, name: corridorForm.value.name.trim(), remark: corridorForm.value.remark.trim() || null };
        if (editingCorridorId.value) await store.updateCorridor(editingCorridorId.value, payload);
        else await store.createCorridor(payload);
        showCorridorModal.value = false;
        message.success("保存成功");
        await refresh();
      } catch (err) {
        message.error(`保存失败：${err instanceof Error ? err.message : String(err)}`);
      } finally {
        savingCorridor.value = false;
      }
    }
    const corridorColumns = [
      { title: "楼栋", key: "building_id", width: 120, render: (row) => buildingName(row.building_id) },
      { title: "楼层", key: "floor", width: 80 },
      { title: "走廊/分区", key: "name", width: 140 },
      { title: "方向", key: "direction", width: 90, render: (row) => row.direction === "east_west" ? "东西向" : "南北向" },
      { title: "排序", key: "sort_order", width: 80 },
      { title: "备注", key: "remark", ellipsis: { tooltip: true } },
      {
        title: "操作",
        key: "actions",
        width: 140,
        render: (row) => h(NSpace, null, {
          default: () => [
            h(Button, { size: "small", onClick: () => openEditCorridor(row) }, "编辑"),
            h(Button, {
              size: "small",
              type: "error",
              onClick: () => dialog.warning({
                title: "删除走廊/分区",
                content: "确定删除？已关联房间会自动移到未分区。",
                positiveText: "确定",
                negativeText: "取消",
                onPositiveClick: async () => {
                  await store.deleteCorridor(row.id);
                  message.success("删除成功");
                  await refresh();
                }
              })
            }, "删除")
          ]
        })
      }
    ];
    const showRoomModal = ref(false);
    const editingRoomId = ref(null);
    const savingRoom = ref(false);
    const roomForm = ref({
      building_id: "",
      floor: 1,
      corridor_id: null,
      room_no: "",
      room_type: "single",
      room_type_id: null,
      capacity: 1,
      price: 0,
      status: "available",
      layout_side: "none",
      sort_order: 0,
      remark: ""
    });
    function openNewRoom() {
      editingRoomId.value = null;
      const type = store.roomTypes.find((item) => item.status === "active");
      roomForm.value = {
        building_id: selectedBuildingId.value ?? store.buildings[0]?.id ?? "",
        floor: 1,
        corridor_id: null,
        room_no: "",
        room_type: type?.code ?? "single",
        room_type_id: type?.id ?? null,
        capacity: type?.default_capacity ?? 1,
        price: type?.default_price ?? 0,
        status: "available",
        layout_side: "none",
        sort_order: 0,
        remark: ""
      };
      showRoomModal.value = true;
    }
    function openEditRoom(row) {
      editingRoomId.value = row.id;
      roomForm.value = {
        building_id: row.building_id,
        floor: row.floor,
        corridor_id: row.corridor_id,
        room_no: row.room_no,
        room_type: row.room_type,
        room_type_id: row.room_type_id,
        capacity: row.capacity,
        price: row.price,
        status: row.status,
        layout_side: row.layout_side,
        sort_order: row.sort_order,
        remark: row.remark ?? ""
      };
      showRoomModal.value = true;
    }
    async function saveRoom() {
      if (!roomForm.value.building_id) return message.error("请选择所在楼栋");
      if (!roomForm.value.room_no.trim()) return message.error("请填写房间号");
      if (savingRoom.value) return;
      savingRoom.value = true;
      try {
        const payload = { ...roomForm.value, room_no: roomForm.value.room_no.trim(), remark: roomForm.value.remark.trim() || null };
        if (editingRoomId.value) await store.updateRoom(editingRoomId.value, payload);
        else await store.createRoom(payload);
        showRoomModal.value = false;
        message.success("保存成功");
        await refresh();
      } catch (err) {
        message.error(`保存失败：${err instanceof Error ? err.message : String(err)}`);
      } finally {
        savingRoom.value = false;
      }
    }
    const roomColumns = [
      { title: "房间号", key: "room_no", width: 100 },
      { title: "楼栋", key: "building_id", width: 110, render: (row) => buildingName(row.building_id) },
      { title: "楼层", key: "floor", width: 70 },
      { title: "走廊/分区", key: "corridor_id", width: 130, render: (row) => corridorName(row.corridor_id) },
      { title: "侧位", key: "layout_side", width: 70, render: (row) => ({ left: "左侧", right: "右侧", none: "—" })[row.layout_side] },
      { title: "房型", key: "room_type", width: 120, render: (row) => roomTypeName(row) },
      { title: "床位数", key: "capacity", width: 80 },
      { title: "月租金", key: "price", width: 100 },
      { title: "状态", key: "status", width: 90, render: (row) => h(NTag, { type: roomStatusMap[row.status].type }, () => roomStatusMap[row.status].label) },
      {
        title: "操作",
        key: "actions",
        width: 140,
        render: (row) => h(NSpace, null, {
          default: () => [
            h(Button, { size: "small", onClick: () => openEditRoom(row) }, "编辑"),
            h(Button, {
              size: "small",
              type: "error",
              onClick: () => dialog.warning({
                title: "删除房间",
                content: "确认删除？房间下床位不会被自动删除，请先确认入住联动。",
                positiveText: "确定",
                negativeText: "取消",
                onPositiveClick: async () => {
                  await store.deleteRoom(row.id);
                  message.success("删除成功");
                  await refresh();
                }
              })
            }, "删除")
          ]
        })
      }
    ];
    const showBedModal = ref(false);
    const editingBedId = ref(null);
    const savingBed = ref(false);
    const bedForm = ref({ room_id: "", bed_no: "", status: "available", remark: "" });
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
    async function saveBed() {
      if (!bedForm.value.room_id) return message.error("请选择所在房间");
      if (!bedForm.value.bed_no.trim()) return message.error("请填写床位号");
      if (savingBed.value) return;
      savingBed.value = true;
      try {
        const payload = { ...bedForm.value, bed_no: bedForm.value.bed_no.trim(), remark: bedForm.value.remark.trim() || null };
        if (editingBedId.value) await store.updateBed(editingBedId.value, payload);
        else await store.createBed({ ...payload, elderly_id: null });
        showBedModal.value = false;
        message.success("保存成功");
        await refresh();
      } catch (err) {
        message.error(`保存失败：${err instanceof Error ? err.message : String(err)}`);
      } finally {
        savingBed.value = false;
      }
    }
    const bedColumns = [
      { title: "床位号", key: "bed_no", width: 100 },
      { title: "所在房间", key: "room_id", width: 160, render: (row) => {
        const room = store.rooms.find((item) => item.id === row.room_id);
        return room ? roomLabel(room) : row.room_id;
      } },
      { title: "状态", key: "status", width: 90, render: (row) => h(NTag, { type: roomStatusMap[row.status].type }, () => roomStatusMap[row.status].label) },
      { title: "备注", key: "remark", ellipsis: { tooltip: true } },
      {
        title: "操作",
        key: "actions",
        width: 140,
        render: (row) => h(NSpace, null, {
          default: () => [
            h(Button, { size: "small", onClick: () => openEditBed(row) }, "编辑"),
            h(Button, {
              size: "small",
              type: "error",
              disabled: row.status === "occupied",
              onClick: () => dialog.warning({
                title: "删除床位",
                content: "确认删除？已入住床位不能删除。",
                positiveText: "确定",
                negativeText: "取消",
                onPositiveClick: async () => {
                  await store.deleteBed(row.id);
                  message.success("删除成功");
                  await refresh();
                }
              })
            }, "删除")
          ]
        })
      }
    ];
    const generating = ref(false);
    const generateForm = ref({
      building_id: "",
      floor: 1,
      corridor_id: null,
      side: "both",
      start_no: 101,
      room_count: 6,
      room_prefix: "",
      room_suffix: "",
      number_width: 3,
      room_type_id: null,
      room_type: "single",
      capacity: 1,
      price: 0,
      bed_prefix: "",
      bed_style: "letter",
      skip_existing: true
    });
    watch(() => generateForm.value.building_id, (buildingId) => {
      if (selectedBuildingId.value !== buildingId) selectedBuildingId.value = buildingId || null;
    });
    function openGenerateDefaults() {
      const type = store.roomTypes.find((item) => item.status === "active");
      generateForm.value = {
        building_id: selectedBuildingId.value ?? store.buildings[0]?.id ?? "",
        floor: 1,
        corridor_id: null,
        side: "both",
        start_no: 101,
        room_count: 6,
        room_prefix: "",
        room_suffix: "",
        number_width: 3,
        room_type_id: type?.id ?? null,
        room_type: type?.code ?? "single",
        capacity: type?.default_capacity ?? 1,
        price: type?.default_price ?? 0,
        bed_prefix: "",
        bed_style: "letter",
        skip_existing: true
      };
    }
    async function generateRooms() {
      if (!generateForm.value.building_id) return message.error("请选择楼栋");
      if (generateForm.value.room_count < 1) return message.error("请填写生成房间数");
      if (generateForm.value.capacity < 1) return message.error("床位数至少为 1");
      generating.value = true;
      try {
        const result = await store.generateRooms({ ...generateForm.value });
        message.success(`已生成 ${result.rooms.length} 间房、${result.beds.length} 张床${result.skipped.length ? `，跳过 ${result.skipped.length} 间` : ""}`);
        await refresh();
      } catch (err) {
        message.error(`生成失败：${err instanceof Error ? err.message : String(err)}`);
      } finally {
        generating.value = false;
      }
    }
    openGenerateDefaults();
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
              createVNode(unref(NGridItem), null, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    default: withCtx(() => [
                      createBaseVNode("div", _hoisted_1, [
                        createBaseVNode("div", _hoisted_2, toDisplayString(unref(store).bedStats.total), 1),
                        _cache[63] || (_cache[63] = createBaseVNode("div", { class: "stat-label" }, "总床位", -1))
                      ])
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
                      createBaseVNode("div", _hoisted_3, [
                        createBaseVNode("div", _hoisted_4, toDisplayString(unref(store).bedStats.available), 1),
                        _cache[64] || (_cache[64] = createBaseVNode("div", { class: "stat-label" }, "空闲", -1))
                      ])
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
                      createBaseVNode("div", _hoisted_5, [
                        createBaseVNode("div", _hoisted_6, toDisplayString(unref(store).bedStats.occupied), 1),
                        _cache[65] || (_cache[65] = createBaseVNode("div", { class: "stat-label" }, "占用", -1))
                      ])
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
                      createBaseVNode("div", _hoisted_7, [
                        createBaseVNode("div", _hoisted_8, toDisplayString(unref(store).bedStats.maintenance), 1),
                        _cache[66] || (_cache[66] = createBaseVNode("div", { class: "stat-label" }, "维修", -1))
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
            title: "3D 楼栋床位总览"
          }, {
            default: withCtx(() => [
              createVNode(Building3DViewer, {
                modelValue: selectedBuildingId.value,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => selectedBuildingId.value = $event),
                buildings: unref(store).buildings,
                corridors: unref(store).corridors,
                rooms: unref(store).rooms,
                beds: unref(store).beds
              }, null, 8, ["modelValue", "buildings", "corridors", "rooms", "beds"])
            ]),
            _: 1
          }),
          createVNode(unref(NCard), null, {
            default: withCtx(() => [
              createVNode(unref(NTabs), {
                type: "line",
                animated: ""
              }, {
                default: withCtx(() => [
                  createVNode(unref(NTabPane), {
                    name: "layout",
                    tab: "批量生成"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NAlert), {
                        type: "info",
                        class: "mb-4"
                      }, {
                        default: withCtx(() => [..._cache[67] || (_cache[67] = [
                          createTextVNode(" 先建楼栋、房型和走廊/分区，再用规则生成房间和床位。生成过程只新增数据，不会覆盖已有入住床位。 ", -1)
                        ])]),
                        _: 1
                      }),
                      createVNode(unref(NForm), {
                        model: generateForm.value,
                        "label-placement": "left",
                        "label-width": "110"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(NGrid), {
                            cols: 3,
                            "x-gap": 16
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(NGridItem), null, {
                                default: withCtx(() => [
                                  createVNode(unref(NFormItem), {
                                    label: "楼栋",
                                    required: ""
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(NSelect), {
                                        value: generateForm.value.building_id,
                                        "onUpdate:value": _cache[1] || (_cache[1] = ($event) => generateForm.value.building_id = $event),
                                        options: buildingOptions.value
                                      }, null, 8, ["value", "options"])
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(unref(NGridItem), null, {
                                default: withCtx(() => [
                                  createVNode(unref(NFormItem), {
                                    label: "楼层",
                                    required: ""
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(NInputNumber), {
                                        value: generateForm.value.floor,
                                        "onUpdate:value": _cache[2] || (_cache[2] = ($event) => generateForm.value.floor = $event),
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
                                  createVNode(unref(NFormItem), { label: "走廊/分区" }, {
                                    default: withCtx(() => [
                                      createVNode(unref(NSelect), {
                                        value: generateForm.value.corridor_id,
                                        "onUpdate:value": _cache[3] || (_cache[3] = ($event) => generateForm.value.corridor_id = $event),
                                        options: corridorOptions.value,
                                        clearable: ""
                                      }, null, 8, ["value", "options"])
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(unref(NGridItem), null, {
                                default: withCtx(() => [
                                  createVNode(unref(NFormItem), { label: "生成侧位" }, {
                                    default: withCtx(() => [
                                      createVNode(unref(NSelect), {
                                        value: generateForm.value.side,
                                        "onUpdate:value": _cache[4] || (_cache[4] = ($event) => generateForm.value.side = $event),
                                        options: generateSideOptions
                                      }, null, 8, ["value"])
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(unref(NGridItem), null, {
                                default: withCtx(() => [
                                  createVNode(unref(NFormItem), { label: "起始房号" }, {
                                    default: withCtx(() => [
                                      createVNode(unref(NInputNumber), {
                                        value: generateForm.value.start_no,
                                        "onUpdate:value": _cache[5] || (_cache[5] = ($event) => generateForm.value.start_no = $event),
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
                                  createVNode(unref(NFormItem), { label: "每侧房间数" }, {
                                    default: withCtx(() => [
                                      createVNode(unref(NInputNumber), {
                                        value: generateForm.value.room_count,
                                        "onUpdate:value": _cache[6] || (_cache[6] = ($event) => generateForm.value.room_count = $event),
                                        min: 1,
                                        max: 200
                                      }, null, 8, ["value"])
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(unref(NGridItem), null, {
                                default: withCtx(() => [
                                  createVNode(unref(NFormItem), { label: "房号前缀" }, {
                                    default: withCtx(() => [
                                      createVNode(unref(NInput), {
                                        value: generateForm.value.room_prefix,
                                        "onUpdate:value": _cache[7] || (_cache[7] = ($event) => generateForm.value.room_prefix = $event),
                                        placeholder: "如 A-"
                                      }, null, 8, ["value"])
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(unref(NGridItem), null, {
                                default: withCtx(() => [
                                  createVNode(unref(NFormItem), { label: "数字位数" }, {
                                    default: withCtx(() => [
                                      createVNode(unref(NInputNumber), {
                                        value: generateForm.value.number_width,
                                        "onUpdate:value": _cache[8] || (_cache[8] = ($event) => generateForm.value.number_width = $event),
                                        min: 1,
                                        max: 6
                                      }, null, 8, ["value"])
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(unref(NGridItem), null, {
                                default: withCtx(() => [
                                  createVNode(unref(NFormItem), { label: "房号后缀" }, {
                                    default: withCtx(() => [
                                      createVNode(unref(NInput), {
                                        value: generateForm.value.room_suffix,
                                        "onUpdate:value": _cache[9] || (_cache[9] = ($event) => generateForm.value.room_suffix = $event),
                                        placeholder: "可不填"
                                      }, null, 8, ["value"])
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(unref(NGridItem), null, {
                                default: withCtx(() => [
                                  createVNode(unref(NFormItem), { label: "房型" }, {
                                    default: withCtx(() => [
                                      createVNode(unref(NSelect), {
                                        value: generateForm.value.room_type_id,
                                        "onUpdate:value": [
                                          _cache[10] || (_cache[10] = ($event) => generateForm.value.room_type_id = $event),
                                          applyRoomTypeToGenerate
                                        ],
                                        options: roomTypeOptions.value,
                                        clearable: ""
                                      }, null, 8, ["value", "options"])
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(unref(NGridItem), null, {
                                default: withCtx(() => [
                                  createVNode(unref(NFormItem), { label: "床位数" }, {
                                    default: withCtx(() => [
                                      createVNode(unref(NInputNumber), {
                                        value: generateForm.value.capacity,
                                        "onUpdate:value": _cache[11] || (_cache[11] = ($event) => generateForm.value.capacity = $event),
                                        min: 1,
                                        max: 20
                                      }, null, 8, ["value"])
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(unref(NGridItem), null, {
                                default: withCtx(() => [
                                  createVNode(unref(NFormItem), { label: "月租金" }, {
                                    default: withCtx(() => [
                                      createVNode(unref(NInputNumber), {
                                        value: generateForm.value.price,
                                        "onUpdate:value": _cache[12] || (_cache[12] = ($event) => generateForm.value.price = $event),
                                        min: 0,
                                        precision: 2
                                      }, null, 8, ["value"])
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(unref(NGridItem), null, {
                                default: withCtx(() => [
                                  createVNode(unref(NFormItem), { label: "床位前缀" }, {
                                    default: withCtx(() => [
                                      createVNode(unref(NInput), {
                                        value: generateForm.value.bed_prefix,
                                        "onUpdate:value": _cache[13] || (_cache[13] = ($event) => generateForm.value.bed_prefix = $event),
                                        placeholder: "如 床"
                                      }, null, 8, ["value"])
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(unref(NGridItem), null, {
                                default: withCtx(() => [
                                  createVNode(unref(NFormItem), { label: "床位编号" }, {
                                    default: withCtx(() => [
                                      createVNode(unref(NSelect), {
                                        value: generateForm.value.bed_style,
                                        "onUpdate:value": _cache[14] || (_cache[14] = ($event) => generateForm.value.bed_style = $event),
                                        options: [{ label: "A/B/C", value: "letter" }, { label: "1/2/3", value: "number" }]
                                      }, null, 8, ["value"])
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(unref(NGridItem), null, {
                                default: withCtx(() => [
                                  createVNode(unref(NFormItem), { label: "重复房号" }, {
                                    default: withCtx(() => [
                                      createVNode(unref(NCheckbox), {
                                        checked: generateForm.value.skip_existing,
                                        "onUpdate:checked": _cache[15] || (_cache[15] = ($event) => generateForm.value.skip_existing = $event)
                                      }, {
                                        default: withCtx(() => [..._cache[68] || (_cache[68] = [
                                          createTextVNode("自动跳过", -1)
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
                          createVNode(unref(NSpace), { justify: "end" }, {
                            default: withCtx(() => [
                              createVNode(unref(Button), { onClick: openGenerateDefaults }, {
                                default: withCtx(() => [..._cache[69] || (_cache[69] = [
                                  createTextVNode("重置", -1)
                                ])]),
                                _: 1
                              }),
                              createVNode(unref(Button), {
                                type: "primary",
                                loading: generating.value,
                                onClick: generateRooms
                              }, {
                                default: withCtx(() => [..._cache[70] || (_cache[70] = [
                                  createTextVNode("生成房间和床位", -1)
                                ])]),
                                _: 1
                              }, 8, ["loading"])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }, 8, ["model"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NTabPane), {
                    name: "room-types",
                    tab: "房型配置"
                  }, {
                    tab: withCtx(() => [..._cache[71] || (_cache[71] = [
                      createTextVNode("房型配置", -1)
                    ])]),
                    default: withCtx(() => [
                      createVNode(unref(NSpace), {
                        justify: "end",
                        class: "mb-3"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Button), {
                            type: "primary",
                            size: "small",
                            onClick: openNewRoomType
                          }, {
                            default: withCtx(() => [..._cache[72] || (_cache[72] = [
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
                        pagination: { pageSize: 10 }
                      }, null, 8, ["data", "loading"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NTabPane), {
                    name: "corridors",
                    tab: "走廊分区"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NSpace), {
                        justify: "space-between",
                        class: "mb-3"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(NSelect), {
                            value: selectedBuildingId.value,
                            "onUpdate:value": _cache[16] || (_cache[16] = ($event) => selectedBuildingId.value = $event),
                            options: buildingOptions.value,
                            clearable: "",
                            placeholder: "筛选楼栋",
                            style: { "width": "180px" }
                          }, null, 8, ["value", "options"]),
                          createVNode(unref(Button), {
                            type: "primary",
                            size: "small",
                            onClick: openNewCorridor
                          }, {
                            default: withCtx(() => [..._cache[73] || (_cache[73] = [
                              createTextVNode("新增走廊/分区", -1)
                            ])]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$2), {
                        columns: corridorColumns,
                        data: selectedBuildingId.value ? unref(store).corridors.filter((item) => item.building_id === selectedBuildingId.value) : unref(store).corridors,
                        loading: unref(store).loading,
                        pagination: { pageSize: 10 }
                      }, null, 8, ["data", "loading"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NTabPane), {
                    name: "buildings",
                    tab: "楼栋"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NSpace), {
                        justify: "end",
                        class: "mb-3"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Button), {
                            loading: unref(refreshing),
                            size: "small",
                            onClick: unref(refresh)
                          }, {
                            default: withCtx(() => [..._cache[74] || (_cache[74] = [
                              createTextVNode("刷新", -1)
                            ])]),
                            _: 1
                          }, 8, ["loading", "onClick"]),
                          createVNode(unref(Button), {
                            type: "primary",
                            size: "small",
                            onClick: openNewBuilding
                          }, {
                            default: withCtx(() => [..._cache[75] || (_cache[75] = [
                              createTextVNode("新增楼栋", -1)
                            ])]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$2), {
                        columns: buildingColumns,
                        data: unref(store).buildings,
                        loading: unref(store).loading,
                        pagination: false
                      }, null, 8, ["data", "loading"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NTabPane), {
                    name: "rooms",
                    tab: "房间"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NSpace), {
                        justify: "space-between",
                        class: "mb-3"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(NSelect), {
                            value: selectedBuildingId.value,
                            "onUpdate:value": _cache[17] || (_cache[17] = ($event) => selectedBuildingId.value = $event),
                            options: buildingOptions.value,
                            clearable: "",
                            placeholder: "筛选楼栋",
                            style: { "width": "180px" }
                          }, null, 8, ["value", "options"]),
                          createVNode(unref(Button), {
                            type: "primary",
                            size: "small",
                            onClick: openNewRoom
                          }, {
                            default: withCtx(() => [..._cache[76] || (_cache[76] = [
                              createTextVNode("新增房间", -1)
                            ])]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$2), {
                        columns: roomColumns,
                        data: filteredRooms.value,
                        loading: unref(store).loading,
                        pagination: { pageSize: 10 }
                      }, null, 8, ["data", "loading"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NTabPane), {
                    name: "beds",
                    tab: "床位"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NSpace), {
                        justify: "space-between",
                        class: "mb-3"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(NSelect), {
                            value: filterRoomId.value,
                            "onUpdate:value": _cache[18] || (_cache[18] = ($event) => filterRoomId.value = $event),
                            options: roomOptions.value,
                            clearable: "",
                            placeholder: "筛选房间",
                            style: { "width": "220px" }
                          }, null, 8, ["value", "options"]),
                          createVNode(unref(Button), {
                            type: "primary",
                            size: "small",
                            onClick: openNewBed
                          }, {
                            default: withCtx(() => [..._cache[77] || (_cache[77] = [
                              createTextVNode("新增床位", -1)
                            ])]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$2), {
                        columns: bedColumns,
                        data: filteredBeds.value,
                        loading: unref(store).loading,
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
            show: showBuildingModal.value,
            "onUpdate:show": _cache[23] || (_cache[23] = ($event) => showBuildingModal.value = $event),
            title: "楼栋信息",
            preset: "card",
            style: { "width": "440px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[22] || (_cache[22] = ($event) => showBuildingModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[78] || (_cache[78] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    loading: savingBuilding.value,
                    onClick: saveBuilding
                  }, {
                    default: withCtx(() => [..._cache[79] || (_cache[79] = [
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
                        "onUpdate:value": _cache[19] || (_cache[19] = ($event) => buildingForm.value.name = $event),
                        placeholder: "如：A栋"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "楼层数" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInputNumber), {
                        value: buildingForm.value.floors,
                        "onUpdate:value": _cache[20] || (_cache[20] = ($event) => buildingForm.value.floors = $event),
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
                        "onUpdate:value": _cache[21] || (_cache[21] = ($event) => buildingForm.value.remark = $event),
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
            show: showRoomTypeModal.value,
            "onUpdate:show": _cache[35] || (_cache[35] = ($event) => showRoomTypeModal.value = $event),
            title: "房型信息",
            preset: "card",
            style: { "width": "560px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[34] || (_cache[34] = ($event) => showRoomTypeModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[82] || (_cache[82] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    loading: savingRoomType.value,
                    onClick: saveRoomType
                  }, {
                    default: withCtx(() => [..._cache[83] || (_cache[83] = [
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
                  createVNode(unref(NFormItem), {
                    label: "房型名称",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: roomTypeForm.value.name,
                        "onUpdate:value": _cache[24] || (_cache[24] = ($event) => roomTypeForm.value.name = $event),
                        placeholder: "如：南向双人间"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "房型编码",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: roomTypeForm.value.code,
                        "onUpdate:value": _cache[25] || (_cache[25] = ($event) => roomTypeForm.value.code = $event),
                        placeholder: "如 double-south"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "默认床位" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInputNumber), {
                        value: roomTypeForm.value.default_capacity,
                        "onUpdate:value": _cache[26] || (_cache[26] = ($event) => roomTypeForm.value.default_capacity = $event),
                        min: 1,
                        max: 20
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "默认价格" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInputNumber), {
                        value: roomTypeForm.value.default_price,
                        "onUpdate:value": _cache[27] || (_cache[27] = ($event) => roomTypeForm.value.default_price = $event),
                        min: 0,
                        precision: 2
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "面积" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInputNumber), {
                        value: roomTypeForm.value.area,
                        "onUpdate:value": _cache[28] || (_cache[28] = ($event) => roomTypeForm.value.area = $event),
                        min: 0,
                        precision: 1,
                        placeholder: "可不填"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "设施" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSpace), null, {
                        default: withCtx(() => [
                          createVNode(unref(NCheckbox), {
                            checked: roomTypeForm.value.has_window,
                            "onUpdate:checked": _cache[29] || (_cache[29] = ($event) => roomTypeForm.value.has_window = $event),
                            "checked-value": 1,
                            "unchecked-value": 0
                          }, {
                            default: withCtx(() => [..._cache[80] || (_cache[80] = [
                              createTextVNode("有窗", -1)
                            ])]),
                            _: 1
                          }, 8, ["checked"]),
                          createVNode(unref(NCheckbox), {
                            checked: roomTypeForm.value.has_private_bathroom,
                            "onUpdate:checked": _cache[30] || (_cache[30] = ($event) => roomTypeForm.value.has_private_bathroom = $event),
                            "checked-value": 1,
                            "unchecked-value": 0
                          }, {
                            default: withCtx(() => [..._cache[81] || (_cache[81] = [
                              createTextVNode("独立卫生间", -1)
                            ])]),
                            _: 1
                          }, 8, ["checked"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "护理设备" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: roomTypeForm.value.care_equipment,
                        "onUpdate:value": _cache[31] || (_cache[31] = ($event) => roomTypeForm.value.care_equipment = $event),
                        placeholder: "如 呼叫器、护理床、供氧口"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "状态" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: roomTypeForm.value.status,
                        "onUpdate:value": _cache[32] || (_cache[32] = ($event) => roomTypeForm.value.status = $event),
                        options: [{ label: "启用", value: "active" }, { label: "停用", value: "inactive" }]
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "备注" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: roomTypeForm.value.remark,
                        "onUpdate:value": _cache[33] || (_cache[33] = ($event) => roomTypeForm.value.remark = $event),
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
            show: showCorridorModal.value,
            "onUpdate:show": _cache[43] || (_cache[43] = ($event) => showCorridorModal.value = $event),
            title: "走廊/分区信息",
            preset: "card",
            style: { "width": "480px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[42] || (_cache[42] = ($event) => showCorridorModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[84] || (_cache[84] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    loading: savingCorridor.value,
                    onClick: saveCorridor
                  }, {
                    default: withCtx(() => [..._cache[85] || (_cache[85] = [
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
                model: corridorForm.value,
                "label-placement": "left",
                "label-width": "100"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), {
                    label: "所在楼栋",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: corridorForm.value.building_id,
                        "onUpdate:value": _cache[36] || (_cache[36] = ($event) => corridorForm.value.building_id = $event),
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
                        value: corridorForm.value.floor,
                        "onUpdate:value": _cache[37] || (_cache[37] = ($event) => corridorForm.value.floor = $event),
                        min: 1
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "名称",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: corridorForm.value.name,
                        "onUpdate:value": _cache[38] || (_cache[38] = ($event) => corridorForm.value.name = $event),
                        placeholder: "如：东走廊、护理一区"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "方向" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: corridorForm.value.direction,
                        "onUpdate:value": _cache[39] || (_cache[39] = ($event) => corridorForm.value.direction = $event),
                        options: directionOptions
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "排序" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInputNumber), {
                        value: corridorForm.value.sort_order,
                        "onUpdate:value": _cache[40] || (_cache[40] = ($event) => corridorForm.value.sort_order = $event),
                        min: 0
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "备注" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: corridorForm.value.remark,
                        "onUpdate:value": _cache[41] || (_cache[41] = ($event) => corridorForm.value.remark = $event),
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
            "onUpdate:show": _cache[56] || (_cache[56] = ($event) => showRoomModal.value = $event),
            title: "房间信息",
            preset: "card",
            style: { "width": "560px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[55] || (_cache[55] = ($event) => showRoomModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[86] || (_cache[86] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    loading: savingRoom.value,
                    onClick: saveRoom
                  }, {
                    default: withCtx(() => [..._cache[87] || (_cache[87] = [
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
                "label-width": "100"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), {
                    label: "所在楼栋",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: roomForm.value.building_id,
                        "onUpdate:value": _cache[44] || (_cache[44] = ($event) => roomForm.value.building_id = $event),
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
                        "onUpdate:value": _cache[45] || (_cache[45] = ($event) => roomForm.value.floor = $event),
                        min: 1
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "走廊/分区" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: roomForm.value.corridor_id,
                        "onUpdate:value": _cache[46] || (_cache[46] = ($event) => roomForm.value.corridor_id = $event),
                        options: corridorOptions.value,
                        clearable: ""
                      }, null, 8, ["value", "options"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "侧位" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: roomForm.value.layout_side,
                        "onUpdate:value": _cache[47] || (_cache[47] = ($event) => roomForm.value.layout_side = $event),
                        options: layoutSideOptions
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
                        "onUpdate:value": _cache[48] || (_cache[48] = ($event) => roomForm.value.room_no = $event),
                        placeholder: "如：101"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "房型" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: roomForm.value.room_type_id,
                        "onUpdate:value": [
                          _cache[49] || (_cache[49] = ($event) => roomForm.value.room_type_id = $event),
                          applyRoomTypeToRoomForm
                        ],
                        options: roomTypeOptions.value,
                        clearable: ""
                      }, null, 8, ["value", "options"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "床位数" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInputNumber), {
                        value: roomForm.value.capacity,
                        "onUpdate:value": _cache[50] || (_cache[50] = ($event) => roomForm.value.capacity = $event),
                        min: 1,
                        max: 20
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "月租金" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInputNumber), {
                        value: roomForm.value.price,
                        "onUpdate:value": _cache[51] || (_cache[51] = ($event) => roomForm.value.price = $event),
                        min: 0,
                        precision: 2
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "排序" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInputNumber), {
                        value: roomForm.value.sort_order,
                        "onUpdate:value": _cache[52] || (_cache[52] = ($event) => roomForm.value.sort_order = $event),
                        min: 0
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "状态" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: roomForm.value.status,
                        "onUpdate:value": _cache[53] || (_cache[53] = ($event) => roomForm.value.status = $event),
                        options: statusOptions
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "备注" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: roomForm.value.remark,
                        "onUpdate:value": _cache[54] || (_cache[54] = ($event) => roomForm.value.remark = $event),
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
            show: showBedModal.value,
            "onUpdate:show": _cache[62] || (_cache[62] = ($event) => showBedModal.value = $event),
            title: "床位信息",
            preset: "card",
            style: { "width": "440px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[61] || (_cache[61] = ($event) => showBedModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[88] || (_cache[88] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    loading: savingBed.value,
                    onClick: saveBed
                  }, {
                    default: withCtx(() => [..._cache[89] || (_cache[89] = [
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
                        "onUpdate:value": _cache[57] || (_cache[57] = ($event) => bedForm.value.room_id = $event),
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
                        "onUpdate:value": _cache[58] || (_cache[58] = ($event) => bedForm.value.bed_no = $event),
                        placeholder: "如：A床"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "状态" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: bedForm.value.status,
                        "onUpdate:value": _cache[59] || (_cache[59] = ($event) => bedForm.value.status = $event),
                        options: statusOptions
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "备注" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: bedForm.value.remark,
                        "onUpdate:value": _cache[60] || (_cache[60] = ($event) => bedForm.value.remark = $event),
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
const BedManageView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e38ecfc2"]]);
export {
  BedManageView as default
};
