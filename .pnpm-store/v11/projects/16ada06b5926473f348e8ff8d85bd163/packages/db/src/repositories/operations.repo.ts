// 养老机构运营与安全台账：所有状态转换在仓储层完成，避免页面绕过业务约束。
import type { Database } from 'better-sqlite3';
import { nanoid } from 'nanoid';
import type {
  CareHandoverRow,
  CareIncidentRow,
  ElderlyDocumentRow,
  FamilyCommunicationRow,
  HealthAlertRow,
  InventoryItemRow,
  InventoryTransactionRow,
  OperationsRiskRow,
  VisitorRecordRow,
} from '../schema';

export class OperationsRepo {
  constructor(private db: Database) {}

  /**
   * 运营中心只读取既有业务表，不复制原始数据。手工台账仍由本仓储的其他方法维护。
   */
  findRiskSummary(): OperationsRiskRow[] {
    return this.db
      .prepare<[], OperationsRiskRow>(`
        SELECT * FROM (
        SELECT 'health:' || ha.id AS id, 'health' AS source, ha.id AS source_id, ha.elderly_id, e.name AS elderly_name,
          '健康预警' AS title, ha.content, ha.severity, ha.status, datetime(ha.opened_at / 1000, 'unixepoch', 'localtime') AS risk_at
        FROM health_alert ha LEFT JOIN elderly e ON e.id=ha.elderly_id
        WHERE ha.status!='resolved'
        UNION ALL
        SELECT 'iot:' || ia.id, 'iot', ia.id, d.elderly_id, e.name,
          '设备告警', ia.title || '：' || ia.content, CASE WHEN ia.severity='critical' THEN 'critical' ELSE 'warning' END, ia.status,
          datetime(ia.last_detected_at / 1000, 'unixepoch', 'localtime')
        FROM iot_device_alert ia JOIN iot_device d ON d.id=ia.device_id LEFT JOIN elderly e ON e.id=d.elderly_id
        WHERE ia.status!='resolved'
        UNION ALL
        SELECT 'medication:' || mr.id, 'medication', mr.id, mr.elderly_id, e.name,
          '用药异常', mo.drug_name || '：' || CASE WHEN mr.status='missed' THEN '漏服' ELSE '拒服' END || COALESCE('（' || mr.remark || '）', ''),
          CASE WHEN mr.status='missed' THEN 'critical' ELSE 'warning' END, mr.status, mr.take_date || ' ' || mr.take_time
        FROM medication_record mr JOIN medication_order mo ON mo.id=mr.order_id LEFT JOIN elderly e ON e.id=mr.elderly_id
        WHERE mr.deleted_at IS NULL AND mr.status IN ('missed','refused') AND date(mr.take_date)>=date('now','-7 days')
        UNION ALL
        SELECT 'care:' || cr.id, 'care', cr.id, cr.elderly_id, e.name,
          '护理未执行', cr.care_type || '：' || cr.content, 'warning', cr.status, cr.record_date
        FROM care_record cr LEFT JOIN elderly e ON e.id=cr.elderly_id
        WHERE cr.deleted_at IS NULL AND cr.status='skipped' AND date(cr.record_date)>=date('now','-7 days')
        UNION ALL
        SELECT 'admission:' || lr.id, 'admission', lr.id, lr.elderly_id, e.name,
          '外出未返院', '预计返院：' || COALESCE(lr.expect_return, '未填写') || COALESCE('；' || lr.reason, ''),
          CASE WHEN lr.expect_return IS NOT NULL AND datetime(lr.expect_return)<datetime('now','localtime') THEN 'critical' ELSE 'warning' END,
          lr.status, lr.leave_date
        FROM leave_record lr LEFT JOIN elderly e ON e.id=lr.elderly_id
        WHERE lr.deleted_at IS NULL AND lr.status='out'
        UNION ALL
        SELECT 'contract:' || c.id, 'contract', c.id, c.elderly_id, e.name,
          '合同临期', c.contract_no || ' 将于 ' || c.end_date || ' 到期', 'warning', c.status, c.end_date
        FROM contract c LEFT JOIN elderly e ON e.id=c.elderly_id
        WHERE c.deleted_at IS NULL AND c.status='active' AND date(c.end_date) BETWEEN date('now') AND date('now','+30 days')
        UNION ALL
        SELECT 'fee:' || b.id, 'fee', b.id, b.elderly_id, e.name,
          '账单待缴', b.bill_month || ' 应收 ' || printf('%.2f', b.total) || '，已收 ' || printf('%.2f', b.paid),
          CASE WHEN b.bill_month<strftime('%Y-%m','now') THEN 'critical' ELSE 'warning' END, b.status, b.bill_month || '-01'
        FROM monthly_bill b LEFT JOIN elderly e ON e.id=b.elderly_id
        WHERE b.deleted_at IS NULL AND b.status IN ('unpaid','partial') AND b.bill_month<=strftime('%Y-%m','now')
        UNION ALL
        SELECT 'inventory:' || i.id, 'inventory', i.id, NULL, NULL,
          CASE WHEN i.quantity<=i.min_quantity THEN '库存不足' ELSE '物资临期' END,
          i.name || '：现存 ' || i.quantity || i.unit || '，预警下限 ' || i.min_quantity || i.unit,
          CASE WHEN i.quantity<=i.min_quantity THEN 'critical' ELSE 'warning' END, 'open', COALESCE(i.expiry_date, datetime(i.updated_at / 1000, 'unixepoch', 'localtime'))
        FROM inventory_item i
        WHERE i.status='active' AND (i.quantity<=i.min_quantity OR (i.expiry_date IS NOT NULL AND date(i.expiry_date)<=date('now','+30 days')))
        UNION ALL
        SELECT 'document:' || d.id, 'document', d.id, d.elderly_id, e.name,
          '文书临期', d.document_type || '：' || d.document_name || '，有效期至 ' || d.expiry_date,
          CASE WHEN date(d.expiry_date)<date('now') THEN 'critical' ELSE 'warning' END, d.status, d.expiry_date
        FROM elderly_document d LEFT JOIN elderly e ON e.id=d.elderly_id
        WHERE d.expiry_date IS NOT NULL AND date(d.expiry_date)<=date('now','+30 days')
        )
        ORDER BY CASE severity WHEN 'critical' THEN 0 ELSE 1 END, risk_at DESC
      `)
      .all() as OperationsRiskRow[];
  }

