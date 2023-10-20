import { Injectable, Logger } from '@nestjs/common'
import { BaseSmsService } from '@/sms/base-sms-service'
import { SmsDto } from '@/sms/sms.dto'

@Injectable()
export class MockService extends BaseSmsService {
  async sendCode({ regionCode, phone }: SmsDto, code: string): Promise<void> {
    Logger.log(`Mock SMS ${regionCode}${phone}: ${code}`, 'MockService')
  }
}
