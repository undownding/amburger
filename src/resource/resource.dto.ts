import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PickType,
} from '@nestjs/swagger'
import { Resource } from './resource.entity.js'
import { IsBoolean, IsOptional } from 'class-validator'
import { Paged, PagedDto } from '@/lib/base-crud-service.js'
import { Assigner } from '@/resource/assigner/assigner.enitity.js'

export class ResourceUpdateDto extends OmitType(Resource, [
  'id',
  'status',
  'type',
  'owner',
  'assigners',
  'setId',
]) {}

export class AssignerUpdateDto extends PickType(Assigner, ['permission']) {
  @ApiProperty({
    example: '9r8-1fn0Vk',
    description: '用户ID',
  })
  userId: string
}

export class ResourceSearchQuery extends PagedDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isOwner?: boolean
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isAssigner?: boolean
}

export class ResourceSearchResDto implements Paged<Resource> {
  @ApiProperty() count: number
  @ApiProperty({ isArray: true, type: Resource }) data: Resource[]
}
