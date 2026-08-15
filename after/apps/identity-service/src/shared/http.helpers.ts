import { mkdir, writeFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import type { Request, Response } from 'express';
import * as ExcelJS from 'exceljs';
import type { DataRecord } from '@app/common';

export function numberIds(value: string): number[] {
  return String(value ?? '').split(',').map(Number).filter((id) => Number.isFinite(id) && id > 0);
}

export function currentUserId(request: Request): number {
  return Number(request.headers.user_id ?? 0);
}

export function currentUsername(request: Request): string {
  return decodeURIComponent(String(request.headers.username ?? 'system'));
}

export async function sendWorkbook(response: Response, sheetName: string, columns: string[], rows: DataRecord[]): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(sheetName);
  sheet.columns = columns.map((column) => ({ header: column, key: column, width: Math.max(14, column.length + 4) }));
  for (const row of rows) sheet.addRow(Object.fromEntries(columns.map((column) => [column, row[column] ?? ''])));
  const content = await workbook.xlsx.writeBuffer();
  response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  response.setHeader('Content-Disposition', `attachment; filename=${encodeURIComponent(sheetName)}.xlsx`);
  response.send(Buffer.from(content));
}

export async function storeAvatar(file: Express.Multer.File): Promise<string> {
  const uploadRoot = resolve(process.env.UPLOAD_DIR ?? './uploads');
  const name = `${randomUUID()}${extname(file.originalname).toLowerCase()}`;
  await mkdir(join(uploadRoot, 'avatar'), { recursive: true });
  await writeFile(join(uploadRoot, 'avatar', name), file.buffer);
  return `${process.env.FILE_PUBLIC_URL ?? 'http://127.0.0.1:8080/file/statics'}/avatar/${name}`;
}
