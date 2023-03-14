import { Module } from '@nestjs/common'
import { ALI_POP_CORE } from '@/sms/ali/ali.constants'
import { ConfigService } from '@nestjs/config'
import { AliSmsService } from '@/sms/ali/ali.sms.service'
import * as RPCClient from '@alicloud/pop-core'
import { SMS_SERVICE } from '@/sms/sms.constants'

@Module({
  providers: [
    {
      provide: ALI_POP_CORE,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new RPCClient({
          accessKeyId: configService.get('ALIYUN_ACCESS_KEY_ID'),
          accessKeySecret: configService.get('ALIYUN_ACCESS_KEY_SECRET'),
          endpoint: 'https://dysmsapi.aliyuncs.com',
          apiVersion: '2017-05-25',
        })
      },
    },
    {
      provide: SMS_SERVICE,
      useClass: AliSmsService,
    },
  ],
  exports: [
    {
      provide: SMS_SERVICE,
      useExisting: AliSmsService,
    },
  ],
})
export class AliModule {}
