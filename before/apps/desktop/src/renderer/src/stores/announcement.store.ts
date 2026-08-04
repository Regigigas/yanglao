// apps/desktop/src/renderer/src/stores/announcement.store.ts

import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { AnnouncementForUserRow, AnnouncementRow } from '@yanglao/db';

export const useAnnouncementStore = defineStore('announcement', () => {
  const list = ref<AnnouncementRow[]>([]);
  const visible = ref<AnnouncementForUserRow[]>([]);
  const loading = ref(false);

  async function fetchAll() {
    loading.value = true;
    try {
      list.value = await window.api.announcement.list();
    } finally {
      loading.value = false;
    }
  }

  async function fetchVisible(userId: string) {
    visible.value = await window.api.announcement.visible(userId);
  }

  async function markRead(announcementId: string, userId: string) {
    await window.api.announcement.read(announcementId, userId);
    const item = visible.value.find(
      (announcement) => announcement.id === announcementId,
    );
    if (item) {
      item.is_read = 1;
      item.read_at = item.read_at ?? Date.now();
    }
  }

  return { list, visible, loading, fetchAll, fetchVisible, markRead };
});
