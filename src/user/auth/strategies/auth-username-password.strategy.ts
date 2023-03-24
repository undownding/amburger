import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthService } from '@/user/auth/auth.service'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { UserService } from '@/user/user.service'
import { User } from '@/user/user.entity'

@Injectable()
export class AuthUsernamePasswordStrategy extends PassportStrategy(
  Strategy,
  'username-password',
) {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    })
  }

  async validate(username: string, password: string): Promise<User> {
    if (!username || !password) {
      return null
    }
    const user = await this.userService.getByUserName(username, true)
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
