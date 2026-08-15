import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { RedisService, success, table, type DataRecord, type PageQuery } from '@app/common';

@Controller('online')
export class OnlineSessionsController {
  constructor(private readonly redis: RedisService) {}

  @Get('list')
  async online(@Query() query: PageQuery): Promise<DataRecord> {
    const keyword = String(query.userName ?? '');
    const rows: DataRecord[] = [];
    for (const key of await this.redis.keys('login_tokens:*')) {
      const session = await this.redis.getJson<DataRecord>(key);
      if (!session || (keyword && !String(session.username ?? '').includes(keyword))) continue;
      rows.push({ tokenId: key.slice('login_tokens:'.length), userName: session.username, ipaddr: session.ipaddr, loginTime: session.loginTime });
    }
    return table(rows, rows.length);
  }

  @Delete(':tokenId')
  async forceLogout(@Param('tokenId') tokenId: string): Promise<DataRecord> {
    await this.redis.delete(`login_tokens:${tokenId}`);
    return success();
  }
}
