import { Module } from '@nestjs/common';
import { IdentityDomainModule } from '../../domain/identity-domain.module';
import { UsersController } from './users.controller';

@Module({
  imports: [IdentityDomainModule],
  controllers: [UsersController],
})
export class UsersModule {}
