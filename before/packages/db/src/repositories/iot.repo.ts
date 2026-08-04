// packages/db/src/repositories/iot.repo.ts
// 物联网设备仓库：设备注册（WiFi/蓝牙）与数据上报记录
//
// 说明：WiFi 设备通过局域网 HTTP/WebSocket 接口上报数据，主进程收到后调用 insertDeviceData 落库；
// 蓝牙设备目前仅做档案登记（conn_type='bluetooth'），实际蓝牙数据接入需要硬件网关/原生蓝牙栈支持，暂不在此仓库范围内。

import type { Database } from 'better-sqlite3'
import { nanoid } from 'nanoid'
import type { IotDeviceAlertRow, IotDeviceDataRow, IotDeviceRow } from '../schema'
import { ChangeLogRepo } from './change-log.repo'

const OFFLINE_AFTER_MS = 10 * 60 * 1000
const DEFAULT_DEVICE_PREFIX = 'DEV'

type DeviceCreateInput = Omit<IotDeviceRow, 'id' | 'device_no' | 'status' | 'last_seen_at' | 'created_at' | 'updated_at' | 'deleted_at'> & {
  device_prefix?: string
}

function isFault(value: unknown): boolean {
  return value === false || value === 0 || ['false', 'offline', 'down', 'abnormal', 'fault'].includes(String(value).toLowerCase())
}

function asNumber(value: unknown): number | null {
  const result = Number(value)
  return Number.isFinite(result) ? result : null
}

export class IotRepo {
  private changeLog: ChangeLogRepo

  constructor(private db: Database) {
    this.changeLog = new ChangeLogRepo(db)
  }

  // ─── 设备 ─────────────────────────────────────────────────
  findAllDevices(): IotDeviceRow[] {
    return this.db
      .prepare<[], IotDeviceRow>(`SELECT * FROM iot_device WHERE deleted_at IS NULL ORDER BY created_at DESC`)
      .all() as IotDeviceRow[]
  }

  findDeviceById(id: string): IotDeviceRow | null {
    return (this.db.prepare<[string], IotDeviceRow>(`SELECT * FROM iot_device WHERE id=?`).get(id) as IotDeviceRow | undefined) ?? null
  }

  /** 按 IP+端口 或 MAC 查找设备，供设备主动上报数据时匹配已注册设备 */
  findDeviceByAddress(ipAddress?: string, port?: number, macAddress?: string): IotDeviceRow | null {
    if (macAddress) {
      const row = this.db
        .prepare<[string], IotDeviceRow>(`SELECT * FROM iot_device WHERE mac_address=? AND deleted_at IS NULL`)
        .get(macAddress) as IotDeviceRow | undefined
      if (row) return row
    }
    if (ipAddress && port) {
      const row = this.db
        .prepare<[string, number], IotDeviceRow>(`SELECT * FROM iot_device WHERE ip_address=? AND port=? AND deleted_at IS NULL`)
        .get(ipAddress, port) as IotDeviceRow | undefined
      if (row) return row
    }
    return null
  }

  private generateDeviceNo(prefix: string): string {
    const prefixWithSeparator = `${prefix}-`
    const deviceNumbers = this.db
      .prepare<[], Pick<IotDeviceRow, 'device_no'>>(`SELECT device_no FROM iot_device`)
      .all()
    const maxSequence = deviceNumbers.reduce((max, { device_no }) => {
      if (!device_no.startsWith(prefixWithSeparator)) return max
      const sequence = Number(device_no.slice(prefixWithSeparator.length))
      return Number.isInteger(sequence) && sequence > max ? sequence : max
    }, 0)
    return `${prefixWithSeparator}${String(maxSequence + 1).padStart(4, '0')}`
  }

