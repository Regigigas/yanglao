import 'dotenv/config';
import { bootstrapService } from '@app/common';
import { CollaborationModule } from './app.module';

void bootstrapService(CollaborationModule, 'collaboration', 9206);
