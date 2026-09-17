<script setup lang="ts">
/* global window */
import { computed, h, onMounted, ref } from 'vue';
import {
  NButton, NCard, NDescriptions, NDescriptionsItem, NForm, NFormItem, NGi, NGrid,
  NInput, NInputNumber, NModal, NSelect, NSpace, NStatistic, NTabPane,
  NTabs, NTag, useMessage,
} from 'naive-ui';
import BasePage from '@ui/components/BasePage.vue';
import BaseTable from '@ui/components/BaseTable.vue';
import type {
  AssistedServiceCatalogRow, ElderlyRow, MedicalFollowUpRow, MedicalPartnerRow, MedicalReferralRow,
  ProxyPurchaseItemRow, ProxyPurchaseOrderRow, UserRow,
} from '@yanglao/db';
import { useAuthStore } from '../../stores/auth.store';
import { useAssistedServicesStore } from '../../stores/assisted-services.store';

type SafeUser = Omit<UserRow, 'password_hash' | 'password_salt'>
type PurchaseDraft = { item_name: string; specification: string; quantity: number; unit: string; unit_price_yuan: number; medicine_type: 'otc' | 'prescription' | null; dosage: string; remark: string }
type ActionMode = 'assign' | 'prescription' | 'sign' | 'settle' | 'cancel_purchase' | 'cancel_referral'

const store = useAssistedServicesStore();
const auth = useAuthStore();
const message = useMessage();
const elderly = ref<ElderlyRow[]>([]);
const users = ref<SafeUser[]>([]);
const activeTab = ref('purchase');

const can = (action: string) => auth.canUseButton(`assisted-services:${action}`);
const yuan = (cents: number) => `¥${(Number(cents || 0) / 100).toFixed(2)}`;
const elderlyName = (id: string) => elderly.value.find(item => item.id === id)?.name ?? id;
const userName = (id: string) => { const user = users.value.find(item => item.id === id); return user?.real_name || user?.username || id; };
const elderlyOptions = computed(() => elderly.value.map(item => ({ label: `${item.name}${item.room_no ? ` · ${item.room_no}` : ''}`, value: item.id })));
const userOptions = computed(() => users.value.filter(item => item.status === 'active').map(item => ({ label: item.real_name || item.username, value: item.id })));
const partnerOptions = computed(() => store.partners.filter(item => item.status === 'active').map(item => ({ label: item.name, value: item.id })));
const serviceOptions = computed(() => store.serviceCatalog.filter(item => item.status === 'active').map(item => ({
  label: `${item.name}（${item.charge_mode === 'free' ? '免费' : item.charge_mode === 'fixed' ? `${yuan(item.default_service_fee_cents)}/单` : '按单计费'}）`,
  value: item.id,
})));

const purchaseCategories = [
  { label: '外卖餐食', value: 'takeaway' }, { label: '药品', value: 'medicine' },
  { label: '生活用品', value: 'daily_goods' }, { label: '代拿快递', value: 'package_pickup' },
  { label: '其他跑腿', value: 'errand' }, { label: '其他', value: 'other' },
];
const chargeModeOptions = [
  { label: '本单免费', value: 'free' }, { label: '固定收费', value: 'fixed' },
  { label: '按本单自定义', value: 'custom' },
];
const purchaseStatus: Record<ProxyPurchaseOrderRow['status'], { label: string; type: 'default' | 'info' | 'warning' | 'success' | 'error' }> = {
  pending: { label: '待派单', type: 'warning' }, assigned: { label: '已派单', type: 'info' },
  purchasing: { label: '采购中', type: 'info' }, delivering: { label: '配送中', type: 'info' },
  delivered: { label: '待结算', type: 'warning' }, settled: { label: '已结算', type: 'success' },
  cancelled: { label: '已取消', type: 'error' },
};
const referralStatus: Record<MedicalReferralRow['status'], { label: string; type: 'default' | 'info' | 'warning' | 'success' | 'error' }> = {
  pending: { label: '待确认', type: 'warning' }, confirmed: { label: '已确认', type: 'info' },
  departed: { label: '已出发', type: 'info' }, in_consultation: { label: '就诊中', type: 'warning' },
  completed: { label: '待随访', type: 'success' }, follow_up: { label: '随访中', type: 'success' },
  cancelled: { label: '已取消', type: 'error' },
};

async function run(action: () => Promise<unknown>, success?: string) {
  try { await action(); if (success) message.success(success); }
  catch (error) { message.error(error instanceof Error ? error.message : String(error)); }
}
async function refresh() { await run(() => store.refreshAll()); }

const showPurchase = ref(false);
const purchaseForm = ref({
  elderly_id: null as string | null, service_catalog_id: null as string | null,
  category: 'takeaway' as ProxyPurchaseOrderRow['category'], charge_mode: 'custom' as ProxyPurchaseOrderRow['charge_mode'],
  requester_name: '', requester_phone: '', merchant_name: '', delivery_address: '', expected_at: '',
  delivery_fee_yuan: 0, service_fee_yuan: 0, advance_amount_yuan: 0,
  prescription_required: 0 as 0 | 1, prescription_no: '', remark: '',
});
const purchaseDrafts = ref<PurchaseDraft[]>([]);
const emptyPurchaseDraft = (): PurchaseDraft => ({ item_name: '', specification: '', quantity: 1, unit: '件', unit_price_yuan: 0, medicine_type: null, dosage: '', remark: '' });
function openPurchase() {
  const service = store.serviceCatalog.find(item => item.status === 'active');
  purchaseForm.value = {
    elderly_id: null, service_catalog_id: service?.id ?? null, category: service?.category ?? 'takeaway',
    charge_mode: service?.charge_mode ?? 'custom', requester_name: '', requester_phone: '', merchant_name: '',
    delivery_address: '', expected_at: new Date(Date.now() + 3600000).toISOString().slice(0, 16).replace('T', ' '),
    delivery_fee_yuan: 0, service_fee_yuan: (service?.default_service_fee_cents ?? 0) / 100, advance_amount_yuan: 0,
    prescription_required: 0, prescription_no: '', remark: '',
  };
  purchaseDrafts.value = [emptyPurchaseDraft()];
  showPurchase.value = true;
}
function selectService(id: string | null) {
  const service = store.serviceCatalog.find(item => item.id === id);
  if (!service) return;
  purchaseForm.value.category = service.category;
  purchaseForm.value.charge_mode = service.charge_mode;
  purchaseForm.value.service_fee_yuan = service.charge_mode === 'free' ? 0 : service.default_service_fee_cents / 100;
  if (service.category === 'package_pickup' && purchaseDrafts.value.length === 1 && !purchaseDrafts.value[0]?.item_name) {
    purchaseDrafts.value[0] = { ...emptyPurchaseDraft(), item_name: '快递包裹', unit: '件' };
  }
}
function selectChargeMode(mode: ProxyPurchaseOrderRow['charge_mode']) {
  const service = store.serviceCatalog.find(item => item.id === purchaseForm.value.service_catalog_id);
  purchaseForm.value.service_fee_yuan = mode === 'free' ? 0 : mode === 'fixed' ? (service?.default_service_fee_cents ?? 0) / 100 : purchaseForm.value.service_fee_yuan;
}
function selectPurchaseElderly(id: string | null) {
  const row = elderly.value.find(item => item.id === id);
  if (!row) return;
  purchaseForm.value.requester_name = row.name;
  purchaseForm.value.requester_phone = row.phone ?? '';
  purchaseForm.value.delivery_address = row.room_no ? `院内 ${row.room_no}` : (row.address ?? '');
}
const purchaseTotal = computed(() => purchaseDrafts.value.reduce((sum, item) => sum + item.quantity * item.unit_price_yuan, 0)
  + purchaseForm.value.delivery_fee_yuan + purchaseForm.value.service_fee_yuan);
