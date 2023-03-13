import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { JwtGuard } from '@/user/auth/auth-jwt.guard'
import { AuthJwtStrategy } from '@/user/auth/strategies/auth-jwt.strategy'
import { AuthService } from '@/user/auth/auth.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '@/user/user.entity'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { RoleService } from '@/user/role/role.service'
import { Role } from '@/user/role/role.entity'
import { RolesGuard } from '@/user/role/role.guard'
import { AuthController } from './auth/auth.controller'
import { LocalAuthGuard } from '@/user/auth/guards/local-auth.guard'
import { AuthUsernamePasswordStrategy } from '@/user/auth/strategies/auth-username-password.strategy'
import { PasswordService } from '@/user/auth/password.service'
import { JwtModule } from '@nestjs/jwt'
import { AuthPhoneCodeStrategy } from '@/user/auth/strategies/auth-phone-code.strategy'
import { AuthEmailPasswordStrategy } from '@/user/auth/strategies/auth-email-password.strategy'
import { HttpModule } from '@nestjs/axios'
import { AuthWechatQrCodeStrategy } from '@/user/auth/strategies/auth-wechat-qrcode.strategy'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    ConfigModule,
    HttpModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
    }),
  ],
  providers: [
    UserService,
    AuthService,
    RoleService,
    AuthJwtStrategy,
    LocalAuthGuard,
    AuthUsernamePasswordStrategy,
    AuthPhoneCodeStrategy,
    AuthEmailPasswordStrategy,
    AuthWechatQrCodeStrategy,
    PasswordService,
    JwtGuard,
    RolesGuard,
  ],
  controllers: [UserController, AuthController],
  exports: [UserService, AuthService, RoleService],
})
export class UserModule {}
