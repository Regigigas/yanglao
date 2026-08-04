"use strict";
const electron = require("electron");
const api = {
  // ── 同步 ────────────────────────────────────────────────────
  sync: {
    triggerManual: () => electron.ipcRenderer.invoke("sync:trigger-manual"),
    getConfig: () => electron.ipcRenderer.invoke("sync:get-config"),
    saveConfig: (config) => electron.ipcRenderer.invoke("sync:save-config", config),
    getStatus: () => electron.ipcRenderer.invoke("sync:get-status"),
    pendingCount: () => electron.ipcRenderer.invoke("sync:pending-count"),
    disable: () => electron.ipcRenderer.invoke("sync:disable"),
    onEvent: (callback) => {
      const handler = (_, event) => callback(event);
      electron.ipcRenderer.on("sync:event", handler);
      return () => electron.ipcRenderer.removeListener("sync:event", handler);
    }
  },
  // ── 老人信息 ─────────────────────────────────────────────────
  elderly: {
    list: () => electron.ipcRenderer.invoke("elderly:list"),
    get: (id) => electron.ipcRenderer.invoke("elderly:get", id),
    create: (data) => electron.ipcRenderer.invoke("elderly:create", data),
    update: (id, data) => electron.ipcRenderer.invoke("elderly:update", { id, data }),
    delete: (id) => electron.ipcRenderer.invoke("elderly:delete", id)
  },
  // ── 床位管理 ─────────────────────────────────────────────────
  building: {
    list: () => electron.ipcRenderer.invoke("building:list"),
    create: (data) => electron.ipcRenderer.invoke("building:create", data),
    update: (id, data) => electron.ipcRenderer.invoke("building:update", { id, data }),
    delete: (id) => electron.ipcRenderer.invoke("building:delete", id)
  },
  room: {
    list: (buildingId) => electron.ipcRenderer.invoke("room:list", buildingId),
    create: (data) => electron.ipcRenderer.invoke("room:create", data),
    update: (id, data) => electron.ipcRenderer.invoke("room:update", { id, data }),
    delete: (id) => electron.ipcRenderer.invoke("room:delete", id)
  },
  bed: {
    list: (roomId) => electron.ipcRenderer.invoke("bed:list", roomId),
    available: () => electron.ipcRenderer.invoke("bed:available"),
    stats: () => electron.ipcRenderer.invoke("bed:stats"),
    create: (data) => electron.ipcRenderer.invoke("bed:create", data),
    update: (id, data) => electron.ipcRenderer.invoke("bed:update", { id, data }),
    delete: (id) => electron.ipcRenderer.invoke("bed:delete", id)
  },
  // ── 家属联系人 ─────────────────────────────────────────────────
  family: {
    list: (elderlyId) => electron.ipcRenderer.invoke("family:list", elderlyId),
    create: (data) => electron.ipcRenderer.invoke("family:create", data),
    update: (id, data) => electron.ipcRenderer.invoke("family:update", { id, data }),
    delete: (id) => electron.ipcRenderer.invoke("family:delete", id)
  },
  // ── 健康管理 ─────────────────────────────────────────────────
  health: {
    profile: {
      get: (elderlyId) => electron.ipcRenderer.invoke("health:profile:get", elderlyId),
      save: (elderlyId, data) => electron.ipcRenderer.invoke("health:profile:save", { elderlyId, data })
    },
    vital: {
      list: (elderlyId, limit) => electron.ipcRenderer.invoke("health:vital:list", elderlyId, limit),
      create: (data) => electron.ipcRenderer.invoke("health:vital:create", data),
      delete: (id) => electron.ipcRenderer.invoke("health:vital:delete", id)
    },
    medOrder: {
      list: (elderlyId, activeOnly) => electron.ipcRenderer.invoke("health:med:order:list", elderlyId, activeOnly),
      create: (data) => electron.ipcRenderer.invoke("health:med:order:create", data),
      update: (id, data) => electron.ipcRenderer.invoke("health:med:order:update", { id, data }),
      delete: (id) => electron.ipcRenderer.invoke("health:med:order:delete", id)
    },
    medRecord: {
      list: (elderlyId, date) => electron.ipcRenderer.invoke("health:med:record:list", elderlyId, date),
      create: (data) => electron.ipcRenderer.invoke("health:med:record:create", data)
    },
    visit: {
      list: (elderlyId) => electron.ipcRenderer.invoke("health:visit:list", elderlyId),
      create: (data) => electron.ipcRenderer.invoke("health:visit:create", data),
      delete: (id) => electron.ipcRenderer.invoke("health:visit:delete", id)
    },
    examAppointment: {
      list: (elderlyId) => electron.ipcRenderer.invoke("health:exam:appt:list", elderlyId),
      create: (data) => electron.ipcRenderer.invoke("health:exam:appt:create", data),
      update: (id, data) => electron.ipcRenderer.invoke("health:exam:appt:update", { id, data }),
      delete: (id) => electron.ipcRenderer.invoke("health:exam:appt:delete", id)
    },
    examResult: {
      list: (elderlyId) => electron.ipcRenderer.invoke("health:exam:result:list", elderlyId),
      create: (data) => electron.ipcRenderer.invoke("health:exam:result:create", data),
      update: (id, data) => electron.ipcRenderer.invoke("health:exam:result:update", { id, data }),
      delete: (id) => electron.ipcRenderer.invoke("health:exam:result:delete", id)
    }
  },
  // ── 入住管理 ─────────────────────────────────────────────────
  admission: {
    list: () => electron.ipcRenderer.invoke("admission:list"),
    listByElderly: (elderlyId) => electron.ipcRenderer.invoke("admission:list:elderly", elderlyId),
    active: (elderlyId) => electron.ipcRenderer.invoke("admission:active", elderlyId),
    create: (data) => electron.ipcRenderer.invoke("admission:create", data),
    update: (id, data) => electron.ipcRenderer.invoke("admission:update", { id, data }),
    delete: (id) => electron.ipcRenderer.invoke("admission:delete", id)
  },
  leave: {
    list: (elderlyId) => electron.ipcRenderer.invoke("admission:leave:list", elderlyId),
    active: (elderlyId) => electron.ipcRenderer.invoke("admission:leave:active", elderlyId),
    create: (data) => electron.ipcRenderer.invoke("admission:leave:create", data),
    return: (id, actualReturn) => electron.ipcRenderer.invoke("admission:leave:return", { id, actualReturn })
  },
  discharge: {
    list: (elderlyId) => electron.ipcRenderer.invoke("discharge:list", elderlyId),
    create: (data) => electron.ipcRenderer.invoke("discharge:create", data)
  },
  // ── 护理管理 ─────────────────────────────────────────────────
  care: {
    assessment: {
      list: (elderlyId) => electron.ipcRenderer.invoke("care:assess:list", elderlyId),
      latest: (elderlyId) => electron.ipcRenderer.invoke("care:assess:latest", elderlyId),
      create: (data) => electron.ipcRenderer.invoke("care:assess:create", data),
      delete: (id) => electron.ipcRenderer.invoke("care:assess:delete", id)
    },
    plan: {
      list: (elderlyId) => electron.ipcRenderer.invoke("care:plan:list", elderlyId),
      active: (elderlyId) => electron.ipcRenderer.invoke("care:plan:active", elderlyId),
      create: (data) => electron.ipcRenderer.invoke("care:plan:create", data),
      update: (id, data) => electron.ipcRenderer.invoke("care:plan:update", { id, data }),
      delete: (id) => electron.ipcRenderer.invoke("care:plan:delete", id)
    },
    record: {
      list: (elderlyId, date) => electron.ipcRenderer.invoke("care:record:list", elderlyId, date),
      byDate: (date) => electron.ipcRenderer.invoke("care:record:bydate", date),
      create: (data) => electron.ipcRenderer.invoke("care:record:create", data),
      delete: (id) => electron.ipcRenderer.invoke("care:record:delete", id)
    },
    workload: (startDate, endDate) => electron.ipcRenderer.invoke("care:workload", startDate, endDate)
  },
  // ── 费用管理 ─────────────────────────────────────────────────
  fee: {
    item: {
      list: (activeOnly) => electron.ipcRenderer.invoke("fee:item:list", activeOnly),
      create: (data) => electron.ipcRenderer.invoke("fee:item:create", data),
      update: (id, data) => electron.ipcRenderer.invoke("fee:item:update", { id, data }),
      delete: (id) => electron.ipcRenderer.invoke("fee:item:delete", id)
    },
    deposit: {
      list: (elderlyId) => electron.ipcRenderer.invoke("fee:deposit:list", elderlyId),
      balance: (elderlyId) => electron.ipcRenderer.invoke("fee:deposit:balance", elderlyId),
      create: (data) => electron.ipcRenderer.invoke("fee:deposit:create", data)
    },
    bill: {
      list: (elderlyId) => electron.ipcRenderer.invoke("fee:bill:list", elderlyId),
      get: (elderlyId, billMonth) => electron.ipcRenderer.invoke("fee:bill:get", elderlyId, billMonth),
      overdue: () => electron.ipcRenderer.invoke("fee:bill:overdue"),
      create: (data) => electron.ipcRenderer.invoke("fee:bill:create", data),
      createWithDetails: (data, details) => electron.ipcRenderer.invoke("fee:bill:create-with-details", { data, details }),
      update: (id, data) => electron.ipcRenderer.invoke("fee:bill:update", { id, data }),
      detailList: (billId) => electron.ipcRenderer.invoke("fee:bill:detail:list", billId),
      detailCreate: (data) => electron.ipcRenderer.invoke("fee:bill:detail:create", data)
    },
    payment: {
      list: (elderlyId, billId) => electron.ipcRenderer.invoke("fee:payment:list", elderlyId, billId),
      create: (data) => electron.ipcRenderer.invoke("fee:payment:create", data)
    },
    stats: (month) => electron.ipcRenderer.invoke("fee:stats", month)
  },
  // ── 餐饮管理 ─────────────────────────────────────────────────
  meal: {
    menu: {
      byDate: (date) => electron.ipcRenderer.invoke("meal:menu:bydate", date),
      range: (startDate, endDate) => electron.ipcRenderer.invoke("meal:menu:range", startDate, endDate),
      create: (data) => electron.ipcRenderer.invoke("meal:menu:create", data),
      update: (id, data) => electron.ipcRenderer.invoke("meal:menu:update", { id, data }),
      delete: (id) => electron.ipcRenderer.invoke("meal:menu:delete", id)
    },
    record: {
      list: (elderlyId, limit) => electron.ipcRenderer.invoke("meal:record:list", elderlyId, limit),
      byDate: (date) => electron.ipcRenderer.invoke("meal:record:bydate", date),
      create: (data) => electron.ipcRenderer.invoke("meal:record:create", data),
      update: (id, data) => electron.ipcRenderer.invoke("meal:record:update", { id, data }),
      delete: (id) => electron.ipcRenderer.invoke("meal:record:delete", id)
    },
    nutrition: {
      list: (elderlyId, includeInactive) => electron.ipcRenderer.invoke("meal:nutrition:list", elderlyId, includeInactive),
      create: (data) => electron.ipcRenderer.invoke("meal:nutrition:create", data),
      update: (id, data) => electron.ipcRenderer.invoke("meal:nutrition:update", { id, data }),
      delete: (id) => electron.ipcRenderer.invoke("meal:nutrition:delete", id)
    }
  },
  // ── 活动管理 ─────────────────────────────────────────────────
  activity: {
    list: (status) => electron.ipcRenderer.invoke("activity:list", status),
    get: (id) => electron.ipcRenderer.invoke("activity:get", id),
    create: (data) => electron.ipcRenderer.invoke("activity:create", data),
    update: (id, data) => electron.ipcRenderer.invoke("activity:update", { id, data }),
    delete: (id) => electron.ipcRenderer.invoke("activity:delete", id),
    start: (id) => electron.ipcRenderer.invoke("activity:start", id),
    complete: (id) => electron.ipcRenderer.invoke("activity:complete", id),
    cancel: (id) => electron.ipcRenderer.invoke("activity:cancel", id),
    attendance: {
      list: (activityId) => electron.ipcRenderer.invoke("activity:attendance:list", activityId),
      elderly: (elderlyId) => electron.ipcRenderer.invoke("activity:attendance:elderly", elderlyId),
      register: (activityId, elderlyId) => electron.ipcRenderer.invoke(
        "activity:attendance:register",
        activityId,
        elderlyId
      ),
      checkIn: (activityId, elderlyId) => electron.ipcRenderer.invoke(
        "activity:attendance:checkin",
        activityId,
        elderlyId
      ),
      absent: (activityId, elderlyId) => electron.ipcRenderer.invoke("activity:attendance:absent", activityId, elderlyId),
      remove: (activityId, elderlyId) => electron.ipcRenderer.invoke("activity:attendance:remove", activityId, elderlyId)
    }
  },
  // ── 合同管理 ─────────────────────────────────────────────────
  contract: {
    list: () => electron.ipcRenderer.invoke("contract:list"),
    listByElderly: (elderlyId) => electron.ipcRenderer.invoke("contract:list:elderly", elderlyId),
    active: (elderlyId) => electron.ipcRenderer.invoke("contract:active", elderlyId),
    expiring: (days) => electron.ipcRenderer.invoke("contract:expiring", days),
    create: (data) => electron.ipcRenderer.invoke("contract:create", data),
    update: (id, data) => electron.ipcRenderer.invoke("contract:update", { id, data }),
    delete: (id) => electron.ipcRenderer.invoke("contract:delete", id),
    genNo: () => electron.ipcRenderer.invoke("contract:gen:no"),
    selectAttachment: () => electron.ipcRenderer.invoke("contract:attachment:select"),
    openAttachment: (filePath) => electron.ipcRenderer.invoke("contract:attachment:open", filePath)
  },
  // ── 通知 ─────────────────────────────────────────────────────
  notify: {
    list: (unreadOnly) => electron.ipcRenderer.invoke("notify:list", unreadOnly),
    unreadCount: () => electron.ipcRenderer.invoke("notify:unread:count"),
    create: (data) => electron.ipcRenderer.invoke("notify:create", data),
    read: (id) => electron.ipcRenderer.invoke("notify:read", id),
    unread: (id) => electron.ipcRenderer.invoke("notify:unread", id),
    readAll: () => electron.ipcRenderer.invoke("notify:read:all"),
    delete: (id) => electron.ipcRenderer.invoke("notify:delete", id)
  },
  // ── 全员公告 ──────────────────────────────────────────────────
  announcement: {
    list: () => electron.ipcRenderer.invoke("announcement:list"),
    visible: (userId) => electron.ipcRenderer.invoke("announcement:visible", userId),
    create: (data) => electron.ipcRenderer.invoke("announcement:create", data),
    update: (id, data) => electron.ipcRenderer.invoke("announcement:update", { id, data }),
    publish: (id, userId) => electron.ipcRenderer.invoke("announcement:publish", { id, userId }),
    withdraw: (id) => electron.ipcRenderer.invoke("announcement:withdraw", id),
    delete: (id) => electron.ipcRenderer.invoke("announcement:delete", id),
    read: (announcementId, userId) => electron.ipcRenderer.invoke("announcement:read", { announcementId, userId }),
    readStats: (id) => electron.ipcRenderer.invoke("announcement:read-stats", id),
    readUsers: (id) => electron.ipcRenderer.invoke("announcement:read-users", id)
  },
  // ── 运营与安全闭环 ─────────────────────────────────────────────
  operations: {
    riskSummary: () => electron.ipcRenderer.invoke("operations:risk-summary"),
    handover: {
      list: () => electron.ipcRenderer.invoke("operations:handover:list"),
      create: (data) => electron.ipcRenderer.invoke("operations:handover:create", data),
      acknowledge: (id, incomingStaff) => electron.ipcRenderer.invoke("operations:handover:acknowledge", { id, incomingStaff })
    },
    incident: {
      list: (includeClosed) => electron.ipcRenderer.invoke("operations:incident:list", includeClosed),
      create: (data) => electron.ipcRenderer.invoke("operations:incident:create", data),
      start: (id, responsible) => electron.ipcRenderer.invoke("operations:incident:start", { id, responsible }),
      notifyFamily: (id) => electron.ipcRenderer.invoke("operations:incident:notify-family", id),
      close: (id, closeNote) => electron.ipcRenderer.invoke("operations:incident:close", { id, closeNote })
    },
    visitor: {
      list: (includeFinished) => electron.ipcRenderer.invoke("operations:visitor:list", includeFinished),
      create: (data) => electron.ipcRenderer.invoke("operations:visitor:create", data),
      checkIn: (id) => electron.ipcRenderer.invoke("operations:visitor:checkin", id),
      checkOut: (id, leaveAt) => electron.ipcRenderer.invoke("operations:visitor:checkout", { id, leaveAt }),
      cancel: (id) => electron.ipcRenderer.invoke("operations:visitor:cancel", id)
    },
    communication: {
      list: (openOnly) => electron.ipcRenderer.invoke("operations:communication:list", openOnly),
      create: (data) => electron.ipcRenderer.invoke("operations:communication:create", data),
      close: (id) => electron.ipcRenderer.invoke("operations:communication:close", id)
    },
    inventory: {
      list: () => electron.ipcRenderer.invoke("operations:inventory:list"),
      create: (data) => electron.ipcRenderer.invoke("operations:inventory:create", data),
      transactions: (itemId) => electron.ipcRenderer.invoke("operations:inventory:transactions", itemId),
      transact: (data) => electron.ipcRenderer.invoke("operations:inventory:transact", data)
    },
    document: {
      list: (elderlyId) => electron.ipcRenderer.invoke("operations:document:list", elderlyId),
      create: (data) => electron.ipcRenderer.invoke("operations:document:create", data),
      selectAttachment: () => electron.ipcRenderer.invoke("operations:document:attachment:select"),
      openAttachment: (filePath) => electron.ipcRenderer.invoke("operations:document:attachment:open", filePath)
    },
    healthAlert: {
      list: (includeResolved) => electron.ipcRenderer.invoke("operations:health-alert:list", includeResolved),
      start: (id) => electron.ipcRenderer.invoke("operations:health-alert:start", id),
      resolve: (id, resolver, resolution) => electron.ipcRenderer.invoke("operations:health-alert:resolve", { id, resolver, resolution })
    }
  },
  // ── 局域网主机模式 ─────────────────────────────────────────────
  lan: {
    getConfig: () => electron.ipcRenderer.invoke("lan:config:get"),
    saveConfig: (cfg) => electron.ipcRenderer.invoke("lan:config:save", cfg),
    getStatus: () => electron.ipcRenderer.invoke("lan:status"),
    getIPs: () => electron.ipcRenderer.invoke("lan:ips"),
    start: (port) => electron.ipcRenderer.invoke("lan:start", port),
    stop: () => electron.ipcRenderer.invoke("lan:stop"),
    ping: (url) => electron.ipcRenderer.invoke("lan:ping", url)
  },
  // ── 任务提醒（闹钟式提醒，支持自建与上级分配） ───────────────────
  reminder: {
    listMine: (userId, includeInactive) => electron.ipcRenderer.invoke("reminder:list-mine", userId, includeInactive),
    listCreated: (userId) => electron.ipcRenderer.invoke("reminder:list-created", userId),
    get: (id) => electron.ipcRenderer.invoke("reminder:get", id),
    byScheduleIds: (ids) => electron.ipcRenderer.invoke("reminder:by-schedule-ids", ids),
    create: (data) => electron.ipcRenderer.invoke("reminder:create", data),
    update: (id, data) => electron.ipcRenderer.invoke("reminder:update", { id, data }),
    done: (id) => electron.ipcRenderer.invoke("reminder:done", id),
    cancel: (id) => electron.ipcRenderer.invoke("reminder:cancel", id),
    delete: (id) => electron.ipcRenderer.invoke("reminder:delete", id),
    /** 监听主进程推送的到期提醒事件（闹钟触发），返回取消监听函数 */
    onAlarm: (callback) => {
      const handler = (_, reminder) => callback(reminder);
      electron.ipcRenderer.on("reminder:alarm", handler);
      return () => electron.ipcRenderer.removeListener("reminder:alarm", handler);
    }
  },
  // ── 应用信息 ─────────────────────────────────────────────────
  app: {
    getVersion: () => electron.ipcRenderer.invoke("app:get-version"),
    getUserData: () => electron.ipcRenderer.invoke("app:get-user-data")
  },
  // ── 登录鉴权 ─────────────────────────────────────────────────
  auth: {
    login: (username, password, remember) => electron.ipcRenderer.invoke("auth:login", { username, password, remember }),
    logout: () => electron.ipcRenderer.invoke("auth:logout"),
    current: () => electron.ipcRenderer.invoke("auth:current"),
    changePassword: (oldPassword, newPassword) => electron.ipcRenderer.invoke("auth:change-password", { oldPassword, newPassword })
  },
  // ── 用户与角色管理 ───────────────────────────────────────────
  user: {
    list: () => electron.ipcRenderer.invoke("user:list"),
    create: (data) => electron.ipcRenderer.invoke("user:create", data),
    update: (id, data) => electron.ipcRenderer.invoke("user:update", { id, data }),
    resetPassword: (id, newPassword) => electron.ipcRenderer.invoke("user:reset-password", { id, newPassword }),
    delete: (id) => electron.ipcRenderer.invoke("user:delete", id)
  },
  role: {
    list: () => electron.ipcRenderer.invoke("role:list"),
    create: (data) => electron.ipcRenderer.invoke("role:create", data),
    update: (id, data) => electron.ipcRenderer.invoke("role:update", { id, data }),
    delete: (id) => electron.ipcRenderer.invoke("role:delete", id)
  },
  permissionGroup: {
    list: () => electron.ipcRenderer.invoke("permission-group:list"),
    create: (data) => electron.ipcRenderer.invoke("permission-group:create", data),
    update: (id, data) => electron.ipcRenderer.invoke("permission-group:update", { id, data }),
    delete: (id) => electron.ipcRenderer.invoke("permission-group:delete", id)
  },
  // ── 考勤：班次/排班/打卡/请假 ──────────────────────────────────
  shift: {
    list: () => electron.ipcRenderer.invoke("shift:list"),
    create: (data) => electron.ipcRenderer.invoke("shift:create", data),
    update: (id, data) => electron.ipcRenderer.invoke("shift:update", { id, data }),
    delete: (id) => electron.ipcRenderer.invoke("shift:delete", id),
    setDefault: (id) => electron.ipcRenderer.invoke("shift:set-default", id),
    workRule: (userId, workDate) => electron.ipcRenderer.invoke("shift:work-rule", userId, workDate)
  },
  schedule: {
    list: (startDate, endDate, userId) => electron.ipcRenderer.invoke("schedule:list", startDate, endDate, userId),
    get: (id) => electron.ipcRenderer.invoke("schedule:get", id),
    create: (data) => electron.ipcRenderer.invoke("schedule:create", data),
    update: (id, data) => electron.ipcRenderer.invoke("schedule:update", { id, data }),
    delete: (id) => electron.ipcRenderer.invoke("schedule:delete", id)
  },
  attendance: {
    today: (userId, date) => electron.ipcRenderer.invoke("attendance:today", userId, date),
    range: (startDate, endDate, userId) => electron.ipcRenderer.invoke("attendance:range", startDate, endDate, userId),
    clock: (data) => electron.ipcRenderer.invoke("attendance:clock", data)
  },
  leaveApply: {
    list: (userId, status) => electron.ipcRenderer.invoke("leave:list", userId, status),
    create: (data) => electron.ipcRenderer.invoke("leave:create", data),
    approve: (id, approved, remark) => electron.ipcRenderer.invoke("leave:approve", { id, approved, remark })
  },
  // ── 物联网设备 ───────────────────────────────────────────────
  iot: {
    device: {
      list: () => electron.ipcRenderer.invoke("iot:device:list"),
      create: (data) => electron.ipcRenderer.invoke("iot:device:create", data),
      update: (id, data) => electron.ipcRenderer.invoke("iot:device:update", { id, data }),
      delete: (id) => electron.ipcRenderer.invoke("iot:device:delete", id)
    },
    data: {
      list: (deviceId, limit) => electron.ipcRenderer.invoke("iot:data:list", deviceId, limit),
      listByElderly: (elderlyId, limit) => electron.ipcRenderer.invoke("iot:data:list:elderly", elderlyId, limit)
    },
    alert: {
      list: (includeResolved) => electron.ipcRenderer.invoke("iot:alert:list", includeResolved),
      check: () => electron.ipcRenderer.invoke("iot:health:check"),
      create: (data) => electron.ipcRenderer.invoke("iot:alert:create", data),
      syncReminder: (alertId, userId) => electron.ipcRenderer.invoke("iot:alert:sync-reminder", { alertId, userId }),
      startRepair: (id) => electron.ipcRenderer.invoke("iot:alert:start-repair", id),
      resolve: (id) => electron.ipcRenderer.invoke("iot:alert:resolve", id)
    },
    report: (payload) => electron.ipcRenderer.invoke("iot:report", payload)
  },
  // ── 数据库文件路径配置 ─────────────────────────────────────────
  db: {
    getPath: () => electron.ipcRenderer.invoke("db:get-path"),
    setPath: (newPath) => electron.ipcRenderer.invoke("db:set-path", newPath),
    resetPath: () => electron.ipcRenderer.invoke("db:reset-path"),
    selectPath: () => electron.ipcRenderer.invoke("db:select-path")
  },
  // ── 应用级通用配置（自动刷新间隔等） ───────────────────────────
  config: {
    app: {
      get: () => electron.ipcRenderer.invoke("config:app:get"),
      set: (partial) => electron.ipcRenderer.invoke("config:app:set", partial)
    }
  }
};
electron.contextBridge.exposeInMainWorld("api", api);
