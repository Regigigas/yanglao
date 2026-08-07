// apps/desktop/src/renderer/src/router/index.ts
// Vue Router 配置（路由级代码分割，减少首屏体积）

import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/LoginView.vue'),
    meta: { public: true },
  },
  {
    path: '/',
    component: () => import('../layouts/DefaultLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/dashboard/DashboardView.vue'),
        meta: { title: '首页概览', icon: 'i-ion:home-outline', affix: true },
      },
      // ── 老人管理 ──────────────────────────────────
      {
        path: 'elderly',
        name: 'ElderlyList',
        component: () => import('../views/elderly/ElderlyListView.vue'),
        meta: {
          title: '老人管理',
          icon: 'i-ion:people-outline',
          menuKey: 'elderly',
        },
      },
      {
        path: 'elderly/:id',
        name: 'ElderlyDetail',
        component: () => import('../views/elderly/ElderlyDetailView.vue'),
        // 动态参数页面不加入 KeepAlive 缓存，避免切换不同老人时显示上一个的残留数据
        meta: { title: '老人详情', menuKey: 'elderly', noCache: true },
      },
      // ── 床位管理 ──────────────────────────────────
      {
        path: 'bed',
        name: 'BedManage',
        component: () => import('../views/bed/BedManageView.vue'),
        meta: { title: '床位管理', icon: 'i-ion:bed-outline', menuKey: 'bed' },
      },
      // ── 入住管理 ──────────────────────────────────
      {
        path: 'admission',
        name: 'Admission',
        component: () => import('../views/admission/AdmissionView.vue'),
        meta: {
          title: '入住管理',
          icon: 'i-ion:enter-outline',
          menuKey: 'admission',
        },
      },
      // ── 护理管理 ──────────────────────────────────
      {
        path: 'care',
        name: 'Care',
        component: () => import('../views/care/CareView.vue'),
        meta: {
          title: '护理管理',
          icon: 'i-ion:medical-outline',
          menuKey: 'care',
        },
      },
      // ── 健康管理 ──────────────────────────────────
      {
        path: 'health',
        name: 'Health',
        component: () => import('../views/health/HealthView.vue'),
        meta: {
          title: '健康管理',
          icon: 'i-ion:heart-outline',
          menuKey: 'health',
        },
      },
      // ── 费用管理 ──────────────────────────────────
      {
        path: 'fee',
        name: 'Fee',
        component: () => import('../views/fee/FeeView.vue'),
        meta: { title: '费用管理', icon: 'i-ion:cash-outline', menuKey: 'fee' },
      },
      // ── 餐饮管理 ──────────────────────────────────
      {
        path: 'meal',
        name: 'Meal',
        component: () => import('../views/meal/MealView.vue'),
        meta: {
          title: '餐饮管理',
          icon: 'i-ion:restaurant-outline',
          menuKey: 'meal',
        },
      },
      // ── 营养搭配 ──────────────────────────────────
      {
        path: 'nutrition',
        name: 'Nutrition',
        component: () => import('../views/nutrition/NutritionView.vue'),
        meta: {
          title: '营养搭配',
          icon: 'i-ion:nutrition-outline',
          menuKey: 'nutrition',
        },
      },
      // ── 活动管理 ──────────────────────────────────
      {
        path: 'activity',
        name: 'Activity',
        component: () => import('../views/activity/ActivityView.vue'),
        meta: {
          title: '活动管理',
          icon: 'i-ion:balloon-outline',
          menuKey: 'activity',
        },
      },
      // ── 体检管理 ──────────────────────────────────
      {
        path: 'exam',
        name: 'Exam',
        component: () => import('../views/health/ExamView.vue'),
        meta: {
          title: '体检管理',
          icon: 'i-ion:clipboard-outline',
          menuKey: 'exam',
        },
      },
      // ── 合同管理 ──────────────────────────────────
      {
        path: 'contract',
        name: 'Contract',
        component: () => import('../views/contract/ContractView.vue'),
        meta: {
          title: '合同管理',
          icon: 'i-ion:document-text-outline',
          menuKey: 'contract',
        },
      },
      // ── 统计报表 ──────────────────────────────────
      {
        path: 'report',
        name: 'Report',
        component: () => import('../views/report/ReportView.vue'),
        meta: {
          title: '统计报表',
          icon: 'i-ion:bar-chart-outline',
          menuKey: 'report',
        },
      },
      // ── 考勤管理 ──────────────────────────────────
      {
        path: 'clock',
        name: 'Clock',
        component: () => import('../views/attendance/ClockView.vue'),
        meta: {
          title: '考勤打卡',
          icon: 'i-ion:finger-print-outline',
          menuKey: 'clock',
        },
      },
      {
        path: 'schedule',
        name: 'Schedule',
        component: () => import('../views/attendance/ScheduleView.vue'),
        meta: {
          title: '排班管理',
          icon: 'i-ion:calendar-outline',
          menuKey: 'schedule',
        },
      },
      {
        path: 'leave',
        name: 'Leave',
        component: () => import('../views/attendance/LeaveView.vue'),
        meta: {
          title: '请假管理',
          icon: 'i-ion:exit-outline',
          menuKey: 'leave',
        },
      },
      {
        path: 'attendance-report',
        name: 'AttendanceReport',
        component: () => import('../views/attendance/AttendanceReportView.vue'),
        meta: {
          title: '考勤报表',
          icon: 'i-ion:stats-chart-outline',
          menuKey: 'attendance-report',
        },
      },
      // ── 物联网设备 ──────────────────────────────────
      {
        path: 'iot-device',
        name: 'IotDevice',
        component: () => import('../views/iot/DeviceView.vue'),
        meta: {
          title: '设备与维修',
          icon: 'i-ion:hardware-chip-outline',
          menuKey: 'iot-device',
        },
      },
      // ── 采购管理 ──────────────────────────────────
      {
        path: 'purchase',
        name: 'Purchase',
        component: () => import('../views/purchase/PurchaseView.vue'),
        meta: {
          title: '采购管理',
          icon: 'i-ion:cart-outline',
          menuKey: 'purchase',
        },
      },
      {
        path: 'operations',
        name: 'Operations',
        component: () => import('../views/operations/OperationsView.vue'),
        meta: {
          title: '运营与安全',
          icon: 'i-ion:shield-outline',
          menuKey: 'operations',
        },
      },
      {
        path: 'service-loop',
        name: 'ServiceLoop',
        component: () => import('../views/service-loop/ServiceLoopView.vue'),
        meta: {
          title: '服务闭环',
          icon: 'i-ion:git-network-outline',
          menuKey: 'service-loop',
        },
      },
      {
        path: 'chat',
        name: 'Chat',
        component: () => import('../views/chat/ChatView.vue'),
        meta: {
          title: '消息中心',
          icon: 'i-ion:chatbubbles-outline',
          menuKey: 'chat',
        },
      },
      // ── 系统功能 ──────────────────────────────────
      {
        path: 'user',
        name: 'UserManage',
        component: () => import('../views/system/UserManageView.vue'),
        meta: {
          title: '账号管理',
          icon: 'i-ion:person-circle-outline',
          menuKey: 'user',
        },
      },
      {
        path: 'role',
        name: 'RoleManage',
        component: () => import('../views/system/RoleManageView.vue'),
        meta: {
          title: '角色权限',
          icon: 'i-ion:shield-checkmark-outline',
          menuKey: 'role',
        },
      },
      {
        path: 'permission-group',
        name: 'PermissionGroupManage',
        component: () =>
          import('../views/system/PermissionGroupManageView.vue'),
        meta: {
          title: '权限组管理',
          icon: 'i-ion:key-outline',
          menuKey: 'permission-group',
        },
      },
      {
        path: 'announcement',
        name: 'AnnouncementManage',
        component: () => import('../views/system/AnnouncementManageView.vue'),
        meta: {
          title: '公告管理',
          icon: 'i-ion:megaphone-outline',
          menuKey: 'announcement',
        },
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('../views/settings/SettingsView.vue'),
        meta: {
          title: '系统设置',
          icon: 'i-ion:settings-outline',
          menuKey: 'settings',
        },
      },
      {
        path: 'sync',
        name: 'SyncPanel',
        component: () => import('../views/sync/SyncView.vue'),
        meta: {
          title: '数据同步',
          icon: 'i-ion:sync-outline',
          menuKey: 'sync',
        },
      },
      // ── 任务提醒 ──────────────────────────────────
      {
        path: 'task-reminder',
        name: 'TaskReminder',
        component: () => import('../views/task-reminder/TaskReminderView.vue'),
        meta: {
          title: '任务提醒',
          icon: 'i-ion:alarm-outline',
          menuKey: 'task-reminder',
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue'),
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

// ── 登录与权限守卫 ──────────────────────────────────────────
router.beforeEach(async (to) => {
  const authStore = useAuthStore();
  await authStore.restore();

  if (to.meta.public) {
    // 已登录用户访问登录页，直接进首页
    if (to.name === 'Login' && authStore.isLoggedIn) return '/dashboard';
    return true;
  }

  if (!authStore.isLoggedIn) {
    return { name: 'Login' };
  }

  // 超级管理员（menu_keys 含 "*"）不受菜单权限限制
  const menuKey = to.meta.menuKey as string | undefined;
  if (menuKey && !authStore.canAccessMenu(menuKey)) {
    return false;
  }

  return true;
});
