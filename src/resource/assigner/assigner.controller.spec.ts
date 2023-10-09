import { Test, TestingModule } from '@nestjs/testing'
import { AssignerController } from './assigner.controller.js'
import { TypeOrmModule } from '@nestjs/typeorm'
import { typeOrmModuleOptions } from '@/lib/data-source.js'
import { ConfigModule } from '@nestjs/config'
import { Assigner } from '@/resource/assigner/assigner.enitity.js'
import { User } from '@/user/user.entity.js'
import { Resource } from '@/resource/resource.entity.js'
import { Role } from '@/user/role/role.entity.js'
import { beforeEach, describe, expect, test } from 'vitest'

describe('AssignerController', () => {
  let controller: AssignerController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(typeOrmModuleOptions),
        TypeOrmModule.forFeature([Assigner, User, Resource, Role]),
        ConfigModule,
      ],
      controllers: [AssignerController],
    }).compile()

    controller = module.get<AssignerController>(AssignerController)
  })

  test('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
