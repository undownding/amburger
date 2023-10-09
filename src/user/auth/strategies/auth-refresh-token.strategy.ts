import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import { Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import type { IToken } from '@/user/auth/auth.decorator.js'

@Injectable()
export class AuthRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh_token',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: AuthRefreshTokenStrategy.fromHeader,
      secretOrKey: configService.get('JWT_SECRET'),
    })
  }

  public static fromHeader(req: Request): string {
    const authHeader = req.header('authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7, authHeader.length)
    }
    return null
  }

  // eslint-disable-next-line class-methods-use-this
  public async validate(payload: IToken): Promise<object> {
    if (payload.type !== 'refresh_token') {
      throw new BadRequestException('token 类型无效')
    }
    return payload
  }
}
