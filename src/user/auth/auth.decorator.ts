import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  UseGuards,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { ApiCookieAuth } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'

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
  return applyDecorators(ApiCookieAuth('jwt'), UseGuards(AuthGuard('jwt')))
}
