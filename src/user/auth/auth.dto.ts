import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsOptional, IsString } from 'class-validator'

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

export class AuthBodyDto {
  @ApiPropertyOptional() @IsOptional() @IsString() username?: string
  @ApiPropertyOptional() @IsOptional() @IsString() phone?: string
  @ApiPropertyOptional() @IsOptional() @IsEmail() email?: string
  @ApiPropertyOptional() @IsOptional() @IsString() password?: string
  @ApiPropertyOptional() @IsOptional() @IsString() code?: string
}
