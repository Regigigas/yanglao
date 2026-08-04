import type { Database } from 'better-sqlite3'
import type { ChangeRecord } from '@yanglao/core'

const ALLOWED_TABLES = new Set([
  'elderly', 'family_contact', 'health_profile', 'vital_signs',
  'medication_order', 'medication_record', 'medical_visit', 'admission',
  'leave_record', 'discharge', 'care_assessment', 'care_plan', 'care_record',
  'fee_item', 'deposit_record', 'monthly_bill', 'bill_detail', 'payment_record',
  'meal_menu', 'meal_record', 'nutrition_plan', 'activity', 'activity_attendance',
  'contract', 'building', 'room', 'bed', 'task_reminder', 'iot_device_alert', 'announcement',
])

function quoteIdentifier(name: string): string {
  return `\`${name}\``
}

function getColumns(db: Database, table: string): Set<string> {
  return new Set(
    (db.prepare(`PRAGMA table_info(${quoteIdentifier(table)})`).all() as Array<{ name: string }>)
      .map((column) => column.name),
  )
}

function applyChange(db: Database, change: ChangeRecord): void {
  if (!ALLOWED_TABLES.has(change.tableName)) {
    throw new Error(`不支持同步数据表: ${change.tableName}`)
  }

  const payload = change.payload as Record<string, unknown>
  if (!payload || typeof payload.id !== 'string' || !payload.id) {
    throw new Error(`同步记录缺少 ID: ${change.id}`)
  }

  const table = quoteIdentifier(change.tableName)
  const columns = getColumns(db, change.tableName)
  if (change.operation === 'DELETE') {
    if (columns.has('deleted_at')) {
      const deletedAt = typeof payload.deleted_at === 'number' ? payload.deleted_at : change.createdAt
      if (columns.has('updated_at')) {
        db.prepare(`UPDATE ${table} SET deleted_at=?, updated_at=? WHERE id=?`).run(deletedAt, deletedAt, payload.id)
      } else {
        db.prepare(`UPDATE ${table} SET deleted_at=? WHERE id=?`).run(deletedAt, payload.id)
      }
    } else {
      db.prepare(`DELETE FROM ${table} WHERE id=?`).run(payload.id)
    }
    return
  }

  const fields = Object.keys(payload).filter((field) => columns.has(field))
  if (!fields.includes('id')) {
    throw new Error(`同步记录包含未知字段: ${change.id}`)
  }
  const fieldNames = fields.map(quoteIdentifier)
  const placeholders = fields.map((field) => `@${field}`)
  const updates = fields.filter((field) => field !== 'id')

  if (updates.length === 0) {
    db.prepare(`INSERT OR IGNORE INTO ${table} (${fieldNames.join(', ')}) VALUES (${placeholders.join(', ')})`).run(payload)
    return
  }

  const assignments = updates.map((field) => `${quoteIdentifier(field)}=excluded.${quoteIdentifier(field)}`)
  const where = columns.has('updated_at') && fields.includes('updated_at')
    ? ` WHERE excluded.updated_at >= ${table}.updated_at`
    : ''
  db.prepare(
    `INSERT INTO ${table} (${fieldNames.join(', ')}) VALUES (${placeholders.join(', ')})
     ON CONFLICT(id) DO UPDATE SET ${assignments.join(', ')}${where}`,
  ).run(payload)
}

export function applyRemoteChanges(db: Database, changes: ChangeRecord[]): void {
  const applyAll = db.transaction(() => {
    for (const change of changes) applyChange(db, change)
  })
  applyAll()
}
