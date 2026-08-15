import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { Request } from 'express';
import { DatabaseService, affected, success, table, type DataRecord, type PageQuery, type Primitive } from '@app/common';
import { ProcurementService } from './procurement.service';
import { SUPPLIER_RESOURCE } from './resources';

@Controller()
export class ProcurementController {
  constructor(
    private readonly database: DatabaseService,
    private readonly procurement: ProcurementService,
  ) {}

  @Get('health')
  async health(): Promise<DataRecord> {
    return { status: (await this.database.ping()) ? 'ok' : 'degraded', service: 'procurement-service', timestamp: new Date().toISOString() };
  }

  @Get('purchase/supplier/list')
  async suppliers(@Query() query: PageQuery): Promise<DataRecord> {
    const result = await this.database.list(SUPPLIER_RESOURCE, query);
    return table(result.rows, result.total);
  }

  @Get('purchase/supplier/:id')
  async supplier(@Param('id') id: string): Promise<DataRecord> {
    return success(await this.database.get(SUPPLIER_RESOURCE, id));
  }

  @Post('purchase/supplier')
  async addSupplier(@Req() request: Request, @Body() body: DataRecord): Promise<DataRecord> {
    if (!body.id) body.id = randomUUID();
    return affected((await this.database.insert(SUPPLIER_RESOURCE, body, this.username(request))).affectedRows);
  }

  @Put('purchase/supplier')
  async editSupplier(@Req() request: Request, @Body() body: DataRecord): Promise<DataRecord> {
    return affected((await this.database.update(SUPPLIER_RESOURCE, body, this.username(request))).affectedRows);
  }

  @Delete('purchase/supplier/:ids')
  async removeSuppliers(@Param('ids') idsText: string): Promise<DataRecord> {
    const ids: Primitive[] = idsText.split(',').map((id) => id.trim()).filter(Boolean);
    return affected((await this.database.remove(SUPPLIER_RESOURCE, ids)).affectedRows);
  }

  @Get('purchase/order/list')
  async purchaseList(@Query() query: PageQuery): Promise<DataRecord> {
    const result = await this.procurement.list(query);
    return table(result.rows, result.total);
  }

  @Get('purchase/order/stats')
  async purchaseStats(): Promise<DataRecord> {
    return success(await this.procurement.stats());
  }

  @Get('purchase/order/:id/items')
  async purchaseItems(@Param('id') id: string): Promise<DataRecord> {
    return success(await this.procurement.items(id));
  }

  @Get('purchase/order/:id')
  async purchaseDetail(@Param('id') id: string): Promise<DataRecord> {
    return success(await this.procurement.get(id));
  }

  @Post('purchase/order')
  async addPurchase(@Body() body: DataRecord, @Req() request: Request): Promise<DataRecord> {
    await this.procurement.create(body, this.username(request));
    return success();
  }

  @Put('purchase/order/:id/status')
  async purchaseStatus(@Param('id') id: string, @Body() body: DataRecord, @Req() request: Request): Promise<DataRecord> {
    return affected(await this.procurement.updateStatus(id, String(body.status), this.username(request)));
  }

  @Delete('purchase/order/:ids')
  async removePurchases(@Param('ids') ids: string): Promise<DataRecord> {
    return affected(await this.procurement.remove(ids.split(',').filter(Boolean)));
  }

  private username(request: Request): string {
    return decodeURIComponent(String(request.headers.username ?? 'system'));
  }
}
