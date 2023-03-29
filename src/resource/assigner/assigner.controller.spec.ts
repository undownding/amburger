import { Test, TestingModule } from '@nestjs/testing'
import { AssignerController } from './assigner.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { typeOrmModuleOptions } from '@/lib/data-source'
import { ConfigModule } from '@nestjs/config'
import { Assigner } from '@/resource/assigner/assigner.enitity'
import { User } from '@/user/user.entity'
import { Resource } from '@/resource/resource.entity'
import { Role } from '@/user/role/role.entity'

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

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
