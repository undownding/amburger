import { Module } from '@nestjs/common'
import { ResourceService } from './resource.service.js'
import { ResourceController } from './resource.controller.js'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Resource } from './resource.entity.js'
import { UserModule } from '@/user/user.module.js'
import { AssignerModule } from './assigner/assigner.module.js'

@Module({
  imports: [TypeOrmModule.forFeature([Resource]), UserModule, AssignerModule],
  providers: [ResourceService],
  controllers: [ResourceController],
})
export class ResourceModule {}
