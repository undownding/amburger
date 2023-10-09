import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import { Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import type { IToken } from '@/user/auth/auth.decorator.js'

@Injectable()
export class AuthJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: AuthJwtStrategy.fromCookieOrHeader,
      secretOrKey: configService.get('JWT_SECRET'),
    })
  }

  public static fromCookieOrHeader(req: Request): string {
    const authHeader = req.header('authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7, authHeader.length)
    }
    return req.cookies['access_token']
  }

  // eslint-disable-next-line class-methods-use-this
  public async validate(payload: IToken): Promise<IToken> {
    if (payload.type !== 'access_token') {
      throw new BadRequestException('token 类型无效')
    }
    return payload
  }
}
