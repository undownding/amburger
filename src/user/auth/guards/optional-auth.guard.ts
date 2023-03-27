import { AuthGuard } from '@nestjs/passport'

export class OptionalAuthGuard extends AuthGuard(['jwt', 'empty-user']) {}
