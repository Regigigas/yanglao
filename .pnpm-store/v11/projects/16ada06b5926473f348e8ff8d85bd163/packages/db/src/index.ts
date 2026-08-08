// packages/db/src/index.ts
// 数据库层入口（Electron 主进程专用）

import Database from 'better-sqlite3';
import type { Database as DatabaseInstance } from 'better-sqlite3';
import { runMigrations } from './migrations/index';
import { ChangeLogRepo } from './repositories/change-log.repo';
import { SyncConfigRepo } from './repositories/sync-config.repo';
import { ElderlyRepo } from './repositories/elderly.repo';
import { BuildingRepo } from './repositories/building.repo';
import { FamilyContactRepo } from './repositories/family-contact.repo';
import { HealthRepo } from './repositories/health.repo';
import { AdmissionRepo } from './repositories/admission.repo';
import { CareRepo } from './repositories/care.repo';
import { FeeRepo } from './repositories/fee.repo';
import { MealRepo } from './repositories/meal.repo';
import { ActivityRepo } from './repositories/activity.repo';
import { ContractRepo } from './repositories/contract.repo';
import { NotificationRepo } from './repositories/notification.repo';
import { UserRepo } from './repositories/user.repo';
import { AttendanceRepo } from './repositories/attendance.repo';
import { IotRepo } from './repositories/iot.repo';
import { PermissionGroupRepo } from './repositories/permission-group.repo';
import { TaskReminderRepo } from './repositories/task-reminder.repo';
import { AnnouncementRepo } from './repositories/announcement.repo';
import { OperationsRepo } from './repositories/operations.repo';
import { SupplierRepo } from './repositories/supplier.repo';
import { PurchaseOrderRepo } from './repositories/purchase-order.repo';
import { ChatRepo } from './repositories/chat.repo';

export * from './schema';
export * from './migrations/index';
export * from './backup-service';
export { ChangeLogRepo } from './repositories/change-log.repo';
export { SyncConfigRepo } from './repositories/sync-config.repo';
export { ElderlyRepo } from './repositories/elderly.repo';
export { BuildingRepo } from './repositories/building.repo';
export { FamilyContactRepo } from './repositories/family-contact.repo';
export { HealthRepo } from './repositories/health.repo';
export { AdmissionRepo } from './repositories/admission.repo';
export { CareRepo } from './repositories/care.repo';
export { FeeRepo } from './repositories/fee.repo';
export { MealRepo } from './repositories/meal.repo';
export { ActivityRepo } from './repositories/activity.repo';
export { ContractRepo } from './repositories/contract.repo';
export { NotificationRepo } from './repositories/notification.repo';
export { UserRepo } from './repositories/user.repo';
export { AttendanceRepo } from './repositories/attendance.repo';
export { IotRepo } from './repositories/iot.repo';
export { PermissionGroupRepo } from './repositories/permission-group.repo';
export { TaskReminderRepo } from './repositories/task-reminder.repo';
export { AnnouncementRepo } from './repositories/announcement.repo';
export { OperationsRepo } from './repositories/operations.repo';
export { SupplierRepo } from './repositories/supplier.repo';
export { PurchaseOrderRepo } from './repositories/purchase-order.repo';
export { ChatRepo } from './repositories/chat.repo';
export { hashPassword, verifyPassword } from './utils/password';

let _db: DatabaseInstance | null = null;

/**
 * 初始化数据库连接（幂等，重复调用返回同一实例）
 * @param dbPath 数据库文件路径（绝对路径）
 */
export function initDatabase(dbPath: string): DatabaseInstance {
  if (_db) return _db;

  _db = new Database(dbPath);

  // WAL 模式 + 外键约束 + 性能优化
  _db.pragma('journal_mode = WAL');
  _db.pragma('foreign_keys = ON');
  _db.pragma('synchronous = NORMAL');
  _db.pragma('cache_size = -32000'); // 32MB cache

  runMigrations(_db);

  console.info(`[DB] 已连接: ${dbPath}`);
  return _db;
}

/** 获取已初始化的数据库实例（未初始化则抛出错误） */
export function getDatabase(): DatabaseInstance {
  if (!_db) throw new Error('数据库未初始化，请先调用 initDatabase()');
  return _db;
}

/** 创建 Repositories 集合 */
export function createRepos(db: DatabaseInstance = getDatabase()) {
  return {
    changeLog: new ChangeLogRepo(db),
    syncConfig: new SyncConfigRepo(db),
    elderly: new ElderlyRepo(db),
    building: new BuildingRepo(db),
    familyContact: new FamilyContactRepo(db),
    health: new HealthRepo(db),
    admission: new AdmissionRepo(db),
    care: new CareRepo(db),
    fee: new FeeRepo(db),
    meal: new MealRepo(db),
    activity: new ActivityRepo(db),
    contract: new ContractRepo(db),
    notification: new NotificationRepo(db),
    user: new UserRepo(db),
    attendance: new AttendanceRepo(db),
    iot: new IotRepo(db),
    permissionGroup: new PermissionGroupRepo(db),
    taskReminder: new TaskReminderRepo(db),
    announcement: new AnnouncementRepo(db),
    operations: new OperationsRepo(db),
    supplier: new SupplierRepo(db),
    purchaseOrder: new PurchaseOrderRepo(db),
    chat: new ChatRepo(db),
  };
}

export type Repos = ReturnType<typeof createRepos>;