  private audit(domain: string, recordId: string, action: string, detail: string | null = null): void {
    this.db
      .prepare(`INSERT INTO operations_audit_log (id,domain,record_id,action,detail,created_at) VALUES (?,?,?,?,?,?)`)
      .run(nanoid(), domain, recordId, action, detail, Date.now());
  }

  findHandovers(limit = 100): CareHandoverRow[] {
    return this.db
      .prepare<[number], CareHandoverRow>(
        `SELECT * FROM care_handover ORDER BY handover_date DESC, created_at DESC LIMIT ?`,
      )
      .all(limit) as CareHandoverRow[];
  }

  createHandover(
    data: Omit<
      CareHandoverRow,
      'id' | 'status' | 'acknowledged_at' | 'created_at' | 'updated_at'
    >,
  ): CareHandoverRow {
    const now = Date.now();
    const row: CareHandoverRow = {
      ...data,
      id: nanoid(),
      status: 'pending',
      acknowledged_at: null,
      created_at: now,
      updated_at: now,
    };
    this.db
      .prepare(
        `INSERT INTO care_handover (id,handover_date,shift,outgoing_staff,incoming_staff,resident_summary,abnormal_summary,pending_items,status,acknowledged_at,created_at,updated_at)
         VALUES (@id,@handover_date,@shift,@outgoing_staff,@incoming_staff,@resident_summary,@abnormal_summary,@pending_items,@status,@acknowledged_at,@created_at,@updated_at)`,
      )
      .run(row);
    this.audit('handover', row.id, 'create');
    return row;
  }

  acknowledgeHandover(id: string, incomingStaff: string): void {
    const result = this.db
      .prepare(
        `UPDATE care_handover SET status='acknowledged', incoming_staff=?, acknowledged_at=?, updated_at=? WHERE id=? AND status='pending'`,
      )
      .run(incomingStaff, Date.now(), Date.now(), id);
    if (!result.changes) throw new Error('该交接班记录已确认或不存在');
    this.audit('handover', id, 'acknowledge', incomingStaff);
  }

  findIncidents(includeClosed = true): CareIncidentRow[] {
    const sql = includeClosed
      ? `SELECT * FROM care_incident ORDER BY occurred_at DESC`
      : `SELECT * FROM care_incident WHERE status!='closed' ORDER BY occurred_at DESC`;
    return this.db.prepare<[], CareIncidentRow>(sql).all() as CareIncidentRow[];
  }

