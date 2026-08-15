import { Module } from '@nestjs/common';
import { CommonModule } from '@app/common';
import { CollaborationController } from './collaboration.controller';
import { CollaborationService } from './collaboration.service';

@Module({
  imports: [CommonModule],
  controllers: [CollaborationController],
  providers: [CollaborationService],
})
export class CollaborationModule {}
