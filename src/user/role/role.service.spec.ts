import { Test, TestingModule } from '@nestjs/testing'
import { RoleService } from './role.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { typeOrmModuleOptions } from '@/lib/data-source'
import { User } from '@/user/user.entity'
import { Role } from '@/user/role/role.entity'
import { ConfigModule } from '@nestjs/config'
import { UserService } from '@/user/user.service'
import { AuthService } from '@/user/auth/auth.service'
import { AuthJwtStrategy } from '@/user/auth/auth-jwt.strategy'
import { JwtGuard } from '@/user/auth/auth-jwt.guard'

describe('RoleService', () => {
  let service: RoleService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(typeOrmModuleOptions),
        TypeOrmModule.forFeature([User, Role]),
        ConfigModule,
      ],
      providers: [
        UserService,
        AuthService,
        RoleService,
        AuthJwtStrategy,
        JwtGuard,
      ],
    }).compile()

    service = module.get<RoleService>(RoleService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
