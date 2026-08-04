<script setup lang="ts">
  import { NButton, NModal, NTag } from 'naive-ui';
  import { computed, onMounted, onUnmounted, ref } from 'vue';
  import { formatDateTime } from '@yanglao/core';
  import type { AnnouncementForUserRow } from '@yanglao/db';
  import { useAnnouncementStore } from '../stores/announcement.store';
  import { useAuthStore } from '../stores/auth.store';

  const announcementStore = useAnnouncementStore();
  const authStore = useAuthStore();
  const activeAnnouncement = ref<AnnouncementForUserRow | null>(null);
  let refreshTimer: ReturnType<typeof setInterval> | null = null;

  const tickerItems = computed(() => announcementStore.visible);

  async function refreshVisible() {
    const userId = authStore.currentUser?.id;
    if (userId) await announcementStore.fetchVisible(userId);
  }

  async function openAnnouncement(announcement: AnnouncementForUserRow) {
    activeAnnouncement.value = announcement;
    const userId = authStore.currentUser?.id;
    if (userId && announcement.is_read === 0) {
      await announcementStore.markRead(announcement.id, userId);
    }
  }

  function levelLabel(level: AnnouncementForUserRow['level']) {
    return { normal: '公告', important: '重要', urgent: '紧急' }[level];
  }

  function levelType(level: AnnouncementForUserRow['level']) {
    return { normal: 'default', important: 'warning', urgent: 'error' }[
      level
    ] as 'default' | 'warning' | 'error';
  }

  onMounted(async () => {
    await refreshVisible();
    refreshTimer = setInterval(refreshVisible, 60_000);
  });

  onUnmounted(() => {
    if (refreshTimer) clearInterval(refreshTimer);
  });
</script>

<template>
  <div
    v-if="tickerItems.length"
    class="announcement-ticker"
    aria-label="系统公告"
  >
    <i class="i-ion:megaphone-outline ticker-icon" />
    <div class="ticker-viewport">
      <div
        class="ticker-track"
        :class="{ 'ticker-track-static': tickerItems.length === 1 }"
      >
        <div
          v-for="copy in tickerItems.length > 1 ? 2 : 1"
          :key="copy"
          class="ticker-set"
        >
          <button
            v-for="announcement in tickerItems"
            :key="`${copy}-${announcement.id}`"
            type="button"
            class="ticker-item"
            @click="openAnnouncement(announcement)"
          >
            <span v-if="announcement.is_pinned" class="ticker-pin">置顶</span>
            <span class="ticker-title">{{ announcement.title }}</span>
            <span class="ticker-content">{{ announcement.content }}</span>
            <span v-if="announcement.is_read === 0" class="ticker-unread"
              >未读</span
            >
          </button>
        </div>
      </div>
    </div>
  </div>

  <NModal
    :show="!!activeAnnouncement"
    preset="card"
    style="width: 620px"
    :title="activeAnnouncement?.title"
    @update:show="
      (show) => {
        if (!show) activeAnnouncement = null;
      }
    "
  >
    <template #header-extra>
      <NTag
        v-if="activeAnnouncement"
        :type="levelType(activeAnnouncement.level)"
        size="small"
      >
        {{ levelLabel(activeAnnouncement.level) }}
      </NTag>
    </template>
    <div v-if="activeAnnouncement" class="announcement-detail-content">
      {{ activeAnnouncement.content }}
    </div>
    <div v-if="activeAnnouncement" class="mt-5 text-xs text-gray-400">
      发布时间：{{ formatDateTime(activeAnnouncement.publish_at) }}
      <span v-if="activeAnnouncement.expire_at"
        >　有效至：{{ formatDateTime(activeAnnouncement.expire_at) }}</span
      >
    </div>
    <template #footer>
      <NButton type="primary" @click="activeAnnouncement = null">已阅</NButton>
    </template>
  </NModal>
</template>

<style scoped>
  .announcement-ticker {
    display: flex;
    align-items: center;
    min-width: 0;
    height: 30px;
    color: #7a4c00;
    border: 1px solid #f0d8a8;
    border-radius: 4px;
    background: #fff8e8;
  }

  .ticker-icon {
    flex: 0 0 auto;
    margin: 0 8px;
    font-size: 16px;
    color: #d98200;
  }
  .ticker-viewport {
    min-width: 0;
    flex: 1;
    overflow: hidden;
  }
  .ticker-track {
    display: flex;
    width: max-content;
    animation: announcement-scroll 30s linear infinite;
  }
  .ticker-track:hover {
    animation-play-state: paused;
  }
  .ticker-track-static {
    animation: none;
  }
  .ticker-set {
    display: flex;
    flex: 0 0 auto;
  }
  .ticker-item {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    max-width: 620px;
    min-width: 280px;
    height: 28px;
    padding: 0 18px 0 0;
    overflow: hidden;
    color: inherit;
    white-space: nowrap;
    text-align: left;
    cursor: pointer;
    background: transparent;
    border: 0;
  }
  .ticker-pin,
  .ticker-unread {
    flex: 0 0 auto;
    padding: 1px 4px;
    font-size: 11px;
    line-height: 16px;
    border-radius: 2px;
  }
  .ticker-pin {
    color: #a85b00;
    background: #ffe5b5;
  }
  .ticker-unread {
    color: #c33;
    background: #ffe1e1;
  }
  .ticker-title {
    flex: 0 0 auto;
    font-size: 13px;
    font-weight: 600;
  }
  .ticker-content {
    overflow: hidden;
    color: #966c32;
    font-size: 12px;
    text-overflow: ellipsis;
  }
  .announcement-detail-content {
    white-space: pre-wrap;
    line-height: 1.8;
    word-break: break-word;
  }

  @keyframes announcement-scroll {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-50%);
    }
  }
</style>
