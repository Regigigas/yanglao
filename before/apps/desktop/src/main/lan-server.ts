// apps/desktop/src/main/lan-server.ts
// 局域网主机模式 - 内嵌 HTTP 同步服务器
// 协议兼容现有 SyncEngine（/sync/upload + /sync/download）

import { createServer, IncomingMessage, ServerResponse } from 'http'
import { networkInterfaces } from 'os'
import type { Database } from 'better-sqlite3'
import type { ChatRepo, IotRepo } from '@yanglao/db'
import type { ChatGroupInput, ChatSendInput, ChatUserId } from '@yanglao/core'
import { nanoid } from 'nanoid'
import { handleDeviceReport } from './ipc/iot.handler'

// 允许同步的业务表白名单（防注入）
const ALLOWED_TABLES = new Set([
  'elderly', 'family_contact', 'health_profile', 'vital_signs',
  'medication_order', 'medication_record', 'medical_visit',
  'admission', 'leave_record', 'discharge',
  'care_assessment', 'care_plan', 'care_record',
  'fee_item', 'deposit_record', 'monthly_bill', 'bill_detail', 'payment_record',
  'meal_menu', 'meal_record', 'nutrition_plan', 'activity', 'activity_attendance',
  'contract', 'building', 'room', 'bed',
   'task_reminder', 'iot_device_alert', 'announcement',
])
const LAN_CONFIG_FIELDS = new Set(['enabled', 'port', 'allow_write', 'secret'])

interface LanConfigRow {
  id: 1
  enabled: 0 | 1
  port: number
  allow_write: 0 | 1
  secret: string | null
  updated_at: number
}

export interface LanServerStatus {
  running: boolean
  port: number
  urls: string[]
}

/** 读取请求 body（JSON） */
function readJson(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let body = ''
    let size = 0
    let rejected = false
    req.on('data', chunk => {
      if (rejected) return
      size += Buffer.byteLength(chunk)
      if (size > 2 * 1024 * 1024) {
        rejected = true
        reject(new Error('请求体不能超过 2 MB'))
        return
      }
      body += chunk
    })
    req.on('end', () => {
      if (rejected) return
      try { resolve(JSON.parse(body || '{}')) }
      catch { reject(new Error('请求体 JSON 格式错误')) }
    })
    req.on('error', reject)
  })
}

/** 发送 JSON 响应 */
function sendJson(res: ServerResponse, status: number, data: unknown): void {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Private-Network': 'true',
  })
  res.end(JSON.stringify(data))
}

export class LanServer {
  private server: ReturnType<typeof createServer> | null = null
  private currentPort = 7788

  constructor(
    private db: Database,
    private iotRepo?: IotRepo,
    private chatRepo?: ChatRepo,
  ) {}

  // ─── 配置读写 ──────────────────────────────────────────────
  getConfig(): LanConfigRow {
    return this.db
      .prepare<[], LanConfigRow>('SELECT * FROM lan_config WHERE id=1')
      .get() as LanConfigRow
  }

  saveConfig(cfg: Partial<Omit<LanConfigRow, 'id'>>): void {
    const normalized = { ...cfg }
    if (Object.prototype.hasOwnProperty.call(normalized, 'secret') && !normalized.secret) {
      normalized.secret = nanoid(32)
    }
    const fields = Object.keys(normalized).filter(field => LAN_CONFIG_FIELDS.has(field))
    if (!fields.length) return
    const sets = [...fields, 'updated_at'].map(f => `${f}=@${f}`).join(',')
    const values = Object.fromEntries(fields.map(field => [field, normalized[field as keyof typeof normalized]]))
    this.db.prepare(`UPDATE lan_config SET ${sets} WHERE id=1`).run({ ...values, updated_at: Date.now() })
  }

  // ─── 本机局域网 IP ─────────────────────────────────────────
  getLanIPs(): string[] {
    const nets = networkInterfaces()
    const ips: string[] = []
    for (const list of Object.values(nets)) {
      for (const iface of list ?? []) {
        if (iface.family === 'IPv4' && !iface.internal) {
          ips.push(iface.address)
        }
      }
    }
    return ips
  }

  getAccessUrls(): string[] {
    return this.getLanIPs().map(ip => `http://${ip}:${this.currentPort}`)
  }

