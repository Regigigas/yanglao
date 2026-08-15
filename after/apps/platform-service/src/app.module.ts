import { Module } from '@nestjs/common';
import { CommonModule } from '@app/common';
import { PlatformController } from './platform.controller';

@Module({ imports: [CommonModule], controllers: [PlatformController] })
export class PlatformModule {}
