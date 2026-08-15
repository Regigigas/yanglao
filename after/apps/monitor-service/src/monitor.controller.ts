import { Controller, Get } from '@nestjs/common';
import { cpus, freemem, hostname, loadavg, platform, totalmem, uptime } from 'node:os';
import { DatabaseService, type DataRecord } from '@app/common';

@Controller()
export class MonitorController {
  constructor(private readonly database: DatabaseService) {}
  @Get(['health', 'actuator/health'])
  async health(): Promise<DataRecord> {
    const database = await this.database.ping();
    return { status: database ? 'UP' : 'DEGRADED', components: { database: { status: database ? 'UP' : 'DOWN' } }, service: 'monitor-service' };
  }
  @Get(['metrics', 'actuator/metrics'])
  metrics(): DataRecord {
    const memory = process.memoryUsage();
    return {
      process: { pid: process.pid, uptime: process.uptime(), memory, node: process.version },
      system: { hostname: hostname(), platform: platform(), cpus: cpus().length, loadAverage: loadavg(), uptime: uptime(), totalMemory: totalmem(), freeMemory: freemem() },
      timestamp: new Date().toISOString(),
    };
  }
}
