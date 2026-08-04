// apps/desktop/src/renderer/src/stores/fee.store.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { FeeItemRow, DepositRecordRow, MonthlyBillRow, BillDetailRow, PaymentRecordRow } from '@yanglao/db'

export const useFeeStore = defineStore('fee', () => {
  const feeItems = ref<FeeItemRow[]>([])
  const deposits = ref<DepositRecordRow[]>([])
  const bills = ref<MonthlyBillRow[]>([])
  const billDetails = ref<BillDetailRow[]>([])
  const payments = ref<PaymentRecordRow[]>([])
  const loading = ref(false)

  async function fetchFeeItems() {
    feeItems.value = await window.api.fee.item.list()
  }

  async function createFeeItem(data: unknown) {
    const row = await window.api.fee.item.create(data)
    feeItems.value.push(row)
    return row
  }

  async function updateFeeItem(id: string, data: unknown) {
    await window.api.fee.item.update(id, data)
    const idx = feeItems.value.findIndex(f => f.id === id)
    if (idx !== -1) feeItems.value[idx] = { ...feeItems.value[idx], ...(data as object) }
  }

  async function deleteFeeItem(id: string) {
    await window.api.fee.item.delete(id)
    feeItems.value = feeItems.value.filter(f => f.id !== id)
  }

  async function fetchDeposits(elderlyId: string) {
    deposits.value = await window.api.fee.deposit.list(elderlyId)
  }

  async function createDeposit(data: unknown) {
    const row = await window.api.fee.deposit.create(data)
    deposits.value.unshift(row)
    return row
  }

  async function fetchBills(elderlyId?: string) {
    loading.value = true
    try { bills.value = await window.api.fee.bill.list(elderlyId) }
    finally { loading.value = false }
  }

  async function createBill(data: unknown) {
    const row = await window.api.fee.bill.create(data)
    bills.value.unshift(row)
    return row
  }

  async function createBillWithDetails(data: unknown, details: unknown[]) {
    const row = await window.api.fee.bill.createWithDetails(data, details)
    bills.value.unshift(row)
    return row
  }

  async function getBill(elderlyId: string, billMonth: string) {
    return window.api.fee.bill.get(elderlyId, billMonth)
  }

  async function getStats(month: string) {
    return window.api.fee.stats(month)
  }

  async function fetchBillDetails(billId: string) {
    billDetails.value = await window.api.fee.bill.detailList(billId)
  }

  async function createBillDetail(data: unknown) {
    const row = await window.api.fee.bill.detailCreate(data)
    billDetails.value.push(row)
    return row
  }

  async function fetchPayments(elderlyId?: string, billId?: string) {
    payments.value = await window.api.fee.payment.list(elderlyId, billId)
  }

  function clearElderlyScopedData() {
    deposits.value = []
    billDetails.value = []
  }

  async function createPayment(data: unknown) {
    const row = await window.api.fee.payment.create(data)
    payments.value.unshift(row)
    return row
  }

  return {
    feeItems, deposits, bills, billDetails, payments, loading,
    fetchFeeItems, createFeeItem, updateFeeItem, deleteFeeItem,
    fetchDeposits, createDeposit,
    fetchBills, createBill, createBillWithDetails, getBill, getStats, fetchBillDetails, createBillDetail,
    fetchPayments, clearElderlyScopedData, createPayment,
  }
})