  // ─── 服务器生命周期 ───────────────────────────────────────
  async start(port?: number): Promise<void> {
    if (this.server?.listening) return
    const cfg = this.getConfig()
    if (!cfg.secret) {
      cfg.secret = nanoid(32)
      this.saveConfig({ secret: cfg.secret })
    }
    this.currentPort = port ?? cfg.port ?? 7788

    return new Promise((resolve, reject) => {
      this.server = createServer((req, res) => this.handleRequest(req, res))
      this.server.listen(this.currentPort, '0.0.0.0', () => {
        const address = this.server?.address()
        if (address && typeof address === 'object') this.currentPort = address.port
        console.info(`[LAN Server] 已启动，端口 ${this.currentPort}`)
        resolve()
      })
      this.server.on('error', (err: NodeJS.ErrnoException) => {
        if (err.code === 'EADDRINUSE') {
          reject(new Error(`端口 ${this.currentPort} 已被占用，请修改端口后重试`))
        } else {
          reject(err)
        }
      })
    })
  }

  stop(): void {
    this.server?.close()
    this.server = null
    console.info('[LAN Server] 已停止')
  }

  isRunning(): boolean {
    return this.server?.listening === true
  }

  getStatus(): LanServerStatus {
    return {
      running: this.isRunning(),
      port: this.currentPort,
      urls: this.isRunning() ? this.getAccessUrls() : [],
    }
  }

