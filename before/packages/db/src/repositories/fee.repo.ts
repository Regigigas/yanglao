// packages/db/src/repositories/fee.repo.ts
// 费用管理仓库（费用项目/押金/账单/收款）

import type { Database } from 'better-sqlite3'
import { nanoid } from 'nanoid'
import type {
  FeeItemRow,
  DepositRecordRow,
  MonthlyBillRow,
  BillDetailRow,
  PaymentRecordRow,
} from '../schema'

type NewBillDetail = Pick<BillDetailRow, 'fee_item_id' | 'item_name' | 'quantity' | 'unit_price' | 'amount' | 'remark'>

export class FeeRepo {
  constructor(private db: Database) {}

  // ─── 费用项目 ──────────────────────────────────────────────
  findAllFeeItems(activeOnly = false): FeeItemRow[] {
    const sql = activeOnly
      ? `SELECT * FROM fee_item WHERE deleted_at IS NULL AND status='active' ORDER BY category, name`
      : `SELECT * FROM fee_item WHERE deleted_at IS NULL ORDER BY category, name`
    return this.db.prepare<[], FeeItemRow>(sql).all() as FeeItemRow[]
  }

  insertFeeItem(data: Omit<FeeItemRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): FeeItemRow {
    const now = Date.now()
    const row: FeeItemRow = { ...data, id: nanoid(), created_at: now, updated_at: now, deleted_at: null }
    this.db
      .prepare(`INSERT INTO fee_item (id,name,category,unit_price,unit,is_required,status,remark,created_at,updated_at,deleted_at)
        VALUES (@id,@name,@category,@unit_price,@unit,@is_required,@status,@remark,@created_at,@updated_at,@deleted_at)`)
      .run(row)
    return row
  }

  updateFeeItem(id: string, data: Partial<Omit<FeeItemRow, 'id' | 'created_at' | 'deleted_at'>>): void {
    const now = Date.now()
    const fields = Object.keys(data)
    if (!fields.length) return
    const sets = [...fields, 'updated_at'].map(f => `${f}=@${f}`).join(',')
    this.db.prepare(`UPDATE fee_item SET ${sets} WHERE id=@id`).run({ ...data, updated_at: now, id })
  }

