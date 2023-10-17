import { Test, TestingModule } from '@nestjs/testing'
import { SmsModule } from '@/sms/sms.module.js'
import { AuthPhoneCodeStrategy } from '@/user/auth/strategies/auth-phone-code.strategy.js'
import { TypeOrmModule } from '@nestjs/typeorm'
import { typeOrmModuleOptions } from '@/lib/data-source.js'
import { User } from '@/user/user.entity.js'
import { Role } from '@/user/role/role.entity.js'
import { SmsProxyService } from '@/sms/sms-proxy.service.js'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { UserService } from '@/user/user.service.js'
import { RoleService } from '@/user/role/role.service.js'
import { AuthService } from '@/user/auth/auth.service.js'
import { PasswordService } from '@/user/auth/password.service.js'
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { beforeAll, describe, expect, test } from 'vitest'

describe('AuthPhoneCodeStrategy', () => {
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

    userService = module.get(UserService)
    smsService = module.get(SmsProxyService)
    cacheManager = module.get(CACHE_MANAGER)
    strategy = new AuthPhoneCodeStrategy(userService, cacheManager)
  })

  test('should verify a exist user', async () => {
    await userService.create({
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

  test('should verify a new user', async () => {
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

  test('should return null when code incorrect', async () => {
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
