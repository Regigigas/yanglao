import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { DatabaseService, affected, success, successWith, type DataRecord, type PageQuery } from '@app/common';
import { IdentityService } from '../../domain/identity.service';
import { MENU_RESOURCE } from '../../domain/resources';
import { currentUserId, currentUsername } from '../../shared/http.helpers';

@Controller('menu')
export class MenusController {
  constructor(
    private readonly database: DatabaseService,
    private readonly identity: IdentityService,
  ) {}

  @Get('list')
  async menus(@Req() request: Request, @Query() query: PageQuery): Promise<DataRecord> {
    return success(await this.identity.listMenus(query, currentUserId(request)));
  }

  @Get('getRouters')
  async routers(@Req() request: Request): Promise<DataRecord> {
    return success(await this.identity.menuTree(currentUserId(request)));
  }

  @Get('treeselect')
  async menuTree(@Req() request: Request, @Query() query: PageQuery): Promise<DataRecord> {
    return success(this.identity.buildTreeSelect(await this.identity.listMenus(query, currentUserId(request)), 'menuId', 'parentId', 'menuName'));
  }

  @Get('roleMenuTreeselect/:roleId')
  async roleMenuTree(@Req() request: Request, @Param('roleId') id: string): Promise<DataRecord> {
    const menus = await this.identity.listMenus({}, currentUserId(request));
    const checked = await this.database.query<{ menuId: number }>('SELECT menu_id FROM sys_role_menu WHERE role_id=?', [Number(id)]);
    return successWith({ checkedKeys: checked.map((row) => row.menuId), menus: this.identity.buildTreeSelect(menus, 'menuId', 'parentId', 'menuName') });
  }

  @Get(':menuId')
  async menu(@Param('menuId') id: string): Promise<DataRecord> {
    return success(await this.database.get(MENU_RESOURCE, Number(id)));
  }

  @Post()
  async addMenu(@Body() body: DataRecord, @Req() request: Request): Promise<DataRecord> {
    return affected(await this.identity.saveMenu(body, currentUsername(request), true));
  }

  @Put()
  async editMenu(@Body() body: DataRecord, @Req() request: Request): Promise<DataRecord> {
    return affected(await this.identity.saveMenu(body, currentUsername(request), false));
  }

  @Put('updateSort')
  async menuSort(@Body() body: DataRecord): Promise<DataRecord> {
    await this.identity.updateSort('sys_menu', 'menu_id', String(body.menuIds ?? ''), String(body.orderNums ?? ''));
    return success();
  }

  @Delete(':menuId')
  async deleteMenu(@Param('menuId') id: string): Promise<DataRecord> {
    const children = await this.database.query('SELECT menu_id FROM sys_menu WHERE parent_id=? LIMIT 1', [Number(id)]);
    if (children.length) return { code: 601, msg: '存在子菜单，不允许删除' };
    return affected((await this.database.remove(MENU_RESOURCE, [Number(id)])).affectedRows);
  }
}
