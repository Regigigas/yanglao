import { S as defineStore, r as ref } from "./vendor-vue-Hc3ejqjp.js";
const useNotificationStore = defineStore("notification", () => {
  const list = ref([]);
  const unreadCount = ref(0);
  async function fetchAll(unreadOnly = false) {
    list.value = await window.api.notify.list(unreadOnly);
  }
  async function fetchUnreadCount() {
    unreadCount.value = await window.api.notify.unreadCount();
  }
  async function markRead(id) {
    await window.api.notify.read(id);
    const item = list.value.find((n) => n.id === id);
    if (item?.is_read === 0) {
      item.is_read = 1;
      item.read_at = Date.now();
      if (unreadCount.value > 0) unreadCount.value--;
    }
  }
  async function markUnread(id) {
    await window.api.notify.unread(id);
    const item = list.value.find((n) => n.id === id);
    if (item?.is_read === 1) {
      item.is_read = 0;
      item.read_at = null;
      unreadCount.value++;
    }
  }
  async function markAllRead() {
    await window.api.notify.readAll();
    list.value.forEach((n) => {
      n.is_read = 1;
      n.read_at = Date.now();
    });
    unreadCount.value = 0;
  }
  async function remove(id) {
    const item = list.value.find((n) => n.id === id);
    await window.api.notify.delete(id);
    list.value = list.value.filter((n) => n.id !== id);
    if (item?.is_read === 0 && unreadCount.value > 0) unreadCount.value--;
  }
  return { list, unreadCount, fetchAll, fetchUnreadCount, markRead, markUnread, markAllRead, remove };
});
export {
  useNotificationStore as u
};
