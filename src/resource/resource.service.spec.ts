import { Test, TestingModule } from '@nestjs/testing'
import { ResourceService } from './resource.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Resource } from '@/resource/resource.entity'
import { Permission } from '@/resource/permission.entity'

describe('ResourceService', () => {
  let service: ResourceService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([Resource, Permission])],
      providers: [ResourceService],
    }).compile()

    service = module.get<ResourceService>(ResourceService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
