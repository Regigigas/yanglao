<script setup lang="ts">
  defineOptions({ name: 'Operations' });

  import {
    NButton,
    NCard,
    NForm,
    NFormItem,
    NInput,
    NInputNumber,
    NModal,
    NSelect,
    NSpace,
    NTabPane,
    NTag,
    NTabs,
    useMessage,
  } from 'naive-ui';
  import { computed, h, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { BasePage, BaseTable } from '@yanglao/ui';
  import { formatDateTime } from '@yanglao/core';
  import type {
    CareHandoverRow,
    CareIncidentRow,
    ElderlyDocumentRow,
    FamilyCommunicationRow,
    HealthAlertRow,
    InventoryItemRow,
    OperationsRiskRow,
    VisitorRecordRow,
  } from '@yanglao/db';
  import { usePageRefresh } from '../../composables/usePageRefresh';
  import { useAuthStore } from '../../stores/auth.store';
  import { useElderlyStore } from '../../stores/elderly.store';
  import { useOperationsStore } from '../../stores/operations.store';
  import DatabaseSafetyPanel from '../../components/DatabaseSafetyPanel.vue';

  const operationsStore = useOperationsStore();
  const elderlyStore = useElderlyStore();
  const authStore = useAuthStore();
  const router = useRouter();
  const message = useMessage();

  async function loadData() {
    await Promise.all([operationsStore.fetchAll(), elderlyStore.fetchList()]);
  }
  const { refresh, refreshing } = usePageRefresh(loadData);

  const elderlyOptions = computed(() =>
    elderlyStore.list
      .filter((elderly) => elderly.status === 'active')
      .map((elderly) => ({ label: elderly.name, value: elderly.id })),
  );
  const currentStaff = computed(
    () => authStore.currentUser?.real_name || authStore.currentUser?.username || '',
  );
  const now = () => formatDateTime(Date.now());
  const elderlyName = (id: string | null) =>
    id ? elderlyStore.list.find((elderly) => elderly.id === id)?.name ?? '已删除老人' : '公共事件';
  const errorText = (error: unknown, fallback: string) =>
    error instanceof Error ? error.message : fallback;
  const riskSourceLabel: Record<OperationsRiskRow['source'], string> = {
    health: '健康预警', iot: '设备告警', medication: '用药管理', care: '护理管理',
    admission: '入住管理', contract: '合同管理', fee: '费用管理', inventory: '库存台账', document: '文书台账',
  };
  const riskSourceRoute: Partial<Record<OperationsRiskRow['source'], string>> = {
    health: '/health', iot: '/iot-device', medication: '/health', care: '/care',
    admission: '/admission', contract: '/contract', fee: '/fee',
  };
  function openRiskSource(row: OperationsRiskRow) {
    const route = riskSourceRoute[row.source];
    if (route) void router.push(route);
  }

  async function runAction(action: () => Promise<unknown>, success: string) {
    try {
      await action();
      message.success(success);
      await operationsStore.fetchAll();
    } catch (error) {
      message.error(errorText(error, '操作失败'));
    }
  }

  const handoverModal = ref(false);
  const handoverForm = ref({
    handover_date: now(),
    shift: 'day' as CareHandoverRow['shift'],
    outgoing_staff: '',
    incoming_staff: '',
    resident_summary: '',
    abnormal_summary: '',
    pending_items: '',
  });
  const shiftOptions = [
    { label: '白班', value: 'day' },
    { label: '中班', value: 'evening' },
    { label: '夜班', value: 'night' },
  ];
  function openHandover() {
    handoverForm.value = {
      handover_date: now(), shift: 'day', outgoing_staff: currentStaff.value,
      incoming_staff: '', resident_summary: '', abnormal_summary: '', pending_items: '',
    };
    handoverModal.value = true;
  }
  async function saveHandover() {
    if (!handoverForm.value.outgoing_staff.trim()) return message.error('请填写交班人');
    await runAction(
      () => window.api.operations.handover.create({
        ...handoverForm.value,
        outgoing_staff: handoverForm.value.outgoing_staff.trim(),
        incoming_staff: handoverForm.value.incoming_staff.trim() || null,
        resident_summary: handoverForm.value.resident_summary.trim() || null,
        abnormal_summary: handoverForm.value.abnormal_summary.trim() || null,
        pending_items: handoverForm.value.pending_items.trim() || null,
      }),
      '交接班已登记',
    );
    handoverModal.value = false;
  }
  async function acknowledgeHandover(row: CareHandoverRow) {
    const staff = currentStaff.value;
    if (!staff) return message.error('无法识别当前工作人员');
    await runAction(() => window.api.operations.handover.acknowledge(row.id, staff), '已确认接班');
  }

  const incidentModal = ref(false);
  const incidentCloseModal = ref(false);
  const closingIncidentId = ref<string | null>(null);
  const incidentCloseNote = ref('');
  const incidentForm = ref({
    elderly_id: null as string | null,
    incident_type: 'fall' as CareIncidentRow['incident_type'],
    severity: 'urgent' as CareIncidentRow['severity'],
    occurred_at: now(), location: '', description: '', immediate_action: '', responsible: '',
  });
  const incidentTypeOptions = [
    { label: '跌倒', value: 'fall' }, { label: '走失风险', value: 'wandering' },
    { label: '噎食', value: 'choking' }, { label: '压疮', value: 'pressure_injury' },
    { label: '意外伤害', value: 'injury' }, { label: '其他', value: 'other' },
  ];
  const severityOptions = [
    { label: '一般', value: 'normal' }, { label: '紧急', value: 'urgent' }, { label: '危急', value: 'critical' },
  ];
  function openIncident() {
    incidentForm.value = { elderly_id: null, incident_type: 'fall', severity: 'urgent', occurred_at: now(), location: '', description: '', immediate_action: '', responsible: currentStaff.value };
    incidentModal.value = true;
  }
  async function saveIncident() {
    if (!incidentForm.value.description.trim()) return message.error('请填写事件经过');
    await runAction(
      () => window.api.operations.incident.create({
        ...incidentForm.value,
        location: incidentForm.value.location.trim() || null,
        description: incidentForm.value.description.trim(),
        immediate_action: incidentForm.value.immediate_action.trim() || null,
        responsible: incidentForm.value.responsible.trim() || null,
      }),
      '事件已上报，等待处置',
    );
    incidentModal.value = false;
  }
  function openIncidentClose(row: CareIncidentRow) {
    closingIncidentId.value = row.id;
    incidentCloseNote.value = '';
    incidentCloseModal.value = true;
  }
  async function closeIncident() {
    if (!closingIncidentId.value || !incidentCloseNote.value.trim()) return message.error('请填写处置结果');
    await runAction(() => window.api.operations.incident.close(closingIncidentId.value!, incidentCloseNote.value), '事件已关闭');
    incidentCloseModal.value = false;
  }

  const visitorModal = ref(false);
  const visitorForm = ref({ elderly_id: '', visitor_name: '', relation: '', phone: '', visit_at: now(), purpose: '', approved_by: '', remark: '' });
  function openVisitor() {
    visitorForm.value = { elderly_id: '', visitor_name: '', relation: '', phone: '', visit_at: now(), purpose: '', approved_by: currentStaff.value, remark: '' };
    visitorModal.value = true;
  }
  async function saveVisitor() {
    if (!visitorForm.value.elderly_id || !visitorForm.value.visitor_name.trim()) return message.error('请选择老人并填写访客姓名');
    await runAction(() => window.api.operations.visitor.create({
      ...visitorForm.value,
      visitor_name: visitorForm.value.visitor_name.trim(), relation: visitorForm.value.relation.trim() || null,
      phone: visitorForm.value.phone.trim() || null, purpose: visitorForm.value.purpose.trim() || null,
      approved_by: visitorForm.value.approved_by.trim() || null, remark: visitorForm.value.remark.trim() || null,
    }), '探视预约已登记');
    visitorModal.value = false;
  }

  const communicationModal = ref(false);
  const communicationForm = ref({ elderly_id: '', contact_name: '', channel: 'phone' as FamilyCommunicationRow['channel'], communicated_at: now(), content: '', follow_up: '', communicator: '' });
  const channelOptions = [
    { label: '电话', value: 'phone' }, { label: '微信', value: 'wechat' }, { label: '短信', value: 'sms' },
    { label: '当面沟通', value: 'face_to_face' }, { label: '其他', value: 'other' },
  ];
  function openCommunication() {
    communicationForm.value = { elderly_id: '', contact_name: '', channel: 'phone', communicated_at: now(), content: '', follow_up: '', communicator: currentStaff.value };
    communicationModal.value = true;
  }
  async function saveCommunication() {
    if (!communicationForm.value.elderly_id || !communicationForm.value.contact_name.trim() || !communicationForm.value.content.trim()) return message.error('请填写老人、联系人和沟通内容');
    await runAction(() => window.api.operations.communication.create({
      ...communicationForm.value, contact_name: communicationForm.value.contact_name.trim(), content: communicationForm.value.content.trim(),
      follow_up: communicationForm.value.follow_up.trim() || null, communicator: communicationForm.value.communicator.trim() || null,
    }), '家属沟通已登记');
    communicationModal.value = false;
  }

  const inventoryModal = ref(false);
  const inventoryTransactionModal = ref(false);
  const transactionItem = ref<InventoryItemRow | null>(null);
  const inventoryForm = ref({ category: 'medicine' as InventoryItemRow['category'], name: '', specification: '', unit: '盒', quantity: 0, min_quantity: 0, expiry_date: '', supplier: '', remark: '' });
  const transactionForm = ref({ transaction_type: 'in' as 'in' | 'out' | 'adjust', quantity: 1, occurred_at: now(), operator: '', reference_no: '', remark: '' });
  const inventoryCategoryOptions = [
    { label: '药品', value: 'medicine' }, { label: '护理耗材', value: 'care_supply' }, { label: '食品原料', value: 'food' }, { label: '其他', value: 'other' },
  ];
  function openInventory() {
    inventoryForm.value = { category: 'medicine', name: '', specification: '', unit: '盒', quantity: 0, min_quantity: 0, expiry_date: '', supplier: '', remark: '' };
    inventoryModal.value = true;
  }
  async function saveInventory() {
    if (!inventoryForm.value.name.trim() || !inventoryForm.value.unit.trim()) return message.error('请填写物品名称和单位');
    await runAction(() => window.api.operations.inventory.create({
      ...inventoryForm.value, name: inventoryForm.value.name.trim(), specification: inventoryForm.value.specification.trim() || null,
      unit: inventoryForm.value.unit.trim(), expiry_date: inventoryForm.value.expiry_date || null,
      supplier: inventoryForm.value.supplier.trim() || null, status: 'active', remark: inventoryForm.value.remark.trim() || null,
    }), '库存物品已建立');
    inventoryModal.value = false;
  }
  async function openTransaction(row: InventoryItemRow) {
    transactionItem.value = row;
    transactionForm.value = { transaction_type: 'in', quantity: 1, occurred_at: now(), operator: currentStaff.value, reference_no: '', remark: '' };
    await operationsStore.fetchTransactions(row.id);
    inventoryTransactionModal.value = true;
  }
  async function saveTransaction() {
    if (!transactionItem.value) return;
    await runAction(() => window.api.operations.inventory.transact({
      item_id: transactionItem.value!.id, ...transactionForm.value,
      operator: transactionForm.value.operator.trim() || null, reference_no: transactionForm.value.reference_no.trim() || null,
      remark: transactionForm.value.remark.trim() || null,
    }), '库存流水已登记');
    await operationsStore.fetchTransactions(transactionItem.value.id);
    inventoryTransactionModal.value = false;
  }

  const documentModal = ref(false);
  const documentFileName = ref('');
  const documentForm = ref({ elderly_id: '', document_type: '入住授权', document_name: '', file_path: '', signed_at: '', expiry_date: '', custodian: '', remark: '' });
  function openDocument() {
    documentForm.value = { elderly_id: '', document_type: '入住授权', document_name: '', file_path: '', signed_at: '', expiry_date: '', custodian: currentStaff.value, remark: '' };
    documentFileName.value = '';
    documentModal.value = true;
  }
  async function selectDocumentAttachment() {
    try {
      const result = await window.api.operations.document.selectAttachment();
      if (result.canceled || !result.filePath) return;
      documentForm.value.file_path = result.filePath;
      documentFileName.value = result.fileName || '已选择附件';
      if (!documentForm.value.document_name.trim() && result.fileName) {
        documentForm.value.document_name = result.fileName;
      }
    } catch (error) {
      message.error(errorText(error, '选择附件失败'));
    }
  }
  async function openDocumentAttachment(row: ElderlyDocumentRow) {
    if (!row.file_path) return;
    try {
      await window.api.operations.document.openAttachment(row.file_path);
    } catch (error) {
      message.error(errorText(error, '打开附件失败'));
    }
  }
  async function saveDocument() {
    if (!documentForm.value.elderly_id || !documentForm.value.document_type.trim() || !documentForm.value.document_name.trim()) return message.error('请填写老人、文书类型和名称');
    await runAction(() => window.api.operations.document.create({
      ...documentForm.value, document_type: documentForm.value.document_type.trim(), document_name: documentForm.value.document_name.trim(),
      file_path: documentForm.value.file_path.trim() || null, signed_at: documentForm.value.signed_at || null,
      expiry_date: documentForm.value.expiry_date || null, custodian: documentForm.value.custodian.trim() || null,
      remark: documentForm.value.remark.trim() || null,
    }), '文书已归档');
    documentModal.value = false;
  }

  const alertResolveModal = ref(false);
  const resolvingAlertId = ref<string | null>(null);
  const alertResolution = ref('');
  function openAlertResolve(row: HealthAlertRow) {
    resolvingAlertId.value = row.id;
    alertResolution.value = '';
    alertResolveModal.value = true;
  }
  async function resolveAlert() {
    if (!resolvingAlertId.value || !alertResolution.value.trim()) return message.error('请填写预警处置说明');
    await runAction(() => window.api.operations.healthAlert.resolve(resolvingAlertId.value!, currentStaff.value, alertResolution.value), '健康预警已关闭');
    alertResolveModal.value = false;
  }

  const statusTag = (status: string) => ({
    pending: 'warning', acknowledged: 'success', reported: 'error', processing: 'warning', closed: 'success',
    scheduled: 'info', checked_in: 'warning', checked_out: 'success', cancelled: 'default', open: 'error', resolved: 'success',
    valid: 'success', expiring: 'warning', expired: 'error', normal: 'default', urgent: 'warning', critical: 'error',
  }[status] ?? 'default') as 'default' | 'success' | 'warning' | 'error' | 'info';
  const statusText = (status: string) => ({
    pending: '待接班', acknowledged: '已接班', reported: '已上报', processing: '处理中', closed: '已关闭',
    scheduled: '已预约', checked_in: '探视中', checked_out: '已签离', cancelled: '已取消', open: '待跟进', resolved: '已关闭',
    valid: '有效', expiring: '即将到期', expired: '已过期', normal: '一般', urgent: '紧急', critical: '危急',
  }[status] ?? status);

  const handoverColumns = [
    { title: '时间', key: 'handover_date', width: 155 }, { title: '班次', key: 'shift', width: 80, render: (row: CareHandoverRow) => shiftOptions.find((item) => item.value === row.shift)?.label },
    { title: '交班人', key: 'outgoing_staff', width: 100 }, { title: '异常情况', key: 'abnormal_summary', ellipsis: { tooltip: true } },
    { title: '待办事项', key: 'pending_items', ellipsis: { tooltip: true } },
    { title: '状态', key: 'status', width: 90, render: (row: CareHandoverRow) => h(NTag, { type: statusTag(row.status) }, () => statusText(row.status)) },
    { title: '操作', key: 'actions', width: 100, render: (row: CareHandoverRow) => row.status === 'pending' ? h(NButton, { size: 'small', type: 'primary', onClick: () => acknowledgeHandover(row) }, () => '确认接班') : '—' },
  ];
  const riskColumns = [
    { title: '来源模块', key: 'source', width: 110, render: (row: OperationsRiskRow) => riskSourceLabel[row.source] },
    { title: '关联老人', key: 'elderly_name', width: 100, render: (row: OperationsRiskRow) => row.elderly_name || '—' },
    { title: '风险事项', key: 'title', width: 110 },
    { title: '详情', key: 'content', ellipsis: { tooltip: true } },
    { title: '级别', key: 'severity', width: 90, render: (row: OperationsRiskRow) => h(NTag, { type: statusTag(row.severity) }, () => statusText(row.severity)) },
    { title: '发生/到期', key: 'risk_at', width: 155 },
    { title: '操作', key: 'actions', width: 100, render: (row: OperationsRiskRow) => riskSourceRoute[row.source] ? h(NButton, { size: 'small', onClick: () => openRiskSource(row) }, () => '查看来源') : '本工作台' },
  ];
  const incidentColumns = [
    { title: '老人', key: 'elderly_id', width: 100, render: (row: CareIncidentRow) => elderlyName(row.elderly_id) }, { title: '类型', key: 'incident_type', width: 100, render: (row: CareIncidentRow) => incidentTypeOptions.find((item) => item.value === row.incident_type)?.label },
    { title: '发生时间', key: 'occurred_at', width: 155 }, { title: '经过', key: 'description', ellipsis: { tooltip: true } },
    { title: '级别', key: 'severity', width: 80, render: (row: CareIncidentRow) => h(NTag, { type: statusTag(row.severity) }, () => statusText(row.severity)) },
    { title: '状态', key: 'status', width: 90, render: (row: CareIncidentRow) => h(NTag, { type: statusTag(row.status) }, () => statusText(row.status)) },
    { title: '操作', key: 'actions', width: 260, render: (row: CareIncidentRow) => h(NSpace, { size: 4 }, { default: () => [
      ...(row.status === 'reported' ? [h(NButton, { size: 'small', onClick: () => runAction(() => window.api.operations.incident.start(row.id, currentStaff.value), '已开始处置') }, () => '开始处置')] : []),
      ...(row.status !== 'closed' && !row.family_notified_at ? [h(NButton, { size: 'small', onClick: () => runAction(() => window.api.operations.incident.notifyFamily(row.id), '已登记家属通知') }, () => '已通知家属')] : []),
      ...(row.status === 'processing' ? [h(NButton, { size: 'small', type: 'primary', onClick: () => openIncidentClose(row) }, () => '关闭事件')] : []),
    ] }) },
  ];
  const visitorColumns = [
    { title: '老人', key: 'elderly_id', width: 100, render: (row: VisitorRecordRow) => elderlyName(row.elderly_id) }, { title: '访客', key: 'visitor_name', width: 100 }, { title: '关系', key: 'relation', width: 100 },
    { title: '预约时间', key: 'visit_at', width: 155 }, { title: '状态', key: 'status', width: 90, render: (row: VisitorRecordRow) => h(NTag, { type: statusTag(row.status) }, () => statusText(row.status)) },
    { title: '操作', key: 'actions', width: 160, render: (row: VisitorRecordRow) => row.status === 'scheduled' ? h(NSpace, { size: 4 }, { default: () => [h(NButton, { size: 'small', onClick: () => runAction(() => window.api.operations.visitor.checkIn(row.id), '访客已签到') }, () => '签到'), h(NButton, { size: 'small', onClick: () => runAction(() => window.api.operations.visitor.cancel(row.id), '探视预约已取消') }, () => '取消')] }) : row.status === 'checked_in' ? h(NButton, { size: 'small', type: 'primary', onClick: () => runAction(() => window.api.operations.visitor.checkOut(row.id, now()), '访客已签离') }, () => '签离') : '—' },
  ];
  const communicationColumns = [
    { title: '老人', key: 'elderly_id', width: 100, render: (row: FamilyCommunicationRow) => elderlyName(row.elderly_id) }, { title: '联系人', key: 'contact_name', width: 100 }, { title: '渠道', key: 'channel', width: 90, render: (row: FamilyCommunicationRow) => channelOptions.find((item) => item.value === row.channel)?.label },
    { title: '沟通时间', key: 'communicated_at', width: 155 }, { title: '内容', key: 'content', ellipsis: { tooltip: true } }, { title: '跟进事项', key: 'follow_up', ellipsis: { tooltip: true } },
    { title: '状态', key: 'status', width: 90, render: (row: FamilyCommunicationRow) => h(NTag, { type: statusTag(row.status) }, () => statusText(row.status)) },
    { title: '操作', key: 'actions', width: 100, render: (row: FamilyCommunicationRow) => row.status === 'open' ? h(NButton, { size: 'small', type: 'primary', onClick: () => runAction(() => window.api.operations.communication.close(row.id), '沟通事项已关闭') }, () => '完成跟进') : '—' },
  ];
  const inventoryColumns = [
    { title: '类别', key: 'category', width: 100, render: (row: InventoryItemRow) => inventoryCategoryOptions.find((item) => item.value === row.category)?.label }, { title: '物品', key: 'name', width: 150 }, { title: '规格', key: 'specification', width: 110 },
    { title: '现存', key: 'quantity', width: 100, render: (row: InventoryItemRow) => `${row.quantity} ${row.unit}` }, { title: '预警下限', key: 'min_quantity', width: 100, render: (row: InventoryItemRow) => `${row.min_quantity} ${row.unit}` },
    { title: '有效期', key: 'expiry_date', width: 110, render: (row: InventoryItemRow) => row.expiry_date || '—' }, { title: '库存状态', key: 'stock', width: 100, render: (row: InventoryItemRow) => h(NTag, { type: row.quantity <= row.min_quantity ? 'error' : 'success' }, () => row.quantity <= row.min_quantity ? '库存不足' : '充足') },
    { title: '操作', key: 'actions', width: 100, render: (row: InventoryItemRow) => h(NButton, { size: 'small', onClick: () => openTransaction(row) }, () => '出入库') },
  ];
  const documentColumns = [
    { title: '老人', key: 'elderly_id', width: 100, render: (row: ElderlyDocumentRow) => elderlyName(row.elderly_id) }, { title: '类型', key: 'document_type', width: 120 }, { title: '名称', key: 'document_name', width: 160 },
    { title: '签署日期', key: 'signed_at', width: 110, render: (row: ElderlyDocumentRow) => row.signed_at || '—' }, { title: '有效期', key: 'expiry_date', width: 110, render: (row: ElderlyDocumentRow) => row.expiry_date || '长期' },
    { title: '状态', key: 'status', width: 100, render: (row: ElderlyDocumentRow) => h(NTag, { type: statusTag(row.status) }, () => statusText(row.status)) }, { title: '保管人', key: 'custodian', width: 100 },
    { title: '附件', key: 'actions', width: 90, render: (row: ElderlyDocumentRow) => row.file_path ? h(NButton, { size: 'small', onClick: () => openDocumentAttachment(row) }, () => '打开') : '—' },
  ];
  const alertColumns = [
    { title: '老人', key: 'elderly_id', width: 100, render: (row: HealthAlertRow) => elderlyName(row.elderly_id) }, { title: '预警内容', key: 'content', ellipsis: { tooltip: true } }, { title: '级别', key: 'severity', width: 90, render: (row: HealthAlertRow) => h(NTag, { type: statusTag(row.severity) }, () => statusText(row.severity)) },
    { title: '触发时间', key: 'opened_at', width: 160, render: (row: HealthAlertRow) => formatDateTime(row.opened_at) }, { title: '状态', key: 'status', width: 90, render: (row: HealthAlertRow) => h(NTag, { type: statusTag(row.status) }, () => statusText(row.status)) },
    { title: '操作', key: 'actions', width: 150, render: (row: HealthAlertRow) => row.status === 'open' ? h(NButton, { size: 'small', onClick: () => runAction(() => window.api.operations.healthAlert.start(row.id), '已开始处置') }, () => '开始处置') : row.status === 'processing' ? h(NButton, { size: 'small', type: 'primary', onClick: () => openAlertResolve(row) }, () => '关闭预警') : '—' },
  ];
</script>

<template>
  <BasePage title="运营与安全">
    <template #header-extra>
      <NButton size="small" :loading="refreshing" @click="refresh">刷新</NButton>
    </template>
    <NTabs type="line" animated>
      <NTabPane name="summary" tab="自动汇总">
        <NCard>
          <BaseTable :columns="riskColumns" :data="operationsStore.risks" :loading="operationsStore.loading" :pagination="{ pageSize: 15 }" />
        </NCard>
      </NTabPane>
      <NTabPane name="handover" tab="交接班">
        <NCard><template #header-extra><NButton type="primary" size="small" @click="openHandover">+ 登记交接</NButton></template><BaseTable :columns="handoverColumns" :data="operationsStore.handovers" :loading="operationsStore.loading" :pagination="{ pageSize: 12 }" /></NCard>
      </NTabPane>
      <NTabPane name="incident" tab="安全事件">
        <NCard><template #header-extra><NButton type="error" size="small" @click="openIncident">+ 上报事件</NButton></template><BaseTable :columns="incidentColumns" :data="operationsStore.incidents" :loading="operationsStore.loading" :pagination="{ pageSize: 12 }" /></NCard>
      </NTabPane>
      <NTabPane name="visitor" tab="探视登记">
        <NCard><template #header-extra><NButton type="primary" size="small" @click="openVisitor">+ 探视预约</NButton></template><BaseTable :columns="visitorColumns" :data="operationsStore.visitors" :loading="operationsStore.loading" :pagination="{ pageSize: 12 }" /></NCard>
      </NTabPane>
      <NTabPane name="communication" tab="家属沟通">
        <NCard><template #header-extra><NButton type="primary" size="small" @click="openCommunication">+ 沟通记录</NButton></template><BaseTable :columns="communicationColumns" :data="operationsStore.communications" :loading="operationsStore.loading" :pagination="{ pageSize: 12 }" /></NCard>
      </NTabPane>
      <NTabPane name="inventory" tab="物资药品">
        <NCard><template #header-extra><NButton type="primary" size="small" @click="openInventory">+ 新建物品</NButton></template><BaseTable :columns="inventoryColumns" :data="operationsStore.inventory" :loading="operationsStore.loading" :pagination="{ pageSize: 12 }" /></NCard>
      </NTabPane>
      <NTabPane name="document" tab="合规文书">
        <NCard><template #header-extra><NButton type="primary" size="small" @click="openDocument">+ 归档文书</NButton></template><BaseTable :columns="documentColumns" :data="operationsStore.documents" :loading="operationsStore.loading" :pagination="{ pageSize: 12 }" /></NCard>
      </NTabPane>
      <NTabPane name="alert" tab="健康预警">
        <NCard><BaseTable :columns="alertColumns" :data="operationsStore.healthAlerts" :loading="operationsStore.loading" :pagination="{ pageSize: 12 }" /></NCard>
      </NTabPane>
      <NTabPane name="data-safety" tab="数据安全">
        <NCard>
          <DatabaseSafetyPanel @synchronized="loadData" />
        </NCard>
      </NTabPane>
    </NTabs>

    <NModal v-model:show="handoverModal" preset="card" title="登记交接班" style="width: 640px"><NForm :model="handoverForm" label-placement="left" label-width="90"><NFormItem label="交接时间"><NInput v-model:value="handoverForm.handover_date" /></NFormItem><NFormItem label="班次"><NSelect v-model:value="handoverForm.shift" :options="shiftOptions" /></NFormItem><NFormItem label="交班人" required><NInput v-model:value="handoverForm.outgoing_staff" /></NFormItem><NFormItem label="接班人"><NInput v-model:value="handoverForm.incoming_staff" /></NFormItem><NFormItem label="住民摘要"><NInput v-model:value="handoverForm.resident_summary" type="textarea" :rows="2" /></NFormItem><NFormItem label="异常情况"><NInput v-model:value="handoverForm.abnormal_summary" type="textarea" :rows="2" /></NFormItem><NFormItem label="待办事项"><NInput v-model:value="handoverForm.pending_items" type="textarea" :rows="2" /></NFormItem></NForm><template #footer><NSpace justify="end"><NButton @click="handoverModal = false">取消</NButton><NButton type="primary" @click="saveHandover">提交交接</NButton></NSpace></template></NModal>
    <NModal v-model:show="incidentModal" preset="card" title="上报安全事件" style="width: 620px"><NForm :model="incidentForm" label-placement="left" label-width="90"><NFormItem label="关联老人"><NSelect v-model:value="incidentForm.elderly_id" :options="elderlyOptions" clearable filterable /></NFormItem><NFormItem label="事件类型"><NSelect v-model:value="incidentForm.incident_type" :options="incidentTypeOptions" /></NFormItem><NFormItem label="紧急程度"><NSelect v-model:value="incidentForm.severity" :options="severityOptions" /></NFormItem><NFormItem label="发生时间"><NInput v-model:value="incidentForm.occurred_at" /></NFormItem><NFormItem label="发生地点"><NInput v-model:value="incidentForm.location" /></NFormItem><NFormItem label="事件经过" required><NInput v-model:value="incidentForm.description" type="textarea" :rows="3" /></NFormItem><NFormItem label="即时处置"><NInput v-model:value="incidentForm.immediate_action" type="textarea" :rows="2" /></NFormItem><NFormItem label="责任人员"><NInput v-model:value="incidentForm.responsible" /></NFormItem></NForm><template #footer><NSpace justify="end"><NButton @click="incidentModal = false">取消</NButton><NButton type="error" @click="saveIncident">上报</NButton></NSpace></template></NModal>
    <NModal v-model:show="incidentCloseModal" preset="card" title="关闭安全事件" style="width: 480px"><NForm><NFormItem label="处置结果与复盘" required><NInput v-model:value="incidentCloseNote" type="textarea" :rows="4" /></NFormItem></NForm><template #footer><NSpace justify="end"><NButton @click="incidentCloseModal = false">取消</NButton><NButton type="primary" @click="closeIncident">确认关闭</NButton></NSpace></template></NModal>
    <NModal v-model:show="visitorModal" preset="card" title="探视预约" style="width: 560px"><NForm :model="visitorForm" label-placement="left" label-width="90"><NFormItem label="老人" required><NSelect v-model:value="visitorForm.elderly_id" :options="elderlyOptions" filterable /></NFormItem><NFormItem label="访客姓名" required><NInput v-model:value="visitorForm.visitor_name" /></NFormItem><NFormItem label="关系"><NInput v-model:value="visitorForm.relation" /></NFormItem><NFormItem label="联系电话"><NInput v-model:value="visitorForm.phone" /></NFormItem><NFormItem label="预约时间"><NInput v-model:value="visitorForm.visit_at" /></NFormItem><NFormItem label="来访事由"><NInput v-model:value="visitorForm.purpose" /></NFormItem><NFormItem label="审批人"><NInput v-model:value="visitorForm.approved_by" /></NFormItem><NFormItem label="备注"><NInput v-model:value="visitorForm.remark" /></NFormItem></NForm><template #footer><NSpace justify="end"><NButton @click="visitorModal = false">取消</NButton><NButton type="primary" @click="saveVisitor">保存预约</NButton></NSpace></template></NModal>
    <NModal v-model:show="communicationModal" preset="card" title="家属沟通记录" style="width: 600px"><NForm :model="communicationForm" label-placement="left" label-width="90"><NFormItem label="老人" required><NSelect v-model:value="communicationForm.elderly_id" :options="elderlyOptions" filterable /></NFormItem><NFormItem label="联系人" required><NInput v-model:value="communicationForm.contact_name" /></NFormItem><NFormItem label="沟通渠道"><NSelect v-model:value="communicationForm.channel" :options="channelOptions" /></NFormItem><NFormItem label="沟通时间"><NInput v-model:value="communicationForm.communicated_at" /></NFormItem><NFormItem label="沟通内容" required><NInput v-model:value="communicationForm.content" type="textarea" :rows="3" /></NFormItem><NFormItem label="后续跟进"><NInput v-model:value="communicationForm.follow_up" type="textarea" :rows="2" /></NFormItem><NFormItem label="沟通人员"><NInput v-model:value="communicationForm.communicator" /></NFormItem></NForm><template #footer><NSpace justify="end"><NButton @click="communicationModal = false">取消</NButton><NButton type="primary" @click="saveCommunication">保存记录</NButton></NSpace></template></NModal>
    <NModal v-model:show="inventoryModal" preset="card" title="新建库存物品" style="width: 560px"><NForm :model="inventoryForm" label-placement="left" label-width="90"><NFormItem label="类别"><NSelect v-model:value="inventoryForm.category" :options="inventoryCategoryOptions" /></NFormItem><NFormItem label="物品名称" required><NInput v-model:value="inventoryForm.name" /></NFormItem><NFormItem label="规格"><NInput v-model:value="inventoryForm.specification" /></NFormItem><NFormItem label="单位" required><NInput v-model:value="inventoryForm.unit" /></NFormItem><NFormItem label="初始库存"><NInputNumber v-model:value="inventoryForm.quantity" :min="0" style="width: 100%" /></NFormItem><NFormItem label="预警下限"><NInputNumber v-model:value="inventoryForm.min_quantity" :min="0" style="width: 100%" /></NFormItem><NFormItem label="有效期"><NInput v-model:value="inventoryForm.expiry_date" placeholder="YYYY-MM-DD，可留空" /></NFormItem><NFormItem label="供应商"><NInput v-model:value="inventoryForm.supplier" /></NFormItem><NFormItem label="备注"><NInput v-model:value="inventoryForm.remark" /></NFormItem></NForm><template #footer><NSpace justify="end"><NButton @click="inventoryModal = false">取消</NButton><NButton type="primary" @click="saveInventory">建立物品</NButton></NSpace></template></NModal>
    <NModal v-model:show="inventoryTransactionModal" preset="card" :title="`${transactionItem?.name ?? ''} - 出入库`" style="width: 720px"><NForm :model="transactionForm" label-placement="left" label-width="90"><NFormItem label="操作类型"><NSelect v-model:value="transactionForm.transaction_type" :options="[{ label: '入库', value: 'in' }, { label: '出库', value: 'out' }, { label: '盘点调整（正入负出）', value: 'adjust' }]" /></NFormItem><NFormItem label="数量"><NInputNumber v-model:value="transactionForm.quantity" :min="transactionForm.transaction_type === 'adjust' ? undefined : 0.01" style="width: 100%" /></NFormItem><NFormItem label="发生时间"><NInput v-model:value="transactionForm.occurred_at" /></NFormItem><NFormItem label="操作人"><NInput v-model:value="transactionForm.operator" /></NFormItem><NFormItem label="关联单号"><NInput v-model:value="transactionForm.reference_no" /></NFormItem><NFormItem label="备注"><NInput v-model:value="transactionForm.remark" /></NFormItem></NForm><BaseTable :columns="[{ title: '类型', key: 'transaction_type', width: 80 }, { title: '数量', key: 'quantity', width: 80 }, { title: '时间', key: 'occurred_at', width: 150 }, { title: '操作人', key: 'operator', width: 100 }, { title: '备注', key: 'remark' }]" :data="operationsStore.transactions" :pagination="false" style="max-height: 220px" /><template #footer><NSpace justify="end"><NButton @click="inventoryTransactionModal = false">取消</NButton><NButton type="primary" @click="saveTransaction">确认保存</NButton></NSpace></template></NModal>
    <NModal v-model:show="documentModal" preset="card" title="归档合规文书" style="width: 580px"><NForm :model="documentForm" label-placement="left" label-width="90"><NFormItem label="老人" required><NSelect v-model:value="documentForm.elderly_id" :options="elderlyOptions" filterable /></NFormItem><NFormItem label="文书类型" required><NInput v-model:value="documentForm.document_type" /></NFormItem><NFormItem label="文书名称" required><NInput v-model:value="documentForm.document_name" /></NFormItem><NFormItem label="附件"><NSpace vertical style="width: 100%"><NButton @click="selectDocumentAttachment">选择并归档附件</NButton><NInput :value="documentFileName || documentForm.file_path" readonly placeholder="未选择附件" /></NSpace></NFormItem><NFormItem label="签署日期"><NInput v-model:value="documentForm.signed_at" placeholder="YYYY-MM-DD，可留空" /></NFormItem><NFormItem label="有效期"><NInput v-model:value="documentForm.expiry_date" placeholder="YYYY-MM-DD，可留空" /></NFormItem><NFormItem label="保管人"><NInput v-model:value="documentForm.custodian" /></NFormItem><NFormItem label="备注"><NInput v-model:value="documentForm.remark" /></NFormItem></NForm><template #footer><NSpace justify="end"><NButton @click="documentModal = false">取消</NButton><NButton type="primary" @click="saveDocument">归档</NButton></NSpace></template></NModal>
    <NModal v-model:show="alertResolveModal" preset="card" title="关闭健康预警" style="width: 500px"><NForm><NFormItem label="处置说明" required><NInput v-model:value="alertResolution" type="textarea" :rows="4" /></NFormItem></NForm><template #footer><NSpace justify="end"><NButton @click="alertResolveModal = false">取消</NButton><NButton type="primary" @click="resolveAlert">确认关闭</NButton></NSpace></template></NModal>
  </BasePage>
</template>
