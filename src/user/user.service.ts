import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common'
import { RoleService } from '@/user/role/role.service'
import { AuthService } from '@/user/auth/auth.service'
import { BaseCrudService, IDType } from '@/lib/base-crud-service'
import { User } from '@/user/user.entity'
import { Repository } from 'typeorm'
import { ConfigService } from '@nestjs/config'
import { PasswordService } from '@/user/auth/password.service'
import { AuthSignUpDto } from '@/user/auth/auth.dto'
import * as randomstring from 'randomstring'

@Injectable()
export class UserService extends BaseCrudService<User> implements OnModuleInit {
  constructor(
    private readonly roleService: RoleService,
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly passwordService: PasswordService,
  ) {
    super(repository)
  }

  async getByUserName(username: string, selectPassword = false): Promise<User> {
    if (!username) {
      return null
    }
    const query = this.repository
      .createQueryBuilder('user')
      .where('name = :name', { name: username })
    if (selectPassword) {
      query.addSelect(['user.password', 'user.salt'])
    }
    return query.getOne()
  }

  async getByPhone(regionCode = '+86', phone: string): Promise<User> {
    if (!phone) {
      return null
    }
    return this.findOne({ where: { regionCode, phone } })
  }

  async getByEmail(email: string, selectPassword = false): Promise<User> {
    if (!email) {
      return null
    }
    const query = this.repository
      .createQueryBuilder('user')
      .where('email = :email', { email })
    if (selectPassword) {
      query.addSelect(['user.password', 'user.salt'])
    }
    return query.getOne()
  }

  async getByUnionId(unionId: string): Promise<User> {
    return this.findOne({ where: { unionId } })
  }

  async signUp(data: AuthSignUpDto): Promise<User> {
    const user =
      (await this.getByUserName(data.username)) ||
      (await this.getByEmail(data.email)) ||
      (await this.getByPhone(data['regionCode'] || '+86', data.phone))
    if (user) {
      throw new BadRequestException('该用户已被注册')
    }
    // if data.phone exists, verify phone code
    const salt = this.passwordService.generateSalt()
    return await this.create({
      email: data.email,
      regionCode: data['regionCode'] || '+86',
      phone: data.phone,
      name: data.username,
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

  async updatePassword(id: IDType, password: string): Promise<void> {
    const salt = this.passwordService.generateSalt()
    await this.update(id, {
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
        phone: '13800138000',
        password: await this.passwordService.hashPassword(
          this.configService.get('DEFAULT_USER_PASSWORD'),
          salt,
        ),
      })
    }
  }
}
