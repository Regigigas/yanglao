import { Module } from '@nestjs/common';
import { PlatformDomainModule } from '../../domain/platform-domain.module';
import { DictionaryController } from './dictionary.controller';

@Module({
  imports: [PlatformDomainModule],
  controllers: [DictionaryController],
})
export class DictionaryModule {}
