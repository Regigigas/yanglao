import type { DataRecord } from './types';

export function success(data?: unknown, message = '操作成功'): DataRecord {
  const result: DataRecord = { code: 200, msg: message };
  if (data !== undefined) result.data = data;
  return result;
}

export function successWith(fields: DataRecord, message = '操作成功'): DataRecord {
  return { code: 200, msg: message, ...fields };
}

export function failure(message: string, code = 500): DataRecord {
  return { code, msg: message };
}

export function table(rows: unknown[], total: number): DataRecord {
  return { code: 200, msg: '查询成功', rows, total };
}

export function affected(count: number, successMessage = '操作成功'): DataRecord {
  return count > 0 ? success(undefined, successMessage) : failure('操作失败');
}
