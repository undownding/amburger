import { Injectable } from '@nestjs/common'
import argon2 from 'argon2'
import { randomBytes } from 'crypto'
import randomstring from 'randomstring'
import { User } from '@/user/user.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class PasswordService {
  private readonly SALT_LEN = 16

  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  public generateSalt(): string {
    return randomBytes(this.SALT_LEN).toString('base64')
  }

  public generateRandomPassword(): string {
    return randomstring.generate({
      length: 8,
      readable: true,
      charset: 'alphanumeric',
      capitalization: 'lowercase',
    })
  }

  public async hashPassword(password: string, salt: string): Promise<string> {
    return argon2.hash(password, { salt: Buffer.from(salt, 'base64') })
  }
}
