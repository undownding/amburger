import { Test, TestingModule } from '@nestjs/testing'
import { AssignerService } from './assigner.service.js'
import { TypeOrmModule } from '@nestjs/typeorm'
import { typeOrmModuleOptions } from '@/lib/data-source.js'
import { Assigner } from '@/resource/assigner/assigner.enitity.js'
import { ConfigModule } from '@nestjs/config'
import { User } from '@/user/user.entity.js'
import { Resource } from '@/resource/resource.entity.js'
import { Role } from '@/user/role/role.entity.js'
import { beforeEach, describe, expect, test } from 'vitest'

describe('AssignerService', () => {
  let service: AssignerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(typeOrmModuleOptions),
        TypeOrmModule.forFeature([Assigner, User, Resource, Role]),
        ConfigModule,
      ],
      providers: [AssignerService],
    }).compile()

    service = module.get<AssignerService>(AssignerService)
  })

  test('should be defined', () => {
    expect(service).toBeDefined()
  })
})
