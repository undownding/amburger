import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserService } from '@/user/user.service'
import { In } from 'typeorm'

export const Roles = (...roles: string[]) => SetMetadata('roles', roles)

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ])
    if (!roles) {
      return true
    }
    const request = context.switchToHttp().getRequest()
    return this.userService.exists({
      where: {
        id: request.user.id,
        roles: { name: In(roles) },
      },
    })
  }
}
