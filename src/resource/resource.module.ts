import { Module } from '@nestjs/common'
import { ResourceService } from './resource.service'
import { ResourceController } from './resource.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Resource } from './resource.entity'
import { Permission } from './permission.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Resource, Permission])],
  providers: [ResourceService],
  controllers: [ResourceController],
})
export class ResourceModule {}
