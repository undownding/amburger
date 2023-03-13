import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { User } from '@/user/user.entity'
import { IsString } from 'class-validator'
import { AuthBodyDto } from '@/user/auth/auth.dto'

export class UserUpdateDto extends PartialType(
  OmitType(User, ['id', 'password', 'salt', 'setId']),
) {}

export class UserUpdatePasswordDto {
  @ApiProperty({ description: '新密码', example: 'new-password' })
  @IsString()
  password: string
}

export class UserResetPasswordDto extends AuthBodyDto {
  @ApiProperty({ description: '新密码', example: 'new-password' })
  @IsString()
  password: string
}
