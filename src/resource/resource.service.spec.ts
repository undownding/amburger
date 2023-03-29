import { Test, TestingModule } from '@nestjs/testing'
import { ResourceService } from './resource.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Resource } from '@/resource/resource.entity'
import { typeOrmModuleOptions } from '@/lib/data-source'
import { ConfigModule } from '@nestjs/config'
import { UserModule } from '@/user/user.module'
import { CacheModule } from '@nestjs/common'
import { AssignerModule } from '@/resource/assigner/assigner.module'

describe('ResourceService', () => {
  let service: ResourceService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AssignerModule,
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        CacheModule.register({
          isGlobal: true,
        }),
        TypeOrmModule.forRoot(typeOrmModuleOptions),
        TypeOrmModule.forFeature([Resource]),
        UserModule,
        ConfigModule,
      ],
      providers: [ResourceService],
    }).compile()

    service = module.get<ResourceService>(ResourceService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
