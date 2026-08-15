import { Body, Controller, Delete, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { success, type DataRecord } from '@app/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  async login(@Body() body: DataRecord, @Req() request: Request): Promise<DataRecord> {
    return success(await this.auth.login(body.username, body.password, request.ip ?? ''));
  }

  @Delete('logout')
  async logout(@Req() request: Request): Promise<DataRecord> {
    await this.auth.logout(request.header('authorization')?.replace(/^Bearer\s+/i, '') ?? '');
    return success();
  }

  @Post('refresh')
  async refresh(@Req() request: Request): Promise<DataRecord> {
    return success(await this.auth.refresh(request.header('authorization')?.replace(/^Bearer\s+/i, '') ?? ''));
  }

  @Post('register')
  async register(@Body() body: DataRecord): Promise<DataRecord> {
    await this.auth.register(body.username, body.password);
    return success();
  }

  @Post('unlockscreen')
  async unlock(@Body() body: DataRecord, @Req() request: Request): Promise<DataRecord> {
    const token = request.header('authorization')?.replace(/^Bearer\s+/i, '') ?? '';
    const claims = jwt.verify(token, process.env.JWT_SECRET ?? 'abcdefghijklmnopqrstuvwxyz', { algorithms: ['HS512'] });
    const userId = typeof claims === 'object' ? Number(claims.user_id) : 0;
    await this.auth.unlock(userId, body.password);
    return success();
  }
}
