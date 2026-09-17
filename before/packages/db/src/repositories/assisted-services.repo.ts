import type { Database } from 'better-sqlite3';
import { nanoid } from 'nanoid';
import type {
  AssistedServiceCatalogRow,
  AssistedServiceStats,
  MedicalFollowUpRow,
  MedicalPartnerRow,
  MedicalReferralRow,
  MedicalReferralStatus,
  ProxyPurchaseItemRow,
  ProxyPurchaseOrderRow,
  ProxyPurchaseStatus,
} from '../schema';
import { ChangeLogRepo } from './change-log.repo';

export interface ProxyPurchaseQuery {
  status?: ProxyPurchaseStatus
  category?: ProxyPurchaseOrderRow['category']
  elderlyId?: string
  keyword?: string
}

export interface MedicalReferralQuery {
  status?: MedicalReferralStatus
  partnerId?: string
  elderlyId?: string
  keyword?: string
}

export type NewProxyPurchaseItem = Pick<
  ProxyPurchaseItemRow,
  'item_name' | 'specification' | 'quantity' | 'unit' | 'unit_price_cents' | 'medicine_type' | 'dosage' | 'remark'
>

export type NewProxyPurchaseOrder = Omit<
  ProxyPurchaseOrderRow,
  | 'id' | 'order_no' | 'goods_amount_cents' | 'total_amount_cents' | 'status'
  | 'prescription_verified_by' | 'prescription_verified_at' | 'assignee_id' | 'assignee_name'
  | 'assigned_at' | 'purchased_at' | 'delivery_started_at' | 'delivered_at' | 'signed_by' | 'signed_at'
  | 'settlement_method' | 'settlement_status' | 'bill_id' | 'settled_at' | 'cancel_reason'
  | 'created_at' | 'updated_at' | 'deleted_at'
>

export type NewMedicalReferral = Omit<
  MedicalReferralRow,
  | 'id' | 'referral_no' | 'partner_name' | 'status' | 'partner_confirmed_at' | 'departed_at'
  | 'consultation_started_at' | 'completed_at' | 'diagnosis' | 'treatment_plan' | 'prescription'
  | 'next_visit_at' | 'medical_fee_cents' | 'transport_fee_cents' | 'service_fee_cents'
  | 'total_amount_cents' | 'settlement_status' | 'bill_id' | 'cancel_reason'
  | 'created_at' | 'updated_at' | 'deleted_at'
>

export interface ReferralCompletionInput {
  diagnosis: string
  treatment_plan?: string | null
  prescription?: string | null
  next_visit_at?: string | null
  medical_fee_cents?: number
  transport_fee_cents?: number
  service_fee_cents?: number
  settlement_method?: 'paid' | 'monthly_bill'
}

const PARTNER_FIELDS = new Set([
  'name', 'partner_type', 'hospital_level', 'specialties', 'contact_name', 'contact_phone', 'address',
  'emergency_channel', 'agreement_no', 'agreement_start', 'agreement_end', 'settlement_cycle', 'status', 'remark',
]);
const SERVICE_CATALOG_FIELDS = new Set([
  'code', 'name', 'category', 'charge_mode', 'default_service_fee_cents', 'status', 'sort_order', 'remark',
]);

export class AssistedServicesRepo {
  private changeLog: ChangeLogRepo;

  constructor(private db: Database) {
    this.changeLog = new ChangeLogRepo(db);
  }

  findServiceCatalog(activeOnly = false): AssistedServiceCatalogRow[] {
    const sql = activeOnly
      ? 'SELECT * FROM assisted_service_catalog WHERE deleted_at IS NULL AND status=\'active\' ORDER BY sort_order,name'
      : 'SELECT * FROM assisted_service_catalog WHERE deleted_at IS NULL ORDER BY status,sort_order,name';
    return this.db.prepare<[], AssistedServiceCatalogRow>(sql).all() as AssistedServiceCatalogRow[];
  }

