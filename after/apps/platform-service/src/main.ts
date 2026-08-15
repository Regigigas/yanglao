import 'dotenv/config';
import { bootstrapService } from '@app/common';
import { PlatformModule } from './app.module';

void bootstrapService(PlatformModule, 'platform', 9204);
