import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { DatabaseService, type DataRecord, type PageQuery } from '@app/common';

@Injectable()
export class PurchaseService {
  constructor(private readonly database: DatabaseService) {}

  async list(query: PageQuery): Promise<{ rows: DataRecord[]; total: number }> {
    const values: Array<string | number> = [];
    const filters = ["del_flag='0'"];
    for (const [field, column] of [['orderNo', 'order_no'], ['supplierName', 'supplier_name']] as const) {
      const value = String(query[field] ?? '').trim();
      if (value) { filters.push(`${column} LIKE ?`); values.push(`%${value}%`); }
    }
    for (const [field, column] of [['status', 'status'], ['applicant', 'applicant']] as const) {
      const value = String(query[field] ?? '').trim();
      if (value) { filters.push(`${column}=?`); values.push(value); }
    }
    const where = filters.join(' AND ');
    const pageNum = Math.max(1, Number(query.pageNum ?? 1));
    const pageSize = Math.min(500, Math.max(1, Number(query.pageSize ?? 10)));
    const count = await this.database.rawQuery<{ total: number } & import('mysql2').RowDataPacket>(`SELECT COUNT(*) total FROM purchase_order WHERE ${where}`, values);
    const rows = await this.database.query(
      `SELECT * FROM purchase_order WHERE ${where} ORDER BY create_time DESC LIMIT ? OFFSET ?`,
      [...values, pageSize, (pageNum - 1) * pageSize],
    );
    return { rows, total: Number(count[0]?.total ?? 0) };
  }

  async get(id: string): Promise<DataRecord | null> {
    const rows = await this.database.query("SELECT * FROM purchase_order WHERE id=? AND del_flag='0' LIMIT 1", [id]);
    return rows[0] ?? null;
  }

  async items(id: string): Promise<DataRecord[]> {
    return this.database.query('SELECT * FROM purchase_order_item WHERE order_id=? ORDER BY create_time', [id]);
  }

  async stats(): Promise<DataRecord> {
    const rows = await this.database.query(
      `SELECT COUNT(*) total, SUM(status='draft') draft, SUM(status='pending') pending,
       SUM(status='approved') approved, SUM(status='received') received,
       IFNULL(SUM(total_amount),0) total_amount FROM purchase_order WHERE del_flag='0'`,
    );
    return rows[0] ?? {};
  }

  async create(input: DataRecord, username: string): Promise<void> {
    const items = Array.isArray(input.items) ? input.items as DataRecord[] : [];
    if (!items.length) throw new BadRequestException('采购单至少需要一条明细');
    const orderId = String(input.id ?? randomUUID());
    const orderNo = String(input.orderNo ?? `PO${new Date().toISOString().replace(/\D/g, '').slice(0, 14)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`);
    const totalAmount = items.reduce((sum, item) => sum + Number(item.amount ?? Number(item.quantity ?? 0) * Number(item.unitPrice ?? 0)), 0);
    await this.database.transaction(async (connection) => {
      await connection.execute(
        `INSERT INTO purchase_order(id,order_no,supplier_id,supplier_name,order_date,expect_date,total_amount,paid_amount,status,applicant,remark,create_by,create_time,del_flag)
         VALUES(?,?,?,?,?,?,?,?,?,?,?,?,NOW(),'0')`,
        [orderId, orderNo, input.supplierId ? String(input.supplierId) : null, input.supplierName ? String(input.supplierName) : null, input.orderDate ? String(input.orderDate) : new Date(), input.expectDate ? String(input.expectDate) : null, totalAmount, Number(input.paidAmount ?? 0), String(input.status ?? 'draft'), username, input.remark ? String(input.remark) : null, username],
      );
      for (const item of items) {
        const quantity = Number(item.quantity ?? 0);
        const unitPrice = Number(item.unitPrice ?? 0);
        if (quantity <= 0 || unitPrice < 0) throw new BadRequestException('采购数量和单价不合法');
        await connection.execute(
          `INSERT INTO purchase_order_item(id,order_id,item_name,category,specification,unit,quantity,unit_price,amount,received_qty,remark,create_time)
           VALUES(?,?,?,?,?,?,?,?,?,?,?,NOW())`,
          [String(item.id ?? randomUUID()), orderId, String(item.itemName ?? ''), String(item.category ?? 'other'), item.specification ? String(item.specification) : null, String(item.unit ?? '件'), quantity, unitPrice, Number(item.amount ?? quantity * unitPrice), Number(item.receivedQty ?? 0), item.remark ? String(item.remark) : null],
        );
      }
    });
  }

  async updateStatus(id: string, status: string, username: string): Promise<number> {
    const allowed = new Set(['draft', 'pending', 'approved', 'received', 'cancelled']);
    if (!allowed.has(status)) throw new BadRequestException('采购单状态不合法');
    const extra = status === 'approved' ? ',approver=?,approved_at=NOW()' : status === 'received' ? ',received_at=NOW()' : '';
    const values: Array<string> = [status];
    if (status === 'approved') values.push(username);
    values.push(username, id);
    const result = await this.database.execute(`UPDATE purchase_order SET status=?${extra},update_by=?,update_time=NOW() WHERE id=? AND del_flag='0'`, values);
    return result.affectedRows;
  }

  async remove(ids: string[]): Promise<number> {
    if (!ids.length) return 0;
    const result = await this.database.execute(`UPDATE purchase_order SET del_flag='2',update_time=NOW() WHERE id IN (${ids.map(() => '?').join(',')})`, ids);
    return result.affectedRows;
  }
}
