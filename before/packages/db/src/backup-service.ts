import { randomUUID } from 'crypto';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  renameSync,
  rmSync,
  statfsSync,
  statSync,
  writeFileSync,
} from 'fs';
import { basename, dirname, extname, resolve } from 'path';
import Database from 'better-sqlite3';
import type { Database as DatabaseInstance } from 'better-sqlite3';
import { migrations } from './migrations/index';

const MAX_IMPORT_FILE_SIZE = 2 * 1024 * 1024 * 1024;
const MAX_IMPORT_ROW_COUNT = 1_000_000;
const MAX_MANAGED_BACKUPS = 30;
const FUTURE_TIMESTAMP_TOLERANCE = 5 * 60 * 1000;
const BACKUP_FILE_PATTERN = /^yanglao-.+\.db$/;
const IMPORT_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const STAGED_IMPORT_FILE_PATTERN = /^[0-9a-f-]{36}\.db(?:-(?:wal|shm))?$/i;
const SQLITE_EXTENSIONS = new Set(['.db', '.sqlite', '.sqlite3']);

const EXCLUDED_TABLES = new Set([
  '_migrations',
  'change_log',
  'sync_config',
  'sync_history',
  'lan_config',
  'sys_role',
  'sys_user',
  'sys_permission_group',
  'chat_conversation',
  'chat_conversation_member',
  'chat_message',
  'chat_session_token',
]);

const REMOTE_SYNC_TABLES = new Set([
  'elderly',
  'family_contact',
  'health_profile',
  'vital_signs',
  'medication_order',
  'medication_record',
  'medical_visit',
  'admission',
  'leave_record',
  'discharge',
  'care_assessment',
  'care_plan',
  'care_record',
  'fee_item',
  'deposit_record',
  'monthly_bill',
  'bill_detail',
  'payment_record',
  'meal_menu',
  'meal_record',
  'nutrition_plan',
  'activity',
  'activity_attendance',
  'contract',
  'building',
  'room',
  'bed',
  'task_reminder',
  'iot_device_alert',
  'announcement',
]);

const LOCAL_ONLY_COLUMNS: Record<string, readonly string[]> = {
  elderly: ['photo_path'],
  contract: ['file_path'],
  health_exam_result: ['attachment_path'],
  elderly_document: ['file_path'],
};

const SPECIAL_FRESHNESS_COLUMNS: Record<string, readonly string[]> = {
  announcement_read: ['read_at'],
  health_alert: ['resolved_at', 'opened_at'],
  iot_device_alert: ['resolved_at', 'last_detected_at', 'opened_at'],
  notification: ['read_at', 'created_at'],
};

interface TableColumn {
  name: string;
  notnull: 0 | 1;
  dflt_value: string | null;
  pk: number;
}

interface MigrationRow {
  version: number;
  description: string;
}

export interface BackupInfo {
  name: string;
  path: string;
  size: number;
  createdAt: string;
}

export interface IntegrityResult {
  ok: boolean;
  messages: string[];
  checkedAt: string;
}

export interface StagedLocalDataFile {
  importId: string;
  fileName: string;
  size: number;
}

export interface LocalSyncTableResult {
  table: string;
  inserted: number;
  updated: number;
  skipped: number;
}

export interface LocalSyncResult {
  sourceName: string;
  inserted: number;
  updated: number;
  skipped: number;
  tables: LocalSyncTableResult[];
  safetyBackup: BackupInfo;
  synchronizedAt: string;
}

export interface DatabaseBackupServiceOptions {
  dbPath: string;
  backupDirectory: string;
  importDirectory: string;
}

export interface DatabaseRestoreResult {
  restored: boolean;
  name?: string;
  safetyBackup?: BackupInfo;
  originalPreserved?: boolean;
  error?: string;
}

export interface PendingDatabaseRestoreOptions {
  dbPath: string;
  backupDirectory: string;
  pendingRestorePath: string;
}

interface PendingDatabaseRestoreRequest {
  name: string;
  requestedAt: string;
}

