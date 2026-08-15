import { Module } from '@nestjs/common';
import { CommonModule } from '@app/common';
import { IdentityController } from './identity.controller';
import { PostController } from './post.controller';
import { IdentityService } from './identity.service';

@Module({
  imports: [CommonModule],
  controllers: [IdentityController, PostController],
  providers: [IdentityService],
})
export class IdentityModule {}
