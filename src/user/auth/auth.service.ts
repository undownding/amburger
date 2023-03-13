import { Inject, Injectable } from '@nestjs/common'
import { User } from '@/user/user.entity'
import { Repository } from 'typeorm'
import * as argon2 from 'argon2'
import { getRepositoryToken } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt'
import { nanoid } from 'nanoid'
import { IToken, TokenType } from '@/user/auth/auth.decorator'

@Injectable()
export class AuthService {
  constructor(
    @Inject(getRepositoryToken(User))
    private readonly repository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async checkPassword(user: User, password: string): Promise<boolean> {
    if (!user) return false
    return argon2.verify(user.password, password, {
      salt: Buffer.from(user.salt, 'base64'),
    })
  }

  async sign(user: User, type: TokenType): Promise<string> {
    const token: IToken = {
      id: user.id,
      tokenId: nanoid(16),
      type,
    }
    return this.jwtService.sign(token, {
      expiresIn: type === 'refresh_token' ? '7d' : '7200s',
    })
  }
}
