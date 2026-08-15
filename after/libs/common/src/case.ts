import type { DataRecord } from './types';

export function camelToSnake(value: string): string {
  return value.replace(/[A-Z]/g, (character) => `_${character.toLowerCase()}`);
}

export function snakeToCamel(value: string): string {
  return value.replace(/_([a-z])/g, (_, character: string) => character.toUpperCase());
}

export function camelizeRow(row: DataRecord): DataRecord {
  return Object.fromEntries(Object.entries(row).map(([key, value]) => [snakeToCamel(key), value]));
}

export function camelizeRows(rows: DataRecord[]): DataRecord[] {
  return rows.map(camelizeRow);
}
