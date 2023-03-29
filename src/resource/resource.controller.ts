import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { Resource } from './resource.entity'
import { IDType } from '@/lib/base-crud-service'
import { ResourceService } from './resource.service'
import { RESOURCE_DISPLAY_NAME, RESOURCE_NAME } from './resource.constant'
import { ApiSummary } from '@/lib/nestjs-ext'
import {
  AssignerUpdateDto,
  ResourceSearchQuery,
  ResourceSearchResDto,
  ResourceUpdateDto,
} from './resource.dto'
import {
  IToken,
  Me,
  NeedLogin,
  OptionalLogin,
} from '@/user/auth/auth.decorator'
import { UserService } from '@/user/user.service'
import heredoc from 'tsheredoc'
import { Assigner } from '@/resource/assigner/assigner.enitity'

@Controller(RESOURCE_NAME)
@ApiTags(RESOURCE_DISPLAY_NAME)
export class ResourceController {
  constructor(
    private readonly resourceService: ResourceService,
    private readonly userService: UserService,
  ) {}

  @Get(':id')
  @ApiOkResponse({ type: Resource })
  @ApiParam({ name: 'id', description: `${RESOURCE_DISPLAY_NAME} id` })
  @ApiSummary(`根据 id 获取${RESOURCE_DISPLAY_NAME}`)
  @OptionalLogin()
  async getById(@Param('id') id: IDType, @Me() me: IToken): Promise<Resource> {
    return this.resourceService.getById(id, me.id)
  }

  @Get()
  @ApiOkResponse({ type: ResourceSearchResDto })
  @ApiOperation({
    summary: `获取当前用户的${RESOURCE_DISPLAY_NAME}`,
    description: heredoc`
    搜索跟当前用户有关联的${RESOURCE_DISPLAY_NAME}
    
    不带 query 参数：返回所有下列两项
    
    只带 query.isOwner：返回所有属于该用户创建的${RESOURCE_DISPLAY_NAME}
    
    只带 query.isAssigner：返回所有该用户作为协作者参与的${RESOURCE_DISPLAY_NAME}
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
  @ApiSummary(`创建${RESOURCE_DISPLAY_NAME}`)
  @NeedLogin()
  async create(
    @Body() body: ResourceUpdateDto,
    @Me() me: IToken,
  ): Promise<Resource> {
    return this.resourceService.create(body, me.id)
  }

  @Patch(':id')
  @ApiOkResponse({ type: Resource })
  @ApiParam({ name: 'id', description: `${RESOURCE_DISPLAY_NAME} id` })
  @ApiSummary(`更新${RESOURCE_DISPLAY_NAME}`)
  @NeedLogin()
  async update(
    @Param('id') id: IDType,
    @Body() body: ResourceUpdateDto,
    @Me() me: IToken,
  ): Promise<Resource> {
    return this.resourceService.update(id, body, me.id)
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: `${RESOURCE_DISPLAY_NAME} id` })
  @ApiSummary(`根据 id 删除${RESOURCE_DISPLAY_NAME}`)
  @NeedLogin()
  async delete(@Param('id') id: IDType, @Me() me: IToken): Promise<void> {
    return this.resourceService.delete(id, me.id)
  }

  @Post(':id/assigners')
  @ApiParam({ name: 'id', description: `${RESOURCE_DISPLAY_NAME} id` })
  @ApiSummary('添加协作者')
  @NeedLogin()
  async addAssigner(
    @Param('id') id: IDType,
    @Body() body: AssignerUpdateDto,
    @Me() me: IToken,
  ): Promise<Assigner[]> {
    return this.resourceService.addAssigner(
      id,
      me.id,
      body.userId,
      body.permission,
    )
  }

  @Delete(':id/assigners/:userId')
  @ApiParam({ name: 'id', description: `${RESOURCE_DISPLAY_NAME} id` })
  @ApiParam({ name: 'userId', description: '用户 id' })
  @ApiSummary('移除协作者')
  @NeedLogin()
  async removeAssigner(
    @Param('id') id: IDType,
    @Param('userId') userId: IDType,
    @Me() me: IToken,
  ): Promise<Assigner[]> {
    return this.resourceService.removeAssigner(id, me.id, userId)
  }

  @Post(':id/assigners/:userId')
  @ApiParam({ name: 'id', description: `${RESOURCE_DISPLAY_NAME} id` })
  @ApiParam({ name: 'userId', description: '用户 id' })
  @ApiSummary('更新协作者权限')
  @NeedLogin()
  async updateAssigner(
    @Param('id') resourceId: IDType,
    @Param('userId') userId: IDType,
    @Body() body: AssignerUpdateDto,
    @Me() me: IToken,
  ): Promise<Assigner[]> {
    return this.resourceService.updateAssigner(
      resourceId,
      me.id,
      userId,
      body.permission,
    )
  }
}
