import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiSummary } from '@/lib/nestjs-ext'
import { SmsProxyService } from '@/sms/sms-proxy.service'
import { SmsDto } from '@/sms/sms.dto'

@Controller('sms')
@ApiTags('短信')
export class SmsController {
  constructor(private readonly smsService: SmsProxyService) {}

  @Post('phone-code')
  @ApiSummary('发送验证码')
  async phoneCode(@Body() body: SmsDto): Promise<object> {
    await this.smsService.sendCode(body)
    return { success: true }
  }
}
