import { S as defineStore, r as ref } from "./vendor-vue-Hc3ejqjp.js";
const useAnnouncementStore = defineStore("announcement", () => {
  const list = ref([]);
  const visible = ref([]);
  const loading = ref(false);
  async function fetchAll() {
    loading.value = true;
    try {
      list.value = await window.api.announcement.list();
    } finally {
      loading.value = false;
    }
  }
  async function fetchVisible(userId) {
    visible.value = await window.api.announcement.visible(userId);
  }
  async function markRead(announcementId, userId) {
    await window.api.announcement.read(announcementId, userId);
    const item = visible.value.find(
      (announcement) => announcement.id === announcementId
    );
    if (item) {
      item.is_read = 1;
      item.read_at = item.read_at ?? Date.now();
    }
  }
  return { list, visible, loading, fetchAll, fetchVisible, markRead };
});
export {
  useAnnouncementStore as u
};
