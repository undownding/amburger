import { Module } from '@nestjs/common'
import { AssignerService } from './assigner.service'
import { AssignerController } from './assigner.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Assigner } from '@/resource/assigner/assigner.enitity'

@Module({
  imports: [TypeOrmModule.forFeature([Assigner])],
  providers: [AssignerService],
  controllers: [AssignerController],
  exports: [AssignerService],
})
export class AssignerModule {}