  createIncident(
    data: Omit<
      CareIncidentRow,
      | 'id'
      | 'family_notified_at'
      | 'status'
      | 'close_note'
      | 'closed_at'
      | 'created_at'
      | 'updated_at'
    >,
  ): CareIncidentRow {
    const now = Date.now();
    const row: CareIncidentRow = {
      ...data,
      id: nanoid(),
      family_notified_at: null,
      status: 'reported',
      close_note: null,
      closed_at: null,
      created_at: now,
      updated_at: now,
    };
    this.db
      .prepare(
        `INSERT INTO care_incident (id,elderly_id,incident_type,severity,occurred_at,location,description,immediate_action,responsible,family_notified_at,status,close_note,closed_at,created_at,updated_at)
         VALUES (@id,@elderly_id,@incident_type,@severity,@occurred_at,@location,@description,@immediate_action,@responsible,@family_notified_at,@status,@close_note,@closed_at,@created_at,@updated_at)`,
      )
      .run(row);
    this.audit('incident', row.id, 'report', row.description);
    return row;
  }

  startIncident(id: string, responsible: string | null): void {
    const result = this.db
      .prepare(
        `UPDATE care_incident SET status='processing', responsible=COALESCE(?, responsible), updated_at=? WHERE id=? AND status='reported'`,
      )
      .run(responsible, Date.now(), id);
    if (!result.changes) throw new Error('仅“已上报”事件可进入处理中');
    this.audit('incident', id, 'start', responsible);
  }

  notifyIncidentFamily(id: string): void {
    const result = this.db
      .prepare(
        `UPDATE care_incident SET family_notified_at=?, updated_at=? WHERE id=? AND status!='closed' AND family_notified_at IS NULL`,
      )
      .run(Date.now(), Date.now(), id);
    if (!result.changes) throw new Error('事件已关闭、已通知或不存在');
    this.audit('incident', id, 'notify_family');
  }

  closeIncident(id: string, closeNote: string): void {
    if (!closeNote.trim()) throw new Error('请填写处置结果和复盘说明');
    const result = this.db
      .prepare(
        `UPDATE care_incident SET status='closed', close_note=?, closed_at=?, updated_at=? WHERE id=? AND status='processing'`,
      )
      .run(closeNote.trim(), Date.now(), Date.now(), id);
    if (!result.changes) throw new Error('事件须先进入处理中后才能关闭');
    this.audit('incident', id, 'close', closeNote.trim());
  }

  findVisitors(includeFinished = true): VisitorRecordRow[] {
    const sql = includeFinished
      ? `SELECT * FROM visitor_record ORDER BY visit_at DESC`
      : `SELECT * FROM visitor_record WHERE status IN ('scheduled','checked_in') ORDER BY visit_at ASC`;
    return this.db.prepare<[], VisitorRecordRow>(sql).all() as VisitorRecordRow[];
  }

  createVisitor(
    data: Omit<VisitorRecordRow, 'id' | 'leave_at' | 'status' | 'created_at' | 'updated_at'>,
  ): VisitorRecordRow {
    const now = Date.now();
    const row: VisitorRecordRow = {
      ...data,
      id: nanoid(),
      leave_at: null,
      status: 'scheduled',
      created_at: now,
      updated_at: now,
    };
    this.db
      .prepare(
        `INSERT INTO visitor_record (id,elderly_id,visitor_name,relation,phone,visit_at,leave_at,purpose,status,approved_by,remark,created_at,updated_at)
         VALUES (@id,@elderly_id,@visitor_name,@relation,@phone,@visit_at,@leave_at,@purpose,@status,@approved_by,@remark,@created_at,@updated_at)`,
      )
      .run(row);
    this.audit('visitor', row.id, 'create', row.visitor_name);
    return row;
  }

  checkInVisitor(id: string): void {
    const result = this.db
      .prepare(
        `UPDATE visitor_record SET status='checked_in', updated_at=? WHERE id=? AND status='scheduled'`,
      )
      .run(Date.now(), id);
    if (!result.changes) throw new Error('仅预约中的探视可签到');
    this.audit('visitor', id, 'check_in');
  }

