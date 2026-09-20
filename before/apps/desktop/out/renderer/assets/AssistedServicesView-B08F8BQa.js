import { _ as _sfc_main$1 } from "./BasePage.vue_vue_type_script_setup_true_lang-CTneexfB.js";
import { _ as _sfc_main$2 } from "./BaseTable.vue_vue_type_script_setup_true_lang-B36jvMQ5.js";
import { u as useAuthStore } from "./index-4Egxykc2.js";
import { S as defineStore, r as ref, l as defineComponent, o as onMounted, a1 as createElementBlock, X as createVNode, W as withCtx, u as unref, F as Fragment, c as computed, V as openBlock, U as createBlock, k as createTextVNode, a7 as createCommentVNode, a6 as renderList, a3 as createBaseVNode, a9 as toDisplayString, q as h } from "./vendor-vue-Ccw0-9Al.js";
import { u as useMessage, h as NModal, P as NGrid, M as NGridItem, g as NCard, O as NStatistic, S as NTabs, T as NTabPane, v as NSpace, B as Button, j as NForm, k as NFormItem, J as NSelect, l as NInput, U as NInputNumber, R as NDescriptionsItem, Q as NDescriptions, o as NTag } from "./vendor-naive-DlmVkmqb.js";
import "./vendor-query-Q9Uykhde.js";
import "./vendor-echarts-dbJmlwEq.js";
const emptyStats = () => ({
  purchase_total: 0,
  purchase_pending: 0,
  purchase_month_amount_cents: 0,
  referral_total: 0,
  referral_pending: 0,
  referral_follow_up: 0,
  active_partners: 0
});
const useAssistedServicesStore = defineStore("assisted-services", () => {
  const serviceCatalog = ref([]);
  const purchaseOrders = ref([]);
  const purchaseItems = ref([]);
  const partners = ref([]);
  const referrals = ref([]);
  const followUps = ref([]);
  const stats = ref(emptyStats());
  const loading = ref(false);
  async function fetchServiceCatalog(activeOnly = false) {
    serviceCatalog.value = await window.api.assistedServices.catalog.list(activeOnly);
  }
  async function createServiceCatalog(data) {
    const row = await window.api.assistedServices.catalog.create(data);
    await fetchServiceCatalog();
    return row;
  }
  async function updateServiceCatalog(id, data) {
    const row = await window.api.assistedServices.catalog.update(id, data);
    await fetchServiceCatalog();
    return row;
  }
  async function fetchPurchases(query = {}) {
    purchaseOrders.value = await window.api.assistedServices.purchase.list(query);
  }
  async function createPurchase(order, items) {
    const row = await window.api.assistedServices.purchase.create(order, items);
    await Promise.all([fetchPurchases(), fetchStats()]);
    return row;
  }
  async function fetchPurchaseItems(id) {
    purchaseItems.value = await window.api.assistedServices.purchase.items(id);
  }
  async function purchaseAction(action) {
    await action();
    await Promise.all([fetchPurchases(), fetchStats()]);
  }
  async function fetchPartners(activeOnly = false) {
    partners.value = await window.api.assistedServices.partner.list(activeOnly);
  }
  async function createPartner(data) {
    const row = await window.api.assistedServices.partner.create(data);
    await Promise.all([fetchPartners(), fetchStats()]);
    return row;
  }
  async function updatePartner(id, data) {
    const row = await window.api.assistedServices.partner.update(id, data);
    await Promise.all([fetchPartners(), fetchStats()]);
    return row;
  }
  async function fetchReferrals(query = {}) {
    referrals.value = await window.api.assistedServices.referral.list(query);
  }
  async function createReferral(data) {
    const row = await window.api.assistedServices.referral.create(data);
    await Promise.all([fetchReferrals(), fetchStats()]);
    return row;
  }
  async function referralAction(action) {
    await action();
    await Promise.all([fetchReferrals(), fetchStats()]);
  }
  async function completeReferral(id, data) {
    await referralAction(() => window.api.assistedServices.referral.complete(id, data));
  }
  async function fetchFollowUps(referralId) {
    followUps.value = await window.api.assistedServices.followUp.list(referralId);
  }
  async function createFollowUp(data) {
    const row = await window.api.assistedServices.followUp.create(data);
    await Promise.all([fetchFollowUps(), fetchReferrals(), fetchStats()]);
    return row;
  }
  async function fetchStats() {
    stats.value = await window.api.assistedServices.stats();
  }
  async function refreshAll() {
    loading.value = true;
    try {
      await Promise.all([fetchServiceCatalog(), fetchPurchases(), fetchPartners(), fetchReferrals(), fetchFollowUps(), fetchStats()]);
    } finally {
      loading.value = false;
    }
  }
  return {
    serviceCatalog,
    purchaseOrders,
    purchaseItems,
    partners,
    referrals,
    followUps,
    stats,
    loading,
    fetchServiceCatalog,
    createServiceCatalog,
    updateServiceCatalog,
    fetchPurchases,
    createPurchase,
    fetchPurchaseItems,
    purchaseAction,
    fetchPartners,
    createPartner,
    updatePartner,
    fetchReferrals,
    createReferral,
    referralAction,
    completeReferral,
    fetchFollowUps,
    createFollowUp,
    fetchStats,
    refreshAll
  };
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AssistedServicesView",
  setup(__props) {
    const store = useAssistedServicesStore();
    const auth = useAuthStore();
    const message = useMessage();
    const elderly = ref([]);
    const users = ref([]);
    const activeTab = ref("purchase");
    const can = (action) => auth.canUseButton(`assisted-services:${action}`);
    const yuan = (cents) => `¥${(Number(cents || 0) / 100).toFixed(2)}`;
    const elderlyName = (id) => elderly.value.find((item) => item.id === id)?.name ?? id;
    const userName = (id) => {
      const user = users.value.find((item) => item.id === id);
      return user?.real_name || user?.username || id;
    };
    const elderlyOptions = computed(() => elderly.value.map((item) => ({ label: `${item.name}${item.room_no ? ` · ${item.room_no}` : ""}`, value: item.id })));
    const userOptions = computed(() => users.value.filter((item) => item.status === "active").map((item) => ({ label: item.real_name || item.username, value: item.id })));
    const partnerOptions = computed(() => store.partners.filter((item) => item.status === "active").map((item) => ({ label: item.name, value: item.id })));
    const serviceOptions = computed(() => store.serviceCatalog.filter((item) => item.status === "active").map((item) => ({
      label: `${item.name}（${item.charge_mode === "free" ? "免费" : item.charge_mode === "fixed" ? `${yuan(item.default_service_fee_cents)}/单` : "按单计费"}）`,
      value: item.id
    })));
    const purchaseCategories = [
      { label: "外卖餐食", value: "takeaway" },
      { label: "药品", value: "medicine" },
      { label: "生活用品", value: "daily_goods" },
      { label: "代拿快递", value: "package_pickup" },
      { label: "其他跑腿", value: "errand" },
      { label: "其他", value: "other" }
    ];
    const chargeModeOptions = [
      { label: "本单免费", value: "free" },
      { label: "固定收费", value: "fixed" },
      { label: "按本单自定义", value: "custom" }
    ];
    const purchaseStatus = {
      pending: { label: "待派单", type: "warning" },
      assigned: { label: "已派单", type: "info" },
      purchasing: { label: "采购中", type: "info" },
      delivering: { label: "配送中", type: "info" },
      delivered: { label: "待结算", type: "warning" },
      settled: { label: "已结算", type: "success" },
      cancelled: { label: "已取消", type: "error" }
    };
    const referralStatus = {
      pending: { label: "待确认", type: "warning" },
      confirmed: { label: "已确认", type: "info" },
      departed: { label: "已出发", type: "info" },
      in_consultation: { label: "就诊中", type: "warning" },
      completed: { label: "待随访", type: "success" },
      follow_up: { label: "随访中", type: "success" },
      cancelled: { label: "已取消", type: "error" }
    };
    async function run(action, success) {
      try {
        await action();
        if (success) message.success(success);
      } catch (error) {
        message.error(error instanceof Error ? error.message : String(error));
      }
    }
    async function refresh() {
      await run(() => store.refreshAll());
    }
    const showPurchase = ref(false);
    const purchaseForm = ref({
      elderly_id: null,
      service_catalog_id: null,
      category: "takeaway",
      charge_mode: "custom",
      requester_name: "",
      requester_phone: "",
      merchant_name: "",
      delivery_address: "",
      expected_at: "",
      delivery_fee_yuan: 0,
      service_fee_yuan: 0,
      advance_amount_yuan: 0,
      prescription_required: 0,
      prescription_no: "",
      remark: ""
    });
    const purchaseDrafts = ref([]);
    const emptyPurchaseDraft = () => ({ item_name: "", specification: "", quantity: 1, unit: "件", unit_price_yuan: 0, medicine_type: null, dosage: "", remark: "" });
    function openPurchase() {
      const service = store.serviceCatalog.find((item) => item.status === "active");
      purchaseForm.value = {
        elderly_id: null,
        service_catalog_id: service?.id ?? null,
        category: service?.category ?? "takeaway",
        charge_mode: service?.charge_mode ?? "custom",
        requester_name: "",
        requester_phone: "",
        merchant_name: "",
        delivery_address: "",
        expected_at: new Date(Date.now() + 36e5).toISOString().slice(0, 16).replace("T", " "),
        delivery_fee_yuan: 0,
        service_fee_yuan: (service?.default_service_fee_cents ?? 0) / 100,
        advance_amount_yuan: 0,
        prescription_required: 0,
        prescription_no: "",
        remark: ""
      };
      purchaseDrafts.value = [emptyPurchaseDraft()];
      showPurchase.value = true;
    }
    function selectService(id) {
      const service = store.serviceCatalog.find((item) => item.id === id);
      if (!service) return;
      purchaseForm.value.category = service.category;
      purchaseForm.value.charge_mode = service.charge_mode;
      purchaseForm.value.service_fee_yuan = service.charge_mode === "free" ? 0 : service.default_service_fee_cents / 100;
      if (service.category === "package_pickup" && purchaseDrafts.value.length === 1 && !purchaseDrafts.value[0]?.item_name) {
        purchaseDrafts.value[0] = { ...emptyPurchaseDraft(), item_name: "快递包裹", unit: "件" };
      }
    }
    function selectChargeMode(mode) {
      const service = store.serviceCatalog.find((item) => item.id === purchaseForm.value.service_catalog_id);
      purchaseForm.value.service_fee_yuan = mode === "free" ? 0 : mode === "fixed" ? (service?.default_service_fee_cents ?? 0) / 100 : purchaseForm.value.service_fee_yuan;
    }
    function selectPurchaseElderly(id) {
      const row = elderly.value.find((item) => item.id === id);
      if (!row) return;
      purchaseForm.value.requester_name = row.name;
      purchaseForm.value.requester_phone = row.phone ?? "";
      purchaseForm.value.delivery_address = row.room_no ? `院内 ${row.room_no}` : row.address ?? "";
    }
    const purchaseTotal = computed(() => purchaseDrafts.value.reduce((sum, item) => sum + item.quantity * item.unit_price_yuan, 0) + purchaseForm.value.delivery_fee_yuan + purchaseForm.value.service_fee_yuan);
    async function savePurchase() {
      const form = purchaseForm.value;
      if (!form.elderly_id || !form.service_catalog_id || !form.requester_name.trim() || !form.delivery_address.trim()) return message.error("请选择老人和服务项目，并填写申请人和送达地址");
      if (purchaseDrafts.value.some((item) => !item.item_name.trim() || item.quantity <= 0 || item.unit_price_yuan < 0)) return message.error("请完整填写商品明细");
      await run(async () => {
        await store.createPurchase({
          elderly_id: form.elderly_id,
          service_catalog_id: form.service_catalog_id,
          category: form.category,
          charge_mode: form.charge_mode,
          requester_name: form.requester_name,
          requester_phone: form.requester_phone || null,
          merchant_name: form.merchant_name || null,
          delivery_address: form.delivery_address,
          expected_at: form.expected_at || null,
          delivery_fee_cents: Math.round(form.delivery_fee_yuan * 100),
          service_fee_cents: Math.round(form.service_fee_yuan * 100),
          advance_amount_cents: Math.round(form.advance_amount_yuan * 100),
          prescription_required: form.prescription_required,
          prescription_no: form.prescription_no || null,
          created_by: auth.currentUser?.id ?? null,
          created_by_name: auth.currentUser?.real_name ?? auth.currentUser?.username ?? null,
          remark: form.remark || null
        }, purchaseDrafts.value.map((item) => ({
          item_name: item.item_name,
          specification: item.specification || null,
          quantity: item.quantity,
          unit: item.unit,
          unit_price_cents: Math.round(item.unit_price_yuan * 100),
          medicine_type: form.category === "medicine" ? item.medicine_type ?? "otc" : null,
          dosage: item.dosage || null,
          remark: item.remark || null
        })));
        showPurchase.value = false;
      }, "代买订单已登记");
    }
    const currentPurchase = ref(null);
    const currentReferral = ref(null);
    const showAction = ref(false);
    const actionMode = ref("assign");
    const actionValue = ref(null);
    const actionExtra = ref("");
    const actionTitle = computed(() => ({
      assign: "指派代办人员",
      prescription: "核验药品处方",
      sign: "配送签收",
      settle: "订单结算",
      cancel_purchase: "取消代买订单",
      cancel_referral: "取消就医协作"
    })[actionMode.value]);
    function openAction(mode, purchase, referral) {
      actionMode.value = mode;
      currentPurchase.value = purchase ?? null;
      currentReferral.value = referral ?? null;
      actionValue.value = mode === "settle" ? purchase?.total_amount_cents === 0 ? "other" : "monthly_bill" : mode === "assign" ? purchase?.assignee_id ?? null : "";
      actionExtra.value = mode === "prescription" ? purchase?.prescription_verified_by ?? auth.currentUser?.real_name ?? auth.currentUser?.username ?? "" : "";
      showAction.value = true;
    }
    async function saveAction() {
      const purchase = currentPurchase.value;
      const referral = currentReferral.value;
      if (!actionValue.value) return message.error("请填写操作信息");
      await run(async () => {
        if (actionMode.value === "assign" && purchase) {
          await store.purchaseAction(() => window.api.assistedServices.purchase.assign(purchase.id, actionValue.value, userName(actionValue.value)));
        } else if (actionMode.value === "prescription" && purchase) {
          if (!actionExtra.value.trim()) throw new Error("请填写核验人");
          await store.purchaseAction(() => window.api.assistedServices.purchase.verifyPrescription(purchase.id, actionValue.value, actionExtra.value));
        } else if (actionMode.value === "sign" && purchase) {
          await store.purchaseAction(() => window.api.assistedServices.purchase.sign(purchase.id, actionValue.value));
        } else if (actionMode.value === "settle" && purchase) {
          await store.purchaseAction(() => window.api.assistedServices.purchase.settle(purchase.id, actionValue.value));
        } else if (actionMode.value === "cancel_purchase" && purchase) {
          await store.purchaseAction(() => window.api.assistedServices.purchase.cancel(purchase.id, actionValue.value));
        } else if (actionMode.value === "cancel_referral" && referral) {
          await store.referralAction(() => window.api.assistedServices.referral.cancel(referral.id, actionValue.value));
        }
        showAction.value = false;
      }, "操作成功");
    }
    const showPurchaseDetail = ref(false);
    async function openPurchaseDetail(row) {
      currentPurchase.value = row;
      await run(async () => {
        await store.fetchPurchaseItems(row.id);
        showPurchaseDetail.value = true;
      });
    }
    const purchaseColumns = [
      { title: "订单号", key: "order_no", width: 170 },
      { title: "老人", key: "elderly_id", width: 90, render: (r) => elderlyName(r.elderly_id) },
      { title: "类型", key: "category", width: 90, render: (r) => purchaseCategories.find((item) => item.value === r.category)?.label },
      { title: "商户/送达", key: "merchant_name", minWidth: 170, render: (r) => `${r.merchant_name || "待确定"} · ${r.delivery_address}` },
      { title: "金额/服务费", key: "total_amount_cents", width: 130, render: (r) => `${yuan(r.total_amount_cents)} / ${r.charge_mode === "free" ? "免费" : yuan(r.service_fee_cents)}` },
      { title: "负责人", key: "assignee_name", width: 90, render: (r) => r.assignee_name || "-" },
      { title: "状态", key: "status", width: 90, render: (r) => h(NTag, { type: purchaseStatus[r.status].type }, () => purchaseStatus[r.status].label) },
      { title: "操作", key: "actions", width: 330, render: (r) => h(NSpace, { size: 6 }, () => [
        h(Button, { size: "tiny", onClick: () => openPurchaseDetail(r) }, () => "明细"),
        r.status === "pending" && can("dispatch") ? h(Button, { size: "tiny", type: "primary", onClick: () => openAction("assign", r) }, () => "派单") : null,
        r.category === "medicine" && r.prescription_required === 1 && !r.prescription_verified_at && ["pending", "assigned"].includes(r.status) && can("prescription") ? h(Button, { size: "tiny", onClick: () => openAction("prescription", r) }, () => "核验处方") : null,
        r.status === "assigned" && can("dispatch") ? h(Button, { size: "tiny", type: "primary", onClick: () => run(() => store.purchaseAction(() => window.api.assistedServices.purchase.start(r.id)), r.category === "package_pickup" ? "开始取件" : "开始采购") }, () => r.category === "package_pickup" ? "取件" : "采购") : null,
        r.status === "purchasing" && can("dispatch") ? h(Button, { size: "tiny", onClick: () => run(() => store.purchaseAction(() => window.api.assistedServices.purchase.deliver(r.id)), r.category === "package_pickup" ? "快递开始送达" : "开始配送") }, () => r.category === "package_pickup" ? "送达" : "配送") : null,
        r.status === "delivering" && can("dispatch") ? h(Button, { size: "tiny", type: "success", onClick: () => openAction("sign", r) }, () => "签收") : null,
        r.status === "delivered" && can("settle") ? h(Button, { size: "tiny", type: "success", onClick: () => openAction("settle", r) }, () => "结算") : null,
        ["pending", "assigned", "purchasing"].includes(r.status) && can("dispatch") ? h(Button, { size: "tiny", type: "error", onClick: () => openAction("cancel_purchase", r) }, () => "取消") : null
      ]) }
    ];
    const showCatalog = ref(false);
    const editingCatalog = ref(null);
    const catalogForm = ref({
      code: "",
      name: "",
      category: "package_pickup",
      charge_mode: "free",
      default_service_fee_yuan: 0,
      status: "active",
      sort_order: 0,
      remark: ""
    });
    function openCatalog(row) {
      editingCatalog.value = row ?? null;
      catalogForm.value = row ? {
        code: row.code,
        name: row.name,
        category: row.category,
        charge_mode: row.charge_mode,
        default_service_fee_yuan: row.default_service_fee_cents / 100,
        status: row.status,
        sort_order: row.sort_order,
        remark: row.remark ?? ""
      } : {
        code: "",
        name: "",
        category: "package_pickup",
        charge_mode: "free",
        default_service_fee_yuan: 0,
        status: "active",
        sort_order: store.serviceCatalog.length * 10 + 10,
        remark: ""
      };
      showCatalog.value = true;
    }
    async function saveCatalog() {
      const form = catalogForm.value;
      if (!form.code.trim() || !form.name.trim()) return message.error("请填写服务编码和名称");
      await run(async () => {
        const data = {
          code: form.code.trim(),
          name: form.name.trim(),
          category: form.category,
          charge_mode: form.charge_mode,
          default_service_fee_cents: form.charge_mode === "free" ? 0 : Math.round(form.default_service_fee_yuan * 100),
          status: form.status,
          sort_order: form.sort_order,
          remark: form.remark || null
        };
        if (editingCatalog.value) await store.updateServiceCatalog(editingCatalog.value.id, data);
        else await store.createServiceCatalog(data);
        showCatalog.value = false;
      }, "服务收费设置已保存");
    }
    const catalogColumns = [
      { title: "服务项目", key: "name", minWidth: 150 },
      { title: "编码", key: "code", width: 140 },
      { title: "业务类型", key: "category", width: 110, render: (r) => purchaseCategories.find((item) => item.value === r.category)?.label },
      { title: "收费规则", key: "charge_mode", width: 120, render: (r) => r.charge_mode === "free" ? "免费" : r.charge_mode === "fixed" ? `固定 ${yuan(r.default_service_fee_cents)}/单` : "按单自定义" },
      { title: "说明", key: "remark", minWidth: 180, render: (r) => r.remark || "-" },
      { title: "状态", key: "status", width: 80, render: (r) => h(NTag, { type: r.status === "active" ? "success" : "default" }, () => r.status === "active" ? "启用" : "停用") },
      { title: "操作", key: "actions", width: 150, render: (r) => h(NSpace, () => [
        can("catalog") ? h(Button, { size: "tiny", onClick: () => openCatalog(r) }, () => "编辑") : null,
        can("catalog") ? h(Button, { size: "tiny", onClick: () => run(() => store.updateServiceCatalog(r.id, { status: r.status === "active" ? "inactive" : "active" }), "状态已更新") }, () => r.status === "active" ? "停用" : "启用") : null
      ]) }
    ];
    const showPartner = ref(false);
    const editingPartner = ref(null);
    const partnerForm = ref({ name: "", partner_type: "clinic", hospital_level: "", specialties: "", contact_name: "", contact_phone: "", address: "", emergency_channel: "", agreement_no: "", agreement_start: "", agreement_end: "", settlement_cycle: "按月", status: "active", remark: "" });
    function openPartner(row) {
      editingPartner.value = row ?? null;
      partnerForm.value = row ? {
        name: row.name,
        partner_type: row.partner_type,
        hospital_level: row.hospital_level ?? "",
        specialties: row.specialties ?? "",
        contact_name: row.contact_name ?? "",
        contact_phone: row.contact_phone ?? "",
        address: row.address ?? "",
        emergency_channel: row.emergency_channel ?? "",
        agreement_no: row.agreement_no ?? "",
        agreement_start: row.agreement_start ?? "",
        agreement_end: row.agreement_end ?? "",
        settlement_cycle: row.settlement_cycle ?? "",
        status: row.status,
        remark: row.remark ?? ""
      } : { name: "", partner_type: "clinic", hospital_level: "", specialties: "", contact_name: "", contact_phone: "", address: "", emergency_channel: "", agreement_no: "", agreement_start: "", agreement_end: "", settlement_cycle: "按月", status: "active", remark: "" };
      showPartner.value = true;
    }
    async function savePartner() {
      if (!partnerForm.value.name.trim()) return message.error("请填写机构名称");
      const data = Object.fromEntries(Object.entries(partnerForm.value).map(([key, value]) => [key, value === "" ? null : value]));
      await run(async () => {
        if (editingPartner.value) await store.updatePartner(editingPartner.value.id, data);
        else await store.createPartner(data);
        showPartner.value = false;
      }, "合作机构已保存");
    }
    const partnerColumns = [
      { title: "机构", key: "name", minWidth: 150 },
      { title: "类型", key: "partner_type", width: 100 },
      { title: "专科/能力", key: "specialties", minWidth: 160, render: (r) => r.specialties || "-" },
      { title: "联系人", key: "contact_name", width: 120, render: (r) => `${r.contact_name || "-"} ${r.contact_phone || ""}` },
      { title: "绿色/急诊通道", key: "emergency_channel", minWidth: 160, render: (r) => r.emergency_channel || "-" },
      { title: "协议期", key: "agreement_end", width: 120, render: (r) => r.agreement_end || "-" },
      { title: "状态", key: "status", width: 80, render: (r) => h(NTag, { type: r.status === "active" ? "success" : "default" }, () => r.status === "active" ? "合作中" : "已停用") },
      { title: "操作", key: "actions", width: 150, render: (r) => h(NSpace, () => [
        can("partner") ? h(Button, { size: "tiny", onClick: () => openPartner(r) }, () => "编辑") : null,
        can("partner") ? h(Button, { size: "tiny", onClick: () => run(() => store.updatePartner(r.id, { status: r.status === "active" ? "inactive" : "active" }), "状态已更新") }, () => r.status === "active" ? "停用" : "启用") : null
      ]) }
    ];
    const showReferral = ref(false);
    const referralForm = ref({ elderly_id: null, partner_id: null, service_type: "consultation", priority: "normal", appointment_at: "", department: "", doctor: "", reason: "", symptoms: "", escort_required: 0, escort_user_id: null, remark: "" });
    function openReferral() {
      referralForm.value = { elderly_id: null, partner_id: null, service_type: "consultation", priority: "normal", appointment_at: new Date(Date.now() + 864e5).toISOString().slice(0, 16).replace("T", " "), department: "", doctor: "", reason: "", symptoms: "", escort_required: 0, escort_user_id: null, remark: "" };
      showReferral.value = true;
    }
    async function saveReferral() {
      const f = referralForm.value;
      if (!f.elderly_id || !f.partner_id || !f.appointment_at || !f.reason.trim()) return message.error("请选择老人、机构并填写预约时间和原因");
      if (f.escort_required === 1 && !f.escort_user_id) return message.error("请选择陪诊人员");
      await run(async () => {
        await store.createReferral({
          elderly_id: f.elderly_id,
          partner_id: f.partner_id,
          service_type: f.service_type,
          priority: f.priority,
          appointment_at: f.appointment_at,
          department: f.department || null,
          doctor: f.doctor || null,
          reason: f.reason,
          symptoms: f.symptoms || null,
          escort_required: f.escort_required,
          escort_user_id: f.escort_user_id,
          escort_user_name: f.escort_user_id ? userName(f.escort_user_id) : null,
          created_by: auth.currentUser?.id ?? null,
          created_by_name: auth.currentUser?.real_name ?? auth.currentUser?.username ?? null,
          remark: f.remark || null
        });
        showReferral.value = false;
      }, "就医协作已登记");
    }
    const showComplete = ref(false);
    const showReferralDetail = ref(false);
    const referralFollowUps = ref([]);
    async function openReferralDetail(row) {
      currentReferral.value = row;
      await run(async () => {
        referralFollowUps.value = await window.api.assistedServices.followUp.list(row.id);
        showReferralDetail.value = true;
      });
    }
    const completeForm = ref({ diagnosis: "", treatment_plan: "", prescription: "", next_visit_at: "", medical_fee_yuan: 0, transport_fee_yuan: 0, service_fee_yuan: 0, settlement_method: "monthly_bill" });
    function openComplete(row) {
      currentReferral.value = row;
      completeForm.value = { diagnosis: "", treatment_plan: "", prescription: "", next_visit_at: "", medical_fee_yuan: 0, transport_fee_yuan: 0, service_fee_yuan: 0, settlement_method: "monthly_bill" };
      showComplete.value = true;
    }
    async function saveComplete() {
      if (!currentReferral.value || !completeForm.value.diagnosis.trim()) return message.error("请填写诊断结果");
      const f = completeForm.value;
      await run(async () => {
        await store.completeReferral(currentReferral.value.id, {
          diagnosis: f.diagnosis,
          treatment_plan: f.treatment_plan || null,
          prescription: f.prescription || null,
          next_visit_at: f.next_visit_at || null,
          medical_fee_cents: Math.round(f.medical_fee_yuan * 100),
          transport_fee_cents: Math.round(f.transport_fee_yuan * 100),
          service_fee_cents: Math.round(f.service_fee_yuan * 100),
          settlement_method: f.settlement_method
        });
        showComplete.value = false;
      }, "就诊结果已归档");
    }
    const showFollowUp = ref(false);
    const followForm = ref({ follow_up_at: "", method: "phone", condition: "", medication_compliance: "", adverse_reaction: "", next_action: "", next_follow_up_at: "" });
    function openFollowUp(row) {
      currentReferral.value = row;
      followForm.value = { follow_up_at: (/* @__PURE__ */ new Date()).toISOString().slice(0, 16).replace("T", " "), method: "phone", condition: "", medication_compliance: "", adverse_reaction: "", next_action: "", next_follow_up_at: "" };
      showFollowUp.value = true;
    }
    async function saveFollowUp() {
      if (!currentReferral.value || !followForm.value.condition.trim()) return message.error("请填写随访情况");
      const f = followForm.value;
      await run(async () => {
        await store.createFollowUp({
          referral_id: currentReferral.value.id,
          follow_up_at: f.follow_up_at,
          method: f.method,
          condition: f.condition,
          medication_compliance: f.medication_compliance || null,
          adverse_reaction: f.adverse_reaction || null,
          next_action: f.next_action || null,
          next_follow_up_at: f.next_follow_up_at || null,
          staff_id: auth.currentUser?.id ?? null,
          staff_name: auth.currentUser?.real_name ?? auth.currentUser?.username ?? "系统用户"
        });
        showFollowUp.value = false;
      }, "随访记录已保存");
    }
    const referralColumns = [
      { title: "协作单号", key: "referral_no", width: 170 },
      { title: "老人", key: "elderly_id", width: 90, render: (r) => elderlyName(r.elderly_id) },
      { title: "机构", key: "partner_name", minWidth: 150 },
      { title: "预约时间", key: "appointment_at", width: 150 },
      { title: "原因/科室", key: "reason", minWidth: 180, render: (r) => `${r.reason}${r.department ? ` · ${r.department}` : ""}` },
      { title: "陪诊", key: "escort_user_name", width: 90, render: (r) => r.escort_user_name || "-" },
      { title: "状态", key: "status", width: 90, render: (r) => h(NTag, { type: referralStatus[r.status].type }, () => referralStatus[r.status].label) },
      { title: "操作", key: "actions", width: 300, render: (r) => h(NSpace, { size: 6 }, () => [
        h(Button, { size: "tiny", onClick: () => openReferralDetail(r) }, () => "详情"),
        r.status === "pending" && can("referral") ? h(Button, { size: "tiny", type: "primary", onClick: () => run(() => store.referralAction(() => window.api.assistedServices.referral.confirm(r.id)), "机构已确认") }, () => "确认") : null,
        r.status === "confirmed" && can("referral") ? h(Button, { size: "tiny", onClick: () => run(() => store.referralAction(() => window.api.assistedServices.referral.depart(r.id)), "已登记出发") }, () => "出发") : null,
        r.status === "departed" && can("referral") ? h(Button, { size: "tiny", onClick: () => run(() => store.referralAction(() => window.api.assistedServices.referral.consult(r.id)), "开始就诊") }, () => "就诊") : null,
        r.status === "in_consultation" && can("referral") ? h(Button, { size: "tiny", type: "success", onClick: () => openComplete(r) }, () => "完成") : null,
        ["completed", "follow_up"].includes(r.status) && can("follow-up") ? h(Button, { size: "tiny", type: "success", onClick: () => openFollowUp(r) }, () => "随访") : null,
        ["pending", "confirmed"].includes(r.status) && can("referral") ? h(Button, { size: "tiny", type: "error", onClick: () => openAction("cancel_referral", void 0, r) }, () => "取消") : null
      ]) }
    ];
    const followColumns = [
      { title: "老人", key: "elderly_id", width: 100, render: (r) => elderlyName(r.elderly_id) },
      { title: "随访时间", key: "follow_up_at", width: 160 },
      { title: "方式", key: "method", width: 80 },
      { title: "当前情况", key: "condition", minWidth: 220 },
      { title: "用药依从", key: "medication_compliance", minWidth: 130, render: (r) => r.medication_compliance || "-" },
      { title: "不良反应", key: "adverse_reaction", minWidth: 130, render: (r) => r.adverse_reaction || "-" },
      { title: "下一步", key: "next_action", minWidth: 150, render: (r) => r.next_action || "-" },
      { title: "随访人", key: "staff_name", width: 100 }
    ];
    onMounted(async () => {
      await run(async () => {
        const [elderlyRows, userRows] = await Promise.all([window.api.elderly.list(), window.api.user.list()]);
        elderly.value = elderlyRows;
        users.value = userRows;
        await store.refreshAll();
      });
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createVNode(_sfc_main$1, {
          title: "代办与医养协作",
          description: "外卖、药品和生活用品代买，以及诊所医院合作、陪诊转诊和就诊随访闭环"
        }, {
          actions: withCtx(() => [
            createVNode(unref(Button), {
              loading: unref(store).loading,
              onClick: refresh
            }, {
              default: withCtx(() => [..._cache[89] || (_cache[89] = [
                createTextVNode(" 刷新 ", -1)
              ])]),
              _: 1
            }, 8, ["loading"])
          ]),
          default: withCtx(() => [
            createVNode(unref(NGrid), {
              cols: 7,
              "x-gap": 12,
              style: { "margin-bottom": "16px" }
            }, {
              default: withCtx(() => [
                createVNode(unref(NGridItem), null, {
                  default: withCtx(() => [
                    createVNode(unref(NCard), { size: "small" }, {
                      default: withCtx(() => [
                        createVNode(unref(NStatistic), {
                          label: "代买总单",
                          value: unref(store).stats.purchase_total
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                createVNode(unref(NGridItem), null, {
                  default: withCtx(() => [
                    createVNode(unref(NCard), { size: "small" }, {
                      default: withCtx(() => [
                        createVNode(unref(NStatistic), {
                          label: "代买待办",
                          value: unref(store).stats.purchase_pending
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                createVNode(unref(NGridItem), null, {
                  default: withCtx(() => [
                    createVNode(unref(NCard), { size: "small" }, {
                      default: withCtx(() => [
                        createVNode(unref(NStatistic), {
                          label: "本月代买",
                          value: unref(store).stats.purchase_month_amount_cents / 100,
                          prefix: "¥",
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
                    createVNode(unref(NCard), { size: "small" }, {
                      default: withCtx(() => [
                        createVNode(unref(NStatistic), {
                          label: "医养协作",
                          value: unref(store).stats.referral_total
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                createVNode(unref(NGridItem), null, {
                  default: withCtx(() => [
                    createVNode(unref(NCard), { size: "small" }, {
                      default: withCtx(() => [
                        createVNode(unref(NStatistic), {
                          label: "就医待办",
                          value: unref(store).stats.referral_pending
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                createVNode(unref(NGridItem), null, {
                  default: withCtx(() => [
                    createVNode(unref(NCard), { size: "small" }, {
                      default: withCtx(() => [
                        createVNode(unref(NStatistic), {
                          label: "随访中",
                          value: unref(store).stats.referral_follow_up
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                createVNode(unref(NGridItem), null, {
                  default: withCtx(() => [
                    createVNode(unref(NCard), { size: "small" }, {
                      default: withCtx(() => [
                        createVNode(unref(NStatistic), {
                          label: "合作机构",
                          value: unref(store).stats.active_partners
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
              "onUpdate:value": _cache[2] || (_cache[2] = ($event) => activeTab.value = $event),
              type: "line",
              animated: ""
            }, {
              default: withCtx(() => [
                createVNode(unref(NTabPane), {
                  name: "purchase",
                  tab: "代买订单"
                }, {
                  default: withCtx(() => [
                    createVNode(unref(NSpace), {
                      justify: "end",
                      style: { "margin-bottom": "12px" }
                    }, {
                      default: withCtx(() => [
                        can("create") ? (openBlock(), createBlock(unref(Button), {
                          key: 0,
                          type: "primary",
                          onClick: openPurchase
                        }, {
                          default: withCtx(() => [..._cache[90] || (_cache[90] = [
                            createTextVNode(" 登记代买 ", -1)
                          ])]),
                          _: 1
                        })) : createCommentVNode("", true)
                      ]),
                      _: 1
                    }),
                    createVNode(_sfc_main$2, {
                      columns: purchaseColumns,
                      data: unref(store).purchaseOrders,
                      loading: unref(store).loading,
                      pagination: { pageSize: 15 }
                    }, null, 8, ["data", "loading"])
                  ]),
                  _: 1
                }),
                createVNode(unref(NTabPane), {
                  name: "catalog",
                  tab: "服务与收费设置"
                }, {
                  default: withCtx(() => [
                    createVNode(unref(NSpace), {
                      justify: "end",
                      style: { "margin-bottom": "12px" }
                    }, {
                      default: withCtx(() => [
                        can("catalog") ? (openBlock(), createBlock(unref(Button), {
                          key: 0,
                          type: "primary",
                          onClick: _cache[0] || (_cache[0] = ($event) => openCatalog())
                        }, {
                          default: withCtx(() => [..._cache[91] || (_cache[91] = [
                            createTextVNode(" 新增服务项目 ", -1)
                          ])]),
                          _: 1
                        })) : createCommentVNode("", true)
                      ]),
                      _: 1
                    }),
                    createVNode(_sfc_main$2, {
                      columns: catalogColumns,
                      data: unref(store).serviceCatalog,
                      pagination: false
                    }, null, 8, ["data"])
                  ]),
                  _: 1
                }),
                createVNode(unref(NTabPane), {
                  name: "referral",
                  tab: "就医协作"
                }, {
                  default: withCtx(() => [
                    createVNode(unref(NSpace), {
                      justify: "end",
                      style: { "margin-bottom": "12px" }
                    }, {
                      default: withCtx(() => [
                        can("referral") ? (openBlock(), createBlock(unref(Button), {
                          key: 0,
                          type: "primary",
                          disabled: !partnerOptions.value.length,
                          onClick: openReferral
                        }, {
                          default: withCtx(() => [..._cache[92] || (_cache[92] = [
                            createTextVNode(" 预约/转诊/陪诊 ", -1)
                          ])]),
                          _: 1
                        }, 8, ["disabled"])) : createCommentVNode("", true)
                      ]),
                      _: 1
                    }),
                    createVNode(_sfc_main$2, {
                      columns: referralColumns,
                      data: unref(store).referrals,
                      loading: unref(store).loading,
                      pagination: { pageSize: 15 }
                    }, null, 8, ["data", "loading"])
                  ]),
                  _: 1
                }),
                createVNode(unref(NTabPane), {
                  name: "partner",
                  tab: "合作机构"
                }, {
                  default: withCtx(() => [
                    createVNode(unref(NSpace), {
                      justify: "end",
                      style: { "margin-bottom": "12px" }
                    }, {
                      default: withCtx(() => [
                        can("partner") ? (openBlock(), createBlock(unref(Button), {
                          key: 0,
                          type: "primary",
                          onClick: _cache[1] || (_cache[1] = ($event) => openPartner())
                        }, {
                          default: withCtx(() => [..._cache[93] || (_cache[93] = [
                            createTextVNode(" 新增机构 ", -1)
                          ])]),
                          _: 1
                        })) : createCommentVNode("", true)
                      ]),
                      _: 1
                    }),
                    createVNode(_sfc_main$2, {
                      columns: partnerColumns,
                      data: unref(store).partners,
                      pagination: { pageSize: 15 }
                    }, null, 8, ["data"])
                  ]),
                  _: 1
                }),
                createVNode(unref(NTabPane), {
                  name: "follow",
                  tab: "随访记录"
                }, {
                  default: withCtx(() => [
                    createVNode(_sfc_main$2, {
                      columns: followColumns,
                      data: unref(store).followUps,
                      pagination: { pageSize: 15 }
                    }, null, 8, ["data"])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["value"])
          ]),
          _: 1
        }),
        createVNode(unref(NModal), {
          show: showPurchase.value,
          "onUpdate:show": _cache[19] || (_cache[19] = ($event) => showPurchase.value = $event),
          preset: "card",
          title: "登记代买订单",
          style: { "width": "900px" }
        }, {
          default: withCtx(() => [
            createVNode(unref(NForm), {
              model: purchaseForm.value,
              "label-placement": "left",
              "label-width": "90"
            }, {
              default: withCtx(() => [
                createVNode(unref(NGrid), {
                  cols: 2,
                  "x-gap": 16
                }, {
                  default: withCtx(() => [
                    createVNode(unref(NFormItem), {
                      label: "老人",
                      required: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(NSelect), {
                          value: purchaseForm.value.elderly_id,
                          "onUpdate:value": [
                            _cache[3] || (_cache[3] = ($event) => purchaseForm.value.elderly_id = $event),
                            selectPurchaseElderly
                          ],
                          filterable: "",
                          options: elderlyOptions.value
                        }, null, 8, ["value", "options"])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(NFormItem), {
                      label: "服务项目",
                      required: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(NSelect), {
                          value: purchaseForm.value.service_catalog_id,
                          "onUpdate:value": [
                            _cache[4] || (_cache[4] = ($event) => purchaseForm.value.service_catalog_id = $event),
                            selectService
                          ],
                          options: serviceOptions.value
                        }, null, 8, ["value", "options"])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(NFormItem), {
                      label: "申请人",
                      required: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(NInput), {
                          value: purchaseForm.value.requester_name,
                          "onUpdate:value": _cache[5] || (_cache[5] = ($event) => purchaseForm.value.requester_name = $event)
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(NFormItem), { label: "联系电话" }, {
                      default: withCtx(() => [
                        createVNode(unref(NInput), {
                          value: purchaseForm.value.requester_phone,
                          "onUpdate:value": _cache[6] || (_cache[6] = ($event) => purchaseForm.value.requester_phone = $event)
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(NFormItem), { label: "商户/取件点" }, {
                      default: withCtx(() => [
                        createVNode(unref(NInput), {
                          value: purchaseForm.value.merchant_name,
                          "onUpdate:value": _cache[7] || (_cache[7] = ($event) => purchaseForm.value.merchant_name = $event),
                          placeholder: "餐厅、药店、商超或快递站"
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(NFormItem), { label: "期望送达" }, {
                      default: withCtx(() => [
                        createVNode(unref(NInput), {
                          value: purchaseForm.value.expected_at,
                          "onUpdate:value": _cache[8] || (_cache[8] = ($event) => purchaseForm.value.expected_at = $event),
                          placeholder: "YYYY-MM-DD HH:mm"
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(NFormItem), {
                      label: "送达地址",
                      required: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(NInput), {
                          value: purchaseForm.value.delivery_address,
                          "onUpdate:value": _cache[9] || (_cache[9] = ($event) => purchaseForm.value.delivery_address = $event)
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(NFormItem), { label: "垫付金额" }, {
                      default: withCtx(() => [
                        createVNode(unref(NInputNumber), {
                          value: purchaseForm.value.advance_amount_yuan,
                          "onUpdate:value": _cache[10] || (_cache[10] = ($event) => purchaseForm.value.advance_amount_yuan = $event),
                          min: 0,
                          precision: 2
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(NFormItem), { label: "配送费" }, {
                      default: withCtx(() => [
                        createVNode(unref(NInputNumber), {
                          value: purchaseForm.value.delivery_fee_yuan,
                          "onUpdate:value": _cache[11] || (_cache[11] = ($event) => purchaseForm.value.delivery_fee_yuan = $event),
                          min: 0,
                          precision: 2
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(NFormItem), { label: "收费方式" }, {
                      default: withCtx(() => [
                        createVNode(unref(NSelect), {
                          value: purchaseForm.value.charge_mode,
                          "onUpdate:value": [
                            _cache[12] || (_cache[12] = ($event) => purchaseForm.value.charge_mode = $event),
                            selectChargeMode
                          ],
                          options: chargeModeOptions
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(NFormItem), { label: "服务费" }, {
                      default: withCtx(() => [
                        createVNode(unref(NInputNumber), {
                          value: purchaseForm.value.service_fee_yuan,
                          "onUpdate:value": _cache[13] || (_cache[13] = ($event) => purchaseForm.value.service_fee_yuan = $event),
                          min: 0,
                          precision: 2,
                          disabled: purchaseForm.value.charge_mode !== "custom"
                        }, null, 8, ["value", "disabled"])
                      ]),
                      _: 1
                    }),
                    purchaseForm.value.category === "medicine" ? (openBlock(), createBlock(unref(NFormItem), {
                      key: 0,
                      label: "处方要求"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(NSelect), {
                          value: purchaseForm.value.prescription_required,
                          "onUpdate:value": _cache[14] || (_cache[14] = ($event) => purchaseForm.value.prescription_required = $event),
                          options: [{ label: "非处方药", value: 0 }, { label: "需要处方", value: 1 }]
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    purchaseForm.value.category === "medicine" ? (openBlock(), createBlock(unref(NFormItem), {
                      key: 1,
                      label: "处方编号"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(NInput), {
                          value: purchaseForm.value.prescription_no,
                          "onUpdate:value": _cache[15] || (_cache[15] = ($event) => purchaseForm.value.prescription_no = $event),
                          placeholder: "可派单后再核验"
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    })) : createCommentVNode("", true)
                  ]),
                  _: 1
                }),
                createVNode(unref(NCard), {
                  title: "代买/代办明细",
                  size: "small"
                }, {
                  default: withCtx(() => [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(purchaseDrafts.value, (item, index) => {
                      return openBlock(), createBlock(unref(NSpace), {
                        key: index,
                        align: "center",
                        style: { "margin-bottom": "8px" },
                        wrap: false
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(NInput), {
                            value: item.item_name,
                            "onUpdate:value": ($event) => item.item_name = $event,
                            placeholder: "商品或代办事项",
                            style: { "width": "160px" }
                          }, null, 8, ["value", "onUpdate:value"]),
                          createVNode(unref(NInput), {
                            value: item.specification,
                            "onUpdate:value": ($event) => item.specification = $event,
                            placeholder: "规格",
                            style: { "width": "110px" }
                          }, null, 8, ["value", "onUpdate:value"]),
                          createVNode(unref(NInputNumber), {
                            value: item.quantity,
                            "onUpdate:value": ($event) => item.quantity = $event,
                            min: 0.01,
                            placeholder: "数量",
                            style: { "width": "95px" }
                          }, null, 8, ["value", "onUpdate:value"]),
                          createVNode(unref(NInput), {
                            value: item.unit,
                            "onUpdate:value": ($event) => item.unit = $event,
                            placeholder: "单位",
                            style: { "width": "70px" }
                          }, null, 8, ["value", "onUpdate:value"]),
                          createVNode(unref(NInputNumber), {
                            value: item.unit_price_yuan,
                            "onUpdate:value": ($event) => item.unit_price_yuan = $event,
                            min: 0,
                            precision: 2,
                            placeholder: "单价",
                            style: { "width": "110px" }
                          }, null, 8, ["value", "onUpdate:value"]),
                          purchaseForm.value.category === "medicine" ? (openBlock(), createBlock(unref(NSelect), {
                            key: 0,
                            value: item.medicine_type,
                            "onUpdate:value": ($event) => item.medicine_type = $event,
                            options: [{ label: "非处方药", value: "otc" }, { label: "处方药", value: "prescription" }],
                            placeholder: "药品类型",
                            style: { "width": "110px" }
                          }, null, 8, ["value", "onUpdate:value"])) : createCommentVNode("", true),
                          purchaseForm.value.category === "medicine" ? (openBlock(), createBlock(unref(NInput), {
                            key: 1,
                            value: item.dosage,
                            "onUpdate:value": ($event) => item.dosage = $event,
                            placeholder: "用法用量",
                            style: { "width": "130px" }
                          }, null, 8, ["value", "onUpdate:value"])) : createCommentVNode("", true),
                          purchaseDrafts.value.length > 1 ? (openBlock(), createBlock(unref(Button), {
                            key: 2,
                            type: "error",
                            size: "small",
                            onClick: ($event) => purchaseDrafts.value.splice(index, 1)
                          }, {
                            default: withCtx(() => [..._cache[94] || (_cache[94] = [
                              createTextVNode(" 删除 ", -1)
                            ])]),
                            _: 1
                          }, 8, ["onClick"])) : createCommentVNode("", true)
                        ]),
                        _: 2
                      }, 1024);
                    }), 128)),
                    createVNode(unref(Button), {
                      dashed: "",
                      onClick: _cache[16] || (_cache[16] = ($event) => purchaseDrafts.value.push(emptyPurchaseDraft()))
                    }, {
                      default: withCtx(() => [..._cache[95] || (_cache[95] = [
                        createTextVNode(" 添加商品 ", -1)
                      ])]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                createVNode(unref(NFormItem), {
                  label: "备注",
                  style: { "margin-top": "12px" }
                }, {
                  default: withCtx(() => [
                    createVNode(unref(NInput), {
                      value: purchaseForm.value.remark,
                      "onUpdate:value": _cache[17] || (_cache[17] = ($event) => purchaseForm.value.remark = $event),
                      type: "textarea"
                    }, null, 8, ["value"])
                  ]),
                  _: 1
                }),
                createVNode(unref(NSpace), { justify: "space-between" }, {
                  default: withCtx(() => [
                    createBaseVNode("strong", null, "预计合计：" + toDisplayString(purchaseTotal.value.toFixed(2)) + " 元", 1),
                    createVNode(unref(NSpace), null, {
                      default: withCtx(() => [
                        createVNode(unref(Button), {
                          onClick: _cache[18] || (_cache[18] = ($event) => showPurchase.value = false)
                        }, {
                          default: withCtx(() => [..._cache[96] || (_cache[96] = [
                            createTextVNode(" 取消 ", -1)
                          ])]),
                          _: 1
                        }),
                        createVNode(unref(Button), {
                          type: "primary",
                          onClick: savePurchase
                        }, {
                          default: withCtx(() => [..._cache[97] || (_cache[97] = [
                            createTextVNode(" 保存 ", -1)
                          ])]),
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
          show: showCatalog.value,
          "onUpdate:show": _cache[29] || (_cache[29] = ($event) => showCatalog.value = $event),
          preset: "card",
          title: "代办服务与收费设置",
          style: { "width": "680px" }
        }, {
          default: withCtx(() => [
            createVNode(unref(NForm), {
              model: catalogForm.value,
              "label-placement": "left",
              "label-width": "100"
            }, {
              default: withCtx(() => [
                createVNode(unref(NGrid), {
                  cols: 2,
                  "x-gap": 16
                }, {
                  default: withCtx(() => [
                    createVNode(unref(NFormItem), {
                      label: "服务编码",
                      required: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(NInput), {
                          value: catalogForm.value.code,
                          "onUpdate:value": _cache[20] || (_cache[20] = ($event) => catalogForm.value.code = $event),
                          disabled: !!editingCatalog.value,
                          placeholder: "如 package_pickup"
                        }, null, 8, ["value", "disabled"])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(NFormItem), {
                      label: "服务名称",
                      required: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(NInput), {
                          value: catalogForm.value.name,
                          "onUpdate:value": _cache[21] || (_cache[21] = ($event) => catalogForm.value.name = $event),
                          placeholder: "如 代拿快递"
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(NFormItem), { label: "业务类型" }, {
                      default: withCtx(() => [
                        createVNode(unref(NSelect), {
                          value: catalogForm.value.category,
                          "onUpdate:value": _cache[22] || (_cache[22] = ($event) => catalogForm.value.category = $event),
                          options: purchaseCategories
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(NFormItem), { label: "默认收费" }, {
                      default: withCtx(() => [
                        createVNode(unref(NSelect), {
                          value: catalogForm.value.charge_mode,
                          "onUpdate:value": _cache[23] || (_cache[23] = ($event) => catalogForm.value.charge_mode = $event),
                          options: chargeModeOptions
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(NFormItem), { label: "固定服务费" }, {
                      default: withCtx(() => [
                        createVNode(unref(NInputNumber), {
                          value: catalogForm.value.default_service_fee_yuan,
                          "onUpdate:value": _cache[24] || (_cache[24] = ($event) => catalogForm.value.default_service_fee_yuan = $event),
                          min: 0,
                          precision: 2,
                          disabled: catalogForm.value.charge_mode !== "fixed"
                        }, null, 8, ["value", "disabled"])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(NFormItem), { label: "排序" }, {
                      default: withCtx(() => [
                        createVNode(unref(NInputNumber), {
                          value: catalogForm.value.sort_order,
                          "onUpdate:value": _cache[25] || (_cache[25] = ($event) => catalogForm.value.sort_order = $event),
                          min: 0
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(NFormItem), { label: "状态" }, {
                      default: withCtx(() => [
                        createVNode(unref(NSelect), {
                          value: catalogForm.value.status,
                          "onUpdate:value": _cache[26] || (_cache[26] = ($event) => catalogForm.value.status = $event),
                          options: [{ label: "启用", value: "active" }, { label: "停用", value: "inactive" }]
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                createVNode(unref(NFormItem), { label: "服务说明" }, {
                  default: withCtx(() => [
                    createVNode(unref(NInput), {
                      value: catalogForm.value.remark,
                      "onUpdate:value": _cache[27] || (_cache[27] = ($event) => catalogForm.value.remark = $event),
                      type: "textarea"
                    }, null, 8, ["value"])
                  ]),
                  _: 1
                }),
                createVNode(unref(NSpace), { justify: "end" }, {
                  default: withCtx(() => [
                    createVNode(unref(Button), {
                      onClick: _cache[28] || (_cache[28] = ($event) => showCatalog.value = false)
                    }, {
                      default: withCtx(() => [..._cache[98] || (_cache[98] = [
                        createTextVNode(" 取消 ", -1)
                      ])]),
                      _: 1
                    }),
                    createVNode(unref(Button), {
                      type: "primary",
                      onClick: saveCatalog
                    }, {
                      default: withCtx(() => [..._cache[99] || (_cache[99] = [
                        createTextVNode(" 保存设置 ", -1)
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
        }, 8, ["show"]),
        createVNode(unref(NModal), {
          show: showAction.value,
          "onUpdate:show": _cache[37] || (_cache[37] = ($event) => showAction.value = $event),
          preset: "card",
          title: actionTitle.value,
          style: { "width": "480px" }
        }, {
          default: withCtx(() => [
            createVNode(unref(NForm), {
              "label-placement": "left",
              "label-width": "90"
            }, {
              default: withCtx(() => [
                actionMode.value === "assign" ? (openBlock(), createBlock(unref(NFormItem), {
                  key: 0,
                  label: "负责人"
                }, {
                  default: withCtx(() => [
                    createVNode(unref(NSelect), {
                      value: actionValue.value,
                      "onUpdate:value": _cache[30] || (_cache[30] = ($event) => actionValue.value = $event),
                      filterable: "",
                      options: userOptions.value
                    }, null, 8, ["value", "options"])
                  ]),
                  _: 1
                })) : actionMode.value === "prescription" ? (openBlock(), createBlock(unref(NFormItem), {
                  key: 1,
                  label: "处方编号"
                }, {
                  default: withCtx(() => [
                    createVNode(unref(NInput), {
                      value: actionValue.value,
                      "onUpdate:value": _cache[31] || (_cache[31] = ($event) => actionValue.value = $event)
                    }, null, 8, ["value"])
                  ]),
                  _: 1
                })) : createCommentVNode("", true),
                actionMode.value === "prescription" ? (openBlock(), createBlock(unref(NFormItem), {
                  key: 2,
                  label: "核验人"
                }, {
                  default: withCtx(() => [
                    createVNode(unref(NInput), {
                      value: actionExtra.value,
                      "onUpdate:value": _cache[32] || (_cache[32] = ($event) => actionExtra.value = $event)
                    }, null, 8, ["value"])
                  ]),
                  _: 1
                })) : actionMode.value === "sign" ? (openBlock(), createBlock(unref(NFormItem), {
                  key: 3,
                  label: "签收人"
                }, {
                  default: withCtx(() => [
                    createVNode(unref(NInput), {
                      value: actionValue.value,
                      "onUpdate:value": _cache[33] || (_cache[33] = ($event) => actionValue.value = $event)
                    }, null, 8, ["value"])
                  ]),
                  _: 1
                })) : actionMode.value === "settle" ? (openBlock(), createBlock(unref(NFormItem), {
                  key: 4,
                  label: "结算方式"
                }, {
                  default: withCtx(() => [
                    createVNode(unref(NSelect), {
                      value: actionValue.value,
                      "onUpdate:value": _cache[34] || (_cache[34] = ($event) => actionValue.value = $event),
                      options: [{ label: "计入月度账单", value: "monthly_bill" }, { label: "现金", value: "cash" }, { label: "微信", value: "wechat" }, { label: "支付宝", value: "alipay" }, { label: "银行转账", value: "bank" }, { label: "免费/其他（不入账）", value: "other" }]
                    }, null, 8, ["value"])
                  ]),
                  _: 1
                })) : actionMode.value.startsWith("cancel") ? (openBlock(), createBlock(unref(NFormItem), {
                  key: 5,
                  label: "取消原因"
                }, {
                  default: withCtx(() => [
                    createVNode(unref(NInput), {
                      value: actionValue.value,
                      "onUpdate:value": _cache[35] || (_cache[35] = ($event) => actionValue.value = $event),
                      type: "textarea"
                    }, null, 8, ["value"])
                  ]),
                  _: 1
                })) : createCommentVNode("", true),
                createVNode(unref(NSpace), { justify: "end" }, {
                  default: withCtx(() => [
                    createVNode(unref(Button), {
                      onClick: _cache[36] || (_cache[36] = ($event) => showAction.value = false)
                    }, {
                      default: withCtx(() => [..._cache[100] || (_cache[100] = [
                        createTextVNode(" 取消 ", -1)
                      ])]),
                      _: 1
                    }),
                    createVNode(unref(Button), {
                      type: "primary",
                      onClick: saveAction
                    }, {
                      default: withCtx(() => [..._cache[101] || (_cache[101] = [
                        createTextVNode(" 确认 ", -1)
                      ])]),
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
        }, 8, ["show", "title"]),
        createVNode(unref(NModal), {
          show: showPurchaseDetail.value,
          "onUpdate:show": _cache[38] || (_cache[38] = ($event) => showPurchaseDetail.value = $event),
          preset: "card",
          title: "代买订单明细",
          style: { "width": "720px" }
        }, {
          default: withCtx(() => [
            currentPurchase.value ? (openBlock(), createBlock(unref(NDescriptions), {
              key: 0,
              bordered: "",
              column: 2
            }, {
              default: withCtx(() => [
                createVNode(unref(NDescriptionsItem), { label: "订单号" }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(currentPurchase.value.order_no), 1)
                  ]),
                  _: 1
                }),
                createVNode(unref(NDescriptionsItem), { label: "老人" }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(elderlyName(currentPurchase.value.elderly_id)), 1)
                  ]),
                  _: 1
                }),
                createVNode(unref(NDescriptionsItem), { label: "商品金额" }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(yuan(currentPurchase.value.goods_amount_cents)), 1)
                  ]),
                  _: 1
                }),
                createVNode(unref(NDescriptionsItem), { label: "总金额" }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(yuan(currentPurchase.value.total_amount_cents)), 1)
                  ]),
                  _: 1
                }),
                createVNode(unref(NDescriptionsItem), { label: "处方核验" }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(currentPurchase.value.prescription_required ? currentPurchase.value.prescription_verified_by || "待核验" : "不需要"), 1)
                  ]),
                  _: 1
                }),
                createVNode(unref(NDescriptionsItem), { label: "结算" }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(currentPurchase.value.settlement_method || "未结算"), 1)
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })) : createCommentVNode("", true),
            createVNode(_sfc_main$2, {
              style: { "margin-top": "12px" },
              columns: [{ title: "商品", key: "item_name" }, { title: "规格", key: "specification" }, { title: "数量", key: "quantity" }, { title: "单位", key: "unit" }, { title: "单价", key: "unit_price_cents", render: (r) => yuan(r.unit_price_cents) }, { title: "金额", key: "amount_cents", render: (r) => yuan(r.amount_cents) }, { title: "用法", key: "dosage" }],
              data: unref(store).purchaseItems,
              pagination: false
            }, null, 8, ["columns", "data"])
          ]),
          _: 1
        }, 8, ["show"]),
        createVNode(unref(NModal), {
          show: showPartner.value,
          "onUpdate:show": _cache[54] || (_cache[54] = ($event) => showPartner.value = $event),
          preset: "card",
          title: "合作机构",
          style: { "width": "720px" }
        }, {
          default: withCtx(() => [
            createVNode(unref(NForm), {
              model: partnerForm.value,
              "label-placement": "left",
              "label-width": "90"
            }, {
              default: withCtx(() => [
                createVNode(unref(NGrid), {
                  cols: 2,
                  "x-gap": 16
                }, {
                  default: withCtx(() => [
                    createVNode(unref(NFormItem), {
                      label: "机构名称",
                      required: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(NInput), {
                          value: partnerForm.value.name,
                          "onUpdate:value": _cache[39] || (_cache[39] = ($event) => partnerForm.value.name = $event)
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(NFormItem), { label: "机构类型" }, {
                      default: withCtx(() => [
                        createVNode(unref(NSelect), {
                          value: partnerForm.value.partner_type,
                          "onUpdate:value": _cache[40] || (_cache[40] = ($event) => partnerForm.value.partner_type = $event),
                          options: [{ label: "诊所", value: "clinic" }, { label: "医院", value: "hospital" }, { label: "药房", value: "pharmacy" }, { label: "康复机构", value: "rehab" }, { label: "检验机构", value: "laboratory" }, { label: "其他", value: "other" }]
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(NFormItem), { label: "医院等级" }, {
                      default: withCtx(() => [
                        createVNode(unref(NInput), {
                          value: partnerForm.value.hospital_level,
                          "onUpdate:value": _cache[41] || (_cache[41] = ($event) => partnerForm.value.hospital_level = $event)
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(NFormItem), { label: "专科能力" }, {
                      default: withCtx(() => [
                        createVNode(unref(NInput), {
                          value: partnerForm.value.specialties,
                          "onUpdate:value": _cache[42] || (_cache[42] = ($event) => partnerForm.value.specialties = $event)
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(NFormItem), { label: "联系人" }, {
                      default: withCtx(() => [
                        createVNode(unref(NInput), {
                          value: partnerForm.value.contact_name,
                          "onUpdate:value": _cache[43] || (_cache[43] = ($event) => partnerForm.value.contact_name = $event)
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(NFormItem), { label: "联系电话" }, {
                      default: withCtx(() => [
                        createVNode(unref(NInput), {
                          value: partnerForm.value.contact_phone,
                          "onUpdate:value": _cache[44] || (_cache[44] = ($event) => partnerForm.value.contact_phone = $event)
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(NFormItem), { label: "机构地址" }, {
                      default: withCtx(() => [
                        createVNode(unref(NInput), {
                          value: partnerForm.value.address,
                          "onUpdate:value": _cache[45] || (_cache[45] = ($event) => partnerForm.value.address = $event)
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(NFormItem), { label: "急诊通道" }, {
                      default: withCtx(() => [
                        createVNode(unref(NInput), {
                          value: partnerForm.value.emergency_channel,
                          "onUpdate:value": _cache[46] || (_cache[46] = ($event) => partnerForm.value.emergency_channel = $event)
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(NFormItem), { label: "协议编号" }, {
                      default: withCtx(() => [
                        createVNode(unref(NInput), {
                          value: partnerForm.value.agreement_no,
                          "onUpdate:value": _cache[47] || (_cache[47] = ($event) => partnerForm.value.agreement_no = $event)
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(NFormItem), { label: "结算周期" }, {
                      default: withCtx(() => [
                        createVNode(unref(NInput), {
                          value: partnerForm.value.settlement_cycle,
                          "onUpdate:value": _cache[48] || (_cache[48] = ($event) => partnerForm.value.settlement_cycle = $event)
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(NFormItem), { label: "协议开始" }, {
                      default: withCtx(() => [
                        createVNode(unref(NInput), {
                          value: partnerForm.value.agreement_start,
                          "onUpdate:value": _cache[49] || (_cache[49] = ($event) => partnerForm.value.agreement_start = $event),
                          placeholder: "YYYY-MM-DD"
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(NFormItem), { label: "协议结束" }, {
                      default: withCtx(() => [
                        createVNode(unref(NInput), {
                          value: partnerForm.value.agreement_end,
                          "onUpdate:value": _cache[50] || (_cache[50] = ($event) => partnerForm.value.agreement_end = $event),
                          placeholder: "YYYY-MM-DD"
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(NFormItem), { label: "状态" }, {
                      default: withCtx(() => [
                        createVNode(unref(NSelect), {
                          value: partnerForm.value.status,
                          "onUpdate:value": _cache[51] || (_cache[51] = ($event) => partnerForm.value.status = $event),
                          options: [{ label: "合作中", value: "active" }, { label: "已停用", value: "inactive" }]
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                createVNode(unref(NFormItem), { label: "备注" }, {
                  default: withCtx(() => [
                    createVNode(unref(NInput), {
                      value: partnerForm.value.remark,
                      "onUpdate:value": _cache[52] || (_cache[52] = ($event) => partnerForm.value.remark = $event),
                      type: "textarea"
                    }, null, 8, ["value"])
                  ]),
                  _: 1
                }),
                createVNode(unref(NSpace), { justify: "end" }, {
                  default: withCtx(() => [
                    createVNode(unref(Button), {
                      onClick: _cache[53] || (_cache[53] = ($event) => showPartner.value = false)
                    }, {
                      default: withCtx(() => [..._cache[102] || (_cache[102] = [
                        createTextVNode(" 取消 ", -1)
                      ])]),
                      _: 1
                    }),
                    createVNode(unref(Button), {
                      type: "primary",
                      onClick: savePartner
                    }, {
                      default: withCtx(() => [..._cache[103] || (_cache[103] = [
                        createTextVNode(" 保存 ", -1)
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
        }, 8, ["show"]),
        createVNode(unref(NModal), {
          show: showReferral.value,
          "onUpdate:show": _cache[68] || (_cache[68] = ($event) => showReferral.value = $event),
          preset: "card",
          title: "登记就医协作",
          style: { "width": "760px" }
        }, {
          default: withCtx(() => [
            createVNode(unref(NForm), {
              model: referralForm.value,
              "label-placement": "left",
              "label-width": "90"
            }, {
              default: withCtx(() => [
                createVNode(unref(NGrid), {
                  cols: 2,
                  "x-gap": 16
                }, {
                  default: withCtx(() => [
                    createVNode(unref(NFormItem), {
                      label: "老人",
                      required: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(NSelect), {
                          value: referralForm.value.elderly_id,
                          "onUpdate:value": _cache[55] || (_cache[55] = ($event) => referralForm.value.elderly_id = $event),
                          filterable: "",
                          options: elderlyOptions.value
                        }, null, 8, ["value", "options"])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(NFormItem), {
                      label: "合作机构",
                      required: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(NSelect), {
                          value: referralForm.value.partner_id,
                          "onUpdate:value": _cache[56] || (_cache[56] = ($event) => referralForm.value.partner_id = $event),
                          filterable: "",
                          options: partnerOptions.value
                        }, null, 8, ["value", "options"])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(NFormItem), { label: "服务类型" }, {
                      default: withCtx(() => [
                        createVNode(unref(NSelect), {
                          value: referralForm.value.service_type,
                          "onUpdate:value": _cache[57] || (_cache[57] = ($event) => referralForm.value.service_type = $event),
                          options: [{ label: "门诊预约", value: "consultation" }, { label: "转诊", value: "referral" }, { label: "陪诊", value: "escort" }, { label: "检查", value: "exam" }, { label: "康复", value: "rehab" }, { label: "送药", value: "medicine_delivery" }, { label: "急诊", value: "emergency" }]
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(NFormItem), { label: "优先级" }, {
                      default: withCtx(() => [
                        createVNode(unref(NSelect), {
                          value: referralForm.value.priority,
                          "onUpdate:value": _cache[58] || (_cache[58] = ($event) => referralForm.value.priority = $event),
                          options: [{ label: "普通", value: "normal" }, { label: "紧急", value: "urgent" }, { label: "急救", value: "emergency" }]
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(NFormItem), {
                      label: "预约时间",
                      required: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(NInput), {
                          value: referralForm.value.appointment_at,
                          "onUpdate:value": _cache[59] || (_cache[59] = ($event) => referralForm.value.appointment_at = $event)
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(NFormItem), { label: "科室" }, {
                      default: withCtx(() => [
                        createVNode(unref(NInput), {
                          value: referralForm.value.department,
                          "onUpdate:value": _cache[60] || (_cache[60] = ($event) => referralForm.value.department = $event)
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(NFormItem), { label: "医生" }, {
                      default: withCtx(() => [
                        createVNode(unref(NInput), {
                          value: referralForm.value.doctor,
                          "onUpdate:value": _cache[61] || (_cache[61] = ($event) => referralForm.value.doctor = $event)
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(NFormItem), { label: "陪诊需求" }, {
                      default: withCtx(() => [
                        createVNode(unref(NSelect), {
                          value: referralForm.value.escort_required,
                          "onUpdate:value": _cache[62] || (_cache[62] = ($event) => referralForm.value.escort_required = $event),
                          options: [{ label: "不需要", value: 0 }, { label: "需要陪诊", value: 1 }]
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    }),
                    referralForm.value.escort_required ? (openBlock(), createBlock(unref(NFormItem), {
                      key: 0,
                      label: "陪诊人员"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(NSelect), {
                          value: referralForm.value.escort_user_id,
                          "onUpdate:value": _cache[63] || (_cache[63] = ($event) => referralForm.value.escort_user_id = $event),
                          filterable: "",
                          options: userOptions.value
                        }, null, 8, ["value", "options"])
                      ]),
                      _: 1
                    })) : createCommentVNode("", true)
                  ]),
                  _: 1
                }),
                createVNode(unref(NFormItem), {
                  label: "就医原因",
                  required: ""
                }, {
                  default: withCtx(() => [
                    createVNode(unref(NInput), {
                      value: referralForm.value.reason,
                      "onUpdate:value": _cache[64] || (_cache[64] = ($event) => referralForm.value.reason = $event)
                    }, null, 8, ["value"])
                  ]),
                  _: 1
                }),
                createVNode(unref(NFormItem), { label: "症状" }, {
                  default: withCtx(() => [
                    createVNode(unref(NInput), {
                      value: referralForm.value.symptoms,
                      "onUpdate:value": _cache[65] || (_cache[65] = ($event) => referralForm.value.symptoms = $event),
                      type: "textarea"
                    }, null, 8, ["value"])
                  ]),
                  _: 1
                }),
                createVNode(unref(NFormItem), { label: "备注" }, {
                  default: withCtx(() => [
                    createVNode(unref(NInput), {
                      value: referralForm.value.remark,
                      "onUpdate:value": _cache[66] || (_cache[66] = ($event) => referralForm.value.remark = $event)
                    }, null, 8, ["value"])
                  ]),
                  _: 1
                }),
                createVNode(unref(NSpace), { justify: "end" }, {
                  default: withCtx(() => [
                    createVNode(unref(Button), {
                      onClick: _cache[67] || (_cache[67] = ($event) => showReferral.value = false)
                    }, {
                      default: withCtx(() => [..._cache[104] || (_cache[104] = [
                        createTextVNode(" 取消 ", -1)
                      ])]),
                      _: 1
                    }),
                    createVNode(unref(Button), {
                      type: "primary",
                      onClick: saveReferral
                    }, {
                      default: withCtx(() => [..._cache[105] || (_cache[105] = [
                        createTextVNode(" 保存 ", -1)
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
        }, 8, ["show"]),
        createVNode(unref(NModal), {
          show: showComplete.value,
          "onUpdate:show": _cache[78] || (_cache[78] = ($event) => showComplete.value = $event),
          preset: "card",
          title: "归档诊疗结果",
          style: { "width": "680px" }
        }, {
          default: withCtx(() => [
            createVNode(unref(NForm), {
              model: completeForm.value,
              "label-placement": "left",
              "label-width": "100"
            }, {
              default: withCtx(() => [
                createVNode(unref(NFormItem), {
                  label: "诊断结果",
                  required: ""
                }, {
                  default: withCtx(() => [
                    createVNode(unref(NInput), {
                      value: completeForm.value.diagnosis,
                      "onUpdate:value": _cache[69] || (_cache[69] = ($event) => completeForm.value.diagnosis = $event),
                      type: "textarea"
                    }, null, 8, ["value"])
                  ]),
                  _: 1
                }),
                createVNode(unref(NFormItem), { label: "治疗方案" }, {
                  default: withCtx(() => [
                    createVNode(unref(NInput), {
                      value: completeForm.value.treatment_plan,
                      "onUpdate:value": _cache[70] || (_cache[70] = ($event) => completeForm.value.treatment_plan = $event),
                      type: "textarea"
                    }, null, 8, ["value"])
                  ]),
                  _: 1
                }),
                createVNode(unref(NFormItem), { label: "处方/用药" }, {
                  default: withCtx(() => [
                    createVNode(unref(NInput), {
                      value: completeForm.value.prescription,
                      "onUpdate:value": _cache[71] || (_cache[71] = ($event) => completeForm.value.prescription = $event),
                      type: "textarea"
                    }, null, 8, ["value"])
                  ]),
                  _: 1
                }),
                createVNode(unref(NFormItem), { label: "复诊时间" }, {
                  default: withCtx(() => [
                    createVNode(unref(NInput), {
                      value: completeForm.value.next_visit_at,
                      "onUpdate:value": _cache[72] || (_cache[72] = ($event) => completeForm.value.next_visit_at = $event)
                    }, null, 8, ["value"])
                  ]),
                  _: 1
                }),
                createVNode(unref(NGrid), {
                  cols: 2,
                  "x-gap": 16
                }, {
                  default: withCtx(() => [
                    createVNode(unref(NFormItem), { label: "医疗费" }, {
                      default: withCtx(() => [
                        createVNode(unref(NInputNumber), {
                          value: completeForm.value.medical_fee_yuan,
                          "onUpdate:value": _cache[73] || (_cache[73] = ($event) => completeForm.value.medical_fee_yuan = $event),
                          min: 0,
                          precision: 2
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(NFormItem), { label: "交通费" }, {
                      default: withCtx(() => [
                        createVNode(unref(NInputNumber), {
                          value: completeForm.value.transport_fee_yuan,
                          "onUpdate:value": _cache[74] || (_cache[74] = ($event) => completeForm.value.transport_fee_yuan = $event),
                          min: 0,
                          precision: 2
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(NFormItem), { label: "服务费" }, {
                      default: withCtx(() => [
                        createVNode(unref(NInputNumber), {
                          value: completeForm.value.service_fee_yuan,
                          "onUpdate:value": _cache[75] || (_cache[75] = ($event) => completeForm.value.service_fee_yuan = $event),
                          min: 0,
                          precision: 2
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(NFormItem), { label: "结算" }, {
                      default: withCtx(() => [
                        createVNode(unref(NSelect), {
                          value: completeForm.value.settlement_method,
                          "onUpdate:value": _cache[76] || (_cache[76] = ($event) => completeForm.value.settlement_method = $event),
                          options: [{ label: "计入月度账单", value: "monthly_bill" }, { label: "已现场支付", value: "paid" }]
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                createVNode(unref(NSpace), { justify: "end" }, {
                  default: withCtx(() => [
                    createVNode(unref(Button), {
                      onClick: _cache[77] || (_cache[77] = ($event) => showComplete.value = false)
                    }, {
                      default: withCtx(() => [..._cache[106] || (_cache[106] = [
                        createTextVNode(" 取消 ", -1)
                      ])]),
                      _: 1
                    }),
                    createVNode(unref(Button), {
                      type: "primary",
                      onClick: saveComplete
                    }, {
                      default: withCtx(() => [..._cache[107] || (_cache[107] = [
                        createTextVNode(" 完成归档 ", -1)
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
        }, 8, ["show"]),
        createVNode(unref(NModal), {
          show: showReferralDetail.value,
          "onUpdate:show": _cache[79] || (_cache[79] = ($event) => showReferralDetail.value = $event),
          preset: "card",
          title: "就医协作详情",
          style: { "width": "760px" }
        }, {
          default: withCtx(() => [
            currentReferral.value ? (openBlock(), createBlock(unref(NDescriptions), {
              key: 0,
              bordered: "",
              column: 2
            }, {
              default: withCtx(() => [
                createVNode(unref(NDescriptionsItem), { label: "协作单号" }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(currentReferral.value.referral_no), 1)
                  ]),
                  _: 1
                }),
                createVNode(unref(NDescriptionsItem), { label: "老人" }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(elderlyName(currentReferral.value.elderly_id)), 1)
                  ]),
                  _: 1
                }),
                createVNode(unref(NDescriptionsItem), { label: "合作机构" }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(currentReferral.value.partner_name), 1)
                  ]),
                  _: 1
                }),
                createVNode(unref(NDescriptionsItem), { label: "预约时间" }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(currentReferral.value.appointment_at), 1)
                  ]),
                  _: 1
                }),
                createVNode(unref(NDescriptionsItem), { label: "科室/医生" }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(currentReferral.value.department || "-") + " / " + toDisplayString(currentReferral.value.doctor || "-"), 1)
                  ]),
                  _: 1
                }),
                createVNode(unref(NDescriptionsItem), { label: "陪诊人员" }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(currentReferral.value.escort_user_name || "-"), 1)
                  ]),
                  _: 1
                }),
                createVNode(unref(NDescriptionsItem), {
                  label: "就医原因",
                  span: 2
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(currentReferral.value.reason), 1)
                  ]),
                  _: 1
                }),
                createVNode(unref(NDescriptionsItem), {
                  label: "诊断结果",
                  span: 2
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(currentReferral.value.diagnosis || "尚未归档"), 1)
                  ]),
                  _: 1
                }),
                createVNode(unref(NDescriptionsItem), {
                  label: "治疗方案",
                  span: 2
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(currentReferral.value.treatment_plan || "-"), 1)
                  ]),
                  _: 1
                }),
                createVNode(unref(NDescriptionsItem), {
                  label: "处方/用药",
                  span: 2
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(currentReferral.value.prescription || "-"), 1)
                  ]),
                  _: 1
                }),
                createVNode(unref(NDescriptionsItem), { label: "下次复诊" }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(currentReferral.value.next_visit_at || "-"), 1)
                  ]),
                  _: 1
                }),
                createVNode(unref(NDescriptionsItem), { label: "费用/结算" }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(yuan(currentReferral.value.total_amount_cents)) + " / " + toDisplayString(currentReferral.value.settlement_status), 1)
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })) : createCommentVNode("", true),
            createVNode(unref(NCard), {
              title: "随访记录",
              size: "small",
              style: { "margin-top": "12px" }
            }, {
              default: withCtx(() => [
                createVNode(_sfc_main$2, {
                  columns: followColumns,
                  data: referralFollowUps.value,
                  pagination: false
                }, null, 8, ["data"])
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["show"]),
        createVNode(unref(NModal), {
          show: showFollowUp.value,
          "onUpdate:show": _cache[88] || (_cache[88] = ($event) => showFollowUp.value = $event),
          preset: "card",
          title: "就诊随访",
          style: { "width": "650px" }
        }, {
          default: withCtx(() => [
            createVNode(unref(NForm), {
              model: followForm.value,
              "label-placement": "left",
              "label-width": "100"
            }, {
              default: withCtx(() => [
                createVNode(unref(NGrid), {
                  cols: 2,
                  "x-gap": 16
                }, {
                  default: withCtx(() => [
                    createVNode(unref(NFormItem), { label: "随访时间" }, {
                      default: withCtx(() => [
                        createVNode(unref(NInput), {
                          value: followForm.value.follow_up_at,
                          "onUpdate:value": _cache[80] || (_cache[80] = ($event) => followForm.value.follow_up_at = $event)
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(NFormItem), { label: "方式" }, {
                      default: withCtx(() => [
                        createVNode(unref(NSelect), {
                          value: followForm.value.method,
                          "onUpdate:value": _cache[81] || (_cache[81] = ($event) => followForm.value.method = $event),
                          options: [{ label: "电话", value: "phone" }, { label: "上门", value: "visit" }, { label: "线上", value: "online" }]
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                createVNode(unref(NFormItem), {
                  label: "当前情况",
                  required: ""
                }, {
                  default: withCtx(() => [
                    createVNode(unref(NInput), {
                      value: followForm.value.condition,
                      "onUpdate:value": _cache[82] || (_cache[82] = ($event) => followForm.value.condition = $event),
                      type: "textarea"
                    }, null, 8, ["value"])
                  ]),
                  _: 1
                }),
                createVNode(unref(NFormItem), { label: "用药依从性" }, {
                  default: withCtx(() => [
                    createVNode(unref(NInput), {
                      value: followForm.value.medication_compliance,
                      "onUpdate:value": _cache[83] || (_cache[83] = ($event) => followForm.value.medication_compliance = $event)
                    }, null, 8, ["value"])
                  ]),
                  _: 1
                }),
                createVNode(unref(NFormItem), { label: "不良反应" }, {
                  default: withCtx(() => [
                    createVNode(unref(NInput), {
                      value: followForm.value.adverse_reaction,
                      "onUpdate:value": _cache[84] || (_cache[84] = ($event) => followForm.value.adverse_reaction = $event)
                    }, null, 8, ["value"])
                  ]),
                  _: 1
                }),
                createVNode(unref(NFormItem), { label: "下一步安排" }, {
                  default: withCtx(() => [
                    createVNode(unref(NInput), {
                      value: followForm.value.next_action,
                      "onUpdate:value": _cache[85] || (_cache[85] = ($event) => followForm.value.next_action = $event)
                    }, null, 8, ["value"])
                  ]),
                  _: 1
                }),
                createVNode(unref(NFormItem), { label: "下次随访" }, {
                  default: withCtx(() => [
                    createVNode(unref(NInput), {
                      value: followForm.value.next_follow_up_at,
                      "onUpdate:value": _cache[86] || (_cache[86] = ($event) => followForm.value.next_follow_up_at = $event)
                    }, null, 8, ["value"])
                  ]),
                  _: 1
                }),
                createVNode(unref(NSpace), { justify: "end" }, {
                  default: withCtx(() => [
                    createVNode(unref(Button), {
                      onClick: _cache[87] || (_cache[87] = ($event) => showFollowUp.value = false)
                    }, {
                      default: withCtx(() => [..._cache[108] || (_cache[108] = [
                        createTextVNode(" 取消 ", -1)
                      ])]),
                      _: 1
                    }),
                    createVNode(unref(Button), {
                      type: "primary",
                      onClick: saveFollowUp
                    }, {
                      default: withCtx(() => [..._cache[109] || (_cache[109] = [
                        createTextVNode(" 保存 ", -1)
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
        }, 8, ["show"])
      ], 64);
    };
  }
});
export {
  _sfc_main as default
};
