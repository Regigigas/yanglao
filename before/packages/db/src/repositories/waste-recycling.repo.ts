import type { Database } from 'better-sqlite3'
import { nanoid } from 'nanoid'
import type {
  WasteCategoryRow,
  WasteInventoryLotRow,
  WasteInventoryTransactionRow,
  WasteOrderStatus,
  WastePointsLedgerRow,
  WasteRecyclingItemRow,
  WasteRecyclingOrderRow,
  WasteRecyclingStats,
  WasteSettlementRow,
} from '../schema'
import { ChangeLogRepo } from './change-log.repo'

export interface WasteOrderQuery {
  status?: WasteOrderStatus
  keyword?: string
  startDate?: string
  endDate?: string
}

export interface WasteWeighItemInput {
  category_id: string
  material_name: string
  gross_weight: number
  tare_weight: number
  unit_price_cents?: number
  quality_grade?: WasteRecyclingItemRow['quality_grade']
  remark?: string | null
}

export interface WasteSettlementInput {
  method: WasteSettlementRow['method']
  cash_amount_cents?: number
  points?: number
  payee?: string | null
  operator?: string | null
  storage_location?: string | null
  remark?: string | null
}

const CATEGORY_UPDATE_FIELDS = new Set([
  'code', 'name', 'unit', 'guide_price_cents', 'points_per_unit', 'status', 'sort_order', 'remark',
])

export class WasteRecyclingRepo {
  private changeLog: ChangeLogRepo

  constructor(private db: Database) {
    this.changeLog = new ChangeLogRepo(db)
  }

  findCategories(activeOnly = false): WasteCategoryRow[] {
    const sql = activeOnly
      ? `SELECT * FROM waste_category WHERE deleted_at IS NULL AND status='active' ORDER BY sort_order,name`
      : `SELECT * FROM waste_category WHERE deleted_at IS NULL ORDER BY sort_order,name`
    return this.db.prepare<[], WasteCategoryRow>(sql).all() as WasteCategoryRow[]
  }

  createCategory(
    data: Omit<WasteCategoryRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>,
  ): WasteCategoryRow {
    if (!data.code.trim() || !data.name.trim()) throw new Error('品类编码和名称不能为空')
    if (!Number.isInteger(data.guide_price_cents) || data.guide_price_cents < 0) throw new Error('指导价必须是非负整数分')
    if (!Number.isInteger(data.points_per_unit) || data.points_per_unit < 0) throw new Error('积分系数必须是非负整数')
    const now = Date.now()
    const row: WasteCategoryRow = { ...data, id: nanoid(), created_at: now, updated_at: now, deleted_at: null }
    this.db.prepare(`
      INSERT INTO waste_category
        (id,code,name,unit,guide_price_cents,points_per_unit,status,sort_order,remark,created_at,updated_at,deleted_at)
      VALUES
        (@id,@code,@name,@unit,@guide_price_cents,@points_per_unit,@status,@sort_order,@remark,@created_at,@updated_at,@deleted_at)
    `).run(row)
    this.log('waste_category', 'INSERT', row)
    return row
  }

  updateCategory(id: string, data: Partial<WasteCategoryRow>): WasteCategoryRow {
    const fields = Object.keys(data).filter(field => CATEGORY_UPDATE_FIELDS.has(field))
    if (!fields.length) throw new Error('没有可更新的品类字段')
    if (data.guide_price_cents !== undefined && (!Number.isInteger(data.guide_price_cents) || data.guide_price_cents < 0)) {
      throw new Error('指导价必须是非负整数分')
    }
    const now = Date.now()
    const sets = [...fields, 'updated_at'].map(field => `${field}=@${field}`).join(',')
    const values = Object.fromEntries(fields.map(field => [field, data[field as keyof typeof data]]))
    const result = this.db.prepare(`UPDATE waste_category SET ${sets} WHERE id=@id AND deleted_at IS NULL`)
      .run({ ...values, updated_at: now, id })
    if (!result.changes) throw new Error('回收品类不存在')
    const row = this.getCategory(id)
    this.log('waste_category', 'UPDATE', row)
    return row
  }

  deleteCategory(id: string): void {
    const used = this.db.prepare<[string], { count: number }>(
      `SELECT COUNT(*) AS count FROM waste_recycling_item WHERE category_id=?`,
    ).get(id)?.count ?? 0
    if (used > 0) throw new Error('该品类已有回收记录，请停用而不是删除')
    const now = Date.now()
    const result = this.db.prepare(`UPDATE waste_category SET deleted_at=?,updated_at=? WHERE id=? AND deleted_at IS NULL`)
      .run(now, now, id)
    if (!result.changes) throw new Error('回收品类不存在')
    this.log('waste_category', 'DELETE', { id, deleted_at: now, updated_at: now })
  }

