import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { typeOrmModuleOptions } from '@/lib/data-source'
import { User } from '@/user/user.entity'
import { Role } from '@/user/role/role.entity'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { UserService } from '@/user/user.service'
import { RoleService } from '@/user/role/role.service'
import { AuthService } from '@/user/auth/auth.service'
import { PasswordService } from '@/user/auth/password.service'
import { AuthUsernamePasswordStrategy } from '@/user/auth/strategies/auth-username-password.strategy'

describe('AuthUserNamePasswordStrategy', () => {
  let userService: UserService
  let authService: AuthService
  let strategy: AuthUsernamePasswordStrategy

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
      providers: [
        UserService,
        RoleService,
        AuthService,
        AuthUsernamePasswordStrategy,
        ConfigService,
        PasswordService,
      ],
      exports: [UserService],
    }).compile()

    userService = module.get(UserService)
    authService = module.get(AuthService)
    strategy = new AuthUsernamePasswordStrategy(authService, userService)

    await userService.signUp({
      username: 'panda',
      password: 'good',
    })
  })

  it('should verify by userName and password', async () => {
    const user = await strategy.validate('panda', 'good')
    expect(user).toBeDefined()
    expect(user.name).toBe('panda')
  })

  it('should return a null when user not found', async () => {
    const user = await strategy.validate('panda1', 'good')
    expect(user).toBeNull()
  })

  it('should return a null when password is wrong', async () => {
    const user = await strategy.validate('panda', 'bad')
    expect(user).toBeNull()
  })
})
