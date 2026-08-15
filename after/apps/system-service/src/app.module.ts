import { Module } from '@nestjs/common';
import { CommonModule } from '@app/common';
import { ResourceController } from './resource.controller';
import { SystemController } from './system.controller';
import { SystemService } from './system.service';
import { ChatService } from './chat.service';
import { PurchaseService } from './purchase.service';
import { SyncService } from './sync.service';

@Module({
  imports: [CommonModule],
  controllers: [ResourceController, SystemController],
  providers: [SystemService, ChatService, PurchaseService, SyncService],
})
export class SystemModule {}
