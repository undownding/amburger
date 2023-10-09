import { Test, TestingModule } from '@nestjs/testing'
import { AdminService } from './admin.service.js'
import { beforeEach, describe, expect, test } from 'vitest'

describe('AdminService', () => {
  let service: AdminService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminService],
    }).compile()

    service = module.get<AdminService>(AdminService)
  })

  test('should be defined', () => {
    expect(service).toBeDefined()
  })
})
