import { S as defineStore, r as ref } from "./vendor-vue-C6_copC_.js";
const useAttendanceStore = defineStore("attendance", () => {
  const shifts = ref([]);
  const schedules = ref([]);
  const todayRecords = ref([]);
  const rangeRecords = ref([]);
  const leaves = ref([]);
  const workRule = ref(null);
  const loading = ref(false);
  async function fetchShifts() {
    shifts.value = await window.api.shift.list();
  }
  async function createShift(data) {
    const row = await window.api.shift.create(data);
    shifts.value.push(row);
    return row;
  }
  async function updateShift(id, data) {
    await window.api.shift.update(id, data);
    const idx = shifts.value.findIndex((s) => s.id === id);
    if (idx !== -1) Object.assign(shifts.value[idx], data);
    return { ok: true };
  }
  async function deleteShift(id) {
    await window.api.shift.delete(id);
    shifts.value = shifts.value.filter((s) => s.id !== id);
  }
  async function setDefaultShift(id) {
    await window.api.shift.setDefault(id);
    shifts.value = shifts.value.map((s) => ({ ...s, is_default: s.id === id ? 1 : 0 }));
  }
  async function fetchWorkRule(userId, workDate) {
    workRule.value = await window.api.shift.workRule(userId, workDate);
  }
  async function fetchSchedules(startDate, endDate, userId) {
    schedules.value = await window.api.schedule.list(startDate, endDate, userId);
  }
  async function createSchedule(data) {
    const res = await window.api.schedule.create(data);
    if (res.ok) schedules.value.push(res.row);
    return res;
  }
  async function updateSchedule(id, data) {
    const res = await window.api.schedule.update(id, data);
    if (res.ok) {
      const idx = schedules.value.findIndex((s) => s.id === id);
      if (idx !== -1) Object.assign(schedules.value[idx], data);
    }
    return res;
  }
  async function removeSchedule(id) {
    await window.api.schedule.delete(id);
    schedules.value = schedules.value.filter((s) => s.id !== id);
  }
  async function fetchToday(userId, date) {
    todayRecords.value = await window.api.attendance.today(userId, date);
  }
  async function fetchRange(startDate, endDate, userId) {
    loading.value = true;
    try {
      rangeRecords.value = await window.api.attendance.range(startDate, endDate, userId);
    } finally {
      loading.value = false;
    }
  }
  async function clock(data) {
    const res = await window.api.attendance.clock(data);
    if (res.ok) todayRecords.value.push(res.row);
    return res;
  }
  async function fetchLeaves(userId, status) {
    leaves.value = await window.api.leaveApply.list(userId, status);
  }
  async function createLeave(data) {
    const row = await window.api.leaveApply.create(data);
    leaves.value.unshift(row);
    return row;
  }
  async function approveLeave(id, approved, remark) {
    await window.api.leaveApply.approve(id, approved, remark);
    const idx = leaves.value.findIndex((l) => l.id === id);
    if (idx !== -1) leaves.value[idx] = { ...leaves.value[idx], status: approved ? "approved" : "rejected" };
  }
  return {
    shifts,
    schedules,
    todayRecords,
    rangeRecords,
    leaves,
    workRule,
    loading,
    fetchShifts,
    createShift,
    updateShift,
    deleteShift,
    setDefaultShift,
    fetchWorkRule,
    fetchSchedules,
    createSchedule,
    updateSchedule,
    removeSchedule,
    fetchToday,
    fetchRange,
    clock,
    fetchLeaves,
    createLeave,
    approveLeave
  };
});
export {
  useAttendanceStore as u
};
