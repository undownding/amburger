import { Injectable } from '@nestjs/common'
import { User } from '@/user/user.entity.js'
import { Repository } from 'typeorm'
import argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt'
import { nanoid } from 'nanoid'
import { IToken, TokenType } from '@/user/auth/auth.decorator.js'
import type { IDType } from '@/lib/base-crud-service.js'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async checkPassword(user: User, password: string): Promise<boolean> {
    if (!user) return false
    return argon2.verify(user.password, password, {
      salt: Buffer.from(user.salt, 'base64'),
    })
  }

  async sign(user: { id: IDType }, type: TokenType): Promise<string> {
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
