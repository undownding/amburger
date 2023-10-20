import { Test, TestingModule } from '@nestjs/testing'
import { SmsProxyService } from '@/sms/sms-proxy.service'
import { MockModule } from '@/sms/mock/mock.module'
import { beforeEach, describe, expect, test } from 'vitest'
import { CacheModule } from '@nestjs/cache-manager'

describe('SmsProxyService', () => {
  let service: SmsProxyService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register(), MockModule],
      providers: [SmsProxyService],
    }).compile()

    service = module.get<SmsProxyService>(SmsProxyService)
  })

  test('should be defined', () => {
    expect(service).toBeDefined()
  })
})
