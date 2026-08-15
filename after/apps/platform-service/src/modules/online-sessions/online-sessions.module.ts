import { Module } from '@nestjs/common';
import { PlatformDomainModule } from '../../domain/platform-domain.module';
import { OnlineSessionsController } from './online-sessions.controller';

@Module({
  imports: [PlatformDomainModule],
  controllers: [OnlineSessionsController],
})
export class OnlineSessionsModule {}
