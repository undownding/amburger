import { Test, TestingModule } from '@nestjs/testing'
import { ResourceService } from './resource.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Resource } from '@/resource/resource.entity'
import { Permission } from '@/resource/permission.entity'
import { typeOrmModuleOptions } from '@/lib/data-source'
import { User } from '@/user/user.entity'
import { Role } from '@/user/role/role.entity'

describe('ResourceService', () => {
  let service: ResourceService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(typeOrmModuleOptions),
        TypeOrmModule.forFeature([Resource, Permission, User, Role]),
      ],
      providers: [ResourceService],
    }).compile()

    service = module.get<ResourceService>(ResourceService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
