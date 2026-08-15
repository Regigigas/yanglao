import { Controller, Get, Module } from '@nestjs/common';

@Controller()
class GatewayController {
  @Get('health')
  health(): Record<string, unknown> {
    return { status: 'ok', service: 'gateway-service', timestamp: new Date().toISOString() };
  }
}

@Module({ controllers: [GatewayController] })
export class GatewayModule {}
