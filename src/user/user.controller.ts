import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import type { IToken } from '@/user/auth/auth.decorator.js'
import { Me, NeedLogin, TryAuth } from '@/user/auth/auth.decorator.js'
import { User } from '@/user/user.entity.js'
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger'
import { ApiSummary } from '@/lib/nestjs-ext.js'
import { UserService } from '@/user/user.service.js'
import {
  UserResetPasswordDto,
  UserSearchDto,
  UserSearchResDto,
  UserUpdateDto,
  UserUpdatePasswordDto,
} from '@/user/user.dto.js'
import type { IDType } from '@/lib/base-crud-service.js'
import { Like } from 'typeorm'

@Controller('user')
@ApiTags('用户')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiSummary('已登录用户获取自己信息')
  @ApiOkResponse({ type: User })
  @NeedLogin()
  @Get('me')
  async me(@Me() me: IToken): Promise<User> {
    return this.userService.getById(me.id)
  }

  @ApiSummary('修改用户资料')
  @ApiOkResponse({ type: User })
  @NeedLogin()
  @Post('me')
  async update(@Me() me: IToken, @Body() body: UserUpdateDto): Promise<User> {
    return this.userService.update(me.id, body)
  }

  @ApiSummary('修改密码')
  @ApiOkResponse({ status: 201, description: '修改成功' })
  @NeedLogin()
  @Post('me/password')
  async updatePassword(
    @Me() me: IToken,
    @Body() body: UserUpdatePasswordDto,
  ): Promise<void> {
    return this.userService.updatePassword(me.id, body.password)
  }

  @ApiSummary('重设密码')
  @ApiOkResponse({ status: 201, description: '重设成功' })
  @Post('reset-password')
  @TryAuth()
  async resetPassword(@Me() me: User, @Body() body: UserResetPasswordDto) {
    return this.userService.updatePassword(me.id, body.password)
  }

  @ApiSummary('根据 id 获取用户')
  @ApiOkResponse({ type: User })
  @ApiParam({ name: 'id', description: '用户 id' })
  @Get(':id')
  async getUserById(@Param('id') id: IDType): Promise<User> {
    return this.userService.getById(id)
  }

  @ApiSummary('搜索用户')
  @ApiOkResponse({ type: UserSearchResDto })
  @Get()
  async search(@Query() query: UserSearchDto): Promise<UserSearchResDto> {
    return this.userService.search(
      query.name
        ? [
            { name: Like(`%${query.name}%`) },
            { nickname: Like(`%${query.name}%`) },
          ]
        : {},
    )
  }
}
