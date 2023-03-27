import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-custom'
import { IToken } from '@/user/auth/auth.decorator'

@Injectable()
export class EmptyUserStrategy extends PassportStrategy(
  Strategy,
  'empty-user',
) {
  async validate(): Promise<Partial<IToken>> {
    return {}
  }
}
