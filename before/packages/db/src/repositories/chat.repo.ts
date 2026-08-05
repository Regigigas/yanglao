import { createHash, randomBytes } from 'crypto';
import type { Database } from 'better-sqlite3';
import type {
  ChatContact,
  ChatConversation,
  ChatGroupInput,
  ChatLoginResult,
  ChatMe,
  ChatMessage,
  ChatMessageQuery,
  ChatSendInput,
  ChatUserId,
} from '@yanglao/core';
import type { ChatMessageRow } from '../schema';
import { verifyPassword } from '../utils/password';

const TOKEN_LIFETIME_MS = 30 * 24 * 60 * 60 * 1000;
const CLIENT_MESSAGE_ID_PATTERN = /^[A-Za-z0-9_-]{8,64}$/;

interface AuthorizedUserRow {
  id: string;
  username: string;
  password_hash: string;
  password_salt: string;
  real_name: string;
  department: string | null;
  menu_keys: string;
}

interface ConversationListRow {
  conversation_id: number;
  type: 'D' | 'G';
  name: string;
  owner_user_id: string | null;
  last_message_id: number | null;
  last_message_preview: string;
  last_message_at: number | null;
  unread_count: number;
}

interface MessageViewRow extends ChatMessageRow {
  sender_name: string;
}

export class ChatRepo {
  constructor(private db: Database) {}

  login(username: string, password: string): ChatLoginResult {
    const normalizedUsername = username?.trim() ?? '';
    if (!normalizedUsername || normalizedUsername.length > 100 || !password || password.length > 256) {
      throw new Error('用户名或密码错误');
    }
    const user = this.db.prepare<[string], AuthorizedUserRow>(
      `SELECT u.id, u.username, u.password_hash, u.password_salt, u.real_name, u.department, r.menu_keys
       FROM sys_user u
       JOIN sys_role r ON r.id = u.role_id
       WHERE u.username = ? AND u.status = 'active' AND u.deleted_at IS NULL
         AND r.deleted_at IS NULL`,
    ).get(normalizedUsername);
    if (!user || !this.hasChatPermission(user.menu_keys)
      || !verifyPassword(password, user.password_salt, user.password_hash)) {
      throw new Error('用户名或密码错误，或账号无聊天权限');
    }

    return this.issueSession(user);
  }

  /** Electron 主进程已完成本地登录时，为当前账号签发聊天会话。 */
  createSessionForUser(userId: ChatUserId): ChatLoginResult {
    const normalizedUserId = this.normalizeUserId(userId);
    if (!normalizedUserId) throw new Error('聊天账号无效');
    return this.issueSession(this.requireActiveChatUser(
      normalizedUserId,
      '账号已停用或无聊天权限',
    ));
  }

  private issueSession(user: AuthorizedUserRow): ChatLoginResult {
    const token = randomBytes(32).toString('base64url');
    const now = Date.now();
    const expiresAt = now + TOKEN_LIFETIME_MS;
    this.db.prepare(
      `INSERT INTO chat_session_token (token_hash, user_id, expires_at, created_at, last_used_at)
       VALUES (?, ?, ?, ?, ?)`,
    ).run(this.hashToken(token), user.id, expiresAt, now, now);
    return {
      mode: 'local',
      token,
      expiresAt: this.toIso(expiresAt),
      userId: user.id,
      userName: user.username,
      nickName: user.real_name,
    };
  }

  authenticate(token: string): ChatMe {
    return this.toMe(this.requireUser(token));
  }

  logout(token: string): void {
    if (typeof token !== 'string' || !token) return;
    this.db.prepare(`DELETE FROM chat_session_token WHERE token_hash = ?`).run(this.hashToken(token));
  }

  me(token: string): ChatMe {
    return this.toMe(this.requireUser(token));
  }

  contacts(token: string, keyword?: string): ChatContact[] {
    const current = this.requireUser(token);
    const search = keyword?.trim() ?? '';
    if (search.length > 50) throw new Error('搜索内容不能超过50个字符');
    const lowered = search.toLocaleLowerCase();
    const rows = this.db.prepare<[string], AuthorizedUserRow>(
      `SELECT u.id, u.username, u.password_hash, u.password_salt, u.real_name, u.department, r.menu_keys
       FROM sys_user u
       JOIN sys_role r ON r.id = u.role_id
       WHERE u.status = 'active' AND u.deleted_at IS NULL AND r.deleted_at IS NULL
         AND u.id != ?
       ORDER BY u.real_name, u.id`,
    ).all(current.id) as AuthorizedUserRow[];
    return rows
      .filter((row) => this.hasChatPermission(row.menu_keys))
      .filter((row) => !lowered || [row.username, row.real_name, row.department ?? '']
        .some((value) => value.toLocaleLowerCase().includes(lowered)))
      .slice(0, 100)
      .map((row) => ({
        userId: row.id,
        userName: row.username,
        nickName: row.real_name,
        ...(row.department ? { deptName: row.department } : {}),
      }));
  }

