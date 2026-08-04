import { S as defineStore, r as ref } from "./vendor-vue-Hc3ejqjp.js";
const useHealthStore = defineStore("health", () => {
  const profile = ref(null);
  const vitals = ref([]);
  const medOrders = ref([]);
  const medRecords = ref([]);
  const visits = ref([]);
  const examAppointments = ref([]);
  const examResults = ref([]);
  const loading = ref(false);
  async function fetchAll(elderlyId) {
    loading.value = true;
    try {
      const [p, v, o, r, vis, appts, results] = await Promise.all([
        window.api.health.profile.get(elderlyId),
        window.api.health.vital.list(elderlyId),
        window.api.health.medOrder.list(elderlyId),
        window.api.health.medRecord.list(elderlyId),
        window.api.health.visit.list(elderlyId),
        window.api.health.examAppointment.list(elderlyId),
        window.api.health.examResult.list(elderlyId)
      ]);
      profile.value = p;
      vitals.value = v;
      medOrders.value = o;
      medRecords.value = r;
      visits.value = vis;
      examAppointments.value = appts;
      examResults.value = results;
    } finally {
      loading.value = false;
    }
  }
  async function saveProfile(elderlyId, data) {
    profile.value = await window.api.health.profile.save(elderlyId, data);
  }
  async function createVital(data) {
    const row = await window.api.health.vital.create(data);
    vitals.value.unshift(row);
    return row;
  }
  async function deleteVital(id) {
    await window.api.health.vital.delete(id);
    vitals.value = vitals.value.filter((v) => v.id !== id);
  }
  async function createMedOrder(data) {
    const row = await window.api.health.medOrder.create(data);
    medOrders.value.unshift(row);
    return row;
  }
  async function stopMedOrder(id) {
    await window.api.health.medOrder.update(id, { status: "stopped" });
    const idx = medOrders.value.findIndex((o) => o.id === id);
    if (idx !== -1) medOrders.value[idx] = { ...medOrders.value[idx], status: "stopped" };
  }
  async function createMedRecord(data) {
    const row = await window.api.health.medRecord.create(data);
    medRecords.value.unshift(row);
    return row;
  }
  async function createVisit(data) {
    const row = await window.api.health.visit.create(data);
    visits.value.unshift(row);
    return row;
  }
  async function deleteVisit(id) {
    await window.api.health.visit.delete(id);
    visits.value = visits.value.filter((v) => v.id !== id);
  }
  async function fetchExamAppointments(elderlyId) {
    examAppointments.value = await window.api.health.examAppointment.list(elderlyId);
  }
  async function fetchExamResults(elderlyId) {
    examResults.value = await window.api.health.examResult.list(elderlyId);
  }
  async function createExamAppointment(data) {
    const row = await window.api.health.examAppointment.create(data);
    examAppointments.value.unshift(row);
    return row;
  }
  async function updateExamAppointment(id, data) {
    await window.api.health.examAppointment.update(id, data);
    const idx = examAppointments.value.findIndex((a) => a.id === id);
    if (idx !== -1) examAppointments.value[idx] = { ...examAppointments.value[idx], ...data };
  }
  async function cancelExamAppointment(id) {
    await updateExamAppointment(id, { status: "cancelled" });
  }
  async function deleteExamAppointment(id) {
    await window.api.health.examAppointment.delete(id);
    examAppointments.value = examAppointments.value.filter((a) => a.id !== id);
  }
  async function createExamResult(data) {
    const row = await window.api.health.examResult.create(data);
    examResults.value.unshift(row);
    const apptId = data.appointment_id;
    if (apptId) {
      const idx = examAppointments.value.findIndex((a) => a.id === apptId);
      if (idx !== -1) examAppointments.value[idx] = { ...examAppointments.value[idx], status: "completed" };
    }
    return row;
  }
  async function updateExamResult(id, data) {
    await window.api.health.examResult.update(id, data);
    const idx = examResults.value.findIndex((result) => result.id === id);
    if (idx !== -1) examResults.value[idx] = { ...examResults.value[idx], ...data };
  }
  async function deleteExamResult(id) {
    await window.api.health.examResult.delete(id);
    examResults.value = examResults.value.filter((r) => r.id !== id);
  }
  return {
    profile,
    vitals,
    medOrders,
    medRecords,
    visits,
    examAppointments,
    examResults,
    loading,
    fetchAll,
    saveProfile,
    createVital,
    deleteVital,
    createMedOrder,
    stopMedOrder,
    createMedRecord,
    createVisit,
    deleteVisit,
    fetchExamAppointments,
    fetchExamResults,
    createExamAppointment,
    updateExamAppointment,
    cancelExamAppointment,
    deleteExamAppointment,
    createExamResult,
    updateExamResult,
    deleteExamResult
  };
});
export {
  useHealthStore as u
};
