import { Module } from '@nestjs/common';
import { CommonModule } from '@app/common';
import { MonitorController } from './monitor.controller';

@Module({ imports: [CommonModule], controllers: [MonitorController] })
export class MonitorModule {}
