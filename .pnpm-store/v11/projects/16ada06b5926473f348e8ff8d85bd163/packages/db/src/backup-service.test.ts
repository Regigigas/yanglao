import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import Database from 'better-sqlite3';
import { afterEach, describe, expect, it } from 'vitest';
import { applyPendingDatabaseRestore, DatabaseBackupService } from './backup-service';
import { runMigrations } from './migrations/index';

const temporaryDirectories: string[] = [];

function createDatabase(filePath: string): Database.Database {
  const database = new Database(filePath);
  database.pragma('journal_mode = WAL');
  database.pragma('foreign_keys = ON');
  runMigrations(database);
  return database;
}

function insertElderly(
  database: Database.Database,
  input: { id: string; name: string; photoPath?: string | null; updatedAt: number },
): void {
  database.prepare(
    `INSERT INTO elderly (id, name, photo_path, status, created_at, updated_at)
     VALUES (?, ?, ?, 'active', ?, ?)`,
  ).run(input.id, input.name, input.photoPath ?? null, input.updatedAt, input.updatedAt);
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe('DatabaseBackupService', () => {
  it('在启动时恢复受控备份并为自定义数据库创建恢复前安全备份', () => {
    const root = mkdtempSync(join(tmpdir(), 'yanglao-restore-'));
    temporaryDirectories.push(root);
    const targetPath = join(root, 'custom', 'active.db');
    const backupDirectory = join(root, 'backups');
    const importDirectory = join(root, 'imports');
    const pendingRestorePath = join(root, 'state', 'pending-restore.json');
    mkdirSync(join(root, 'custom'), { recursive: true });
    const target = createDatabase(targetPath);
    const now = Date.now();
    insertElderly(target, { id: 'restore-test', name: '备份中的姓名', updatedAt: now - 1000 });
    const service = new DatabaseBackupService(target, {
      dbPath: targetPath,
      backupDirectory,
      importDirectory,
    });
    const selectedBackup = service.createBackup();
    target.prepare('UPDATE elderly SET name = ?, updated_at = ? WHERE id = ?')
      .run('恢复前的当前姓名', now, 'restore-test');
    service.scheduleRestore(selectedBackup.name, pendingRestorePath);
    target.close();

    const result = applyPendingDatabaseRestore({
      dbPath: targetPath,
      backupDirectory,
      pendingRestorePath,
    });

    expect(result).toMatchObject({
      restored: true,
      name: selectedBackup.name,
      originalPreserved: true,
    });
    expect(result?.safetyBackup?.name).toMatch(/^yanglao-before-restore-.+\.db$/);
    expect(existsSync(pendingRestorePath)).toBe(false);
    expect(readdirSync(join(root, 'custom')).some((name) => name.startsWith('restore-'))).toBe(false);

    const restored = new Database(targetPath, { readonly: true });
    expect(restored.prepare('SELECT name FROM elderly WHERE id = ?').get('restore-test')).toEqual({
      name: '备份中的姓名',
    });
    restored.close();
    const safety = new Database(result!.safetyBackup!.path, { readonly: true });
    expect(safety.prepare('SELECT name FROM elderly WHERE id = ?').get('restore-test')).toEqual({
      name: '恢复前的当前姓名',
    });
    safety.close();
  });

  it('拒绝未来迁移的恢复请求且启动应用失败时保持原数据库', () => {
    const root = mkdtempSync(join(tmpdir(), 'yanglao-restore-future-'));
    temporaryDirectories.push(root);
    const targetPath = join(root, 'active.db');
    const backupDirectory = join(root, 'backups');
    const pendingRestorePath = join(root, 'pending-restore.json');
    const target = createDatabase(targetPath);
    insertElderly(target, { id: 'preserved', name: '原数据库', updatedAt: Date.now() });
    const service = new DatabaseBackupService(target, {
      dbPath: targetPath,
      backupDirectory,
      importDirectory: join(root, 'imports'),
    });
    const backup = service.createBackup();
    const future = new Database(backup.path);
    future.prepare("INSERT INTO _migrations (version, description, applied_at) VALUES (999, 'future', ?)")
      .run(Date.now());
    future.close();

    expect(() => service.scheduleRestore(backup.name, pendingRestorePath))
      .toThrow(/备份结构版本 999 高于当前支持版本/);
    expect(existsSync(pendingRestorePath)).toBe(false);

    writeFileSync(pendingRestorePath, JSON.stringify({
      name: backup.name,
      requestedAt: new Date().toISOString(),
    }));
    target.close();
    const result = applyPendingDatabaseRestore({
      dbPath: targetPath,
      backupDirectory,
      pendingRestorePath,
    });

    expect(result).toMatchObject({ restored: false, originalPreserved: true });
    expect(result?.error).toMatch(/备份结构版本 999 高于当前支持版本/);
    expect(existsSync(pendingRestorePath)).toBe(false);
    const preserved = new Database(targetPath, { readonly: true });
    expect(preserved.prepare('SELECT name FROM elderly WHERE id = ?').get('preserved')).toEqual({
      name: '原数据库',
    });
    preserved.close();
  });

  it('创建一致性备份并安全合并本地数据文件', async () => {
    const root = mkdtempSync(join(tmpdir(), 'yanglao-backup-'));
    temporaryDirectories.push(root);
    const targetPath = join(root, 'target.db');
    const sourcePath = join(root, 'source.db');
    const incompatiblePath = join(root, 'incompatible.db');
    const staleImportDirectory = join(root, 'imports');
    mkdirSync(staleImportDirectory);
    writeFileSync(join(staleImportDirectory, 'c0a80101-0000-4000-8000-000000000001.db'), 'stale');
    const target = createDatabase(targetPath);
    const now = Date.now();

    insertElderly(target, {
      id: 'elderly-shared',
      name: '本机旧姓名',
      photoPath: 'C:\\local\\shared-photo.jpg',
      updatedAt: now - 4000,
    });
    insertElderly(target, {
      id: 'elderly-local-newer',
      name: '初始姓名',
      updatedAt: now - 3000,
    });
    target.prepare("UPDATE sync_config SET server_url = 'http://local-sync' WHERE id = 1").run();
    target.prepare("UPDATE lan_config SET secret = 'local-secret' WHERE id = 1").run();

    const service = new DatabaseBackupService(target, {
      dbPath: targetPath,
      backupDirectory: join(root, 'backups'),
      importDirectory: staleImportDirectory,
    });
    expect(() => service.syncFromStagedFile(
      'c0a80101-0000-4000-8000-000000000001',
      'stale.db',
    )).toThrow(/不存在或已失效/);
    const manualBackup = service.createBackup();
    expect(service.listBackups()).toHaveLength(1);
    const backupDatabase = new Database(manualBackup.path, { readonly: true });
    expect(backupDatabase.prepare('SELECT name FROM elderly WHERE id = ?').get('elderly-shared')).toEqual({
      name: '本机旧姓名',
    });
    backupDatabase.close();

    copyFileSync(manualBackup.path, sourcePath);
    const source = new Database(sourcePath);
    source.prepare(
      'UPDATE elderly SET name = ?, photo_path = ?, updated_at = ? WHERE id = ?',
    ).run('外部较新姓名', 'D:\\external\\shared-photo.jpg', now - 1000, 'elderly-shared');
    source.prepare(
      'UPDATE elderly SET name = ?, updated_at = ? WHERE id = ?',
    ).run('外部较旧姓名', now - 2000, 'elderly-local-newer');
    insertElderly(source, {
      id: 'elderly-imported',
      name: '外部新增老人',
      photoPath: 'D:\\external\\new-photo.jpg',
      updatedAt: now - 500,
    });
    source.prepare(
      `INSERT INTO building
       (id, name, floors, remark, sort_order, created_at, updated_at, deleted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NULL)`,
    ).run('building-imported', '外部楼栋', 2, null, 0, now - 500, now - 500);
    source.prepare(
      `INSERT INTO room
       (id, building_id, floor, room_no, room_type, capacity, price, status, remark, created_at, updated_at, deleted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)`,
    ).run(
      'room-imported', 'building-imported', 1, '101', 'single', 1, 2800,
      'available', null, now - 500, now - 500,
    );
    source.prepare(
      `INSERT INTO bed
       (id, room_id, bed_no, status, elderly_id, remark, created_at, updated_at, deleted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL)`,
    ).run(
      'bed-imported', 'room-imported', 'A', 'available', null, null,
      now - 500, now - 500,
    );
    source.prepare("UPDATE sync_config SET server_url = 'http://external-sync' WHERE id = 1").run();
    source.prepare("UPDATE lan_config SET secret = 'external-secret' WHERE id = 1").run();
    source.prepare(
      `INSERT INTO sys_user
       (id, username, password_hash, password_salt, real_name, role_id, status,
        must_change_pw, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, 'active', 0, ?, ?)`,
    ).run(
      'external-user',
      'external',
      'external-hash',
      'external-salt',
      '外部账号',
      'role-admin',
      now,
      now,
    );
    source.close();

    target.prepare(
      'UPDATE elderly SET name = ?, updated_at = ? WHERE id = ?',
    ).run('本机最新姓名', now, 'elderly-local-newer');

    const staged = await service.stageLocalDataFile(sourcePath);
    const result = service.syncFromStagedFile(staged.importId, staged.fileName);
    expect(result.inserted).toBe(4);
    expect(result.updated).toBe(1);
    expect(result.safetyBackup.name).toMatch(/^yanglao-.+\.db$/);
    expect(service.listBackups()).toHaveLength(2);

    expect(target.prepare('SELECT name, photo_path FROM elderly WHERE id = ?').get('elderly-shared')).toEqual({
      name: '外部较新姓名',
      photo_path: 'C:\\local\\shared-photo.jpg',
    });
    expect(target.prepare('SELECT name FROM elderly WHERE id = ?').get('elderly-local-newer')).toEqual({
      name: '本机最新姓名',
    });
    expect(target.prepare('SELECT name, photo_path FROM elderly WHERE id = ?').get('elderly-imported')).toEqual({
      name: '外部新增老人',
      photo_path: null,
    });
    expect(target.prepare('SELECT room_id, bed_no FROM bed WHERE id = ?').get('bed-imported')).toEqual({
      room_id: 'room-imported',
      bed_no: 'A',
    });
    expect(target.prepare('SELECT server_url FROM sync_config WHERE id = 1').get()).toEqual({
      server_url: 'http://local-sync',
    });
    expect(target.prepare('SELECT secret FROM lan_config WHERE id = 1').get()).toEqual({
      secret: 'local-secret',
    });
    expect(target.prepare('SELECT id FROM sys_user WHERE id = ?').get('external-user')).toBeUndefined();
    expect(target.prepare(
      `SELECT table_name, record_id, operation FROM change_log
       WHERE synced = 0 ORDER BY created_at`,
    ).all()).toEqual(expect.arrayContaining([
      { table_name: 'elderly', record_id: 'elderly-shared', operation: 'UPDATE' },
      { table_name: 'elderly', record_id: 'elderly-imported', operation: 'INSERT' },
      { table_name: 'building', record_id: 'building-imported', operation: 'INSERT' },
      { table_name: 'room', record_id: 'room-imported', operation: 'INSERT' },
      { table_name: 'bed', record_id: 'bed-imported', operation: 'INSERT' },
    ]));
    expect(service.integrityCheck().ok).toBe(true);

    copyFileSync(sourcePath, incompatiblePath);
    const incompatible = new Database(incompatiblePath);
    incompatible.prepare(
      "INSERT INTO _migrations (version, description, applied_at) VALUES (999, 'future', ?)",
    ).run(Date.now());
    incompatible.close();
    const incompatibleStage = await service.stageLocalDataFile(incompatiblePath);
    expect(() => service.syncFromStagedFile(incompatibleStage.importId, incompatibleStage.fileName))
      .toThrow(/结构版本 999 高于当前支持版本/);
    expect(service.listBackups()).toHaveLength(2);

    target.close();
  });
});
