import { Module } from '@nestjs/common';
import { IdentityDomainModule } from '../../domain/identity-domain.module';
import { MenusController } from './menus.controller';

@Module({
  imports: [IdentityDomainModule],
  controllers: [MenusController],
})
export class MenusModule {}
