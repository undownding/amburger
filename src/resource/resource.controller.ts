import { Controller, Get, Param } from '@nestjs/common'
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger'
import { Resource } from '@/resource/resource.entity'
import { IDType } from '@/lib/base-crud-service'
import { ResourceService } from '@/resource/resource.service'

@Controller('resource')
@ApiTags('资源')
export class ResourceController {
  constructor(private readonly service: ResourceService) {}

  @Get(':id')
  @ApiOkResponse({ type: Resource })
  @ApiParam({ name: 'id', description: '资源 id' })
  async getById(@Param('id') id: IDType): Promise<Resource> {
    return this.service.getById(id)
  }
}
