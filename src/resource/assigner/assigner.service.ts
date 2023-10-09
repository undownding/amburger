import { Injectable } from '@nestjs/common'
import { BaseCrudService } from '@/lib/base-crud-service.js'
import { Assigner } from '@/resource/assigner/assigner.enitity.js'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class AssignerService extends BaseCrudService<Assigner> {
  constructor(
    @InjectRepository(Assigner)
    private readonly repository: Repository<Assigner>,
  ) {
    super(repository)
  }
}
