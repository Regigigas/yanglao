<script setup lang="ts">
  /**
   * DefaultLayout - 主布局：左侧导航 + 顶部工具栏 + 内容区
   * 侧边栏菜单根据当前登录用户角色的权限动态过滤渲染
   */
  import {
    NLayout,
    NLayoutSider,
    NLayoutHeader,
    NLayoutContent,
    NMenu,
    NSpace,
    NText,
    NBadge,
    NTooltip,
    NPopover,
    NDropdown,
    NAvatar,
    NModal,
    NForm,
    NFormItem,
    NInput,
    NButton,
    NSelect,
    NTimePicker,
    NDatePicker,
    NList,
    NListItem,
    NThing,
    NTag,
    NEmpty,
    NSpin,
    useMessage,
    useDialog,
  } from 'naive-ui';
  import { RouterView, useRoute, useRouter } from 'vue-router';
  import { computed, ref, onMounted, onUnmounted, watch, h } from 'vue';
  import type { Component } from 'vue';
  import {
    Agreement,
    AlarmClock,
    Announcement,
    CalendarDot,
    Caution,
    ChartHistogram,
    CheckOne,
    ChopsticksFork,
    Cube,
    Devices,
    Entertainment,
    Health,
    Home,
    HospitalBed,
    Key,
    MedicalFiles,
    Messages,
    Moon,
    MoveIn,
    NurseCap,
    Nutrition,
    Peoples,
    Protect,
    Refresh,
    Report,
    Setting,
    ShoppingCart,
    Sun,
    User,
    Wallet,
  } from '@icon-park/vue-next';
  import { useTheme } from '@ui/composables/useTheme';
  import { useSyncStore } from '../stores/sync.store';
  import { useNotificationStore } from '../stores/notification.store';
  import { useAuthStore } from '../stores/auth.store';
  import { useTabsStore } from '../stores/tabs.store';
  import { formatDateTime } from '@yanglao/core';
  import { MENU_GROUPS, MENU_CATALOG } from '../config/menu-catalog';
  import AnimFade from '@ui/components/AnimFade.vue';
  import TagsView from './TagsView.vue';
  import AnnouncementTicker from '../components/AnnouncementTicker.vue';
  import type { TaskReminderRow } from '@yanglao/db';
  import { initAutoRefresh } from '../composables/useAutoRefresh';

  const { isDark, toggle } = useTheme();
  const route = useRoute();
  const router = useRouter();
  const syncStore = useSyncStore();
  const notifyStore = useNotificationStore();
  const authStore = useAuthStore();
  const tabsStore = useTabsStore();
  const message = useMessage();
  const dialog = useDialog();

  const collapsed = ref(false);
  const iconParkComponents: Record<string, Component> = {
    Agreement,
    AlarmClock,
    Announcement,
    CalendarDot,
    Caution,
    ChartHistogram,
    CheckOne,
    ChopsticksFork,
    Cube,
    Devices,
    Entertainment,
    Health,
    Home,
    HospitalBed,
    Key,
    MedicalFiles,
    Messages,
    MoveIn,
    NurseCap,
    Nutrition,
    Peoples,
    Protect,
    Refresh,
    Report,
    Setting,
    ShoppingCart,
    User,
    Wallet,
  };

  function renderIcon(name: string, className = 'layout-icon') {
    const icon = iconParkComponents[name] ?? Home;
    return h(icon, {
      class: className,
      theme: 'outline',
      size: 18,
      strokeWidth: 3,
    });
  }

  const showNotifications = ref(false);
  const notificationsLoading = ref(false);

  async function handleNotificationPanel(show: boolean) {
    showNotifications.value = show;
    if (!show) return;
    notificationsLoading.value = true;
    try {
      await Promise.all([
        notifyStore.fetchAll(),
        notifyStore.fetchUnreadCount(),
      ]);
    } finally {
      notificationsLoading.value = false;
    }
  }

  async function markNotificationRead(id: string) {
    await notifyStore.markRead(id);
  }

  async function markNotificationUnread(id: string) {
    await notifyStore.markUnread(id);
  }

  onMounted(() => notifyStore.fetchUnreadCount());

  // ── 自动刷新定时器初始化（读取用户配置的间隔秒数） ──────────────
  onMounted(async () => {
    try {
      const cfg = await window.api.config.app.get();
      const sec = cfg.autoRefreshSec ?? 0;
      initAutoRefresh(sec);
    } catch {
      /* 读取失败时不启动定时器 */
    }
  });

  // ── 任务提醒（闹钟式弹窗 + 提示音） ────────────────────────────
  const showAlarmModal = ref(false);
  const alarmQueue = ref<TaskReminderRow[]>([]);
  const currentAlarm = computed(() => alarmQueue.value[0] ?? null);
  let offAlarm: (() => void) | null = null;

  /** 用 Web Audio API 生成简短的提示音，无需外部音频文件 */
  function playAlarmSound() {
    try {
      const ctx = new AudioContext();
      const playBeep = (delay: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0.0001, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(
          0.3,
          ctx.currentTime + delay + 0.02,
        );
        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          ctx.currentTime + delay + 0.3,
        );
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.3);
      };
      playBeep(0);
      playBeep(0.4);
    } catch {
      // 部分环境可能限制音频自动播放，忽略失败
    }
  }

  function handleAlarmEvent(reminder: TaskReminderRow) {
    alarmQueue.value.push(reminder);
    showAlarmModal.value = true;
    playAlarmSound();
  }

  function dismissCurrentAlarm() {
    alarmQueue.value.shift();
    if (alarmQueue.value.length === 0) {
      showAlarmModal.value = false;
    } else {
      playAlarmSound();
    }
  }

  async function markCurrentAlarmDone() {
    if (!currentAlarm.value) return;
    try {
      await window.api.reminder.done(currentAlarm.value.id);
    } catch {
      /* 忽略失败，不影响弹窗关闭 */
    }
    dismissCurrentAlarm();
  }

  onMounted(() => {
    offAlarm = window.api.reminder.onAlarm(handleAlarmEvent);
  });
  onUnmounted(() => {
    offAlarm?.();
  });

  // 页签：进入 DefaultLayout 子路由时记录页签，并按需加入 KeepAlive 缓存名单
  watch(
    () => route.fullPath,
    () => tabsStore.addTab(route),
    { immediate: true },
  );

  // 首页概览始终可见（所有登录用户都可访问 Dashboard）
  const dashboardItem = {
    label: () =>
      h('span', { onClick: () => router.push('/dashboard') }, '首页概览'),
    key: '/dashboard',
    icon: () => renderIcon('Home'),
  };

  /** 按当前用户权限过滤菜单目录，仅渲染有权限的分组和菜单项 */
  const menuOptions = computed(() => {
    const groups = MENU_GROUPS.map((group) => {
      const items = MENU_CATALOG.filter(
        (item) => item.group === group.key && authStore.canAccessMenu(item.permissionKey ?? item.key),
      ).map((item) => ({
        label: () =>
          h('span', { onClick: () => router.push(`/${item.key}`) }, item.label),
        key: `/${item.key}`,
        icon: () => renderIcon(item.icon),
      }));
      return items.length
        ? {
            type: 'group' as const,
            label: group.label,
            key: `group-${group.key}`,
            children: items,
          }
        : null;
    }).filter((g): g is NonNullable<typeof g> => g !== null);

    return [dashboardItem, ...groups];
  });

  const activeKey = computed(() => '/' + route.path.split('/')[1]);

  const syncStatusColor = computed(() => {
    switch (syncStore.status) {
      case 'syncing':
        return 'info';
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'disabled':
        return 'default';
      default:
        return 'default';
    }
  });

  const syncStatusText = computed(() => {
    switch (syncStore.status) {
      case 'syncing':
        return '同步中...';
      case 'success':
        return `上次同步: ${syncStore.lastSyncAt ? formatDateTime(syncStore.lastSyncAt) : '—'}`;
      case 'error':
        return `同步失败: ${syncStore.lastError}`;
      case 'disabled':
        return '同步已禁用';
      default:
        return '等待同步';
    }
  });

  // ── 用户菜单 ─────────────────────────────────────────────────
  const userMenuOptions = [
    { label: '修改密码', key: 'change-password' },
    { label: '退出登录', key: 'logout' },
  ];

  const showChangePwModal = ref(false);
  const pwForm = ref({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const changingPw = ref(false);

  function handleUserMenuSelect(key: string) {
    if (key === 'change-password') {
      pwForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' };
      showChangePwModal.value = true;
    } else if (key === 'logout') {
      dialog.warning({
        title: '退出登录',
        content: '确定要退出当前账号吗？',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: async () => {
          await authStore.logout();
          router.replace('/login');
        },
      });
    }
  }

  async function handleChangePassword() {
    if (!pwForm.value.oldPassword || !pwForm.value.newPassword) {
      message.error('请填写完整');
      return;
    }
    if (pwForm.value.newPassword !== pwForm.value.confirmPassword) {
      message.error('两次输入的新密码不一致');
      return;
    }
    changingPw.value = true;
    try {
      const res = await authStore.changePassword(
        pwForm.value.oldPassword,
        pwForm.value.newPassword,
      );
      if (!res.ok) {
        message.error(res.error ?? '修改失败');
        return;
      }
      message.success('密码已修改');
      showChangePwModal.value = false;
    } finally {
      changingPw.value = false;
    }
  }

  // ── 顶部工具栏：快速新建任务提醒（随手创建，类似手机日历"+"入口） ────
  const showQuickReminderModal = ref(false);
  const quickSubmitting = ref(false);
  const canAssignReminder = computed(() =>
    authStore.canUseButton('reminder:assign'),
  );
  const quickReminderForm = ref({
    title: '',
    remind_date: new Date().toISOString().slice(0, 10),
    remind_at: '09:00',
    assignee_id: '',
  });
  const userOptionsForQuick = ref<{ label: string; value: string }[]>([]);

  async function openQuickReminder() {
    quickReminderForm.value = {
      title: '',
      remind_date: new Date().toISOString().slice(0, 10),
      remind_at: '09:00',
      assignee_id: authStore.currentUser?.id ?? '',
    };
    if (canAssignReminder.value && userOptionsForQuick.value.length === 0) {
      const users = await window.api.user.list();
      userOptionsForQuick.value = users
        .filter((u: { status: string }) => u.status === 'active')
        .map((u: { id: string; real_name: string }) => ({
          label: u.real_name,
          value: u.id,
        }));
    }
    showQuickReminderModal.value = true;
  }

  async function saveQuickReminder() {
    if (!quickReminderForm.value.title.trim())
      return message.error('请填写任务标题');
    quickSubmitting.value = true;
    try {
      await window.api.reminder.create({
        title: quickReminderForm.value.title.trim(),
        description: null,
        remind_at: quickReminderForm.value.remind_at,
        remind_date: quickReminderForm.value.remind_date,
        repeat_type: 'none',
        repeat_days: null,
        creator_id: authStore.currentUser?.id ?? '',
        assignee_id:
          quickReminderForm.value.assignee_id ||
          (authStore.currentUser?.id ?? ''),
        status: 'active',
      });
      message.success('提醒已创建');
      showQuickReminderModal.value = false;
    } catch {
      message.error('创建失败，请稍后重试');
    } finally {
      quickSubmitting.value = false;
    }
  }
</script>

<template>
  <NLayout has-sider style="height: 100vh">
    <!-- 侧边栏 -->
    <NLayoutSider
      bordered
      collapse-mode="width"
      :collapsed-width="0"
      :width="220"
      :collapsed="collapsed"
      show-trigger
      trigger-class="layout-sider-toggle"
      collapsed-trigger-class="layout-sider-toggle"
      @collapse="collapsed = true"
      @expand="collapsed = false"
    >
      <div
        class="flex-col-center py-4 border-b border-gray-100 dark:border-gray-700"
      >
        <span v-if="!collapsed" class="text-base font-bold text-primary"
          >养老管理系统</span
        >
        <Home v-else class="layout-brand-icon text-primary" theme="filled" :size="22" />
      </div>

      <NMenu
        :collapsed="collapsed"
        :collapsed-width="0"
        :collapsed-icon-size="18"
        :options="menuOptions"
        :value="activeKey"
      />
    </NLayoutSider>

    <NLayout>
      <!-- 顶部工具栏 -->
      <NLayoutHeader
        bordered
        class="flex px-4 py-2"
        style="height: 52px; gap: 24px"
      >
        <NSpace align="center" class="shrink-0">
          <NTooltip>
            <template #trigger>
              <NBadge :type="syncStatusColor" dot>
                <Refresh
                  class="header-icon"
                  theme="outline"
                  :size="18"
                  :stroke-width="3"
                  :class="{ 'animate-spin': syncStore.status === 'syncing' }"
                  @click="syncStore.triggerManual()"
                />
              </NBadge>
            </template>
            {{ syncStatusText }}
          </NTooltip>

          <NText v-if="syncStore.pendingCount > 0" depth="3" class="text-xs">
            {{ syncStore.pendingCount }} 条待同步
          </NText>
        </NSpace>

        <AnnouncementTicker
          class="flex-1 min-w-0"
        />

        <NSpace align="center" class="shrink-0">
          <!-- 快速新建任务提醒 -->
          <NTooltip>
            <template #trigger>
              <span class="header-action" @click="openQuickReminder">
                <AlarmClock
                  class="header-icon header-icon-clock"
                  theme="outline"
                  :size="18"
                  :stroke-width="3"
                />
              </span>
            </template>
            快速新建任务提醒
          </NTooltip>
          <!-- 通知铃 -->
          <NPopover
            trigger="click"
            placement="bottom-end"
            :show="showNotifications"
            @update:show="handleNotificationPanel"
          >
            <template #trigger>
              <span class="header-action">
                <NBadge
                  class="header-action-badge"
                  :value="notifyStore.unreadCount"
                  :max="99"
                  :show="notifyStore.unreadCount > 0"
                >
                  <Announcement
                    class="header-icon header-icon-notice"
                    theme="outline"
                    :size="18"
                    :stroke-width="3"
                  />
                </NBadge>
              </span>
            </template>
            <div style="width: 380px">
              <div class="flex-between mb-2">
                <span class="font-semibold">通知</span>
                <NButton
                  v-if="notifyStore.unreadCount > 0"
                  text
                  type="primary"
                  size="small"
                  @click="notifyStore.markAllRead()"
                >
                  全部标为已读
                </NButton>
              </div>
              <NSpin :show="notificationsLoading">
                <NEmpty
                  v-if="notifyStore.list.length === 0"
                  description="暂无通知"
                  size="small"
                  class="py-6"
                />
                <NList
                  v-else
                  hoverable
                  style="max-height: 440px; overflow: auto"
                >
                  <NListItem
                    v-for="notification in notifyStore.list"
                    :key="notification.id"
                  >
                    <NThing :title="notification.title">
                      <template #header-extra>
                        <NTag
                          v-if="notification.is_read === 0"
                          type="error"
                          size="small"
                          >未读</NTag
                        >
                        <NTag v-else size="small">已读</NTag>
                      </template>
                      <template #description>
                        <div class="text-sm text-gray-500 break-words">
                          {{ notification.content }}
                        </div>
                        <div class="flex-between mt-2">
                          <span class="text-xs text-gray-400">{{
                            formatDateTime(notification.created_at)
                          }}</span>
                          <NButton
                            v-if="notification.is_read === 0"
                            text
                            type="primary"
                            size="tiny"
                            @click="markNotificationRead(notification.id)"
                            >标为已读</NButton
                          >
                          <NButton
                            v-else
                            text
                            size="tiny"
                            @click="markNotificationUnread(notification.id)"
                            >设为未读</NButton
                          >
                        </div>
                      </template>
                    </NThing>
                  </NListItem>
                </NList>
              </NSpin>
            </div>
          </NPopover>
          <!-- 主题切换 -->
          <span class="header-action header-action-theme" @click="toggle">
            <Sun
              v-if="isDark"
              class="header-icon header-icon-theme"
              theme="outline"
              :size="18"
              :stroke-width="3"
            />
            <Moon
              v-else
              class="header-icon header-icon-theme"
              theme="outline"
              :size="18"
              :stroke-width="3"
            />
          </span>
          <!-- 当前用户 -->
          <NDropdown :options="userMenuOptions" @select="handleUserMenuSelect">
            <NSpace align="center" class="cursor-pointer ml-2" :size="6">
              <NAvatar round size="small" :style="{ background: '#2c5f8a' }">
                {{ authStore.currentUser?.real_name?.slice(0, 1) ?? '?' }}
              </NAvatar>
              <NText depth="2" class="text-sm">{{
                authStore.currentUser?.real_name
              }}</NText>
              <NText depth="3" class="text-xs">
                {{
                  authStore.currentUser?.position ?? authStore.currentRole?.name
                }}
                <span v-if="authStore.currentUser?.department"
                  >· {{ authStore.currentUser.department }}</span
                >
              </NText>
            </NSpace>
          </NDropdown>
        </NSpace>
      </NLayoutHeader>

      <!-- 页签导航 -->
      <TagsView />

      <!-- 内容区 -->
      <NLayoutContent
        content-style="padding: 0; overflow: auto;"
        style="height: calc(100vh - 52px - 36px)"
      >
        <AnimFade>
          <RouterView v-slot="{ Component, route: currentRoute }">
            <KeepAlive :include="tabsStore.cached">
              <component :is="Component" :key="currentRoute.path" />
            </KeepAlive>
          </RouterView>
        </AnimFade>
      </NLayoutContent>
    </NLayout>

    <!-- 修改密码弹窗 -->
    <NModal
      v-model:show="showChangePwModal"
      title="修改密码"
      preset="card"
      style="width: 420px"
    >
      <NForm :model="pwForm" label-placement="left" label-width="90">
        <NFormItem label="原密码" required>
          <NInput
            v-model:value="pwForm.oldPassword"
            type="password"
            show-password-on="click"
          />
        </NFormItem>
        <NFormItem label="新密码" required>
          <NInput
            v-model:value="pwForm.newPassword"
            type="password"
            show-password-on="click"
            placeholder="至少6位"
          />
        </NFormItem>
        <NFormItem label="确认新密码" required>
          <NInput
            v-model:value="pwForm.confirmPassword"
            type="password"
            show-password-on="click"
          />
        </NFormItem>
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showChangePwModal = false">取消</NButton>
          <NButton
            type="primary"
            :loading="changingPw"
            @click="handleChangePassword"
            >确认修改</NButton
          >
        </NSpace>
      </template>
    </NModal>

    <!-- 任务提醒弹窗（闹钟到点弹出，可多条排队） -->
    <NModal
      v-model:show="showAlarmModal"
      preset="card"
      style="width: 420px"
      :closable="false"
      :mask-closable="false"
    >
      <template #header>
        <NSpace align="center">
          <AlarmClock theme="outline" :size="22" :stroke-width="3" style="color: #f0a020" />
          <span class="font-bold text-base">任务提醒</span>
          <NText v-if="alarmQueue.length > 1" depth="3" class="text-xs"
            >（还有 {{ alarmQueue.length - 1 }} 条待处理）</NText
          >
        </NSpace>
      </template>
      <div v-if="currentAlarm" class="py-2">
        <div class="text-lg font-semibold mb-2">{{ currentAlarm.title }}</div>
        <div v-if="currentAlarm.description" class="text-sm text-gray-500 mb-3">
          {{ currentAlarm.description }}
        </div>
        <div class="text-xs text-gray-400">
          提醒时间：{{ currentAlarm.remind_date }} {{ currentAlarm.remind_at }}
          <span v-if="currentAlarm.repeat_type !== 'none'" class="ml-2"
            >（重复提醒）</span
          >
        </div>
      </div>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="dismissCurrentAlarm">稍后提醒</NButton>
          <NButton type="primary" @click="markCurrentAlarmDone"
            >已完成，不再提醒</NButton
          >
        </NSpace>
      </template>
    </NModal>

    <!-- 快速新建任务提醒弹窗（顶部工具栏入口） -->
    <NModal
      v-model:show="showQuickReminderModal"
      title="快速新建提醒"
      preset="card"
      style="width: 420px"
    >
      <NForm :model="quickReminderForm" label-placement="left" label-width="80">
        <NFormItem label="任务标题" required>
          <NInput
            v-model:value="quickReminderForm.title"
            placeholder="如：巡查3楼、护理王大爷..."
            maxlength="60"
            show-count
          />
        </NFormItem>
        <NFormItem label="提醒日期" required>
          <NDatePicker
            v-model:formatted-value="quickReminderForm.remind_date"
            value-format="yyyy-MM-dd"
            type="date"
            style="width: 100%"
          />
        </NFormItem>
        <NFormItem label="提醒时间" required>
          <NTimePicker
            v-model:formatted-value="quickReminderForm.remind_at"
            value-format="HH:mm"
            format="HH:mm"
            style="width: 100%"
          />
        </NFormItem>
        <NFormItem v-if="canAssignReminder" label="提醒谁">
          <NSelect
            v-model:value="quickReminderForm.assignee_id"
            :options="userOptionsForQuick"
            filterable
            placeholder="默认提醒自己"
          />
        </NFormItem>
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showQuickReminderModal = false">取消</NButton>
          <NButton
            type="primary"
            :loading="quickSubmitting"
            @click="saveQuickReminder"
            >创建</NButton
          >
        </NSpace>
      </template>
    </NModal>
  </NLayout>
</template>

<style scoped>
  :deep(.layout-sider-toggle) {
    width: 32px;
    height: 32px;
    color: #fff;
    border: 2px solid #2c5f8a;
    background-color: #2c5f8a;
    box-shadow: 0 2px 8px rgb(44 95 138 / 35%);
  }

  :deep(.layout-sider-toggle:hover) {
    border-color: #1f4d70;
    background-color: #1f4d70;
    box-shadow: 0 3px 10px rgb(31 77 112 / 45%);
  }

  :deep(.layout-icon),
  .layout-brand-icon,
  .header-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    vertical-align: -0.18em;
  }

  :deep(.layout-icon) {
    width: 18px;
    height: 18px;
  }

  :deep(.layout-icon svg) {
    width: 18px;
    height: 18px;
  }

  .layout-brand-icon {
    width: 22px;
    height: 22px;
  }

  .layout-brand-icon :deep(svg) {
    width: 22px;
    height: 22px;
  }

  .header-action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    width: 22px;
    height: 22px;
    line-height: 1;
    cursor: pointer;
  }

  .header-action-theme {
    margin-left: 8px;
  }

  .header-action-badge,
  .header-action-badge :deep(.n-badge-sup) {
    line-height: 1;
  }

  .header-action-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
  }

  .header-action-badge :deep(.n-badge) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .header-icon {
    width: 18px;
    height: 18px;
  }

  .header-icon :deep(svg) {
    width: 18px;
    height: 18px;
  }

  .header-icon-clock :deep(svg) {
    transform: scale(1.08);
  }

  .header-icon-notice :deep(svg) {
    transform: scale(1.12);
  }

  .header-icon-theme :deep(svg) {
    transform: scale(0.95);
  }

  .header-icon:hover {
    color: var(--n-primary-color);
  }
</style>