  createServiceCatalog(
    data: Omit<AssistedServiceCatalogRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>,
  ): AssistedServiceCatalogRow {
    if (!data.code.trim() || !data.name.trim()) throw new Error('服务编码和名称不能为空');
    this.assertCents(data.default_service_fee_cents, '默认服务费');
    const now = Date.now();
    const row: AssistedServiceCatalogRow = {
      ...data,
      default_service_fee_cents: data.charge_mode === 'free' ? 0 : data.default_service_fee_cents,
      id: nanoid(), created_at: now, updated_at: now, deleted_at: null,
    };
    this.db.prepare(`
      INSERT INTO assisted_service_catalog
        (id,code,name,category,charge_mode,default_service_fee_cents,status,sort_order,remark,created_at,updated_at,deleted_at)
      VALUES
        (@id,@code,@name,@category,@charge_mode,@default_service_fee_cents,@status,@sort_order,@remark,@created_at,@updated_at,@deleted_at)
    `).run(row);
    this.log('assisted_service_catalog', 'INSERT', row);
    return row;
  }

  updateServiceCatalog(id: string, data: Partial<AssistedServiceCatalogRow>): AssistedServiceCatalogRow {
    const fields = Object.keys(data).filter((field) => SERVICE_CATALOG_FIELDS.has(field));
    if (data.charge_mode === 'free' && !fields.includes('default_service_fee_cents')) {
      fields.push('default_service_fee_cents');
    }
    if (!fields.length) throw new Error('没有可更新的服务项目字段');
    if (data.default_service_fee_cents !== undefined) this.assertCents(data.default_service_fee_cents, '默认服务费');
    const values = Object.fromEntries(fields.map((field) => [field, data[field as keyof typeof data]]));
    if (data.charge_mode === 'free') values.default_service_fee_cents = 0;
    const now = Date.now();
    const result = this.db.prepare(`UPDATE assisted_service_catalog SET ${fields.map((field) => `${field}=@${field}`).join(',')},updated_at=@updated_at WHERE id=@id AND deleted_at IS NULL`)
      .run({ ...values, updated_at: now, id });
    if (!result.changes) throw new Error('代办服务项目不存在');
    const row = this.db.prepare<[string], AssistedServiceCatalogRow>('SELECT * FROM assisted_service_catalog WHERE id=?').get(id);
    if (!row) throw new Error('代办服务项目不存在');
    this.log('assisted_service_catalog', 'UPDATE', row);
    return row;
  }

  findPurchaseOrders(query: ProxyPurchaseQuery = {}): ProxyPurchaseOrderRow[] {
    const where = ['deleted_at IS NULL'];
    const params: Record<string, unknown> = {};
    if (query.status) { where.push('status=@status'); params.status = query.status; }
    if (query.category) { where.push('category=@category'); params.category = query.category; }
    if (query.elderlyId) { where.push('elderly_id=@elderlyId'); params.elderlyId = query.elderlyId; }
    if (query.keyword?.trim()) {
      where.push('(order_no LIKE @keyword OR requester_name LIKE @keyword OR merchant_name LIKE @keyword OR assignee_name LIKE @keyword)');
      params.keyword = `%${query.keyword.trim()}%`;
    }
    return this.db.prepare(
      `SELECT * FROM proxy_purchase_order WHERE ${where.join(' AND ')} ORDER BY created_at DESC`,
    ).all(params) as ProxyPurchaseOrderRow[];
  }

  findPurchaseOrder(id: string): ProxyPurchaseOrderRow {
    const row = this.db.prepare<[string], ProxyPurchaseOrderRow>(
      'SELECT * FROM proxy_purchase_order WHERE id=? AND deleted_at IS NULL',
    ).get(id);
    if (!row) throw new Error('代买订单不存在');
    return row;
  }

  findPurchaseItems(orderId: string): ProxyPurchaseItemRow[] {
    return this.db.prepare<[string], ProxyPurchaseItemRow>(
      'SELECT * FROM proxy_purchase_item WHERE order_id=? ORDER BY created_at,id',
    ).all(orderId) as ProxyPurchaseItemRow[];
  }

