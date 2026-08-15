import { Module } from '@nestjs/common';
import { DepartmentsModule } from './modules/departments/departments.module';
import { HealthModule } from './modules/health/health.module';
import { MenusModule } from './modules/menus/menus.module';
import { PostsModule } from './modules/posts/posts.module';
import { RolesModule } from './modules/roles/roles.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [HealthModule, UsersModule, RolesModule, DepartmentsModule, MenusModule, PostsModule],
})
export class IdentityModule {}
