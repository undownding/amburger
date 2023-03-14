import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  UseGuards,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { ApiCookieAuth, ApiResponse } from '@nestjs/swagger'
import { JwtGuard } from '@/user/auth/guards/auth-jwt.guard'
import { LocalAuthGuard } from '@/user/auth/guards/local-auth.guard'
import { AuthGuard } from '@nestjs/passport'

export type TokenType = 'access_token' | 'refresh_token'

export interface IToken {
  id: string
  tokenId: string
  type: TokenType
  // 过期时间
  exp?: number
  // 签发时间
  iat?: number
}

export const Me: () => ParameterDecorator = createParamDecorator(
  (data, context: ExecutionContext) => {
    if (context.getType() === 'http') {
      return context.switchToHttp().getRequest().user
    }

    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req.user
  },
)

export const Token: () => ParameterDecorator = createParamDecorator(
  (data, context: ExecutionContext) =>
    (context.switchToHttp().getRequest() as Request).headers[
      'authorization'
    ].substring(7),
)

export const NeedLogin: () => MethodDecorator & ClassDecorator = () => {
  return applyDecorators(
    ApiCookieAuth('jwt'),
    UseGuards(JwtGuard),
    ApiResponse({ status: 401, description: '登录失效' }),
  )
}

export const NeedRefreshToken: () => MethodDecorator & ClassDecorator = () => {
  return applyDecorators(
    UseGuards(AuthGuard('refresh_token')),
    ApiResponse({ status: 401, description: 'refresh_token 无效' }),
  )
}

export const TryAuth: () => MethodDecorator & ClassDecorator = () => {
  return applyDecorators(
    UseGuards(LocalAuthGuard),
    ApiResponse({ status: 401, description: '所有登录方式均未通过' }),
  )
}
