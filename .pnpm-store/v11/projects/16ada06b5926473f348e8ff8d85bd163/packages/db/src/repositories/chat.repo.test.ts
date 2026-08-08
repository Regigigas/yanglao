import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { runMigrations } from '../migrations/index';
import { hashPassword } from '../utils/password';
import { ChatRepo } from './chat.repo';

let db: Database.Database;
let chat: ChatRepo;

function addUser(id: string, username: string, menuKeys: string[], status = 'active'): void {
  const now = Date.now();
  const roleId = `role-${id}`;
  const { salt, hash } = hashPassword('password123');
  db.prepare(
    `INSERT INTO sys_role
       (id, name, code, menu_keys, button_keys, is_system, created_at, updated_at)
     VALUES (?, ?, ?, ?, '[]', 0, ?, ?)`,
  ).run(roleId, username, roleId, JSON.stringify(menuKeys), now, now);
  db.prepare(
    `INSERT INTO sys_user
       (id, username, password_hash, password_salt, real_name, role_id, status,
        must_change_pw, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`,
  ).run(id, username, hash, salt, username.toUpperCase(), roleId, status, now, now);
}

beforeEach(() => {
  db = new Database(':memory:');
  db.pragma('foreign_keys = ON');
  runMigrations(db);
  chat = new ChatRepo(db);
});

afterEach(() => db.close());

describe('ChatRepo', () => {
  it('拒绝无权限及停用账号，固定 admin 保持可用', () => {
    addUser('without-chat', 'withoutchat', []);
    addUser('disabled-chat', 'disabledchat', ['chat'], 'disabled');

    expect(() => chat.login('withoutchat', 'password123')).toThrow(/无聊天权限/);
    expect(() => chat.login('disabledchat', 'password123')).toThrow();
    const admin = chat.login('admin', 'admin123');
    expect(admin.userId).toBe('user-admin');
    expect(admin.mode).toBe('local');
  });

  it('发放持久化哈希令牌并支持鉴权和注销', () => {
    addUser('alice', 'alice', ['chat']);
    const login = chat.login('alice', 'password123');
    const stored = db.prepare(
      `SELECT token_hash, expires_at FROM chat_session_token WHERE user_id = ?`,
    ).get('alice') as { token_hash: string; expires_at: number };

    expect(stored.token_hash).not.toBe(login.token);
    expect(stored.token_hash).toMatch(/^[a-f0-9]{64}$/);
    expect(stored.expires_at - Date.now()).toBeGreaterThan(29 * 24 * 60 * 60 * 1000);
    expect(chat.me(login.token)).toMatchObject({ userId: 'alice', userName: 'alice' });
    chat.logout(login.token);
    expect(() => chat.authenticate(login.token)).toThrow(/失效/);
  });

  it('复用私聊并按发送方客户端标识幂等发送', () => {
    addUser('alice', 'alice', ['chat']);
    addUser('bob', 'bob', ['chat']);
    const alice = chat.login('alice', 'password123').token;
    const bob = chat.login('bob', 'password123').token;

    const firstConversation = chat.createDirect(alice, 'bob');
    expect(chat.createDirect(bob, 'alice')).toBe(firstConversation);
    const first = chat.send(alice, {
      conversationId: firstConversation,
      clientMessageId: 'message_0001',
      content: '  hello  ',
    });
    const duplicate = chat.send(alice, {
      conversationId: firstConversation,
      clientMessageId: 'message_0001',
      content: 'different content',
    });

    expect(duplicate.messageId).toBe(first.messageId);
    expect(duplicate.content).toBe('hello');
    expect(chat.messages(bob, { conversationId: firstConversation })).toHaveLength(1);
  });

  it('隔离群聊非成员并仅允许有权限成员加入', () => {
    addUser('alice', 'alice', ['chat']);
    addUser('bob', 'bob', ['chat']);
    addUser('carol', 'carol', ['chat']);
    addUser('outsider', 'outsider', ['chat']);
    addUser('forbidden', 'forbidden', []);
    const alice = chat.login('alice', 'password123').token;
    const outsider = chat.login('outsider', 'password123').token;
    const groupId = chat.createGroup(alice, { name: 'Care Team', memberUserIds: ['bob', 'carol'] });

    expect(() => chat.messages(outsider, { conversationId: groupId })).toThrow(/不是会话成员/);
    expect(() => chat.send(outsider, {
      conversationId: groupId,
      clientMessageId: 'message_0002',
      content: 'blocked',
    })).toThrow(/不是会话成员/);
    expect(() => chat.createGroup(alice, {
      name: 'Invalid Team',
      memberUserIds: ['bob', 'forbidden'],
    })).toThrow(/无聊天权限/);
  });

  it('按游标读取消息并单调推进已读位置', () => {
    addUser('alice', 'alice', ['chat']);
    addUser('bob', 'bob', ['chat']);
    const alice = chat.login('alice', 'password123').token;
    const bob = chat.login('bob', 'password123').token;
    const conversationId = chat.createDirect(alice, 'bob');
    const first = chat.send(alice, {
      conversationId,
      clientMessageId: 'message_1001',
      content: 'first',
    });
    const second = chat.send(alice, {
      conversationId,
      clientMessageId: 'message_1002',
      content: 'second',
    });

    expect(chat.messages(bob, { conversationId, afterMessageId: first.messageId }))
      .toEqual([expect.objectContaining({ messageId: second.messageId })]);
    expect(chat.conversations(bob)[0]?.unreadCount).toBe(2);
    chat.markRead(bob, conversationId, second.messageId);
    chat.markRead(bob, conversationId, first.messageId);
    expect(chat.conversations(bob)[0]?.unreadCount).toBe(0);
    expect(db.prepare(
      `SELECT last_read_message_id FROM chat_conversation_member
       WHERE conversation_id = ? AND user_id = ?`,
    ).get(conversationId, 'bob')).toEqual({ last_read_message_id: second.messageId });
  });
});
