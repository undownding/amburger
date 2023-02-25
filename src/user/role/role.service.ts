import { Inject, Injectable } from '@nestjs/common'
import { BaseCrudService } from '@/lib/base-crud-service'
import { Role } from '@/user/role/role.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class RoleService extends BaseCrudService<Role> {
  constructor(
    @Inject(getRepositoryToken(Role))
    private readonly repository: Repository<Role>,
  ) {
    super(repository)
  }
}
