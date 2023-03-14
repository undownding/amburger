import { Body, Controller, Post, Res } from '@nestjs/common'
import { AuthBodyDto, AuthRespDto, TokenRespDto } from '@/user/auth/auth.dto'
import {
  IToken,
  Me,
  NeedRefreshToken,
  Token,
  TryAuth,
} from '@/user/auth/auth.decorator'
import { User } from '@/user/user.entity'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { AuthService } from '@/user/auth/auth.service'
import { Response } from 'express'
import { ApiSummary } from '@/lib/nestjs-ext'
import * as Bluebird from 'bluebird'
import * as moment from 'moment'

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
    res.cookie('access_token', resp.accessToken)
    res.json(resp)
  }

  @Post('token')
  @NeedRefreshToken()
  @ApiOperation({
    summary: '刷新令牌',
    description:
      '当 access_token 过期时，使用 refresh_token 刷新 access_token（需要在 header 中携带 refresh_token）',
  })
  @ApiOkResponse({
    status: 200,
    type: TokenRespDto,
    description: '刷新令牌成功',
  })
  async refreshToken(
    @Me() me: IToken,
    @Token() rawToken,
    @Res() res: Response,
  ): Promise<void> {
    const exp = moment(rawToken.exp * 1000)
    const refreshToken =
      exp.diff(moment(), 'days') < 3
        ? await this.authService.sign(me, 'refresh_token')
        : rawToken

    const resp: TokenRespDto = await Bluebird.props({
      accessToken: this.authService.sign(me, 'access_token'),
      refreshToken,
    })
    res.cookie('access_token', resp.accessToken)
    res.json(resp)
  }
}
