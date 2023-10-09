import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common'
import {
  AuthBodyDto,
  AuthEmailDto,
  AuthPhoneCodeDto,
  AuthPhoneDto,
  AuthUserNameDto,
  AuthWeChatDto,
} from '@/user/auth/auth.dto.js'
import { validateOrReject } from 'class-validator'
import { plainToClassFromExist } from 'class-transformer'

@Injectable()
export class AuthValidationPipe implements PipeTransform {
  async transform(
    value: AuthBodyDto,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    metadata: ArgumentMetadata,
  ): Promise<object> {
    if (value.username) {
      const data = plainToClassFromExist(AuthUserNameDto, value)
      return validateOrReject(data).then(() => data)
    }
    if (value.email) {
      const data = plainToClassFromExist(AuthEmailDto, value)
      return validateOrReject(data).then(() => data)
    }
    if (value.phone) {
      if (value.password) {
        const data = plainToClassFromExist(AuthPhoneDto, value)
        return validateOrReject(data).then(() => data)
      } else if (value.code) {
        const data = plainToClassFromExist(AuthPhoneCodeDto, value)
        return validateOrReject(data).then(() => data)
      } else {
        throw new BadRequestException('require code or password')
      }
    }

    if (value.code) {
      const data = plainToClassFromExist(AuthWeChatDto, value)
      return validateOrReject(data).then(() => data)
    }

    throw new BadRequestException('Invalid auth type')
  }
}