  insertDevice(data: DeviceCreateInput): IotDeviceRow {
    const { device_prefix, ...device } = data
    const prefix = typeof device_prefix === 'string' && device_prefix.trim()
      ? device_prefix.trim()
      : DEFAULT_DEVICE_PREFIX
    if (prefix.length > 20 || /\s/.test(prefix)) throw new Error('设备编号前缀不能包含空白字符，且最多 20 个字符')
    const now = Date.now()
    const row: IotDeviceRow = {
      ...device,
      id: nanoid(),
      device_no: this.generateDeviceNo(prefix),
      status: 'offline',
      last_seen_at: null,
      created_at: now,
      updated_at: now,
      deleted_at: null,
    }
    this.db
      .prepare(
        `INSERT INTO iot_device (id,device_no,name,device_type,conn_type,ip_address,port,mac_address,elderly_id,status,last_seen_at,remark,created_at,updated_at,deleted_at)
         VALUES (@id,@device_no,@name,@device_type,@conn_type,@ip_address,@port,@mac_address,@elderly_id,@status,@last_seen_at,@remark,@created_at,@updated_at,@deleted_at)`
      )
      .run(row)
    return row
  }

  updateDevice(id: string, data: Partial<Omit<IotDeviceRow, 'id' | 'device_no' | 'created_at' | 'deleted_at'>>): void {
    const now = Date.now()
    const fields = Object.keys(data)
    if (!fields.length) return
    const sets = [...fields, 'updated_at'].map(f => `${f}=@${f}`).join(',')
    this.db.prepare(`UPDATE iot_device SET ${sets} WHERE id=@id`).run({ ...data, updated_at: now, id })
  }