  deleteFeeItem(id: string): void {
    this.db.prepare(`UPDATE fee_item SET deleted_at=?, updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id)
  }

  // ─── 押金记录 ──────────────────────────────────────────────
  findDeposits(elderlyId: string): DepositRecordRow[] {
    return this.db
      .prepare<[string], DepositRecordRow>(
        `SELECT * FROM deposit_record WHERE elderly_id=? AND deleted_at IS NULL ORDER BY pay_date DESC`
      )
      .all(elderlyId) as DepositRecordRow[]
  }

  getDepositBalance(elderlyId: string): number {
    const row = this.db
      .prepare<[string, string, string], { balance: number }>(
        `SELECT COALESCE(SUM(CASE WHEN type='deposit' THEN amount ELSE -amount END), 0) AS balance
         FROM deposit_record WHERE elderly_id=? AND deleted_at IS NULL`
      )
      .get(elderlyId, 'deposit', 'refund') as { balance: number } | undefined
    return row?.balance ?? 0
  }

  insertDeposit(data: Omit<DepositRecordRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): DepositRecordRow {
    if (!Number.isFinite(data.amount) || data.amount <= 0) throw new Error('押金金额必须大于 0')
    if (data.type === 'refund' && data.amount > this.getDepositBalance(data.elderly_id) + 0.000001) {
      throw new Error('退款金额不能超过当前押金余额')
    }
    const now = Date.now()
    const row: DepositRecordRow = { ...data, id: nanoid(), created_at: now, updated_at: now, deleted_at: null }
    this.db
      .prepare(`INSERT INTO deposit_record (id,elderly_id,amount,type,pay_method,pay_date,operator,remark,created_at,updated_at,deleted_at)
        VALUES (@id,@elderly_id,@amount,@type,@pay_method,@pay_date,@operator,@remark,@created_at,@updated_at,@deleted_at)`)
      .run(row)
    return row
  }

  // ─── 月度账单 ──────────────────────────────────────────────
  findBills(elderlyId?: string): MonthlyBillRow[] {
    if (elderlyId) {
      return this.db
        .prepare<[string], MonthlyBillRow>(
          `SELECT * FROM monthly_bill WHERE elderly_id=? AND deleted_at IS NULL ORDER BY bill_month DESC`
        )
        .all(elderlyId) as MonthlyBillRow[]
    }
    return this.db
      .prepare<[], MonthlyBillRow>(`SELECT * FROM monthly_bill WHERE deleted_at IS NULL ORDER BY bill_month DESC, elderly_id`)
      .all() as MonthlyBillRow[]
  }

  findBill(elderlyId: string, billMonth: string): MonthlyBillRow | null {
    return (
      (this.db
        .prepare<[string, string], MonthlyBillRow>(
          `SELECT * FROM monthly_bill WHERE elderly_id=? AND bill_month=? AND deleted_at IS NULL`
        )
        .get(elderlyId, billMonth) as MonthlyBillRow | undefined) ?? null
    )
  }

  findOverdueBills(): MonthlyBillRow[] {
    return this.db
      .prepare<[], MonthlyBillRow>(
        `SELECT * FROM monthly_bill WHERE deleted_at IS NULL AND status IN ('unpaid','partial') ORDER BY bill_month ASC`
      )
      .all() as MonthlyBillRow[]
  }

  insertBill(data: Omit<MonthlyBillRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): MonthlyBillRow {
    const now = Date.now()
    const row: MonthlyBillRow = { ...data, id: nanoid(), created_at: now, updated_at: now, deleted_at: null }
    this.db
      .prepare(`INSERT INTO monthly_bill (id,elderly_id,bill_month,total,paid,status,remark,created_at,updated_at,deleted_at)
        VALUES (@id,@elderly_id,@bill_month,@total,@paid,@status,@remark,@created_at,@updated_at,@deleted_at)`)
      .run(row)
    return row
  }

  insertBillWithDetails(
    data: Omit<MonthlyBillRow, 'id' | 'total' | 'paid' | 'status' | 'created_at' | 'updated_at' | 'deleted_at'>,
    details: NewBillDetail[],
  ): MonthlyBillRow {
    if (!details.length) throw new Error('请至少添加一项账单明细')

    const normalizedDetails = details.map(detail => {
      const quantity = Number(detail.quantity)
      const unitPrice = Number(detail.unit_price)
      if (!detail.item_name.trim() || !Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(unitPrice) || unitPrice < 0) {
        throw new Error('账单明细填写不完整')
      }
      return { ...detail, quantity, unit_price: unitPrice, amount: Number((quantity * unitPrice).toFixed(2)) }
    })
    const total = Number(normalizedDetails.reduce((sum, detail) => sum + detail.amount, 0).toFixed(2))
    if (!Number.isFinite(total) || total <= 0) throw new Error('账单金额必须大于 0')

    const now = Date.now()
    const bill: MonthlyBillRow = {
      ...data,
      id: nanoid(),
      total,
      paid: 0,
      status: 'unpaid',
      created_at: now,
      updated_at: now,
      deleted_at: null,
    }

    this.db.transaction(() => {
      this.db
        .prepare(`INSERT INTO monthly_bill (id,elderly_id,bill_month,total,paid,status,remark,created_at,updated_at,deleted_at)
          VALUES (@id,@elderly_id,@bill_month,@total,@paid,@status,@remark,@created_at,@updated_at,@deleted_at)`)
        .run(bill)

      const insertDetail = this.db.prepare(`INSERT INTO bill_detail (id,bill_id,elderly_id,fee_item_id,item_name,quantity,unit_price,amount,remark,created_at,updated_at)
        VALUES (@id,@bill_id,@elderly_id,@fee_item_id,@item_name,@quantity,@unit_price,@amount,@remark,@created_at,@updated_at)`)
      for (const detail of normalizedDetails) {
        insertDetail.run({
          ...detail,
          id: nanoid(),
          bill_id: bill.id,
          elderly_id: bill.elderly_id,
          created_at: now,
          updated_at: now,
        })
      }
    })()

    return bill
  }

  updateBill(id: string, data: Partial<Omit<MonthlyBillRow, 'id' | 'created_at' | 'deleted_at'>>): void {
    const now = Date.now()
    const fields = Object.keys(data)
    if (!fields.length) return
    const sets = [...fields, 'updated_at'].map(f => `${f}=@${f}`).join(',')
    this.db.prepare(`UPDATE monthly_bill SET ${sets} WHERE id=@id`).run({ ...data, updated_at: now, id })
  }

  // ─── 账单明细 ──────────────────────────────────────────────
  findBillDetails(billId: string): BillDetailRow[] {
    return this.db
      .prepare<[string], BillDetailRow>(`SELECT * FROM bill_detail WHERE bill_id=? ORDER BY created_at`)
      .all(billId) as BillDetailRow[]
  }

  insertBillDetail(data: Omit<BillDetailRow, 'id' | 'created_at' | 'updated_at'>): BillDetailRow {
    const now = Date.now()
    const row: BillDetailRow = { ...data, id: nanoid(), created_at: now, updated_at: now }
    this.db
      .prepare(`INSERT INTO bill_detail (id,bill_id,elderly_id,fee_item_id,item_name,quantity,unit_price,amount,remark,created_at,updated_at)
        VALUES (@id,@bill_id,@elderly_id,@fee_item_id,@item_name,@quantity,@unit_price,@amount,@remark,@created_at,@updated_at)`)
      .run(row)
    return row
  }

  // ─── 收款记录 ──────────────────────────────────────────────
  findPayments(elderlyId?: string, billId?: string): PaymentRecordRow[] {
    if (billId) {
      return this.db
        .prepare<[string], PaymentRecordRow>(`SELECT * FROM payment_record WHERE bill_id=? AND deleted_at IS NULL ORDER BY pay_date DESC`)
        .all(billId) as PaymentRecordRow[]
    }
    if (elderlyId) {
      return this.db
        .prepare<[string], PaymentRecordRow>(
          `SELECT * FROM payment_record WHERE elderly_id=? AND deleted_at IS NULL ORDER BY pay_date DESC`
        )
        .all(elderlyId) as PaymentRecordRow[]
    }
    return this.db
      .prepare<[], PaymentRecordRow>(`SELECT * FROM payment_record WHERE deleted_at IS NULL ORDER BY pay_date DESC LIMIT 200`)
      .all() as PaymentRecordRow[]
  }

  insertPayment(data: Omit<PaymentRecordRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): PaymentRecordRow {
    if (!Number.isFinite(data.amount) || data.amount <= 0) throw new Error('收款金额必须大于 0')
    const now = Date.now()
    const row: PaymentRecordRow = { ...data, id: nanoid(), created_at: now, updated_at: now, deleted_at: null }
    this.db.transaction(() => {
      if (data.bill_id) {
        const bill = this.db
          .prepare<[string], MonthlyBillRow>(`SELECT * FROM monthly_bill WHERE id=? AND deleted_at IS NULL`)
          .get(data.bill_id)
        if (!bill) throw new Error('账单不存在或已删除')
        if (bill.elderly_id !== data.elderly_id) throw new Error('收款老人和账单不匹配')
        if (bill.status === 'paid' || data.amount > bill.total - bill.paid + 0.000001) throw new Error('收款金额不能超过未收金额')
      }

      this.db
        .prepare(`INSERT INTO payment_record (id,elderly_id,bill_id,amount,pay_method,pay_date,operator,receipt_no,remark,created_at,updated_at,deleted_at)
          VALUES (@id,@elderly_id,@bill_id,@amount,@pay_method,@pay_date,@operator,@receipt_no,@remark,@created_at,@updated_at,@deleted_at)`)
        .run(row)

      if (data.bill_id) {
        this.db.prepare(`
          UPDATE monthly_bill SET
            paid = (SELECT COALESCE(SUM(amount),0) FROM payment_record WHERE bill_id=? AND deleted_at IS NULL),
            status = CASE
              WHEN (SELECT COALESCE(SUM(amount),0) FROM payment_record WHERE bill_id=? AND deleted_at IS NULL) = 0 THEN 'unpaid'
              WHEN (SELECT COALESCE(SUM(amount),0) FROM payment_record WHERE bill_id=? AND deleted_at IS NULL) >= total THEN 'paid'
              ELSE 'partial'
            END,
            updated_at = ?
          WHERE id=?
        `).run(data.bill_id, data.bill_id, data.bill_id, now, data.bill_id)
      }
    })()
    return row
  }

  /** 财务汇总统计 */
  getFinancialStats(month: string): { total_billed: number; total_paid: number; overdue: number } {
    const row = this.db
      .prepare<[string], { total_billed: number; total_paid: number; overdue: number }>(
        `SELECT
          COALESCE(SUM(total), 0) AS total_billed,
          COALESCE(SUM(paid), 0) AS total_paid,
          COALESCE(SUM(CASE WHEN status != 'paid' THEN total - paid ELSE 0 END), 0) AS overdue
        FROM monthly_bill WHERE bill_month=? AND deleted_at IS NULL`
      )
      .get(month) as { total_billed: number; total_paid: number; overdue: number }
    return row
  }
}
