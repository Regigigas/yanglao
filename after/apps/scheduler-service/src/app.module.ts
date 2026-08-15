import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CommonModule } from '@app/common';
import { SchedulerController } from './scheduler.controller';
import { SchedulerService } from './scheduler.service';

@Module({ imports: [CommonModule, ScheduleModule.forRoot()], controllers: [SchedulerController], providers: [SchedulerService] })
export class SchedulerModule {}
