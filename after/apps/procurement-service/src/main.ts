import 'dotenv/config';
import { bootstrapService } from '@app/common';
import { ProcurementModule } from './app.module';

void bootstrapService(ProcurementModule, 'procurement', 9205);
