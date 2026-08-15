import { Module } from '@nestjs/common';
import { PlatformDomainModule } from '../../domain/platform-domain.module';
import { HealthController } from './health.controller';

@Module({
  imports: [PlatformDomainModule],
  controllers: [HealthController],
})
export class HealthModule {}
