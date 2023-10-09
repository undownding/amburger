import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-custom'
import type { IToken } from '@/user/auth/auth.decorator.js'

@Injectable()
export class EmptyUserStrategy extends PassportStrategy(
  Strategy,
  'empty-user',
) {
  async validate(): Promise<Partial<IToken>> {
    return {}
  }
}
