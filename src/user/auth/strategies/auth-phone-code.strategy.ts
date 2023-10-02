import { PassportStrategy } from '@nestjs/passport'
import { UserService } from '@/user/user.service'
import { Strategy } from 'passport-custom'
import { Request } from 'express'
import { User } from '@/user/user.entity'
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import Cache from 'cache-manager'
import { AuthPhoneCodeDto } from '@/user/auth/auth.dto'
import randomstring from 'randomstring'
import { SmsDto } from '@/sms/sms.dto'
import { randomBytes } from 'crypto'
import { CACHE_MANAGER } from '@nestjs/cache-manager'

@Injectable()
export class AuthPhoneCodeStrategy extends PassportStrategy(
  Strategy,
  'phone-code',
) {
  constructor(
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    super()
  }

  async validate(req: Request | { body: AuthPhoneCodeDto }): Promise<User> {
    const { regionCode, phone, code } = req.body
    if (!code) {
      return null
    }
    const isCorrect = await this.verifyCode(req.body, code)
    let user = await this.userService.getByPhone(regionCode, phone)
    if (!user && isCorrect) {
      user = await this.userService.signUp({
        phone,
        username: `手机用户_${randomstring.generate({
          length: 6,
          readable: true,
          charset: 'alphanumeric',
          capitalization: 'lowercase',
        })}`,
        password: randomBytes(8).toString('hex'),
      })
    }
    if (user && user.banned) {
      throw new UnauthorizedException('用户审核未通过或已封禁')
    }
    return isCorrect ? user : null
  }

  async verifyCode(
    { regionCode, phone }: SmsDto,
    code: string,
  ): Promise<boolean> {
    const key = `phone:${regionCode || '+86'}${phone}:code`
    const cacheCode = await this.cacheManager.get<string>(key)
    if (cacheCode === code) {
      await this.cacheManager.del(key)
      return true
    }
    return false
  }
}
