import { S as defineStore, r as ref, l as defineComponent, U as createBlock, W as withCtx, u as unref, V as openBlock, X as createVNode, k as createTextVNode, c as computed, q as h, a2 as useRouter } from "./vendor-vue-Hc3ejqjp.js";
import { _ as _sfc_main$2 } from "./BaseTable.vue_vue_type_script_setup_true_lang-Kf6svQhn.js";
import "./vendor-echarts-DEbY5nl3.js";
import { _ as _sfc_main$1 } from "./BasePage.vue_vue_type_script_setup_true_lang-CoKRdyPV.js";
import { u as useAuthStore } from "./index-77IpmxCe.js";
import { f as formatDateTime } from "./validators-BfKhytEl.js";
import { u as usePageRefresh } from "./usePageRefresh-Wnx_lW1d.js";
import { u as useElderlyStore } from "./elderly.store-isfnimJX.js";
import { u as useMessage, T as NTabPane, g as NCard, B as Button, U as NTabs, j as NForm, k as NFormItem, l as NInput, J as NSelect, v as NSpace, h as NModal, S as NInputNumber, o as NTag } from "./vendor-naive-sdNTCZPI.js";
import "./vendor-query-CFvMrhIw.js";
import "./vendor-utils-DD6FGs_H.js";
import "./useAutoRefresh-BeuDS8Br.js";
const useOperationsStore = defineStore("operations", () => {
  const handovers = ref([]);
  const incidents = ref([]);
  const visitors = ref([]);
  const communications = ref([]);
  const inventory = ref([]);
  const documents = ref([]);
  const healthAlerts = ref([]);
  const transactions = ref([]);
  const risks = ref([]);
  const loading = ref(false);
  async function fetchAll() {
    loading.value = true;
    try {
      const [riskRows, handoverRows, incidentRows, visitorRows, communicationRows, inventoryRows, documentRows, alertRows] = await Promise.all([
        window.api.operations.riskSummary(),
        window.api.operations.handover.list(),
        window.api.operations.incident.list(true),
        window.api.operations.visitor.list(true),
        window.api.operations.communication.list(false),
        window.api.operations.inventory.list(),
        window.api.operations.document.list(),
        window.api.operations.healthAlert.list(true)
      ]);
      risks.value = riskRows;
      handovers.value = handoverRows;
      incidents.value = incidentRows;
      visitors.value = visitorRows;
      communications.value = communicationRows;
      inventory.value = inventoryRows;
      documents.value = documentRows;
      healthAlerts.value = alertRows;
    } finally {
      loading.value = false;
    }
  }
  async function fetchTransactions(itemId) {
    transactions.value = await window.api.operations.inventory.transactions(itemId);
  }
  return {
    handovers,
    incidents,
    visitors,
    communications,
    inventory,
    documents,
    healthAlerts,
    transactions,
    risks,
    loading,
    fetchAll,
    fetchTransactions
  };
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "Operations" },
  __name: "OperationsView",
  setup(__props) {
    const operationsStore = useOperationsStore();
    const elderlyStore = useElderlyStore();
    const authStore = useAuthStore();
    const router = useRouter();
    const message = useMessage();
    async function loadData() {
      await Promise.all([operationsStore.fetchAll(), elderlyStore.fetchList()]);
    }
    const { refresh, refreshing } = usePageRefresh(loadData);
    const elderlyOptions = computed(
      () => elderlyStore.list.filter((elderly) => elderly.status === "active").map((elderly) => ({ label: elderly.name, value: elderly.id }))
    );
    const currentStaff = computed(
      () => authStore.currentUser?.real_name || authStore.currentUser?.username || ""
    );
    const now = () => formatDateTime(Date.now());
    const elderlyName = (id) => id ? elderlyStore.list.find((elderly) => elderly.id === id)?.name ?? "已删除老人" : "公共事件";
    const errorText = (error, fallback) => error instanceof Error ? error.message : fallback;
    const riskSourceLabel = {
      health: "健康预警",
      iot: "设备告警",
      medication: "用药管理",
      care: "护理管理",
      admission: "入住管理",
      contract: "合同管理",
      fee: "费用管理",
      inventory: "库存台账",
      document: "文书台账"
    };
    const riskSourceRoute = {
      health: "/health",
      iot: "/iot-device",
      medication: "/health",
      care: "/care",
      admission: "/admission",
      contract: "/contract",
      fee: "/fee"
    };
    function openRiskSource(row) {
      const route = riskSourceRoute[row.source];
      if (route) void router.push(route);
    }
    async function runAction(action, success) {
      try {
        await action();
        message.success(success);
        await operationsStore.fetchAll();
      } catch (error) {
        message.error(errorText(error, "操作失败"));
      }
    }
    const handoverModal = ref(false);
    const handoverForm = ref({
      handover_date: now(),
      shift: "day",
      outgoing_staff: "",
      incoming_staff: "",
      resident_summary: "",
      abnormal_summary: "",
      pending_items: ""
    });
    const shiftOptions = [
      { label: "白班", value: "day" },
      { label: "中班", value: "evening" },
      { label: "夜班", value: "night" }
    ];
    function openHandover() {
      handoverForm.value = {
        handover_date: now(),
        shift: "day",
        outgoing_staff: currentStaff.value,
        incoming_staff: "",
        resident_summary: "",
        abnormal_summary: "",
        pending_items: ""
      };
      handoverModal.value = true;
    }
    async function saveHandover() {
      if (!handoverForm.value.outgoing_staff.trim()) return message.error("请填写交班人");
      await runAction(
        () => window.api.operations.handover.create({
          ...handoverForm.value,
          outgoing_staff: handoverForm.value.outgoing_staff.trim(),
          incoming_staff: handoverForm.value.incoming_staff.trim() || null,
          resident_summary: handoverForm.value.resident_summary.trim() || null,
          abnormal_summary: handoverForm.value.abnormal_summary.trim() || null,
          pending_items: handoverForm.value.pending_items.trim() || null
        }),
        "交接班已登记"
      );
      handoverModal.value = false;
    }
    async function acknowledgeHandover(row) {
      const staff = currentStaff.value;
      if (!staff) return message.error("无法识别当前工作人员");
      await runAction(() => window.api.operations.handover.acknowledge(row.id, staff), "已确认接班");
    }
    const incidentModal = ref(false);
    const incidentCloseModal = ref(false);
    const closingIncidentId = ref(null);
    const incidentCloseNote = ref("");
    const incidentForm = ref({
      elderly_id: null,
      incident_type: "fall",
      severity: "urgent",
      occurred_at: now(),
      location: "",
      description: "",
      immediate_action: "",
      responsible: ""
    });
    const incidentTypeOptions = [
      { label: "跌倒", value: "fall" },
      { label: "走失风险", value: "wandering" },
      { label: "噎食", value: "choking" },
      { label: "压疮", value: "pressure_injury" },
      { label: "意外伤害", value: "injury" },
      { label: "其他", value: "other" }
    ];
    const severityOptions = [
      { label: "一般", value: "normal" },
      { label: "紧急", value: "urgent" },
      { label: "危急", value: "critical" }
    ];
    function openIncident() {
      incidentForm.value = { elderly_id: null, incident_type: "fall", severity: "urgent", occurred_at: now(), location: "", description: "", immediate_action: "", responsible: currentStaff.value };
      incidentModal.value = true;
    }
    async function saveIncident() {
      if (!incidentForm.value.description.trim()) return message.error("请填写事件经过");
      await runAction(
        () => window.api.operations.incident.create({
          ...incidentForm.value,
          location: incidentForm.value.location.trim() || null,
          description: incidentForm.value.description.trim(),
          immediate_action: incidentForm.value.immediate_action.trim() || null,
          responsible: incidentForm.value.responsible.trim() || null
        }),
        "事件已上报，等待处置"
      );
      incidentModal.value = false;
    }
    function openIncidentClose(row) {
      closingIncidentId.value = row.id;
      incidentCloseNote.value = "";
      incidentCloseModal.value = true;
    }
    async function closeIncident() {
      if (!closingIncidentId.value || !incidentCloseNote.value.trim()) return message.error("请填写处置结果");
      await runAction(() => window.api.operations.incident.close(closingIncidentId.value, incidentCloseNote.value), "事件已关闭");
      incidentCloseModal.value = false;
    }
    const visitorModal = ref(false);
    const visitorForm = ref({ elderly_id: "", visitor_name: "", relation: "", phone: "", visit_at: now(), purpose: "", approved_by: "", remark: "" });
    function openVisitor() {
      visitorForm.value = { elderly_id: "", visitor_name: "", relation: "", phone: "", visit_at: now(), purpose: "", approved_by: currentStaff.value, remark: "" };
      visitorModal.value = true;
    }
    async function saveVisitor() {
      if (!visitorForm.value.elderly_id || !visitorForm.value.visitor_name.trim()) return message.error("请选择老人并填写访客姓名");
      await runAction(() => window.api.operations.visitor.create({
        ...visitorForm.value,
        visitor_name: visitorForm.value.visitor_name.trim(),
        relation: visitorForm.value.relation.trim() || null,
        phone: visitorForm.value.phone.trim() || null,
        purpose: visitorForm.value.purpose.trim() || null,
        approved_by: visitorForm.value.approved_by.trim() || null,
        remark: visitorForm.value.remark.trim() || null
      }), "探视预约已登记");
      visitorModal.value = false;
    }
    const communicationModal = ref(false);
    const communicationForm = ref({ elderly_id: "", contact_name: "", channel: "phone", communicated_at: now(), content: "", follow_up: "", communicator: "" });
    const channelOptions = [
      { label: "电话", value: "phone" },
      { label: "微信", value: "wechat" },
      { label: "短信", value: "sms" },
      { label: "当面沟通", value: "face_to_face" },
      { label: "其他", value: "other" }
    ];
    function openCommunication() {
      communicationForm.value = { elderly_id: "", contact_name: "", channel: "phone", communicated_at: now(), content: "", follow_up: "", communicator: currentStaff.value };
      communicationModal.value = true;
    }
    async function saveCommunication() {
      if (!communicationForm.value.elderly_id || !communicationForm.value.contact_name.trim() || !communicationForm.value.content.trim()) return message.error("请填写老人、联系人和沟通内容");
      await runAction(() => window.api.operations.communication.create({
        ...communicationForm.value,
        contact_name: communicationForm.value.contact_name.trim(),
        content: communicationForm.value.content.trim(),
        follow_up: communicationForm.value.follow_up.trim() || null,
        communicator: communicationForm.value.communicator.trim() || null
      }), "家属沟通已登记");
      communicationModal.value = false;
    }
    const inventoryModal = ref(false);
    const inventoryTransactionModal = ref(false);
    const transactionItem = ref(null);
    const inventoryForm = ref({ category: "medicine", name: "", specification: "", unit: "盒", quantity: 0, min_quantity: 0, expiry_date: "", supplier: "", remark: "" });
    const transactionForm = ref({ transaction_type: "in", quantity: 1, occurred_at: now(), operator: "", reference_no: "", remark: "" });
    const inventoryCategoryOptions = [
      { label: "药品", value: "medicine" },
      { label: "护理耗材", value: "care_supply" },
      { label: "食品原料", value: "food" },
      { label: "其他", value: "other" }
    ];
    function openInventory() {
      inventoryForm.value = { category: "medicine", name: "", specification: "", unit: "盒", quantity: 0, min_quantity: 0, expiry_date: "", supplier: "", remark: "" };
      inventoryModal.value = true;
    }
    async function saveInventory() {
      if (!inventoryForm.value.name.trim() || !inventoryForm.value.unit.trim()) return message.error("请填写物品名称和单位");
      await runAction(() => window.api.operations.inventory.create({
        ...inventoryForm.value,
        name: inventoryForm.value.name.trim(),
        specification: inventoryForm.value.specification.trim() || null,
        unit: inventoryForm.value.unit.trim(),
        expiry_date: inventoryForm.value.expiry_date || null,
        supplier: inventoryForm.value.supplier.trim() || null,
        status: "active",
        remark: inventoryForm.value.remark.trim() || null
      }), "库存物品已建立");
      inventoryModal.value = false;
    }
    async function openTransaction(row) {
      transactionItem.value = row;
      transactionForm.value = { transaction_type: "in", quantity: 1, occurred_at: now(), operator: currentStaff.value, reference_no: "", remark: "" };
      await operationsStore.fetchTransactions(row.id);
      inventoryTransactionModal.value = true;
    }
    async function saveTransaction() {
      if (!transactionItem.value) return;
      await runAction(() => window.api.operations.inventory.transact({
        item_id: transactionItem.value.id,
        ...transactionForm.value,
        operator: transactionForm.value.operator.trim() || null,
        reference_no: transactionForm.value.reference_no.trim() || null,
        remark: transactionForm.value.remark.trim() || null
      }), "库存流水已登记");
      await operationsStore.fetchTransactions(transactionItem.value.id);
      inventoryTransactionModal.value = false;
    }
    const documentModal = ref(false);
    const documentFileName = ref("");
    const documentForm = ref({ elderly_id: "", document_type: "入住授权", document_name: "", file_path: "", signed_at: "", expiry_date: "", custodian: "", remark: "" });
    function openDocument() {
      documentForm.value = { elderly_id: "", document_type: "入住授权", document_name: "", file_path: "", signed_at: "", expiry_date: "", custodian: currentStaff.value, remark: "" };
      documentFileName.value = "";
      documentModal.value = true;
    }
    async function selectDocumentAttachment() {
      try {
        const result = await window.api.operations.document.selectAttachment();
        if (result.canceled || !result.filePath) return;
        documentForm.value.file_path = result.filePath;
        documentFileName.value = result.fileName || "已选择附件";
        if (!documentForm.value.document_name.trim() && result.fileName) {
          documentForm.value.document_name = result.fileName;
        }
      } catch (error) {
        message.error(errorText(error, "选择附件失败"));
      }
    }
    async function openDocumentAttachment(row) {
      if (!row.file_path) return;
      try {
        await window.api.operations.document.openAttachment(row.file_path);
      } catch (error) {
        message.error(errorText(error, "打开附件失败"));
      }
    }
    async function saveDocument() {
      if (!documentForm.value.elderly_id || !documentForm.value.document_type.trim() || !documentForm.value.document_name.trim()) return message.error("请填写老人、文书类型和名称");
      await runAction(() => window.api.operations.document.create({
        ...documentForm.value,
        document_type: documentForm.value.document_type.trim(),
        document_name: documentForm.value.document_name.trim(),
        file_path: documentForm.value.file_path.trim() || null,
        signed_at: documentForm.value.signed_at || null,
        expiry_date: documentForm.value.expiry_date || null,
        custodian: documentForm.value.custodian.trim() || null,
        remark: documentForm.value.remark.trim() || null
      }), "文书已归档");
      documentModal.value = false;
    }
    const alertResolveModal = ref(false);
    const resolvingAlertId = ref(null);
    const alertResolution = ref("");
    function openAlertResolve(row) {
      resolvingAlertId.value = row.id;
      alertResolution.value = "";
      alertResolveModal.value = true;
    }
    async function resolveAlert() {
      if (!resolvingAlertId.value || !alertResolution.value.trim()) return message.error("请填写预警处置说明");
      await runAction(() => window.api.operations.healthAlert.resolve(resolvingAlertId.value, currentStaff.value, alertResolution.value), "健康预警已关闭");
      alertResolveModal.value = false;
    }
    const statusTag = (status) => ({
      pending: "warning",
      acknowledged: "success",
      reported: "error",
      processing: "warning",
      closed: "success",
      scheduled: "info",
      checked_in: "warning",
      checked_out: "success",
      cancelled: "default",
      open: "error",
      resolved: "success",
      valid: "success",
      expiring: "warning",
      expired: "error",
      normal: "default",
      urgent: "warning",
      critical: "error"
    })[status] ?? "default";
    const statusText = (status) => ({
      pending: "待接班",
      acknowledged: "已接班",
      reported: "已上报",
      processing: "处理中",
      closed: "已关闭",
      scheduled: "已预约",
      checked_in: "探视中",
      checked_out: "已签离",
      cancelled: "已取消",
      open: "待跟进",
      resolved: "已关闭",
      valid: "有效",
      expiring: "即将到期",
      expired: "已过期",
      normal: "一般",
      urgent: "紧急",
      critical: "危急"
    })[status] ?? status;
    const handoverColumns = [
      { title: "时间", key: "handover_date", width: 155 },
      { title: "班次", key: "shift", width: 80, render: (row) => shiftOptions.find((item) => item.value === row.shift)?.label },
      { title: "交班人", key: "outgoing_staff", width: 100 },
      { title: "异常情况", key: "abnormal_summary", ellipsis: { tooltip: true } },
      { title: "待办事项", key: "pending_items", ellipsis: { tooltip: true } },
      { title: "状态", key: "status", width: 90, render: (row) => h(NTag, { type: statusTag(row.status) }, () => statusText(row.status)) },
      { title: "操作", key: "actions", width: 100, render: (row) => row.status === "pending" ? h(Button, { size: "small", type: "primary", onClick: () => acknowledgeHandover(row) }, () => "确认接班") : "—" }
    ];
    const riskColumns = [
      { title: "来源模块", key: "source", width: 110, render: (row) => riskSourceLabel[row.source] },
      { title: "关联老人", key: "elderly_name", width: 100, render: (row) => row.elderly_name || "—" },
      { title: "风险事项", key: "title", width: 110 },
      { title: "详情", key: "content", ellipsis: { tooltip: true } },
      { title: "级别", key: "severity", width: 90, render: (row) => h(NTag, { type: statusTag(row.severity) }, () => statusText(row.severity)) },
      { title: "发生/到期", key: "risk_at", width: 155 },
      { title: "操作", key: "actions", width: 100, render: (row) => riskSourceRoute[row.source] ? h(Button, { size: "small", onClick: () => openRiskSource(row) }, () => "查看来源") : "本工作台" }
    ];
    const incidentColumns = [
      { title: "老人", key: "elderly_id", width: 100, render: (row) => elderlyName(row.elderly_id) },
      { title: "类型", key: "incident_type", width: 100, render: (row) => incidentTypeOptions.find((item) => item.value === row.incident_type)?.label },
      { title: "发生时间", key: "occurred_at", width: 155 },
      { title: "经过", key: "description", ellipsis: { tooltip: true } },
      { title: "级别", key: "severity", width: 80, render: (row) => h(NTag, { type: statusTag(row.severity) }, () => statusText(row.severity)) },
      { title: "状态", key: "status", width: 90, render: (row) => h(NTag, { type: statusTag(row.status) }, () => statusText(row.status)) },
      { title: "操作", key: "actions", width: 260, render: (row) => h(NSpace, { size: 4 }, { default: () => [
        ...row.status === "reported" ? [h(Button, { size: "small", onClick: () => runAction(() => window.api.operations.incident.start(row.id, currentStaff.value), "已开始处置") }, () => "开始处置")] : [],
        ...row.status !== "closed" && !row.family_notified_at ? [h(Button, { size: "small", onClick: () => runAction(() => window.api.operations.incident.notifyFamily(row.id), "已登记家属通知") }, () => "已通知家属")] : [],
        ...row.status === "processing" ? [h(Button, { size: "small", type: "primary", onClick: () => openIncidentClose(row) }, () => "关闭事件")] : []
      ] }) }
    ];
    const visitorColumns = [
      { title: "老人", key: "elderly_id", width: 100, render: (row) => elderlyName(row.elderly_id) },
      { title: "访客", key: "visitor_name", width: 100 },
      { title: "关系", key: "relation", width: 100 },
      { title: "预约时间", key: "visit_at", width: 155 },
      { title: "状态", key: "status", width: 90, render: (row) => h(NTag, { type: statusTag(row.status) }, () => statusText(row.status)) },
      { title: "操作", key: "actions", width: 160, render: (row) => row.status === "scheduled" ? h(NSpace, { size: 4 }, { default: () => [h(Button, { size: "small", onClick: () => runAction(() => window.api.operations.visitor.checkIn(row.id), "访客已签到") }, () => "签到"), h(Button, { size: "small", onClick: () => runAction(() => window.api.operations.visitor.cancel(row.id), "探视预约已取消") }, () => "取消")] }) : row.status === "checked_in" ? h(Button, { size: "small", type: "primary", onClick: () => runAction(() => window.api.operations.visitor.checkOut(row.id, now()), "访客已签离") }, () => "签离") : "—" }
    ];
    const communicationColumns = [
      { title: "老人", key: "elderly_id", width: 100, render: (row) => elderlyName(row.elderly_id) },
      { title: "联系人", key: "contact_name", width: 100 },
      { title: "渠道", key: "channel", width: 90, render: (row) => channelOptions.find((item) => item.value === row.channel)?.label },
      { title: "沟通时间", key: "communicated_at", width: 155 },
      { title: "内容", key: "content", ellipsis: { tooltip: true } },
      { title: "跟进事项", key: "follow_up", ellipsis: { tooltip: true } },
      { title: "状态", key: "status", width: 90, render: (row) => h(NTag, { type: statusTag(row.status) }, () => statusText(row.status)) },
      { title: "操作", key: "actions", width: 100, render: (row) => row.status === "open" ? h(Button, { size: "small", type: "primary", onClick: () => runAction(() => window.api.operations.communication.close(row.id), "沟通事项已关闭") }, () => "完成跟进") : "—" }
    ];
    const inventoryColumns = [
      { title: "类别", key: "category", width: 100, render: (row) => inventoryCategoryOptions.find((item) => item.value === row.category)?.label },
      { title: "物品", key: "name", width: 150 },
      { title: "规格", key: "specification", width: 110 },
      { title: "现存", key: "quantity", width: 100, render: (row) => `${row.quantity} ${row.unit}` },
      { title: "预警下限", key: "min_quantity", width: 100, render: (row) => `${row.min_quantity} ${row.unit}` },
      { title: "有效期", key: "expiry_date", width: 110, render: (row) => row.expiry_date || "—" },
      { title: "库存状态", key: "stock", width: 100, render: (row) => h(NTag, { type: row.quantity <= row.min_quantity ? "error" : "success" }, () => row.quantity <= row.min_quantity ? "库存不足" : "充足") },
      { title: "操作", key: "actions", width: 100, render: (row) => h(Button, { size: "small", onClick: () => openTransaction(row) }, () => "出入库") }
    ];
    const documentColumns = [
      { title: "老人", key: "elderly_id", width: 100, render: (row) => elderlyName(row.elderly_id) },
      { title: "类型", key: "document_type", width: 120 },
      { title: "名称", key: "document_name", width: 160 },
      { title: "签署日期", key: "signed_at", width: 110, render: (row) => row.signed_at || "—" },
      { title: "有效期", key: "expiry_date", width: 110, render: (row) => row.expiry_date || "长期" },
      { title: "状态", key: "status", width: 100, render: (row) => h(NTag, { type: statusTag(row.status) }, () => statusText(row.status)) },
      { title: "保管人", key: "custodian", width: 100 },
      { title: "附件", key: "actions", width: 90, render: (row) => row.file_path ? h(Button, { size: "small", onClick: () => openDocumentAttachment(row) }, () => "打开") : "—" }
    ];
    const alertColumns = [
      { title: "老人", key: "elderly_id", width: 100, render: (row) => elderlyName(row.elderly_id) },
      { title: "预警内容", key: "content", ellipsis: { tooltip: true } },
      { title: "级别", key: "severity", width: 90, render: (row) => h(NTag, { type: statusTag(row.severity) }, () => statusText(row.severity)) },
      { title: "触发时间", key: "opened_at", width: 160, render: (row) => formatDateTime(row.opened_at) },
      { title: "状态", key: "status", width: 90, render: (row) => h(NTag, { type: statusTag(row.status) }, () => statusText(row.status)) },
      { title: "操作", key: "actions", width: 150, render: (row) => row.status === "open" ? h(Button, { size: "small", onClick: () => runAction(() => window.api.operations.healthAlert.start(row.id), "已开始处置") }, () => "开始处置") : row.status === "processing" ? h(Button, { size: "small", type: "primary", onClick: () => openAlertResolve(row) }, () => "关闭预警") : "—" }
    ];
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), { title: "运营与安全" }, {
        "header-extra": withCtx(() => [
          createVNode(unref(Button), {
            size: "small",
            loading: unref(refreshing),
            onClick: unref(refresh)
          }, {
            default: withCtx(() => [..._cache[72] || (_cache[72] = [
              createTextVNode("刷新", -1)
            ])]),
            _: 1
          }, 8, ["loading", "onClick"])
        ]),
        default: withCtx(() => [
          createVNode(unref(NTabs), {
            type: "line",
            animated: ""
          }, {
            default: withCtx(() => [
              createVNode(unref(NTabPane), {
                name: "summary",
                tab: "自动汇总"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$2), {
                        columns: riskColumns,
                        data: unref(operationsStore).risks,
                        loading: unref(operationsStore).loading,
                        pagination: { pageSize: 15 }
                      }, null, 8, ["data", "loading"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(NTabPane), {
                name: "handover",
                tab: "交接班"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    "header-extra": withCtx(() => [
                      createVNode(unref(Button), {
                        type: "primary",
                        size: "small",
                        onClick: openHandover
                      }, {
                        default: withCtx(() => [..._cache[73] || (_cache[73] = [
                          createTextVNode("+ 登记交接", -1)
                        ])]),
                        _: 1
                      })
                    ]),
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$2), {
                        columns: handoverColumns,
                        data: unref(operationsStore).handovers,
                        loading: unref(operationsStore).loading,
                        pagination: { pageSize: 12 }
                      }, null, 8, ["data", "loading"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(NTabPane), {
                name: "incident",
                tab: "安全事件"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    "header-extra": withCtx(() => [
                      createVNode(unref(Button), {
                        type: "error",
                        size: "small",
                        onClick: openIncident
                      }, {
                        default: withCtx(() => [..._cache[74] || (_cache[74] = [
                          createTextVNode("+ 上报事件", -1)
                        ])]),
                        _: 1
                      })
                    ]),
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$2), {
                        columns: incidentColumns,
                        data: unref(operationsStore).incidents,
                        loading: unref(operationsStore).loading,
                        pagination: { pageSize: 12 }
                      }, null, 8, ["data", "loading"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(NTabPane), {
                name: "visitor",
                tab: "探视登记"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    "header-extra": withCtx(() => [
                      createVNode(unref(Button), {
                        type: "primary",
                        size: "small",
                        onClick: openVisitor
                      }, {
                        default: withCtx(() => [..._cache[75] || (_cache[75] = [
                          createTextVNode("+ 探视预约", -1)
                        ])]),
                        _: 1
                      })
                    ]),
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$2), {
                        columns: visitorColumns,
                        data: unref(operationsStore).visitors,
                        loading: unref(operationsStore).loading,
                        pagination: { pageSize: 12 }
                      }, null, 8, ["data", "loading"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(NTabPane), {
                name: "communication",
                tab: "家属沟通"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    "header-extra": withCtx(() => [
                      createVNode(unref(Button), {
                        type: "primary",
                        size: "small",
                        onClick: openCommunication
                      }, {
                        default: withCtx(() => [..._cache[76] || (_cache[76] = [
                          createTextVNode("+ 沟通记录", -1)
                        ])]),
                        _: 1
                      })
                    ]),
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$2), {
                        columns: communicationColumns,
                        data: unref(operationsStore).communications,
                        loading: unref(operationsStore).loading,
                        pagination: { pageSize: 12 }
                      }, null, 8, ["data", "loading"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(NTabPane), {
                name: "inventory",
                tab: "物资药品"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    "header-extra": withCtx(() => [
                      createVNode(unref(Button), {
                        type: "primary",
                        size: "small",
                        onClick: openInventory
                      }, {
                        default: withCtx(() => [..._cache[77] || (_cache[77] = [
                          createTextVNode("+ 新建物品", -1)
                        ])]),
                        _: 1
                      })
                    ]),
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$2), {
                        columns: inventoryColumns,
                        data: unref(operationsStore).inventory,
                        loading: unref(operationsStore).loading,
                        pagination: { pageSize: 12 }
                      }, null, 8, ["data", "loading"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(NTabPane), {
                name: "document",
                tab: "合规文书"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    "header-extra": withCtx(() => [
                      createVNode(unref(Button), {
                        type: "primary",
                        size: "small",
                        onClick: openDocument
                      }, {
                        default: withCtx(() => [..._cache[78] || (_cache[78] = [
                          createTextVNode("+ 归档文书", -1)
                        ])]),
                        _: 1
                      })
                    ]),
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$2), {
                        columns: documentColumns,
                        data: unref(operationsStore).documents,
                        loading: unref(operationsStore).loading,
                        pagination: { pageSize: 12 }
                      }, null, 8, ["data", "loading"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(NTabPane), {
                name: "alert",
                tab: "健康预警"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$2), {
                        columns: alertColumns,
                        data: unref(operationsStore).healthAlerts,
                        loading: unref(operationsStore).loading,
                        pagination: { pageSize: 12 }
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
            show: handoverModal.value,
            "onUpdate:show": _cache[8] || (_cache[8] = ($event) => handoverModal.value = $event),
            preset: "card",
            title: "登记交接班",
            style: { "width": "640px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[7] || (_cache[7] = ($event) => handoverModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[79] || (_cache[79] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: saveHandover
                  }, {
                    default: withCtx(() => [..._cache[80] || (_cache[80] = [
                      createTextVNode("提交交接", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(NForm), {
                model: handoverForm.value,
                "label-placement": "left",
                "label-width": "90"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), { label: "交接时间" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: handoverForm.value.handover_date,
                        "onUpdate:value": _cache[0] || (_cache[0] = ($event) => handoverForm.value.handover_date = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "班次" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: handoverForm.value.shift,
                        "onUpdate:value": _cache[1] || (_cache[1] = ($event) => handoverForm.value.shift = $event),
                        options: shiftOptions
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "交班人",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: handoverForm.value.outgoing_staff,
                        "onUpdate:value": _cache[2] || (_cache[2] = ($event) => handoverForm.value.outgoing_staff = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "接班人" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: handoverForm.value.incoming_staff,
                        "onUpdate:value": _cache[3] || (_cache[3] = ($event) => handoverForm.value.incoming_staff = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "住民摘要" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: handoverForm.value.resident_summary,
                        "onUpdate:value": _cache[4] || (_cache[4] = ($event) => handoverForm.value.resident_summary = $event),
                        type: "textarea",
                        rows: 2
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "异常情况" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: handoverForm.value.abnormal_summary,
                        "onUpdate:value": _cache[5] || (_cache[5] = ($event) => handoverForm.value.abnormal_summary = $event),
                        type: "textarea",
                        rows: 2
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "待办事项" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: handoverForm.value.pending_items,
                        "onUpdate:value": _cache[6] || (_cache[6] = ($event) => handoverForm.value.pending_items = $event),
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
            show: incidentModal.value,
            "onUpdate:show": _cache[18] || (_cache[18] = ($event) => incidentModal.value = $event),
            preset: "card",
            title: "上报安全事件",
            style: { "width": "620px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[17] || (_cache[17] = ($event) => incidentModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[81] || (_cache[81] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "error",
                    onClick: saveIncident
                  }, {
                    default: withCtx(() => [..._cache[82] || (_cache[82] = [
                      createTextVNode("上报", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(NForm), {
                model: incidentForm.value,
                "label-placement": "left",
                "label-width": "90"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), { label: "关联老人" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: incidentForm.value.elderly_id,
                        "onUpdate:value": _cache[9] || (_cache[9] = ($event) => incidentForm.value.elderly_id = $event),
                        options: elderlyOptions.value,
                        clearable: "",
                        filterable: ""
                      }, null, 8, ["value", "options"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "事件类型" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: incidentForm.value.incident_type,
                        "onUpdate:value": _cache[10] || (_cache[10] = ($event) => incidentForm.value.incident_type = $event),
                        options: incidentTypeOptions
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "紧急程度" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: incidentForm.value.severity,
                        "onUpdate:value": _cache[11] || (_cache[11] = ($event) => incidentForm.value.severity = $event),
                        options: severityOptions
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "发生时间" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: incidentForm.value.occurred_at,
                        "onUpdate:value": _cache[12] || (_cache[12] = ($event) => incidentForm.value.occurred_at = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "发生地点" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: incidentForm.value.location,
                        "onUpdate:value": _cache[13] || (_cache[13] = ($event) => incidentForm.value.location = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "事件经过",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: incidentForm.value.description,
                        "onUpdate:value": _cache[14] || (_cache[14] = ($event) => incidentForm.value.description = $event),
                        type: "textarea",
                        rows: 3
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "即时处置" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: incidentForm.value.immediate_action,
                        "onUpdate:value": _cache[15] || (_cache[15] = ($event) => incidentForm.value.immediate_action = $event),
                        type: "textarea",
                        rows: 2
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "责任人员" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: incidentForm.value.responsible,
                        "onUpdate:value": _cache[16] || (_cache[16] = ($event) => incidentForm.value.responsible = $event)
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
            show: incidentCloseModal.value,
            "onUpdate:show": _cache[21] || (_cache[21] = ($event) => incidentCloseModal.value = $event),
            preset: "card",
            title: "关闭安全事件",
            style: { "width": "480px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[20] || (_cache[20] = ($event) => incidentCloseModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[83] || (_cache[83] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: closeIncident
                  }, {
                    default: withCtx(() => [..._cache[84] || (_cache[84] = [
                      createTextVNode("确认关闭", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(NForm), null, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), {
                    label: "处置结果与复盘",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: incidentCloseNote.value,
                        "onUpdate:value": _cache[19] || (_cache[19] = ($event) => incidentCloseNote.value = $event),
                        type: "textarea",
                        rows: 4
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["show"]),
          createVNode(unref(NModal), {
            show: visitorModal.value,
            "onUpdate:show": _cache[31] || (_cache[31] = ($event) => visitorModal.value = $event),
            preset: "card",
            title: "探视预约",
            style: { "width": "560px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[30] || (_cache[30] = ($event) => visitorModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[85] || (_cache[85] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: saveVisitor
                  }, {
                    default: withCtx(() => [..._cache[86] || (_cache[86] = [
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
                model: visitorForm.value,
                "label-placement": "left",
                "label-width": "90"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), {
                    label: "老人",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: visitorForm.value.elderly_id,
                        "onUpdate:value": _cache[22] || (_cache[22] = ($event) => visitorForm.value.elderly_id = $event),
                        options: elderlyOptions.value,
                        filterable: ""
                      }, null, 8, ["value", "options"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "访客姓名",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: visitorForm.value.visitor_name,
                        "onUpdate:value": _cache[23] || (_cache[23] = ($event) => visitorForm.value.visitor_name = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "关系" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: visitorForm.value.relation,
                        "onUpdate:value": _cache[24] || (_cache[24] = ($event) => visitorForm.value.relation = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "联系电话" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: visitorForm.value.phone,
                        "onUpdate:value": _cache[25] || (_cache[25] = ($event) => visitorForm.value.phone = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "预约时间" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: visitorForm.value.visit_at,
                        "onUpdate:value": _cache[26] || (_cache[26] = ($event) => visitorForm.value.visit_at = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "来访事由" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: visitorForm.value.purpose,
                        "onUpdate:value": _cache[27] || (_cache[27] = ($event) => visitorForm.value.purpose = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "审批人" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: visitorForm.value.approved_by,
                        "onUpdate:value": _cache[28] || (_cache[28] = ($event) => visitorForm.value.approved_by = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "备注" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: visitorForm.value.remark,
                        "onUpdate:value": _cache[29] || (_cache[29] = ($event) => visitorForm.value.remark = $event)
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
            show: communicationModal.value,
            "onUpdate:show": _cache[40] || (_cache[40] = ($event) => communicationModal.value = $event),
            preset: "card",
            title: "家属沟通记录",
            style: { "width": "600px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[39] || (_cache[39] = ($event) => communicationModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[87] || (_cache[87] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: saveCommunication
                  }, {
                    default: withCtx(() => [..._cache[88] || (_cache[88] = [
                      createTextVNode("保存记录", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(NForm), {
                model: communicationForm.value,
                "label-placement": "left",
                "label-width": "90"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), {
                    label: "老人",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: communicationForm.value.elderly_id,
                        "onUpdate:value": _cache[32] || (_cache[32] = ($event) => communicationForm.value.elderly_id = $event),
                        options: elderlyOptions.value,
                        filterable: ""
                      }, null, 8, ["value", "options"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "联系人",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: communicationForm.value.contact_name,
                        "onUpdate:value": _cache[33] || (_cache[33] = ($event) => communicationForm.value.contact_name = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "沟通渠道" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: communicationForm.value.channel,
                        "onUpdate:value": _cache[34] || (_cache[34] = ($event) => communicationForm.value.channel = $event),
                        options: channelOptions
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "沟通时间" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: communicationForm.value.communicated_at,
                        "onUpdate:value": _cache[35] || (_cache[35] = ($event) => communicationForm.value.communicated_at = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "沟通内容",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: communicationForm.value.content,
                        "onUpdate:value": _cache[36] || (_cache[36] = ($event) => communicationForm.value.content = $event),
                        type: "textarea",
                        rows: 3
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "后续跟进" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: communicationForm.value.follow_up,
                        "onUpdate:value": _cache[37] || (_cache[37] = ($event) => communicationForm.value.follow_up = $event),
                        type: "textarea",
                        rows: 2
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "沟通人员" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: communicationForm.value.communicator,
                        "onUpdate:value": _cache[38] || (_cache[38] = ($event) => communicationForm.value.communicator = $event)
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
            show: inventoryModal.value,
            "onUpdate:show": _cache[51] || (_cache[51] = ($event) => inventoryModal.value = $event),
            preset: "card",
            title: "新建库存物品",
            style: { "width": "560px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[50] || (_cache[50] = ($event) => inventoryModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[89] || (_cache[89] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: saveInventory
                  }, {
                    default: withCtx(() => [..._cache[90] || (_cache[90] = [
                      createTextVNode("建立物品", -1)
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
                "label-width": "90"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), { label: "类别" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: inventoryForm.value.category,
                        "onUpdate:value": _cache[41] || (_cache[41] = ($event) => inventoryForm.value.category = $event),
                        options: inventoryCategoryOptions
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "物品名称",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: inventoryForm.value.name,
                        "onUpdate:value": _cache[42] || (_cache[42] = ($event) => inventoryForm.value.name = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "规格" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: inventoryForm.value.specification,
                        "onUpdate:value": _cache[43] || (_cache[43] = ($event) => inventoryForm.value.specification = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "单位",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: inventoryForm.value.unit,
                        "onUpdate:value": _cache[44] || (_cache[44] = ($event) => inventoryForm.value.unit = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "初始库存" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInputNumber), {
                        value: inventoryForm.value.quantity,
                        "onUpdate:value": _cache[45] || (_cache[45] = ($event) => inventoryForm.value.quantity = $event),
                        min: 0,
                        style: { "width": "100%" }
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "预警下限" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInputNumber), {
                        value: inventoryForm.value.min_quantity,
                        "onUpdate:value": _cache[46] || (_cache[46] = ($event) => inventoryForm.value.min_quantity = $event),
                        min: 0,
                        style: { "width": "100%" }
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "有效期" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: inventoryForm.value.expiry_date,
                        "onUpdate:value": _cache[47] || (_cache[47] = ($event) => inventoryForm.value.expiry_date = $event),
                        placeholder: "YYYY-MM-DD，可留空"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "供应商" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: inventoryForm.value.supplier,
                        "onUpdate:value": _cache[48] || (_cache[48] = ($event) => inventoryForm.value.supplier = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "备注" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: inventoryForm.value.remark,
                        "onUpdate:value": _cache[49] || (_cache[49] = ($event) => inventoryForm.value.remark = $event)
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
            show: inventoryTransactionModal.value,
            "onUpdate:show": _cache[59] || (_cache[59] = ($event) => inventoryTransactionModal.value = $event),
            preset: "card",
            title: `${transactionItem.value?.name ?? ""} - 出入库`,
            style: { "width": "720px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[58] || (_cache[58] = ($event) => inventoryTransactionModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[91] || (_cache[91] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: saveTransaction
                  }, {
                    default: withCtx(() => [..._cache[92] || (_cache[92] = [
                      createTextVNode("确认保存", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(NForm), {
                model: transactionForm.value,
                "label-placement": "left",
                "label-width": "90"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), { label: "操作类型" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: transactionForm.value.transaction_type,
                        "onUpdate:value": _cache[52] || (_cache[52] = ($event) => transactionForm.value.transaction_type = $event),
                        options: [{ label: "入库", value: "in" }, { label: "出库", value: "out" }, { label: "盘点调整（正入负出）", value: "adjust" }]
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "数量" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInputNumber), {
                        value: transactionForm.value.quantity,
                        "onUpdate:value": _cache[53] || (_cache[53] = ($event) => transactionForm.value.quantity = $event),
                        min: transactionForm.value.transaction_type === "adjust" ? void 0 : 0.01,
                        style: { "width": "100%" }
                      }, null, 8, ["value", "min"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "发生时间" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: transactionForm.value.occurred_at,
                        "onUpdate:value": _cache[54] || (_cache[54] = ($event) => transactionForm.value.occurred_at = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "操作人" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: transactionForm.value.operator,
                        "onUpdate:value": _cache[55] || (_cache[55] = ($event) => transactionForm.value.operator = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "关联单号" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: transactionForm.value.reference_no,
                        "onUpdate:value": _cache[56] || (_cache[56] = ($event) => transactionForm.value.reference_no = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "备注" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: transactionForm.value.remark,
                        "onUpdate:value": _cache[57] || (_cache[57] = ($event) => transactionForm.value.remark = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["model"]),
              createVNode(unref(_sfc_main$2), {
                columns: [{ title: "类型", key: "transaction_type", width: 80 }, { title: "数量", key: "quantity", width: 80 }, { title: "时间", key: "occurred_at", width: 150 }, { title: "操作人", key: "operator", width: 100 }, { title: "备注", key: "remark" }],
                data: unref(operationsStore).transactions,
                pagination: false,
                style: { "max-height": "220px" }
              }, null, 8, ["data"])
            ]),
            _: 1
          }, 8, ["show", "title"]),
          createVNode(unref(NModal), {
            show: documentModal.value,
            "onUpdate:show": _cache[68] || (_cache[68] = ($event) => documentModal.value = $event),
            preset: "card",
            title: "归档合规文书",
            style: { "width": "580px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[67] || (_cache[67] = ($event) => documentModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[94] || (_cache[94] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: saveDocument
                  }, {
                    default: withCtx(() => [..._cache[95] || (_cache[95] = [
                      createTextVNode("归档", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(NForm), {
                model: documentForm.value,
                "label-placement": "left",
                "label-width": "90"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), {
                    label: "老人",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: documentForm.value.elderly_id,
                        "onUpdate:value": _cache[60] || (_cache[60] = ($event) => documentForm.value.elderly_id = $event),
                        options: elderlyOptions.value,
                        filterable: ""
                      }, null, 8, ["value", "options"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "文书类型",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: documentForm.value.document_type,
                        "onUpdate:value": _cache[61] || (_cache[61] = ($event) => documentForm.value.document_type = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "文书名称",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: documentForm.value.document_name,
                        "onUpdate:value": _cache[62] || (_cache[62] = ($event) => documentForm.value.document_name = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "附件" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSpace), {
                        vertical: "",
                        style: { "width": "100%" }
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Button), { onClick: selectDocumentAttachment }, {
                            default: withCtx(() => [..._cache[93] || (_cache[93] = [
                              createTextVNode("选择并归档附件", -1)
                            ])]),
                            _: 1
                          }),
                          createVNode(unref(NInput), {
                            value: documentFileName.value || documentForm.value.file_path,
                            readonly: "",
                            placeholder: "未选择附件"
                          }, null, 8, ["value"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "签署日期" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: documentForm.value.signed_at,
                        "onUpdate:value": _cache[63] || (_cache[63] = ($event) => documentForm.value.signed_at = $event),
                        placeholder: "YYYY-MM-DD，可留空"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "有效期" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: documentForm.value.expiry_date,
                        "onUpdate:value": _cache[64] || (_cache[64] = ($event) => documentForm.value.expiry_date = $event),
                        placeholder: "YYYY-MM-DD，可留空"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "保管人" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: documentForm.value.custodian,
                        "onUpdate:value": _cache[65] || (_cache[65] = ($event) => documentForm.value.custodian = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "备注" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: documentForm.value.remark,
                        "onUpdate:value": _cache[66] || (_cache[66] = ($event) => documentForm.value.remark = $event)
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
            show: alertResolveModal.value,
            "onUpdate:show": _cache[71] || (_cache[71] = ($event) => alertResolveModal.value = $event),
            preset: "card",
            title: "关闭健康预警",
            style: { "width": "500px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[70] || (_cache[70] = ($event) => alertResolveModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[96] || (_cache[96] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: resolveAlert
                  }, {
                    default: withCtx(() => [..._cache[97] || (_cache[97] = [
                      createTextVNode("确认关闭", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(NForm), null, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), {
                    label: "处置说明",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: alertResolution.value,
                        "onUpdate:value": _cache[69] || (_cache[69] = ($event) => alertResolution.value = $event),
                        type: "textarea",
                        rows: 4
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
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
