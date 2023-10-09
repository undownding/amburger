import { Module } from '@nestjs/common'
import { UserService } from './user.service.js'
import { UserController } from './user.controller.js'
import { JwtGuard } from '@/user/auth/guards/auth-jwt.guard.js'
import { AuthJwtStrategy } from '@/user/auth/strategies/auth-jwt.strategy.js'
import { AuthService } from '@/user/auth/auth.service.js'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '@/user/user.entity.js'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { RoleService } from '@/user/role/role.service.js'
import { Role } from '@/user/role/role.entity.js'
import { RolesGuard } from '@/user/role/role.guard.js'
import { AuthController } from './auth/auth.controller.js'
import { LocalAuthGuard } from '@/user/auth/guards/local-auth.guard.js'
import { AuthUsernamePasswordStrategy } from '@/user/auth/strategies/auth-username-password.strategy.js'
import { PasswordService } from '@/user/auth/password.service.js'
import { JwtModule } from '@nestjs/jwt'
import { AuthPhoneCodeStrategy } from '@/user/auth/strategies/auth-phone-code.strategy.js'
import { AuthEmailPasswordStrategy } from '@/user/auth/strategies/auth-email-password.strategy.js'
import { HttpModule } from '@nestjs/axios'
import { AuthWechatQrCodeStrategy } from '@/user/auth/strategies/auth-wechat-qrcode.strategy.js'
import { AuthRefreshTokenStrategy } from '@/user/auth/strategies/auth-refresh-token.strategy.js'
import { EmptyUserStrategy } from '@/user/auth/strategies/empty-user.strategy.js'
import { OptionalAuthGuard } from '@/user/auth/guards/optional-auth.guard.js'

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
    AuthRefreshTokenStrategy,
    PasswordService,
    JwtGuard,
    RolesGuard,
    EmptyUserStrategy,
    OptionalAuthGuard,
  ],
  controllers: [UserController, AuthController],
  exports: [UserService, AuthService, RoleService],
})
export class UserModule {}
