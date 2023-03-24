import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-custom'
import { User } from '@/user/user.entity'
import { AuthWeChatDto } from '@/user/auth/auth.dto'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { Expose } from 'class-transformer'
import { firstValueFrom } from 'rxjs'
import buildUrl from 'build-url-ts'
import { UserService } from '@/user/user.service'

export type GrantType = 'client_credential' | 'authorization_code'

export class TokenResDto {
  @Expose({ name: 'access_token' }) accessToken: string
  @Expose({ name: 'refresh_token' }) refreshToken: string
  @Expose({ name: 'expires_in' }) expiresIn: number
  openid: string
  unionid: string
}

export class WechatUserInfo {
  @Expose({ name: 'headimgurl' }) avatarUrl: string
  openid: string
  nickname: string
  unionid: string
  errcode?: number
}

@Injectable()
export class AuthWechatQrCodeStrategy extends PassportStrategy(
  Strategy,
  'wechat-qrcode',
) {
  private readonly appId: string
  private readonly appSecret: string

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super()
    this.appId = configService.get('WECHAT_APP_ID')
    this.appSecret = configService.get('WECHAT_APP_SECRET')
  }

  async validate({ body }: { body: AuthWeChatDto }): Promise<User> {
    // 当以后有更多的登录类型时，在 validate 方法开始时判断 body.type，
    // 若 body.type 不为 'wechat-qrcode'，则直接返回 null
    const grantType: GrantType = 'authorization_code'
    const token: TokenResDto = await firstValueFrom(
      this.httpService.get<TokenResDto>(
        buildUrl('https://api.weixin.qq.com/sns/oauth2/access_token', {
          queryParams: {
            grant_type: grantType,
            appid: this.appId,
            secret: this.appSecret,
            code: body.code,
          },
        }),
      ),
    ).catch(() => null)
    if (!token) {
      return null
    }
    const wechatUser: WechatUserInfo = await firstValueFrom(
      this.httpService.get<WechatUserInfo>(
        buildUrl('https://api.weixin.qq.com/sns/userinfo', {
          queryParams: {
            access_token: token.accessToken,
            openid: token.openid,
          },
        }),
      ),
    )
      .catch(() => null)
      .then((res) => res.data)
    if (!wechatUser || wechatUser.errcode) {
      return null
    }
    const user = await this.userService.getByUnionId(wechatUser.unionid)
    if (user) {
      return user
    } else {
      return this.userService.create({
        name: wechatUser.nickname,
        nickname: wechatUser.nickname,
        avatarUrl: wechatUser.avatarUrl,
        unionId: wechatUser.unionid,
      })
    }
  }
}
