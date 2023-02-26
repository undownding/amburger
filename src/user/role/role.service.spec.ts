import { Test, TestingModule } from '@nestjs/testing'
import { RoleService } from './role.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { typeOrmModuleOptions } from '@/lib/data-source'
import { User } from '@/user/user.entity'
import { Role } from '@/user/role/role.entity'

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

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
