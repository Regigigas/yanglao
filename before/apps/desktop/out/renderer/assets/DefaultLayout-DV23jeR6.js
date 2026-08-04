import { S as defineStore, r as ref, l as defineComponent, V as openBlock, a1 as createElementBlock, F as Fragment, a6 as renderList, u as unref, X as createVNode, a7 as useRoute, a2 as useRouter, c as computed, U as createBlock, W as withCtx, a3 as createBaseVNode, J as normalizeClass, k as createTextVNode, a8 as toDisplayString, a5 as withModifiers, a9 as createCommentVNode, aa as normalizeStyle, ab as RouterLink, o as onMounted, I as onUnmounted, w as watch, Y as RouterView, ac as KeepAlive, ad as resolveDynamicComponent, q as h } from "./vendor-vue-Hc3ejqjp.js";
import { u as useAuthStore, a as useSyncStore, b as useTheme, M as MENU_GROUPS, c as MENU_CATALOG } from "./index-77IpmxCe.js";
import { u as useNotificationStore } from "./notification.store-B8v7vQtJ.js";
import { f as formatDateTime } from "./validators-BfKhytEl.js";
import { _ as _sfc_main$3 } from "./AnimFade.vue_vue_type_script_setup_true_lang-D8GJYF9W.js";
import { n as NDropdown, h as NModal, B as Button, o as NTag, u as useMessage, p as useDialog, q as NLayout, r as NMenu, s as NLayoutSider, t as NLayoutHeader, v as NSpace, w as NTooltip, x as NBadge, y as NText, A as NPopover, C as NSpin, D as NEmpty, E as NList, F as NAvatar, G as NLayoutContent, j as NForm, k as NFormItem, l as NInput, H as NDatePicker, I as NTimePicker, J as NSelect, K as NListItem, L as NThing } from "./vendor-naive-sdNTCZPI.js";
import { u as useAnnouncementStore } from "./announcement.store-bGZtKrzW.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import { i as initAutoRefresh } from "./useAutoRefresh-BeuDS8Br.js";
import "./vendor-query-CFvMrhIw.js";
import "./vendor-echarts-DEbY5nl3.js";
import "./vendor-utils-DD6FGs_H.js";
const useTabsStore = defineStore("tabs", () => {
  const visited = ref([]);
  const cached = ref([]);
  function toTabView(route) {
    const name = route.name;
    if (!name) return null;
    return {
      path: route.path,
      fullPath: route.fullPath,
      name,
      title: route.meta.title ?? name,
      affix: !!route.meta.affix
    };
  }
  function addTab(route) {
    const tab = toTabView(route);
    if (!tab) return;
    if (!visited.value.some((v) => v.path === tab.path)) {
      visited.value.push(tab);
    }
    if (!route.meta.noCache && !cached.value.includes(tab.name)) {
      cached.value.push(tab.name);
    }
  }
  function uncache(name) {
    const idx = cached.value.indexOf(name);
    if (idx > -1) cached.value.splice(idx, 1);
  }
  function closeTab(path) {
    const idx = visited.value.findIndex((v) => v.path === path);
    if (idx === -1) return;
    const [removed] = visited.value.splice(idx, 1);
    if (!visited.value.some((v) => v.name === removed.name)) {
      uncache(removed.name);
    }
  }
  function syncCacheWithVisited() {
    cached.value = cached.value.filter((name) => visited.value.some((v) => v.name === name));
  }
  function closeOthers(path) {
    visited.value = visited.value.filter((v) => v.affix || v.path === path);
    syncCacheWithVisited();
  }
  function closeLeft(path) {
    const idx = visited.value.findIndex((v) => v.path === path);
    if (idx === -1) return;
    visited.value = visited.value.filter((v, i) => v.affix || i >= idx);
    syncCacheWithVisited();
  }
  function closeRight(path) {
    const idx = visited.value.findIndex((v) => v.path === path);
    if (idx === -1) return;
    visited.value = visited.value.filter((v, i) => v.affix || i <= idx);
    syncCacheWithVisited();
  }
  function closeAll() {
    visited.value = visited.value.filter((v) => v.affix);
    syncCacheWithVisited();
  }
  return {
    visited,
    cached,
    addTab,
    closeTab,
    closeOthers,
    closeLeft,
    closeRight,
    closeAll
  };
});
const _hoisted_1$2 = { class: "tags-view-container flex items-center h-9 px-3 gap-2 overflow-x-auto bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700" };
const _hoisted_2$2 = ["onClick"];
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "TagsView",
  setup(__props) {
    const route = useRoute();
    const router = useRouter();
    const tabsStore = useTabsStore();
    const contextMenuVisible = ref(false);
    const contextMenuX = ref(0);
    const contextMenuY = ref(0);
    const contextTab = ref(null);
    function isActive(tab) {
      return tab.path === route.path;
    }
    const dropdownOptions = computed(() => {
      const tab = contextTab.value;
      if (!tab) return [];
      return [
        { label: "关闭当前", key: "close", disabled: tab.affix },
        { label: "关闭其他", key: "closeOthers" },
        { label: "关闭左侧", key: "closeLeft" },
        { label: "关闭右侧", key: "closeRight" },
        { label: "关闭全部", key: "closeAll" }
      ];
    });
    function openContextMenu(tab, e) {
      e.preventDefault();
      contextTab.value = tab;
      contextMenuX.value = e.clientX;
      contextMenuY.value = e.clientY;
      contextMenuVisible.value = true;
    }
    function navigateAfterClose(closedPath) {
      if (route.path !== closedPath) return;
      const last = tabsStore.visited[tabsStore.visited.length - 1];
      router.push(last ? last.fullPath : "/dashboard");
    }
    function handleClose(tab) {
      if (tab.affix) return;
      tabsStore.closeTab(tab.path);
      navigateAfterClose(tab.path);
    }
    function handleSelect(key) {
      const tab = contextTab.value;
      if (!tab) return;
      switch (key) {
        case "close":
          handleClose(tab);
          break;
        case "closeOthers":
          tabsStore.closeOthers(tab.path);
          router.push(tab.fullPath);
          break;
        case "closeLeft":
          tabsStore.closeLeft(tab.path);
          navigateAfterClose(route.path);
          break;
        case "closeRight":
          tabsStore.closeRight(tab.path);
          navigateAfterClose(route.path);
          break;
        case "closeAll":
          tabsStore.closeAll();
          navigateAfterClose(route.path);
          break;
      }
      contextMenuVisible.value = false;
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$2, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(unref(tabsStore).visited, (tab) => {
          return openBlock(), createBlock(unref(RouterLink), {
            key: tab.path,
            to: tab.fullPath,
            class: normalizeClass(["tags-view-item group flex-center flex-shrink-0 h-6.5 pl-2.5 rounded text-xs border cursor-pointer select-none no-underline transition-colors", isActive(tab) ? "bg-primary/10 text-primary border-primary/40 font-medium" : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:border-primary/50 hover:text-primary"]),
            style: normalizeStyle({ paddingRight: tab.affix ? "10px" : "2px" }),
            onContextmenu: ($event) => openContextMenu(tab, $event),
            onMouseup: withModifiers(($event) => handleClose(tab), ["middle"])
          }, {
            default: withCtx(() => [
              createBaseVNode("span", {
                class: normalizeClass(["w-1.5 h-1.5 mr-1.5 rounded-full flex-shrink-0 transition-colors", isActive(tab) ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"])
              }, null, 2),
              createTextVNode(" " + toDisplayString(tab.title) + " ", 1),
              !tab.affix ? (openBlock(), createElementBlock("span", {
                key: 0,
                class: normalizeClass(["flex-center flex-shrink-0 w-3.5 h-3.5 ml-1.5 rounded-full transition-colors text-gray-400 hover:text-white hover:bg-gray-400 dark:text-gray-500 dark:hover:bg-gray-500 leading-none", isActive(tab) ? "hover:!bg-primary hover:!text-white" : ""]),
                onClick: withModifiers(($event) => handleClose(tab), ["stop", "prevent"])
              }, [..._cache[1] || (_cache[1] = [
                createBaseVNode("i", { class: "iconfont icon-guanbi text-[8px] leading-none" }, null, -1)
              ])], 10, _hoisted_2$2)) : createCommentVNode("", true)
            ]),
            _: 2
          }, 1032, ["to", "class", "style", "onContextmenu", "onMouseup"]);
        }), 128)),
        createVNode(unref(NDropdown), {
          placement: "bottom-start",
          trigger: "manual",
          show: contextMenuVisible.value,
          x: contextMenuX.value,
          y: contextMenuY.value,
          options: dropdownOptions.value,
          onSelect: handleSelect,
          onClickoutside: _cache[0] || (_cache[0] = ($event) => contextMenuVisible.value = false)
        }, null, 8, ["show", "x", "y", "options"])
      ]);
    };
  }
});
const _hoisted_1$1 = {
  key: 0,
  class: "announcement-ticker",
  "aria-label": "系统公告"
};
const _hoisted_2$1 = { class: "ticker-viewport" };
const _hoisted_3$1 = ["onClick"];
const _hoisted_4$1 = {
  key: 0,
  class: "ticker-pin"
};
const _hoisted_5$1 = { class: "ticker-title" };
const _hoisted_6$1 = { class: "ticker-content" };
const _hoisted_7$1 = {
  key: 1,
  class: "ticker-unread"
};
const _hoisted_8$1 = {
  key: 0,
  class: "announcement-detail-content"
};
const _hoisted_9$1 = {
  key: 1,
  class: "mt-5 text-xs text-gray-400"
};
const _hoisted_10$1 = { key: 0 };
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "AnnouncementTicker",
  setup(__props) {
    const announcementStore = useAnnouncementStore();
    const authStore = useAuthStore();
    const activeAnnouncement = ref(null);
    let refreshTimer = null;
    const tickerItems = computed(() => announcementStore.visible);
    async function refreshVisible() {
      const userId = authStore.currentUser?.id;
      if (userId) await announcementStore.fetchVisible(userId);
    }
    async function openAnnouncement(announcement) {
      activeAnnouncement.value = announcement;
      const userId = authStore.currentUser?.id;
      if (userId && announcement.is_read === 0) {
        await announcementStore.markRead(announcement.id, userId);
      }
    }
    function levelLabel(level) {
      return { normal: "公告", important: "重要", urgent: "紧急" }[level];
    }
    function levelType(level) {
      return { normal: "default", important: "warning", urgent: "error" }[level];
    }
    onMounted(async () => {
      await refreshVisible();
      refreshTimer = setInterval(refreshVisible, 6e4);
    });
    onUnmounted(() => {
      if (refreshTimer) clearInterval(refreshTimer);
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        tickerItems.value.length ? (openBlock(), createElementBlock("div", _hoisted_1$1, [
          _cache[2] || (_cache[2] = createBaseVNode("i", { class: "i-ion:megaphone-outline ticker-icon" }, null, -1)),
          createBaseVNode("div", _hoisted_2$1, [
            createBaseVNode("div", {
              class: normalizeClass(["ticker-track", { "ticker-track-static": tickerItems.value.length === 1 }])
            }, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(tickerItems.value.length > 1 ? 2 : 1, (copy) => {
                return openBlock(), createElementBlock("div", {
                  key: copy,
                  class: "ticker-set"
                }, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(tickerItems.value, (announcement) => {
                    return openBlock(), createElementBlock("button", {
                      key: `${copy}-${announcement.id}`,
                      type: "button",
                      class: "ticker-item",
                      onClick: ($event) => openAnnouncement(announcement)
                    }, [
                      announcement.is_pinned ? (openBlock(), createElementBlock("span", _hoisted_4$1, "置顶")) : createCommentVNode("", true),
                      createBaseVNode("span", _hoisted_5$1, toDisplayString(announcement.title), 1),
                      createBaseVNode("span", _hoisted_6$1, toDisplayString(announcement.content), 1),
                      announcement.is_read === 0 ? (openBlock(), createElementBlock("span", _hoisted_7$1, "未读")) : createCommentVNode("", true)
                    ], 8, _hoisted_3$1);
                  }), 128))
                ]);
              }), 128))
            ], 2)
          ])
        ])) : createCommentVNode("", true),
        createVNode(unref(NModal), {
          show: !!activeAnnouncement.value,
          preset: "card",
          style: { "width": "620px" },
          title: activeAnnouncement.value?.title,
          "onUpdate:show": _cache[1] || (_cache[1] = (show) => {
            if (!show) activeAnnouncement.value = null;
          })
        }, {
          "header-extra": withCtx(() => [
            activeAnnouncement.value ? (openBlock(), createBlock(unref(NTag), {
              key: 0,
              type: levelType(activeAnnouncement.value.level),
              size: "small"
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(levelLabel(activeAnnouncement.value.level)), 1)
              ]),
              _: 1
            }, 8, ["type"])) : createCommentVNode("", true)
          ]),
          footer: withCtx(() => [
            createVNode(unref(Button), {
              type: "primary",
              onClick: _cache[0] || (_cache[0] = ($event) => activeAnnouncement.value = null)
            }, {
              default: withCtx(() => [..._cache[3] || (_cache[3] = [
                createTextVNode("已阅", -1)
              ])]),
              _: 1
            })
          ]),
          default: withCtx(() => [
            activeAnnouncement.value ? (openBlock(), createElementBlock("div", _hoisted_8$1, toDisplayString(activeAnnouncement.value.content), 1)) : createCommentVNode("", true),
            activeAnnouncement.value ? (openBlock(), createElementBlock("div", _hoisted_9$1, [
              createTextVNode(" 发布时间：" + toDisplayString(unref(formatDateTime)(activeAnnouncement.value.publish_at)) + " ", 1),
              activeAnnouncement.value.expire_at ? (openBlock(), createElementBlock("span", _hoisted_10$1, "　有效至：" + toDisplayString(unref(formatDateTime)(activeAnnouncement.value.expire_at)), 1)) : createCommentVNode("", true)
            ])) : createCommentVNode("", true)
          ]),
          _: 1
        }, 8, ["show", "title"])
      ], 64);
    };
  }
});
const AnnouncementTicker = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-6adc9241"]]);
const _hoisted_1 = { class: "flex-col-center py-4 border-b border-gray-100 dark:border-gray-700" };
const _hoisted_2 = {
  key: 0,
  class: "text-base font-bold text-primary"
};
const _hoisted_3 = {
  key: 1,
  class: "i-ion:home text-primary text-xl"
};
const _hoisted_4 = { style: { "width": "380px" } };
const _hoisted_5 = { class: "flex-between mb-2" };
const _hoisted_6 = { class: "text-sm text-gray-500 break-words" };
const _hoisted_7 = { class: "flex-between mt-2" };
const _hoisted_8 = { class: "text-xs text-gray-400" };
const _hoisted_9 = { key: 0 };
const _hoisted_10 = {
  key: 0,
  class: "py-2"
};
const _hoisted_11 = { class: "text-lg font-semibold mb-2" };
const _hoisted_12 = {
  key: 0,
  class: "text-sm text-gray-500 mb-3"
};
const _hoisted_13 = { class: "text-xs text-gray-400" };
const _hoisted_14 = {
  key: 0,
  class: "ml-2"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DefaultLayout",
  setup(__props) {
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
    const showNotifications = ref(false);
    const notificationsLoading = ref(false);
    async function handleNotificationPanel(show) {
      showNotifications.value = show;
      if (!show) return;
      notificationsLoading.value = true;
      try {
        await Promise.all([
          notifyStore.fetchAll(),
          notifyStore.fetchUnreadCount()
        ]);
      } finally {
        notificationsLoading.value = false;
      }
    }
    async function markNotificationRead(id) {
      await notifyStore.markRead(id);
    }
    async function markNotificationUnread(id) {
      await notifyStore.markUnread(id);
    }
    onMounted(() => notifyStore.fetchUnreadCount());
    onMounted(async () => {
      try {
        const cfg = await window.api.config.app.get();
        const sec = cfg.autoRefreshSec ?? 0;
        initAutoRefresh(sec);
      } catch {
      }
    });
    const showAlarmModal = ref(false);
    const alarmQueue = ref([]);
    const currentAlarm = computed(() => alarmQueue.value[0] ?? null);
    let offAlarm = null;
    function playAlarmSound() {
      try {
        const ctx = new AudioContext();
        const playBeep = (delay) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.value = 880;
          gain.gain.setValueAtTime(1e-4, ctx.currentTime + delay);
          gain.gain.exponentialRampToValueAtTime(
            0.3,
            ctx.currentTime + delay + 0.02
          );
          gain.gain.exponentialRampToValueAtTime(
            1e-4,
            ctx.currentTime + delay + 0.3
          );
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + delay);
          osc.stop(ctx.currentTime + delay + 0.3);
        };
        playBeep(0);
        playBeep(0.4);
      } catch {
      }
    }
    function handleAlarmEvent(reminder) {
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
      }
      dismissCurrentAlarm();
    }
    onMounted(() => {
      offAlarm = window.api.reminder.onAlarm(handleAlarmEvent);
    });
    onUnmounted(() => {
      offAlarm?.();
    });
    watch(
      () => route.fullPath,
      () => tabsStore.addTab(route),
      { immediate: true }
    );
    const dashboardItem = {
      label: () => h("span", { onClick: () => router.push("/dashboard") }, "首页概览"),
      key: "/dashboard",
      icon: () => h("i", { class: "i-ion:home-outline inline-block" })
    };
    const menuOptions = computed(() => {
      const groups = MENU_GROUPS.map((group) => {
        const items = MENU_CATALOG.filter(
          (item) => item.group === group.key && authStore.canAccessMenu(item.key)
        ).map((item) => ({
          label: () => h("span", { onClick: () => router.push(`/${item.key}`) }, item.label),
          key: `/${item.key}`,
          icon: () => h("i", { class: `${item.icon} inline-block` })
        }));
        return items.length ? {
          type: "group",
          label: group.label,
          key: `group-${group.key}`,
          children: items
        } : null;
      }).filter((g) => g !== null);
      return [dashboardItem, ...groups];
    });
    const activeKey = computed(() => "/" + route.path.split("/")[1]);
    const syncStatusColor = computed(() => {
      switch (syncStore.status) {
        case "syncing":
          return "info";
        case "success":
          return "success";
        case "error":
          return "error";
        case "disabled":
          return "default";
        default:
          return "default";
      }
    });
    const syncStatusText = computed(() => {
      switch (syncStore.status) {
        case "syncing":
          return "同步中...";
        case "success":
          return `上次同步: ${syncStore.lastSyncAt ? formatDateTime(syncStore.lastSyncAt) : "—"}`;
        case "error":
          return `同步失败: ${syncStore.lastError}`;
        case "disabled":
          return "同步已禁用";
        default:
          return "等待同步";
      }
    });
    const userMenuOptions = [
      { label: "修改密码", key: "change-password" },
      { label: "退出登录", key: "logout" }
    ];
    const showChangePwModal = ref(false);
    const pwForm = ref({ oldPassword: "", newPassword: "", confirmPassword: "" });
    const changingPw = ref(false);
    function handleUserMenuSelect(key) {
      if (key === "change-password") {
        pwForm.value = { oldPassword: "", newPassword: "", confirmPassword: "" };
        showChangePwModal.value = true;
      } else if (key === "logout") {
        dialog.warning({
          title: "退出登录",
          content: "确定要退出当前账号吗？",
          positiveText: "确定",
          negativeText: "取消",
          onPositiveClick: async () => {
            await authStore.logout();
            router.replace("/login");
          }
        });
      }
    }
    async function handleChangePassword() {
      if (!pwForm.value.oldPassword || !pwForm.value.newPassword) {
        message.error("请填写完整");
        return;
      }
      if (pwForm.value.newPassword !== pwForm.value.confirmPassword) {
        message.error("两次输入的新密码不一致");
        return;
      }
      changingPw.value = true;
      try {
        const res = await authStore.changePassword(
          pwForm.value.oldPassword,
          pwForm.value.newPassword
        );
        if (!res.ok) {
          message.error(res.error ?? "修改失败");
          return;
        }
        message.success("密码已修改");
        showChangePwModal.value = false;
      } finally {
        changingPw.value = false;
      }
    }
    const showQuickReminderModal = ref(false);
    const quickSubmitting = ref(false);
    const canAssignReminder = computed(
      () => authStore.canUseButton("reminder:assign")
    );
    const quickReminderForm = ref({
      title: "",
      remind_date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      remind_at: "09:00",
      assignee_id: ""
    });
    const userOptionsForQuick = ref([]);
    async function openQuickReminder() {
      quickReminderForm.value = {
        title: "",
        remind_date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
        remind_at: "09:00",
        assignee_id: authStore.currentUser?.id ?? ""
      };
      if (canAssignReminder.value && userOptionsForQuick.value.length === 0) {
        const users = await window.api.user.list();
        userOptionsForQuick.value = users.filter((u) => u.status === "active").map((u) => ({
          label: u.real_name,
          value: u.id
        }));
      }
      showQuickReminderModal.value = true;
    }
    async function saveQuickReminder() {
      if (!quickReminderForm.value.title.trim())
        return message.error("请填写任务标题");
      quickSubmitting.value = true;
      try {
        await window.api.reminder.create({
          title: quickReminderForm.value.title.trim(),
          description: null,
          remind_at: quickReminderForm.value.remind_at,
          remind_date: quickReminderForm.value.remind_date,
          repeat_type: "none",
          repeat_days: null,
          creator_id: authStore.currentUser?.id ?? "",
          assignee_id: quickReminderForm.value.assignee_id || (authStore.currentUser?.id ?? ""),
          status: "active"
        });
        message.success("提醒已创建");
        showQuickReminderModal.value = false;
      } catch {
        message.error("创建失败，请稍后重试");
      } finally {
        quickSubmitting.value = false;
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(NLayout), {
        "has-sider": "",
        style: { "height": "100vh" }
      }, {
        default: withCtx(() => [
          createVNode(unref(NLayoutSider), {
            bordered: "",
            "collapse-mode": "width",
            "collapsed-width": 0,
            width: 220,
            collapsed: collapsed.value,
            "show-trigger": "",
            "trigger-class": "layout-sider-toggle",
            "collapsed-trigger-class": "layout-sider-toggle",
            onCollapse: _cache[0] || (_cache[0] = ($event) => collapsed.value = true),
            onExpand: _cache[1] || (_cache[1] = ($event) => collapsed.value = false)
          }, {
            default: withCtx(() => [
              createBaseVNode("div", _hoisted_1, [
                !collapsed.value ? (openBlock(), createElementBlock("span", _hoisted_2, "养老管理系统")) : (openBlock(), createElementBlock("span", _hoisted_3))
              ]),
              createVNode(unref(NMenu), {
                collapsed: collapsed.value,
                "collapsed-width": 0,
                "collapsed-icon-size": 22,
                options: menuOptions.value,
                value: activeKey.value
              }, null, 8, ["collapsed", "options", "value"])
            ]),
            _: 1
          }, 8, ["collapsed"]),
          createVNode(unref(NLayout), null, {
            default: withCtx(() => [
              createVNode(unref(NLayoutHeader), {
                bordered: "",
                class: "flex px-4 py-2",
                style: { "height": "52px", "gap": "24px" }
              }, {
                default: withCtx(() => [
                  createVNode(unref(NSpace), {
                    align: "center",
                    class: "shrink-0"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NTooltip), null, {
                        trigger: withCtx(() => [
                          createVNode(unref(NBadge), {
                            type: syncStatusColor.value,
                            dot: ""
                          }, {
                            default: withCtx(() => [
                              createBaseVNode("i", {
                                class: normalizeClass(["i-ion:sync-outline text-lg cursor-pointer hover:text-primary", { "animate-spin": unref(syncStore).status === "syncing" }]),
                                onClick: _cache[2] || (_cache[2] = ($event) => unref(syncStore).triggerManual())
                              }, null, 2)
                            ]),
                            _: 1
                          }, 8, ["type"])
                        ]),
                        default: withCtx(() => [
                          createTextVNode(" " + toDisplayString(syncStatusText.value), 1)
                        ]),
                        _: 1
                      }),
                      unref(syncStore).pendingCount > 0 ? (openBlock(), createBlock(unref(NText), {
                        key: 0,
                        depth: "3",
                        class: "text-xs"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(unref(syncStore).pendingCount) + " 条待同步 ", 1)
                        ]),
                        _: 1
                      })) : createCommentVNode("", true)
                    ]),
                    _: 1
                  }),
                  createVNode(AnnouncementTicker, { class: "flex-1 min-w-0" }),
                  createVNode(unref(NSpace), {
                    align: "center",
                    class: "shrink-0"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NTooltip), null, {
                        trigger: withCtx(() => [
                          createBaseVNode("i", {
                            class: "i-ion:alarm-outline text-xl cursor-pointer hover:text-primary",
                            onClick: openQuickReminder
                          })
                        ]),
                        default: withCtx(() => [
                          _cache[17] || (_cache[17] = createTextVNode(" 快速新建任务提醒 ", -1))
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NPopover), {
                        trigger: "click",
                        placement: "bottom-end",
                        show: showNotifications.value,
                        "onUpdate:show": handleNotificationPanel
                      }, {
                        trigger: withCtx(() => [
                          createVNode(unref(NBadge), {
                            value: unref(notifyStore).unreadCount,
                            max: 99,
                            show: unref(notifyStore).unreadCount > 0
                          }, {
                            default: withCtx(() => [..._cache[18] || (_cache[18] = [
                              createBaseVNode("i", { class: "i-ion:notifications-outline text-xl cursor-pointer hover:text-primary" }, null, -1)
                            ])]),
                            _: 1
                          }, 8, ["value", "show"])
                        ]),
                        default: withCtx(() => [
                          createBaseVNode("div", _hoisted_4, [
                            createBaseVNode("div", _hoisted_5, [
                              _cache[20] || (_cache[20] = createBaseVNode("span", { class: "font-semibold" }, "通知", -1)),
                              unref(notifyStore).unreadCount > 0 ? (openBlock(), createBlock(unref(Button), {
                                key: 0,
                                text: "",
                                type: "primary",
                                size: "small",
                                onClick: _cache[3] || (_cache[3] = ($event) => unref(notifyStore).markAllRead())
                              }, {
                                default: withCtx(() => [..._cache[19] || (_cache[19] = [
                                  createTextVNode(" 全部标为已读 ", -1)
                                ])]),
                                _: 1
                              })) : createCommentVNode("", true)
                            ]),
                            createVNode(unref(NSpin), { show: notificationsLoading.value }, {
                              default: withCtx(() => [
                                unref(notifyStore).list.length === 0 ? (openBlock(), createBlock(unref(NEmpty), {
                                  key: 0,
                                  description: "暂无通知",
                                  size: "small",
                                  class: "py-6"
                                })) : (openBlock(), createBlock(unref(NList), {
                                  key: 1,
                                  hoverable: "",
                                  style: { "max-height": "440px", "overflow": "auto" }
                                }, {
                                  default: withCtx(() => [
                                    (openBlock(true), createElementBlock(Fragment, null, renderList(unref(notifyStore).list, (notification) => {
                                      return openBlock(), createBlock(unref(NListItem), {
                                        key: notification.id
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(NThing), {
                                            title: notification.title
                                          }, {
                                            "header-extra": withCtx(() => [
                                              notification.is_read === 0 ? (openBlock(), createBlock(unref(NTag), {
                                                key: 0,
                                                type: "error",
                                                size: "small"
                                              }, {
                                                default: withCtx(() => [..._cache[21] || (_cache[21] = [
                                                  createTextVNode("未读", -1)
                                                ])]),
                                                _: 1
                                              })) : (openBlock(), createBlock(unref(NTag), {
                                                key: 1,
                                                size: "small"
                                              }, {
                                                default: withCtx(() => [..._cache[22] || (_cache[22] = [
                                                  createTextVNode("已读", -1)
                                                ])]),
                                                _: 1
                                              }))
                                            ]),
                                            description: withCtx(() => [
                                              createBaseVNode("div", _hoisted_6, toDisplayString(notification.content), 1),
                                              createBaseVNode("div", _hoisted_7, [
                                                createBaseVNode("span", _hoisted_8, toDisplayString(unref(formatDateTime)(notification.created_at)), 1),
                                                notification.is_read === 0 ? (openBlock(), createBlock(unref(Button), {
                                                  key: 0,
                                                  text: "",
                                                  type: "primary",
                                                  size: "tiny",
                                                  onClick: ($event) => markNotificationRead(notification.id)
                                                }, {
                                                  default: withCtx(() => [..._cache[23] || (_cache[23] = [
                                                    createTextVNode("标为已读", -1)
                                                  ])]),
                                                  _: 1
                                                }, 8, ["onClick"])) : (openBlock(), createBlock(unref(Button), {
                                                  key: 1,
                                                  text: "",
                                                  size: "tiny",
                                                  onClick: ($event) => markNotificationUnread(notification.id)
                                                }, {
                                                  default: withCtx(() => [..._cache[24] || (_cache[24] = [
                                                    createTextVNode("设为未读", -1)
                                                  ])]),
                                                  _: 1
                                                }, 8, ["onClick"]))
                                              ])
                                            ]),
                                            _: 2
                                          }, 1032, ["title"])
                                        ]),
                                        _: 2
                                      }, 1024);
                                    }), 128))
                                  ]),
                                  _: 1
                                }))
                              ]),
                              _: 1
                            }, 8, ["show"])
                          ])
                        ]),
                        _: 1
                      }, 8, ["show"]),
                      createBaseVNode("i", {
                        class: normalizeClass([unref(isDark) ? "i-ion:sunny-outline" : "i-ion:moon-outline", "text-xl cursor-pointer ml-2"]),
                        onClick: _cache[4] || (_cache[4] = //@ts-ignore
                        (...args) => unref(toggle) && unref(toggle)(...args))
                      }, null, 2),
                      createVNode(unref(NDropdown), {
                        options: userMenuOptions,
                        onSelect: handleUserMenuSelect
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(NSpace), {
                            align: "center",
                            class: "cursor-pointer ml-2",
                            size: 6
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(NAvatar), {
                                round: "",
                                size: "small",
                                style: { background: "#2c5f8a" }
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(unref(authStore).currentUser?.real_name?.slice(0, 1) ?? "?"), 1)
                                ]),
                                _: 1
                              }),
                              createVNode(unref(NText), {
                                depth: "2",
                                class: "text-sm"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(unref(authStore).currentUser?.real_name), 1)
                                ]),
                                _: 1
                              }),
                              createVNode(unref(NText), {
                                depth: "3",
                                class: "text-xs"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(unref(authStore).currentUser?.position ?? unref(authStore).currentRole?.name) + " ", 1),
                                  unref(authStore).currentUser?.department ? (openBlock(), createElementBlock("span", _hoisted_9, "· " + toDisplayString(unref(authStore).currentUser.department), 1)) : createCommentVNode("", true)
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(_sfc_main$2),
              createVNode(unref(NLayoutContent), {
                "content-style": "padding: 0; overflow: auto;",
                style: { "height": "calc(100vh - 52px - 36px)" }
              }, {
                default: withCtx(() => [
                  createVNode(_sfc_main$3, null, {
                    default: withCtx(() => [
                      createVNode(unref(RouterView), null, {
                        default: withCtx(({ Component, route: currentRoute }) => [
                          (openBlock(), createBlock(KeepAlive, {
                            include: unref(tabsStore).cached
                          }, [
                            (openBlock(), createBlock(resolveDynamicComponent(Component), {
                              key: currentRoute.path
                            }))
                          ], 1032, ["include"]))
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          createVNode(unref(NModal), {
            show: showChangePwModal.value,
            "onUpdate:show": _cache[9] || (_cache[9] = ($event) => showChangePwModal.value = $event),
            title: "修改密码",
            preset: "card",
            style: { "width": "420px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[8] || (_cache[8] = ($event) => showChangePwModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[25] || (_cache[25] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    loading: changingPw.value,
                    onClick: handleChangePassword
                  }, {
                    default: withCtx(() => [..._cache[26] || (_cache[26] = [
                      createTextVNode("确认修改", -1)
                    ])]),
                    _: 1
                  }, 8, ["loading"])
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(NForm), {
                model: pwForm.value,
                "label-placement": "left",
                "label-width": "90"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), {
                    label: "原密码",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: pwForm.value.oldPassword,
                        "onUpdate:value": _cache[5] || (_cache[5] = ($event) => pwForm.value.oldPassword = $event),
                        type: "password",
                        "show-password-on": "click"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "新密码",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: pwForm.value.newPassword,
                        "onUpdate:value": _cache[6] || (_cache[6] = ($event) => pwForm.value.newPassword = $event),
                        type: "password",
                        "show-password-on": "click",
                        placeholder: "至少6位"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "确认新密码",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: pwForm.value.confirmPassword,
                        "onUpdate:value": _cache[7] || (_cache[7] = ($event) => pwForm.value.confirmPassword = $event),
                        type: "password",
                        "show-password-on": "click"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["model"])
            ]),
            _: 1
          }, 8, ["show"]),
          createVNode(unref(NModal), {
            show: showAlarmModal.value,
            "onUpdate:show": _cache[10] || (_cache[10] = ($event) => showAlarmModal.value = $event),
            preset: "card",
            style: { "width": "420px" },
            closable: false,
            "mask-closable": false
          }, {
            header: withCtx(() => [
              createVNode(unref(NSpace), { align: "center" }, {
                default: withCtx(() => [
                  _cache[27] || (_cache[27] = createBaseVNode("i", {
                    class: "i-ion:alarm text-xl text-warning",
                    style: { "color": "#f0a020" }
                  }, null, -1)),
                  _cache[28] || (_cache[28] = createBaseVNode("span", { class: "font-bold text-base" }, "任务提醒", -1)),
                  alarmQueue.value.length > 1 ? (openBlock(), createBlock(unref(NText), {
                    key: 0,
                    depth: "3",
                    class: "text-xs"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("（还有 " + toDisplayString(alarmQueue.value.length - 1) + " 条待处理）", 1)
                    ]),
                    _: 1
                  })) : createCommentVNode("", true)
                ]),
                _: 1
              })
            ]),
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), { onClick: dismissCurrentAlarm }, {
                    default: withCtx(() => [..._cache[29] || (_cache[29] = [
                      createTextVNode("稍后提醒", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: markCurrentAlarmDone
                  }, {
                    default: withCtx(() => [..._cache[30] || (_cache[30] = [
                      createTextVNode("已完成，不再提醒", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              currentAlarm.value ? (openBlock(), createElementBlock("div", _hoisted_10, [
                createBaseVNode("div", _hoisted_11, toDisplayString(currentAlarm.value.title), 1),
                currentAlarm.value.description ? (openBlock(), createElementBlock("div", _hoisted_12, toDisplayString(currentAlarm.value.description), 1)) : createCommentVNode("", true),
                createBaseVNode("div", _hoisted_13, [
                  createTextVNode(" 提醒时间：" + toDisplayString(currentAlarm.value.remind_date) + " " + toDisplayString(currentAlarm.value.remind_at) + " ", 1),
                  currentAlarm.value.repeat_type !== "none" ? (openBlock(), createElementBlock("span", _hoisted_14, "（重复提醒）")) : createCommentVNode("", true)
                ])
              ])) : createCommentVNode("", true)
            ]),
            _: 1
          }, 8, ["show"]),
          createVNode(unref(NModal), {
            show: showQuickReminderModal.value,
            "onUpdate:show": _cache[16] || (_cache[16] = ($event) => showQuickReminderModal.value = $event),
            title: "快速新建提醒",
            preset: "card",
            style: { "width": "420px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[15] || (_cache[15] = ($event) => showQuickReminderModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[31] || (_cache[31] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    loading: quickSubmitting.value,
                    onClick: saveQuickReminder
                  }, {
                    default: withCtx(() => [..._cache[32] || (_cache[32] = [
                      createTextVNode("创建", -1)
                    ])]),
                    _: 1
                  }, 8, ["loading"])
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(NForm), {
                model: quickReminderForm.value,
                "label-placement": "left",
                "label-width": "80"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), {
                    label: "任务标题",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: quickReminderForm.value.title,
                        "onUpdate:value": _cache[11] || (_cache[11] = ($event) => quickReminderForm.value.title = $event),
                        placeholder: "如：巡查3楼、护理王大爷...",
                        maxlength: "60",
                        "show-count": ""
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "提醒日期",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NDatePicker), {
                        "formatted-value": quickReminderForm.value.remind_date,
                        "onUpdate:formattedValue": _cache[12] || (_cache[12] = ($event) => quickReminderForm.value.remind_date = $event),
                        "value-format": "yyyy-MM-dd",
                        type: "date",
                        style: { "width": "100%" }
                      }, null, 8, ["formatted-value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "提醒时间",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NTimePicker), {
                        "formatted-value": quickReminderForm.value.remind_at,
                        "onUpdate:formattedValue": _cache[13] || (_cache[13] = ($event) => quickReminderForm.value.remind_at = $event),
                        "value-format": "HH:mm",
                        format: "HH:mm",
                        style: { "width": "100%" }
                      }, null, 8, ["formatted-value"])
                    ]),
                    _: 1
                  }),
                  canAssignReminder.value ? (openBlock(), createBlock(unref(NFormItem), {
                    key: 0,
                    label: "提醒谁"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: quickReminderForm.value.assignee_id,
                        "onUpdate:value": _cache[14] || (_cache[14] = ($event) => quickReminderForm.value.assignee_id = $event),
                        options: userOptionsForQuick.value,
                        filterable: "",
                        placeholder: "默认提醒自己"
                      }, null, 8, ["value", "options"])
                    ]),
                    _: 1
                  })) : createCommentVNode("", true)
                ]),
                _: 1
              }, 8, ["model"])
            ]),
            _: 1
          }, 8, ["show"])
        ]),
        _: 1
      });
    };
  }
});
const DefaultLayout = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-2aff79e8"]]);
export {
  DefaultLayout as default
};
