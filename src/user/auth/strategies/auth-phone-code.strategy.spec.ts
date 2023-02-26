import { Test, TestingModule } from '@nestjs/testing'
import { SmsModule } from '@/sms/sms.module'
import { AuthPhoneCodeStrategy } from '@/user/auth/strategies/auth-phone-code.strategy'
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm'
import { typeOrmModuleOptions } from '@/lib/data-source'
import { User } from '@/user/user.entity'
import { Role } from '@/user/role/role.entity'
import { Repository } from 'typeorm'
import { SmsProxyService } from '@/sms/sms-proxy.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { UserService } from '@/user/user.service'
import { RoleService } from '@/user/role/role.service'
import { AuthService } from '@/user/auth/auth.service'
import { PasswordService } from '@/user/auth/password.service'
import { CACHE_MANAGER, CacheModule } from '@nestjs/common'
import { Cache } from 'cache-manager'

describe('AuthPhoneCodeStrategy', () => {
  let repository: Repository<User>
  let userService: UserService
  let smsService: SmsProxyService
  let strategy: AuthPhoneCodeStrategy
  let cacheManager: Cache

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CacheModule.register({
          isGlobal: true,
        }),
        SmsModule,
        TypeOrmModule.forRoot(typeOrmModuleOptions),
        TypeOrmModule.forFeature([User, Role]),
        CacheModule.register({
          isGlobal: true,
        }),
        ConfigModule,
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            secret: configService.get('JWT_SECRET'),
            signOptions: { expiresIn: '7d' },
          }),
        }),
      ],
      providers: [
        UserService,
        RoleService,
        AuthService,
        AuthPhoneCodeStrategy,
        ConfigService,
        PasswordService,
      ],
      exports: [UserService],
    }).compile()

    repository = module.get(getRepositoryToken(User))
    userService = module.get(UserService)
    smsService = module.get(SmsProxyService)
    cacheManager = module.get(CACHE_MANAGER)
    strategy = new AuthPhoneCodeStrategy(userService, cacheManager)
  })

  it('should verify a exist user', async () => {
    await repository.save({
      regionCode: '+86',
      phone: '12345678901',
      name: 'PhoneUser',
      password: '',
      salt: '',
    })
    await smsService.sendCode(
      {
        regionCode: '+86',
        phone: '12345678901',
      },
      '167435',
    )
    const user = await strategy.validate({
      body: {
        regionCode: '+86',
        phone: '12345678901',
        code: '167435',
      },
    })
    expect(user).toBeDefined()
    expect(user).not.toBeNull()
    expect(user.name).toBe('PhoneUser')
  })

  it('should verify a new user', async () => {
    await smsService.sendCode(
      {
        regionCode: '+86',
        phone: '12345678901666',
      },
      '982361',
    )
    const user = await strategy.validate({
      body: {
        regionCode: '+86',
        phone: '12345678901666',
        code: '982361',
      },
    })
    expect(user).toBeDefined()
    expect(user).not.toBeNull()
    expect(user.name.startsWith('手机用户')).toBe(true)
  })

  it('should return null when code incorrect', async () => {
    await smsService.sendCode(
      {
        regionCode: '+86',
        phone: '13800138000',
      },
      '167435',
    )
    const user = await strategy.validate({
      body: {
        regionCode: '+86',
        phone: '13800138000',
        code: '685238',
      },
    })
    expect(user).toBeNull()
  })
})
