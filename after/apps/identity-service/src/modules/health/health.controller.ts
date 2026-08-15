import { Controller, Get } from '@nestjs/common';
import { DatabaseService, type DataRecord } from '@app/common';

@Controller()
export class HealthController {
  constructor(private readonly database: DatabaseService) {}

  @Get('health')
  async health(): Promise<DataRecord> {
    return { status: (await this.database.ping()) ? 'ok' : 'degraded', service: 'identity-service', timestamp: new Date().toISOString() };
  }
}
