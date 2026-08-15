import { Body, Controller, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { DatabaseService, success, type DataRecord, type PageQuery } from '@app/common';
import { CollaborationService } from './collaboration.service';

@Controller()
export class CollaborationController {
  constructor(
    private readonly database: DatabaseService,
    private readonly collaboration: CollaborationService,
  ) {}

  @Get('health')
  async health(): Promise<DataRecord> {
    return { status: (await this.database.ping()) ? 'ok' : 'degraded', service: 'collaboration-service', timestamp: new Date().toISOString() };
  }

  @Get('chat/contacts')
  async contacts(@Req() request: Request, @Query('keyword') keyword: string): Promise<DataRecord> {
    return success(await this.collaboration.contacts(this.userId(request), keyword));
  }

  @Get('chat/me')
  me(@Req() request: Request): DataRecord {
    return success({ userId: this.userId(request), userName: this.username(request) });
  }

  @Get('chat/conversations')
  async conversations(@Req() request: Request): Promise<DataRecord> {
    return success(await this.collaboration.conversations(this.userId(request)));
  }

  @Post('chat/conversations/direct')
  async direct(@Req() request: Request, @Body() body: DataRecord): Promise<DataRecord> {
    return success(await this.collaboration.createDirect(this.userId(request), Number(body.peerUserId)));
  }

  @Post('chat/conversations/group')
  async group(@Req() request: Request, @Body() body: DataRecord): Promise<DataRecord> {
    return success(await this.collaboration.createGroup(this.userId(request), body.name, body.memberUserIds));
  }

  @Get('chat/conversations/:conversationId/messages')
  async messages(@Req() request: Request, @Param('conversationId') id: string, @Query() query: PageQuery): Promise<DataRecord> {
    return success(await this.collaboration.messages(this.userId(request), Number(id), query.afterMessageId, query.beforeMessageId, query.limit));
  }

  @Post('chat/conversations/:conversationId/messages')
  async send(@Req() request: Request, @Param('conversationId') id: string, @Body() body: DataRecord): Promise<DataRecord> {
    return success(await this.collaboration.send(this.userId(request), Number(id), body));
  }

  @Put('chat/conversations/:conversationId/read')
  async read(@Req() request: Request, @Param('conversationId') id: string, @Body() body: DataRecord): Promise<DataRecord> {
    await this.collaboration.markRead(this.userId(request), Number(id), Number(body.lastReadMessageId));
    return success({ ok: true });
  }

  private userId(request: Request): number {
    return Number(request.headers.user_id ?? 0);
  }

  private username(request: Request): string {
    return decodeURIComponent(String(request.headers.username ?? 'system'));
  }
}
