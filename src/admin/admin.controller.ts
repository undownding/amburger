import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiSummary } from '@/lib/nestjs-ext'
import { UserService } from '@/user/user.service'
import { User } from '@/user/user.entity'
import { Paged } from '@/lib/base-crud-service'
import { Roles, RolesGuard } from '@/user/role/role.guard'
import { ApiTags } from '@nestjs/swagger'
import { NeedLogin } from '@/user/auth/auth.decorator'

@NeedLogin()
@Controller('admin')
@ApiTags('管理员')
export class AdminController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @ApiSummary('获取管理员列表')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  async getAdminList(): Promise<Paged<User>> {
    return this.userService.search({
      roles: {
        name: 'ADMIN',
      },
    })
  }
}
