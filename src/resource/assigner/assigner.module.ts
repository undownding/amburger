import { Module } from '@nestjs/common'
import { AssignerService } from './assigner.service.js'
import { AssignerController } from './assigner.controller.js'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Assigner } from '@/resource/assigner/assigner.enitity.js'

@Module({
  imports: [TypeOrmModule.forFeature([Assigner])],
  providers: [AssignerService],
  controllers: [AssignerController],
  exports: [AssignerService],
})
export class AssignerModule {}
