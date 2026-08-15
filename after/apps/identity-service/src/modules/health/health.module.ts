import { Module } from '@nestjs/common';
import { IdentityDomainModule } from '../../domain/identity-domain.module';
import { HealthController } from './health.controller';

@Module({
  imports: [IdentityDomainModule],
  controllers: [HealthController],
})
export class HealthModule {}
