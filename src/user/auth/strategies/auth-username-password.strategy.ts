import { Injectable } from '@nestjs/common'
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
    const user = await this.userService.getByUserName(username)
    const isCorrect = await this.authService.checkPassword(user, password)
    if (!isCorrect) {
      return null
    }
    return user
  }
}