  // ─── 请求路由 ──────────────────────────────────────────────
  private handleRequest(req: IncomingMessage, res: ServerResponse): void {
    const cfg = this.getConfig()
    const requestUrl = new URL(req.url ?? '/', 'http://localhost')
    const pathname = requestUrl.pathname

    // OPTIONS 预检
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Secret',
        'Access-Control-Allow-Private-Network': 'true',
      })
      return res.end()
    }

    if (req.method === 'GET' && pathname === '/ping') {
      return sendJson(res, 200, { code: 0, message: 'pong', data: { version: '1.0', time: Date.now() } })
    }

    const requiresSharedSecret = pathname.startsWith('/sync/') || pathname === '/iot/report'
    if (requiresSharedSecret && !cfg.secret) {
      return sendJson(res, 503, { code: 503, message: '局域网服务尚未配置访问密钥' })
    }

    // 配置访问密钥后，所有局域网接口都必须携带密钥。
    if (cfg.secret) {
      const authorization = req.headers.authorization ?? ''
      const bearerSecret = /^Bearer\s+(.+)$/i.exec(authorization)?.[1]?.trim()
      const clientSecret = req.headers['x-secret'] || (requiresSharedSecret ? bearerSecret : undefined)
      if (clientSecret !== cfg.secret) {
        return sendJson(res, 401, { code: 401, message: '密钥错误' })
      }
    }

    if (pathname.startsWith('/system/chat/') || pathname === '/system/scene/buildings') {
      void this.handleChatRequest(req, res, requestUrl)
      return
    }

    if (req.method === 'POST' && pathname === '/sync/upload') {
      void this.handleUpload(req, res, cfg)
      return
    }

    if (req.method === 'POST' && pathname === '/sync/download') {
      void this.handleDownload(req, res)
      return
    }

    // 物联网 WiFi 设备数据上报接口：设备主动 POST { deviceId, elderlyId?, data } 到本机局域网地址
    if (req.method === 'POST' && pathname === '/iot/report') {
      void this.handleIotReport(req, res)
      return
    }

    sendJson(res, 404, { code: 404, message: '接口不存在' })
  }

  // ─── 本地聊天：复用线上 /system/chat/* 契约 ─────────────────
  private async handleChatRequest(
    req: IncomingMessage,
    res: ServerResponse,
    requestUrl: URL,
  ): Promise<void> {
    if (!this.chatRepo) {
      sendJson(res, 503, { code: 503, msg: '本地聊天服务未初始化' })
      return
    }

    const success = (data: unknown): void => {
      sendJson(res, 200, { code: 200, msg: '操作成功', data })
    }

    try {
      const pathname = requestUrl.pathname
      if (req.method === 'POST' && pathname === '/system/chat/login') {
        const body = await readJson(req) as { username?: string; password?: string }
        const login = this.chatRepo.login(body.username ?? '', body.password ?? '')
        success({
          token: login.token,
          expiresAt: login.expiresAt,
          user: {
            userId: login.userId,
            userName: login.userName,
            nickName: login.nickName,
          },
        })
        return
      }

      const authorization = req.headers.authorization ?? ''
      const match = /^Bearer\s+(.+)$/i.exec(authorization)
      if (!match?.[1]) {
        sendJson(res, 401, { code: 401, msg: '请先登录本地聊天' })
        return
      }
      const token = match[1].trim()
      this.chatRepo.authenticate(token)

      if (req.method === 'GET' && pathname === '/system/scene/buildings') {
        success({
          buildings: this.db.prepare(
            `SELECT id, name, floors FROM building WHERE deleted_at IS NULL ORDER BY sort_order, name`,
          ).all(),
          rooms: this.db.prepare(
            `SELECT id, building_id, floor, room_no, status
             FROM room WHERE deleted_at IS NULL ORDER BY building_id, floor, room_no`,
          ).all(),
          beds: this.db.prepare(
            `SELECT id, room_id, bed_no, status
             FROM bed WHERE deleted_at IS NULL ORDER BY room_id, bed_no`,
          ).all(),
        })
        return
      }

      if (req.method === 'POST' && pathname === '/system/chat/logout') {
        this.chatRepo.logout(token)
        success({ ok: true })
        return
      }
      if (req.method === 'GET' && pathname === '/system/chat/me') {
        success(this.chatRepo.me(token))
        return
      }
      if (req.method === 'GET' && pathname === '/system/chat/contacts') {
        success(this.chatRepo.contacts(token, requestUrl.searchParams.get('keyword') ?? undefined))
        return
      }
      if (req.method === 'GET' && pathname === '/system/chat/conversations') {
        success(this.chatRepo.conversations(token))
        return
      }
      if (req.method === 'POST' && pathname === '/system/chat/conversations/direct') {
        const body = await readJson(req) as { peerUserId?: ChatUserId }
        success(this.chatRepo.createDirect(token, body.peerUserId ?? ''))
        return
      }
      if (req.method === 'POST' && pathname === '/system/chat/conversations/group') {
        const body = await readJson(req) as ChatGroupInput
        success(this.chatRepo.createGroup(token, body))
        return
      }

      const messagesMatch = /^\/system\/chat\/conversations\/(\d+)\/messages$/.exec(pathname)
      if (messagesMatch) {
        const conversationId = Number(messagesMatch[1])
        if (req.method === 'GET') {
          const numberParam = (name: string): number | undefined => {
            const value = requestUrl.searchParams.get(name)
            return value ? Number(value) : undefined
          }
          success(this.chatRepo.messages(token, {
            conversationId,
            afterMessageId: numberParam('afterMessageId'),
            beforeMessageId: numberParam('beforeMessageId'),
            limit: numberParam('limit'),
          }))
          return
        }
        if (req.method === 'POST') {
          const body = await readJson(req) as Omit<ChatSendInput, 'conversationId'>
          success(this.chatRepo.send(token, { ...body, conversationId }))
          return
        }
      }

      const readMatch = /^\/system\/chat\/conversations\/(\d+)\/read$/.exec(pathname)
      if (req.method === 'PUT' && readMatch) {
        const body = await readJson(req) as { lastReadMessageId?: number }
        this.chatRepo.markRead(token, Number(readMatch[1]), Number(body.lastReadMessageId))
        success({ ok: true })
        return
      }

      sendJson(res, 404, { code: 404, msg: '聊天接口不存在' })
    } catch (error) {
      const message = error instanceof Error ? error.message : '本地聊天请求失败'
      const unauthorized = /登录|用户名或密码|账号已停用|聊天权限/.test(message)
      sendJson(res, unauthorized ? 401 : 400, {
        code: unauthorized ? 401 : 400,
        msg: message,
      })
    }
  }

  // ─── 物联网设备数据上报 ─────────────────────────────────────
  private async handleIotReport(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
      if (!this.iotRepo) {
        return sendJson(res, 503, { code: 503, message: '设备数据服务未初始化' })
      }
      const body = await readJson(req) as { deviceId: string; elderlyId?: string | null; data: Record<string, unknown> }
      if (!body.deviceId || !body.data) {
        return sendJson(res, 400, { code: 400, message: '缺少 deviceId 或 data' })
      }
      const result = handleDeviceReport(this.iotRepo, body)
      if (!result.ok) return sendJson(res, 404, { code: 404, message: result.error })
      sendJson(res, 200, { code: 0, message: 'ok', data: result.row })
    } catch (err) {
      console.error('[LAN Server] iot report error:', err)
      sendJson(res, 500, { code: 500, message: String(err) })
    }
  }

  // ─── 上传处理：客户端→主机 ─────────────────────────────────
  private async handleUpload(
    req: IncomingMessage,
    res: ServerResponse,
    cfg: LanConfigRow
  ): Promise<void> {
    try {
      if (!cfg.allow_write) {
        return sendJson(res, 403, { code: 403, message: '主机已禁止客户端写入' })
      }

      const body = await readJson(req) as {
        deviceId: string
        changes: Array<{
          id: string; tableName: string; recordId: string
          operation: 'INSERT' | 'UPDATE' | 'DELETE'
          payload: Record<string, unknown>
          createdAt: number
        }>
      }

      const changes = body.changes ?? []
      let applied = 0

      const apply = this.db.transaction(() => {
        for (const change of changes) {
          if (!ALLOWED_TABLES.has(change.tableName)) {
            throw new Error(`不允许同步数据表：${change.tableName}`)
          }
          this.applyChange(change.tableName, change.operation, change.payload)
          // 将客户端变更也写入 change_log，其他客户端可以下载
          this.db.prepare(`
            INSERT OR IGNORE INTO change_log (id, table_name, record_id, operation, payload, created_at, synced, synced_at)
            VALUES (?, ?, ?, ?, ?, ?, 1, ?)
          `).run(
            change.id ?? nanoid(),
            change.tableName,
            change.recordId,
            change.operation,
            JSON.stringify(change.payload),
            change.createdAt ?? Date.now(),
            Date.now()
          )
          applied++
        }
      })
      apply()

      sendJson(res, 200, { code: 0, message: 'ok', data: { received: applied, changes: [] } })
    } catch (err) {
      console.error('[LAN Server] upload error:', err)
      sendJson(res, 500, { code: 500, message: String(err) })
    }
  }

  // ─── 下载处理：主机→客户端 ─────────────────────────────────
  private async handleDownload(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
      const body = await readJson(req) as { deviceId: string; lastSyncAt: number }
      const since = body.lastSyncAt ?? 0

      // 返回主机上 since 之后的所有变更（包括来自其他客户端的）
      const rows = this.db
        .prepare(`SELECT * FROM change_log WHERE created_at > ? ORDER BY created_at ASC LIMIT 2000`)
        .all(since) as Array<{
          id: string; table_name: string; record_id: string
          operation: string; payload: string; created_at: number
        }>

      const changes = rows.map(r => ({
        id: r.id,
        tableName: r.table_name,
        recordId: r.record_id,
        operation: r.operation,
        payload: (() => { try { return JSON.parse(r.payload) } catch { return {} } })(),
        createdAt: r.created_at,
      }))

      sendJson(res, 200, { code: 0, message: 'ok', data: { received: 0, changes } })
    } catch (err) {
      console.error('[LAN Server] download error:', err)
      sendJson(res, 500, { code: 500, message: String(err) })
    }
  }

  // ─── 变更应用到本地 DB ─────────────────────────────────────
  private applyChange(
    table: string,
    operation: 'INSERT' | 'UPDATE' | 'DELETE',
    payload: Record<string, unknown>
  ): void {
    if (!payload.id) throw new Error(`同步 ${table} 数据缺少 id`)

    if (operation === 'DELETE') {
      // 尝试软删除
      const hasDeletedAt = this.db.prepare(`SELECT 1 FROM pragma_table_info('${table}') WHERE name='deleted_at'`).get()
      if (hasDeletedAt) {
        this.db.prepare(`UPDATE ${table} SET deleted_at=@deleted_at, updated_at=@updated_at WHERE id=@id`).run({
          deleted_at: payload.deleted_at ?? Date.now(),
          updated_at: Date.now(),
          id: payload.id,
        })
      } else {
        this.db.prepare(`DELETE FROM ${table} WHERE id=?`).run(payload.id)
      }
      return
    }

    // INSERT / UPDATE → UPSERT
    const tableColumns = new Set(
      (this.db.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>).map(column => column.name),
    )
    const cols = Object.keys(payload)
    const invalidColumns = cols.filter(column => !tableColumns.has(column))
    if (invalidColumns.length) {
      throw new Error(`数据表 ${table} 包含非法字段：${invalidColumns.join(', ')}`)
    }
    const placeholders = cols.map(c => `@${c}`).join(', ')
    const updateColumns = cols.filter(c => c !== 'id')
    const conflict = updateColumns.length
      ? `DO UPDATE SET ${updateColumns.map(c => `${c}=excluded.${c}`).join(', ')}`
      : 'DO NOTHING'
    this.db
      .prepare(`INSERT INTO ${table} (${cols.join(', ')}) VALUES (${placeholders})
                ON CONFLICT(id) ${conflict}`)
      .run(payload)
  }
}
