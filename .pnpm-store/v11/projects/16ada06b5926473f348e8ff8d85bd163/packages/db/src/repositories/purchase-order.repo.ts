// packages/db/src/repositories/purchase-order.repo.ts
import type { Database } from 'better-sqlite3'
import { nanoid } from 'nanoid'
import type { PurchaseOrderRow, PurchaseOrderItemRow } from '../schema'

export class PurchaseOrderRepo {
  constructor(private db: Database) {}

  // ─── 采购单 ──────────────────────────────────────────────────
  findAll(status?: string): PurchaseOrderRow[] {
    if (status) {
      return this.db
        .prepare<[string], PurchaseOrderRow>(
          `SELECT * FROM purchase_order WHERE deleted_at IS NULL AND status=? ORDER BY created_at DESC`
        )
        .all(status) as PurchaseOrderRow[]
    }
    return this.db
      .prepare<[], PurchaseOrderRow>(
        `SELECT * FROM purchase_order WHERE deleted_at IS NULL ORDER BY created_at DESC`
      )
      .all() as PurchaseOrderRow[]
  }

  findById(id: string): PurchaseOrderRow | undefined {
    return this.db
      .prepare<[string], PurchaseOrderRow>(
        `SELECT * FROM purchase_order WHERE id=? AND deleted_at IS NULL`
      )
      .get(id) as PurchaseOrderRow | undefined
  }

  create(
    order: Omit<PurchaseOrderRow, 'id' | 'order_no' | 'created_at' | 'updated_at' | 'deleted_at'>,
    items: Omit<PurchaseOrderItemRow, 'id' | 'order_id' | 'created_at' | 'updated_at'>[]
  ): PurchaseOrderRow {
    const now = Date.now()
    const orderId = nanoid()
    const orderNo = `PO${now}`

    let totalAmount = 0
    const itemRows: PurchaseOrderItemRow[] = items.map(it => {
      const amount = Number(((it.quantity ?? 0) * (it.unit_price ?? 0)).toFixed(2))
      totalAmount += amount
      return {
        ...it,
        id: nanoid(),
        order_id: orderId,
        amount,
        received_qty: 0,
        created_at: now,
        updated_at: now,
      }
    })

    const row: PurchaseOrderRow = {
      ...order,
      id: orderId,
      order_no: orderNo,
      total_amount: Number(totalAmount.toFixed(2)),
      paid_amount: 0,
      created_at: now,
      updated_at: now,
      deleted_at: null,
    }

    const insertOrder = this.db.prepare(`
      INSERT INTO purchase_order
        (id,order_no,supplier_id,supplier_name,order_date,expect_date,total_amount,
         paid_amount,status,applicant,remark,created_at,updated_at,deleted_at)
      VALUES
        (@id,@order_no,@supplier_id,@supplier_name,@order_date,@expect_date,@total_amount,
         @paid_amount,@status,@applicant,@remark,@created_at,@updated_at,@deleted_at)
    `)
    const insertItem = this.db.prepare(`
      INSERT INTO purchase_order_item
        (id,order_id,item_name,category,specification,unit,quantity,unit_price,amount,received_qty,remark,created_at,updated_at)
      VALUES
        (@id,@order_id,@item_name,@category,@specification,@unit,@quantity,@unit_price,@amount,@received_qty,@remark,@created_at,@updated_at)
    `)

    const tx = this.db.transaction(() => {
      insertOrder.run(row)
      for (const item of itemRows) insertItem.run(item)
    })
    tx()
    return row
  }

  updateStatus(
    id: string,
    status: PurchaseOrderRow['status'],
    operatorName?: string
  ): void {
    const now = Date.now()
    const extra: Record<string, unknown> = { status, updated_at: now }
    if (status === 'approved') { extra.approver = operatorName ?? null; extra.approved_at = now }
    if (status === 'received') { extra.received_at = now }
    const sets = Object.keys(extra).map(k => `${k}=@${k}`).join(',')
    this.db.prepare(`UPDATE purchase_order SET ${sets} WHERE id=@id`).run({ ...extra, id })
  }

  delete(id: string): void {
    this.db.prepare(`UPDATE purchase_order SET deleted_at=?,updated_at=? WHERE id=?`)
      .run(Date.now(), Date.now(), id)
  }

  // ─── 明细 ────────────────────────────────────────────────────
  findItems(orderId: string): PurchaseOrderItemRow[] {
    return this.db
      .prepare<[string], PurchaseOrderItemRow>(
        `SELECT * FROM purchase_order_item WHERE order_id=? ORDER BY created_at`
      )
      .all(orderId) as PurchaseOrderItemRow[]
  }

  // ─── 统计 ────────────────────────────────────────────────────
  getStats(): {
    total: number; draft: number; pending: number; approved: number; received: number; total_amount: number
  } {
    return this.db.prepare<[], {
      total: number; draft: number; pending: number; approved: number; received: number; total_amount: number
    }>(`
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN status='draft'    THEN 1 ELSE 0 END) AS draft,
        SUM(CASE WHEN status='pending'  THEN 1 ELSE 0 END) AS pending,
        SUM(CASE WHEN status='approved' THEN 1 ELSE 0 END) AS approved,
        SUM(CASE WHEN status='received' THEN 1 ELSE 0 END) AS received,
        COALESCE(SUM(total_amount),0)                      AS total_amount
      FROM purchase_order WHERE deleted_at IS NULL
    `).get() as any
  }
}