  findOrders(query: WasteOrderQuery = {}): WasteRecyclingOrderRow[] {
    const where = ['deleted_at IS NULL']
    const params: Record<string, unknown> = {}
    if (query.status) { where.push('status=@status'); params.status = query.status }
    if (query.keyword?.trim()) {
      where.push(`(order_no LIKE @keyword OR contact_name LIKE @keyword OR contact_phone LIKE @keyword OR assignee_name LIKE @keyword)`)
      params.keyword = `%${query.keyword.trim()}%`
    }
    if (query.startDate) { where.push(`substr(appointment_at,1,10)>=@startDate`); params.startDate = query.startDate }
    if (query.endDate) { where.push(`substr(appointment_at,1,10)<=@endDate`); params.endDate = query.endDate }
    return this.db.prepare(
      `SELECT * FROM waste_recycling_order WHERE ${where.join(' AND ')} ORDER BY appointment_at DESC,created_at DESC`,
    ).all(params) as WasteRecyclingOrderRow[]
  }

  findOrder(id: string): WasteRecyclingOrderRow {
    const row = this.db.prepare<[string], WasteRecyclingOrderRow>(
      `SELECT * FROM waste_recycling_order WHERE id=? AND deleted_at IS NULL`,
    ).get(id)
    if (!row) throw new Error('回收单不存在')
    return row
  }

  findItems(orderId: string): WasteRecyclingItemRow[] {
    return this.db.prepare<[string], WasteRecyclingItemRow>(
      `SELECT * FROM waste_recycling_item WHERE order_id=? ORDER BY created_at,id`,
    ).all(orderId) as WasteRecyclingItemRow[]
  }

  createOrder(
    data: Omit<
      WasteRecyclingOrderRow,
      | 'id' | 'order_no' | 'total_weight' | 'total_amount_cents' | 'points' | 'status'
      | 'assignee_id' | 'assignee_name' | 'assigned_at' | 'collected_at' | 'weighed_at'
      | 'settled_at' | 'completed_at' | 'cancel_reason' | 'created_at' | 'updated_at' | 'deleted_at'
    >,
  ): WasteRecyclingOrderRow {
    if (!data.contact_name.trim()) throw new Error('联系人不能为空')
    if (!data.appointment_at.trim()) throw new Error('预约时间不能为空')
    if (data.pickup_type === 'pickup' && !data.pickup_address?.trim()) throw new Error('上门回收必须填写地址')
    const now = Date.now()
    const row: WasteRecyclingOrderRow = {
      ...data,
      id: nanoid(),
      order_no: `WR${this.dateToken(now)}${String(now).slice(-5)}`,
      total_weight: 0,
      total_amount_cents: 0,
      points: 0,
      status: 'pending',
      assignee_id: null,
      assignee_name: null,
      assigned_at: null,
      collected_at: null,
      weighed_at: null,
      settled_at: null,
      completed_at: null,
      cancel_reason: null,
      created_at: now,
      updated_at: now,
      deleted_at: null,
    }
    this.db.prepare(`
      INSERT INTO waste_recycling_order
        (id,order_no,source_type,elderly_id,contact_name,contact_phone,pickup_type,pickup_address,
         appointment_at,estimated_weight,total_weight,total_amount_cents,points,status,assignee_id,
         assignee_name,assigned_at,collected_at,weighed_at,settled_at,completed_at,cancel_reason,
         created_by,created_by_name,remark,created_at,updated_at,deleted_at)
      VALUES
        (@id,@order_no,@source_type,@elderly_id,@contact_name,@contact_phone,@pickup_type,@pickup_address,
         @appointment_at,@estimated_weight,@total_weight,@total_amount_cents,@points,@status,@assignee_id,
         @assignee_name,@assigned_at,@collected_at,@weighed_at,@settled_at,@completed_at,@cancel_reason,
         @created_by,@created_by_name,@remark,@created_at,@updated_at,@deleted_at)
    `).run(row)
    this.log('waste_recycling_order', 'INSERT', row)
    return row
  }

