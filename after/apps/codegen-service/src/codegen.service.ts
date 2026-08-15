import { BadRequestException, Injectable } from '@nestjs/common';
import JSZip = require('jszip');
import { DatabaseService, type DataRecord, type PageQuery } from '@app/common';

interface ColumnInfo extends DataRecord {
  columnName: string;
  dataType: string;
  columnComment: string;
  isNullable: string;
  columnKey: string;
  extra: string;
}

@Injectable()
export class CodegenService {
  constructor(private readonly database: DatabaseService) {}

  async configured(query: PageQuery): Promise<{ rows: DataRecord[]; total: number }> {
    return this.page(
      "SELECT * FROM gen_table WHERE (?='' OR table_name LIKE ? OR table_comment LIKE ?) ORDER BY update_time DESC,table_id DESC",
      [String(query.tableName ?? ''), `%${String(query.tableName ?? '')}%`, `%${String(query.tableName ?? '')}%`], query,
    );
  }

  async databaseTables(query: PageQuery): Promise<{ rows: DataRecord[]; total: number }> {
    const search = String(query.tableName ?? '');
    return this.page(
      `SELECT table_name,table_comment,create_time,update_time FROM information_schema.tables
       WHERE table_schema=DATABASE() AND table_name NOT LIKE 'qrtz_%' AND table_name NOT IN (SELECT table_name FROM gen_table)
       AND (?='' OR table_name LIKE ? OR table_comment LIKE ?) ORDER BY create_time DESC`,
      [search, `%${search}%`, `%${search}%`], query,
    );
  }

  async detail(tableId: number): Promise<DataRecord> {
    const tables = await this.database.query('SELECT * FROM gen_table WHERE table_id=?', [tableId]);
    const columns = await this.database.query('SELECT * FROM gen_table_column WHERE table_id=? ORDER BY sort', [tableId]);
    return { info: tables[0] ?? null, rows: columns, tables: await this.database.query('SELECT table_id,table_name,table_comment FROM gen_table ORDER BY table_name') };
  }

  async columns(tableId: number): Promise<DataRecord[]> {
    return this.database.query('SELECT * FROM gen_table_column WHERE table_id=? ORDER BY sort', [tableId]);
  }

  async importTables(tableNames: string[], template = 'element-ui'): Promise<void> {
    for (const tableName of tableNames) {
      if (!/^[A-Za-z0-9_]+$/.test(tableName)) throw new BadRequestException(`非法表名: ${tableName}`);
      const tables = await this.database.query<{ tableName: string; tableComment: string }>(
        'SELECT table_name,table_comment FROM information_schema.tables WHERE table_schema=DATABASE() AND table_name=?', [tableName],
      );
      if (!tables[0]) throw new BadRequestException(`数据表不存在: ${tableName}`);
      const className = this.pascal(tableName.replace(/^[a-z]+_/, ''));
      const created = await this.database.execute(
        `INSERT INTO gen_table(table_name,table_comment,sub_table_name,sub_table_fk_name,class_name,tpl_category,tpl_web_type,package_name,module_name,business_name,function_name,function_author,gen_type,gen_path,options,create_by,create_time,update_time,remark)
         VALUES(?,?,'','',?,'crud',?,'apps/system-service/src',?,?,?,'yanglao','0','/', '{}','system',NOW(),NOW(),'NestJS codegen')`,
        [tableName, tables[0].tableComment || tableName, className, template, tableName.split('_')[0] || 'system', this.kebab(className), tables[0].tableComment || className],
      );
      await this.syncColumns(created.insertId, tableName);
    }
  }