function quoteIdentifier(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function sqlString(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

function valuesEqual(left: unknown, right: unknown): boolean {
  if (Buffer.isBuffer(left) && Buffer.isBuffer(right)) return left.equals(right);
  return Object.is(left, right);
}

function removeDatabaseFiles(filePath: string): void {
  for (const suffix of ['', '-wal', '-shm']) rmSync(`${filePath}${suffix}`, { force: true });
}

function controlledBackupPath(backupDirectory: string, name: string): string {
  if (typeof name !== 'string' || !BACKUP_FILE_PATTERN.test(name)) {
    throw new Error('备份文件名无效');
  }
  const directory = resolve(backupDirectory);
  const filePath = resolve(directory, name);
  if (dirname(filePath).toLowerCase() !== directory.toLowerCase() || !existsSync(filePath)) {
    throw new Error('备份文件不存在或不在程序受控目录');
  }
  const realDirectory = realpathSync(directory).toLowerCase();
  const realFilePath = realpathSync(filePath);
  if (dirname(realFilePath).toLowerCase() !== realDirectory || !statSync(realFilePath).isFile()) {
    throw new Error('备份文件不存在或不在程序受控目录');
  }
  return realFilePath;
}

function validateDatabaseForRestore(filePath: string): void {
  let database: DatabaseInstance | undefined;
  try {
    const stats = statSync(filePath);
    if (!stats.isFile() || stats.size < 100 || stats.size > MAX_IMPORT_FILE_SIZE) {
      throw new Error('备份文件大小无效或超过 2 GB 限制');
    }
    database = new Database(filePath, { readonly: true, fileMustExist: true, timeout: 5000 });
    const checkRows = database.pragma('quick_check') as Array<Record<string, unknown>>;
    const messages = checkRows.map((row) => String(row.quick_check ?? '未知错误'));
    if (messages.length !== 1 || messages[0] !== 'ok') {
      throw new Error(`数据库完整性检查失败：${messages.join('；')}`);
    }
    if (database.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = '_migrations'").get() === undefined) {
      throw new Error('备份不是养老管理系统数据库：缺少迁移记录');
    }

    const records = database
      .prepare('SELECT version, description FROM _migrations ORDER BY version')
      .all() as MigrationRow[];
    const supportedVersion = migrations.at(-1)?.version ?? 0;
    const backupVersion = records.at(-1)?.version;
    if (!Number.isInteger(backupVersion) || records.length === 0) {
      throw new Error('无法识别备份的结构版本');
    }
    if ((backupVersion ?? 0) > supportedVersion) {
      throw new Error(`备份结构版本 ${backupVersion} 高于当前支持版本 ${supportedVersion}`);
    }
    for (let index = 0; index < records.length; index += 1) {
      const record = records[index];
      const supported = migrations[index];
      if (!supported || record.version !== supported.version || record.description !== supported.description) {
        throw new Error(`备份迁移记录 v${record.version} 与当前应用不兼容`);
      }
    }
  } finally {
    database?.close();
  }
}

function snapshotDatabase(sourcePath: string, targetPath: string): void {
  let source: DatabaseInstance | undefined;
  try {
    source = new Database(sourcePath, { readonly: true, fileMustExist: true, timeout: 5000 });
    source.exec(`VACUUM INTO ${sqlString(targetPath)}`);
  } finally {
    source?.close();
  }
}

export function applyPendingDatabaseRestore(
  options: PendingDatabaseRestoreOptions,
): DatabaseRestoreResult | null {
  const pendingRestorePath = resolve(options.pendingRestorePath);
  if (!existsSync(pendingRestorePath)) return null;

  const dbPath = resolve(options.dbPath);
  const backupDirectory = resolve(options.backupDirectory);
  const databaseDirectory = dirname(dbPath);
  mkdirSync(databaseDirectory, { recursive: true });
  mkdirSync(backupDirectory, { recursive: true });
  const temporaryPath = resolve(databaseDirectory, `restore-${randomUUID()}.db`);
  const rollbackPath = resolve(databaseDirectory, `restore-rollback-${randomUUID()}.db`);
  let request: PendingDatabaseRestoreRequest | undefined;
  let currentMoved = false;
  let originalPreserved = existsSync(dbPath);
  let safetyBackup: BackupInfo | undefined;

  try {
    request = JSON.parse(readFileSync(pendingRestorePath, 'utf8')) as PendingDatabaseRestoreRequest;
    if (!request || typeof request.name !== 'string' || typeof request.requestedAt !== 'string') {
      throw new Error('数据库恢复请求无效');
    }
    const sourcePath = controlledBackupPath(backupDirectory, request.name);
    validateDatabaseForRestore(sourcePath);
    snapshotDatabase(sourcePath, temporaryPath);
    validateDatabaseForRestore(temporaryPath);

    if (existsSync(dbPath)) {
      const stamp = new Date().toISOString().replace(/[:.]/g, '-');
      const safetyName = `yanglao-before-restore-${stamp}-${randomUUID().slice(0, 8)}.db`;
      const safetyPath = resolve(backupDirectory, safetyName);
      snapshotDatabase(dbPath, safetyPath);
      validateDatabaseForRestore(safetyPath);
      const stats = statSync(safetyPath);
      safetyBackup = {
        name: safetyName,
        path: safetyPath,
        size: stats.size,
        createdAt: stats.mtime.toISOString(),
      };
      renameSync(dbPath, rollbackPath);
      currentMoved = true;
    }

    removeDatabaseFiles(dbPath);
    renameSync(temporaryPath, dbPath);
    validateDatabaseForRestore(dbPath);
    removeDatabaseFiles(rollbackPath);
    return { restored: true, name: request.name, safetyBackup, originalPreserved: true };
  } catch (error) {
    if (currentMoved && existsSync(rollbackPath)) {
      try {
        removeDatabaseFiles(dbPath);
        renameSync(rollbackPath, dbPath);
        validateDatabaseForRestore(dbPath);
        originalPreserved = true;
      } catch (rollbackError) {
        originalPreserved = false;
        const reason = rollbackError instanceof Error ? rollbackError.message : '未知错误';
        return {
          restored: false,
          name: request?.name,
          safetyBackup,
          originalPreserved,
          error: `数据库恢复失败，自动回滚也未完成：${reason}`,
        };
      }
    }
    return {
      restored: false,
      name: request?.name,
      safetyBackup,
      originalPreserved,
      error: error instanceof Error ? error.message : '数据库备份恢复失败',
    };
  } finally {
    removeDatabaseFiles(temporaryPath);
    if (!currentMoved || originalPreserved) removeDatabaseFiles(rollbackPath);
    rmSync(pendingRestorePath, { force: true });
  }
}

export class DatabaseBackupService {
  readonly backupDirectory: string;
  readonly importDirectory: string;
  private readonly dbPath: string;

  constructor(
    private readonly db: DatabaseInstance,
    options: DatabaseBackupServiceOptions,
  ) {
    this.dbPath = resolve(options.dbPath);
    this.backupDirectory = resolve(options.backupDirectory);
    this.importDirectory = resolve(options.importDirectory);
    mkdirSync(this.backupDirectory, { recursive: true });
    mkdirSync(this.importDirectory, { recursive: true });
    this.clearStagedImports();
  }

  createBackup(): BackupInfo {
    this.assertBackupDiskSpace();
    this.db.pragma('wal_checkpoint(FULL)');
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const name = `yanglao-${stamp}-${randomUUID().slice(0, 8)}.db`;
    const backupPath = resolve(this.backupDirectory, name);
    this.db.exec(`VACUUM INTO ${sqlString(backupPath)}`);
    const result = this.backupInfo(name);
    this.pruneBackups();
    return result;
  }

  listBackups(): BackupInfo[] {
    return readdirSync(this.backupDirectory)
      .filter((name) => BACKUP_FILE_PATTERN.test(name))
      .map((name) => this.backupInfo(name))
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  }

  getBackupPath(name: string): string {
    return controlledBackupPath(this.backupDirectory, name);
  }

  scheduleRestore(name: string, pendingRestorePath: string): { scheduled: true } {
    const sourcePath = this.getBackupPath(name);
    validateDatabaseForRestore(sourcePath);
    const requestPath = resolve(pendingRestorePath);
    mkdirSync(dirname(requestPath), { recursive: true });
    const request: PendingDatabaseRestoreRequest = { name, requestedAt: new Date().toISOString() };
    writeFileSync(requestPath, JSON.stringify(request), { encoding: 'utf8', mode: 0o600 });
    return { scheduled: true };
  }

  integrityCheck(): IntegrityResult {
    const rows = this.db.pragma('integrity_check') as Array<Record<string, unknown>>;
    const messages = rows.map((row) => String(row.integrity_check ?? '未知检查结果'));
    return {
      ok: messages.length === 1 && messages[0] === 'ok',
      messages,
      checkedAt: new Date().toISOString(),
    };
  }

  async stageLocalDataFile(sourcePath: string): Promise<StagedLocalDataFile> {
    const resolvedSource = resolve(sourcePath);
    if (!SQLITE_EXTENSIONS.has(extname(resolvedSource).toLowerCase())) {
      throw new Error('只支持 .db、.sqlite 或 .sqlite3 数据文件');
    }
    if (resolvedSource.toLowerCase() === this.dbPath.toLowerCase()) {
      throw new Error('不能同步当前正在使用的数据库文件');
    }
    if (!existsSync(resolvedSource)) throw new Error('所选数据文件不存在');

    const sourceStats = statSync(resolvedSource);
    if (!sourceStats.isFile() || sourceStats.size < 100 || sourceStats.size > MAX_IMPORT_FILE_SIZE) {
      throw new Error('数据文件大小无效或超过 2 GB 限制');
    }

    this.assertAvailableDiskSpace(resolvedSource, sourceStats.size);
    const importId = randomUUID();
    const stagedPath = this.stagedImportPath(importId);
    let source: DatabaseInstance | undefined;
    try {
      source = new Database(resolvedSource, { readonly: true, fileMustExist: true, timeout: 5000 });
      await source.backup(stagedPath);
      return {
        importId,
        fileName: this.safeSourceName(basename(resolvedSource)),
        size: statSync(stagedPath).size,
      };
    } catch (error) {
      this.discardStagedImport(stagedPath);
      throw error;
    } finally {
      source?.close();
    }
  }

  syncFromStagedFile(importId: string, requestedSourceName: string): LocalSyncResult {
    const importPath = this.stagedImportPath(importId);
    const sourceName = this.safeSourceName(requestedSourceName);
    let imported: DatabaseInstance | undefined;
    try {
      if (!existsSync(importPath)) throw new Error('待同步的数据文件不存在或已失效，请重新选择');
      const size = statSync(importPath).size;
      if (size < 100 || size > MAX_IMPORT_FILE_SIZE) throw new Error('数据文件大小无效或超过 2 GB 限制');

      imported = new Database(importPath, { readonly: true, fileMustExist: true, timeout: 5000 });
      this.validateImportedDatabase(imported);
      const safetyBackup = this.createBackup();
      const merged = this.mergeImportedDatabase(imported, sourceName);
      return {
        sourceName,
        ...merged,
        safetyBackup,
        synchronizedAt: new Date().toISOString(),
      };
    } finally {
      try {
        imported?.close();
      } finally {
        this.discardStagedImport(importPath);
      }
    }
  }

  private backupInfo(name: string): BackupInfo {
    const backupPath = this.getBackupPathUnchecked(name);
    const stats = statSync(backupPath);
    return {
      name,
      path: backupPath,
      size: stats.size,
      createdAt: stats.mtime.toISOString(),
    };
  }

  private getBackupPathUnchecked(name: string): string {
    return resolve(this.backupDirectory, name);
  }

  private assertAvailableDiskSpace(sourcePath: string, sourceSize: number): void {
    const walSize = existsSync(`${sourcePath}-wal`) ? statSync(`${sourcePath}-wal`).size : 0;
    const currentSize = existsSync(this.dbPath) ? statSync(this.dbPath).size : 0;
    const disk = statfsSync(this.importDirectory);
    const available = Number(disk.bavail) * Number(disk.bsize);
    const required = (sourceSize + walSize) * 3 + currentSize * 2 + 256 * 1024 * 1024;
    if (available < required) {
      throw new Error('本机可用磁盘空间不足，无法创建同步快照和安全备份');
    }
  }

  private validateImportedDatabase(imported: DatabaseInstance): void {
    const checkRows = imported.pragma('quick_check') as Array<Record<string, unknown>>;
    const checkMessages = checkRows.map((row) => String(row.quick_check ?? '未知错误'));
    if (checkMessages.length !== 1 || checkMessages[0] !== 'ok') {
      throw new Error(`数据文件完整性检查失败：${checkMessages.join('；')}`);
    }
    if (!this.tableExists(imported, '_migrations')) {
      throw new Error('所选文件不是养老管理系统数据库：缺少迁移记录');
    }

    const importedMigrations = imported
      .prepare('SELECT version, description FROM _migrations ORDER BY version')
      .all() as MigrationRow[];
    const localMigrationMap = new Map(migrations.map((row) => [row.version, row.description]));
    const importedVersion = importedMigrations.at(-1)?.version;
    const localVersion = migrations.at(-1)?.version;
    if (!Number.isInteger(importedVersion) || !Number.isInteger(localVersion)) {
      throw new Error('无法识别数据文件的结构版本');
    }
    if ((importedVersion ?? 0) > (localVersion ?? 0)) {
      throw new Error(`数据文件结构版本 ${importedVersion} 高于当前支持版本 ${localVersion}`);
    }
    for (const migration of importedMigrations) {
      if (localMigrationMap.get(migration.version) !== migration.description) {
        throw new Error(`数据文件迁移记录 v${migration.version} 与当前应用不兼容`);
      }
    }

    let totalRows = 0;
    for (const table of this.importableTables(imported)) {
      const row = imported
        .prepare(`SELECT COUNT(*) AS count FROM ${quoteIdentifier(table)}`)
        .get() as { count: number };
      totalRows += row.count;
      if (totalRows > MAX_IMPORT_ROW_COUNT) {
        throw new Error(`数据文件记录数超过 ${MAX_IMPORT_ROW_COUNT} 条限制`);
      }
    }
  }

  private mergeImportedDatabase(
    imported: DatabaseInstance,
    sourceName: string,
  ): Pick<LocalSyncResult, 'inserted' | 'updated' | 'skipped' | 'tables'> {
    let inserted = 0;
    let updated = 0;
    let skipped = 0;
    const tables: LocalSyncTableResult[] = [];
    const importStartedAt = Date.now();

    const mergeAll = this.db.transaction(() => {
      // 通用合并不保证父子表顺序，统一在事务提交时检查外键。
      this.db.pragma('defer_foreign_keys = ON');
      for (const table of this.importableTables(imported)) {
        const result = this.mergeTable(imported, table, importStartedAt);
        if (result.inserted + result.updated + result.skipped > 0) tables.push(result);
        inserted += result.inserted;
        updated += result.updated;
        skipped += result.skipped;
      }

      if (this.tableExists(this.db, 'operations_audit_log')) {
        this.db.prepare(
          `INSERT INTO operations_audit_log (id, domain, record_id, action, detail, created_at)
           VALUES (?, 'system', ?, 'local_sync', ?, ?)`,
        ).run(
          randomUUID(),
          randomUUID(),
          `${sourceName}；新增 ${inserted}；更新 ${updated}；跳过 ${skipped}`,
          Date.now(),
        );
      }
    });
    mergeAll();
    return { inserted, updated, skipped, tables };
  }

  private mergeTable(
    imported: DatabaseInstance,
    table: string,
    importStartedAt: number,
  ): LocalSyncTableResult {
    const localColumns = this.tableColumns(this.db, table);
    const importedColumns = new Set(this.tableColumns(imported, table).map((column) => column.name));
    const primaryKeys = localColumns
      .filter((column) => column.pk > 0)
      .sort((left, right) => left.pk - right.pk)
      .map((column) => column.name);
    if (primaryKeys.length === 0 || primaryKeys.some((column) => !importedColumns.has(column))) {
      throw new Error(`数据表 ${table} 缺少可识别的主键`);
    }

    const commonColumns = localColumns
      .map((column) => column.name)
      .filter((column) => importedColumns.has(column));
    const missingRequired = localColumns.filter(
      (column) => !importedColumns.has(column.name) && column.notnull === 1 && column.dflt_value === null && column.pk === 0,
    );
    if (missingRequired.length > 0) {
      throw new Error(`数据表 ${table} 缺少必要字段 ${missingRequired.map((column) => column.name).join('、')}`);
    }

    const selectImported = imported.prepare(
      `SELECT ${commonColumns.map(quoteIdentifier).join(', ')} FROM ${quoteIdentifier(table)}`,
    );
    const wherePrimaryKey = primaryKeys.map((column) => `${quoteIdentifier(column)} = ?`).join(' AND ');
    const selectLocal = this.db.prepare(
      `SELECT * FROM ${quoteIdentifier(table)} WHERE ${wherePrimaryKey}`,
    );
    const insertRow = this.db.prepare(
      `INSERT INTO ${quoteIdentifier(table)} (${commonColumns.map(quoteIdentifier).join(', ')})
       VALUES (${commonColumns.map(() => '?').join(', ')})`,
    );
    const updateColumns = commonColumns.filter((column) => !primaryKeys.includes(column));
    const updateRow = updateColumns.length > 0
      ? this.db.prepare(
        `UPDATE ${quoteIdentifier(table)}
         SET ${updateColumns.map((column) => `${quoteIdentifier(column)} = ?`).join(', ')}
         WHERE ${wherePrimaryKey}`,
      )
      : null;

    let inserted = 0;
    let updated = 0;
    let skipped = 0;
    for (const rawRow of selectImported.iterate() as Iterable<Record<string, unknown>>) {
      const row = { ...rawRow };
      const keyValues = primaryKeys.map((column) => row[column]);
      if (keyValues.some((value) => value === null || value === undefined || value === '')) {
        throw new Error(`数据表 ${table} 包含无效主键`);
      }
      const local = selectLocal.get(...keyValues) as Record<string, unknown> | undefined;
      for (const column of LOCAL_ONLY_COLUMNS[table] ?? []) {
        if (commonColumns.includes(column)) row[column] = local?.[column] ?? null;
      }

      if (!local) {
        insertRow.run(...commonColumns.map((column) => row[column]));
        this.enqueueRemoteSync(table, keyValues, row, 'INSERT');
        inserted += 1;
        continue;
      }

      if (commonColumns.every((column) => valuesEqual(local[column], row[column]))) {
        skipped += 1;
        continue;
      }
      if (!this.importedRowIsNewer(table, commonColumns, row, local, importStartedAt)) {
        skipped += 1;
        continue;
      }
      if (!updateRow) {
        skipped += 1;
        continue;
      }

      updateRow.run(
        ...updateColumns.map((column) => row[column]),
        ...keyValues,
      );
      this.enqueueRemoteSync(table, keyValues, row, 'UPDATE');
      updated += 1;
    }
    return { table, inserted, updated, skipped };
  }

  private importedRowIsNewer(
    table: string,
    commonColumns: string[],
    imported: Record<string, unknown>,
    local: Record<string, unknown>,
    importStartedAt: number,
  ): boolean {
    const freshnessColumns = commonColumns.includes('updated_at')
      ? ['updated_at']
      : (SPECIAL_FRESHNESS_COLUMNS[table] ?? []).filter((column) => commonColumns.includes(column));
    if (freshnessColumns.length === 0) return false;

    const importedAt = this.latestTimestamp(imported, freshnessColumns);
    const localAt = this.latestTimestamp(local, freshnessColumns);
    if (!Number.isFinite(importedAt)) throw new Error(`数据表 ${table} 包含无效更新时间`);
    if (importedAt > importStartedAt + FUTURE_TIMESTAMP_TOLERANCE) {
      throw new Error(`数据表 ${table} 包含超出本机时间的记录`);
    }
    return importedAt > localAt;
  }

  private latestTimestamp(row: Record<string, unknown>, columns: readonly string[]): number {
    let result = Number.NEGATIVE_INFINITY;
    for (const column of columns) {
      const value = row[column];
      if (value === null || value === undefined) continue;
      if (typeof value !== 'number' || !Number.isFinite(value)) return Number.NaN;
      result = Math.max(result, value);
    }
    return result;
  }

  private importableTables(imported: DatabaseInstance): string[] {
    const importedTables = new Set(
      (imported.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all() as Array<{ name: string }>)
        .map((row) => row.name),
    );
    return (this.db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name").all() as Array<{ name: string }>)
      .map((row) => row.name)
      .filter((name) => !name.startsWith('sqlite_') && !EXCLUDED_TABLES.has(name) && importedTables.has(name));
  }

  private tableColumns(database: DatabaseInstance, table: string): TableColumn[] {
    return database.prepare(`PRAGMA table_info(${quoteIdentifier(table)})`).all() as TableColumn[];
  }

  private tableExists(database: DatabaseInstance, table: string): boolean {
    return database
      .prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?")
      .get(table) !== undefined;
  }

  private stagedImportPath(importId: string): string {
    if (!IMPORT_ID_PATTERN.test(importId)) throw new Error('本地同步请求标识无效');
    return resolve(this.importDirectory, `${importId}.db`);
  }

  private discardStagedImport(importPath: string): void {
    for (const suffix of ['', '-wal', '-shm']) rmSync(`${importPath}${suffix}`, { force: true });
  }

  private clearStagedImports(): void {
    for (const name of readdirSync(this.importDirectory)) {
      if (STAGED_IMPORT_FILE_PATTERN.test(name)) {
        rmSync(resolve(this.importDirectory, name), { force: true });
      }
    }
  }

  private pruneBackups(): void {
    for (const backup of this.listBackups().slice(MAX_MANAGED_BACKUPS)) {
      rmSync(backup.path, { force: true });
    }
  }

  private assertBackupDiskSpace(): void {
    const currentSize = existsSync(this.dbPath) ? statSync(this.dbPath).size : 0;
    const disk = statfsSync(this.backupDirectory);
    const available = Number(disk.bavail) * Number(disk.bsize);
    const required = currentSize * 2 + 128 * 1024 * 1024;
    if (available < required) throw new Error('本机可用磁盘空间不足，无法创建数据库备份');
  }

  private enqueueRemoteSync(
    table: string,
    keyValues: unknown[],
    row: Record<string, unknown>,
    operation: 'INSERT' | 'UPDATE',
  ): void {
    if (!REMOTE_SYNC_TABLES.has(table) || !this.tableExists(this.db, 'change_log')) return;
    const recordId = keyValues.map((value) => String(value)).join(':');
    if (!recordId || recordId.length > 64) return;
    const payload = { ...row };
    for (const column of LOCAL_ONLY_COLUMNS[table] ?? []) delete payload[column];
    this.db.prepare(
      `INSERT INTO change_log
       (id, table_name, record_id, operation, payload, created_at, synced)
       VALUES (?, ?, ?, ?, ?, ?, 0)`,
    ).run(randomUUID(), table, recordId, operation, JSON.stringify(payload), Date.now());
  }

  private safeSourceName(value: string): string {
    const normalized = typeof value === 'string'
      ? value.replace(/[\u0000-\u001f\u007f]/g, '').trim()
      : '';
    return normalized.slice(0, 200) || '本地 SQLite 数据文件';
  }
}