async function savePurchase() {
  const form = purchaseForm.value;
  if (!form.elderly_id || !form.service_catalog_id || !form.requester_name.trim() || !form.delivery_address.trim()) return message.error('请选择老人和服务项目，并填写申请人和送达地址');
  if (purchaseDrafts.value.some(item => !item.item_name.trim() || item.quantity <= 0 || item.unit_price_yuan < 0)) return message.error('请完整填写商品明细');
  await run(async () => {
    await store.createPurchase({
      elderly_id: form.elderly_id!, service_catalog_id: form.service_catalog_id,
      category: form.category, charge_mode: form.charge_mode, requester_name: form.requester_name,
      requester_phone: form.requester_phone || null, merchant_name: form.merchant_name || null,
      delivery_address: form.delivery_address, expected_at: form.expected_at || null,
      delivery_fee_cents: Math.round(form.delivery_fee_yuan * 100), service_fee_cents: Math.round(form.service_fee_yuan * 100),
      advance_amount_cents: Math.round(form.advance_amount_yuan * 100), prescription_required: form.prescription_required,
      prescription_no: form.prescription_no || null, created_by: auth.currentUser?.id ?? null,
      created_by_name: auth.currentUser?.real_name ?? auth.currentUser?.username ?? null, remark: form.remark || null,
    }, purchaseDrafts.value.map(item => ({
      item_name: item.item_name, specification: item.specification || null, quantity: item.quantity,
      unit: item.unit, unit_price_cents: Math.round(item.unit_price_yuan * 100),
      medicine_type: form.category === 'medicine' ? (item.medicine_type ?? 'otc') : null,
      dosage: item.dosage || null, remark: item.remark || null,
    })));
    showPurchase.value = false;
  }, '代买订单已登记');
}

const currentPurchase = ref<ProxyPurchaseOrderRow | null>(null);
const currentReferral = ref<MedicalReferralRow | null>(null);
const showAction = ref(false);
const actionMode = ref<ActionMode>('assign');
const actionValue = ref<string | null>(null);
const actionExtra = ref('');
const actionTitle = computed(() => ({
  assign: '指派代办人员', prescription: '核验药品处方', sign: '配送签收', settle: '订单结算',
  cancel_purchase: '取消代买订单', cancel_referral: '取消就医协作',
})[actionMode.value]);
function openAction(mode: ActionMode, purchase?: ProxyPurchaseOrderRow, referral?: MedicalReferralRow) {
  actionMode.value = mode; currentPurchase.value = purchase ?? null; currentReferral.value = referral ?? null;
  actionValue.value = mode === 'settle'
    ? (purchase?.total_amount_cents === 0 ? 'other' : 'monthly_bill')
    : (mode === 'assign' ? purchase?.assignee_id ?? null : '');
  actionExtra.value = mode === 'prescription' ? (purchase?.prescription_verified_by ?? auth.currentUser?.real_name ?? auth.currentUser?.username ?? '') : '';
  showAction.value = true;
}
async function saveAction() {
  const purchase = currentPurchase.value;
  const referral = currentReferral.value;
  if (!actionValue.value) return message.error('请填写操作信息');
  await run(async () => {
    if (actionMode.value === 'assign' && purchase) {
      await store.purchaseAction(() => window.api.assistedServices.purchase.assign(purchase.id, actionValue.value!, userName(actionValue.value!)));
    } else if (actionMode.value === 'prescription' && purchase) {
      if (!actionExtra.value.trim()) throw new Error('请填写核验人');
      await store.purchaseAction(() => window.api.assistedServices.purchase.verifyPrescription(purchase.id, actionValue.value!, actionExtra.value));
    } else if (actionMode.value === 'sign' && purchase) {
      await store.purchaseAction(() => window.api.assistedServices.purchase.sign(purchase.id, actionValue.value!));
    } else if (actionMode.value === 'settle' && purchase) {
      await store.purchaseAction(() => window.api.assistedServices.purchase.settle(purchase.id, actionValue.value!));
    } else if (actionMode.value === 'cancel_purchase' && purchase) {
      await store.purchaseAction(() => window.api.assistedServices.purchase.cancel(purchase.id, actionValue.value!));
    } else if (actionMode.value === 'cancel_referral' && referral) {
      await store.referralAction(() => window.api.assistedServices.referral.cancel(referral.id, actionValue.value!));
    }
    showAction.value = false;
  }, '操作成功');
}

const showPurchaseDetail = ref(false);
async function openPurchaseDetail(row: ProxyPurchaseOrderRow) {
  currentPurchase.value = row;
  await run(async () => { await store.fetchPurchaseItems(row.id); showPurchaseDetail.value = true; });
}

const purchaseColumns = [
  { title: '订单号', key: 'order_no', width: 170 },
  { title: '老人', key: 'elderly_id', width: 90, render: (r: ProxyPurchaseOrderRow) => elderlyName(r.elderly_id) },
  { title: '类型', key: 'category', width: 90, render: (r: ProxyPurchaseOrderRow) => purchaseCategories.find(item => item.value === r.category)?.label },
  { title: '商户/送达', key: 'merchant_name', minWidth: 170, render: (r: ProxyPurchaseOrderRow) => `${r.merchant_name || '待确定'} · ${r.delivery_address}` },
  { title: '金额/服务费', key: 'total_amount_cents', width: 130, render: (r: ProxyPurchaseOrderRow) => `${yuan(r.total_amount_cents)} / ${r.charge_mode === 'free' ? '免费' : yuan(r.service_fee_cents)}` },
  { title: '负责人', key: 'assignee_name', width: 90, render: (r: ProxyPurchaseOrderRow) => r.assignee_name || '-' },
  { title: '状态', key: 'status', width: 90, render: (r: ProxyPurchaseOrderRow) => h(NTag, { type: purchaseStatus[r.status].type }, () => purchaseStatus[r.status].label) },
  { title: '操作', key: 'actions', width: 330, render: (r: ProxyPurchaseOrderRow) => h(NSpace, { size: 6 }, () => [
    h(NButton, { size: 'tiny', onClick: () => openPurchaseDetail(r) }, () => '明细'),
    r.status === 'pending' && can('dispatch') ? h(NButton, { size: 'tiny', type: 'primary', onClick: () => openAction('assign', r) }, () => '派单') : null,
    r.category === 'medicine' && r.prescription_required === 1 && !r.prescription_verified_at && ['pending', 'assigned'].includes(r.status) && can('prescription') ? h(NButton, { size: 'tiny', onClick: () => openAction('prescription', r) }, () => '核验处方') : null,
    r.status === 'assigned' && can('dispatch') ? h(NButton, { size: 'tiny', type: 'primary', onClick: () => run(() => store.purchaseAction(() => window.api.assistedServices.purchase.start(r.id)), r.category === 'package_pickup' ? '开始取件' : '开始采购') }, () => r.category === 'package_pickup' ? '取件' : '采购') : null,
    r.status === 'purchasing' && can('dispatch') ? h(NButton, { size: 'tiny', onClick: () => run(() => store.purchaseAction(() => window.api.assistedServices.purchase.deliver(r.id)), r.category === 'package_pickup' ? '快递开始送达' : '开始配送') }, () => r.category === 'package_pickup' ? '送达' : '配送') : null,
    r.status === 'delivering' && can('dispatch') ? h(NButton, { size: 'tiny', type: 'success', onClick: () => openAction('sign', r) }, () => '签收') : null,
    r.status === 'delivered' && can('settle') ? h(NButton, { size: 'tiny', type: 'success', onClick: () => openAction('settle', r) }, () => '结算') : null,
    ['pending', 'assigned', 'purchasing'].includes(r.status) && can('dispatch') ? h(NButton, { size: 'tiny', type: 'error', onClick: () => openAction('cancel_purchase', r) }, () => '取消') : null,
  ]) },
];

