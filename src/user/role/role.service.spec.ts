import { Test, TestingModule } from '@nestjs/testing'
import { RoleService } from './role.service.js'
import { TypeOrmModule } from '@nestjs/typeorm'
import { typeOrmModuleOptions } from '@/lib/data-source.js'
import { User } from '@/user/user.entity.js'
import { Role } from '@/user/role/role.entity.js'
import { beforeEach, describe, expect, test } from 'vitest'

describe('RoleService', () => {
  let service: RoleService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(typeOrmModuleOptions),
        TypeOrmModule.forFeature([User, Role]),
      ],
      providers: [RoleService],
    }).compile()

    service = module.get<RoleService>(RoleService)
  })

  test('should be defined', () => {
    expect(service).toBeDefined()
  })
})
