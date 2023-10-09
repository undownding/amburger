import { Module } from '@nestjs/common'
import { MockModule } from './mock/mock.module.js'
import { SmsProxyService } from '@/sms/sms-proxy.service.js'
import { SmsController } from './sms.controller.js'

@Module({
  imports: [MockModule],
  providers: [SmsProxyService],
  exports: [SmsProxyService],
  controllers: [SmsController],
})
export class SmsModule {}
