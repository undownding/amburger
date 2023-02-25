import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { RoleService } from '@/user/role/role.service'
import { AuthService } from '@/user/auth/auth.service'
import { BaseCrudService } from '@/lib/base-crud-service'
import { User } from '@/user/user.entity'
import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class UserService extends BaseCrudService<User> implements OnModuleInit {
  constructor(
    private readonly roleService: RoleService,
    private readonly authService: AuthService,
    @Inject(getRepositoryToken(User))
    private readonly repository: Repository<User>,
    private readonly configService: ConfigService,
  ) {
    super(repository)
  }

  async onModuleInit(): Promise<void> {
    const [roleCount, userCount] = await Promise.all([
      this.roleService.count(),
      this.count(),
    ])
    if (roleCount === 0 && userCount === 0) {
      const role = await this.roleService.create({ name: 'ADMIN' })
      const defaultUserName = this.configService.get('DEFAULT_USER_NAME')
      await this.create({
        name: defaultUserName,
        roles: [role],
      })
    }
  }
}