  checkOutVisitor(id: string, leaveAt: string): void {
    const result = this.db
      .prepare(
        `UPDATE visitor_record SET status='checked_out', leave_at=?, updated_at=? WHERE id=? AND status='checked_in'`,
      )
      .run(leaveAt, Date.now(), id);
    if (!result.changes) throw new Error('仅已签到的探视可签离');
    this.audit('visitor', id, 'check_out', leaveAt);
  }

  cancelVisitor(id: string): void {
    const result = this.db
      .prepare(
        `UPDATE visitor_record SET status='cancelled', updated_at=? WHERE id=? AND status='scheduled'`,
      )
      .run(Date.now(), id);
    if (!result.changes) throw new Error('仅预约中的探视可取消');
    this.audit('visitor', id, 'cancel');
  }

  findCommunications(openOnly = false): FamilyCommunicationRow[] {
    const sql = openOnly
      ? `SELECT * FROM family_communication WHERE status='open' ORDER BY communicated_at DESC`
      : `SELECT * FROM family_communication ORDER BY communicated_at DESC`;
    return this.db.prepare<[], FamilyCommunicationRow>(sql).all() as FamilyCommunicationRow[];
  }

  createCommunication(
    data: Omit<FamilyCommunicationRow, 'id' | 'status' | 'closed_at' | 'created_at' | 'updated_at'>,
  ): FamilyCommunicationRow {
    const now = Date.now();
    const row: FamilyCommunicationRow = {
      ...data,
      id: nanoid(),
      status: 'open',
      closed_at: null,
      created_at: now,
      updated_at: now,
    };
    this.db
      .prepare(
        `INSERT INTO family_communication (id,elderly_id,contact_name,channel,communicated_at,content,follow_up,communicator,status,closed_at,created_at,updated_at)
         VALUES (@id,@elderly_id,@contact_name,@channel,@communicated_at,@content,@follow_up,@communicator,@status,@closed_at,@created_at,@updated_at)`,
      )
      .run(row);
    this.audit('communication', row.id, 'create', row.content);
    return row;
  }

  closeCommunication(id: string): void {
    const result = this.db
      .prepare(
        `UPDATE family_communication SET status='closed', closed_at=?, updated_at=? WHERE id=? AND status='open'`,
      )
      .run(Date.now(), Date.now(), id);
    if (!result.changes) throw new Error('该沟通事项已关闭或不存在');
    this.audit('communication', id, 'close');
  }

  findInventory(): InventoryItemRow[] {
    return this.db
      .prepare<[], InventoryItemRow>(
        `SELECT * FROM inventory_item WHERE status='active' ORDER BY category, expiry_date IS NULL, expiry_date, name`,
      )
      .all() as InventoryItemRow[];
  }

  createInventoryItem(
    data: Omit<InventoryItemRow, 'id' | 'created_at' | 'updated_at'>,
  ): InventoryItemRow {
    if (data.quantity < 0 || data.min_quantity < 0) throw new Error('库存数量不能小于零');
    const now = Date.now();
    const row: InventoryItemRow = { ...data, id: nanoid(), created_at: now, updated_at: now };
    this.db
      .prepare(
        `INSERT INTO inventory_item (id,category,name,specification,unit,quantity,min_quantity,expiry_date,supplier,status,remark,created_at,updated_at)
         VALUES (@id,@category,@name,@specification,@unit,@quantity,@min_quantity,@expiry_date,@supplier,@status,@remark,@created_at,@updated_at)`,
      )
      .run(row);
    this.audit('inventory', row.id, 'create', row.name);
    return row;
  }

  findInventoryTransactions(itemId: string): InventoryTransactionRow[] {
    return this.db
      .prepare<[string], InventoryTransactionRow>(
        `SELECT * FROM inventory_transaction WHERE item_id=? ORDER BY occurred_at DESC, created_at DESC LIMIT 100`,
      )
      .all(itemId) as InventoryTransactionRow[];
  }

