import { Module } from '@nestjs/common'
import { ResourceService } from './resource.service'
import { ResourceController } from './resource.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Resource } from './resource.entity'
import { Permission } from './permission.entity'
import { typeOrmModuleOptions } from '@/lib/data-source'

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmModuleOptions),
    TypeOrmModule.forFeature([Resource, Permission]),
  ],
  providers: [ResourceService],
  controllers: [ResourceController],
})
export class ResourceModule {}
