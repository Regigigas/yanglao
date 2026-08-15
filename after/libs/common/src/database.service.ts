import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { createPool, type Pool, type PoolConnection, type ResultSetHeader, type RowDataPacket } from 'mysql2/promise';
import { camelToSnake, camelizeRows } from './case';
import type { CrudResource, DataRecord, PageQuery, Primitive } from './types';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private readonly pool: Pool;

  constructor() {
    this.pool = createPool({
      host: process.env.DB_HOST ?? '127.0.0.1',
      port: Number(process.env.DB_PORT ?? 3306),
      database: process.env.DB_NAME ?? 'ry-cloud',
      user: process.env.DB_USER ?? 'root',
      password: process.env.DB_PASSWORD ?? 'password',
      connectionLimit: Number(process.env.DB_POOL_SIZE ?? 10),
      waitForConnections: true,
      enableKeepAlive: true,
      decimalNumbers: true,
      charset: 'utf8mb4',
    });
  }

  async query<T extends DataRecord = DataRecord>(sql: string, values: Primitive[] = []): Promise<T[]> {
    const [rows] = await this.pool.query<RowDataPacket[]>(sql, values);
    return camelizeRows(rows as DataRecord[]) as T[];
  }

  async rawQuery<T extends RowDataPacket = RowDataPacket>(sql: string, values: Primitive[] = []): Promise<T[]> {
    const [rows] = await this.pool.query<T[]>(sql, values);
    return rows;
  }

  async execute(sql: string, values: Primitive[] = []): Promise<ResultSetHeader> {
    const [result] = await this.pool.execute<ResultSetHeader>(sql, values);
    return result;
  }

  async transaction<T>(handler: (connection: PoolConnection) => Promise<T>): Promise<T> {
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();
      const result = await handler(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async list(resource: CrudResource, query: PageQuery): Promise<{ rows: DataRecord[]; total: number }> {
    const values: Primitive[] = [];
    const conditions: string[] = [];
    if (resource.softDelete) conditions.push("del_flag = '0'");
    for (const field of resource.like ?? []) {
      const value = query[field];
      if (typeof value === 'string' && value.trim()) {
        conditions.push(`\`${camelToSnake(field)}\` LIKE ?`);
        values.push(`%${value.trim()}%`);
      }
    }
    for (const field of resource.exact ?? []) {
      const value = query[field];
      if (typeof value === 'string' || typeof value === 'number') {
        if (String(value) !== '') {
          conditions.push(`\`${camelToSnake(field)}\` = ?`);
          values.push(value);
        }
      }
    }
    const where = conditions.length ? ` WHERE ${conditions.join(' AND ')}` : '';
    const pageNum = Math.max(1, Number(query.pageNum ?? 1));
    const pageSize = Math.min(500, Math.max(1, Number(query.pageSize ?? 10)));
    const allowedOrder = new Set([...resource.columns, resource.id]);
    const requestedOrder = typeof query.orderByColumn === 'string' ? query.orderByColumn : '';
    const orderColumn = allowedOrder.has(requestedOrder) ? camelToSnake(requestedOrder) : (resource.defaultOrder ?? resource.id);
    const orderDirection = String(query.isAsc).toLowerCase() === 'asc' ? 'ASC' : 'DESC';
    const [count] = await this.rawQuery<{ total: number } & RowDataPacket>(
      `SELECT COUNT(*) AS total FROM \`${resource.table}\`${where}`,
      values,
    );
    const rows = await this.query(
      `SELECT * FROM \`${resource.table}\`${where} ORDER BY \`${orderColumn}\` ${orderDirection} LIMIT ? OFFSET ?`,
      [...values, pageSize, (pageNum - 1) * pageSize],
    );
    return { rows, total: Number(count?.total ?? 0) };
  }

  async get(resource: CrudResource, id: Primitive): Promise<DataRecord | null> {
    const conditions = [`\`${resource.id}\` = ?`];
    if (resource.softDelete) conditions.push("del_flag = '0'");
    const rows = await this.query(`SELECT * FROM \`${resource.table}\` WHERE ${conditions.join(' AND ')} LIMIT 1`, [id]);
    return rows[0] ?? null;
  }

  async insert(resource: CrudResource, input: DataRecord, auditUser?: string): Promise<ResultSetHeader> {
    const allowed = new Set(resource.columns.map(camelToSnake));
    const entries = Object.entries(input)
      .map(([key, value]) => [camelToSnake(key), value] as const)
      .filter(([key, value]) => allowed.has(key) && value !== undefined);
    if (auditUser && allowed.has('create_by') && !entries.some(([key]) => key === 'create_by')) entries.push(['create_by', auditUser]);
    if (allowed.has('create_time') && !entries.some(([key]) => key === 'create_time')) entries.push(['create_time', new Date()]);
    const columns = entries.map(([key]) => `\`${key}\``).join(', ');
    const placeholders = entries.map(() => '?').join(', ');
    return this.execute(
      `INSERT INTO \`${resource.table}\` (${columns}) VALUES (${placeholders})`,
      entries.map(([, value]) => this.toPrimitive(value)),
    );
  }

  async update(resource: CrudResource, input: DataRecord, auditUser?: string): Promise<ResultSetHeader> {
    const camelId = resource.id.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
    const id = input[camelId] ?? input[resource.id];
    if (id === undefined || id === null) throw new Error(`${camelId} 不能为空`);
    const allowed = new Set(resource.columns.map(camelToSnake));
    const entries = Object.entries(input)
      .map(([key, value]) => [camelToSnake(key), value] as const)
      .filter(([key, value]) => key !== resource.id && allowed.has(key) && value !== undefined);
    if (auditUser && allowed.has('update_by') && !entries.some(([key]) => key === 'update_by')) entries.push(['update_by', auditUser]);
    if (allowed.has('update_time') && !entries.some(([key]) => key === 'update_time')) entries.push(['update_time', new Date()]);
    if (!entries.length) throw new Error('没有可更新的字段');
    return this.execute(
      `UPDATE \`${resource.table}\` SET ${entries.map(([key]) => `\`${key}\` = ?`).join(', ')} WHERE \`${resource.id}\` = ?`,
      [...entries.map(([, value]) => this.toPrimitive(value)), this.toPrimitive(id)],
    );
  }

  async remove(resource: CrudResource, ids: Primitive[]): Promise<ResultSetHeader> {
    if (!ids.length) throw new Error('请选择要删除的数据');
    const placeholders = ids.map(() => '?').join(', ');
    return resource.softDelete
      ? this.execute(`UPDATE \`${resource.table}\` SET del_flag = '2' WHERE \`${resource.id}\` IN (${placeholders})`, ids)
      : this.execute(`DELETE FROM \`${resource.table}\` WHERE \`${resource.id}\` IN (${placeholders})`, ids);
  }

  private toPrimitive(value: unknown): Primitive {
    if (value === undefined || value === null) return null;
    if (value instanceof Date || ['string', 'number', 'boolean'].includes(typeof value)) return value as Primitive;
    return JSON.stringify(value);
  }

  async ping(): Promise<boolean> {
    try {
      await this.query('SELECT 1 AS ok');
      return true;
    } catch (error) {
      this.logger.warn(`MySQL unavailable: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }
}
