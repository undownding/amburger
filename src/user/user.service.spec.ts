import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from './user.service'
import { Role } from '@/user/role/role.entity'
import { User } from '@/user/user.entity'
import { typeOrmModuleOptions } from '@/lib/data-source'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RoleService } from '@/user/role/role.service'
import { AuthService } from '@/user/auth/auth.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PasswordService } from '@/user/auth/password.service'
import { JwtModule } from '@nestjs/jwt'
import { SmsModule } from '@/sms/sms.module'
import { CacheModule } from '@nestjs/common'

describe('UserService', () => {
  let service: UserService

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

    service = module.get<UserService>(UserService)
    await service.onModuleInit()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should have one user', async () => {
    const users = await service.findAll()
    expect(users.length).toBe(1)
    expect(users[0].roles.length).toBe(1)
    expect(users[0].roles[0].name).toBe('ADMIN')
  })
})
