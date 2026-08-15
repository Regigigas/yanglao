import { Module } from '@nestjs/common';
import { CommonModule } from '@app/common';
import { IdentityService } from './identity.service';

@Module({
  imports: [CommonModule],
  providers: [IdentityService],
  exports: [CommonModule, IdentityService],
})
export class IdentityDomainModule {}