  assign(id: string, assigneeId: string, assigneeName: string): WasteRecyclingOrderRow {
    if (!assigneeId || !assigneeName.trim()) throw new Error('请选择回收负责人')
    return this.transition(id, ['pending', 'assigned'], 'assigned', {
      assignee_id: assigneeId,
      assignee_name: assigneeName.trim(),
      assigned_at: Date.now(),
    })
  }

  startCollection(id: string): WasteRecyclingOrderRow {
    return this.transition(id, ['assigned'], 'collecting', { collected_at: Date.now() })
  }

  weigh(id: string, inputs: WasteWeighItemInput[]): WasteRecyclingOrderRow {
    if (!inputs.length) throw new Error('至少需要一条称重明细')
    const order = this.findOrder(id)
    if (!['assigned', 'collecting', 'weighed'].includes(order.status)) throw new Error('当前状态不能称重')
    const categories = new Map(this.findCategories().map(category => [category.id, category]))
    const now = Date.now()
    const rows = inputs.map((input): WasteRecyclingItemRow => {
      const category = categories.get(input.category_id)
      if (!category || category.status !== 'active') throw new Error('回收品类不存在或已停用')
      const gross = Number(input.gross_weight)
      const tare = Number(input.tare_weight || 0)
      if (!Number.isFinite(gross) || gross <= 0 || !Number.isFinite(tare) || tare < 0 || tare >= gross) {
        throw new Error('毛重必须大于零，皮重必须小于毛重')
      }
      const net = Number((gross - tare).toFixed(3))
      const unitPrice = input.unit_price_cents ?? category.guide_price_cents
      if (!Number.isInteger(unitPrice) || unitPrice < 0) throw new Error('回收单价必须是非负整数分')
      return {
        id: nanoid(), order_id: id, category_id: category.id, category_name: category.name,
        material_name: input.material_name.trim() || category.name, unit: category.unit,
        gross_weight: gross, tare_weight: tare, net_weight: net, unit_price_cents: unitPrice,
        amount_cents: Math.round(net * unitPrice), quality_grade: input.quality_grade ?? 'normal',
        remark: input.remark ?? null, created_at: now, updated_at: now,
      }
    })
    const totalWeight = Number(rows.reduce((sum, row) => sum + row.net_weight, 0).toFixed(3))
    const totalAmount = rows.reduce((sum, row) => sum + row.amount_cents, 0)
    const points = rows.reduce((sum, row) => {
      const category = categories.get(row.category_id)!
      return sum + Math.floor(row.net_weight * category.points_per_unit)
    }, 0)
    this.db.transaction(() => {
      const previous = this.findItems(id)
      this.db.prepare(`DELETE FROM waste_recycling_item WHERE order_id=?`).run(id)
      previous.forEach(row => this.log('waste_recycling_item', 'DELETE', { id: row.id }))
      const insert = this.db.prepare(`
        INSERT INTO waste_recycling_item
          (id,order_id,category_id,category_name,material_name,unit,gross_weight,tare_weight,net_weight,
           unit_price_cents,amount_cents,quality_grade,remark,created_at,updated_at)
        VALUES
          (@id,@order_id,@category_id,@category_name,@material_name,@unit,@gross_weight,@tare_weight,@net_weight,
           @unit_price_cents,@amount_cents,@quality_grade,@remark,@created_at,@updated_at)
      `)
      rows.forEach(row => { insert.run(row); this.log('waste_recycling_item', 'INSERT', row) })
      this.db.prepare(`
        UPDATE waste_recycling_order SET status='weighed',total_weight=?,total_amount_cents=?,points=?,weighed_at=?,updated_at=? WHERE id=?
      `).run(totalWeight, totalAmount, points, now, now, id)
      this.log('waste_recycling_order', 'UPDATE', this.findOrder(id))
    })()
    return this.findOrder(id)
  }

