import { AuthEmailPasswordStrategy } from '@/user/auth/strategies/auth-email-password.strategy'
import { UserService } from '@/user/user.service'
import { Test, TestingModule } from '@nestjs/testing'
import { typeOrmModuleOptions } from '@/lib/data-source'
import { User } from '@/user/user.entity'
import { AuthService } from '@/user/auth/auth.service'
import { JwtService } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RoleService } from '@/user/role/role.service'
import { PasswordService } from '@/user/auth/password.service'
import { ConfigModule } from '@nestjs/config'
import { Role } from '@/user/role/role.entity'

describe('AuthEmailPasswordStrategy', () => {
  let service: UserService
  let strategy: AuthEmailPasswordStrategy

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(typeOrmModuleOptions),
        TypeOrmModule.forFeature([User, Role]),
        ConfigModule,
      ],
      providers: [
        AuthService,
        PasswordService,
        UserService,
        RoleService,
        AuthEmailPasswordStrategy,
        JwtService,
      ],
    }).compile()

    service = module.get<UserService>(UserService)
    strategy = module.get<AuthEmailPasswordStrategy>(AuthEmailPasswordStrategy)

    await service.signUp('admin@local', '+86', null, 'tiger', 'rabbit')
  })

  it('should be defined', () => {
    expect(strategy).toBeDefined()
  })

  it('should verify by userName and password', async () => {
    const user = await strategy.validate('admin@local', 'rabbit')
    expect(user).toBeDefined()
    expect(user).not.toBeNull()
    expect(user.name).toBe('tiger')
  })

  it('should return a null when user not found', async () => {
    const user = await strategy.validate('panda@local', 'panda')
    expect(user).toBeNull()
  })

  it('should return a null when password is wrong', async () => {
    const user = await strategy.validate('admin@local', 'panda')
    expect(user).toBeNull()
  })
})
