import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService, type DataRecord } from '@app/common';

@Injectable()
export class CollaborationService {
  constructor(private readonly database: DatabaseService) {}

  async contacts(userId: number, keywordInput: unknown): Promise<DataRecord[]> {
    const keyword = String(keywordInput ?? '').trim();
    if (keyword.length > 50) throw new BadRequestException('搜索内容不能超过50个字符');
    return this.database.query(
      `SELECT u.user_id,u.user_name,u.nick_name,u.avatar,d.dept_name
       FROM sys_user u LEFT JOIN sys_dept d ON d.dept_id=u.dept_id
       WHERE u.status='0' AND u.del_flag='0' AND u.user_id<>?
         AND (?='' OR u.user_name LIKE ? OR u.nick_name LIKE ? OR d.dept_name LIKE ?)
       ORDER BY u.nick_name,u.user_id LIMIT 100`,
      [userId, keyword, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`],
    );
  }

  async conversations(userId: number): Promise<DataRecord[]> {
    return this.database.query(
      `SELECT c.conversation_id,c.type,
        CASE WHEN c.type='D' THEN peer.nick_name ELSE c.name END name,
        CASE WHEN c.type='D' THEN peer.avatar ELSE '' END avatar,
        c.owner_user_id,c.last_message_id,c.last_message_preview,c.last_message_time,
        (SELECT COUNT(*) FROM chat_message unread WHERE unread.conversation_id=c.conversation_id
          AND unread.message_id>COALESCE(cm.last_read_message_id,0) AND unread.sender_user_id<>? AND unread.deleted_flag='0') unread_count
       FROM chat_conversation_member cm JOIN chat_conversation c ON c.conversation_id=cm.conversation_id AND c.status='0'
       LEFT JOIN chat_conversation_member pm ON c.type='D' AND pm.conversation_id=c.conversation_id AND pm.user_id<>? AND pm.left_at IS NULL
       LEFT JOIN sys_user peer ON peer.user_id=pm.user_id
       WHERE cm.user_id=? AND cm.left_at IS NULL ORDER BY COALESCE(c.last_message_time,c.create_time) DESC,c.conversation_id DESC`,
      [userId, userId, userId],
    );
  }

  async createDirect(userId: number, peerUserId: number): Promise<number> {
    if (!peerUserId || peerUserId === userId) throw new BadRequestException('私聊联系人无效');
    const users = await this.database.query("SELECT user_id FROM sys_user WHERE user_id=? AND status='0' AND del_flag='0'", [peerUserId]);
    if (!users.length) throw new BadRequestException('联系人不存在或已停用');
    const directKey = `${Math.min(userId, peerUserId)}:${Math.max(userId, peerUserId)}`;
    return this.database.transaction(async (connection) => {
      const [existing] = await connection.query<import('mysql2').RowDataPacket[]>('SELECT conversation_id FROM chat_conversation WHERE direct_key=? AND status=\'0\' LIMIT 1', [directKey]);
      let conversationId = Number(existing[0]?.conversation_id ?? 0);
      if (!conversationId) {
        const [created] = await connection.execute<import('mysql2').ResultSetHeader>(
          "INSERT INTO chat_conversation(type,direct_key,status,create_time,update_time) VALUES('D',?,'0',NOW(),NOW())",
          [directKey],
        );
        conversationId = created.insertId;
      }
      for (const memberId of [userId, peerUserId]) {
        await connection.execute(
          `INSERT INTO chat_conversation_member(conversation_id,user_id,role,joined_at,left_at,last_read_message_id,mute_flag)
           VALUES(?,?,'M',NOW(),NULL,0,'0') ON DUPLICATE KEY UPDATE joined_at=NOW(),left_at=NULL`,
          [conversationId, memberId],
        );
      }
      return conversationId;
    });
  }

  async createGroup(userId: number, nameInput: unknown, membersInput: unknown): Promise<number> {
    const name = String(nameInput ?? '').trim();
    if (!name || name.length > 50) throw new BadRequestException('群聊名称长度应为1到50个字符');
    const members = new Set<number>([userId]);
    if (Array.isArray(membersInput)) for (const id of membersInput) if (Number(id) > 0) members.add(Number(id));
    if (members.size < 3 || members.size > 100) throw new BadRequestException('群聊成员数量应为3到100人');
    const ids = [...members];
    const active = await this.database.rawQuery<{ total: number } & import('mysql2').RowDataPacket>(
      `SELECT COUNT(*) total FROM sys_user WHERE status='0' AND del_flag='0' AND user_id IN (${ids.map(() => '?').join(',')})`, ids,
    );
    if (Number(active[0]?.total) !== ids.length) throw new BadRequestException('群聊包含不存在或已停用的用户');
    return this.database.transaction(async (connection) => {
      const [created] = await connection.execute<import('mysql2').ResultSetHeader>(
        "INSERT INTO chat_conversation(type,name,owner_user_id,status,create_time,update_time) VALUES('G',?,?,'0',NOW(),NOW())",
        [name, userId],
      );
      for (const memberId of ids) {
        await connection.execute(
          "INSERT INTO chat_conversation_member(conversation_id,user_id,role,joined_at,last_read_message_id,mute_flag) VALUES(?,?,?,NOW(),0,'0')",
          [created.insertId, memberId, memberId === userId ? 'O' : 'M'],
        );
      }
      return created.insertId;
    });
  }

  async messages(userId: number, conversationId: number, afterInput: unknown, beforeInput: unknown, limitInput: unknown): Promise<DataRecord[]> {
    const after = Math.max(0, Number(afterInput ?? 0));
    const before = Math.max(0, Number(beforeInput ?? 0));
    const limit = Math.min(100, Math.max(1, Number(limitInput ?? 50)));
    const filters = ['m.conversation_id=?', "m.deleted_flag='0'"];
    const values: Array<string | number> = [conversationId];
    if (after) { filters.push('m.message_id>?'); values.push(after); }
    if (before) { filters.push('m.message_id<?'); values.push(before); }
    values.push(limit);
    const rows = await this.database.query(
      `SELECT m.message_id,m.conversation_id,m.sender_user_id,u.nick_name sender_name,u.avatar,
       m.client_message_id,m.message_type,m.content,m.create_time
       FROM chat_message m JOIN chat_conversation_member viewer ON viewer.conversation_id=m.conversation_id AND viewer.user_id=? AND viewer.left_at IS NULL
       JOIN sys_user u ON u.user_id=m.sender_user_id WHERE ${filters.join(' AND ')}
       ORDER BY m.message_id ${after ? 'ASC' : 'DESC'} LIMIT ?`,
      [userId, ...values],
    );
    return after ? rows : rows.reverse();
  }

  async send(userId: number, conversationId: number, input: DataRecord): Promise<DataRecord> {
    const clientId = String(input.clientMessageId ?? '');
    const content = String(input.content ?? '').trim();
    if (!/^[A-Za-z0-9_-]{8,64}$/.test(clientId)) throw new BadRequestException('客户端消息标识无效');
    if (String(input.messageType ?? 'text') !== 'text') throw new BadRequestException('当前仅支持文本消息');
    if (!content || content.length > 2000) throw new BadRequestException('消息内容长度应为1到2000个字符');
    const membership = await this.database.query('SELECT 1 ok FROM chat_conversation_member WHERE conversation_id=? AND user_id=? AND left_at IS NULL', [conversationId, userId]);
    if (!membership.length) throw new BadRequestException('会话不存在或您不是会话成员');
    const existing = await this.database.query('SELECT message_id FROM chat_message WHERE sender_user_id=? AND client_message_id=? LIMIT 1', [userId, clientId]);
    let messageId = Number(existing[0]?.messageId ?? 0);
    if (!messageId) {
      const created = await this.database.execute(
        "INSERT INTO chat_message(conversation_id,sender_user_id,client_message_id,message_type,content,create_time,deleted_flag) VALUES(?,?,?,?,?,NOW(),'0')",
        [conversationId, userId, clientId, 'text', content],
      );
      messageId = created.insertId;
      await this.database.execute('UPDATE chat_conversation SET last_message_id=?,last_message_preview=?,last_message_time=NOW(),update_time=NOW() WHERE conversation_id=?', [messageId, content.replace(/\s+/g, ' ').slice(0, 200), conversationId]);
    }
    const rows = await this.database.query(
      `SELECT m.message_id,m.conversation_id,m.sender_user_id,u.nick_name sender_name,u.avatar,m.client_message_id,m.message_type,m.content,m.create_time
       FROM chat_message m JOIN sys_user u ON u.user_id=m.sender_user_id WHERE m.message_id=?`, [messageId],
    );
    return rows[0];
  }

  async markRead(userId: number, conversationId: number, messageId: number): Promise<void> {
    const valid = await this.database.query('SELECT 1 ok FROM chat_message m JOIN chat_conversation_member cm ON cm.conversation_id=m.conversation_id AND cm.user_id=? AND cm.left_at IS NULL WHERE m.conversation_id=? AND m.message_id=?', [userId, conversationId, messageId]);
    if (!valid.length) throw new BadRequestException('已读位置无效');
    await this.database.execute('UPDATE chat_conversation_member SET last_read_message_id=GREATEST(last_read_message_id,?),last_read_at=NOW() WHERE conversation_id=? AND user_id=?', [messageId, conversationId, userId]);
  }
}