  conversations(token: string): ChatConversation[] {
    const user = this.requireUser(token);
    const rows = this.db.prepare<[string, string, string], ConversationListRow>(
      `SELECT c.id AS conversation_id, c.type,
              CASE WHEN c.type = 'D' THEN COALESCE(peer.real_name, peer.username, '') ELSE c.name END AS name,
              c.owner_user_id, c.last_message_id, c.last_message_preview, c.last_message_at,
              (SELECT COUNT(*) FROM chat_message unread
               WHERE unread.conversation_id = c.id AND unread.deleted_at IS NULL
                 AND unread.id > cm.last_read_message_id AND unread.sender_user_id != ?) AS unread_count
       FROM chat_conversation_member cm
       JOIN chat_conversation c ON c.id = cm.conversation_id AND c.status = 'active'
       LEFT JOIN chat_conversation_member peer_member
         ON c.type = 'D' AND peer_member.conversation_id = c.id
        AND peer_member.user_id != ? AND peer_member.left_at IS NULL
       LEFT JOIN sys_user peer ON peer.id = peer_member.user_id
       WHERE cm.user_id = ? AND cm.left_at IS NULL
       ORDER BY COALESCE(c.last_message_at, c.created_at) DESC, c.id DESC`,
    ).all(user.id, user.id, user.id) as ConversationListRow[];
    return rows.map((row) => ({
      conversationId: row.conversation_id,
      type: row.type,
      name: row.name,
      ...(row.owner_user_id ? { ownerUserId: row.owner_user_id } : {}),
      ...(row.last_message_id !== null ? { lastMessageId: row.last_message_id } : {}),
      ...(row.last_message_preview ? { lastMessagePreview: row.last_message_preview } : {}),
      ...(row.last_message_at !== null ? { lastMessageTime: this.toIso(row.last_message_at) } : {}),
      unreadCount: row.unread_count,
    }));
  }

  createDirect(token: string, peerUserId: ChatUserId): number {
    const user = this.requireUser(token);
    const peerId = this.normalizeUserId(peerUserId);
    if (!peerId || peerId === user.id) throw new Error('私聊联系人无效');
    this.requireActiveChatUser(peerId, '联系人不存在、已停用或无聊天权限');
    const directKey = JSON.stringify([user.id, peerId].sort());
    return this.db.transaction(() => {
      this.db.prepare(
        `INSERT OR IGNORE INTO chat_conversation
           (type, direct_key, status, created_at, updated_at)
         VALUES ('D', ?, 'active', ?, ?)`,
      ).run(directKey, Date.now(), Date.now());
      const conversation = this.db.prepare<[string], { id: number }>(
        `SELECT id FROM chat_conversation WHERE direct_key = ? AND type = 'D' AND status = 'active'`,
      ).get(directKey);
      if (!conversation) throw new Error('创建私聊失败');
      const insertMember = this.db.prepare(
        `INSERT OR IGNORE INTO chat_conversation_member
           (conversation_id, user_id, role, joined_at) VALUES (?, ?, 'M', ?)`,
      );
      const now = Date.now();
      insertMember.run(conversation.id, user.id, now);
      insertMember.run(conversation.id, peerId, now);
      return conversation.id;
    })();
  }

  createGroup(token: string, input: ChatGroupInput): number {
    const owner = this.requireUser(token);
    const name = input.name?.trim() ?? '';
    if (!name || name.length > 50) throw new Error('群聊名称长度应为1到50个字符');
    const memberIds = new Set<string>([owner.id]);
    for (const value of input.memberUserIds ?? []) {
      const id = this.normalizeUserId(value);
      if (id) memberIds.add(id);
    }
    if (memberIds.size < 3 || memberIds.size > 100) {
      throw new Error('群聊成员数量应为3到100人');
    }
    for (const id of memberIds) {
      this.requireActiveChatUser(id, '群聊包含不存在、已停用或无聊天权限的用户');
    }
    return this.db.transaction(() => {
      const now = Date.now();
      const result = this.db.prepare(
        `INSERT INTO chat_conversation
           (type, name, owner_user_id, status, created_at, updated_at)
         VALUES ('G', ?, ?, 'active', ?, ?)`,
      ).run(name, owner.id, now, now);
      const conversationId = Number(result.lastInsertRowid);
      const insertMember = this.db.prepare(
        `INSERT INTO chat_conversation_member
           (conversation_id, user_id, role, joined_at) VALUES (?, ?, ?, ?)`,
      );
      for (const id of memberIds) {
        insertMember.run(conversationId, id, id === owner.id ? 'O' : 'M', now);
      }
      return conversationId;
    })();
  }

