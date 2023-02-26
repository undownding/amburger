import { Injectable } from '@nestjs/common'
import { BaseSmsService } from '@/sms/base-sms-service'
import { SmsDto } from '@/sms/sms.dto'

@Injectable()
export class MockService extends BaseSmsService {
  async sendCode({ regionCode, phone }: SmsDto): Promise<void> {
    // do nothing
  }
}
