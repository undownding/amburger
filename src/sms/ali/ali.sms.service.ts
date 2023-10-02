import { ConflictException, Inject, Injectable } from '@nestjs/common'
import RPCClient from '@alicloud/pop-core'
import Cache from 'cache-manager'
import { ALI_POP_CORE } from '@/sms/ali/ali.constants'
import { SmsDto } from '@/sms/sms.dto'
import { BaseSmsService } from '@/sms/base-sms-service'
import { ConfigService } from '@nestjs/config'
import { CACHE_MANAGER } from '@nestjs/cache-manager'

@Injectable()
export class AliSmsService extends BaseSmsService {
  constructor(
    @Inject(ALI_POP_CORE) private readonly aliPopCore: RPCClient,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {
    super()
  }

  public async sendCode(body: SmsDto, code: string): Promise<void> {
    if (body.regionCode !== '+86') {
      throw new ConflictException('暂不支持国际短信')
    }
    const key = `phone:countdown:${body.phone}`
    const isCd = await this.cacheManager.get<boolean>(key)
    if (isCd) throw new ConflictException('短信冷却中')
    await this.aliPopCore.request('SendSms', {
      PhoneNumbers: body.phone,
      TemplateParam: JSON.stringify({ code }),
      TemplateCode: this.configService.get('ALI_SMS_TEMPLATE_CODE'),
      SignName: this.configService.get('ALI_SMS_SIGN_NAME'),
    })
    await this.cacheManager.set(key, true, 60)
  }
}
