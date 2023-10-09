import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from './user.service.js'
import { Role } from '@/user/role/role.entity.js'
import { User } from '@/user/user.entity.js'
import { typeOrmModuleOptions } from '@/lib/data-source.js'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RoleService } from '@/user/role/role.service.js'
import { AuthService } from '@/user/auth/auth.service.js'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PasswordService } from '@/user/auth/password.service.js'
import { JwtModule } from '@nestjs/jwt'
import { SmsModule } from '@/sms/sms.module.js'
import { beforeAll, describe, expect, test } from 'vitest'
import { CacheModule } from '@nestjs/cache-manager'

describe('UserService', () => {
  let service: UserService
  let authService: AuthService

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(typeOrmModuleOptions),
        TypeOrmModule.forFeature([User, Role]),
        ConfigModule,
        CacheModule.register({
          isGlobal: true,
        }),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            secret: configService.get('JWT_SECRET'),
            signOptions: { expiresIn: '7d' },
          }),
        }),
        SmsModule,
      ],
      providers: [UserService, AuthService, RoleService, PasswordService],
    }).compile()

    service = module.get(UserService)
    authService = module.get(AuthService)
    await service.onModuleInit()
  })

  test('should be defined', () => {
    expect(service).toBeDefined()
  })

  test('should have one user', async () => {
    const users = await service.findAll()
    expect(users).toHaveLength(1)
    expect(users[0].roles).toHaveLength(3)
  })

  test('should sign up a user', async () => {
    const user = await service.signUp({
      username: 'user_for_create_test',
      password: 'old_password',
    })
    expect(user).toBeDefined()
    expect(user.name).toBe('user_for_create_test')
  })

  test('should update password', async () => {
    const user = await service.signUp({
      username: 'user_for_update_password_test',
      password: 'old_password',
    })
    const newPassword = 'new_password'
    await service.updatePassword(user.id, newPassword)
    const updatedUser = await service.getByUserName(
      'user_for_update_password_test',
      true,
    )
    const isCorrect = await authService.checkPassword(updatedUser, newPassword)
    expect(isCorrect).toBeTruthy()
  })
})
