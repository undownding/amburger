import { SmsDto } from '@/sms/sms.dto'

export abstract class BaseSmsService {
  abstract sendCode({ regionCode, phone }: SmsDto, code): Promise<void>
}
