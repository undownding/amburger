import { Module } from '@nestjs/common'
import { MockService } from './mock.service'
import { SMS_SERVICE } from '@/sms/sms.constants'

@Module({
  providers: [
    MockService,
    {
      provide: SMS_SERVICE,
      useClass: MockService,
    },
  ],
  exports: [
    {
      provide: SMS_SERVICE,
      useExisting: MockService,
    },
  ],
})
export class MockModule {}
