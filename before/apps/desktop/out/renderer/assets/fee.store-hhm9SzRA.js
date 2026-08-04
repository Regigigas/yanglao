import { S as defineStore, r as ref } from "./vendor-vue-Hc3ejqjp.js";
const useFeeStore = defineStore("fee", () => {
  const feeItems = ref([]);
  const deposits = ref([]);
  const bills = ref([]);
  const billDetails = ref([]);
  const payments = ref([]);
  const loading = ref(false);
  async function fetchFeeItems() {
    feeItems.value = await window.api.fee.item.list();
  }
  async function createFeeItem(data) {
    const row = await window.api.fee.item.create(data);
    feeItems.value.push(row);
    return row;
  }
  async function updateFeeItem(id, data) {
    await window.api.fee.item.update(id, data);
    const idx = feeItems.value.findIndex((f) => f.id === id);
    if (idx !== -1) feeItems.value[idx] = { ...feeItems.value[idx], ...data };
  }
  async function deleteFeeItem(id) {
    await window.api.fee.item.delete(id);
    feeItems.value = feeItems.value.filter((f) => f.id !== id);
  }
  async function fetchDeposits(elderlyId) {
    deposits.value = await window.api.fee.deposit.list(elderlyId);
  }
  async function createDeposit(data) {
    const row = await window.api.fee.deposit.create(data);
    deposits.value.unshift(row);
    return row;
  }
  async function fetchBills(elderlyId) {
    loading.value = true;
    try {
      bills.value = await window.api.fee.bill.list(elderlyId);
    } finally {
      loading.value = false;
    }
  }
  async function createBill(data) {
    const row = await window.api.fee.bill.create(data);
    bills.value.unshift(row);
    return row;
  }
  async function createBillWithDetails(data, details) {
    const row = await window.api.fee.bill.createWithDetails(data, details);
    bills.value.unshift(row);
    return row;
  }
  async function getBill(elderlyId, billMonth) {
    return window.api.fee.bill.get(elderlyId, billMonth);
  }
  async function getStats(month) {
    return window.api.fee.stats(month);
  }
  async function fetchBillDetails(billId) {
    billDetails.value = await window.api.fee.bill.detailList(billId);
  }
  async function createBillDetail(data) {
    const row = await window.api.fee.bill.detailCreate(data);
    billDetails.value.push(row);
    return row;
  }
  async function fetchPayments(elderlyId, billId) {
    payments.value = await window.api.fee.payment.list(elderlyId, billId);
  }
  function clearElderlyScopedData() {
    deposits.value = [];
    billDetails.value = [];
  }
  async function createPayment(data) {
    const row = await window.api.fee.payment.create(data);
    payments.value.unshift(row);
    return row;
  }
  return {
    feeItems,
    deposits,
    bills,
    billDetails,
    payments,
    loading,
    fetchFeeItems,
    createFeeItem,
    updateFeeItem,
    deleteFeeItem,
    fetchDeposits,
    createDeposit,
    fetchBills,
    createBill,
    createBillWithDetails,
    getBill,
    getStats,
    fetchBillDetails,
    createBillDetail,
    fetchPayments,
    clearElderlyScopedData,
    createPayment
  };
});
export {
  useFeeStore as u
};
