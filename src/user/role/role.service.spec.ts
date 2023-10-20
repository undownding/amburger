import { Test, TestingModule } from '@nestjs/testing'
import { RoleService } from './role.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { typeOrmModuleOptions } from '@/lib/data-source'
import { User } from '@/user/user.entity'
import { Role } from '@/user/role/role.entity'
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
