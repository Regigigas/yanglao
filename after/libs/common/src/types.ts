import type { Request } from 'express';

export type Primitive = string | number | boolean | Date | null;
export type DataRecord = Record<string, unknown>;

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    username: string;
    userKey?: string;
    roles?: string[];
    permissions?: string[];
  };
}

export interface PageQuery extends DataRecord {
  pageNum?: string | number;
  pageSize?: string | number;
  orderByColumn?: string;
  isAsc?: string;
}

export interface CrudResource {
  table: string;
  id: string;
  columns: readonly string[];
  like?: readonly string[];
  exact?: readonly string[];
  defaultOrder?: string;
  softDelete?: boolean;
}
