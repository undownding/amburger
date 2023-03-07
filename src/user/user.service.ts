import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { RoleService } from '@/user/role/role.service'
import { AuthService } from '@/user/auth/auth.service'
import { BaseCrudService } from '@/lib/base-crud-service'
import { User } from '@/user/user.entity'
import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'
import { PasswordService } from '@/user/auth/password.service'
import { AuthDto } from '@/user/auth/auth.dto'
import * as randomstring from 'randomstring'

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
    return this.repository
      .createQueryBuilder('user')
      .where('name = :name', { name: username })
      .addSelect(['user.password', 'user.salt'])
      .getOne()
  }

  async getByPhone(regionCode: string, phone: string): Promise<User> {
    return this.findOne({ where: { regionCode, phone } })
  }

  async getByEmail(email: string): Promise<User> {
    return this.repository
      .createQueryBuilder('user')
      .where('email = :email', { email })
      .addSelect(['user.password', 'user.salt'])
      .getOne()
  }

  async getByUnionId(unionId: string): Promise<User> {
    return this.findOne({ where: { unionId } })
  }

  async signUp(data: AuthDto): Promise<User> {
    const salt = this.passwordService.generateSalt()
    return await this.create({
      email: data['email'],
      regionCode: data['regionCode'] || '+86',
      phone: data['phone'],
      name: data['name'] || data['username'],
      salt,
      password: await this.passwordService.hashPassword(
        data['password'] ||
          randomstring.generate({
            length: 8,
            readable: false,
            charset: 'alphanumeric',
            capitalization: 'lowercase',
          }),
        salt,
      ),
    })
  }

  async onModuleInit(): Promise<void> {
    const [roleCount, userCount] = await Promise.all([
      this.roleService.count(),
      this.count(),
    ])
    if (roleCount === 0 && userCount === 0) {
      const roles = await Promise.all([
        this.roleService.create({ name: 'SUPER_ADMIN' }),
        this.roleService.create({ name: 'ADMIN' }),
        this.roleService.create({ name: 'USER' }),
      ])
      const defaultUserName = this.configService.get('DEFAULT_USER_NAME')
      const salt = this.passwordService.generateSalt()
      await this.create({
        name: defaultUserName,
        roles,
        salt,
        password: await this.passwordService.hashPassword(
          this.configService.get('DEFAULT_USER_PASSWORD'),
          salt,
        ),
      })
    }
  }
}
