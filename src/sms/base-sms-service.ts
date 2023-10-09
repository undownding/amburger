import { SmsDto } from '@/sms/sms.dto.js'

export abstract class BaseSmsService {
  abstract sendCode({ regionCode, phone }: SmsDto, code: string): Promise<void>
}
