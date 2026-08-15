import { Module } from '@nestjs/common';
import { IdentityDomainModule } from '../../domain/identity-domain.module';
import { DepartmentsController } from './departments.controller';

@Module({
  imports: [IdentityDomainModule],
  controllers: [DepartmentsController],
})
export class DepartmentsModule {}
