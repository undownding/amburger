import { Module } from '@nestjs/common'
import { ResourceService } from './resource.service'
import { ResourceController } from './resource.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Resource } from './resource.entity'
import { UserModule } from '@/user/user.module'
import { AssignerModule } from './assigner/assigner.module'

@Module({
  imports: [TypeOrmModule.forFeature([Resource]), UserModule, AssignerModule],
  providers: [ResourceService],
  controllers: [ResourceController],
})
export class ResourceModule {}
