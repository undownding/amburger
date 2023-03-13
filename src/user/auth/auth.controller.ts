import { Body, Controller, Post, Res } from '@nestjs/common'
import { AuthBodyDto, AuthRespDto } from '@/user/auth/auth.dto'
import { Me, TryAuth } from '@/user/auth/auth.decorator'
import { User } from '@/user/user.entity'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { AuthService } from '@/user/auth/auth.service'
import { Response } from 'express'
import { ApiSummary } from '@/lib/nestjs-ext'
import Bluebird from 'bluebird'

@Controller('auth')
@ApiTags('登录相关接口')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @TryAuth()
  @ApiSummary('登录')
  @ApiOkResponse({ status: 200, type: AuthRespDto, description: '登录成功' })
  async signIn(
    @Body() body: AuthBodyDto,
    @Me() me: User, // 在使用 @TryAuth 时 @Me 为 User 类型，其他用 @NeedLogin 时用 IToken 类型
    @Res() res: Response,
  ): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { salt, password, ...user } = me
    const resp: AuthRespDto = await Bluebird.props({
      ...user,
      accessToken: this.authService.sign(me, 'access_token'),
      refreshToken: this.authService.sign(me, 'refresh_token'),
    })
    res.cookie('accessToken', resp.accessToken)
    res.json(resp)
  }
}
