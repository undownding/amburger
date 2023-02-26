import {
  CACHE_MANAGER,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common'
import { Cache } from 'cache-manager'
import { SmsDto } from '@/sms/sms.dto'
import { BaseSmsService } from '@/sms/base-sms-service'
import { SMS_SERVICE } from '@/sms/sms.constants'

@Injectable()
export class SmsProxyService extends BaseSmsService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject(SMS_SERVICE) private readonly smsService: BaseSmsService,
  ) {
    super()
  }

  async sendCode(body: SmsDto): Promise<void> {
    const regionCode = body.regionCode || '+86'
    const phone = body.phone
    const key = `phone:countdown:${regionCode}${phone}`
    const isCd = await this.cacheManager.get<boolean>(key)
    if (isCd) throw new ConflictException('短信冷却中')
    const code = (Math.random() * 1e6).toFixed().padStart(6, '0')
    await this.smsService.sendCode({ regionCode, phone }, code)
    await this.cacheManager.set(key, true, 60)
    await this.cacheManager.set(`phone:${regionCode}${phone}:code`, code, 300)
  }

  async verifyCode(
    { regionCode, phone }: SmsDto,
    code: string,
  ): Promise<boolean> {
    const key = `phone:${regionCode}${phone}:code`
    const cacheCode = await this.cacheManager.get<string>(key)
    if (cacheCode === code) {
      await this.cacheManager.del(key)
      return true
    }
    return false
  }
}