const showCatalog = ref(false);
const editingCatalog = ref<AssistedServiceCatalogRow | null>(null);
const catalogForm = ref({
  code: '', name: '', category: 'package_pickup' as AssistedServiceCatalogRow['category'],
  charge_mode: 'free' as AssistedServiceCatalogRow['charge_mode'], default_service_fee_yuan: 0,
  status: 'active' as AssistedServiceCatalogRow['status'], sort_order: 0, remark: '',
});
function openCatalog(row?: AssistedServiceCatalogRow) {
  editingCatalog.value = row ?? null;
  catalogForm.value = row ? {
    code: row.code, name: row.name, category: row.category, charge_mode: row.charge_mode,
    default_service_fee_yuan: row.default_service_fee_cents / 100, status: row.status,
    sort_order: row.sort_order, remark: row.remark ?? '',
  } : {
    code: '', name: '', category: 'package_pickup', charge_mode: 'free',
    default_service_fee_yuan: 0, status: 'active', sort_order: store.serviceCatalog.length * 10 + 10, remark: '',
  };
  showCatalog.value = true;
}
async function saveCatalog() {
  const form = catalogForm.value;
  if (!form.code.trim() || !form.name.trim()) return message.error('请填写服务编码和名称');
  await run(async () => {
    const data = {
      code: form.code.trim(), name: form.name.trim(), category: form.category, charge_mode: form.charge_mode,
      default_service_fee_cents: form.charge_mode === 'free' ? 0 : Math.round(form.default_service_fee_yuan * 100),
      status: form.status, sort_order: form.sort_order, remark: form.remark || null,
    };
    if (editingCatalog.value) await store.updateServiceCatalog(editingCatalog.value.id, data);
    else await store.createServiceCatalog(data);
    showCatalog.value = false;
  }, '服务收费设置已保存');
}
const catalogColumns = [
  { title: '服务项目', key: 'name', minWidth: 150 },
  { title: '编码', key: 'code', width: 140 },
  { title: '业务类型', key: 'category', width: 110, render: (r: AssistedServiceCatalogRow) => purchaseCategories.find(item => item.value === r.category)?.label },
  { title: '收费规则', key: 'charge_mode', width: 120, render: (r: AssistedServiceCatalogRow) => r.charge_mode === 'free' ? '免费' : r.charge_mode === 'fixed' ? `固定 ${yuan(r.default_service_fee_cents)}/单` : '按单自定义' },
  { title: '说明', key: 'remark', minWidth: 180, render: (r: AssistedServiceCatalogRow) => r.remark || '-' },
  { title: '状态', key: 'status', width: 80, render: (r: AssistedServiceCatalogRow) => h(NTag, { type: r.status === 'active' ? 'success' : 'default' }, () => r.status === 'active' ? '启用' : '停用') },
  { title: '操作', key: 'actions', width: 150, render: (r: AssistedServiceCatalogRow) => h(NSpace, () => [
    can('catalog') ? h(NButton, { size: 'tiny', onClick: () => openCatalog(r) }, () => '编辑') : null,
    can('catalog') ? h(NButton, { size: 'tiny', onClick: () => run(() => store.updateServiceCatalog(r.id, { status: r.status === 'active' ? 'inactive' : 'active' }), '状态已更新') }, () => r.status === 'active' ? '停用' : '启用') : null,
  ]) },
];

const showPartner = ref(false);
const editingPartner = ref<MedicalPartnerRow | null>(null);
const partnerForm = ref({ name: '', partner_type: 'clinic' as MedicalPartnerRow['partner_type'], hospital_level: '', specialties: '', contact_name: '', contact_phone: '', address: '', emergency_channel: '', agreement_no: '', agreement_start: '', agreement_end: '', settlement_cycle: '按月', status: 'active' as MedicalPartnerRow['status'], remark: '' });
function openPartner(row?: MedicalPartnerRow) {
  editingPartner.value = row ?? null;
  partnerForm.value = row ? {
    name: row.name, partner_type: row.partner_type, hospital_level: row.hospital_level ?? '', specialties: row.specialties ?? '',
    contact_name: row.contact_name ?? '', contact_phone: row.contact_phone ?? '', address: row.address ?? '',
    emergency_channel: row.emergency_channel ?? '', agreement_no: row.agreement_no ?? '', agreement_start: row.agreement_start ?? '',
    agreement_end: row.agreement_end ?? '', settlement_cycle: row.settlement_cycle ?? '', status: row.status, remark: row.remark ?? '',
  } : { name: '', partner_type: 'clinic', hospital_level: '', specialties: '', contact_name: '', contact_phone: '', address: '', emergency_channel: '', agreement_no: '', agreement_start: '', agreement_end: '', settlement_cycle: '按月', status: 'active', remark: '' };
  showPartner.value = true;
}
async function savePartner() {
  if (!partnerForm.value.name.trim()) return message.error('请填写机构名称');
  const data = Object.fromEntries(Object.entries(partnerForm.value).map(([key, value]) => [key, value === '' ? null : value])) as unknown as Omit<MedicalPartnerRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>;
  await run(async () => {
    if (editingPartner.value) await store.updatePartner(editingPartner.value.id, data);
    else await store.createPartner(data);
    showPartner.value = false;
  }, '合作机构已保存');
}
const partnerColumns = [
  { title: '机构', key: 'name', minWidth: 150 }, { title: '类型', key: 'partner_type', width: 100 },
  { title: '专科/能力', key: 'specialties', minWidth: 160, render: (r: MedicalPartnerRow) => r.specialties || '-' },
  { title: '联系人', key: 'contact_name', width: 120, render: (r: MedicalPartnerRow) => `${r.contact_name || '-'} ${r.contact_phone || ''}` },
  { title: '绿色/急诊通道', key: 'emergency_channel', minWidth: 160, render: (r: MedicalPartnerRow) => r.emergency_channel || '-' },
  { title: '协议期', key: 'agreement_end', width: 120, render: (r: MedicalPartnerRow) => r.agreement_end || '-' },
  { title: '状态', key: 'status', width: 80, render: (r: MedicalPartnerRow) => h(NTag, { type: r.status === 'active' ? 'success' : 'default' }, () => r.status === 'active' ? '合作中' : '已停用') },
  { title: '操作', key: 'actions', width: 150, render: (r: MedicalPartnerRow) => h(NSpace, () => [
    can('partner') ? h(NButton, { size: 'tiny', onClick: () => openPartner(r) }, () => '编辑') : null,
    can('partner') ? h(NButton, { size: 'tiny', onClick: () => run(() => store.updatePartner(r.id, { status: r.status === 'active' ? 'inactive' : 'active' }), '状态已更新') }, () => r.status === 'active' ? '停用' : '启用') : null,
  ]) },
];

