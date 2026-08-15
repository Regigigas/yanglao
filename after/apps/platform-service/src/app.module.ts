import { Module } from '@nestjs/common';
import { AppUpdatesModule } from './modules/app-updates/app-updates.module';
import { AuditModule } from './modules/audit/audit.module';
import { ConfigModule } from './modules/config/config.module';
import { DictionaryModule } from './modules/dictionary/dictionary.module';
import { HealthModule } from './modules/health/health.module';
import { NoticesModule } from './modules/notices/notices.module';
import { OnlineSessionsModule } from './modules/online-sessions/online-sessions.module';

@Module({
  imports: [HealthModule, ConfigModule, DictionaryModule, NoticesModule, AuditModule, OnlineSessionsModule, AppUpdatesModule],
})
export class PlatformModule {}
