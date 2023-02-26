import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import { Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'

interface IToken {
  uid: number
  tokenId: string
  type: string
}

@Injectable()
export class AuthJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: AuthJwtStrategy.fromCookie,
      secretOrKey: configService.get('JWT_SECRET'),
    })
  }

  public static fromCookieOrHeader(req: Request): string {
    const authHeader = req.header('authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7, authHeader.length)
    }
    return req.cookies['jwt']
  }

  public static fromCookie(req: Request): string {
    return req.cookies['jwt']
  }

  // eslint-disable-next-line class-methods-use-this
  public async validate(payload: IToken): Promise<object> {
    return payload
  }
}