import { Injectable } from '@nestjs/common'
import { BaseCrudService } from '@/lib/base-crud-service'
import { Role } from '@/user/role/role.entity'
import { Repository } from 'typeorm'

@Injectable()
export class RoleService extends BaseCrudService<Role> {
  constructor(
    @InjectRepository(Role)
    private readonly repository: Repository<Role>,
  ) {
    super(repository)
  }
}
