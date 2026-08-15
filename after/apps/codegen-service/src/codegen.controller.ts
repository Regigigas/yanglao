import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { success, successWith, table, type DataRecord, type PageQuery } from '@app/common';
import { CodegenService } from './codegen.service';

@Controller('gen')
export class CodegenController {
  constructor(private readonly codegen: CodegenService) {}
  @Get('list') async list(@Query() query: PageQuery): Promise<DataRecord> { const result = await this.codegen.configured(query); return table(result.rows, result.total); }
  @Get('db/list') async database(@Query() query: PageQuery): Promise<DataRecord> { const result = await this.codegen.databaseTables(query); return table(result.rows, result.total); }
  @Get('column/:tableId') async columns(@Param('tableId') id: string): Promise<DataRecord> { const rows = await this.codegen.columns(Number(id)); return table(rows, rows.length); }
  @Post('importTable') async import(@Query('tables') tables: string, @Query('tplWebType') webType: string): Promise<DataRecord> { await this.codegen.importTables(tables.split(',').filter(Boolean), webType); return success(); }
  @Get('preview/:tableId') async preview(@Param('tableId') id: string): Promise<DataRecord> { return success(await this.codegen.preview(Number(id))); }
  @Get('download/:tableName') async download(@Param('tableName') tableName: string, @Res() response: Response): Promise<void> { this.sendZip(response, await this.codegen.zip([tableName]), `${tableName}.zip`); }
  @Get('batchGenCode') async batch(@Query('tables') tables: string, @Res() response: Response): Promise<void> { this.sendZip(response, await this.codegen.zip(tables.split(',').filter(Boolean)), 'nestjs-code.zip'); }
  @Get('genCode/:tableName') async generate(@Param('tableName') tableName: string): Promise<DataRecord> { await this.codegen.zip([tableName]); return success(); }
  @Get('synchDb/:tableName') async sync(@Param('tableName') tableName: string): Promise<DataRecord> { await this.codegen.sync(tableName); return success(); }
  @Get(':tableId') async detail(@Param('tableId') id: string): Promise<DataRecord> { return successWith(await this.codegen.detail(Number(id))); }
  @Put() async update(@Body() body: DataRecord): Promise<DataRecord> { await this.codegen.update(body); return success(); }
  @Delete(':tableIds') async remove(@Param('tableIds') ids: string): Promise<DataRecord> { await this.codegen.remove(ids.split(',').map(Number).filter(Boolean)); return success(); }
  private sendZip(response: Response, content: Buffer, name: string): void { response.setHeader('Content-Type', 'application/zip'); response.setHeader('Content-Disposition', `attachment; filename=${name}`); response.send(content); }
}
