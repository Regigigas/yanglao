import 'dotenv/config';
import { bootstrapService } from '@app/common';
import { AuthModule } from './app.module';

void bootstrapService(AuthModule, 'auth', 9200);
