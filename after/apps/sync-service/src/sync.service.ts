import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService, type DataRecord } from '@app/common';

const allowedTables = new Set([
  'elderly', 'family_contact', 'health_profile', 'vital_signs', 'medication_order', 'medication_record',
  'medical_visit', 'admission', 'leave_record', 'discharge', 'care_assessment', 'care_plan', 'care_record',
  'fee_item', 'deposit_record', 'monthly_bill', 'bill_detail', 'payment_record', 'invoice', 'meal_menu', 'meal_record',
  'nutrition_plan', 'activity', 'activity_attendance', 'contract', 'building', 'room', 'bed', 'task_reminder',
  'iot_device_alert', 'announcement',
]);

@Injectable()
export class SyncService {
  constructor(private readonly database: DatabaseService) {}

  async upload(input: DataRecord, ownerUserId: number): Promise<DataRecord> {
    const deviceId = this.device(input.deviceId);
    const changes = Array.isArray(input.changes) ? input.changes as DataRecord[] : [];
    if (changes.length > 500) throw new BadRequestException('单次同步最多上传500条变更');
    const acceptedIds: string[] = [];
    const rejected: Record<string, string> = {};
    for (const change of changes) {
      const id = String(change.id ?? 'unknown');
      const reason = this.validateChange(change);
      if (reason) { rejected[id] = reason; continue; }
      await this.database.execute(
        `INSERT IGNORE INTO yl_sync_change_log(change_id,owner_user_id,source_device_id,table_name,record_id,operation,payload,created_at,received_at)
         VALUES(?,?,?,?,?,?,?,?,?)`,
        [id, ownerUserId, deviceId, String(change.tableName), String(change.recordId), String(change.operation), JSON.stringify(change.payload), Number(change.createdAt ?? Date.now()), Date.now()],
      );
      acceptedIds.push(id);
    }
    return { received: acceptedIds.length, acceptedIds, rejected, changes: [] };
  }

  async download(input: DataRecord, ownerUserId: number): Promise<DataRecord> {
    const deviceId = this.device(input.deviceId);
    const cursor = Math.max(0, Number(input.lastSyncCursor ?? 0));
    const rows = await this.database.query(
      `SELECT id,change_id,table_name,record_id,operation,payload,created_at,received_at
       FROM yl_sync_change_log WHERE owner_user_id=? AND id>? AND source_device_id<>?
       ORDER BY id LIMIT 500`,
      [ownerUserId, cursor, deviceId],
    );
    const changes = rows.map((row) => ({
      id: row.changeId, tableName: row.tableName, recordId: row.recordId, operation: row.operation,
      payload: typeof row.payload === 'string' ? JSON.parse(row.payload) : row.payload,
      createdAt: row.createdAt, receivedAt: row.receivedAt,
    }));
    return { received: 0, changes, nextSyncAt: Date.now(), nextSyncCursor: rows.length ? Number(rows.at(-1)?.id) : cursor };
  }

  private device(value: unknown): string {
    const deviceId = String(value ?? '').trim();
    if (!deviceId || deviceId.length > 64) throw new BadRequestException('deviceId不能为空且长度不能超过64');
    return deviceId;
  }

  private validateChange(change: DataRecord): string | null {
    const id = String(change.id ?? '');
    if (!id || id.length > 64) return '变更ID不合法';
    if (!allowedTables.has(String(change.tableName ?? ''))) return '不允许同步该数据表';
    const recordId = String(change.recordId ?? '');
    if (!recordId || recordId.length > 64) return '记录ID不合法';
    if (!['INSERT', 'UPDATE', 'DELETE'].includes(String(change.operation ?? ''))) return '不支持的变更操作';
    if (!change.payload || typeof change.payload !== 'object') return '变更内容不能为空';
    return null;
  }
}
