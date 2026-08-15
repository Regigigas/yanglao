import { Module } from '@nestjs/common';
import { PlatformDomainModule } from '../../domain/platform-domain.module';
import { NoticesController } from './notices.controller';

@Module({
  imports: [PlatformDomainModule],
  controllers: [NoticesController],
})
export class NoticesModule {}
