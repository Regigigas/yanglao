// apps/desktop/src/preload/index.ts
// 预加载脚本 - 通过 contextBridge 安全暴露 IPC API

import { contextBridge, ipcRenderer } from 'electron';
import type {
  ChatContact,
  ChatConversation,
  ChatGroupInput,
  ChatMe,
  ChatMessage,
  ChatMessageQuery,
  ChatMode,
  ChatSendInput,
  ChatUserId,
  SyncConfig,
  SyncStatus,
} from '@yanglao/core';
import type { SyncEvent } from '@yanglao/sync';
import type {
  BackupInfo,
  IntegrityResult,
  LocalSyncResult,
  ShiftRow,
  TaskReminderRow,
  WorkShiftRule,
} from '@yanglao/db';

export type { ChatContact, ChatConversation, ChatMessage } from '@yanglao/core';

const api = {
  // ── 同步 ────────────────────────────────────────────────────
  sync: {
    triggerManual: () => ipcRenderer.invoke('sync:trigger-manual'),
    getConfig: (): Promise<SyncConfig> => ipcRenderer.invoke('sync:get-config'),
    saveConfig: (config: SyncConfig) =>
      ipcRenderer.invoke('sync:save-config', config),
    getStatus: (): Promise<SyncStatus> => ipcRenderer.invoke('sync:get-status'),
    pendingCount: (): Promise<{ count: number }> =>
      ipcRenderer.invoke('sync:pending-count'),
    disable: () => ipcRenderer.invoke('sync:disable'),
    onEvent: (callback: (event: SyncEvent) => void) => {
      const handler = (_: unknown, event: SyncEvent) => callback(event);
      ipcRenderer.on('sync:event', handler);
      return () => ipcRenderer.removeListener('sync:event', handler);
    },
  },

  // ── 老人信息 ─────────────────────────────────────────────────
  elderly: {
    list: () => ipcRenderer.invoke('elderly:list'),
    get: (id: string) => ipcRenderer.invoke('elderly:get', id),
    create: (data: unknown) => ipcRenderer.invoke('elderly:create', data),
    update: (id: string, data: unknown) =>
      ipcRenderer.invoke('elderly:update', { id, data }),
    delete: (id: string) => ipcRenderer.invoke('elderly:delete', id),
  },

  // ── 床位管理 ─────────────────────────────────────────────────
  building: {
    list: () => ipcRenderer.invoke('building:list'),
    create: (data: unknown) => ipcRenderer.invoke('building:create', data),
    update: (id: string, data: unknown) =>
      ipcRenderer.invoke('building:update', { id, data }),
    delete: (id: string) => ipcRenderer.invoke('building:delete', id),
  },
  roomType: {
    list: (activeOnly?: boolean) =>
      ipcRenderer.invoke('room-type:list', activeOnly),
    create: (data: unknown) => ipcRenderer.invoke('room-type:create', data),
    update: (id: string, data: unknown) =>
      ipcRenderer.invoke('room-type:update', { id, data }),
    delete: (id: string) => ipcRenderer.invoke('room-type:delete', id),
  },
  corridor: {
    list: (buildingId?: string) =>
      ipcRenderer.invoke('corridor:list', buildingId),
    create: (data: unknown) => ipcRenderer.invoke('corridor:create', data),
    update: (id: string, data: unknown) =>
      ipcRenderer.invoke('corridor:update', { id, data }),
    delete: (id: string) => ipcRenderer.invoke('corridor:delete', id),
  },
  room: {
    list: (buildingId?: string) => ipcRenderer.invoke('room:list', buildingId),
    create: (data: unknown) => ipcRenderer.invoke('room:create', data),
    update: (id: string, data: unknown) =>
      ipcRenderer.invoke('room:update', { id, data }),
    delete: (id: string) => ipcRenderer.invoke('room:delete', id),
    generate: (data: unknown) => ipcRenderer.invoke('room:generate', data),
  },
  bed: {
    list: (roomId?: string) => ipcRenderer.invoke('bed:list', roomId),
    available: () => ipcRenderer.invoke('bed:available'),
    stats: () => ipcRenderer.invoke('bed:stats'),
    create: (data: unknown) => ipcRenderer.invoke('bed:create', data),
    update: (id: string, data: unknown) =>
      ipcRenderer.invoke('bed:update', { id, data }),
    delete: (id: string) => ipcRenderer.invoke('bed:delete', id),
  },

  // ── 家属联系人 ─────────────────────────────────────────────────
  family: {
    list: (elderlyId: string) => ipcRenderer.invoke('family:list', elderlyId),
    create: (data: unknown) => ipcRenderer.invoke('family:create', data),
    update: (id: string, data: unknown) =>
      ipcRenderer.invoke('family:update', { id, data }),
    delete: (id: string) => ipcRenderer.invoke('family:delete', id),
  },

  // ── 健康管理 ─────────────────────────────────────────────────
  health: {
    profile: {
      get: (elderlyId: string) =>
        ipcRenderer.invoke('health:profile:get', elderlyId),
      save: (elderlyId: string, data: unknown) =>
        ipcRenderer.invoke('health:profile:save', { elderlyId, data }),
    },
    vital: {
      list: (elderlyId: string, limit?: number) =>
        ipcRenderer.invoke('health:vital:list', elderlyId, limit),
      create: (data: unknown) =>
        ipcRenderer.invoke('health:vital:create', data),
      delete: (id: string) => ipcRenderer.invoke('health:vital:delete', id),
    },
    medOrder: {
      list: (elderlyId: string, activeOnly?: boolean) =>
        ipcRenderer.invoke('health:med:order:list', elderlyId, activeOnly),
      create: (data: unknown) =>
        ipcRenderer.invoke('health:med:order:create', data),
      update: (id: string, data: unknown) =>
        ipcRenderer.invoke('health:med:order:update', { id, data }),
      delete: (id: string) => ipcRenderer.invoke('health:med:order:delete', id),
    },
    medRecord: {
      list: (elderlyId: string, date?: string) =>
        ipcRenderer.invoke('health:med:record:list', elderlyId, date),
      create: (data: unknown) =>
        ipcRenderer.invoke('health:med:record:create', data),
    },
    visit: {
      list: (elderlyId: string) =>
        ipcRenderer.invoke('health:visit:list', elderlyId),
      create: (data: unknown) =>
        ipcRenderer.invoke('health:visit:create', data),
      delete: (id: string) => ipcRenderer.invoke('health:visit:delete', id),
    },
    examAppointment: {
      list: (elderlyId?: string) =>
        ipcRenderer.invoke('health:exam:appt:list', elderlyId),
      create: (data: unknown) =>
        ipcRenderer.invoke('health:exam:appt:create', data),
      update: (id: string, data: unknown) =>
        ipcRenderer.invoke('health:exam:appt:update', { id, data }),
      delete: (id: string) => ipcRenderer.invoke('health:exam:appt:delete', id),
    },
    examResult: {
      list: (elderlyId?: string) =>
        ipcRenderer.invoke('health:exam:result:list', elderlyId),
      create: (data: unknown) =>
        ipcRenderer.invoke('health:exam:result:create', data),
      update: (id: string, data: unknown) =>
        ipcRenderer.invoke('health:exam:result:update', { id, data }),
      delete: (id: string) =>
        ipcRenderer.invoke('health:exam:result:delete', id),
    },
  },

  // ── 入住管理 ─────────────────────────────────────────────────
  admission: {
    list: () => ipcRenderer.invoke('admission:list'),
    listByElderly: (elderlyId: string) =>
      ipcRenderer.invoke('admission:list:elderly', elderlyId),
    active: (elderlyId: string) =>
      ipcRenderer.invoke('admission:active', elderlyId),
    create: (data: unknown) => ipcRenderer.invoke('admission:create', data),
    update: (id: string, data: unknown) =>
      ipcRenderer.invoke('admission:update', { id, data }),
    delete: (id: string) => ipcRenderer.invoke('admission:delete', id),
  },
  leave: {
    list: (elderlyId: string) =>
      ipcRenderer.invoke('admission:leave:list', elderlyId),
    active: (elderlyId: string) =>
      ipcRenderer.invoke('admission:leave:active', elderlyId),
    create: (data: unknown) =>
      ipcRenderer.invoke('admission:leave:create', data),
    return: (id: string, actualReturn: string) =>
      ipcRenderer.invoke('admission:leave:return', { id, actualReturn }),
  },
  discharge: {
    list: (elderlyId: string) =>
      ipcRenderer.invoke('discharge:list', elderlyId),
    create: (data: unknown) => ipcRenderer.invoke('discharge:create', data),
  },

  // ── 护理管理 ─────────────────────────────────────────────────
  care: {
    assessment: {
      list: (elderlyId: string) =>
        ipcRenderer.invoke('care:assess:list', elderlyId),
      latest: (elderlyId: string) =>
        ipcRenderer.invoke('care:assess:latest', elderlyId),
      create: (data: unknown) => ipcRenderer.invoke('care:assess:create', data),
      delete: (id: string) => ipcRenderer.invoke('care:assess:delete', id),
    },
    plan: {
      list: (elderlyId: string) =>
        ipcRenderer.invoke('care:plan:list', elderlyId),
      active: (elderlyId: string) =>
        ipcRenderer.invoke('care:plan:active', elderlyId),
      create: (data: unknown) => ipcRenderer.invoke('care:plan:create', data),
      update: (id: string, data: unknown) =>
        ipcRenderer.invoke('care:plan:update', { id, data }),
      delete: (id: string) => ipcRenderer.invoke('care:plan:delete', id),
    },
    record: {
      list: (elderlyId: string, date?: string) =>
        ipcRenderer.invoke('care:record:list', elderlyId, date),
      byDate: (date: string) => ipcRenderer.invoke('care:record:bydate', date),
      create: (data: unknown) => ipcRenderer.invoke('care:record:create', data),
      delete: (id: string) => ipcRenderer.invoke('care:record:delete', id),
    },
    workload: (startDate: string, endDate: string) =>
      ipcRenderer.invoke('care:workload', startDate, endDate),
  },

  // ── 费用管理 ─────────────────────────────────────────────────
  fee: {
    item: {
      list: (activeOnly?: boolean) =>
        ipcRenderer.invoke('fee:item:list', activeOnly),
      create: (data: unknown) => ipcRenderer.invoke('fee:item:create', data),
      update: (id: string, data: unknown) =>
        ipcRenderer.invoke('fee:item:update', { id, data }),
      delete: (id: string) => ipcRenderer.invoke('fee:item:delete', id),
    },
    deposit: {
      list: (elderlyId: string) =>
        ipcRenderer.invoke('fee:deposit:list', elderlyId),
      balance: (elderlyId: string) =>
        ipcRenderer.invoke('fee:deposit:balance', elderlyId),
      create: (data: unknown) => ipcRenderer.invoke('fee:deposit:create', data),
    },
    bill: {
      list: (elderlyId?: string) =>
        ipcRenderer.invoke('fee:bill:list', elderlyId),
      get: (elderlyId: string, billMonth: string) =>
        ipcRenderer.invoke('fee:bill:get', elderlyId, billMonth),
      overdue: () => ipcRenderer.invoke('fee:bill:overdue'),
      create: (data: unknown) => ipcRenderer.invoke('fee:bill:create', data),
      createWithDetails: (data: unknown, details: unknown[]) =>
        ipcRenderer.invoke('fee:bill:create-with-details', { data, details }),
      update: (id: string, data: unknown) =>
        ipcRenderer.invoke('fee:bill:update', { id, data }),
      detailList: (billId: string) =>
        ipcRenderer.invoke('fee:bill:detail:list', billId),
      detailCreate: (data: unknown) =>
        ipcRenderer.invoke('fee:bill:detail:create', data),
    },
    payment: {
      list: (elderlyId?: string, billId?: string) =>
        ipcRenderer.invoke('fee:payment:list', elderlyId, billId),
      create: (data: unknown) => ipcRenderer.invoke('fee:payment:create', data),
    },
    stats: (month: string) => ipcRenderer.invoke('fee:stats', month),
  },

  // ── 餐饮管理 ─────────────────────────────────────────────────
  meal: {
    menu: {
      byDate: (date: string) => ipcRenderer.invoke('meal:menu:bydate', date),
      range: (startDate: string, endDate: string) =>
        ipcRenderer.invoke('meal:menu:range', startDate, endDate),
      create: (data: unknown) => ipcRenderer.invoke('meal:menu:create', data),
      update: (id: string, data: unknown) =>
        ipcRenderer.invoke('meal:menu:update', { id, data }),
      delete: (id: string) => ipcRenderer.invoke('meal:menu:delete', id),
    },
    record: {
      list: (elderlyId: string, limit?: number) =>
        ipcRenderer.invoke('meal:record:list', elderlyId, limit),
      byDate: (date: string) => ipcRenderer.invoke('meal:record:bydate', date),
      create: (data: unknown) => ipcRenderer.invoke('meal:record:create', data),
      update: (id: string, data: unknown) =>
        ipcRenderer.invoke('meal:record:update', { id, data }),
      delete: (id: string) => ipcRenderer.invoke('meal:record:delete', id),
    },
    nutrition: {
      list: (elderlyId: string, includeInactive?: boolean) =>
        ipcRenderer.invoke('meal:nutrition:list', elderlyId, includeInactive),
      create: (data: unknown) =>
        ipcRenderer.invoke('meal:nutrition:create', data),
      update: (id: string, data: unknown) =>
        ipcRenderer.invoke('meal:nutrition:update', { id, data }),
      delete: (id: string) => ipcRenderer.invoke('meal:nutrition:delete', id),
    },
  },

  // ── 活动管理 ─────────────────────────────────────────────────
  activity: {
    list: (status?: string) => ipcRenderer.invoke('activity:list', status),
    get: (id: string) => ipcRenderer.invoke('activity:get', id),
    create: (data: unknown) => ipcRenderer.invoke('activity:create', data),
    update: (id: string, data: unknown) =>
      ipcRenderer.invoke('activity:update', { id, data }),
    delete: (id: string) => ipcRenderer.invoke('activity:delete', id),
    start: (id: string) => ipcRenderer.invoke('activity:start', id),
    complete: (id: string) => ipcRenderer.invoke('activity:complete', id),
    cancel: (id: string) => ipcRenderer.invoke('activity:cancel', id),
    attendance: {
      list: (activityId: string) =>
        ipcRenderer.invoke('activity:attendance:list', activityId),
      elderly: (elderlyId: string) =>
        ipcRenderer.invoke('activity:attendance:elderly', elderlyId),
      register: (activityId: string, elderlyId: string) =>
        ipcRenderer.invoke(
          'activity:attendance:register',
          activityId,
          elderlyId,
        ),
      checkIn: (activityId: string, elderlyId: string) =>
        ipcRenderer.invoke(
          'activity:attendance:checkin',
          activityId,
          elderlyId,
        ),
      absent: (activityId: string, elderlyId: string) =>
        ipcRenderer.invoke('activity:attendance:absent', activityId, elderlyId),
      remove: (activityId: string, elderlyId: string) =>
        ipcRenderer.invoke('activity:attendance:remove', activityId, elderlyId),
    },
  },

  // ── 合同管理 ─────────────────────────────────────────────────
  contract: {
    list: () => ipcRenderer.invoke('contract:list'),
    listByElderly: (elderlyId: string) =>
      ipcRenderer.invoke('contract:list:elderly', elderlyId),
    active: (elderlyId: string) =>
      ipcRenderer.invoke('contract:active', elderlyId),
    expiring: (days?: number) => ipcRenderer.invoke('contract:expiring', days),
    create: (data: unknown) => ipcRenderer.invoke('contract:create', data),
    update: (id: string, data: unknown) =>
      ipcRenderer.invoke('contract:update', { id, data }),
    delete: (id: string) => ipcRenderer.invoke('contract:delete', id),
    genNo: () => ipcRenderer.invoke('contract:gen:no'),
    selectAttachment: (): Promise<{
      canceled: boolean;
      filePath?: string;
      fileName?: string;
    }> => ipcRenderer.invoke('contract:attachment:select'),
    openAttachment: (filePath: string) =>
      ipcRenderer.invoke('contract:attachment:open', filePath),
  },

  // ── 通知 ─────────────────────────────────────────────────────
  notify: {
    list: (unreadOnly?: boolean) =>
      ipcRenderer.invoke('notify:list', unreadOnly),
    unreadCount: () => ipcRenderer.invoke('notify:unread:count'),
    create: (data: unknown) => ipcRenderer.invoke('notify:create', data),
    read: (id: string) => ipcRenderer.invoke('notify:read', id),
    unread: (id: string) => ipcRenderer.invoke('notify:unread', id),
    readAll: () => ipcRenderer.invoke('notify:read:all'),
    delete: (id: string) => ipcRenderer.invoke('notify:delete', id),
  },

  // ── 全员公告 ──────────────────────────────────────────────────
  announcement: {
    list: () => ipcRenderer.invoke('announcement:list'),
    visible: (userId: string) =>
      ipcRenderer.invoke('announcement:visible', userId),
    create: (data: unknown) => ipcRenderer.invoke('announcement:create', data),
    update: (id: string, data: unknown) =>
      ipcRenderer.invoke('announcement:update', { id, data }),
    publish: (id: string, userId: string) =>
      ipcRenderer.invoke('announcement:publish', { id, userId }),
    withdraw: (id: string) => ipcRenderer.invoke('announcement:withdraw', id),
    delete: (id: string) => ipcRenderer.invoke('announcement:delete', id),
    read: (announcementId: string, userId: string) =>
      ipcRenderer.invoke('announcement:read', { announcementId, userId }),
    readStats: (id: string) =>
      ipcRenderer.invoke('announcement:read-stats', id),
    readUsers: (id: string) =>
      ipcRenderer.invoke('announcement:read-users', id),
  },

  chat: {
    getMode: (): Promise<ChatMode> => ipcRenderer.invoke('chat:mode:get'),
    setMode: (mode: ChatMode): Promise<{ mode: ChatMode }> =>
      ipcRenderer.invoke('chat:mode:set', mode),
    me: (): Promise<ChatMe> => ipcRenderer.invoke('chat:me'),
    contacts: (keyword?: string): Promise<ChatContact[]> =>
      ipcRenderer.invoke('chat:contacts', keyword),
    conversations: (): Promise<ChatConversation[]> =>
      ipcRenderer.invoke('chat:conversations'),
    createDirect: (peerUserId: ChatUserId): Promise<number> =>
      ipcRenderer.invoke('chat:direct:create', peerUserId),
    createGroup: (input: ChatGroupInput): Promise<number> =>
      ipcRenderer.invoke('chat:group:create', input),
    messages: (input: ChatMessageQuery): Promise<ChatMessage[]> =>
      ipcRenderer.invoke('chat:messages', input),
    send: (input: ChatSendInput): Promise<ChatMessage> =>
      ipcRenderer.invoke('chat:message:send', input),
    markRead: (conversationId: number, lastReadMessageId: number): Promise<void> =>
      ipcRenderer.invoke('chat:read', { conversationId, lastReadMessageId }),
  },

  // ── 运营与安全闭环 ─────────────────────────────────────────────
  operations: {
    riskSummary: () => ipcRenderer.invoke('operations:risk-summary'),
    handover: {
      list: () => ipcRenderer.invoke('operations:handover:list'),
      create: (data: unknown) => ipcRenderer.invoke('operations:handover:create', data),
      acknowledge: (id: string, incomingStaff: string) => ipcRenderer.invoke('operations:handover:acknowledge', { id, incomingStaff }),
    },
    incident: {
      list: (includeClosed?: boolean) => ipcRenderer.invoke('operations:incident:list', includeClosed),
      create: (data: unknown) => ipcRenderer.invoke('operations:incident:create', data),
      start: (id: string, responsible?: string) => ipcRenderer.invoke('operations:incident:start', { id, responsible }),
      notifyFamily: (id: string) => ipcRenderer.invoke('operations:incident:notify-family', id),
      close: (id: string, closeNote: string) => ipcRenderer.invoke('operations:incident:close', { id, closeNote }),
    },
    visitor: {
      list: (includeFinished?: boolean) => ipcRenderer.invoke('operations:visitor:list', includeFinished),
      create: (data: unknown) => ipcRenderer.invoke('operations:visitor:create', data),
      checkIn: (id: string) => ipcRenderer.invoke('operations:visitor:checkin', id),
      checkOut: (id: string, leaveAt: string) => ipcRenderer.invoke('operations:visitor:checkout', { id, leaveAt }),
      cancel: (id: string) => ipcRenderer.invoke('operations:visitor:cancel', id),
    },
    communication: {
      list: (openOnly?: boolean) => ipcRenderer.invoke('operations:communication:list', openOnly),
      create: (data: unknown) => ipcRenderer.invoke('operations:communication:create', data),
      close: (id: string) => ipcRenderer.invoke('operations:communication:close', id),
    },
    inventory: {
      list: () => ipcRenderer.invoke('operations:inventory:list'),
      create: (data: unknown) => ipcRenderer.invoke('operations:inventory:create', data),
      transactions: (itemId: string) => ipcRenderer.invoke('operations:inventory:transactions', itemId),
      transact: (data: unknown) => ipcRenderer.invoke('operations:inventory:transact', data),
    },
    document: {
      list: (elderlyId?: string) => ipcRenderer.invoke('operations:document:list', elderlyId),
      create: (data: unknown) => ipcRenderer.invoke('operations:document:create', data),
      selectAttachment: (): Promise<{ canceled: boolean; filePath?: string; fileName?: string }> => ipcRenderer.invoke('operations:document:attachment:select'),
      openAttachment: (filePath: string) => ipcRenderer.invoke('operations:document:attachment:open', filePath),
    },
    healthAlert: {
      list: (includeResolved?: boolean) => ipcRenderer.invoke('operations:health-alert:list', includeResolved),
      start: (id: string) => ipcRenderer.invoke('operations:health-alert:start', id),
      resolve: (id: string, resolver: string, resolution: string) => ipcRenderer.invoke('operations:health-alert:resolve', { id, resolver, resolution }),
    },
  },

  // ── 局域网主机模式 ─────────────────────────────────────────────
  lan: {
    getConfig: () => ipcRenderer.invoke('lan:config:get'),
    saveConfig: (cfg: {
      enabled?: 0 | 1;
      port?: number;
      allow_write?: 0 | 1;
      secret?: string | null;
    }) => ipcRenderer.invoke('lan:config:save', cfg),
    getStatus: () => ipcRenderer.invoke('lan:status'),
    getIPs: (): Promise<string[]> => ipcRenderer.invoke('lan:ips'),
    start: (port?: number) => ipcRenderer.invoke('lan:start', port),
    stop: () => ipcRenderer.invoke('lan:stop'),
    ping: (url: string) => ipcRenderer.invoke('lan:ping', url),
  },

  // ── 任务提醒（闹钟式提醒，支持自建与上级分配） ───────────────────
  reminder: {
    listMine: (userId: string, includeInactive?: boolean) =>
      ipcRenderer.invoke('reminder:list-mine', userId, includeInactive),
    listCreated: (userId: string) =>
      ipcRenderer.invoke('reminder:list-created', userId),
    get: (id: string) => ipcRenderer.invoke('reminder:get', id),
    byScheduleIds: (ids: string[]): Promise<Record<string, TaskReminderRow>> =>
      ipcRenderer.invoke('reminder:by-schedule-ids', ids),
    create: (data: unknown) => ipcRenderer.invoke('reminder:create', data),
    update: (id: string, data: unknown) =>
      ipcRenderer.invoke('reminder:update', { id, data }),
    done: (id: string) => ipcRenderer.invoke('reminder:done', id),
    cancel: (id: string) => ipcRenderer.invoke('reminder:cancel', id),
    delete: (id: string) => ipcRenderer.invoke('reminder:delete', id),
    /** 监听主进程推送的到期提醒事件（闹钟触发），返回取消监听函数 */
    onAlarm: (callback: (reminder: TaskReminderRow) => void) => {
      const handler = (_: unknown, reminder: TaskReminderRow) =>
        callback(reminder);
      ipcRenderer.on('reminder:alarm', handler);
      return () => ipcRenderer.removeListener('reminder:alarm', handler);
    },
  },

  // ── 应用信息 ─────────────────────────────────────────────────
  app: {
    getVersion: (): Promise<string> => ipcRenderer.invoke('app:get-version'),
    getUserData: (): Promise<string> => ipcRenderer.invoke('app:get-user-data'),
  },

  // ── 登录鉴权 ─────────────────────────────────────────────────
  auth: {
    login: (username: string, password: string, remember?: boolean) =>
      ipcRenderer.invoke('auth:login', { username, password, remember }),
    logout: () => ipcRenderer.invoke('auth:logout'),
    current: () => ipcRenderer.invoke('auth:current'),
    changePassword: (oldPassword: string, newPassword: string) =>
      ipcRenderer.invoke('auth:change-password', { oldPassword, newPassword }),
  },

  // ── 用户与角色管理 ───────────────────────────────────────────
  user: {
    list: () => ipcRenderer.invoke('user:list'),
    create: (data: unknown) => ipcRenderer.invoke('user:create', data),
    update: (id: string, data: unknown) =>
      ipcRenderer.invoke('user:update', { id, data }),
    resetPassword: (id: string, newPassword: string) =>
      ipcRenderer.invoke('user:reset-password', { id, newPassword }),
    delete: (id: string) => ipcRenderer.invoke('user:delete', id),
  },
  role: {
    list: () => ipcRenderer.invoke('role:list'),
    create: (data: unknown) => ipcRenderer.invoke('role:create', data),
    update: (id: string, data: unknown) =>
      ipcRenderer.invoke('role:update', { id, data }),
    delete: (id: string) => ipcRenderer.invoke('role:delete', id),
  },
  permissionGroup: {
    list: () => ipcRenderer.invoke('permission-group:list'),
    create: (data: unknown) =>
      ipcRenderer.invoke('permission-group:create', data),
    update: (id: string, data: unknown) =>
      ipcRenderer.invoke('permission-group:update', { id, data }),
    delete: (id: string) => ipcRenderer.invoke('permission-group:delete', id),
  },

  // ── 考勤：班次/排班/打卡/请假 ──────────────────────────────────
  shift: {
    list: (): Promise<ShiftRow[]> => ipcRenderer.invoke('shift:list'),
    create: (data: unknown) => ipcRenderer.invoke('shift:create', data),
    update: (id: string, data: unknown) =>
      ipcRenderer.invoke('shift:update', { id, data }),
    delete: (id: string) => ipcRenderer.invoke('shift:delete', id),
    setDefault: (id: string) => ipcRenderer.invoke('shift:set-default', id),
    workRule: (userId: string, workDate: string): Promise<WorkShiftRule | null> =>
      ipcRenderer.invoke('shift:work-rule', userId, workDate),
  },
  schedule: {
    list: (startDate: string, endDate: string, userId?: string) =>
      ipcRenderer.invoke('schedule:list', startDate, endDate, userId),
    get: (id: string) => ipcRenderer.invoke('schedule:get', id),
    create: (data: unknown) => ipcRenderer.invoke('schedule:create', data),
    update: (id: string, data: unknown) =>
      ipcRenderer.invoke('schedule:update', { id, data }),
    delete: (id: string) => ipcRenderer.invoke('schedule:delete', id),
  },
  attendance: {
    today: (userId: string, date: string) =>
      ipcRenderer.invoke('attendance:today', userId, date),
    range: (startDate: string, endDate: string, userId?: string) =>
      ipcRenderer.invoke('attendance:range', startDate, endDate, userId),
    clock: (data: {
      userId: string;
      clockType: 'clock_in' | 'clock_out';
      clockAt: string;
      remark?: string | null;
    }) => ipcRenderer.invoke('attendance:clock', data),
  },
  leaveApply: {
    list: (userId?: string, status?: string) =>
      ipcRenderer.invoke('leave:list', userId, status),
    create: (data: unknown) => ipcRenderer.invoke('leave:create', data),
    approve: (id: string, approved: boolean, remark?: string) =>
      ipcRenderer.invoke('leave:approve', { id, approved, remark }),
  },

  // ── 物联网设备 ───────────────────────────────────────────────
  iot: {
    device: {
      list: () => ipcRenderer.invoke('iot:device:list'),
      create: (data: unknown) => ipcRenderer.invoke('iot:device:create', data),
      update: (id: string, data: unknown) =>
        ipcRenderer.invoke('iot:device:update', { id, data }),
      delete: (id: string) => ipcRenderer.invoke('iot:device:delete', id),
    },
    data: {
      list: (deviceId: string, limit?: number) =>
        ipcRenderer.invoke('iot:data:list', deviceId, limit),
      listByElderly: (elderlyId: string, limit?: number) =>
        ipcRenderer.invoke('iot:data:list:elderly', elderlyId, limit),
    },
    alert: {
      list: (includeResolved?: boolean) => ipcRenderer.invoke('iot:alert:list', includeResolved),
      check: () => ipcRenderer.invoke('iot:health:check'),
      create: (data: unknown) => ipcRenderer.invoke('iot:alert:create', data),
      syncReminder: (alertId: string, userId: string) =>
        ipcRenderer.invoke('iot:alert:sync-reminder', { alertId, userId }),
      startRepair: (id: string) => ipcRenderer.invoke('iot:alert:start-repair', id),
      resolve: (id: string) => ipcRenderer.invoke('iot:alert:resolve', id),
    },
    report: (payload: {
      deviceId: string;
      elderlyId?: string | null;
      data: Record<string, unknown>;
    }) => ipcRenderer.invoke('iot:report', payload),
  },

  // ── 采购管理 ─────────────────────────────────────────────────
  purchase: {
    supplier: {
      list:   ()                         => ipcRenderer.invoke('purchase:supplier:list'),
      create: (data: unknown)            => ipcRenderer.invoke('purchase:supplier:create', data),
      update: (id: string, data: unknown)=> ipcRenderer.invoke('purchase:supplier:update', { id, data }),
      delete: (id: string)               => ipcRenderer.invoke('purchase:supplier:delete', id),
    },
    order: {
      list:         (status?: string)                             => ipcRenderer.invoke('purchase:order:list', status),
      create:       (order: unknown, items: unknown[])            => ipcRenderer.invoke('purchase:order:create', { order, items }),
      updateStatus: (id: string, status: string, remark?: string)=> ipcRenderer.invoke('purchase:order:update-status', { id, status, remark }),
      items:        (orderId: string)                             => ipcRenderer.invoke('purchase:order:items', orderId),
      delete:       (id: string)                                  => ipcRenderer.invoke('purchase:order:delete', id),
      stats:        ()                                            => ipcRenderer.invoke('purchase:order:stats'),
    },
  },

  // ── 数据库文件路径配置 ─────────────────────────────────────────
  db: {
    getPath: (): Promise<{
      current: string;
      default: string;
      isCustom: boolean;
    }> => ipcRenderer.invoke('db:get-path'),
    setPath: (newPath: string): Promise<{ ok: boolean }> =>
      ipcRenderer.invoke('db:set-path', newPath),
    resetPath: (): Promise<{ ok: boolean }> =>
      ipcRenderer.invoke('db:reset-path'),
    selectPath: (): Promise<{ canceled: boolean; path?: string }> =>
      ipcRenderer.invoke('db:select-path'),
    createBackup: (): Promise<BackupInfo> => ipcRenderer.invoke('db:backup:create'),
    listBackups: (): Promise<BackupInfo[]> => ipcRenderer.invoke('db:backup:list'),
    restoreBackup: (name: string): Promise<{ scheduled: true }> =>
      ipcRenderer.invoke('db:backup:restore', name),
    checkIntegrity: (): Promise<IntegrityResult> => ipcRenderer.invoke('db:integrity-check'),
    syncLocalFile: (): Promise<{ canceled: boolean; result?: LocalSyncResult }> =>
      ipcRenderer.invoke('db:local-sync:select-and-run'),
    exportBackup: (name: string): Promise<{ canceled: boolean; path?: string }> =>
      ipcRenderer.invoke('db:backup:export', name),
    openBackupDirectory: (): Promise<{ ok: boolean }> =>
      ipcRenderer.invoke('db:backup:open-directory'),
  },

  // ── 应用级通用配置（自动刷新间隔等） ───────────────────────────
  config: {
    app: {
      get: (): Promise<{ dbPath?: string; autoRefreshSec?: number }> =>
        ipcRenderer.invoke('config:app:get'),
      set: (partial: {
        autoRefreshSec?: number;
        dbPath?: string;
      }): Promise<{ ok: boolean }> =>
        ipcRenderer.invoke('config:app:set', partial),
    },
  },
};

contextBridge.exposeInMainWorld('api', api);

export type API = typeof api;
