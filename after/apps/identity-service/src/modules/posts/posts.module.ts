import { Module } from '@nestjs/common';
import { IdentityDomainModule } from '../../domain/identity-domain.module';
import { PostController } from './posts.controller';

@Module({
  imports: [IdentityDomainModule],
  controllers: [PostController],
})
export class PostsModule {}