  settle(id: string, input: WasteSettlementInput): WasteSettlementRow {
    const order = this.findOrder(id)
    if (order.status !== 'weighed') throw new Error('回收单称重后才能结算')
    const existing = this.db.prepare<[string], WasteSettlementRow>(`SELECT * FROM waste_settlement WHERE order_id=?`).get(id)
    if (existing) throw new Error('该回收单已经结算')
    const points = input.method === 'points' ? (input.points ?? order.points) : 0
    const cashAmount = ['cash', 'bank'].includes(input.method)
      ? (input.cash_amount_cents ?? order.total_amount_cents)
      : 0
    if (!Number.isInteger(cashAmount) || cashAmount < 0) throw new Error('结算金额必须是非负整数分')
    if (!Number.isInteger(points) || points < 0) throw new Error('结算积分必须是非负整数')
    if (input.method === 'points' && !order.elderly_id) throw new Error('积分结算必须关联老人档案')
    const now = Date.now()
    const settlement: WasteSettlementRow = {
      id: nanoid(), settlement_no: `WS${this.dateToken(now)}${String(now).slice(-5)}`, order_id: id,
      method: input.method, cash_amount_cents: cashAmount, points, payee: input.payee ?? order.contact_name,
      operator: input.operator ?? null, settled_at: now, remark: input.remark ?? null, created_at: now,
    }
    const items = this.findItems(id)
    this.db.transaction(() => {
      this.db.prepare(`
        INSERT INTO waste_settlement
          (id,settlement_no,order_id,method,cash_amount_cents,points,payee,operator,settled_at,remark,created_at)
        VALUES
          (@id,@settlement_no,@order_id,@method,@cash_amount_cents,@points,@payee,@operator,@settled_at,@remark,@created_at)
      `).run(settlement)
      this.log('waste_settlement', 'INSERT', settlement)

      if (points > 0 && order.elderly_id) {
        const ledger: WastePointsLedgerRow = {
          id: nanoid(), elderly_id: order.elderly_id, order_id: id, change_points: points,
          reason: `废品回收 ${order.order_no}`, operator: input.operator ?? null, occurred_at: now, created_at: now,
        }
        this.db.prepare(`
          INSERT INTO waste_points_ledger (id,elderly_id,order_id,change_points,reason,operator,occurred_at,created_at)
          VALUES (@id,@elderly_id,@order_id,@change_points,@reason,@operator,@occurred_at,@created_at)
        `).run(ledger)
        this.log('waste_points_ledger', 'INSERT', ledger)
      }

      const insertLot = this.db.prepare(`
        INSERT INTO waste_inventory_lot
          (id,order_id,item_id,category_id,material_name,unit,quantity,remaining_quantity,cost_amount_cents,
           storage_location,status,created_at,updated_at)
        VALUES
          (@id,@order_id,@item_id,@category_id,@material_name,@unit,@quantity,@remaining_quantity,@cost_amount_cents,
           @storage_location,@status,@created_at,@updated_at)
      `)
      const insertTransaction = this.db.prepare(`
        INSERT INTO waste_inventory_transaction
          (id,lot_id,transaction_type,quantity,destination,counterparty,unit_price_cents,amount_cents,
           operator,occurred_at,remark,created_at)
        VALUES
          (@id,@lot_id,@transaction_type,@quantity,@destination,@counterparty,@unit_price_cents,@amount_cents,
           @operator,@occurred_at,@remark,@created_at)
      `)
      items.forEach(item => {
        const lot: WasteInventoryLotRow = {
          id: nanoid(), order_id: id, item_id: item.id, category_id: item.category_id,
          material_name: item.material_name, unit: item.unit, quantity: item.net_weight,
          remaining_quantity: item.net_weight, cost_amount_cents: item.amount_cents,
          storage_location: input.storage_location ?? null, status: 'in_stock', created_at: now, updated_at: now,
        }
        const transaction: WasteInventoryTransactionRow = {
          id: nanoid(), lot_id: lot.id, transaction_type: 'in', quantity: lot.quantity,
          destination: lot.storage_location, counterparty: order.contact_name,
          unit_price_cents: item.unit_price_cents, amount_cents: item.amount_cents,
          operator: input.operator ?? null, occurred_at: new Date(now).toISOString(),
          remark: order.order_no, created_at: now,
        }
        insertLot.run(lot)
        insertTransaction.run(transaction)
        this.log('waste_inventory_lot', 'INSERT', lot)
        this.log('waste_inventory_transaction', 'INSERT', transaction)
      })

      this.db.prepare(`UPDATE waste_recycling_order SET status='settled',settled_at=?,updated_at=? WHERE id=?`)
        .run(now, now, id)
      this.log('waste_recycling_order', 'UPDATE', this.findOrder(id))
    })()
    return settlement
  }

  complete(id: string): WasteRecyclingOrderRow {
    return this.transition(id, ['settled'], 'completed', { completed_at: Date.now() })
  }

  cancel(id: string, reason: string): WasteRecyclingOrderRow {
    if (!reason.trim()) throw new Error('请填写取消原因')
    return this.transition(id, ['pending', 'assigned', 'collecting'], 'cancelled', { cancel_reason: reason.trim() })
  }