  messages(token: string, query: ChatMessageQuery): ChatMessage[] {
    const user = this.requireUser(token);
    const conversationId = this.requirePositiveInteger(query.conversationId, '会话标识无效');
    this.requireMembership(conversationId, user.id);
    const after = this.positiveCursor(query.afterMessageId);
    const before = this.positiveCursor(query.beforeMessageId);
    const limit = Math.max(1, Math.min(query.limit ?? 50, 100));
    const conditions = ['m.conversation_id = ?', 'm.deleted_at IS NULL'];
    const params: Array<string | number> = [conversationId];
    if (after !== undefined) {
      conditions.push('m.id > ?');
      params.push(after);
    }
    if (before !== undefined) {
      conditions.push('m.id < ?');
      params.push(before);
    }
    params.push(limit);
    const rows = this.db.prepare(
      `SELECT m.*, u.real_name AS sender_name
       FROM chat_message m JOIN sys_user u ON u.id = m.sender_user_id
       WHERE ${conditions.join(' AND ')}
       ORDER BY m.id ${after !== undefined ? 'ASC' : 'DESC'} LIMIT ?`,
    ).all(...params) as MessageViewRow[];
    if (after === undefined) rows.reverse();
    return rows.map((row) => this.toMessage(row));
  }

  send(token: string, input: ChatSendInput): ChatMessage {
    const user = this.requireUser(token);
    const conversationId = this.requirePositiveInteger(input.conversationId, '会话标识无效');
    this.requireMembership(conversationId, user.id);
    if (!CLIENT_MESSAGE_ID_PATTERN.test(input.clientMessageId ?? '')) {
      throw new Error('客户端消息标识无效');
    }
    const type = input.messageType?.trim() || 'text';
    if (type !== 'text') throw new Error('当前仅支持文本消息');
    const content = input.content?.trim() ?? '';
    if (!content || content.length > 2000) throw new Error('消息内容长度应为1到2000个字符');

    return this.db.transaction(() => {
      const existing = this.findMessageByClientId(user.id, input.clientMessageId);
      if (existing) {
        if (existing.conversation_id !== conversationId) {
          throw new Error('客户端消息标识已用于其他会话');
        }
        return this.toMessage(existing);
      }
      const now = Date.now();
      const result = this.db.prepare(
        `INSERT INTO chat_message
           (conversation_id, sender_user_id, client_message_id, message_type, content, created_at)
         VALUES (?, ?, ?, 'text', ?, ?)`,
      ).run(conversationId, user.id, input.clientMessageId, content, now);
      const messageId = Number(result.lastInsertRowid);
      const preview = content.replace(/\s+/g, ' ').slice(0, 200);
      this.db.prepare(
        `UPDATE chat_conversation SET last_message_id = ?, last_message_preview = ?,
           last_message_at = ?, updated_at = ? WHERE id = ? AND status = 'active'`,
      ).run(messageId, preview, now, now, conversationId);
      const message = this.findMessageById(messageId);
      if (!message) throw new Error('发送消息失败');
      return this.toMessage(message);
    })();
  }

  markRead(token: string, conversationIdValue: number, messageIdValue: number): void {
    const user = this.requireUser(token);
    const conversationId = this.requirePositiveInteger(conversationIdValue, '已读位置无效');
    const messageId = this.requirePositiveInteger(messageIdValue, '已读位置无效');
    this.requireMembership(conversationId, user.id, '已读位置无效');
    const message = this.db.prepare<[number, number], { id: number }>(
      `SELECT id FROM chat_message WHERE id = ? AND conversation_id = ? AND deleted_at IS NULL`,
    ).get(messageId, conversationId);
    if (!message) throw new Error('已读位置无效');
    this.db.prepare(
      `UPDATE chat_conversation_member
       SET last_read_message_id = MAX(last_read_message_id, ?), last_read_at = ?
       WHERE conversation_id = ? AND user_id = ? AND left_at IS NULL`,
    ).run(messageId, Date.now(), conversationId, user.id);
  }

