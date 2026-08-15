import 'dotenv/config';
import { bootstrapService } from '@app/common';
import { SystemModule } from './app.module';

void bootstrapService(SystemModule, 'system', 9201);
