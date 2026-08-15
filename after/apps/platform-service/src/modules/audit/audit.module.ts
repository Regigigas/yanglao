import { Module } from '@nestjs/common';
import { PlatformDomainModule } from '../../domain/platform-domain.module';
import { AuditController } from './audit.controller';

@Module({
  imports: [PlatformDomainModule],
  controllers: [AuditController],
})
export class AuditModule {}
