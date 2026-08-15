import { Module } from '@nestjs/common';
import { PlatformDomainModule } from '../../domain/platform-domain.module';
import { ConfigController } from './config.controller';

@Module({
  imports: [PlatformDomainModule],
  controllers: [ConfigController],
})
export class ConfigModule {}
