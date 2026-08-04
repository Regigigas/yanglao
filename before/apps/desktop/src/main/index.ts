// apps/desktop/src/main/index.ts
// Electron 主进程入口

import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import { initDatabase, createRepos } from '@yanglao/db';
import { SyncEngine } from '@yanglao/sync';
import { SyncScheduler } from '@yanglao/sync';
import { registerSyncHandlers } from './ipc/sync.handler';
import { applyRemoteChanges } from './remote-change-applier';
import { registerElderlyHandlers } from './ipc/elderly.handler';
import { registerConfigHandlers } from './ipc/config.handler';
import { registerBuildingHandlers } from './ipc/building.handler';
import { registerFamilyContactHandlers } from './ipc/family-contact.handler';
import { registerHealthHandlers } from './ipc/health.handler';
import { registerAdmissionHandlers } from './ipc/admission.handler';
import { registerCareHandlers } from './ipc/care.handler';
import { registerFeeHandlers } from './ipc/fee.handler';
import { registerMealHandlers } from './ipc/meal.handler';
import { registerActivityHandlers } from './ipc/activity.handler';
import { registerContractHandlers } from './ipc/contract.handler';
import { registerNotificationHandlers } from './ipc/notification.handler';
import { registerLanHandlers } from './ipc/lan.handler';
import { registerAuthHandlers } from './ipc/auth.handler';
import { registerUserHandlers } from './ipc/user.handler';
import { registerAttendanceHandlers } from './ipc/attendance.handler';
import { registerIotHandlers, syncAlertToReminder } from './ipc/iot.handler';
import { registerPermissionGroupHandlers } from './ipc/permission-group.handler';
import {
  registerTaskReminderHandlers,
  scanDueReminders,
} from './ipc/task-reminder.handler';
import { registerAnnouncementHandlers } from './ipc/announcement.handler';
import { registerOperationsHandlers } from './ipc/operations.handler';
import { registerPurchaseHandlers } from './ipc/purchase.handler';
import { registerDbHandlers, readAppConfig } from './ipc/db.handler';
import { session as authSession } from './ipc/auth.handler';
import { LanServer } from './lan-server';
import { nanoid } from 'nanoid';
import cron from 'node-cron';
import { Notification } from 'electron';

// Chromium 缓存与业务数据隔离，避免旧缓存锁影响应用启动。
app.setPath('sessionData', join(app.getPath('userData'), 'session-data'));
const gotSingleInstanceLock = app.requestSingleInstanceLock();
if (!gotSingleInstanceLock) app.quit();

// ── 日志配置 ──────────────────────────────────────────────────
log.transports.file.level = 'info';
log.transports.console.level = is.dev ? 'debug' : 'warn';
autoUpdater.logger = log;

// ── 数据库初始化 ──────────────────────────────────────────────
// 支持通过 yanglao-app-config.json 配置自定义数据库文件路径
const defaultDbPath = join(app.getPath('userData'), 'yanglao.db');
const appConfigPath = join(app.getPath('userData'), 'yanglao-app-config.json');
const appConfig = readAppConfig(appConfigPath);
const dbPath = appConfig.dbPath || defaultDbPath;
const db = initDatabase(dbPath);
const repos = createRepos(db);

// 设备 ID
const deviceId = process.env['YANGLAO_DEVICE_ID'] || nanoid();

