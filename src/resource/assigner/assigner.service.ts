import { Injectable } from '@nestjs/common'
import { BaseCrudService } from '@/lib/base-crud-service'
import { Assigner } from '@/resource/assigner/assigner.enitity'
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
