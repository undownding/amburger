import { Test, TestingModule } from '@nestjs/testing'
import { PermissionService } from './permission.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { typeOrmModuleOptions } from '@/lib/data-source'
import { ConfigModule } from '@nestjs/config'
import { Permission } from './permission.entity'
import { User } from '@/user/user.entity'
import { Role } from '@/user/role/role.entity'
import { Resource } from '@/resource/resource.entity'

describe('PermissionService', () => {
  let service: PermissionService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        TypeOrmModule.forRoot(typeOrmModuleOptions),
        TypeOrmModule.forFeature([Permission, User, Role, Resource]),
      ],
      providers: [PermissionService],
    }).compile()

    service = module.get<PermissionService>(PermissionService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
