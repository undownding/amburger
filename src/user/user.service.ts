import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { RoleService } from '@/user/role/role.service'
import { AuthService } from '@/user/auth/auth.service'
import { BaseCrudService } from '@/lib/base-crud-service'
import { User } from '@/user/user.entity'
import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'
import { PasswordService } from '@/user/auth/password.service'

@Injectable()
export class UserService extends BaseCrudService<User> implements OnModuleInit {
  constructor(
    private readonly roleService: RoleService,
    private readonly authService: AuthService,
    @Inject(getRepositoryToken(User))
    private readonly repository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly passwordService: PasswordService,
  ) {
    super(repository)
  }

  async getByUserName(username: string): Promise<User> {
    return this.findOne({ where: { name: username } })
  }

  async getByPhone(regionCode: string, phone: string): Promise<User> {
    return this.findOne({ where: { regionCode, phone } })
  }

  async getByEmail(email: string): Promise<User> {
    return this.findOne({ where: { email } })
  }

  async signUp(
    email: string,
    regionCode: string,
    phone: string,
    name: string,
    password: string,
  ): Promise<User> {
    const salt = this.passwordService.generateSalt()
    return await this.create({
      email,
      regionCode,
      phone,
      name,
      salt,
      password: await this.passwordService.hashPassword(password, salt),
    })
  }

  async onModuleInit(): Promise<void> {
    const [roleCount, userCount] = await Promise.all([
      this.roleService.count(),
      this.count(),
    ])
    if (roleCount === 0 && userCount === 0) {
      const role = await this.roleService.create({ name: 'ADMIN' })
      const defaultUserName = this.configService.get('DEFAULT_USER_NAME')
      const salt = this.passwordService.generateSalt()
      await this.create({
        name: defaultUserName,
        roles: [role],
        salt,
        password: await this.passwordService.hashPassword(
          this.configService.get('DEFAULT_USER_PASSWORD'),
          salt,
        ),
      })
    }
  }
}
