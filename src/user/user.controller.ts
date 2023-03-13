import { Body, Controller, Get, Post } from '@nestjs/common'
import { IToken, Me, NeedLogin, TryAuth } from '@/user/auth/auth.decorator'
import { User } from '@/user/user.entity'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { ApiSummary } from '@/lib/nestjs-ext'
import { UserService } from '@/user/user.service'
import {
  UserResetPasswordDto,
  UserUpdateDto,
  UserUpdatePasswordDto,
} from '@/user/user.dto'

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
}