// ── 同步引擎 ──────────────────────────────────────────────────
const syncEngine = new SyncEngine(
  (limit) => repos.changeLog.getUnsynced(limit),
  (ids) => repos.changeLog.markSynced(ids),
  (status, msg, syncedAt, syncCursor) => repos.syncConfig.updateLastSync(status, msg, syncedAt, syncCursor),
  (result) => {
    db.prepare(
      `INSERT INTO sync_history (id, trigger, status, direction, started_at, finished_at, duration_ms, records_sent, records_recv, error_msg)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      nanoid(),
      result.trigger,
      result.status,
      result.direction,
      Date.now() - result.durationMs,
      Date.now(),
      result.durationMs,
      result.recordsSent,
      result.recordsReceived,
      result.error ?? null,
    );
  },
  deviceId,
  (changes) => applyRemoteChanges(db, changes),
);

const scheduler = new SyncScheduler(syncEngine);
const savedConfig = repos.syncConfig.toSyncConfig(repos.syncConfig.get());
scheduler.applyConfig(savedConfig);

// ── 局域网主机服务 ─────────────────────────────────────────────
// 传入 iot repo，使局域网 HTTP 服务器能接收 WiFi 设备的 /iot/report 数据上报
const lanServer = new LanServer(db, repos.iot);

// ── 窗口创建 ──────────────────────────────────────────────────
let mainWindow: BrowserWindow | null = null;

if (gotSingleInstanceLock) {
  app.on('second-instance', () => {
    if (!mainWindow) return;
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  });
}

function createWindow(): void {
  const iconExtension = process.platform === 'win32' ? 'ico' : 'png';
  const iconPath = is.dev
    ? join(__dirname, `../../resources/icon.${iconExtension}`)
    : join(process.resourcesPath, `icon.${iconExtension}`);

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 600,
    show: false,
    icon: iconPath,
    autoHideMenuBar: true,
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow!.show();
    // 启动时生成生日提醒
    try {
      repos.notification.generateBirthdayReminders(db);
      repos.iot.checkHealth();
    } catch {}
    // 若已配置启用主机模式，则自动启动
    try {
      const lanCfg = lanServer.getConfig();
      if (lanCfg.enabled) {
        lanServer
          .start()
          .catch((err) => log.error('[LAN Server] 自动启动失败:', err));
      }
    } catch {}
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }

  scheduler.on((event) => {
    mainWindow?.webContents.send('sync:event', event);
  });
}

// ── 注册所有 IPC 处理器 ──────────────────────────────────────
registerSyncHandlers(ipcMain, scheduler, repos.syncConfig);
registerElderlyHandlers(ipcMain, repos.elderly);
registerConfigHandlers(ipcMain, repos.syncConfig, scheduler);
registerBuildingHandlers(ipcMain, repos.building);
registerFamilyContactHandlers(ipcMain, repos.familyContact);
registerHealthHandlers(ipcMain, repos.health);
registerAdmissionHandlers(ipcMain, repos.admission);
registerCareHandlers(ipcMain, repos.care);
registerFeeHandlers(ipcMain, repos.fee);
registerMealHandlers(ipcMain, repos.meal);
registerActivityHandlers(ipcMain, repos.activity);
registerContractHandlers(ipcMain, repos.contract);
registerNotificationHandlers(ipcMain, repos.notification);
registerLanHandlers(ipcMain, lanServer);
registerAuthHandlers(ipcMain, repos.user);
registerUserHandlers(ipcMain, repos.user);
registerAttendanceHandlers(ipcMain, repos.attendance);
registerIotHandlers(ipcMain, repos.iot, repos.taskReminder);
registerPermissionGroupHandlers(ipcMain, repos.permissionGroup);
registerTaskReminderHandlers(ipcMain, repos.taskReminder);
registerAnnouncementHandlers(ipcMain, repos.announcement);
registerOperationsHandlers(ipcMain, repos.operations);
registerPurchaseHandlers(ipcMain, repos.supplier, repos.purchaseOrder);
registerDbHandlers(ipcMain, defaultDbPath, appConfigPath, () => mainWindow);

// ── 任务提醒：每分钟扫描当前登录用户到期的提醒（闹钟式提醒） ─────────
cron.schedule('* * * * *', () => {
  try {
    const currentUser = authSession.user;
    if (!currentUser) return; // 未登录时不扫描，避免误标记他人提醒的触发状态
    const due = scanDueReminders(repos.taskReminder, currentUser.id);
    for (const reminder of due) {
      // 系统原生通知：即使应用被最小化/切到后台也能收到
      if (Notification.isSupported()) {
        new Notification({
          title: `任务提醒：${reminder.title}`,
          body: reminder.description || '到时间了，请及时处理',
        }).show();
      }
      // 应用内事件：由渲染进程弹窗 + 播放提示音
      mainWindow?.webContents.send('reminder:alarm', reminder);
    }
  } catch (err) {
    log.error('[TaskReminder] 扫描到期提醒失败:', err);
  }
});

// 每分钟按设备实时上报和离线状态巡检。仅在首次发现异常时写入通知，避免重复打扰。
cron.schedule('* * * * *', () => {
  try {
    const { opened } = repos.iot.checkHealth();
    for (const alert of opened) {
      const currentUser = authSession.user;
      if (currentUser) {
        syncAlertToReminder(repos.iot, repos.taskReminder, alert.id, currentUser.id);
      }
      repos.notification.insert({
        type: 'system',
        title: `维修提醒：${alert.title}`,
        content: alert.content,
        elderly_id: null,
        is_read: 0,
        read_at: null,
      });
      if (Notification.isSupported()) {
        new Notification({ title: `维修提醒：${alert.title}`, body: alert.content }).show();
      }
    }
  } catch (err) {
    log.error('[IotHealth] 设备巡检失败:', err);
  }
});

// ── 应用生命周期 ─────────────────────────────────────────────
app.whenReady().then(() => {
  if (!gotSingleInstanceLock) return;
  electronApp.setAppUserModelId('com.yanglao.desktop');

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  scheduler.stopAll();
  db.close();
  if (process.platform !== 'darwin') app.quit();
});

// 自动更新：仅当打包时配置了 publish 更新源才启用，避免未配置更新服务器时报错
if (!is.dev) {
  try {
    autoUpdater.checkForUpdatesAndNotify().catch((err) => {
      log.warn(
        '[Updater] 检查更新失败（可忽略，不影响正常使用）:',
        err?.message ?? err,
      );
    });
  } catch (err) {
    log.warn('[Updater] 未配置更新源，跳过自动更新检查');
  }
}
