import 'dotenv/config';
import { bootstrapService } from '@app/common';
import { IdentityModule } from './app.module';

void bootstrapService(IdentityModule, 'identity', 9201);