  async update(input: DataRecord): Promise<void> {
    await this.database.execute(
      `UPDATE gen_table SET table_comment=?,class_name=?,tpl_category=?,tpl_web_type=?,package_name=?,module_name=?,business_name=?,function_name=?,function_author=?,gen_type=?,gen_path=?,options=?,update_time=NOW() WHERE table_id=?`,
      [String(input.tableComment ?? ''), String(input.className ?? ''), String(input.tplCategory ?? 'crud'), String(input.tplWebType ?? 'element-ui'), String(input.packageName ?? 'apps/system-service/src'), String(input.moduleName ?? 'system'), String(input.businessName ?? ''), String(input.functionName ?? ''), String(input.functionAuthor ?? 'yanglao'), String(input.genType ?? '0'), String(input.genPath ?? '/'), typeof input.options === 'string' ? input.options : JSON.stringify(input.options ?? {}), Number(input.tableId)],
    );
    if (Array.isArray(input.columns)) {
      for (const column of input.columns as DataRecord[]) {
        await this.database.execute(
          `UPDATE gen_table_column SET column_comment=?,java_type=?,java_field=?,is_insert=?,is_edit=?,is_list=?,is_query=?,query_type=?,html_type=?,dict_type=?,sort=?,update_by='system',update_time=NOW() WHERE column_id=?`,
          [String(column.columnComment ?? ''), String(column.javaType ?? 'String'), String(column.javaField ?? ''), String(column.isInsert ?? '1'), String(column.isEdit ?? '1'), String(column.isList ?? '1'), String(column.isQuery ?? '1'), String(column.queryType ?? 'EQ'), String(column.htmlType ?? 'input'), String(column.dictType ?? ''), Number(column.sort ?? 0), Number(column.columnId)],
        );
      }
    }
  }

  async remove(ids: number[]): Promise<void> {
    if (!ids.length) return;
    const placeholders = ids.map(() => '?').join(',');
    await this.database.transaction(async (connection) => {
      await connection.execute(`DELETE FROM gen_table_column WHERE table_id IN (${placeholders})`, ids);
      await connection.execute(`DELETE FROM gen_table WHERE table_id IN (${placeholders})`, ids);
    });
  }

  async sync(tableName: string): Promise<void> {
    const rows = await this.database.query<{ tableId: number }>('SELECT table_id FROM gen_table WHERE table_name=? LIMIT 1', [tableName]);
    if (!rows[0]) throw new BadRequestException('生成配置不存在');
    await this.database.execute('DELETE FROM gen_table_column WHERE table_id=?', [rows[0].tableId]);
    await this.syncColumns(rows[0].tableId, tableName);
  }

  async preview(tableId: number): Promise<Record<string, string>> {
    const detail = await this.detail(tableId);
    const table = detail.info as DataRecord | null;
    if (!table) throw new BadRequestException('生成配置不存在');
    const columns = detail.rows as DataRecord[];
    return this.render(String(table.tableName), String(table.className), columns);
  }

  async zip(tableNames: string[]): Promise<Buffer> {
    const zip = new JSZip();
    for (const tableName of tableNames) {
      const tables = await this.database.query<{ tableId: number; className: string }>('SELECT table_id,class_name FROM gen_table WHERE table_name=? LIMIT 1', [tableName]);
      if (!tables[0]) throw new BadRequestException(`生成配置不存在: ${tableName}`);
      const files = await this.preview(tables[0].tableId);
      for (const [path, content] of Object.entries(files)) zip.file(`${this.kebab(tables[0].className)}/${path}`, content);
    }
    return zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  }

  private async syncColumns(tableId: number, tableName: string): Promise<void> {
    const columns = await this.database.query<ColumnInfo>(
      `SELECT column_name,data_type,column_comment,is_nullable,column_key,extra FROM information_schema.columns
       WHERE table_schema=DATABASE() AND table_name=? ORDER BY ordinal_position`, [tableName],
    );
    let sort = 1;
    for (const column of columns) {
      const field = this.camel(column.columnName);
      const primary = column.columnKey === 'PRI' ? '1' : '0';
      const auto = column.extra.includes('auto_increment') ? '1' : '0';
      await this.database.execute(
        `INSERT INTO gen_table_column(table_id,column_name,column_comment,column_type,java_type,java_field,is_pk,is_increment,is_required,is_insert,is_edit,is_list,is_query,query_type,html_type,dict_type,sort,create_by,create_time,update_time)
         VALUES(?,?,?,?,?,?,?,?,?,'1','1','1',?,'EQ',?,'',?,'system',NOW(),NOW())`,
        [tableId, column.columnName, column.columnComment ?? '', column.dataType, this.tsType(column.dataType), field, primary, auto, column.isNullable === 'NO' ? '1' : '0', primary === '1' ? '0' : '1', this.inputType(column.dataType), sort++],
      );
    }
  }

