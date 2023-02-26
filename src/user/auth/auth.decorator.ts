import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  UseGuards,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { ApiCookieAuth } from '@nestjs/swagger'
import { JwtGuard } from '@/user/auth/auth-jwt.guard'
import { LocalAuthGuard } from '@/user/auth/guards/local-auth.guard'

export const Me: () => ParameterDecorator = createParamDecorator(
  (data, context: ExecutionContext) => {
    if (context.getType() === 'http') {
      return context.switchToHttp().getRequest().user
    }

    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req.user
  },
)

export const NeedLogin: () => MethodDecorator & ClassDecorator = () => {
  return applyDecorators(ApiCookieAuth('jwt'), UseGuards(JwtGuard))
}

export const TryAuth: () => MethodDecorator & ClassDecorator = () => {
  return applyDecorators(UseGuards(LocalAuthGuard))
}
