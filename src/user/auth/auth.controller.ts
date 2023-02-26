import { Body, Controller, Post, Res } from '@nestjs/common'
import { AuthBodyDto } from '@/user/auth/auth.dto'
import { Me, TryAuth } from '@/user/auth/auth.decorator'
import { User } from '@/user/user.entity'
import { ApiTags } from '@nestjs/swagger'
import { AuthService } from '@/user/auth/auth.service'
import { Response } from 'express'

@Controller('auth')
@ApiTags('登录相关接口')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @TryAuth()
  async signIn(
    @Body() body: AuthBodyDto,
    @Me() me: User,
    @Res() res: Response,
  ): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { salt, password, ...user } = me
    const jwt = await this.authService.sign(me)
    res.cookie('jwt', jwt)
    res.json({
      ...user,
      accessToken: jwt,
    })
  }
}
