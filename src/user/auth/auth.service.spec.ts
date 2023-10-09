import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { typeOrmModuleOptions } from '@/lib/data-source.js'
import { User } from '@/user/user.entity.js'
import { Role } from '@/user/role/role.entity.js'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UserService } from '@/user/user.service.js'
import { RoleService } from '@/user/role/role.service.js'
import { PasswordService } from '@/user/auth/password.service.js'
import { JwtModule } from '@nestjs/jwt'
import { beforeAll, describe, expect, test } from 'vitest'

describe('AuthService', () => {
  let service: AuthService

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(typeOrmModuleOptions),
        TypeOrmModule.forFeature([User, Role]),
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
      providers: [UserService, AuthService, RoleService, PasswordService],
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  test('should be defined', () => {
    expect(service).toBeDefined()
  })
})
