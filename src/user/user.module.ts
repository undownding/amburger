import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { JwtGuard } from '@/user/auth/auth-jwt.guard'
import { AuthJwtStrategy } from '@/user/auth/auth-jwt.strategy'
import { AuthService } from '@/user/auth/auth.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '@/user/user.entity'
import { ConfigModule } from '@nestjs/config'
import { RoleService } from '@/user/role/role.service'
import { Role } from '@/user/role/role.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User, Role]), ConfigModule],
  providers: [UserService, AuthService, RoleService, AuthJwtStrategy, JwtGuard],
  controllers: [UserController],
  exports: [UserService, AuthService, RoleService],
})
export class UserModule {}