const showReferral = ref(false);
const referralForm = ref({ elderly_id: null as string | null, partner_id: null as string | null, service_type: 'consultation' as MedicalReferralRow['service_type'], priority: 'normal' as MedicalReferralRow['priority'], appointment_at: '', department: '', doctor: '', reason: '', symptoms: '', escort_required: 0 as 0 | 1, escort_user_id: null as string | null, remark: '' });
function openReferral() {
  referralForm.value = { elderly_id: null, partner_id: null, service_type: 'consultation', priority: 'normal', appointment_at: new Date(Date.now() + 86400000).toISOString().slice(0, 16).replace('T', ' '), department: '', doctor: '', reason: '', symptoms: '', escort_required: 0, escort_user_id: null, remark: '' };
  showReferral.value = true;
}
async function saveReferral() {
  const f = referralForm.value;
  if (!f.elderly_id || !f.partner_id || !f.appointment_at || !f.reason.trim()) return message.error('请选择老人、机构并填写预约时间和原因');
  if (f.escort_required === 1 && !f.escort_user_id) return message.error('请选择陪诊人员');
  await run(async () => {
    await store.createReferral({
      elderly_id: f.elderly_id!, partner_id: f.partner_id!, service_type: f.service_type, priority: f.priority,
      appointment_at: f.appointment_at, department: f.department || null, doctor: f.doctor || null,
      reason: f.reason, symptoms: f.symptoms || null, escort_required: f.escort_required,
      escort_user_id: f.escort_user_id, escort_user_name: f.escort_user_id ? userName(f.escort_user_id) : null,
      created_by: auth.currentUser?.id ?? null, created_by_name: auth.currentUser?.real_name ?? auth.currentUser?.username ?? null,
      remark: f.remark || null,
    });
    showReferral.value = false;
  }, '就医协作已登记');
}

const showComplete = ref(false);
const showReferralDetail = ref(false);
const referralFollowUps = ref<MedicalFollowUpRow[]>([]);
async function openReferralDetail(row: MedicalReferralRow) {
  currentReferral.value = row;
  await run(async () => {
    referralFollowUps.value = await window.api.assistedServices.followUp.list(row.id);
    showReferralDetail.value = true;
  });
}
const completeForm = ref({ diagnosis: '', treatment_plan: '', prescription: '', next_visit_at: '', medical_fee_yuan: 0, transport_fee_yuan: 0, service_fee_yuan: 0, settlement_method: 'monthly_bill' as 'paid' | 'monthly_bill' });
function openComplete(row: MedicalReferralRow) { currentReferral.value = row; completeForm.value = { diagnosis: '', treatment_plan: '', prescription: '', next_visit_at: '', medical_fee_yuan: 0, transport_fee_yuan: 0, service_fee_yuan: 0, settlement_method: 'monthly_bill' }; showComplete.value = true; }
async function saveComplete() {
  if (!currentReferral.value || !completeForm.value.diagnosis.trim()) return message.error('请填写诊断结果');
  const f = completeForm.value;
  await run(async () => {
    await store.completeReferral(currentReferral.value!.id, {
      diagnosis: f.diagnosis, treatment_plan: f.treatment_plan || null, prescription: f.prescription || null,
      next_visit_at: f.next_visit_at || null, medical_fee_cents: Math.round(f.medical_fee_yuan * 100),
      transport_fee_cents: Math.round(f.transport_fee_yuan * 100), service_fee_cents: Math.round(f.service_fee_yuan * 100),
      settlement_method: f.settlement_method,
    }); showComplete.value = false;
  }, '就诊结果已归档');
}

const showFollowUp = ref(false);
const followForm = ref({ follow_up_at: '', method: 'phone' as MedicalFollowUpRow['method'], condition: '', medication_compliance: '', adverse_reaction: '', next_action: '', next_follow_up_at: '' });
function openFollowUp(row: MedicalReferralRow) { currentReferral.value = row; followForm.value = { follow_up_at: new Date().toISOString().slice(0, 16).replace('T', ' '), method: 'phone', condition: '', medication_compliance: '', adverse_reaction: '', next_action: '', next_follow_up_at: '' }; showFollowUp.value = true; }
async function saveFollowUp() {
  if (!currentReferral.value || !followForm.value.condition.trim()) return message.error('请填写随访情况');
  const f = followForm.value;
  await run(async () => {
    await store.createFollowUp({ referral_id: currentReferral.value!.id, follow_up_at: f.follow_up_at, method: f.method,
      condition: f.condition, medication_compliance: f.medication_compliance || null, adverse_reaction: f.adverse_reaction || null,
      next_action: f.next_action || null, next_follow_up_at: f.next_follow_up_at || null,
      staff_id: auth.currentUser?.id ?? null, staff_name: auth.currentUser?.real_name ?? auth.currentUser?.username ?? '系统用户' });
    showFollowUp.value = false;
  }, '随访记录已保存');
}