  private render(tableName: string, className: string, columns: DataRecord[]): Record<string, string> {
    const kebab = this.kebab(className);
    const idColumn = columns.find((column) => column.isPk === '1') ?? columns[0];
    const idField = String(idColumn?.javaField ?? 'id');
    const dtoFields = columns.map((column) => `  ${String(column.javaField)}?: ${this.dtoType(String(column.javaType))};`).join('\n');
    return {
      [`dto/${kebab}.dto.ts`]: `export class ${className}Dto {\n${dtoFields}\n}\n`,
      [`${kebab}.service.ts`]: `import { Injectable } from '@nestjs/common';\nimport { DatabaseService } from '@app/common';\nimport { ${className}Dto } from './dto/${kebab}.dto';\n\n@Injectable()\nexport class ${className}Service {\n  constructor(private readonly database: DatabaseService) {}\n  list() { return this.database.query('SELECT * FROM ${tableName}'); }\n  get(id: string) { return this.database.query('SELECT * FROM ${tableName} WHERE ${String(idColumn?.columnName ?? 'id')}=? LIMIT 1', [id]); }\n  create(input: ${className}Dto) { return input; }\n  update(id: string, input: ${className}Dto) { return { id, ...input }; }\n}\n`,
      [`${kebab}.controller.ts`]: `import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';\nimport { ${className}Service } from './${kebab}.service';\nimport { ${className}Dto } from './dto/${kebab}.dto';\n\n@Controller('${kebab}')\nexport class ${className}Controller {\n  constructor(private readonly service: ${className}Service) {}\n  @Get() list() { return this.service.list(); }\n  @Get(':${idField}') get(@Param('${idField}') id: string) { return this.service.get(id); }\n  @Post() create(@Body() input: ${className}Dto) { return this.service.create(input); }\n  @Put(':${idField}') update(@Param('${idField}') id: string, @Body() input: ${className}Dto) { return this.service.update(id, input); }\n}\n`,
      [`${kebab}.module.ts`]: `import { Module } from '@nestjs/common';\nimport { ${className}Controller } from './${kebab}.controller';\nimport { ${className}Service } from './${kebab}.service';\n\n@Module({ controllers: [${className}Controller], providers: [${className}Service] })\nexport class ${className}Module {}\n`,
    };
  }

  private async page(sql: string, values: Array<string | number>, query: PageQuery): Promise<{ rows: DataRecord[]; total: number }> {
    const all = await this.database.query(sql, values);
    const page = Math.max(1, Number(query.pageNum ?? 1)); const size = Math.min(500, Math.max(1, Number(query.pageSize ?? 10)));
    return { rows: all.slice((page - 1) * size, page * size), total: all.length };
  }
  private camel(value: string): string { return value.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase()); }
  private pascal(value: string): string { const camel = this.camel(value); return `${camel[0]?.toUpperCase() ?? ''}${camel.slice(1)}`; }
  private kebab(value: string): string { return value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replaceAll('_', '-').toLowerCase(); }
  private tsType(type: string): string { return /int|decimal|float|double|bit/.test(type) ? 'number' : /date|time/.test(type) ? 'Date' : /json/.test(type) ? 'Record<string, unknown>' : 'string'; }
  private dtoType(javaType: string): string { return ['number', 'Date', 'string', 'Record<string, unknown>'].includes(javaType) ? javaType : 'string'; }
  private inputType(type: string): string { return /text|json/.test(type) ? 'textarea' : /date|time/.test(type) ? 'datetime' : /int|decimal|float|double/.test(type) ? 'input' : 'input'; }
}
