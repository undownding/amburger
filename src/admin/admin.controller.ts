import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiSummary } from '@/lib/nestjs-ext'
import { UserService } from '@/user/user.service'
import { User } from '@/user/user.entity'
import { Paged, PagedDto } from '@/lib/base-crud-service'
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
  async getAdminList(@Query() query: PagedDto): Promise<Paged<User>> {
    return this.userService.search(
      {
        roles: {
          name: 'ADMIN',
        },
      },
      query.skip,
      query.limit,
    )
  }

  @Get('/')
  @ApiSummary('获取用戶列表')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  async getUserList(@Query() query: PagedDto): Promise<Paged<User>> {
    return this.userService.search({}, query.skip, query.limit)
  }
}
