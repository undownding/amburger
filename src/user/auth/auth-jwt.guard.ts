import { ExecutionContext, Injectable } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  // Override this method, so it can be used in graphql
  // eslint-disable-next-line class-methods-use-this
  getRequest(context: ExecutionContext): object {
    const ctx = GqlExecutionContext.create(context)
    const gqlReq = ctx.getContext().req
    if (gqlReq) {
      const { variables } = ctx.getArgs()
      gqlReq.body = variables
      return gqlReq
    }
    return context.switchToHttp().getRequest()
  }
}