  findSettlement(orderId: string): WasteSettlementRow | null {
    return this.db.prepare<[string], WasteSettlementRow>(`SELECT * FROM waste_settlement WHERE order_id=?`).get(orderId) ?? null
  }

  findPointsLedger(elderlyId?: string): WastePointsLedgerRow[] {
    const sql = elderlyId
      ? `SELECT * FROM waste_points_ledger WHERE elderly_id=? ORDER BY occurred_at DESC`
      : `SELECT * FROM waste_points_ledger ORDER BY occurred_at DESC LIMIT 500`
    return elderlyId
      ? this.db.prepare<[string], WastePointsLedgerRow>(sql).all(elderlyId) as WastePointsLedgerRow[]
      : this.db.prepare<[], WastePointsLedgerRow>(sql).all() as WastePointsLedgerRow[]
  }

  getPointsBalance(elderlyId: string): number {
    return this.db.prepare<[string], { balance: number }>(
      `SELECT COALESCE(SUM(change_points),0) AS balance FROM waste_points_ledger WHERE elderly_id=?`,
    ).get(elderlyId)?.balance ?? 0
  }

  findInventory(status?: WasteInventoryLotRow['status']): WasteInventoryLotRow[] {
    const sql = status
      ? `SELECT * FROM waste_inventory_lot WHERE status=? ORDER BY created_at DESC`
      : `SELECT * FROM waste_inventory_lot ORDER BY CASE status WHEN 'in_stock' THEN 0 WHEN 'partial' THEN 1 ELSE 2 END,created_at DESC`
    return status
      ? this.db.prepare<[string], WasteInventoryLotRow>(sql).all(status) as WasteInventoryLotRow[]
      : this.db.prepare<[], WasteInventoryLotRow>(sql).all() as WasteInventoryLotRow[]
  }

  findInventoryTransactions(lotId: string): WasteInventoryTransactionRow[] {
    return this.db.prepare<[string], WasteInventoryTransactionRow>(
      `SELECT * FROM waste_inventory_transaction WHERE lot_id=? ORDER BY created_at DESC`,
    ).all(lotId) as WasteInventoryTransactionRow[]
  }

  transactInventory(
    lotId: string,
    input: Omit<WasteInventoryTransactionRow, 'id' | 'lot_id' | 'amount_cents' | 'created_at'>,
  ): WasteInventoryTransactionRow {
    const lot = this.db.prepare<[string], WasteInventoryLotRow>(`SELECT * FROM waste_inventory_lot WHERE id=?`).get(lotId)
    if (!lot) throw new Error('库存批次不存在')
    if (!Number.isFinite(input.quantity) || input.quantity === 0) throw new Error('出入库数量不能为零')
    if (!Number.isInteger(input.unit_price_cents) || input.unit_price_cents < 0) throw new Error('单价必须是非负整数分')
    const delta = input.transaction_type === 'out' ? -Math.abs(input.quantity) : input.quantity
    const remaining = Number((lot.remaining_quantity + delta).toFixed(3))
    if (remaining < 0) throw new Error('出库数量不能超过剩余库存')
    if (input.transaction_type === 'out' && !input.destination?.trim()) throw new Error('出库必须填写去向')
    const now = Date.now()
    const transaction: WasteInventoryTransactionRow = {
      ...input,
      quantity: input.transaction_type === 'adjust' ? input.quantity : Math.abs(input.quantity),
      id: nanoid(), lot_id: lotId,
      amount_cents: Math.round(Math.abs(input.quantity) * input.unit_price_cents),
      created_at: now,
    }
    const status: WasteInventoryLotRow['status'] = remaining === 0 ? 'out' : remaining < lot.quantity ? 'partial' : 'in_stock'
    this.db.transaction(() => {
      this.db.prepare(`
        INSERT INTO waste_inventory_transaction
          (id,lot_id,transaction_type,quantity,destination,counterparty,unit_price_cents,amount_cents,
           operator,occurred_at,remark,created_at)
        VALUES
          (@id,@lot_id,@transaction_type,@quantity,@destination,@counterparty,@unit_price_cents,@amount_cents,
           @operator,@occurred_at,@remark,@created_at)
      `).run(transaction)
      this.db.prepare(`UPDATE waste_inventory_lot SET remaining_quantity=?,status=?,updated_at=? WHERE id=?`)
        .run(remaining, status, now, lotId)
      this.log('waste_inventory_transaction', 'INSERT', transaction)
      this.log('waste_inventory_lot', 'UPDATE', this.db.prepare<[string], WasteInventoryLotRow>(`SELECT * FROM waste_inventory_lot WHERE id=?`).get(lotId)!)
    })()
    return transaction
  }