  createPurchaseOrder(data: NewProxyPurchaseOrder, items: NewProxyPurchaseItem[]): ProxyPurchaseOrderRow {
    if (!data.elderly_id || !data.requester_name.trim()) throw new Error('请选择老人并填写申请人');
    if (!data.delivery_address.trim()) throw new Error('请填写送达地址');
    if (!items.length) throw new Error('至少添加一项代买商品');
    this.assertCents(data.delivery_fee_cents, '配送费');
    this.assertCents(data.service_fee_cents, '服务费');
    this.assertCents(data.advance_amount_cents, '垫付金额');
    const catalog = data.service_catalog_id
      ? this.db.prepare<[string], AssistedServiceCatalogRow>(
        'SELECT * FROM assisted_service_catalog WHERE id=? AND deleted_at IS NULL AND status=\'active\'',
      ).get(data.service_catalog_id)
      : null;
    if (data.service_catalog_id && !catalog) throw new Error('代办服务项目不存在或已停用');
    const category = catalog?.category ?? data.category;
    const serviceFee = data.charge_mode === 'free'
      ? 0
      : data.charge_mode === 'fixed' && catalog
        ? catalog.default_service_fee_cents
        : data.service_fee_cents;
    const now = Date.now();
    const normalizedItems = items.map((item): ProxyPurchaseItemRow => {
      if (!item.item_name.trim() || !Number.isFinite(item.quantity) || item.quantity <= 0) throw new Error('商品名称和数量填写不完整');
      this.assertCents(item.unit_price_cents, '商品单价');
      return {
        ...item, id: nanoid(), order_id: '', item_name: item.item_name.trim(),
        amount_cents: Math.round(item.quantity * item.unit_price_cents), created_at: now, updated_at: now,
      };
    });
    const requiresPrescription = category === 'medicine' && (
      data.prescription_required === 1 || normalizedItems.some((item) => item.medicine_type === 'prescription')
    );
    const goodsAmount = normalizedItems.reduce((sum, item) => sum + item.amount_cents, 0);
    const row: ProxyPurchaseOrderRow = {
      ...data,
      category,
      service_fee_cents: serviceFee,
      prescription_required: requiresPrescription ? 1 : 0,
      id: nanoid(), order_no: this.number('PP', now), goods_amount_cents: goodsAmount,
      total_amount_cents: goodsAmount + data.delivery_fee_cents + serviceFee,
      status: 'pending', prescription_verified_by: null, prescription_verified_at: null,
      assignee_id: null, assignee_name: null, assigned_at: null, purchased_at: null,
      delivery_started_at: null, delivered_at: null, signed_by: null, signed_at: null, settlement_method: null,
      settlement_status: 'unsettled', bill_id: null, settled_at: null, cancel_reason: null,
      created_at: now, updated_at: now, deleted_at: null,
    };
    normalizedItems.forEach((item) => { item.order_id = row.id; });
    this.db.transaction(() => {
      this.db.prepare(`
        INSERT INTO proxy_purchase_order
          (id,order_no,elderly_id,service_catalog_id,category,charge_mode,requester_name,requester_phone,merchant_name,delivery_address,
           expected_at,goods_amount_cents,delivery_fee_cents,service_fee_cents,total_amount_cents,
           advance_amount_cents,prescription_required,prescription_no,prescription_verified_by,
           prescription_verified_at,status,assignee_id,assignee_name,assigned_at,purchased_at,delivery_started_at,delivered_at,
           signed_by,signed_at,settlement_method,settlement_status,bill_id,settled_at,cancel_reason,
           created_by,created_by_name,remark,created_at,updated_at,deleted_at)
        VALUES
          (@id,@order_no,@elderly_id,@service_catalog_id,@category,@charge_mode,@requester_name,@requester_phone,@merchant_name,@delivery_address,
           @expected_at,@goods_amount_cents,@delivery_fee_cents,@service_fee_cents,@total_amount_cents,
           @advance_amount_cents,@prescription_required,@prescription_no,@prescription_verified_by,
           @prescription_verified_at,@status,@assignee_id,@assignee_name,@assigned_at,@purchased_at,@delivery_started_at,@delivered_at,
           @signed_by,@signed_at,@settlement_method,@settlement_status,@bill_id,@settled_at,@cancel_reason,
           @created_by,@created_by_name,@remark,@created_at,@updated_at,@deleted_at)
      `).run(row);
      const insert = this.db.prepare(`
        INSERT INTO proxy_purchase_item
          (id,order_id,item_name,specification,quantity,unit,unit_price_cents,amount_cents,medicine_type,dosage,remark,created_at,updated_at)
        VALUES
          (@id,@order_id,@item_name,@specification,@quantity,@unit,@unit_price_cents,@amount_cents,@medicine_type,@dosage,@remark,@created_at,@updated_at)
      `);
      normalizedItems.forEach((item) => { insert.run(item); this.log('proxy_purchase_item', 'INSERT', item); });
      this.log('proxy_purchase_order', 'INSERT', row);
    })();
    return row;
  }

