import { mkdtempSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import Database from 'better-sqlite3';
import { afterEach, describe, expect, it } from 'vitest';
import { ChatRepo, runMigrations, UserRepo } from '@yanglao/db';
import { LanServer } from './lan-server';

const cleanup: Array<() => void> = [];

afterEach(() => {
  for (const dispose of cleanup.splice(0)) dispose();
});

async function jsonRequest(
  url: string,
  path: string,
  options: { method?: string; token?: string; secret?: string; body?: unknown } = {},
) {
  const response = await fetch(`${url}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...(options.secret ? { 'X-Secret': options.secret } : {}),
    },
    ...(options.body === undefined ? {} : { body: JSON.stringify(options.body) }),
  });
  return { status: response.status, data: await response.json() as Record<string, any> };
}

describe('LanServer 本地聊天', () => {
  it('通过局域网账号完成登录、私聊和消息发送，并校验访问密钥', async () => {
    const directory = mkdtempSync(join(tmpdir(), 'yanglao-lan-chat-'));
    const database = new Database(join(directory, 'test.db'));
    database.pragma('foreign_keys = ON');
    runMigrations(database);
    const users = new UserRepo(database);
    const peer = users.insertUser({
      username: 'nurse01',
      password: 'Nurse1234',
      real_name: '护理员一号',
      phone: null,
      role_id: 'role-admin',
      status: 'active',
      must_change_pw: 0,
      remark: null,
      position: '护士',
      department: '护理部',
    });
    database.prepare("UPDATE lan_config SET secret = 'lan-secret' WHERE id = 1").run();

    const server = new LanServer(database, undefined, new ChatRepo(database));
    await server.start(0);
    cleanup.push(() => server.stop());
    cleanup.push(() => database.close());
    cleanup.push(() => rmSync(directory, { recursive: true, force: true }));
    const baseUrl = `http://127.0.0.1:${server.getStatus().port}`;

    const rejected = await jsonRequest(baseUrl, '/system/chat/login', {
      method: 'POST',
      body: { username: 'admin', password: 'admin123' },
    });
    expect(rejected.status).toBe(401);

    const adminLogin = await jsonRequest(baseUrl, '/system/chat/login', {
      method: 'POST',
      secret: 'lan-secret',
      body: { username: 'admin', password: 'admin123' },
    });
    const peerLogin = await jsonRequest(baseUrl, '/system/chat/login', {
      method: 'POST',
      secret: 'lan-secret',
      body: { username: 'nurse01', password: 'Nurse1234' },
    });
    expect(adminLogin.data.code).toBe(200);
    expect(adminLogin.data.data.user.userId).toBe('user-admin');

    const adminToken = adminLogin.data.data.token as string;
    const peerToken = peerLogin.data.data.token as string;
    const direct = await jsonRequest(baseUrl, '/system/chat/conversations/direct', {
      method: 'POST',
      token: adminToken,
      secret: 'lan-secret',
      body: { peerUserId: peer.id },
    });
    const conversationId = direct.data.data as number;
    const sent = await jsonRequest(baseUrl, `/system/chat/conversations/${conversationId}/messages`, {
      method: 'POST',
      token: adminToken,
      secret: 'lan-secret',
      body: { clientMessageId: 'lan_message_001', messageType: 'text', content: '交接完成' },
    });
    expect(sent.data.data.content).toBe('交接完成');

    const received = await jsonRequest(
      baseUrl,
      `/system/chat/conversations/${conversationId}/messages?limit=20`,
      { token: peerToken, secret: 'lan-secret' },
    );
    expect(received.data.data).toHaveLength(1);
    expect(received.data.data[0].senderUserId).toBe('user-admin');
  });

  it('自动生成访问密钥、原子拒绝非法同步字段且场景接口不泄露床位隐私', async () => {
    const directory = mkdtempSync(join(tmpdir(), 'yanglao-lan-security-'));
    const database = new Database(join(directory, 'test.db'));
    database.pragma('foreign_keys = ON');
    runMigrations(database);
    database.prepare('UPDATE lan_config SET allow_write = 1, secret = NULL WHERE id = 1').run();

    const server = new LanServer(database, undefined, new ChatRepo(database));
    await server.start(0);
    cleanup.push(() => server.stop());
    cleanup.push(() => database.close());
    cleanup.push(() => rmSync(directory, { recursive: true, force: true }));
    const baseUrl = `http://127.0.0.1:${server.getStatus().port}`;
    const secret = server.getConfig().secret as string;
    expect(secret).toHaveLength(32);

    const ping = await jsonRequest(baseUrl, '/ping');
    expect(ping.status).toBe(200);

    const anonymousDownload = await jsonRequest(baseUrl, '/sync/download', {
      method: 'POST',
      body: { deviceId: 'test-device', lastSyncAt: 0 },
    });
    expect(anonymousDownload.status).toBe(401);

    const bearerDownload = await jsonRequest(baseUrl, '/sync/download', {
      method: 'POST',
      token: secret,
      body: { deviceId: 'test-device', lastSyncAt: Date.now() },
    });
    expect(bearerDownload.status).toBe(200);

    const upload = await jsonRequest(baseUrl, '/sync/upload', {
      method: 'POST',
      secret,
      body: {
        deviceId: 'test-device',
        changes: [
          {
            id: 'change-valid',
            tableName: 'building',
            recordId: 'building-rollback',
            operation: 'INSERT',
            payload: {
              id: 'building-rollback', name: '应回滚楼栋', floors: 1, remark: null,
              sort_order: 0, created_at: Date.now(), updated_at: Date.now(), deleted_at: null,
            },
          },
          {
            id: 'change-invalid',
            tableName: 'building',
            recordId: 'building-invalid',
            operation: 'INSERT',
            payload: { id: 'building-invalid', 'name) VALUES (1); --': '注入字段' },
          },
        ],
      },
    });
    expect(upload.status).toBe(500);
    expect(database.prepare('SELECT id FROM building WHERE id = ?').get('building-rollback')).toBeUndefined();

    const now = Date.now();
    database.prepare(
      `INSERT INTO building (id, name, floors, remark, sort_order, created_at, updated_at)
       VALUES ('building-scene', '护理楼', 1, '内部备注', 0, ?, ?)`,
    ).run(now, now);
    database.prepare(
      `INSERT INTO room
       (id, building_id, floor, room_no, room_type, capacity, price, status, remark, created_at, updated_at)
       VALUES ('room-scene', 'building-scene', 1, '101', 'single', 1, 0, 'occupied', '内部备注', ?, ?)`,
    ).run(now, now);
    database.prepare(
      `INSERT INTO bed
       (id, room_id, bed_no, status, elderly_id, remark, created_at, updated_at)
       VALUES ('bed-scene', 'room-scene', 'A', 'occupied', NULL, '隐私备注', ?, ?)`,
    ).run(now, now);
    const login = await jsonRequest(baseUrl, '/system/chat/login', {
      method: 'POST',
      secret,
      body: { username: 'admin', password: 'admin123' },
    });
    const scene = await jsonRequest(baseUrl, '/system/scene/buildings', {
      token: login.data.data.token,
      secret,
    });
    expect(scene.data.data.beds[0]).toEqual({
      id: 'bed-scene', room_id: 'room-scene', bed_no: 'A', status: 'occupied',
    });
    expect(scene.data.data.buildings[0]).not.toHaveProperty('remark');
  });
});
