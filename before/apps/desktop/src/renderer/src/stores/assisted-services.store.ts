import { defineStore } from 'pinia';
import { ref } from 'vue';
import type {
  AssistedServiceCatalogRow, AssistedServiceStats, MedicalFollowUpRow, MedicalPartnerRow, MedicalReferralQuery,
  MedicalReferralRow, NewMedicalReferral, NewProxyPurchaseItem, NewProxyPurchaseOrder,
  ProxyPurchaseItemRow, ProxyPurchaseOrderRow, ProxyPurchaseQuery, ReferralCompletionInput,
} from '@yanglao/db';

const emptyStats = (): AssistedServiceStats => ({
  purchase_total: 0, purchase_pending: 0, purchase_month_amount_cents: 0,
  referral_total: 0, referral_pending: 0, referral_follow_up: 0, active_partners: 0,
});

export const useAssistedServicesStore = defineStore('assisted-services', () => {
  const serviceCatalog = ref<AssistedServiceCatalogRow[]>([]);
  const purchaseOrders = ref<ProxyPurchaseOrderRow[]>([]);
  const purchaseItems = ref<ProxyPurchaseItemRow[]>([]);
  const partners = ref<MedicalPartnerRow[]>([]);
  const referrals = ref<MedicalReferralRow[]>([]);
  const followUps = ref<MedicalFollowUpRow[]>([]);
  const stats = ref<AssistedServiceStats>(emptyStats());
  const loading = ref(false);

  async function fetchServiceCatalog(activeOnly = false) { serviceCatalog.value = await window.api.assistedServices.catalog.list(activeOnly); }
  async function createServiceCatalog(data: Omit<AssistedServiceCatalogRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) {
    const row = await window.api.assistedServices.catalog.create(data);
    await fetchServiceCatalog();
    return row as AssistedServiceCatalogRow;
  }
  async function updateServiceCatalog(id: string, data: Partial<AssistedServiceCatalogRow>) {
    const row = await window.api.assistedServices.catalog.update(id, data);
    await fetchServiceCatalog();
    return row as AssistedServiceCatalogRow;
  }

  async function fetchPurchases(query: ProxyPurchaseQuery = {}) {
    purchaseOrders.value = await window.api.assistedServices.purchase.list(query);
  }
  async function createPurchase(order: NewProxyPurchaseOrder, items: NewProxyPurchaseItem[]) {
    const row = await window.api.assistedServices.purchase.create(order, items);
    await Promise.all([fetchPurchases(), fetchStats()]);
    return row as ProxyPurchaseOrderRow;
  }
  async function fetchPurchaseItems(id: string) { purchaseItems.value = await window.api.assistedServices.purchase.items(id); }
  async function purchaseAction(action: () => Promise<unknown>) { await action(); await Promise.all([fetchPurchases(), fetchStats()]); }

  async function fetchPartners(activeOnly = false) { partners.value = await window.api.assistedServices.partner.list(activeOnly); }
  async function createPartner(data: Omit<MedicalPartnerRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) {
    const row = await window.api.assistedServices.partner.create(data);
    await Promise.all([fetchPartners(), fetchStats()]);
    return row as MedicalPartnerRow;
  }
  async function updatePartner(id: string, data: Partial<MedicalPartnerRow>) {
    const row = await window.api.assistedServices.partner.update(id, data);
    await Promise.all([fetchPartners(), fetchStats()]);
    return row as MedicalPartnerRow;
  }

  async function fetchReferrals(query: MedicalReferralQuery = {}) { referrals.value = await window.api.assistedServices.referral.list(query); }
  async function createReferral(data: NewMedicalReferral) {
    const row = await window.api.assistedServices.referral.create(data);
    await Promise.all([fetchReferrals(), fetchStats()]);
    return row as MedicalReferralRow;
  }
  async function referralAction(action: () => Promise<unknown>) { await action(); await Promise.all([fetchReferrals(), fetchStats()]); }
  async function completeReferral(id: string, data: ReferralCompletionInput) {
    await referralAction(() => window.api.assistedServices.referral.complete(id, data));
  }
  async function fetchFollowUps(referralId?: string) { followUps.value = await window.api.assistedServices.followUp.list(referralId); }
  async function createFollowUp(data: Omit<MedicalFollowUpRow, 'id' | 'elderly_id' | 'created_at' | 'updated_at'>) {
    const row = await window.api.assistedServices.followUp.create(data);
    await Promise.all([fetchFollowUps(), fetchReferrals(), fetchStats()]);
    return row as MedicalFollowUpRow;
  }
  async function fetchStats() { stats.value = await window.api.assistedServices.stats(); }
  async function refreshAll() {
    loading.value = true;
    try { await Promise.all([fetchServiceCatalog(), fetchPurchases(), fetchPartners(), fetchReferrals(), fetchFollowUps(), fetchStats()]); }
    finally { loading.value = false; }
  }

  return {
    serviceCatalog, purchaseOrders, purchaseItems, partners, referrals, followUps, stats, loading,
    fetchServiceCatalog, createServiceCatalog, updateServiceCatalog,
    fetchPurchases, createPurchase, fetchPurchaseItems, purchaseAction,
    fetchPartners, createPartner, updatePartner, fetchReferrals, createReferral,
    referralAction, completeReferral, fetchFollowUps, createFollowUp, fetchStats, refreshAll,
  };
});