  assignPurchase(id: string, assigneeId: string, assigneeName: string): ProxyPurchaseOrderRow {
    if (!assigneeId || !assigneeName.trim()) throw new Error('请选择代办负责人');
    return this.purchaseTransition(id, ['pending', 'assigned'], 'assigned', {
      assignee_id: assigneeId, assignee_name: assigneeName.trim(), assigned_at: Date.now(),
    });
  }

  verifyPrescription(id: string, prescriptionNo: string, verifier: string): ProxyPurchaseOrderRow {
    const order = this.findPurchaseOrder(id);
    if (order.category !== 'medicine') throw new Error('仅药品代买需要处方核验');
    if (!prescriptionNo.trim() || !verifier.trim()) throw new Error('请填写处方编号和核验人');
    return this.purchaseTransition(id, ['pending', 'assigned'], order.status, {
      prescription_no: prescriptionNo.trim(), prescription_verified_by: verifier.trim(), prescription_verified_at: Date.now(),
    });
  }

  startPurchase(id: string): ProxyPurchaseOrderRow {
    const order = this.findPurchaseOrder(id);
    if (order.prescription_required === 1 && !order.prescription_verified_at) throw new Error('处方药购买前必须完成处方核验');
    return this.purchaseTransition(id, ['assigned'], 'purchasing', { purchased_at: Date.now() });
  }

  startDelivery(id: string): ProxyPurchaseOrderRow {
    return this.purchaseTransition(id, ['purchasing'], 'delivering', { delivery_started_at: Date.now() });
  }

  signPurchase(id: string, signedBy: string): ProxyPurchaseOrderRow {
    if (!signedBy.trim()) throw new Error('请填写签收人');
    const now = Date.now();
    return this.purchaseTransition(id, ['delivering'], 'delivered', {
      delivered_at: now, signed_by: signedBy.trim(), signed_at: now,
    });
  }

  settlePurchase(id: string, method: NonNullable<ProxyPurchaseOrderRow['settlement_method']>): ProxyPurchaseOrderRow {
    const order = this.findPurchaseOrder(id);
    if (order.status !== 'delivered') throw new Error('订单签收后才能结算');
    const now = Date.now();
    let billId: string | null = null;
    this.db.transaction(() => {
      if (method === 'monthly_bill' && order.total_amount_cents > 0) {
        billId = this.appendMonthlyBill(order.elderly_id, order.total_amount_cents, `代买服务 ${order.order_no}`, order.remark, now);
      }
      this.db.prepare('UPDATE proxy_purchase_order SET status=\'settled\',settlement_method=?,settlement_status=?,bill_id=?,settled_at=?,updated_at=? WHERE id=?')
        .run(method, method === 'monthly_bill' && order.total_amount_cents > 0 ? 'monthly_bill' : 'paid', billId, now, now, id);
      this.log('proxy_purchase_order', 'UPDATE', this.findPurchaseOrder(id));
    })();
    return this.findPurchaseOrder(id);
  }

  cancelPurchase(id: string, reason: string): ProxyPurchaseOrderRow {
    if (!reason.trim()) throw new Error('请填写取消原因');
    return this.purchaseTransition(id, ['pending', 'assigned', 'purchasing'], 'cancelled', { cancel_reason: reason.trim() });
  }

  findPartners(activeOnly = false): MedicalPartnerRow[] {
    return this.db.prepare<[], MedicalPartnerRow>(
      `SELECT * FROM medical_partner WHERE deleted_at IS NULL${activeOnly ? " AND status='active'" : ''} ORDER BY status,name`,
    ).all() as MedicalPartnerRow[];
  }

  createPartner(data: Omit<MedicalPartnerRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): MedicalPartnerRow {
    if (!data.name.trim()) throw new Error('合作机构名称不能为空');
    const now = Date.now();
    const row: MedicalPartnerRow = { ...data, name: data.name.trim(), id: nanoid(), created_at: now, updated_at: now, deleted_at: null };
    this.db.prepare(`
      INSERT INTO medical_partner
        (id,name,partner_type,hospital_level,specialties,contact_name,contact_phone,address,emergency_channel,
         agreement_no,agreement_start,agreement_end,settlement_cycle,status,remark,created_at,updated_at,deleted_at)
      VALUES
        (@id,@name,@partner_type,@hospital_level,@specialties,@contact_name,@contact_phone,@address,@emergency_channel,
         @agreement_no,@agreement_start,@agreement_end,@settlement_cycle,@status,@remark,@created_at,@updated_at,@deleted_at)
    `).run(row);
    this.log('medical_partner', 'INSERT', row);
    return row;
  }