  getStats(startDate?: string, endDate?: string): WasteRecyclingStats {
    const filters = [`deleted_at IS NULL`, `status!='cancelled'`]
    const params: Record<string, unknown> = {}
    if (startDate) { filters.push(`substr(appointment_at,1,10)>=@startDate`); params.startDate = startDate }
    if (endDate) { filters.push(`substr(appointment_at,1,10)<=@endDate`); params.endDate = endDate }
    const where = filters.join(' AND ')
    const totals = this.db.prepare(`
      SELECT COUNT(*) total_orders,
        SUM(CASE WHEN status IN ('pending','assigned','collecting','weighed') THEN 1 ELSE 0 END) pending_orders,
        SUM(CASE WHEN status='completed' THEN 1 ELSE 0 END) completed_orders,
        COALESCE(SUM(total_weight),0) total_weight,
        COALESCE(SUM(total_amount_cents),0) total_amount_cents
      FROM waste_recycling_order WHERE ${where}
    `).get(params) as {
      total_orders: number; pending_orders: number; completed_orders: number;
      total_weight: number; total_amount_cents: number;
    }
    const totalPoints = this.db.prepare(`
      SELECT COALESCE(SUM(s.points),0) value
      FROM waste_settlement s JOIN waste_recycling_order o ON o.id=s.order_id
      WHERE ${where.replaceAll('status', 'o.status').replaceAll('deleted_at', 'o.deleted_at')}
    `).get(params) as { value: number }
    const inventoryWeight = this.db.prepare<[], { value: number }>(
      `SELECT COALESCE(SUM(remaining_quantity),0) value FROM waste_inventory_lot WHERE status!='out'`,
    ).get()?.value ?? 0
    const byCategory = this.db.prepare(`
      SELECT i.category_name,ROUND(SUM(i.net_weight),3) weight,SUM(i.amount_cents) amount_cents
      FROM waste_recycling_item i JOIN waste_recycling_order o ON o.id=i.order_id
      WHERE ${where.replaceAll('status', 'o.status').replaceAll('deleted_at', 'o.deleted_at')}
      GROUP BY i.category_id,i.category_name ORDER BY weight DESC
    `).all(params) as Array<{ category_name: string; weight: number; amount_cents: number }>
    const monthlyTrend = this.db.prepare(`
      SELECT substr(appointment_at,1,7) month,COUNT(*) orders,ROUND(SUM(total_weight),3) weight,SUM(total_amount_cents) amount_cents
      FROM waste_recycling_order WHERE ${where}
      GROUP BY substr(appointment_at,1,7) ORDER BY month DESC LIMIT 12
    `).all(params) as Array<{ month: string; orders: number; weight: number; amount_cents: number }>
    return {
      ...totals,
      total_points: totalPoints.value,
      inventory_weight: inventoryWeight,
      by_category: byCategory,
      monthly_trend: monthlyTrend.reverse(),
    }
  }

  private getCategory(id: string): WasteCategoryRow {
    const row = this.db.prepare<[string], WasteCategoryRow>(
      `SELECT * FROM waste_category WHERE id=? AND deleted_at IS NULL`,
    ).get(id)
    if (!row) throw new Error('回收品类不存在')
    return row
  }

  private transition(
    id: string,
    from: WasteOrderStatus[],
    to: WasteOrderStatus,
    extra: Record<string, unknown> = {},
  ): WasteRecyclingOrderRow {
    const order = this.findOrder(id)
    if (!from.includes(order.status)) throw new Error(`回收单当前状态不能变更为“${to}”`)
    const now = Date.now()
    const fields = { ...extra, status: to, updated_at: now }
    const sets = Object.keys(fields).map(field => `${field}=@${field}`).join(',')
    this.db.prepare(`UPDATE waste_recycling_order SET ${sets} WHERE id=@id`).run({ ...fields, id })
    const row = this.findOrder(id)
    this.log('waste_recycling_order', 'UPDATE', row)
    return row
  }

  private log(tableName: string, operation: 'INSERT' | 'UPDATE' | 'DELETE', payload: object): void {
    const id = String((payload as { id?: string }).id ?? '')
    this.changeLog.insert({ table_name: tableName, record_id: id, operation, payload: JSON.stringify(payload) })
  }

  private dateToken(timestamp: number): string {
    const date = new Date(timestamp)
    return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`
  }
}
