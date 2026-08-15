import 'dotenv/config';
import { bootstrapService } from '@app/common';
import { SchedulerModule } from './app.module';

void bootstrapService(SchedulerModule, 'scheduler', 9203);
