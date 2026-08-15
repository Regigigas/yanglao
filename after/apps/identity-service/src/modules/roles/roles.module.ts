import { Module } from '@nestjs/common';
import { IdentityDomainModule } from '../../domain/identity-domain.module';
import { RolesController } from './roles.controller';

@Module({
  imports: [IdentityDomainModule],
  controllers: [RolesController],
})
export class RolesModule {}
