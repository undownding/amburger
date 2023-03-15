import { Module } from '@nestjs/common'
import { ResourceService } from './resource.service'
import { ResourceController } from './resource.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Resource } from './resource.entity'
import { Permission } from './permission.entity'
import { UserModule } from '@/user/user.module'

@Module({
  imports: [TypeOrmModule.forFeature([Resource, Permission]), UserModule],
  providers: [ResourceService],
  controllers: [ResourceController],
})
export class ResourceModule {}