  private requireUser(token: string): AuthorizedUserRow {
    if (typeof token !== 'string' || !token) throw new Error('聊天登录已失效，请重新登录');
    const now = Date.now();
    const tokenHash = this.hashToken(token);
    const user = this.db.prepare<[string, number], AuthorizedUserRow>(
      `SELECT u.id, u.username, u.password_hash, u.password_salt, u.real_name, u.department, r.menu_keys
       FROM chat_session_token t
       JOIN sys_user u ON u.id = t.user_id
       JOIN sys_role r ON r.id = u.role_id
       WHERE t.token_hash = ? AND t.expires_at > ?
         AND u.status = 'active' AND u.deleted_at IS NULL AND r.deleted_at IS NULL`,
    ).get(tokenHash, now);
    if (!user || !this.hasChatPermission(user.menu_keys)) {
      this.db.prepare(`DELETE FROM chat_session_token WHERE token_hash = ? OR expires_at <= ?`)
        .run(tokenHash, now);
      throw new Error('聊天登录已失效，请重新登录');
    }
    this.db.prepare(`UPDATE chat_session_token SET last_used_at = ? WHERE token_hash = ?`)
      .run(now, tokenHash);
    return user;
  }

  private requireActiveChatUser(userId: string, message: string): AuthorizedUserRow {
    const user = this.db.prepare<[string], AuthorizedUserRow>(
      `SELECT u.id, u.username, u.password_hash, u.password_salt, u.real_name, u.department, r.menu_keys
       FROM sys_user u JOIN sys_role r ON r.id = u.role_id
       WHERE u.id = ? AND u.status = 'active' AND u.deleted_at IS NULL AND r.deleted_at IS NULL`,
    ).get(userId);
    if (!user || !this.hasChatPermission(user.menu_keys)) throw new Error(message);
    return user;
  }

  private requireMembership(conversationId: number, userId: string, message = '会话不存在或您不是会话成员'): void {
    const row = this.db.prepare<[number, string], { ok: number }>(
      `SELECT 1 AS ok FROM chat_conversation_member cm
       JOIN chat_conversation c ON c.id = cm.conversation_id AND c.status = 'active'
       WHERE cm.conversation_id = ? AND cm.user_id = ? AND cm.left_at IS NULL`,
    ).get(conversationId, userId);
    if (!row) throw new Error(message);
  }

  private findMessageByClientId(userId: string, clientMessageId: string): MessageViewRow | undefined {
    return this.db.prepare<[string, string], MessageViewRow>(
      `SELECT m.*, u.real_name AS sender_name FROM chat_message m
       JOIN sys_user u ON u.id = m.sender_user_id
       WHERE m.sender_user_id = ? AND m.client_message_id = ? AND m.deleted_at IS NULL`,
    ).get(userId, clientMessageId);
  }

  private findMessageById(messageId: number): MessageViewRow | undefined {
    return this.db.prepare<[number], MessageViewRow>(
      `SELECT m.*, u.real_name AS sender_name FROM chat_message m
       JOIN sys_user u ON u.id = m.sender_user_id WHERE m.id = ? AND m.deleted_at IS NULL`,
    ).get(messageId);
  }

  private toMessage(row: MessageViewRow): ChatMessage {
    return {
      messageId: row.id,
      conversationId: row.conversation_id,
      senderUserId: row.sender_user_id,
      senderName: row.sender_name,
      clientMessageId: row.client_message_id,
      messageType: 'text',
      content: row.content,
      createTime: this.toIso(row.created_at),
    };
  }

  private toMe(user: AuthorizedUserRow): ChatMe {
    return { userId: user.id, userName: user.username, nickName: user.real_name };
  }

  private hasChatPermission(value: string): boolean {
    try {
      const keys = JSON.parse(value) as unknown;
      return Array.isArray(keys) && (keys.includes('chat') || keys.includes('*'));
    } catch {
      return false;
    }
  }

  private normalizeUserId(value: ChatUserId): string | null {
    if (typeof value === 'number') return Number.isSafeInteger(value) && value > 0 ? String(value) : null;
    const normalized = typeof value === 'string' ? value.trim() : '';
    return normalized && normalized.length <= 128 && /^[A-Za-z0-9_-]+$/.test(normalized)
      ? normalized
      : null;
  }

  private requirePositiveInteger(value: number, message: string): number {
    if (!Number.isSafeInteger(value) || value <= 0) throw new Error(message);
    return value;
  }

  private positiveCursor(value: number | undefined): number | undefined {
    return value !== undefined && Number.isSafeInteger(value) && value > 0 ? value : undefined;
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private toIso(timestamp: number): string {
    return new Date(timestamp).toISOString();
  }
}
