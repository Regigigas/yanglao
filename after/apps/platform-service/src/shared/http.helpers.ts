import type { Request, Response } from 'express';
import type { CrudResource, DataRecord, Primitive } from '@app/common';

export function ids(value: string): Primitive[] {
  return String(value ?? '').split(',').map((id) => id.trim()).filter(Boolean);
}

export function currentUserId(request: Request): number {
  return Number(request.headers.user_id ?? 0);
}

export function currentUsername(request: Request): string {
  return decodeURIComponent(String(request.headers.username ?? 'system'));
}

export function sendCsv(response: Response, resource: CrudResource, rows: DataRecord[]): void {
  const escape = (value: unknown): string => `"${String(value ?? '').replaceAll('"', '""')}"`;
  const columns = resource.columns;
  const csv = [`\uFEFF${columns.join(',')}`, ...rows.map((row) => columns.map((column) => escape(row[column])).join(','))].join('\r\n');
  response.setHeader('Content-Type', 'text/csv; charset=utf-8');
  response.setHeader('Content-Disposition', `attachment; filename=${resource.table}.csv`);
  response.send(csv);
}

export function compareVersions(left: string, right: string): number {
  const a = left.split(/[.-]/);
  const b = right.split(/[.-]/);
  const length = Math.max(a.length, b.length);
  for (let index = 0; index < length; index += 1) {
    const x = a[index] ?? '0';
    const y = b[index] ?? '0';
    const numeric = /^\d+$/.test(x) && /^\d+$/.test(y);
    const result = numeric ? Number(x) - Number(y) : x.localeCompare(y, undefined, { sensitivity: 'base' });
    if (result) return result;
  }
  return 0;
}
