import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { Resource } from './resource.entity'
import { IDType } from '@/lib/base-crud-service'
import { ResourceService } from './resource.service'
import { RESOURCE_NAME } from './resource.constant'
import { ApiSummary } from '@/lib/nestjs-ext'
import {
  PermissionUpdateDto,
  ResourceSearchQuery,
  ResourceSearchResDto,
  ResourceUpdateDto,
} from '@/resource/resource.dto'
import {
  IToken,
  Me,
  NeedLogin,
  OptionalLogin,
} from '@/user/auth/auth.decorator'
import { UserService } from '@/user/user.service'
import { Permission } from '@/permission/permission.entity'
import heredoc from 'tsheredoc'

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
  @OptionalLogin()
  async getById(@Param('id') id: IDType, @Me() me: IToken): Promise<Resource> {
    return this.resourceService.getById(id, me.id)
  }

  @Get()
  @ApiOkResponse({ type: ResourceSearchResDto })
  @ApiOperation({
    summary: '获取用户的资源',
    description: heredoc`
    搜索跟当前用户有关联的资源
    
    不带 query 参数：返回所有下列两项
    
    只带 query.isOwner：返回所有属于该用户创建资源
    
    只带 query.isAssigner：返回所有该用户作为协作者参与的资源
    `,
  })
  @NeedLogin()
  async search(
    @Query() query: ResourceSearchQuery,
    @Me() me: IToken,
  ): Promise<ResourceSearchResDto> {
    return this.resourceService.getByUser(query, me.id, me.id)
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

  @Post(':id/assigners')
  @ApiParam({ name: 'id', description: '资源 id' })
  @ApiSummary('添加协作者')
  @NeedLogin()
  async addAssigner(
    @Param('id') id: IDType,
    @Body() body: PermissionUpdateDto,
    @Me() me: IToken,
  ): Promise<Permission[]> {
    return this.resourceService.addAssigner(
      id,
      me.id,
      body.userId,
      body.permission,
    )
  }

  @Delete(':id/assigners/:userId')
  @ApiParam({ name: 'id', description: '资源 id' })
  @ApiParam({ name: 'userId', description: '用户 id' })
  @ApiSummary('删除协作者')
  @NeedLogin()
  async removeAssigner(
    @Param('id') id: IDType,
    @Param('userId') userId: IDType,
    @Me() me: IToken,
  ): Promise<Permission[]> {
    return this.resourceService.removeAssigner(id, me.id, userId)
  }

  @Post(':id/assigners/:userId')
  @ApiParam({ name: 'id', description: '资源 id' })
  @ApiParam({ name: 'userId', description: '用户 id' })
  @ApiSummary('更新协作者权限')
  @NeedLogin()
  async updateAssigner(
    @Param('id') id: IDType,
    @Param('userId') userId: IDType,
    @Body() body: PermissionUpdateDto,
    @Me() me: IToken,
  ): Promise<Permission[]> {
    return this.resourceService.updateAssigner(
      id,
      me.id,
      userId,
      body.permission,
    )
  }
}
