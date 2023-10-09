import { Test, TestingModule } from '@nestjs/testing'
import { ResourceService } from './resource.service.js'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Resource } from '@/resource/resource.entity.js'
import { typeOrmModuleOptions } from '@/lib/data-source.js'
import { ConfigModule } from '@nestjs/config'
import { UserModule } from '@/user/user.module.js'
import { CacheModule } from '@nestjs/cache-manager'
import { AssignerModule } from '@/resource/assigner/assigner.module.js'
import { beforeEach, describe, expect, test } from 'vitest'

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

  test('should be defined', () => {
    expect(service).toBeDefined()
  })
})
