import { Module } from '@nestjs/common'
import { ResourceService } from './resource.service'
import { ResourceController } from './resource.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Resource } from './resource.entity'
import { UserModule } from '@/user/user.module'
import { PermissionModule } from '@/permission/permission.module'

@Module({
  imports: [TypeOrmModule.forFeature([Resource]), PermissionModule, UserModule],
  providers: [ResourceService],
  controllers: [ResourceController],
})
export class ResourceModule {}
