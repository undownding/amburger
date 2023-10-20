import { Module } from '@nestjs/common'
import { MockModule } from './mock/mock.module'
import { SmsProxyService } from '@/sms/sms-proxy.service'
import { SmsController } from './sms.controller'

@Module({
  imports: [MockModule],
  providers: [SmsProxyService],
  exports: [SmsProxyService],
  controllers: [SmsController],
})
export class SmsModule {}
