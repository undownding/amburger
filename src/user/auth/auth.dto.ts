import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger'
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator'
import { User } from '@/user/user.entity'

export class AuthUserNameDto {
  @ApiProperty() @IsString() username: string
  @ApiProperty() @IsString() password: string
}

export class AuthPhoneDto {
  @ApiProperty() @IsString() phone: string
  @ApiProperty() @IsString() password: string
}

export class AuthPhoneCodeDto {
  @ApiProperty() @IsString() phone: string
  @ApiProperty() @IsString() code: string
}

export class AuthEmailDto {
  @ApiProperty() @IsString() email: string
  @ApiProperty() @IsString() password: string
}

export class AuthWeChatDto {
  @ApiProperty() @IsString() code: string
}

export type AuthDto =
  | AuthUserNameDto
  | AuthPhoneDto
  | AuthPhoneCodeDto
  | AuthEmailDto
  | AuthWeChatDto

export enum AuthType {
  USERNAME_PASSWORD = 'username-password',
  PHONE_PASSWORD = 'phone-password',
  PHONE_CODE = 'phone-code',
  EMAIL_PASSWORD = 'email-password',
  WECHAT_QRCODE = 'wechat-qrcode',
  ALIPAY_QRCODE = 'alipay-qrcode',
}

export class AuthBodyDto {
  @ApiPropertyOptional() @IsOptional() @IsString() username?: string
  @ApiPropertyOptional() @IsOptional() @IsString() phone?: string
  @ApiPropertyOptional() @IsOptional() @IsEmail() email?: string
  @ApiPropertyOptional() @IsOptional() @IsString() password?: string
  @ApiPropertyOptional() @IsOptional() @IsString() code?: string
  @ApiPropertyOptional({ enum: AuthType })
  @IsOptional()
  @IsEnum(AuthType, { message: 'invalid auth type' })
  type?: AuthType
}

export class AuthRespDto extends OmitType(User, ['password', 'salt', 'setId']) {
  @ApiProperty({ description: '用于访问 api 的 token' }) accessToken: string
  @ApiProperty({ description: '用于刷新 accessToken' }) refreshToken: string
}

export class TokenRespDto {
  @ApiProperty() accessToken: string
  @ApiProperty() refreshToken: string
}
