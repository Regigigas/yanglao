import { Module } from '@nestjs/common';
import { CommonModule } from '@app/common';
import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';

@Module({ imports: [CommonModule], controllers: [SyncController], providers: [SyncService] })
export class SyncModule {}
