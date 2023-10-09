import { Module } from '@nestjs/common'
import { OssService } from './oss.service.js'
import { OssController } from './oss.controller.js'

@Module({
  providers: [OssService],
  controllers: [OssController],
})
export class OssModule {}
