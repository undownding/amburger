import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger'
import { Resource } from './resource.entity'
import { IDType } from '@/lib/base-crud-service'
import { ResourceService } from './resource.service'
import { RESOURCE_NAME } from './resource.constant'
import { ApiSummary } from '@/lib/nestjs-ext'
import { ResourceUpdateDto } from '@/resource/resource.dto'
import { IToken, Me, NeedLogin } from '@/user/auth/auth.decorator'
import { UserService } from '@/user/user.service'

@Controller(RESOURCE_NAME)
@ApiTags('资源')
export class ResourceController {
  constructor(
    private readonly resourceService: ResourceService,
    private readonly userService: UserService,
  ) {}

  @Get(':id')
  @ApiOkResponse({ type: Resource })
  @ApiParam({ name: 'id', description: '资源 id' })
  @ApiSummary('根据 id 获取资源')
  async getById(@Param('id') id: IDType): Promise<Resource> {
    return this.resourceService.getById(id)
  }

  @Post()
  @ApiOkResponse({ type: Resource })
  @ApiSummary('创建资源')
  @NeedLogin()
  async create(
    @Body() body: ResourceUpdateDto,
    @Me() me: IToken,
  ): Promise<Resource> {
    const owner = await this.userService.getById(me.id)
    return this.resourceService.create({ ...body, owner })
  }

  @Post(':id')
  @ApiOkResponse({ type: Resource })
  @ApiParam({ name: 'id', description: '资源 id' })
  @ApiSummary('更新资源')
  @NeedLogin()
  async update(
    @Param('id') id: IDType,
    @Body() body: ResourceUpdateDto,
    @Me() me: IToken,
  ): Promise<Resource> {
    return this.resourceService.update(id, body, me.id)
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: '资源 id' })
  @ApiSummary('删除资源')
  @NeedLogin()
  async delete(@Param('id') id: IDType, @Me() me: IToken): Promise<void> {
    return this.resourceService.delete(id, me.id)
  }
}
