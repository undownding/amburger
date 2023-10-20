import { Controller, Get } from '@nestjs/common'
import { ApiSummary } from '@/lib/nestjs-ext'
import { ApiTags } from '@nestjs/swagger'
import { AppService } from '@/app.service'

@ApiTags('其他')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiSummary('获取版本')
  @Get('/version')
  getHello(): object {
    return this.appService.getVersion()
  }
}
