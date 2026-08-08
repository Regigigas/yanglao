import { defineStore } from 'pinia';
import { ref } from 'vue';
import type {
  CareHandoverRow,
  CareIncidentRow,
  ElderlyDocumentRow,
  FamilyCommunicationRow,
  HealthAlertRow,
  InventoryItemRow,
  InventoryTransactionRow,
  OperationsRiskRow,
  VisitorRecordRow,
} from '@yanglao/db';

export const useOperationsStore = defineStore('operations', () => {
  const handovers = ref<CareHandoverRow[]>([]);
  const incidents = ref<CareIncidentRow[]>([]);
  const visitors = ref<VisitorRecordRow[]>([]);
  const communications = ref<FamilyCommunicationRow[]>([]);
  const inventory = ref<InventoryItemRow[]>([]);
  const documents = ref<ElderlyDocumentRow[]>([]);
  const healthAlerts = ref<HealthAlertRow[]>([]);
  const transactions = ref<InventoryTransactionRow[]>([]);
  const risks = ref<OperationsRiskRow[]>([]);
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
        window.api.operations.healthAlert.list(true),
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

  async function fetchTransactions(itemId: string) {
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
    fetchTransactions,
  };
});
