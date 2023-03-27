import { Injectable } from '@nestjs/common'
import { BaseCrudService } from '@/lib/base-crud-service'
import { Permission } from './permission.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class PermissionService extends BaseCrudService<Permission> {
  constructor(
    @InjectRepository(Permission)
    protected readonly repository: Repository<Permission>,
  ) {
    super(repository)
  }
}