  deleteDevice(id: string): void {
    this.db.prepare(`UPDATE iot_device SET deleted_at=?, updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id)
  }

  markOnline(id: string): void {
    const now = Date.now()
    this.db.prepare(`UPDATE iot_device SET status='online', last_seen_at=?, updated_at=? WHERE id=?`).run(now, now, id)
  }

  /** 将超过 offlineAfterMs 未上报数据的设备标记为离线（供定时任务调用） */
  markStaleOffline(offlineAfterMs = 5 * 60 * 1000): void {
    const threshold = Date.now() - offlineAfterMs
    this.db
      .prepare(`UPDATE iot_device SET status='offline' WHERE status='online' AND (last_seen_at IS NULL OR last_seen_at < ?)`)
      .run(threshold)
  }

  // ─── 电路 / 网络巡检与维修提醒 ─────────────────────────────
  findAlerts(includeResolved = false): IotDeviceAlertRow[] {
    const where = includeResolved ? '' : `WHERE a.status != 'resolved'`
    return this.db.prepare<[], IotDeviceAlertRow>(`
      SELECT a.*, d.name AS device_name
      FROM iot_device_alert a
      LEFT JOIN iot_device d ON d.id = a.device_id
      ${where}
      ORDER BY CASE a.severity WHEN 'critical' THEN 0 ELSE 1 END, a.last_detected_at DESC
    `).all() as IotDeviceAlertRow[]
  }

  findAlertById(id: string): IotDeviceAlertRow | null {
    return (this.db.prepare<[string], IotDeviceAlertRow>(`
      SELECT a.*, d.name AS device_name
      FROM iot_device_alert a
      LEFT JOIN iot_device d ON d.id = a.device_id
      WHERE a.id=?
    `).get(id) as IotDeviceAlertRow | undefined) ?? null
  }

  /** 人工登记无法由设备上报识别的网络或电路维修事项。 */
  createManualAlert(data: {
    device_id: string
    alert_type: 'circuit' | 'network'
    severity: 'warning' | 'critical'
    title: string
    content: string
  }): IotDeviceAlertRow {
    const device = this.findDeviceById(data.device_id)
    if (!device) throw new Error('设备不存在')
    const now = Date.now()
    const row: IotDeviceAlertRow = {
      id: nanoid(),
      ...data,
      source: 'manual',
      status: 'pending',
      opened_at: now,
      last_detected_at: now,
      resolved_at: null,
      device_name: device.name,
    }
    this.db.prepare(`
      INSERT INTO iot_device_alert (id,device_id,alert_type,source,severity,title,content,status,opened_at,last_detected_at,resolved_at)
      VALUES (@id,@device_id,@alert_type,@source,@severity,@title,@content,@status,@opened_at,@last_detected_at,@resolved_at)
    `).run(row)
    this.logAlertChange('INSERT', row)
    return row
  }

  startAlertRepair(id: string): void {
    const alert = this.findAlertById(id)
    if (!alert || alert.status !== 'pending') return
    this.db.prepare(`UPDATE iot_device_alert SET status='processing' WHERE id=?`).run(id)
    this.logAlertChange('UPDATE', { ...alert, status: 'processing' })
  }

  resolveAlert(id: string): void {
    const alert = this.findAlertById(id)
    if (!alert || alert.status === 'resolved') return
    const resolvedAt = Date.now()
    this.db.prepare(`UPDATE iot_device_alert SET status='resolved', resolved_at=? WHERE id=?`).run(resolvedAt, id)
    this.logAlertChange('UPDATE', { ...alert, status: 'resolved', resolved_at: resolvedAt })
  }

  /**
   * 根据设备最近一次上报自动识别电路和网络异常。
   * 网络：未上报超过 10 分钟、network_status 异常、信号低于 -85dBm 或丢包高于 5%。
   * 电路：circuit_status/power_status 异常，或 voltage 不在 198-242V 区间。
   */
  checkHealth(offlineAfterMs = OFFLINE_AFTER_MS): { opened: IotDeviceAlertRow[]; alerts: IotDeviceAlertRow[] } {
    const now = Date.now()
    const opened: IotDeviceAlertRow[] = []
    this.markStaleOffline(offlineAfterMs)

    for (const device of this.findAllDevices()) {
      const latest = this.findDeviceData(device.id, 1)[0]
      const data = latest ? this.parseData(latest.data) : {}
      const networkReason = this.getNetworkReason(device, data, now, offlineAfterMs)
      const circuitReason = this.getCircuitReason(data)

      if (networkReason) {
        const alert = this.openAlert(device.id, 'network', networkReason.title, networkReason.content, networkReason.severity)
        if (alert.opened) opened.push(alert.row)
      } else {
        this.resolveOpenAlert(device.id, 'network')
      }

      if (circuitReason) {
        const alert = this.openAlert(device.id, 'circuit', circuitReason.title, circuitReason.content, circuitReason.severity)
        if (alert.opened) opened.push(alert.row)
      } else {
        this.resolveOpenAlert(device.id, 'circuit')
      }
    }

    return { opened, alerts: this.findAlerts() }
  }

  private parseData(data: string): Record<string, unknown> {
    try { return JSON.parse(data) as Record<string, unknown> } catch { return {} }
  }

  private getNetworkReason(
    device: IotDeviceRow,
    data: Record<string, unknown>,
    now: number,
    offlineAfterMs: number,
  ): { title: string; content: string; severity: 'warning' | 'critical' } | null {
    if (device.last_seen_at && now - device.last_seen_at > offlineAfterMs) {
      return { title: '网络通讯中断', content: `${device.name} 已超过 10 分钟未上报，请检查网络、供电及设备连接。`, severity: 'critical' }
    }
    const signal = asNumber(data.signal_strength)
    const packetLoss = asNumber(data.packet_loss)
    if (isFault(data.network_status) || isFault(data.link_status)) {
      return { title: '网络连接异常', content: `${device.name} 上报网络连接异常，请安排网络检修。`, severity: 'critical' }
    }
    if (signal !== null && signal < -85) {
      return { title: '网络信号较弱', content: `${device.name} 当前信号强度 ${signal}dBm，低于 -85dBm 阈值，请检查网络覆盖。`, severity: 'warning' }
    }
    if (packetLoss !== null && packetLoss > 5) {
      return { title: '网络丢包异常', content: `${device.name} 当前丢包率 ${packetLoss}%，超过 5% 阈值，请检查网络链路。`, severity: 'warning' }
    }
    return null
  }

  private getCircuitReason(data: Record<string, unknown>): { title: string; content: string; severity: 'warning' | 'critical' } | null {
    const voltage = asNumber(data.voltage)
    if (isFault(data.circuit_status) || isFault(data.power_status)) {
      return { title: '电路状态异常', content: '设备上报供电或线路异常，请安排电路维修。', severity: 'critical' }
    }
    if (voltage !== null && (voltage < 198 || voltage > 242)) {
      return { title: '电压异常', content: `设备当前电压 ${voltage}V，不在 198-242V 安全监测区间，请安排电路检查。`, severity: 'critical' }
    }
    return null
  }

  private openAlert(
    deviceId: string,
    type: 'circuit' | 'network',
    title: string,
    content: string,
    severity: 'warning' | 'critical',
  ): { opened: boolean; row: IotDeviceAlertRow } {
    const now = Date.now()
    const existing = this.db.prepare<[string, string], IotDeviceAlertRow>(`
      SELECT * FROM iot_device_alert
      WHERE device_id=? AND alert_type=? AND source='auto' AND status != 'resolved'
      ORDER BY opened_at DESC LIMIT 1
    `).get(deviceId, type) as IotDeviceAlertRow | undefined
    if (existing) {
      this.db.prepare(`UPDATE iot_device_alert SET title=?, content=?, severity=?, last_detected_at=? WHERE id=?`)
        .run(title, content, severity, now, existing.id)
      return { opened: false, row: { ...existing, title, content, severity, last_detected_at: now } }
    }

    const row: IotDeviceAlertRow = {
      id: nanoid(), device_id: deviceId, alert_type: type, source: 'auto', severity, title, content,
      status: 'pending', opened_at: now, last_detected_at: now, resolved_at: null,
    }
    this.db.prepare(`
      INSERT INTO iot_device_alert (id,device_id,alert_type,source,severity,title,content,status,opened_at,last_detected_at,resolved_at)
      VALUES (@id,@device_id,@alert_type,@source,@severity,@title,@content,@status,@opened_at,@last_detected_at,@resolved_at)
    `).run(row)
    this.logAlertChange('INSERT', row)
    return { opened: true, row }
  }

  private resolveOpenAlert(deviceId: string, type: 'circuit' | 'network'): void {
    const alerts = this.db.prepare<[string, string], IotDeviceAlertRow>(`
      SELECT * FROM iot_device_alert
      WHERE device_id=? AND alert_type=? AND source='auto' AND status != 'resolved'
    `).all(deviceId, type) as IotDeviceAlertRow[]
    if (!alerts.length) return
    const resolvedAt = Date.now()
    this.db.prepare(`
      UPDATE iot_device_alert SET status='resolved', resolved_at=?
      WHERE device_id=? AND alert_type=? AND source='auto' AND status != 'resolved'
    `).run(resolvedAt, deviceId, type)
    for (const alert of alerts) {
      this.logAlertChange('UPDATE', { ...alert, status: 'resolved', resolved_at: resolvedAt })
    }
  }

  private logAlertChange(operation: 'INSERT' | 'UPDATE', alert: IotDeviceAlertRow): void {
    const { device_name: _deviceName, ...payload } = alert
    this.changeLog.insert({
      table_name: 'iot_device_alert',
      record_id: alert.id,
      operation,
      payload: JSON.stringify(payload),
    })
  }

  // ─── 数据上报 ──────────────────────────────────────────────
  insertDeviceData(data: Omit<IotDeviceDataRow, 'id' | 'created_at'>): IotDeviceDataRow {
    const now = Date.now()
    const row: IotDeviceDataRow = { ...data, id: nanoid(), created_at: now }
    this.db
      .prepare(
        `INSERT INTO iot_device_data (id,device_id,elderly_id,data,reported_at,created_at)
         VALUES (@id,@device_id,@elderly_id,@data,@reported_at,@created_at)`
      )
      .run(row)
    this.markOnline(data.device_id)
    return row
  }

  findDeviceData(deviceId: string, limit = 50): IotDeviceDataRow[] {
    return this.db
      .prepare<[string, number], IotDeviceDataRow>(
        `SELECT * FROM iot_device_data WHERE device_id=? ORDER BY reported_at DESC LIMIT ?`
      )
      .all(deviceId, limit) as IotDeviceDataRow[]
  }

  findDeviceDataByElderly(elderlyId: string, limit = 50): IotDeviceDataRow[] {
    return this.db
      .prepare<[string, number], IotDeviceDataRow>(
        `SELECT * FROM iot_device_data WHERE elderly_id=? ORDER BY reported_at DESC LIMIT ?`
      )
      .all(elderlyId, limit) as IotDeviceDataRow[]
  }
}
