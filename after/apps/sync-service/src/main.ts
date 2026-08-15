import 'dotenv/config';
import { bootstrapService } from '@app/common';
import { SyncModule } from './app.module';

void bootstrapService(SyncModule, 'sync', 9207);
