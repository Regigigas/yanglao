import { Controller, Get, Module } from '@nestjs/common';

@Controller()
class GatewayController {
  @Get('code')
  captcha(): Record<string, unknown> {
    return {
      code: 200,
      msg: '操作成功',
      captchaEnabled: String(process.env.CAPTCHA_ENABLED).toLowerCase() === 'true',
      uuid: '',
      img: '',
    };
  }

  @Get('health')
  health(): Record<string, unknown> {
    return { status: 'ok', service: 'gateway-service', timestamp: new Date().toISOString() };
  }
}

@Module({ controllers: [GatewayController] })
export class GatewayModule {}
