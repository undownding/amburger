import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { OssService } from './oss.service'
import * as moment from 'moment'
import { ApiSummary } from '@/lib/nestjs-ext'

@Controller('oss')
@ApiTags('OSS 接口')
export class OssController {
  constructor(private readonly ossService: OssService) {}

  @Get('/policy')
  @ApiSummary('获取上传策略')
  async getPolicy(@Query('type') type: string): Promise<object> {
    const date = new Date()
    const key = `uploads/${moment(date).format('YYYY-MM')}/${date.getTime()}.${
      type || 'png'
    }`
    const policy = this.ossService.getSign(key)
    return {
      key,
      host: this.ossService.getHost(),
      ...policy,
    }
  }
}
