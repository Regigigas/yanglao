import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { DatabaseService, affected, success, type DataRecord, type PageQuery } from '@app/common';
import { IdentityService } from '../../domain/identity.service';
import { DEPT_RESOURCE } from '../../domain/resources';
import { currentUserId, currentUsername } from '../../shared/http.helpers';

@Controller('dept')
export class DepartmentsController {
  constructor(
    private readonly database: DatabaseService,
    private readonly identity: IdentityService,
  ) {}

  @Get('list')
  async departments(@Query() query: PageQuery, @Req() request: Request): Promise<DataRecord> {
    return success(await this.identity.listDepartments(query, currentUserId(request)));
  }

  @Get('list/exclude/:deptId')
  async departmentsExclude(@Param('deptId') id: string, @Req() request: Request): Promise<DataRecord> {
    const all = await this.identity.listDepartments({}, currentUserId(request));
    const current = Number(id);
    return success(all.filter((dept) => Number(dept.deptId) !== current && !String(dept.ancestors ?? '').split(',').includes(id)));
  }

  @Get(':deptId')
  async department(@Param('deptId') id: string): Promise<DataRecord> {
    return success(await this.database.get(DEPT_RESOURCE, Number(id)));
  }

  @Post()
  async addDepartment(@Body() body: DataRecord, @Req() request: Request): Promise<DataRecord> {
    return affected(await this.identity.saveDepartment(body, currentUsername(request), true));
  }

  @Put()
  async editDepartment(@Body() body: DataRecord, @Req() request: Request): Promise<DataRecord> {
    return affected(await this.identity.saveDepartment(body, currentUsername(request), false));
  }

  @Put('updateSort')
  async deptSort(@Body() body: DataRecord): Promise<DataRecord> {
    await this.identity.updateSort('sys_dept', 'dept_id', String(body.deptIds ?? ''), String(body.orderNums ?? ''));
    return success();
  }

  @Delete(':deptId')
  async deleteDepartment(@Param('deptId') id: string): Promise<DataRecord> {
    const children = await this.database.query("SELECT dept_id FROM sys_dept WHERE parent_id=? AND del_flag='0' LIMIT 1", [Number(id)]);
    if (children.length) return { code: 601, msg: '瀛樺湪涓嬬骇閮ㄩ棬锛屼笉鍏佽鍒犻櫎' };
    return affected((await this.database.remove(DEPT_RESOURCE, [Number(id)])).affectedRows);
  }
}
