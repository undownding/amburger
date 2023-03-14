import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger'
import { User } from '@/user/user.entity'
import { IsOptional, IsString } from 'class-validator'
import { AuthBodyDto } from '@/user/auth/auth.dto'
import { Paged, PagedDto } from '@/lib/base-crud-service'

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

export class UserSearchDto extends PagedDto {
  @ApiPropertyOptional({ description: '搜索关键字', example: 'john wick' })
  @IsOptional()
  @IsString()
  name?: string
}

export class UserSearchResDto implements Paged<User> {
  count: number
  data: User[]
}