  updatePartner(id: string, data: Partial<MedicalPartnerRow>): MedicalPartnerRow {
    const fields = Object.keys(data).filter((field) => PARTNER_FIELDS.has(field));
    if (!fields.length) throw new Error('没有可更新的机构字段');
    const now = Date.now();
    const values = Object.fromEntries(fields.map((field) => [field, data[field as keyof typeof data]]));
    const result = this.db.prepare(`UPDATE medical_partner SET ${fields.map((field) => `${field}=@${field}`).join(',')},updated_at=@updated_at WHERE id=@id AND deleted_at IS NULL`)
      .run({ ...values, updated_at: now, id });
    if (!result.changes) throw new Error('合作机构不存在');
    const row = this.db.prepare<[string], MedicalPartnerRow>('SELECT * FROM medical_partner WHERE id=?').get(id)!;
    this.log('medical_partner', 'UPDATE', row);
    return row;
  }

  findReferrals(query: MedicalReferralQuery = {}): MedicalReferralRow[] {
    const where = ['deleted_at IS NULL'];
    const params: Record<string, unknown> = {};
    if (query.status) { where.push('status=@status'); params.status = query.status; }
    if (query.partnerId) { where.push('partner_id=@partnerId'); params.partnerId = query.partnerId; }
    if (query.elderlyId) { where.push('elderly_id=@elderlyId'); params.elderlyId = query.elderlyId; }
    if (query.keyword?.trim()) {
      where.push('(referral_no LIKE @keyword OR partner_name LIKE @keyword OR reason LIKE @keyword OR escort_user_name LIKE @keyword)');
      params.keyword = `%${query.keyword.trim()}%`;
    }
    return this.db.prepare(`SELECT * FROM medical_referral WHERE ${where.join(' AND ')} ORDER BY appointment_at DESC,created_at DESC`)
      .all(params) as MedicalReferralRow[];
  }

  findReferral(id: string): MedicalReferralRow {
    const row = this.db.prepare<[string], MedicalReferralRow>('SELECT * FROM medical_referral WHERE id=? AND deleted_at IS NULL').get(id);
    if (!row) throw new Error('就医协作单不存在');
    return row;
  }

  createReferral(data: NewMedicalReferral): MedicalReferralRow {
    const partner = this.db.prepare<[string], MedicalPartnerRow>('SELECT * FROM medical_partner WHERE id=? AND deleted_at IS NULL AND status=\'active\'').get(data.partner_id);
    if (!partner) throw new Error('请选择有效的合作机构');
    if (!data.elderly_id || !data.appointment_at.trim() || !data.reason.trim()) throw new Error('请选择老人并填写预约时间和就医原因');
    if (data.escort_required === 1 && (!data.escort_user_id || !data.escort_user_name?.trim())) throw new Error('陪诊服务必须指定陪诊人员');
    const now = Date.now();
    const row: MedicalReferralRow = {
      ...data, partner_name: partner.name, id: nanoid(), referral_no: this.number('MR', now), status: 'pending',
      partner_confirmed_at: null, departed_at: null, consultation_started_at: null, completed_at: null,
      diagnosis: null, treatment_plan: null, prescription: null, next_visit_at: null,
      medical_fee_cents: 0, transport_fee_cents: 0, service_fee_cents: 0, total_amount_cents: 0,
      settlement_status: 'unpaid', bill_id: null, cancel_reason: null,
      created_at: now, updated_at: now, deleted_at: null,
    };
    this.db.prepare(`
      INSERT INTO medical_referral
        (id,referral_no,elderly_id,partner_id,partner_name,service_type,priority,appointment_at,department,doctor,
         reason,symptoms,escort_required,escort_user_id,escort_user_name,status,partner_confirmed_at,departed_at,
         consultation_started_at,completed_at,diagnosis,treatment_plan,prescription,next_visit_at,medical_fee_cents,
         transport_fee_cents,service_fee_cents,total_amount_cents,settlement_status,bill_id,cancel_reason,
         created_by,created_by_name,remark,created_at,updated_at,deleted_at)
      VALUES
        (@id,@referral_no,@elderly_id,@partner_id,@partner_name,@service_type,@priority,@appointment_at,@department,@doctor,
         @reason,@symptoms,@escort_required,@escort_user_id,@escort_user_name,@status,@partner_confirmed_at,@departed_at,
         @consultation_started_at,@completed_at,@diagnosis,@treatment_plan,@prescription,@next_visit_at,@medical_fee_cents,
         @transport_fee_cents,@service_fee_cents,@total_amount_cents,@settlement_status,@bill_id,@cancel_reason,
         @created_by,@created_by_name,@remark,@created_at,@updated_at,@deleted_at)
    `).run(row);
    this.log('medical_referral', 'INSERT', row);
    return row;
  }

