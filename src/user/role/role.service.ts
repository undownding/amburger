import { Injectable } from '@nestjs/common'
import { BaseCrudService } from '@/lib/base-crud-service.js'
import { Role } from '@/user/role/role.entity.js'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class RoleService extends BaseCrudService<Role> {
  constructor(
    @InjectRepository(Role)
    private readonly repository: Repository<Role>,
  ) {
    super(repository)
  }
}