const referralColumns = [
  { title: '协作单号', key: 'referral_no', width: 170 },
  { title: '老人', key: 'elderly_id', width: 90, render: (r: MedicalReferralRow) => elderlyName(r.elderly_id) },
  { title: '机构', key: 'partner_name', minWidth: 150 }, { title: '预约时间', key: 'appointment_at', width: 150 },
  { title: '原因/科室', key: 'reason', minWidth: 180, render: (r: MedicalReferralRow) => `${r.reason}${r.department ? ` · ${r.department}` : ''}` },
  { title: '陪诊', key: 'escort_user_name', width: 90, render: (r: MedicalReferralRow) => r.escort_user_name || '-' },
  { title: '状态', key: 'status', width: 90, render: (r: MedicalReferralRow) => h(NTag, { type: referralStatus[r.status].type }, () => referralStatus[r.status].label) },
  { title: '操作', key: 'actions', width: 300, render: (r: MedicalReferralRow) => h(NSpace, { size: 6 }, () => [
    h(NButton, { size: 'tiny', onClick: () => openReferralDetail(r) }, () => '详情'),
    r.status === 'pending' && can('referral') ? h(NButton, { size: 'tiny', type: 'primary', onClick: () => run(() => store.referralAction(() => window.api.assistedServices.referral.confirm(r.id)), '机构已确认') }, () => '确认') : null,
    r.status === 'confirmed' && can('referral') ? h(NButton, { size: 'tiny', onClick: () => run(() => store.referralAction(() => window.api.assistedServices.referral.depart(r.id)), '已登记出发') }, () => '出发') : null,
    r.status === 'departed' && can('referral') ? h(NButton, { size: 'tiny', onClick: () => run(() => store.referralAction(() => window.api.assistedServices.referral.consult(r.id)), '开始就诊') }, () => '就诊') : null,
    r.status === 'in_consultation' && can('referral') ? h(NButton, { size: 'tiny', type: 'success', onClick: () => openComplete(r) }, () => '完成') : null,
    ['completed', 'follow_up'].includes(r.status) && can('follow-up') ? h(NButton, { size: 'tiny', type: 'success', onClick: () => openFollowUp(r) }, () => '随访') : null,
    ['pending', 'confirmed'].includes(r.status) && can('referral') ? h(NButton, { size: 'tiny', type: 'error', onClick: () => openAction('cancel_referral', undefined, r) }, () => '取消') : null,
  ]) },
];

const followColumns = [
  { title: '老人', key: 'elderly_id', width: 100, render: (r: MedicalFollowUpRow) => elderlyName(r.elderly_id) },
  { title: '随访时间', key: 'follow_up_at', width: 160 }, { title: '方式', key: 'method', width: 80 },
  { title: '当前情况', key: 'condition', minWidth: 220 }, { title: '用药依从', key: 'medication_compliance', minWidth: 130, render: (r: MedicalFollowUpRow) => r.medication_compliance || '-' },
  { title: '不良反应', key: 'adverse_reaction', minWidth: 130, render: (r: MedicalFollowUpRow) => r.adverse_reaction || '-' },
  { title: '下一步', key: 'next_action', minWidth: 150, render: (r: MedicalFollowUpRow) => r.next_action || '-' },
  { title: '随访人', key: 'staff_name', width: 100 },
];

onMounted(async () => {
  await run(async () => {
    const [elderlyRows, userRows] = await Promise.all([window.api.elderly.list(), window.api.user.list()]);
    elderly.value = elderlyRows; users.value = userRows;
    await store.refreshAll();
  });
});
</script>