  confirmReferral(id: string): MedicalReferralRow {
    return this.referralTransition(id, ['pending'], 'confirmed', { partner_confirmed_at: Date.now() });
  }

  departReferral(id: string): MedicalReferralRow {
    return this.referralTransition(id, ['confirmed'], 'departed', { departed_at: Date.now() });
  }

  startConsultation(id: string): MedicalReferralRow {
    return this.referralTransition(id, ['departed'], 'in_consultation', { consultation_started_at: Date.now() });
  }

  completeReferral(id: string, input: ReferralCompletionInput): MedicalReferralRow {
    if (!input.diagnosis.trim()) throw new Error('请填写诊断结果');
    const referral = this.findReferral(id);
    if (referral.status !== 'in_consultation') throw new Error('就诊中的协作单才能完成');
    const medical = input.medical_fee_cents ?? 0;
    const transport = input.transport_fee_cents ?? 0;
    const service = input.service_fee_cents ?? 0
    ;[['医疗费', medical], ['交通费', transport], ['服务费', service]].forEach(([label, value]) => this.assertCents(value as number, label as string));
    const total = medical + transport + service;
    const now = Date.now();
    let billId: string | null = null;
    this.db.transaction(() => {
      if (input.settlement_method === 'monthly_bill' && total > 0) {
        billId = this.appendMonthlyBill(referral.elderly_id, total, `医养协作 ${referral.referral_no}`, input.diagnosis, now);
      }
      this.db.prepare(`
        UPDATE medical_referral SET status='completed',completed_at=?,diagnosis=?,treatment_plan=?,prescription=?,
          next_visit_at=?,medical_fee_cents=?,transport_fee_cents=?,service_fee_cents=?,total_amount_cents=?,
          settlement_status=?,bill_id=?,updated_at=? WHERE id=?
      `).run(now, input.diagnosis.trim(), input.treatment_plan ?? null, input.prescription ?? null,
        input.next_visit_at ?? null, medical, transport, service, total,
        input.settlement_method === 'monthly_bill' && total > 0 ? 'monthly_bill' : 'paid', billId, now, id);
      const visit = {
        id: `visit-${referral.id}`, elderly_id: referral.elderly_id,
        visit_date: new Date(now).toISOString().slice(0, 10), hospital: referral.partner_name,
        department: referral.department, doctor: referral.doctor, diagnosis: input.diagnosis.trim(),
        treatment: [input.treatment_plan, input.prescription].filter(Boolean).join('\n') || null,
        cost: Number((total / 100).toFixed(2)), escort: referral.escort_user_name,
        remark: `医养协作单 ${referral.referral_no}${referral.remark ? `；${referral.remark}` : ''}`,
        created_at: now, updated_at: now, deleted_at: null,
      };
      this.db.prepare(`
        INSERT INTO medical_visit
          (id,elderly_id,visit_date,hospital,department,doctor,diagnosis,treatment,cost,escort,remark,created_at,updated_at,deleted_at)
        VALUES
          (@id,@elderly_id,@visit_date,@hospital,@department,@doctor,@diagnosis,@treatment,@cost,@escort,@remark,@created_at,@updated_at,@deleted_at)
      `).run(visit);
      this.log('medical_visit', 'INSERT', visit);
      this.log('medical_referral', 'UPDATE', this.findReferral(id));
    })();
    return this.findReferral(id);
  }

