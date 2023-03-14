import { Inject, Injectable } from '@nestjs/common'
import { BaseCrudService } from '@/lib/base-crud-service'
import { Resource } from './resource.entity'
import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'

@Injectable()
export class ResourceService extends BaseCrudService<Resource> {
  constructor(
    @Inject(getRepositoryToken(Resource))
    private readonly repository: Repository<Resource>,
  ) {
    super(repository)
  }
}