<template>
  <BasePage
    title="代办与医养协作"
    description="外卖、药品和生活用品代买，以及诊所医院合作、陪诊转诊和就诊随访闭环"
  >
    <template #actions>
      <NButton
        :loading="store.loading"
        @click="refresh"
      >
        刷新
      </NButton>
    </template>
    <NGrid
      :cols="7"
      :x-gap="12"
      style="margin-bottom: 16px"
    >
      <NGi>
        <NCard size="small">
          <NStatistic
            label="代买总单"
            :value="store.stats.purchase_total"
          />
        </NCard>
      </NGi>
      <NGi>
        <NCard size="small">
          <NStatistic
            label="代买待办"
            :value="store.stats.purchase_pending"
          />
        </NCard>
      </NGi>
      <NGi>
        <NCard size="small">
          <NStatistic
            label="本月代买"
            :value="store.stats.purchase_month_amount_cents / 100"
            prefix="¥"
            :precision="2"
          />
        </NCard>
      </NGi>
      <NGi>
        <NCard size="small">
          <NStatistic
            label="医养协作"
            :value="store.stats.referral_total"
          />
        </NCard>
      </NGi>
      <NGi>
        <NCard size="small">
          <NStatistic
            label="就医待办"
            :value="store.stats.referral_pending"
          />
        </NCard>
      </NGi>
      <NGi>
        <NCard size="small">
          <NStatistic
            label="随访中"
            :value="store.stats.referral_follow_up"
          />
        </NCard>
      </NGi>
      <NGi>
        <NCard size="small">
          <NStatistic
            label="合作机构"
            :value="store.stats.active_partners"
          />
        </NCard>
      </NGi>
    </NGrid>

    <NTabs
      v-model:value="activeTab"
      type="line"
      animated
    >
      <NTabPane
        name="purchase"
        tab="代买订单"
      >
        <NSpace
          justify="end"
          style="margin-bottom: 12px"
        >
          <NButton
            v-if="can('create')"
            type="primary"
            @click="openPurchase"
          >
            登记代买
          </NButton>
        </NSpace>
        <BaseTable
          :columns="purchaseColumns"
          :data="store.purchaseOrders"
          :loading="store.loading"
          :pagination="{ pageSize: 15 }"
        />
      </NTabPane>
      <NTabPane
        name="catalog"
        tab="服务与收费设置"
      >
        <NSpace
          justify="end"
          style="margin-bottom: 12px"
        >
          <NButton
            v-if="can('catalog')"
            type="primary"
            @click="openCatalog()"
          >
            新增服务项目
          </NButton>
        </NSpace>
        <BaseTable
          :columns="catalogColumns"
          :data="store.serviceCatalog"
          :pagination="false"
        />
      </NTabPane>
      <NTabPane
        name="referral"
        tab="就医协作"
      >
        <NSpace
          justify="end"
          style="margin-bottom: 12px"
        >
          <NButton
            v-if="can('referral')"
            type="primary"
            :disabled="!partnerOptions.length"
            @click="openReferral"
          >
            预约/转诊/陪诊
          </NButton>
        </NSpace>
        <BaseTable
          :columns="referralColumns"
          :data="store.referrals"
          :loading="store.loading"
          :pagination="{ pageSize: 15 }"
        />
      </NTabPane>
      <NTabPane
        name="partner"
        tab="合作机构"
      >
        <NSpace
          justify="end"
          style="margin-bottom: 12px"
        >
          <NButton
            v-if="can('partner')"
            type="primary"
            @click="openPartner()"
          >
            新增机构
          </NButton>
        </NSpace>
        <BaseTable
          :columns="partnerColumns"
          :data="store.partners"
          :pagination="{ pageSize: 15 }"
        />
      </NTabPane>
      <NTabPane
        name="follow"
        tab="随访记录"
      >
        <BaseTable
          :columns="followColumns"
          :data="store.followUps"
          :pagination="{ pageSize: 15 }"
        />
      </NTabPane>
    </NTabs>
  </BasePage>

  <NModal
    v-model:show="showPurchase"
    preset="card"
    title="登记代买订单"
    style="width: 900px"
  >
    <NForm
      :model="purchaseForm"
      label-placement="left"
      label-width="90"
    >
      <NGrid
        :cols="2"
        :x-gap="16"
      >
        <NFormItem
          label="老人"
          required
        >
          <NSelect
            v-model:value="purchaseForm.elderly_id"
            filterable
            :options="elderlyOptions"
            @update:value="selectPurchaseElderly"
          />
        </NFormItem>
        <NFormItem
          label="服务项目"
          required
        >
          <NSelect
            v-model:value="purchaseForm.service_catalog_id"
            :options="serviceOptions"
            @update:value="selectService"
          />
        </NFormItem>
        <NFormItem
          label="申请人"
          required
        >
          <NInput v-model:value="purchaseForm.requester_name" />
        </NFormItem>
        <NFormItem label="联系电话">
          <NInput v-model:value="purchaseForm.requester_phone" />
        </NFormItem>
        <NFormItem label="商户/取件点">
          <NInput
            v-model:value="purchaseForm.merchant_name"
            placeholder="餐厅、药店、商超或快递站"
          />
        </NFormItem>
        <NFormItem label="期望送达">
          <NInput
            v-model:value="purchaseForm.expected_at"
            placeholder="YYYY-MM-DD HH:mm"
          />
        </NFormItem>
        <NFormItem
          label="送达地址"
          required
        >
          <NInput v-model:value="purchaseForm.delivery_address" />
        </NFormItem>
        <NFormItem label="垫付金额">
          <NInputNumber
            v-model:value="purchaseForm.advance_amount_yuan"
            :min="0"
            :precision="2"
          />
        </NFormItem>
        <NFormItem label="配送费">
          <NInputNumber
            v-model:value="purchaseForm.delivery_fee_yuan"
            :min="0"
            :precision="2"
          />
        </NFormItem>
        <NFormItem label="收费方式">
          <NSelect
            v-model:value="purchaseForm.charge_mode"
            :options="chargeModeOptions"
            @update:value="selectChargeMode"
          />
        </NFormItem>
        <NFormItem label="服务费">
          <NInputNumber
            v-model:value="purchaseForm.service_fee_yuan"
            :min="0"
            :precision="2"
            :disabled="purchaseForm.charge_mode !== 'custom'"
          />
        </NFormItem>
        <NFormItem
          v-if="purchaseForm.category === 'medicine'"
          label="处方要求"
        >
          <NSelect
            v-model:value="purchaseForm.prescription_required"
            :options="[{ label: '非处方药', value: 0 }, { label: '需要处方', value: 1 }]"
          />
        </NFormItem>
        <NFormItem
          v-if="purchaseForm.category === 'medicine'"
          label="处方编号"
        >
          <NInput
            v-model:value="purchaseForm.prescription_no"
            placeholder="可派单后再核验"
          />
        </NFormItem>
      </NGrid>
      <NCard
        title="代买/代办明细"
        size="small"
      >
        <NSpace
          v-for="(item, index) in purchaseDrafts"
          :key="index"
          align="center"
          style="margin-bottom: 8px"
          :wrap="false"
        >
          <NInput
            v-model:value="item.item_name"
            placeholder="商品或代办事项"
            style="width: 160px"
          />
          <NInput
            v-model:value="item.specification"
            placeholder="规格"
            style="width: 110px"
          />
          <NInputNumber
            v-model:value="item.quantity"
            :min="0.01"
            placeholder="数量"
            style="width: 95px"
          />
          <NInput
            v-model:value="item.unit"
            placeholder="单位"
            style="width: 70px"
          />
          <NInputNumber
            v-model:value="item.unit_price_yuan"
            :min="0"
            :precision="2"
            placeholder="单价"
            style="width: 110px"
          />
          <NSelect
            v-if="purchaseForm.category === 'medicine'"
            v-model:value="item.medicine_type"
            :options="[{ label: '非处方药', value: 'otc' }, { label: '处方药', value: 'prescription' }]"
            placeholder="药品类型"
            style="width: 110px"
          />
          <NInput
            v-if="purchaseForm.category === 'medicine'"
            v-model:value="item.dosage"
            placeholder="用法用量"
            style="width: 130px"
          />
          <NButton
            v-if="purchaseDrafts.length > 1"
            type="error"
            size="small"
            @click="purchaseDrafts.splice(index, 1)"
          >
            删除
          </NButton>
        </NSpace>
        <NButton
          dashed
          @click="purchaseDrafts.push(emptyPurchaseDraft())"
        >
          添加商品
        </NButton>
      </NCard>
      <NFormItem
        label="备注"
        style="margin-top: 12px"
      >
        <NInput
          v-model:value="purchaseForm.remark"
          type="textarea"
        />
      </NFormItem>
      <NSpace justify="space-between">
        <strong>预计合计：{{ purchaseTotal.toFixed(2) }} 元</strong><NSpace>
          <NButton @click="showPurchase = false">
            取消
          </NButton><NButton
            type="primary"
            @click="savePurchase"
          >
            保存
          </NButton>
        </NSpace>
      </NSpace>
    </NForm>
  </NModal>

  <NModal
    v-model:show="showCatalog"
    preset="card"
    title="代办服务与收费设置"
    style="width: 680px"
  >
    <NForm
      :model="catalogForm"
      label-placement="left"
      label-width="100"
    >
      <NGrid
        :cols="2"
        :x-gap="16"
      >
        <NFormItem
          label="服务编码"
          required
        >
          <NInput
            v-model:value="catalogForm.code"
            :disabled="!!editingCatalog"
            placeholder="如 package_pickup"
          />
        </NFormItem>
        <NFormItem
          label="服务名称"
          required
        >
          <NInput
            v-model:value="catalogForm.name"
            placeholder="如 代拿快递"
          />
        </NFormItem>
        <NFormItem label="业务类型">
          <NSelect
            v-model:value="catalogForm.category"
            :options="purchaseCategories"
          />
        </NFormItem>
        <NFormItem label="默认收费">
          <NSelect
            v-model:value="catalogForm.charge_mode"
            :options="chargeModeOptions"
          />
        </NFormItem>
        <NFormItem label="固定服务费">
          <NInputNumber
            v-model:value="catalogForm.default_service_fee_yuan"
            :min="0"
            :precision="2"
            :disabled="catalogForm.charge_mode !== 'fixed'"
          />
        </NFormItem>
        <NFormItem label="排序">
          <NInputNumber
            v-model:value="catalogForm.sort_order"
            :min="0"
          />
        </NFormItem>
        <NFormItem label="状态">
          <NSelect
            v-model:value="catalogForm.status"
            :options="[{ label: '启用', value: 'active' }, { label: '停用', value: 'inactive' }]"
          />
        </NFormItem>
      </NGrid>
      <NFormItem label="服务说明">
        <NInput
          v-model:value="catalogForm.remark"
          type="textarea"
        />
      </NFormItem>
      <NSpace justify="end">
        <NButton @click="showCatalog = false">
          取消
        </NButton>
        <NButton
          type="primary"
          @click="saveCatalog"
        >
          保存设置
        </NButton>
      </NSpace>
    </NForm>
  </NModal>

  <NModal
    v-model:show="showAction"
    preset="card"
    :title="actionTitle"
    style="width: 480px"
  >
    <NForm
      label-placement="left"
      label-width="90"
    >
      <NFormItem
        v-if="actionMode === 'assign'"
        label="负责人"
      >
        <NSelect
          v-model:value="actionValue"
          filterable
          :options="userOptions"
        />
      </NFormItem>
      <NFormItem
        v-else-if="actionMode === 'prescription'"
        label="处方编号"
      >
        <NInput v-model:value="actionValue" />
      </NFormItem>
      <NFormItem
        v-if="actionMode === 'prescription'"
        label="核验人"
      >
        <NInput v-model:value="actionExtra" />
      </NFormItem>
      <NFormItem
        v-else-if="actionMode === 'sign'"
        label="签收人"
      >
        <NInput v-model:value="actionValue" />
      </NFormItem>
      <NFormItem
        v-else-if="actionMode === 'settle'"
        label="结算方式"
      >
        <NSelect
          v-model:value="actionValue"
          :options="[{ label: '计入月度账单', value: 'monthly_bill' }, { label: '现金', value: 'cash' }, { label: '微信', value: 'wechat' }, { label: '支付宝', value: 'alipay' }, { label: '银行转账', value: 'bank' }, { label: '免费/其他（不入账）', value: 'other' }]"
        />
      </NFormItem>
      <NFormItem
        v-else-if="actionMode.startsWith('cancel')"
        label="取消原因"
      >
        <NInput
          v-model:value="actionValue"
          type="textarea"
        />
      </NFormItem>
      <NSpace justify="end">
        <NButton @click="showAction = false">
          取消
        </NButton><NButton
          type="primary"
          @click="saveAction"
        >
          确认
        </NButton>
      </NSpace>
    </NForm>
  </NModal>

  <NModal
    v-model:show="showPurchaseDetail"
    preset="card"
    title="代买订单明细"
    style="width: 720px"
  >
    <NDescriptions
      v-if="currentPurchase"
      bordered
      :column="2"
    >
      <NDescriptionsItem label="订单号">
        {{ currentPurchase.order_no }}
      </NDescriptionsItem><NDescriptionsItem label="老人">
        {{ elderlyName(currentPurchase.elderly_id) }}
      </NDescriptionsItem>
      <NDescriptionsItem label="商品金额">
        {{ yuan(currentPurchase.goods_amount_cents) }}
      </NDescriptionsItem><NDescriptionsItem label="总金额">
        {{ yuan(currentPurchase.total_amount_cents) }}
      </NDescriptionsItem>
      <NDescriptionsItem label="处方核验">
        {{ currentPurchase.prescription_required ? (currentPurchase.prescription_verified_by || '待核验') : '不需要' }}
      </NDescriptionsItem><NDescriptionsItem label="结算">
        {{ currentPurchase.settlement_method || '未结算' }}
      </NDescriptionsItem>
    </NDescriptions>
    <BaseTable
      style="margin-top: 12px"
      :columns="[{ title: '商品', key: 'item_name' }, { title: '规格', key: 'specification' }, { title: '数量', key: 'quantity' }, { title: '单位', key: 'unit' }, { title: '单价', key: 'unit_price_cents', render: (r: ProxyPurchaseItemRow) => yuan(r.unit_price_cents) }, { title: '金额', key: 'amount_cents', render: (r: ProxyPurchaseItemRow) => yuan(r.amount_cents) }, { title: '用法', key: 'dosage' }]"
      :data="store.purchaseItems"
      :pagination="false"
    />
  </NModal>

  <NModal
    v-model:show="showPartner"
    preset="card"
    title="合作机构"
    style="width: 720px"
  >
    <NForm
      :model="partnerForm"
      label-placement="left"
      label-width="90"
    >
      <NGrid
        :cols="2"
        :x-gap="16"
      >
        <NFormItem
          label="机构名称"
          required
        >
          <NInput v-model:value="partnerForm.name" />
        </NFormItem><NFormItem label="机构类型">
          <NSelect
            v-model:value="partnerForm.partner_type"
            :options="[{ label: '诊所', value: 'clinic' }, { label: '医院', value: 'hospital' }, { label: '药房', value: 'pharmacy' }, { label: '康复机构', value: 'rehab' }, { label: '检验机构', value: 'laboratory' }, { label: '其他', value: 'other' }]"
          />
        </NFormItem>
        <NFormItem label="医院等级">
          <NInput v-model:value="partnerForm.hospital_level" />
        </NFormItem><NFormItem label="专科能力">
          <NInput v-model:value="partnerForm.specialties" />
        </NFormItem>
        <NFormItem label="联系人">
          <NInput v-model:value="partnerForm.contact_name" />
        </NFormItem><NFormItem label="联系电话">
          <NInput v-model:value="partnerForm.contact_phone" />
        </NFormItem>
        <NFormItem label="机构地址">
          <NInput v-model:value="partnerForm.address" />
        </NFormItem><NFormItem label="急诊通道">
          <NInput v-model:value="partnerForm.emergency_channel" />
        </NFormItem>
        <NFormItem label="协议编号">
          <NInput v-model:value="partnerForm.agreement_no" />
        </NFormItem><NFormItem label="结算周期">
          <NInput v-model:value="partnerForm.settlement_cycle" />
        </NFormItem>
        <NFormItem label="协议开始">
          <NInput
            v-model:value="partnerForm.agreement_start"
            placeholder="YYYY-MM-DD"
          />
        </NFormItem><NFormItem label="协议结束">
          <NInput
            v-model:value="partnerForm.agreement_end"
            placeholder="YYYY-MM-DD"
          />
        </NFormItem>
        <NFormItem label="状态">
          <NSelect
            v-model:value="partnerForm.status"
            :options="[{ label: '合作中', value: 'active' }, { label: '已停用', value: 'inactive' }]"
          />
        </NFormItem>
      </NGrid><NFormItem label="备注">
        <NInput
          v-model:value="partnerForm.remark"
          type="textarea"
        />
      </NFormItem><NSpace justify="end">
        <NButton @click="showPartner = false">
          取消
        </NButton><NButton
          type="primary"
          @click="savePartner"
        >
          保存
        </NButton>
      </NSpace>
    </NForm>
  </NModal>

  <NModal
    v-model:show="showReferral"
    preset="card"
    title="登记就医协作"
    style="width: 760px"
  >
    <NForm
      :model="referralForm"
      label-placement="left"
      label-width="90"
    >
      <NGrid
        :cols="2"
        :x-gap="16"
      >
        <NFormItem
          label="老人"
          required
        >
          <NSelect
            v-model:value="referralForm.elderly_id"
            filterable
            :options="elderlyOptions"
          />
        </NFormItem><NFormItem
          label="合作机构"
          required
        >
          <NSelect
            v-model:value="referralForm.partner_id"
            filterable
            :options="partnerOptions"
          />
        </NFormItem>
        <NFormItem label="服务类型">
          <NSelect
            v-model:value="referralForm.service_type"
            :options="[{ label: '门诊预约', value: 'consultation' }, { label: '转诊', value: 'referral' }, { label: '陪诊', value: 'escort' }, { label: '检查', value: 'exam' }, { label: '康复', value: 'rehab' }, { label: '送药', value: 'medicine_delivery' }, { label: '急诊', value: 'emergency' }]"
          />
        </NFormItem><NFormItem label="优先级">
          <NSelect
            v-model:value="referralForm.priority"
            :options="[{ label: '普通', value: 'normal' }, { label: '紧急', value: 'urgent' }, { label: '急救', value: 'emergency' }]"
          />
        </NFormItem>
        <NFormItem
          label="预约时间"
          required
        >
          <NInput v-model:value="referralForm.appointment_at" />
        </NFormItem><NFormItem label="科室">
          <NInput v-model:value="referralForm.department" />
        </NFormItem>
        <NFormItem label="医生">
          <NInput v-model:value="referralForm.doctor" />
        </NFormItem><NFormItem label="陪诊需求">
          <NSelect
            v-model:value="referralForm.escort_required"
            :options="[{ label: '不需要', value: 0 }, { label: '需要陪诊', value: 1 }]"
          />
        </NFormItem>
        <NFormItem
          v-if="referralForm.escort_required"
          label="陪诊人员"
        >
          <NSelect
            v-model:value="referralForm.escort_user_id"
            filterable
            :options="userOptions"
          />
        </NFormItem>
      </NGrid><NFormItem
        label="就医原因"
        required
      >
        <NInput v-model:value="referralForm.reason" />
      </NFormItem><NFormItem label="症状">
        <NInput
          v-model:value="referralForm.symptoms"
          type="textarea"
        />
      </NFormItem><NFormItem label="备注">
        <NInput v-model:value="referralForm.remark" />
      </NFormItem><NSpace justify="end">
        <NButton @click="showReferral = false">
          取消
        </NButton><NButton
          type="primary"
          @click="saveReferral"
        >
          保存
        </NButton>
      </NSpace>
    </NForm>
  </NModal>

  <NModal
    v-model:show="showComplete"
    preset="card"
    title="归档诊疗结果"
    style="width: 680px"
  >
    <NForm
      :model="completeForm"
      label-placement="left"
      label-width="100"
    >
      <NFormItem
        label="诊断结果"
        required
      >
        <NInput
          v-model:value="completeForm.diagnosis"
          type="textarea"
        />
      </NFormItem><NFormItem label="治疗方案">
        <NInput
          v-model:value="completeForm.treatment_plan"
          type="textarea"
        />
      </NFormItem><NFormItem label="处方/用药">
        <NInput
          v-model:value="completeForm.prescription"
          type="textarea"
        />
      </NFormItem><NFormItem label="复诊时间">
        <NInput v-model:value="completeForm.next_visit_at" />
      </NFormItem><NGrid
        :cols="2"
        :x-gap="16"
      >
        <NFormItem label="医疗费">
          <NInputNumber
            v-model:value="completeForm.medical_fee_yuan"
            :min="0"
            :precision="2"
          />
        </NFormItem><NFormItem label="交通费">
          <NInputNumber
            v-model:value="completeForm.transport_fee_yuan"
            :min="0"
            :precision="2"
          />
        </NFormItem><NFormItem label="服务费">
          <NInputNumber
            v-model:value="completeForm.service_fee_yuan"
            :min="0"
            :precision="2"
          />
        </NFormItem><NFormItem label="结算">
          <NSelect
            v-model:value="completeForm.settlement_method"
            :options="[{ label: '计入月度账单', value: 'monthly_bill' }, { label: '已现场支付', value: 'paid' }]"
          />
        </NFormItem>
      </NGrid><NSpace justify="end">
        <NButton @click="showComplete = false">
          取消
        </NButton><NButton
          type="primary"
          @click="saveComplete"
        >
          完成归档
        </NButton>
      </NSpace>
    </NForm>
  </NModal>

  <NModal
    v-model:show="showReferralDetail"
    preset="card"
    title="就医协作详情"
    style="width: 760px"
  >
    <NDescriptions
      v-if="currentReferral"
      bordered
      :column="2"
    >
      <NDescriptionsItem label="协作单号">
        {{ currentReferral.referral_no }}
      </NDescriptionsItem>
      <NDescriptionsItem label="老人">
        {{ elderlyName(currentReferral.elderly_id) }}
      </NDescriptionsItem>
      <NDescriptionsItem label="合作机构">
        {{ currentReferral.partner_name }}
      </NDescriptionsItem>
      <NDescriptionsItem label="预约时间">
        {{ currentReferral.appointment_at }}
      </NDescriptionsItem>
      <NDescriptionsItem label="科室/医生">
        {{ currentReferral.department || '-' }} / {{ currentReferral.doctor || '-' }}
      </NDescriptionsItem>
      <NDescriptionsItem label="陪诊人员">
        {{ currentReferral.escort_user_name || '-' }}
      </NDescriptionsItem>
      <NDescriptionsItem
        label="就医原因"
        :span="2"
      >
        {{ currentReferral.reason }}
      </NDescriptionsItem>
      <NDescriptionsItem
        label="诊断结果"
        :span="2"
      >
        {{ currentReferral.diagnosis || '尚未归档' }}
      </NDescriptionsItem>
      <NDescriptionsItem
        label="治疗方案"
        :span="2"
      >
        {{ currentReferral.treatment_plan || '-' }}
      </NDescriptionsItem>
      <NDescriptionsItem
        label="处方/用药"
        :span="2"
      >
        {{ currentReferral.prescription || '-' }}
      </NDescriptionsItem>
      <NDescriptionsItem label="下次复诊">
        {{ currentReferral.next_visit_at || '-' }}
      </NDescriptionsItem>
      <NDescriptionsItem label="费用/结算">
        {{ yuan(currentReferral.total_amount_cents) }} / {{ currentReferral.settlement_status }}
      </NDescriptionsItem>
    </NDescriptions>
    <NCard
      title="随访记录"
      size="small"
      style="margin-top: 12px"
    >
      <BaseTable
        :columns="followColumns"
        :data="referralFollowUps"
        :pagination="false"
      />
    </NCard>
  </NModal>

  <NModal
    v-model:show="showFollowUp"
    preset="card"
    title="就诊随访"
    style="width: 650px"
  >
    <NForm
      :model="followForm"
      label-placement="left"
      label-width="100"
    >
      <NGrid
        :cols="2"
        :x-gap="16"
      >
        <NFormItem label="随访时间">
          <NInput v-model:value="followForm.follow_up_at" />
        </NFormItem><NFormItem label="方式">
          <NSelect
            v-model:value="followForm.method"
            :options="[{ label: '电话', value: 'phone' }, { label: '上门', value: 'visit' }, { label: '线上', value: 'online' }]"
          />
        </NFormItem>
      </NGrid><NFormItem
        label="当前情况"
        required
      >
        <NInput
          v-model:value="followForm.condition"
          type="textarea"
        />
      </NFormItem><NFormItem label="用药依从性">
        <NInput v-model:value="followForm.medication_compliance" />
      </NFormItem><NFormItem label="不良反应">
        <NInput v-model:value="followForm.adverse_reaction" />
      </NFormItem><NFormItem label="下一步安排">
        <NInput v-model:value="followForm.next_action" />
      </NFormItem><NFormItem label="下次随访">
        <NInput v-model:value="followForm.next_follow_up_at" />
      </NFormItem><NSpace justify="end">
        <NButton @click="showFollowUp = false">
          取消
        </NButton><NButton
          type="primary"
          @click="saveFollowUp"
        >
          保存
        </NButton>
      </NSpace>
    </NForm>
  </NModal>
</template>
