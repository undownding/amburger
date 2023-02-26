import { Test, TestingModule } from '@nestjs/testing'
import { SmsProxyService } from '@/sms/sms-proxy.service'
import { CacheModule } from '@nestjs/common'
import { MockModule } from '@/sms/mock/mock.module'

describe('SmsProxyService', () => {
  let service: SmsProxyService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register(), MockModule],
      providers: [SmsProxyService],
    }).compile()

    service = module.get<SmsProxyService>(SmsProxyService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
