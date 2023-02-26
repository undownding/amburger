import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { typeOrmModuleOptions } from '@/lib/data-source'
import { User } from '@/user/user.entity'
import { Role } from '@/user/role/role.entity'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UserService } from '@/user/user.service'
import { RoleService } from '@/user/role/role.service'
import { PasswordService } from '@/user/auth/password.service'
import { JwtModule } from '@nestjs/jwt'

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

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
