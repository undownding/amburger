import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { ApiSummary } from '@/lib/nestjs-ext'
import { ApiTags } from '@nestjs/swagger'

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