  cancelReferral(id: string, reason: string): MedicalReferralRow {
    if (!reason.trim()) throw new Error('请填写取消原因');
    return this.referralTransition(id, ['pending', 'confirmed'], 'cancelled', { cancel_reason: reason.trim() });
  }

  findFollowUps(referralId?: string): MedicalFollowUpRow[] {
    return referralId
      ? this.db.prepare<[string], MedicalFollowUpRow>('SELECT * FROM medical_follow_up WHERE referral_id=? ORDER BY follow_up_at DESC').all(referralId) as MedicalFollowUpRow[]
      : this.db.prepare<[], MedicalFollowUpRow>('SELECT * FROM medical_follow_up ORDER BY follow_up_at DESC LIMIT 500').all() as MedicalFollowUpRow[];
  }

  createFollowUp(data: Omit<MedicalFollowUpRow, 'id' | 'elderly_id' | 'created_at' | 'updated_at'>): MedicalFollowUpRow {
    const referral = this.findReferral(data.referral_id);
    if (!['completed', 'follow_up'].includes(referral.status)) throw new Error('就诊完成后才能记录随访');
    if (!data.follow_up_at.trim() || !data.condition.trim() || !data.staff_name.trim()) throw new Error('请填写随访时间、情况和随访人');
    const now = Date.now();
    const row: MedicalFollowUpRow = { ...data, elderly_id: referral.elderly_id, id: nanoid(), created_at: now, updated_at: now };
    this.db.transaction(() => {
      this.db.prepare(`
        INSERT INTO medical_follow_up
          (id,referral_id,elderly_id,follow_up_at,method,condition,medication_compliance,adverse_reaction,
           next_action,next_follow_up_at,staff_id,staff_name,created_at,updated_at)
        VALUES
          (@id,@referral_id,@elderly_id,@follow_up_at,@method,@condition,@medication_compliance,@adverse_reaction,
           @next_action,@next_follow_up_at,@staff_id,@staff_name,@created_at,@updated_at)
      `).run(row);
      this.db.prepare('UPDATE medical_referral SET status=\'follow_up\',updated_at=? WHERE id=?').run(now, referral.id);
      this.log('medical_follow_up', 'INSERT', row);
      this.log('medical_referral', 'UPDATE', this.findReferral(referral.id));
    })();
    return row;
  }

  getStats(): AssistedServiceStats {
    const month = new Date().toISOString().slice(0, 7);
    const purchase = this.db.prepare<[string], { total: number; pending: number; amount: number }>(`
      SELECT COUNT(*) total,
        SUM(CASE WHEN status IN ('pending','assigned','purchasing','delivering','delivered') THEN 1 ELSE 0 END) pending,
        SUM(CASE WHEN substr(datetime(created_at/1000,'unixepoch','localtime'),1,7)=? AND status!='cancelled' THEN total_amount_cents ELSE 0 END) amount
      FROM proxy_purchase_order WHERE deleted_at IS NULL
    `).get(month) ?? { total: 0, pending: 0, amount: 0 };
    const referral = this.db.prepare<[], { total: number; pending: number; follow_up: number }>(`
      SELECT COUNT(*) total,
        SUM(CASE WHEN status IN ('pending','confirmed','departed','in_consultation') THEN 1 ELSE 0 END) pending,
        SUM(CASE WHEN status='follow_up' THEN 1 ELSE 0 END) follow_up
      FROM medical_referral WHERE deleted_at IS NULL
    `).get() ?? { total: 0, pending: 0, follow_up: 0 };
    const active = this.db.prepare<[], { count: number }>('SELECT COUNT(*) count FROM medical_partner WHERE deleted_at IS NULL AND status=\'active\'').get()?.count ?? 0;
    return {
      purchase_total: purchase.total, purchase_pending: purchase.pending ?? 0,
      purchase_month_amount_cents: purchase.amount ?? 0, referral_total: referral.total,
      referral_pending: referral.pending ?? 0, referral_follow_up: referral.follow_up ?? 0, active_partners: active,
    };
  }