  transactInventory(
    data: Omit<InventoryTransactionRow, 'id' | 'created_at'>,
  ): InventoryTransactionRow {
    if (data.transaction_type === 'adjust' && data.quantity === 0) {
      throw new Error('盘点调整数量不能为零');
    }
    if (data.transaction_type !== 'adjust' && data.quantity <= 0) {
      throw new Error('出入库数量必须大于零');
    }
    const item = this.db
      .prepare<[string], InventoryItemRow>(`SELECT * FROM inventory_item WHERE id=? AND status='active'`)
      .get(data.item_id);
    if (!item) throw new Error('库存物品不存在或已停用');
    const delta = data.transaction_type === 'out' ? -data.quantity : data.quantity;
    if (item.quantity + delta < 0) throw new Error('库存不足，无法出库');
    const now = Date.now();
    const row: InventoryTransactionRow = { ...data, id: nanoid(), created_at: now };
    this.db.transaction(() => {
      this.db.prepare(`UPDATE inventory_item SET quantity=quantity+?, updated_at=? WHERE id=?`).run(delta, now, item.id);
      this.db
        .prepare(
          `INSERT INTO inventory_transaction (id,item_id,transaction_type,quantity,occurred_at,operator,reference_no,remark,created_at)
           VALUES (@id,@item_id,@transaction_type,@quantity,@occurred_at,@operator,@reference_no,@remark,@created_at)`,
        )
        .run(row);
    })();
    this.audit('inventory', item.id, `transaction:${data.transaction_type}`, String(data.quantity));
    return row;
  }

  findDocuments(elderlyId?: string): ElderlyDocumentRow[] {
    this.refreshDocumentStatuses();
    const sql = elderlyId
      ? `SELECT * FROM elderly_document WHERE elderly_id=? ORDER BY expiry_date IS NULL, expiry_date, created_at DESC`
      : `SELECT * FROM elderly_document ORDER BY expiry_date IS NULL, expiry_date, created_at DESC`;
    return elderlyId
      ? (this.db.prepare<[string], ElderlyDocumentRow>(sql).all(elderlyId) as ElderlyDocumentRow[])
      : (this.db.prepare<[], ElderlyDocumentRow>(sql).all() as ElderlyDocumentRow[]);
  }

  private refreshDocumentStatuses(): void {
    const now = Date.now();
    this.db.prepare(`UPDATE elderly_document SET status='expired', updated_at=? WHERE expiry_date IS NOT NULL AND date(expiry_date)<date('now') AND status!='expired'`).run(now);
    this.db.prepare(`UPDATE elderly_document SET status='expiring', updated_at=? WHERE expiry_date IS NOT NULL AND date(expiry_date)>=date('now') AND date(expiry_date)<=date('now','+30 days') AND status='valid'`).run(now);
  }

  createDocument(
    data: Omit<ElderlyDocumentRow, 'id' | 'status' | 'created_at' | 'updated_at'>,
  ): ElderlyDocumentRow {
    const now = Date.now();
    const status: ElderlyDocumentRow['status'] = data.expiry_date && data.expiry_date.slice(0, 10) < new Date().toISOString().slice(0, 10) ? 'expired' : 'valid';
    const row: ElderlyDocumentRow = { ...data, id: nanoid(), status, created_at: now, updated_at: now };
    this.db
      .prepare(
        `INSERT INTO elderly_document (id,elderly_id,document_type,document_name,file_path,signed_at,expiry_date,status,custodian,remark,created_at,updated_at)
         VALUES (@id,@elderly_id,@document_type,@document_name,@file_path,@signed_at,@expiry_date,@status,@custodian,@remark,@created_at,@updated_at)`,
      )
      .run(row);
    this.audit('document', row.id, 'archive', row.document_name);
    return row;
  }

  findHealthAlerts(includeResolved = false): HealthAlertRow[] {
    const sql = includeResolved
      ? `SELECT * FROM health_alert ORDER BY opened_at DESC`
      : `SELECT * FROM health_alert WHERE status!='resolved' ORDER BY opened_at DESC`;
    return this.db.prepare<[], HealthAlertRow>(sql).all() as HealthAlertRow[];
  }

  startHealthAlert(id: string): void {
    const result = this.db.prepare(`UPDATE health_alert SET status='processing' WHERE id=? AND status='open'`).run(id);
    if (!result.changes) throw new Error('仅待处理预警可开始处置');
    this.audit('health_alert', id, 'start');
  }

  resolveHealthAlert(id: string, resolver: string, resolution: string): void {
    if (!resolution.trim()) throw new Error('请填写预警处置说明');
    const result = this.db
      .prepare(
        `UPDATE health_alert SET status='resolved', resolver=?, resolution=?, resolved_at=? WHERE id=? AND status='processing'`,
      )
      .run(resolver || null, resolution.trim(), Date.now(), id);
    if (!result.changes) throw new Error('预警须先开始处置后才能关闭');
    this.audit('health_alert', id, 'resolve', resolution.trim());
  }
}
