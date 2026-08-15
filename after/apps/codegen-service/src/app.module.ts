import { Module } from '@nestjs/common';
import { CommonModule } from '@app/common';
import { CodegenController } from './codegen.controller';
import { CodegenService } from './codegen.service';

@Module({ imports: [CommonModule], controllers: [CodegenController], providers: [CodegenService] })
export class CodegenModule {}