  private purchaseTransition(
    id: string, from: ProxyPurchaseStatus[], to: ProxyPurchaseStatus,
    fields: Partial<ProxyPurchaseOrderRow>,
  ): ProxyPurchaseOrderRow {
    const order = this.findPurchaseOrder(id);
    if (!from.includes(order.status)) throw new Error('当前订单状态不允许此操作');
    const now = Date.now();
    const keys = Object.keys(fields);
    this.db.prepare(`UPDATE proxy_purchase_order SET status=@status,${keys.map((key) => `${key}=@${key}`).join(',')},updated_at=@updated_at WHERE id=@id`)
      .run({ ...fields, status: to, updated_at: now, id });
    const row = this.findPurchaseOrder(id);
    this.log('proxy_purchase_order', 'UPDATE', row);
    return row;
  }

  private referralTransition(
    id: string, from: MedicalReferralStatus[], to: MedicalReferralStatus,
    fields: Partial<MedicalReferralRow>,
  ): MedicalReferralRow {
    const row = this.findReferral(id);
    if (!from.includes(row.status)) throw new Error('当前就医协作状态不允许此操作');
    const now = Date.now();
    const keys = Object.keys(fields);
    this.db.prepare(`UPDATE medical_referral SET status=@status,${keys.map((key) => `${key}=@${key}`).join(',')},updated_at=@updated_at WHERE id=@id`)
      .run({ ...fields, status: to, updated_at: now, id });
    const updated = this.findReferral(id);
    this.log('medical_referral', 'UPDATE', updated);
    return updated;
  }

  private appendMonthlyBill(elderlyId: string, amountCents: number, itemName: string, remark: string | null, now: number): string {
    const billMonth = new Date(now).toISOString().slice(0, 7);
    let bill = this.db.prepare<[string, string], { id: string; total: number }>(
      'SELECT id,total FROM monthly_bill WHERE elderly_id=? AND bill_month=? AND deleted_at IS NULL',
    ).get(elderlyId, billMonth);
    const amount = Number((amountCents / 100).toFixed(2));
    if (!bill) {
      bill = { id: nanoid(), total: 0 };
      const billRow = {
        id: bill.id, elderly_id: elderlyId, bill_month: billMonth, total: 0, paid: 0,
        status: 'unpaid', remark: '代办与医养协作自动归集', created_at: now, updated_at: now, deleted_at: null,
      };
      this.db.prepare(`INSERT INTO monthly_bill (id,elderly_id,bill_month,total,paid,status,remark,created_at,updated_at,deleted_at)
        VALUES (@id,@elderly_id,@bill_month,@total,@paid,@status,@remark,@created_at,@updated_at,@deleted_at)`).run(billRow);
      this.log('monthly_bill', 'INSERT', billRow);
    }
    const detail = {
      id: nanoid(), bill_id: bill.id, elderly_id: elderlyId, fee_item_id: null, item_name: itemName,
      quantity: 1, unit_price: amount, amount, remark, created_at: now, updated_at: now,
    };
    this.db.prepare(`INSERT INTO bill_detail (id,bill_id,elderly_id,fee_item_id,item_name,quantity,unit_price,amount,remark,created_at,updated_at)
      VALUES (@id,@bill_id,@elderly_id,@fee_item_id,@item_name,@quantity,@unit_price,@amount,@remark,@created_at,@updated_at)`).run(detail);
    this.db.prepare('UPDATE monthly_bill SET total=ROUND(total+?,2),status=CASE WHEN paid>=ROUND(total+?,2) THEN \'paid\' WHEN paid>0 THEN \'partial\' ELSE \'unpaid\' END,updated_at=? WHERE id=?')
      .run(amount, amount, now, bill.id);
    this.log('bill_detail', 'INSERT', detail);
    const updatedBill = this.db.prepare<[string], Record<string, unknown>>('SELECT * FROM monthly_bill WHERE id=?').get(bill.id)!;
    this.log('monthly_bill', 'UPDATE', updatedBill);
    return bill.id;
  }

  private assertCents(value: number, label: string): void {
    if (!Number.isInteger(value) || value < 0) throw new Error(`${label}必须是非负整数分`);
  }

  private number(prefix: string, timestamp: number): string {
    const date = new Date(timestamp);
    const token = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    return `${prefix}${token}${String(timestamp).slice(-6)}`;
  }

  private log(tableName: string, operation: 'INSERT' | 'UPDATE' | 'DELETE', payload: object): void {
    const id = String((payload as { id?: string }).id ?? '');
    this.changeLog.insert({ table_name: tableName, record_id: id, operation, payload: JSON.stringify(payload) });
  }
}
