import 'dotenv/config';
import { bootstrapService } from '@app/common';
import { CodegenModule } from './app.module';

void bootstrapService(CodegenModule, 'generator', 9202);
