// apps/desktop/src/renderer/src/config/menu-catalog.ts
// 菜单 / 按钮权限目录（角色管理页勾选权限、DefaultLayout 动态渲染菜单均以此为唯一数据源）
//
// 设计说明：
// - 每个菜单项 key 与路由 path 一一对应（不含前导斜杠），角色的 menu_keys 存的就是这些 key 的子集
// - is_system 角色（超级管理员）menu_keys/button_keys 固定为 ["*"]，代表拥有全部权限，不受此目录变化影响
// - 角色管理页创建/编辑角色时可一键套用"权限组"（数据库表 sys_permission_group，见权限组管理页），
//   套用后仍可在其基础上手动增减；权限组数据本身由 PermissionGroupRepo 管理，不再硬编码于此文件

export interface MenuCatalogItem {
  key: string;
  label: string;
  icon: string;
  group: string;
}

export interface MenuGroupDef {
  key: string;
  label: string;
}

export const MENU_GROUPS: MenuGroupDef[] = [
  { key: 'archive', label: '档案管理' },
  { key: 'admission', label: '入住管理' },
  { key: 'care', label: '日常照护' },
  { key: 'business', label: '经营管理' },
  { key: 'attendance', label: '考勤管理' },
  { key: 'iot', label: '物联设备' },
  { key: 'operations', label: '运营与安全' },
  { key: 'task', label: '任务提醒' },
  { key: 'system', label: '系统管理' },
];

/** 菜单目录：DefaultLayout 按用户权限从此列表过滤渲染，RoleManageView 按此列表渲染勾选树 */
export const MENU_CATALOG: MenuCatalogItem[] = [
  {
    key: 'elderly',
    label: '老人档案',
    icon: 'i-ion:people-outline',
    group: 'archive',
  },
  {
    key: 'bed',
    label: '床位管理',
    icon: 'i-ion:grid-outline',
    group: 'archive',
  },

  {
    key: 'admission',
    label: '入住管理',
    icon: 'i-ion:enter-outline',
    group: 'admission',
  },
  {
    key: 'contract',
    label: '合同管理',
    icon: 'i-ion:document-text-outline',
    group: 'admission',
  },

  {
    key: 'care',
    label: '护理管理',
    icon: 'i-ion:medkit-outline',
    group: 'care',
  },
  {
    key: 'health',
    label: '健康管理',
    icon: 'i-ion:heart-outline',
    group: 'care',
  },
  {
    key: 'meal',
    label: '餐饮管理',
    icon: 'i-ion:restaurant-outline',
    group: 'care',
  },
  {
    key: 'nutrition',
    label: '营养搭配',
    icon: 'i-ion:nutrition-outline',
    group: 'care',
  },
  {
    key: 'activity',
    label: '活动管理',
    icon: 'i-ion:balloon-outline',
    group: 'care',
  },
  {
    key: 'exam',
    label: '体检管理',
    icon: 'i-ion:clipboard-outline',
    group: 'care',
  },

  {
    key: 'fee',
    label: '费用管理',
    icon: 'i-ion:cash-outline',
    group: 'business',
  },
  {
    key: 'report',
    label: '统计报表',
    icon: 'i-ion:bar-chart-outline',
    group: 'business',
  },

  {
    key: 'clock',
    label: '考勤打卡',
    icon: 'i-ion:finger-print-outline',
    group: 'attendance',
  },
  {
    key: 'schedule',
    label: '排班管理',
    icon: 'i-ion:calendar-outline',
    group: 'attendance',
  },
  {
    key: 'leave',
    label: '请假管理',
    icon: 'i-ion:exit-outline',
    group: 'attendance',
  },
  {
    key: 'attendance-report',
    label: '考勤报表',
    icon: 'i-ion:stats-chart-outline',
    group: 'attendance',
  },

  {
    key: 'iot-device',
    label: '设备与维修',
    icon: 'i-ion:hardware-chip-outline',
    group: 'iot',
  },
  {
    key: 'operations',
    label: '运营与安全',
    icon: 'i-ion:shield-outline',
    group: 'operations',
  },

  {
    key: 'task-reminder',
    label: '任务提醒',
    icon: 'i-ion:alarm-outline',
    group: 'task',
  },

  {
    key: 'user',
    label: '账号管理',
    icon: 'i-ion:person-circle-outline',
    group: 'system',
  },
  {
    key: 'role',
    label: '角色权限',
    icon: 'i-ion:shield-checkmark-outline',
    group: 'system',
  },
  {
    key: 'permission-group',
    label: '权限组管理',
    icon: 'i-ion:key-outline',
    group: 'system',
  },
  {
    key: 'announcement',
    label: '公告管理',
    icon: 'i-ion:megaphone-outline',
    group: 'system',
  },
  {
    key: 'sync',
    label: '数据同步',
    icon: 'i-ion:sync-outline',
    group: 'system',
  },
  {
    key: 'settings',
    label: '系统设置',
    icon: 'i-ion:settings-outline',
    group: 'system',
  },
];

/** 按钮权限目录：key 格式 "菜单key:动作"，角色的 button_keys 存这些 key 的子集 */
export const BUTTON_CATALOG: { key: string; label: string }[] = [
  { key: 'elderly:create', label: '新增老人' },
  { key: 'elderly:delete', label: '删除老人' },
  { key: 'user:create', label: '新增账号' },
  { key: 'user:delete', label: '删除账号' },
  { key: 'user:reset-pw', label: '重置密码' },
  { key: 'role:create', label: '新增角色' },
  { key: 'role:delete', label: '删除角色' },
  { key: 'leave:approve', label: '请假审批' },
  { key: 'iot-device:create', label: '新增设备' },
  { key: 'iot-device:delete', label: '删除设备' },
  { key: 'exam:create', label: '新增体检预约/结果' },
  { key: 'permission-group:create', label: '新增权限组' },
  { key: 'permission-group:delete', label: '删除权限组' },
  { key: 'reminder:assign', label: '分配任务提醒给他人' },
  { key: 'announcement:create', label: '新建公告' },
  { key: 'announcement:edit', label: '编辑公告' },
  { key: 'announcement:publish', label: '发布/撤回公告' },
  { key: 'announcement:delete', label: '删除公告' },
  { key: 'operations:handover', label: '登记/确认交接班' },
  { key: 'operations:incident', label: '处理安全事件' },
  { key: 'operations:inventory', label: '管理物资库存' },
  { key: 'operations:document', label: '管理合规文书' },
];

/** 判断某个 menu_keys（JSON 数组字符串或已解析数组）是否允许访问指定 key，"*" 代表全部 */
export function menuKeysAllow(menuKeys: string[], key: string): boolean {
  return menuKeys.includes('*') || menuKeys.includes(key);
}
