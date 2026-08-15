import 'dotenv/config';
import { bootstrapService } from '@app/common';
import { MonitorModule } from './app.module';

void bootstrapService(MonitorModule, 'monitor', 9100);
