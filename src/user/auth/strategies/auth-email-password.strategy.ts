import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { UserService } from '@/user/user.service'
import { User } from '@/user/user.entity'
import { AuthService } from '@/user/auth/auth.service'
import { Strategy } from 'passport-local'

@Injectable()
export class AuthEmailPasswordStrategy extends PassportStrategy(
  Strategy,
  'email-password',
) {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    })
  }

  async validate(email: string, password: string): Promise<User> {
    const user = await this.userService.getByEmail(email)
    if (!user) {
      return null
    }
    if (user.banned) {
      throw new UnauthorizedException('用户审核未通过或已封禁')
    }
    const isCorrect = await this.authService.checkPassword(user, password)
    if (!isCorrect) {
      return null
    }
    return user
  }
}
