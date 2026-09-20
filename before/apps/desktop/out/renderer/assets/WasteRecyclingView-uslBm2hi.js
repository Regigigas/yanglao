import { S as defineStore, r as ref, l as defineComponent, o as onMounted, U as createBlock, W as withCtx, V as openBlock, X as createVNode, u as unref, a4 as withKeys, k as createTextVNode, a7 as createCommentVNode, a1 as createElementBlock, a6 as renderList, F as Fragment, a9 as toDisplayString, c as computed, q as h } from "./vendor-vue-Ccw0-9Al.js";
import { _ as _sfc_main$1 } from "./BasePage.vue_vue_type_script_setup_true_lang-CTneexfB.js";
import { _ as _sfc_main$2 } from "./BaseTable.vue_vue_type_script_setup_true_lang-B36jvMQ5.js";
import { u as useAuthStore } from "./index-4Egxykc2.js";
import { u as useMessage, P as NGrid, M as NGridItem, O as NStatistic, g as NCard, T as NTabPane, v as NSpace, l as NInput, J as NSelect, H as NDatePicker, B as Button, S as NTabs, j as NForm, k as NFormItem, U as NInputNumber, h as NModal, X as NDivider, Q as NDescriptions, R as NDescriptionsItem, o as NTag, $ as NPopconfirm } from "./vendor-naive-DlmVkmqb.js";
import "./vendor-query-Q9Uykhde.js";
import "./vendor-echarts-dbJmlwEq.js";
const emptyStats = () => ({
  total_orders: 0,
  pending_orders: 0,
  completed_orders: 0,
  total_weight: 0,
  total_amount_cents: 0,
  total_points: 0,
  inventory_weight: 0,
  by_category: [],
  monthly_trend: []
});
const useWasteRecyclingStore = defineStore("waste-recycling", () => {
  const categories = ref([]);
  const orders = ref([]);
  const currentItems = ref([]);
  const currentSettlement = ref(null);
  const inventory = ref([]);
  const inventoryTransactions = ref([]);
  const pointsLedger = ref([]);
  const stats = ref(emptyStats());
  const loading = ref(false);
  async function fetchCategories(activeOnly = false) {
    categories.value = await window.api.wasteRecycling.category.list(activeOnly);
  }
  async function createCategory(data) {
    const row = await window.api.wasteRecycling.category.create(data);
    await fetchCategories();
    return row;
  }
  async function updateCategory(id, data) {
    const row = await window.api.wasteRecycling.category.update(id, data);
    await fetchCategories();
    return row;
  }
  async function deleteCategory(id) {
    await window.api.wasteRecycling.category.delete(id);
    await fetchCategories();
  }
  async function fetchOrders(query = {}) {
    loading.value = true;
    try {
      orders.value = await window.api.wasteRecycling.order.list(query);
    } finally {
      loading.value = false;
    }
  }
  async function createOrder(data) {
    const row = await window.api.wasteRecycling.order.create(data);
    await Promise.all([fetchOrders(), fetchStats()]);
    return row;
  }
  async function assign(id, assigneeId, assigneeName) {
    await window.api.wasteRecycling.order.assign(id, assigneeId, assigneeName);
    await fetchOrders();
  }
  async function start(id) {
    await window.api.wasteRecycling.order.start(id);
    await fetchOrders();
  }
  async function weigh(id, items) {
    await window.api.wasteRecycling.order.weigh(id, items);
    await Promise.all([fetchOrders(), fetchStats()]);
  }
  async function settle(id, data) {
    const row = await window.api.wasteRecycling.order.settle(id, data);
    await Promise.all([fetchOrders(), fetchInventory(), fetchPoints(), fetchStats()]);
    return row;
  }
  async function complete(id) {
    await window.api.wasteRecycling.order.complete(id);
    await Promise.all([fetchOrders(), fetchStats()]);
  }
  async function cancel(id, reason) {
    await window.api.wasteRecycling.order.cancel(id, reason);
    await Promise.all([fetchOrders(), fetchStats()]);
  }
  async function fetchOrderDetail(id) {
    const [items, settlement] = await Promise.all([
      window.api.wasteRecycling.order.items(id),
      window.api.wasteRecycling.settlement.get(id)
    ]);
    currentItems.value = items;
    currentSettlement.value = settlement;
  }
  async function fetchInventory(status) {
    inventory.value = await window.api.wasteRecycling.inventory.list(status);
  }
  async function fetchInventoryTransactions(lotId) {
    inventoryTransactions.value = await window.api.wasteRecycling.inventory.transactions(lotId);
  }
  async function transactInventory(lotId, data) {
    const row = await window.api.wasteRecycling.inventory.transact(lotId, data);
    await Promise.all([fetchInventory(), fetchInventoryTransactions(lotId), fetchStats()]);
    return row;
  }
  async function fetchPoints(elderlyId) {
    pointsLedger.value = await window.api.wasteRecycling.points.list(elderlyId);
  }
  async function fetchStats(startDate, endDate) {
    stats.value = await window.api.wasteRecycling.stats(startDate, endDate);
  }
  async function refreshAll(query = {}) {
    await Promise.all([
      fetchCategories(),
      fetchOrders(query),
      fetchInventory(),
      fetchPoints(),
      fetchStats(query.startDate, query.endDate)
    ]);
  }
  return {
    categories,
    orders,
    currentItems,
    currentSettlement,
    inventory,
    inventoryTransactions,
    pointsLedger,
    stats,
    loading,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    fetchOrders,
    createOrder,
    assign,
    start,
    weigh,
    settle,
    complete,
    cancel,
    fetchOrderDetail,
    fetchInventory,
    fetchInventoryTransactions,
    transactInventory,
    fetchPoints,
    fetchStats,
    refreshAll
  };
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "WasteRecyclingView",
  setup(__props) {
    const store = useWasteRecyclingStore();
    const auth = useAuthStore();
    const message = useMessage();
    const users = ref([]);
    const elderly = ref([]);
    const activeTab = ref("orders");
    const refreshing = ref(false);
    const statusMap = {
      pending: { label: "待派单", type: "warning" },
      assigned: { label: "已派单", type: "info" },
      collecting: { label: "回收中", type: "info" },
      weighed: { label: "待结算", type: "warning" },
      settled: { label: "已结算", type: "success" },
      completed: { label: "已完成", type: "success" },
      cancelled: { label: "已取消", type: "error" }
    };
    const sourceOptions = [
      { label: "在院老人", value: "elderly" },
      { label: "员工", value: "staff" },
      { label: "社区居民", value: "community" },
      { label: "其他", value: "other" }
    ];
    const pickupOptions = [{ label: "上门回收", value: "pickup" }, { label: "送至回收点", value: "dropoff" }];
    const orderStatusOptions = [{ label: "全部状态", value: "" }, ...Object.entries(statusMap).map(([value, item]) => ({ label: item.label, value }))];
    const settlementOptions = [
      { label: "现金", value: "cash" },
      { label: "银行转账", value: "bank" },
      { label: "积分", value: "points" },
      { label: "公益捐赠", value: "donation" }
    ];
    const gradeOptions = [
      { label: "优质", value: "excellent" },
      { label: "普通", value: "normal" },
      { label: "混合", value: "mixed" }
    ];
    const categoryStatusOptions = [{ label: "启用", value: "active" }, { label: "停用", value: "inactive" }];
    const inventoryStatusOptions = [{ label: "在库", value: "in_stock" }, { label: "部分出库", value: "partial" }, { label: "已出库", value: "out" }];
    const can = (action) => auth.canUseButton(`waste-recycling:${action}`);
    const yuan = (cents) => `¥${(Number(cents || 0) / 100).toFixed(2)}`;
    const weight = (value) => `${Number(value || 0).toFixed(3)} kg`;
    const elderlyName = (id) => elderly.value.find((item) => item.id === id)?.name ?? id;
    const categoryOptions = computed(() => store.categories.filter((item) => item.status === "active").map((item) => ({ label: `${item.name}（${yuan(item.guide_price_cents)}/${item.unit}）`, value: item.id })));
    const elderlyOptions = computed(() => elderly.value.map((item) => ({ label: `${item.name}${item.room_no ? ` · ${item.room_no}` : ""}`, value: item.id })));
    const userOptions = computed(() => users.value.filter((item) => item.status === "active").map((item) => ({ label: item.real_name || item.username, value: item.id })));
    const query = ref({ status: "", keyword: "", dateRange: null });
    function queryParams() {
      const range = query.value.dateRange;
      return {
        status: query.value.status || void 0,
        keyword: query.value.keyword || void 0,
        startDate: range ? new Date(range[0]).toISOString().slice(0, 10) : void 0,
        endDate: range ? new Date(range[1]).toISOString().slice(0, 10) : void 0
      };
    }
    async function refresh() {
      refreshing.value = true;
      try {
        await store.refreshAll(queryParams());
      } catch (error) {
        message.error(error instanceof Error ? error.message : String(error));
      } finally {
        refreshing.value = false;
      }
    }
    async function run(action, success) {
      try {
        await action();
        if (success) message.success(success);
      } catch (error) {
        message.error(error instanceof Error ? error.message : String(error));
      }
    }
    const showOrderModal = ref(false);
    const orderForm = ref({
      source_type: "elderly",
      elderly_id: null,
      contact_name: "",
      contact_phone: "",
      pickup_type: "pickup",
      pickup_address: "",
      appointment_at: "",
      estimated_weight: null,
      remark: ""
    });
    function openCreateOrder() {
      const now = new Date(Date.now() + 60 * 60 * 1e3);
      orderForm.value = {
        source_type: "elderly",
        elderly_id: null,
        contact_name: "",
        contact_phone: "",
        pickup_type: "pickup",
        pickup_address: "",
        appointment_at: now.toISOString().slice(0, 16).replace("T", " "),
        estimated_weight: null,
        remark: ""
      };
      showOrderModal.value = true;
    }
    function selectElderly(id) {
      const item = elderly.value.find((row) => row.id === id);
      if (!item) return;
      orderForm.value.contact_name = item.name;
      orderForm.value.contact_phone = item.phone ?? "";
      orderForm.value.pickup_address = item.room_no ? `院内 ${item.room_no}` : item.address ?? "";
    }
    async function saveOrder() {
      if (!orderForm.value.contact_name.trim() || !orderForm.value.appointment_at) return message.error("请填写联系人和预约时间");
      await run(async () => {
        await store.createOrder({
          ...orderForm.value,
          contact_phone: orderForm.value.contact_phone || null,
          pickup_address: orderForm.value.pickup_address || null,
          created_by: auth.currentUser?.id ?? null,
          created_by_name: auth.currentUser?.real_name ?? auth.currentUser?.username ?? null,
          remark: orderForm.value.remark || null
        });
        showOrderModal.value = false;
      }, "回收预约已登记");
    }
    const currentOrder = ref(null);
    const showAssignModal = ref(false);
    const assigneeId = ref(null);
    function openAssign(row) {
      currentOrder.value = row;
      assigneeId.value = row.assignee_id;
      showAssignModal.value = true;
    }
    async function saveAssign() {
      const user = users.value.find((item) => item.id === assigneeId.value);
      if (!currentOrder.value || !user) return message.error("请选择回收负责人");
      await run(async () => {
        await store.assign(currentOrder.value.id, user.id, user.real_name || user.username);
        showAssignModal.value = false;
      }, "派单成功");
    }
    const showWeighModal = ref(false);
    const weighDrafts = ref([]);
    function emptyWeighDraft() {
      const category = store.categories.find((item) => item.status === "active");
      return { category_id: category?.id ?? null, material_name: category?.name ?? "", gross_weight: null, tare_weight: 0, unit_price_yuan: (category?.guide_price_cents ?? 0) / 100, quality_grade: "normal", remark: "" };
    }
    async function openWeigh(row) {
      currentOrder.value = row;
      await run(async () => {
        const existing = await window.api.wasteRecycling.order.items(row.id);
        weighDrafts.value = existing.length ? existing.map((item) => ({
          category_id: item.category_id,
          material_name: item.material_name,
          gross_weight: item.gross_weight,
          tare_weight: item.tare_weight,
          unit_price_yuan: item.unit_price_cents / 100,
          quality_grade: item.quality_grade,
          remark: item.remark ?? ""
        })) : [emptyWeighDraft()];
        showWeighModal.value = true;
      });
    }
    function selectCategory(draft, id) {
      const category = store.categories.find((item) => item.id === id);
      if (!category) return;
      draft.material_name = category.name;
      draft.unit_price_yuan = category.guide_price_cents / 100;
    }
    const weighTotal = computed(() => weighDrafts.value.reduce((sum, item) => {
      const net = Math.max(0, Number(item.gross_weight || 0) - Number(item.tare_weight || 0));
      return sum + net * Number(item.unit_price_yuan || 0);
    }, 0));
    async function saveWeigh() {
      if (!currentOrder.value) return;
      if (weighDrafts.value.some((item) => !item.category_id || !item.gross_weight || item.gross_weight <= item.tare_weight)) return message.error("请完整填写称重明细，且毛重必须大于皮重");
      await run(async () => {
        await store.weigh(currentOrder.value.id, weighDrafts.value.map((item) => ({
          category_id: item.category_id,
          material_name: item.material_name,
          gross_weight: Number(item.gross_weight),
          tare_weight: Number(item.tare_weight || 0),
          unit_price_cents: Math.round(Number(item.unit_price_yuan || 0) * 100),
          quality_grade: item.quality_grade,
          remark: item.remark || null
        })));
        showWeighModal.value = false;
      }, "称重计价已保存");
    }
    const showSettlementModal = ref(false);
    const settlementForm = ref({ method: "cash", cash_amount_yuan: 0, points: 0, payee: "", storage_location: "回收暂存区", remark: "" });
    function openSettlement(row) {
      currentOrder.value = row;
      settlementForm.value = { method: row.elderly_id ? "points" : "cash", cash_amount_yuan: row.total_amount_cents / 100, points: row.points, payee: row.contact_name, storage_location: "回收暂存区", remark: "" };
      showSettlementModal.value = true;
    }
    async function saveSettlement() {
      if (!currentOrder.value) return;
      await run(async () => {
        await store.settle(currentOrder.value.id, {
          method: settlementForm.value.method,
          cash_amount_cents: Math.round(settlementForm.value.cash_amount_yuan * 100),
          points: Math.round(settlementForm.value.points),
          payee: settlementForm.value.payee || null,
          operator: auth.currentUser?.real_name ?? auth.currentUser?.username ?? null,
          storage_location: settlementForm.value.storage_location || null,
          remark: settlementForm.value.remark || null
        });
        showSettlementModal.value = false;
      }, "结算完成，回收物已入库");
    }
    const showCancelModal = ref(false);
    const cancelReason = ref("");
    function openCancel(row) {
      currentOrder.value = row;
      cancelReason.value = "";
      showCancelModal.value = true;
    }
    async function saveCancel() {
      if (!currentOrder.value || !cancelReason.value.trim()) return message.error("请填写取消原因");
      await run(async () => {
        await store.cancel(currentOrder.value.id, cancelReason.value);
        showCancelModal.value = false;
      }, "回收单已取消");
    }
    const showDetailModal = ref(false);
    async function openDetail(row) {
      currentOrder.value = row;
      await run(async () => {
        await store.fetchOrderDetail(row.id);
        showDetailModal.value = true;
      });
    }
    const showInventoryModal = ref(false);
    const currentLot = ref(null);
    const inventoryForm = ref({ transaction_type: "out", quantity: 0, destination: "", counterparty: "", unit_price_yuan: 0, occurred_at: "", remark: "" });
    function openInventory(row, type) {
      currentLot.value = row;
      inventoryForm.value = { transaction_type: type, quantity: type === "out" ? row.remaining_quantity : 0, destination: "", counterparty: "", unit_price_yuan: 0, occurred_at: (/* @__PURE__ */ new Date()).toISOString().slice(0, 16).replace("T", " "), remark: "" };
      showInventoryModal.value = true;
    }
    async function saveInventory() {
      if (!currentLot.value || !inventoryForm.value.quantity) return message.error("请填写数量");
      await run(async () => {
        await store.transactInventory(currentLot.value.id, {
          ...inventoryForm.value,
          unit_price_cents: Math.round(inventoryForm.value.unit_price_yuan * 100),
          operator: auth.currentUser?.real_name ?? auth.currentUser?.username ?? null,
          destination: inventoryForm.value.destination || null,
          counterparty: inventoryForm.value.counterparty || null,
          remark: inventoryForm.value.remark || null
        });
        showInventoryModal.value = false;
      }, inventoryForm.value.transaction_type === "out" ? "出库成功" : "库存调整成功");
    }
    const showTransactionsModal = ref(false);
    async function openTransactions(row) {
      currentLot.value = row;
      await run(async () => {
        await store.fetchInventoryTransactions(row.id);
        showTransactionsModal.value = true;
      });
    }
    const showCategoryModal = ref(false);
    const editingCategory = ref(null);
    const categoryForm = ref({ code: "", name: "", unit: "kg", guide_price_yuan: 0, points_per_unit: 0, status: "active", sort_order: 0, remark: "" });
    function openCategory(row) {
      editingCategory.value = row ?? null;
      categoryForm.value = row ? { code: row.code, name: row.name, unit: row.unit, guide_price_yuan: row.guide_price_cents / 100, points_per_unit: row.points_per_unit, status: row.status, sort_order: row.sort_order, remark: row.remark ?? "" } : { code: "", name: "", unit: "kg", guide_price_yuan: 0, points_per_unit: 0, status: "active", sort_order: 0, remark: "" };
      showCategoryModal.value = true;
    }
    async function saveCategory() {
      if (!categoryForm.value.code.trim() || !categoryForm.value.name.trim()) return message.error("请填写编码和名称");
      const data = { ...categoryForm.value, guide_price_cents: Math.round(categoryForm.value.guide_price_yuan * 100), remark: categoryForm.value.remark || null };
      delete data.guide_price_yuan;
      await run(async () => {
        if (editingCategory.value) await store.updateCategory(editingCategory.value.id, data);
        else await store.createCategory(data);
        showCategoryModal.value = false;
      }, "品类已保存");
    }
    const orderColumns = [
      { title: "回收单号", key: "order_no", width: 155 },
      { title: "预约时间", key: "appointment_at", width: 155 },
      { title: "联系人", key: "contact_name", width: 100 },
      { title: "方式", key: "pickup_type", width: 90, render: (row) => row.pickup_type === "pickup" ? "上门" : "送达" },
      { title: "负责人", key: "assignee_name", width: 100, render: (row) => row.assignee_name || "—" },
      { title: "重量", key: "total_weight", width: 100, render: (row) => weight(row.total_weight) },
      { title: "金额", key: "total_amount_cents", width: 90, render: (row) => yuan(row.total_amount_cents) },
      { title: "状态", key: "status", width: 90, render: (row) => h(NTag, { type: statusMap[row.status].type, size: "small" }, () => statusMap[row.status].label) },
      { title: "操作", key: "actions", width: 330, render: (row) => h(NSpace, { size: 6, wrap: false }, { default: () => [
        h(Button, { size: "tiny", onClick: () => openDetail(row) }, () => "详情"),
        ["pending", "assigned"].includes(row.status) && can("dispatch") ? h(Button, { size: "tiny", type: "primary", onClick: () => openAssign(row) }, () => row.status === "pending" ? "派单" : "改派") : null,
        row.status === "assigned" && can("dispatch") ? h(Button, { size: "tiny", onClick: () => run(() => store.start(row.id), "已开始回收") }, () => "开始") : null,
        ["assigned", "collecting", "weighed"].includes(row.status) && can("weigh") ? h(Button, { size: "tiny", type: "warning", onClick: () => openWeigh(row) }, () => "称重") : null,
        row.status === "weighed" && can("settle") ? h(Button, { size: "tiny", type: "success", onClick: () => openSettlement(row) }, () => "结算") : null,
        row.status === "settled" ? h(Button, { size: "tiny", type: "success", onClick: () => run(() => store.complete(row.id), "回收单已完成") }, () => "完成") : null,
        ["pending", "assigned", "collecting"].includes(row.status) ? h(Button, { size: "tiny", type: "error", onClick: () => openCancel(row) }, () => "取消") : null
      ].filter(Boolean) }) }
    ];
    const itemColumns = [
      { title: "品类", key: "category_name" },
      { title: "物料", key: "material_name" },
      { title: "毛重", key: "gross_weight" },
      { title: "皮重", key: "tare_weight" },
      { title: "净重", key: "net_weight" },
      { title: "单价", key: "unit_price_cents", render: (row) => `${yuan(row.unit_price_cents)}/${row.unit}` },
      { title: "金额", key: "amount_cents", render: (row) => yuan(row.amount_cents) }
    ];
    const inventoryColumns = [
      { title: "物料", key: "material_name" },
      { title: "入库量", key: "quantity", render: (row) => `${row.quantity} ${row.unit}` },
      { title: "剩余量", key: "remaining_quantity", render: (row) => `${row.remaining_quantity} ${row.unit}` },
      { title: "库位", key: "storage_location", render: (row) => row.storage_location || "—" },
      { title: "状态", key: "status", render: (row) => inventoryStatusOptions.find((item) => item.value === row.status)?.label },
      { title: "操作", key: "actions", width: 210, render: (row) => h(NSpace, { size: 6 }, { default: () => [
        h(Button, { size: "tiny", onClick: () => openTransactions(row) }, () => "流水"),
        row.status !== "out" && can("inventory") ? h(Button, { size: "tiny", type: "primary", onClick: () => openInventory(row, "out") }, () => "出库") : null,
        can("inventory") ? h(Button, { size: "tiny", onClick: () => openInventory(row, "adjust") }, () => "盘点") : null
      ].filter(Boolean) }) }
    ];
    const categoryColumns = [
      { title: "编码", key: "code" },
      { title: "品类", key: "name" },
      { title: "单位", key: "unit" },
      { title: "指导价", key: "guide_price_cents", render: (row) => `${yuan(row.guide_price_cents)}/${row.unit}` },
      { title: "积分系数", key: "points_per_unit", render: (row) => `${row.points_per_unit} 分/${row.unit}` },
      { title: "状态", key: "status", render: (row) => h(NTag, { type: row.status === "active" ? "success" : "default", size: "small" }, () => row.status === "active" ? "启用" : "停用") },
      { title: "操作", key: "actions", width: 150, render: (row) => h(NSpace, null, { default: () => [
        can("category") ? h(Button, { size: "tiny", onClick: () => openCategory(row) }, () => "编辑") : null,
        can("category") ? h(NPopconfirm, { onPositiveClick: () => run(() => store.deleteCategory(row.id), "已删除") }, { trigger: () => h(Button, { size: "tiny", type: "error" }, () => "删除"), default: () => "仅未产生回收记录的品类可删除，确定继续？" }) : null
      ].filter(Boolean) }) }
    ];
    const pointColumns = [
      { title: "老人", key: "elderly_id", render: (row) => elderlyName(row.elderly_id) },
      { title: "积分变动", key: "change_points", render: (row) => h(NTag, { type: row.change_points >= 0 ? "success" : "error" }, () => `${row.change_points >= 0 ? "+" : ""}${row.change_points}`) },
      { title: "原因", key: "reason" },
      { title: "操作人", key: "operator", render: (row) => row.operator || "—" },
      { title: "时间", key: "occurred_at", render: (row) => new Date(row.occurred_at).toLocaleString() }
    ];
    const transactionColumns = [
      { title: "类型", key: "transaction_type", render: (row) => ({ in: "入库", out: "出库", adjust: "盘点调整" })[row.transaction_type] },
      { title: "数量", key: "quantity" },
      { title: "去向", key: "destination", render: (row) => row.destination || "—" },
      { title: "接收方", key: "counterparty", render: (row) => row.counterparty || "—" },
      { title: "金额", key: "amount_cents", render: (row) => yuan(row.amount_cents) },
      { title: "时间", key: "occurred_at" },
      { title: "操作人", key: "operator" }
    ];
    onMounted(async () => {
      await auth.restore();
      await run(async () => {
        const [userRows, elderlyRows] = await Promise.all([window.api.user.list(), window.api.elderly.list()]);
        users.value = userRows;
        elderly.value = elderlyRows;
        await refresh();
      });
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, { title: "废品回收" }, {
        default: withCtx(() => [
          createVNode(unref(NCard), { class: "mb-3" }, {
            default: withCtx(() => [
              createVNode(unref(NGrid), {
                cols: 7,
                "x-gap": 16
              }, {
                default: withCtx(() => [
                  createVNode(unref(NGridItem), null, {
                    default: withCtx(() => [
                      createVNode(unref(NStatistic), {
                        label: "回收单",
                        value: unref(store).stats.total_orders
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NGridItem), null, {
                    default: withCtx(() => [
                      createVNode(unref(NStatistic), {
                        label: "待处理",
                        value: unref(store).stats.pending_orders
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NGridItem), null, {
                    default: withCtx(() => [
                      createVNode(unref(NStatistic), {
                        label: "已完成",
                        value: unref(store).stats.completed_orders
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NGridItem), null, {
                    default: withCtx(() => [
                      createVNode(unref(NStatistic), {
                        label: "累计重量",
                        value: unref(store).stats.total_weight,
                        precision: 3,
                        suffix: "kg"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NGridItem), null, {
                    default: withCtx(() => [
                      createVNode(unref(NStatistic), {
                        label: "回收金额",
                        value: unref(store).stats.total_amount_cents / 100,
                        precision: 2,
                        prefix: "¥"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NGridItem), null, {
                    default: withCtx(() => [
                      createVNode(unref(NStatistic), {
                        label: "发放积分",
                        value: unref(store).stats.total_points
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NGridItem), null, {
                    default: withCtx(() => [
                      createVNode(unref(NStatistic), {
                        label: "当前库存",
                        value: unref(store).stats.inventory_weight,
                        precision: 3,
                        suffix: "kg"
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
          createVNode(unref(NTabs), {
            value: activeTab.value,
            "onUpdate:value": _cache[5] || (_cache[5] = ($event) => activeTab.value = $event),
            type: "line",
            animated: ""
          }, {
            default: withCtx(() => [
              createVNode(unref(NTabPane), {
                name: "orders",
                tab: "回收单"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    "header-extra": withCtx(() => [
                      createVNode(unref(NSpace), null, {
                        default: withCtx(() => [
                          createVNode(unref(NInput), {
                            value: query.value.keyword,
                            "onUpdate:value": _cache[0] || (_cache[0] = ($event) => query.value.keyword = $event),
                            clearable: "",
                            placeholder: "单号/联系人/负责人",
                            style: { "width": "190px" },
                            onKeyup: withKeys(refresh, ["enter"])
                          }, null, 8, ["value"]),
                          createVNode(unref(NSelect), {
                            value: query.value.status,
                            "onUpdate:value": _cache[1] || (_cache[1] = ($event) => query.value.status = $event),
                            options: orderStatusOptions,
                            style: { "width": "120px" }
                          }, null, 8, ["value"]),
                          createVNode(unref(NDatePicker), {
                            value: query.value.dateRange,
                            "onUpdate:value": _cache[2] || (_cache[2] = ($event) => query.value.dateRange = $event),
                            type: "daterange",
                            clearable: "",
                            style: { "width": "250px" }
                          }, null, 8, ["value"]),
                          createVNode(unref(Button), {
                            loading: refreshing.value,
                            onClick: refresh
                          }, {
                            default: withCtx(() => [..._cache[54] || (_cache[54] = [
                              createTextVNode("查询", -1)
                            ])]),
                            _: 1
                          }, 8, ["loading"]),
                          can("create") ? (openBlock(), createBlock(unref(Button), {
                            key: 0,
                            type: "primary",
                            onClick: openCreateOrder
                          }, {
                            default: withCtx(() => [..._cache[55] || (_cache[55] = [
                              createTextVNode("登记预约", -1)
                            ])]),
                            _: 1
                          })) : createCommentVNode("", true)
                        ]),
                        _: 1
                      })
                    ]),
                    default: withCtx(() => [
                      createVNode(_sfc_main$2, {
                        columns: orderColumns,
                        data: unref(store).orders,
                        loading: unref(store).loading,
                        pagination: { pageSize: 15 }
                      }, null, 8, ["data", "loading"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(NTabPane), {
                name: "inventory",
                tab: "库存去向"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    "header-extra": withCtx(() => [
                      createVNode(unref(Button), {
                        onClick: _cache[3] || (_cache[3] = ($event) => unref(store).fetchInventory())
                      }, {
                        default: withCtx(() => [..._cache[56] || (_cache[56] = [
                          createTextVNode("刷新", -1)
                        ])]),
                        _: 1
                      })
                    ]),
                    default: withCtx(() => [
                      createVNode(_sfc_main$2, {
                        columns: inventoryColumns,
                        data: unref(store).inventory,
                        pagination: { pageSize: 15 }
                      }, null, 8, ["data"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(NTabPane), {
                name: "categories",
                tab: "品类与价格"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    "header-extra": withCtx(() => [
                      can("category") ? (openBlock(), createBlock(unref(Button), {
                        key: 0,
                        type: "primary",
                        onClick: _cache[4] || (_cache[4] = ($event) => openCategory())
                      }, {
                        default: withCtx(() => [..._cache[57] || (_cache[57] = [
                          createTextVNode("新增品类", -1)
                        ])]),
                        _: 1
                      })) : createCommentVNode("", true)
                    ]),
                    default: withCtx(() => [
                      createVNode(_sfc_main$2, {
                        columns: categoryColumns,
                        data: unref(store).categories,
                        pagination: false
                      }, null, 8, ["data"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(NTabPane), {
                name: "stats",
                tab: "积分与统计"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NGrid), {
                    cols: 2,
                    "x-gap": 16
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NGridItem), null, {
                        default: withCtx(() => [
                          createVNode(unref(NCard), { title: "品类汇总" }, {
                            default: withCtx(() => [
                              createVNode(_sfc_main$2, {
                                columns: [
                                  { title: "品类", key: "category_name" },
                                  { title: "重量(kg)", key: "weight" },
                                  { title: "金额", key: "amount_cents", render: (row) => yuan(row.amount_cents) }
                                ],
                                data: unref(store).stats.by_category,
                                pagination: false
                              }, null, 8, ["columns", "data"])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NGridItem), null, {
                        default: withCtx(() => [
                          createVNode(unref(NCard), { title: "月度趋势" }, {
                            default: withCtx(() => [
                              createVNode(_sfc_main$2, {
                                columns: [
                                  { title: "月份", key: "month" },
                                  { title: "单量", key: "orders" },
                                  { title: "重量(kg)", key: "weight" },
                                  { title: "金额", key: "amount_cents", render: (row) => yuan(row.amount_cents) }
                                ],
                                data: unref(store).stats.monthly_trend,
                                pagination: false
                              }, null, 8, ["columns", "data"])
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
                    title: "积分流水",
                    class: "mt-3"
                  }, {
                    default: withCtx(() => [
                      createVNode(_sfc_main$2, {
                        columns: pointColumns,
                        data: unref(store).pointsLedger,
                        pagination: { pageSize: 10 }
                      }, null, 8, ["data"])
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
            show: showOrderModal.value,
            "onUpdate:show": _cache[16] || (_cache[16] = ($event) => showOrderModal.value = $event),
            preset: "card",
            title: "登记回收预约",
            style: { "width": "700px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[15] || (_cache[15] = ($event) => showOrderModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[59] || (_cache[59] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: saveOrder
                  }, {
                    default: withCtx(() => [..._cache[60] || (_cache[60] = [
                      createTextVNode("保存预约", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(NForm), {
                model: orderForm.value,
                "label-placement": "left",
                "label-width": "90"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NGrid), {
                    cols: 2,
                    "x-gap": 18
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NGridItem), null, {
                        default: withCtx(() => [
                          createVNode(unref(NFormItem), { label: "来源" }, {
                            default: withCtx(() => [
                              createVNode(unref(NSelect), {
                                value: orderForm.value.source_type,
                                "onUpdate:value": _cache[6] || (_cache[6] = ($event) => orderForm.value.source_type = $event),
                                options: sourceOptions
                              }, null, 8, ["value"])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NGridItem), null, {
                        default: withCtx(() => [
                          orderForm.value.source_type === "elderly" ? (openBlock(), createBlock(unref(NFormItem), {
                            key: 0,
                            label: "关联老人"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(NSelect), {
                                value: orderForm.value.elderly_id,
                                "onUpdate:value": [
                                  _cache[7] || (_cache[7] = ($event) => orderForm.value.elderly_id = $event),
                                  selectElderly
                                ],
                                options: elderlyOptions.value,
                                filterable: "",
                                clearable: ""
                              }, null, 8, ["value", "options"])
                            ]),
                            _: 1
                          })) : createCommentVNode("", true)
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NGridItem), null, {
                        default: withCtx(() => [
                          createVNode(unref(NFormItem), {
                            label: "联系人",
                            required: ""
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(NInput), {
                                value: orderForm.value.contact_name,
                                "onUpdate:value": _cache[8] || (_cache[8] = ($event) => orderForm.value.contact_name = $event)
                              }, null, 8, ["value"])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NGridItem), null, {
                        default: withCtx(() => [
                          createVNode(unref(NFormItem), { label: "联系电话" }, {
                            default: withCtx(() => [
                              createVNode(unref(NInput), {
                                value: orderForm.value.contact_phone,
                                "onUpdate:value": _cache[9] || (_cache[9] = ($event) => orderForm.value.contact_phone = $event)
                              }, null, 8, ["value"])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NGridItem), null, {
                        default: withCtx(() => [
                          createVNode(unref(NFormItem), { label: "回收方式" }, {
                            default: withCtx(() => [
                              createVNode(unref(NSelect), {
                                value: orderForm.value.pickup_type,
                                "onUpdate:value": _cache[10] || (_cache[10] = ($event) => orderForm.value.pickup_type = $event),
                                options: pickupOptions
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
                            label: "预约时间",
                            required: ""
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(NDatePicker), {
                                "formatted-value": orderForm.value.appointment_at,
                                "onUpdate:formattedValue": _cache[11] || (_cache[11] = ($event) => orderForm.value.appointment_at = $event),
                                type: "datetime",
                                "value-format": "yyyy-MM-dd HH:mm:ss",
                                style: { "width": "100%" }
                              }, null, 8, ["formatted-value"])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NGridItem), { span: 2 }, {
                        default: withCtx(() => [
                          createVNode(unref(NFormItem), {
                            label: "地址",
                            required: orderForm.value.pickup_type === "pickup"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(NInput), {
                                value: orderForm.value.pickup_address,
                                "onUpdate:value": _cache[12] || (_cache[12] = ($event) => orderForm.value.pickup_address = $event)
                              }, null, 8, ["value"])
                            ]),
                            _: 1
                          }, 8, ["required"])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NGridItem), null, {
                        default: withCtx(() => [
                          createVNode(unref(NFormItem), { label: "预估重量" }, {
                            default: withCtx(() => [
                              createVNode(unref(NInputNumber), {
                                value: orderForm.value.estimated_weight,
                                "onUpdate:value": _cache[13] || (_cache[13] = ($event) => orderForm.value.estimated_weight = $event),
                                min: 0,
                                precision: 3
                              }, {
                                suffix: withCtx(() => [..._cache[58] || (_cache[58] = [
                                  createTextVNode("kg", -1)
                                ])]),
                                _: 1
                              }, 8, ["value"])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NGridItem), null, {
                        default: withCtx(() => [
                          createVNode(unref(NFormItem), { label: "备注" }, {
                            default: withCtx(() => [
                              createVNode(unref(NInput), {
                                value: orderForm.value.remark,
                                "onUpdate:value": _cache[14] || (_cache[14] = ($event) => orderForm.value.remark = $event)
                              }, null, 8, ["value"])
                            ]),
                            _: 1
                          })
                        ]),
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
          }, 8, ["show"]),
          createVNode(unref(NModal), {
            show: showAssignModal.value,
            "onUpdate:show": _cache[19] || (_cache[19] = ($event) => showAssignModal.value = $event),
            preset: "card",
            title: "派单",
            style: { "width": "430px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[18] || (_cache[18] = ($event) => showAssignModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[61] || (_cache[61] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: saveAssign
                  }, {
                    default: withCtx(() => [..._cache[62] || (_cache[62] = [
                      createTextVNode("确认派单", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(NFormItem), { label: "回收负责人" }, {
                default: withCtx(() => [
                  createVNode(unref(NSelect), {
                    value: assigneeId.value,
                    "onUpdate:value": _cache[17] || (_cache[17] = ($event) => assigneeId.value = $event),
                    options: userOptions.value,
                    filterable: ""
                  }, null, 8, ["value", "options"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["show"]),
          createVNode(unref(NModal), {
            show: showWeighModal.value,
            "onUpdate:show": _cache[22] || (_cache[22] = ($event) => showWeighModal.value = $event),
            preset: "card",
            title: "称重计价",
            style: { "width": "920px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[21] || (_cache[21] = ($event) => showWeighModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[68] || (_cache[68] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: saveWeigh
                  }, {
                    default: withCtx(() => [..._cache[69] || (_cache[69] = [
                      createTextVNode("保存称重", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              (openBlock(true), createElementBlock(Fragment, null, renderList(weighDrafts.value, (item, index) => {
                return openBlock(), createElementBlock("div", {
                  key: index,
                  class: "mb-3"
                }, [
                  createVNode(unref(NSpace), {
                    align: "center",
                    wrap: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: item.category_id,
                        "onUpdate:value": [($event) => item.category_id = $event, (value) => selectCategory(item, value)],
                        options: categoryOptions.value,
                        style: { "width": "180px" }
                      }, null, 8, ["value", "onUpdate:value", "options"]),
                      createVNode(unref(NInput), {
                        value: item.material_name,
                        "onUpdate:value": ($event) => item.material_name = $event,
                        placeholder: "物料名称",
                        style: { "width": "120px" }
                      }, null, 8, ["value", "onUpdate:value"]),
                      createVNode(unref(NInputNumber), {
                        value: item.gross_weight,
                        "onUpdate:value": ($event) => item.gross_weight = $event,
                        min: 1e-3,
                        precision: 3,
                        placeholder: "毛重",
                        style: { "width": "115px" }
                      }, {
                        suffix: withCtx(() => [..._cache[63] || (_cache[63] = [
                          createTextVNode("kg", -1)
                        ])]),
                        _: 1
                      }, 8, ["value", "onUpdate:value"]),
                      createVNode(unref(NInputNumber), {
                        value: item.tare_weight,
                        "onUpdate:value": ($event) => item.tare_weight = $event,
                        min: 0,
                        precision: 3,
                        placeholder: "皮重",
                        style: { "width": "115px" }
                      }, {
                        suffix: withCtx(() => [..._cache[64] || (_cache[64] = [
                          createTextVNode("kg", -1)
                        ])]),
                        _: 1
                      }, 8, ["value", "onUpdate:value"]),
                      createVNode(unref(NInputNumber), {
                        value: item.unit_price_yuan,
                        "onUpdate:value": ($event) => item.unit_price_yuan = $event,
                        min: 0,
                        precision: 2,
                        placeholder: "单价",
                        style: { "width": "120px" }
                      }, {
                        prefix: withCtx(() => [..._cache[65] || (_cache[65] = [
                          createTextVNode("¥", -1)
                        ])]),
                        _: 1
                      }, 8, ["value", "onUpdate:value"]),
                      createVNode(unref(NSelect), {
                        value: item.quality_grade,
                        "onUpdate:value": ($event) => item.quality_grade = $event,
                        options: gradeOptions,
                        style: { "width": "90px" }
                      }, null, 8, ["value", "onUpdate:value"]),
                      createVNode(unref(NTag), null, {
                        default: withCtx(() => [
                          createTextVNode("净重 " + toDisplayString(Math.max(0, Number(item.gross_weight || 0) - item.tare_weight).toFixed(3)) + "kg", 1)
                        ]),
                        _: 2
                      }, 1024),
                      weighDrafts.value.length > 1 ? (openBlock(), createBlock(unref(Button), {
                        key: 0,
                        type: "error",
                        size: "small",
                        onClick: ($event) => weighDrafts.value.splice(index, 1)
                      }, {
                        default: withCtx(() => [..._cache[66] || (_cache[66] = [
                          createTextVNode("删除", -1)
                        ])]),
                        _: 1
                      }, 8, ["onClick"])) : createCommentVNode("", true)
                    ]),
                    _: 2
                  }, 1024)
                ]);
              }), 128)),
              createVNode(unref(NDivider)),
              createVNode(unref(NSpace), { justify: "space-between" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[20] || (_cache[20] = ($event) => weighDrafts.value.push(emptyWeighDraft()))
                  }, {
                    default: withCtx(() => [..._cache[67] || (_cache[67] = [
                      createTextVNode("添加明细", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(NStatistic), {
                    label: "预计结算",
                    value: weighTotal.value,
                    precision: 2,
                    prefix: "¥"
                  }, null, 8, ["value"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["show"]),
          createVNode(unref(NModal), {
            show: showSettlementModal.value,
            "onUpdate:show": _cache[30] || (_cache[30] = ($event) => showSettlementModal.value = $event),
            preset: "card",
            title: "回收结算",
            style: { "width": "560px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[29] || (_cache[29] = ($event) => showSettlementModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[71] || (_cache[71] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: saveSettlement
                  }, {
                    default: withCtx(() => [..._cache[72] || (_cache[72] = [
                      createTextVNode("确认结算并入库", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(NForm), {
                model: settlementForm.value,
                "label-placement": "left",
                "label-width": "95"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), { label: "结算方式" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: settlementForm.value.method,
                        "onUpdate:value": _cache[23] || (_cache[23] = ($event) => settlementForm.value.method = $event),
                        options: settlementOptions
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  ["cash", "bank"].includes(settlementForm.value.method) ? (openBlock(), createBlock(unref(NFormItem), {
                    key: 0,
                    label: "结算金额"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInputNumber), {
                        value: settlementForm.value.cash_amount_yuan,
                        "onUpdate:value": _cache[24] || (_cache[24] = ($event) => settlementForm.value.cash_amount_yuan = $event),
                        min: 0,
                        precision: 2
                      }, {
                        prefix: withCtx(() => [..._cache[70] || (_cache[70] = [
                          createTextVNode("¥", -1)
                        ])]),
                        _: 1
                      }, 8, ["value"])
                    ]),
                    _: 1
                  })) : createCommentVNode("", true),
                  settlementForm.value.method === "points" ? (openBlock(), createBlock(unref(NFormItem), {
                    key: 1,
                    label: "发放积分"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInputNumber), {
                        value: settlementForm.value.points,
                        "onUpdate:value": _cache[25] || (_cache[25] = ($event) => settlementForm.value.points = $event),
                        min: 0,
                        precision: 0
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  })) : createCommentVNode("", true),
                  createVNode(unref(NFormItem), { label: "收款/受益人" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: settlementForm.value.payee,
                        "onUpdate:value": _cache[26] || (_cache[26] = ($event) => settlementForm.value.payee = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "入库位置" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: settlementForm.value.storage_location,
                        "onUpdate:value": _cache[27] || (_cache[27] = ($event) => settlementForm.value.storage_location = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "备注" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: settlementForm.value.remark,
                        "onUpdate:value": _cache[28] || (_cache[28] = ($event) => settlementForm.value.remark = $event)
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
            show: showCancelModal.value,
            "onUpdate:show": _cache[33] || (_cache[33] = ($event) => showCancelModal.value = $event),
            preset: "card",
            title: "取消回收单",
            style: { "width": "480px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[32] || (_cache[32] = ($event) => showCancelModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[73] || (_cache[73] = [
                      createTextVNode("返回", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "error",
                    onClick: saveCancel
                  }, {
                    default: withCtx(() => [..._cache[74] || (_cache[74] = [
                      createTextVNode("确认取消", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(NFormItem), {
                label: "取消原因",
                required: ""
              }, {
                default: withCtx(() => [
                  createVNode(unref(NInput), {
                    value: cancelReason.value,
                    "onUpdate:value": _cache[31] || (_cache[31] = ($event) => cancelReason.value = $event),
                    type: "textarea"
                  }, null, 8, ["value"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["show"]),
          createVNode(unref(NModal), {
            show: showDetailModal.value,
            "onUpdate:show": _cache[34] || (_cache[34] = ($event) => showDetailModal.value = $event),
            preset: "card",
            title: "回收单详情",
            style: { "width": "850px" }
          }, {
            default: withCtx(() => [
              currentOrder.value ? (openBlock(), createBlock(unref(NDescriptions), {
                key: 0,
                bordered: "",
                column: 3,
                "label-placement": "left"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NDescriptionsItem), { label: "回收单号" }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(currentOrder.value.order_no), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NDescriptionsItem), { label: "状态" }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(statusMap[currentOrder.value.status].label), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NDescriptionsItem), { label: "预约时间" }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(currentOrder.value.appointment_at), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NDescriptionsItem), { label: "联系人" }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(currentOrder.value.contact_name), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NDescriptionsItem), { label: "负责人" }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(currentOrder.value.assignee_name || "—"), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NDescriptionsItem), { label: "回收地址" }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(currentOrder.value.pickup_address || "—"), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NDescriptionsItem), { label: "总重量" }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(weight(currentOrder.value.total_weight)), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NDescriptionsItem), { label: "总金额" }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(yuan(currentOrder.value.total_amount_cents)), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NDescriptionsItem), { label: "积分" }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(currentOrder.value.points), 1)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })) : createCommentVNode("", true),
              createVNode(unref(NDivider), null, {
                default: withCtx(() => [..._cache[75] || (_cache[75] = [
                  createTextVNode("称重明细", -1)
                ])]),
                _: 1
              }),
              createVNode(_sfc_main$2, {
                columns: itemColumns,
                data: unref(store).currentItems,
                pagination: false
              }, null, 8, ["data"]),
              unref(store).currentSettlement ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                createVNode(unref(NDivider), null, {
                  default: withCtx(() => [..._cache[76] || (_cache[76] = [
                    createTextVNode("结算信息", -1)
                  ])]),
                  _: 1
                }),
                createVNode(unref(NDescriptions), {
                  bordered: "",
                  column: 3
                }, {
                  default: withCtx(() => [
                    createVNode(unref(NDescriptionsItem), { label: "结算单号" }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(unref(store).currentSettlement.settlement_no), 1)
                      ]),
                      _: 1
                    }),
                    createVNode(unref(NDescriptionsItem), { label: "方式" }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(settlementOptions.find((item) => item.value === unref(store).currentSettlement?.method)?.label), 1)
                      ]),
                      _: 1
                    }),
                    createVNode(unref(NDescriptionsItem), { label: "金额/积分" }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(yuan(unref(store).currentSettlement.cash_amount_cents)) + " / " + toDisplayString(unref(store).currentSettlement.points) + "分", 1)
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ], 64)) : createCommentVNode("", true)
            ]),
            _: 1
          }, 8, ["show"]),
          createVNode(unref(NModal), {
            show: showInventoryModal.value,
            "onUpdate:show": _cache[42] || (_cache[42] = ($event) => showInventoryModal.value = $event),
            preset: "card",
            title: inventoryForm.value.transaction_type === "out" ? "回收物出库" : "库存盘点调整",
            style: { "width": "560px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[41] || (_cache[41] = ($event) => showInventoryModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[78] || (_cache[78] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: saveInventory
                  }, {
                    default: withCtx(() => [..._cache[79] || (_cache[79] = [
                      createTextVNode("确认", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(NForm), {
                model: inventoryForm.value,
                "label-placement": "left",
                "label-width": "85"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), { label: "当前库存" }, {
                    default: withCtx(() => [
                      createVNode(unref(NTag), null, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(currentLot.value?.remaining_quantity) + " " + toDisplayString(currentLot.value?.unit), 1)
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "数量",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInputNumber), {
                        value: inventoryForm.value.quantity,
                        "onUpdate:value": _cache[35] || (_cache[35] = ($event) => inventoryForm.value.quantity = $event),
                        min: inventoryForm.value.transaction_type === "out" ? 1e-3 : void 0,
                        max: inventoryForm.value.transaction_type === "out" ? currentLot.value?.remaining_quantity : void 0,
                        precision: 3
                      }, null, 8, ["value", "min", "max"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "去向",
                    required: inventoryForm.value.transaction_type === "out"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: inventoryForm.value.destination,
                        "onUpdate:value": _cache[36] || (_cache[36] = ($event) => inventoryForm.value.destination = $event),
                        placeholder: "再生资源企业/公益捐赠/无害化处理等"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }, 8, ["required"]),
                  createVNode(unref(NFormItem), { label: "接收方" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: inventoryForm.value.counterparty,
                        "onUpdate:value": _cache[37] || (_cache[37] = ($event) => inventoryForm.value.counterparty = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "出售价" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInputNumber), {
                        value: inventoryForm.value.unit_price_yuan,
                        "onUpdate:value": _cache[38] || (_cache[38] = ($event) => inventoryForm.value.unit_price_yuan = $event),
                        min: 0,
                        precision: 2
                      }, {
                        prefix: withCtx(() => [..._cache[77] || (_cache[77] = [
                          createTextVNode("¥", -1)
                        ])]),
                        _: 1
                      }, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "发生时间" }, {
                    default: withCtx(() => [
                      createVNode(unref(NDatePicker), {
                        "formatted-value": inventoryForm.value.occurred_at,
                        "onUpdate:formattedValue": _cache[39] || (_cache[39] = ($event) => inventoryForm.value.occurred_at = $event),
                        type: "datetime",
                        "value-format": "yyyy-MM-dd HH:mm:ss",
                        style: { "width": "100%" }
                      }, null, 8, ["formatted-value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "备注" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: inventoryForm.value.remark,
                        "onUpdate:value": _cache[40] || (_cache[40] = ($event) => inventoryForm.value.remark = $event)
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
            show: showTransactionsModal.value,
            "onUpdate:show": _cache[43] || (_cache[43] = ($event) => showTransactionsModal.value = $event),
            preset: "card",
            title: "库存流水",
            style: { "width": "900px" }
          }, {
            default: withCtx(() => [
              createVNode(_sfc_main$2, {
                columns: transactionColumns,
                data: unref(store).inventoryTransactions,
                pagination: false
              }, null, 8, ["data"])
            ]),
            _: 1
          }, 8, ["show"]),
          createVNode(unref(NModal), {
            show: showCategoryModal.value,
            "onUpdate:show": _cache[53] || (_cache[53] = ($event) => showCategoryModal.value = $event),
            preset: "card",
            title: "回收品类",
            style: { "width": "520px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[52] || (_cache[52] = ($event) => showCategoryModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[81] || (_cache[81] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: saveCategory
                  }, {
                    default: withCtx(() => [..._cache[82] || (_cache[82] = [
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
                model: categoryForm.value,
                "label-placement": "left",
                "label-width": "90"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NGrid), {
                    cols: 2,
                    "x-gap": 16
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NGridItem), null, {
                        default: withCtx(() => [
                          createVNode(unref(NFormItem), {
                            label: "编码",
                            required: ""
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(NInput), {
                                value: categoryForm.value.code,
                                "onUpdate:value": _cache[44] || (_cache[44] = ($event) => categoryForm.value.code = $event)
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
                            label: "名称",
                            required: ""
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(NInput), {
                                value: categoryForm.value.name,
                                "onUpdate:value": _cache[45] || (_cache[45] = ($event) => categoryForm.value.name = $event)
                              }, null, 8, ["value"])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NGridItem), null, {
                        default: withCtx(() => [
                          createVNode(unref(NFormItem), { label: "计量单位" }, {
                            default: withCtx(() => [
                              createVNode(unref(NInput), {
                                value: categoryForm.value.unit,
                                "onUpdate:value": _cache[46] || (_cache[46] = ($event) => categoryForm.value.unit = $event)
                              }, null, 8, ["value"])
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
                                value: categoryForm.value.sort_order,
                                "onUpdate:value": _cache[47] || (_cache[47] = ($event) => categoryForm.value.sort_order = $event),
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
                          createVNode(unref(NFormItem), { label: "指导价" }, {
                            default: withCtx(() => [
                              createVNode(unref(NInputNumber), {
                                value: categoryForm.value.guide_price_yuan,
                                "onUpdate:value": _cache[48] || (_cache[48] = ($event) => categoryForm.value.guide_price_yuan = $event),
                                min: 0,
                                precision: 2
                              }, {
                                prefix: withCtx(() => [..._cache[80] || (_cache[80] = [
                                  createTextVNode("¥", -1)
                                ])]),
                                _: 1
                              }, 8, ["value"])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NGridItem), null, {
                        default: withCtx(() => [
                          createVNode(unref(NFormItem), { label: "积分/单位" }, {
                            default: withCtx(() => [
                              createVNode(unref(NInputNumber), {
                                value: categoryForm.value.points_per_unit,
                                "onUpdate:value": _cache[49] || (_cache[49] = ($event) => categoryForm.value.points_per_unit = $event),
                                min: 0,
                                precision: 0
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
                                value: categoryForm.value.status,
                                "onUpdate:value": _cache[50] || (_cache[50] = ($event) => categoryForm.value.status = $event),
                                options: categoryStatusOptions
                              }, null, 8, ["value"])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NGridItem), null, {
                        default: withCtx(() => [
                          createVNode(unref(NFormItem), { label: "备注" }, {
                            default: withCtx(() => [
                              createVNode(unref(NInput), {
                                value: categoryForm.value.remark,
                                "onUpdate:value": _cache[51] || (_cache[51] = ($event) => categoryForm.value.remark = $event)
                              }, null, 8, ["value"])
                            ]),
                            _: 1
                          })
                        ]),
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
