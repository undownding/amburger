import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PickType,
} from '@nestjs/swagger'
import { Resource } from './resource.entity'
import { Permission } from '@/resource/permission.entity'
import { IsBoolean, IsOptional } from 'class-validator'
import { Paged, PagedDto } from '@/lib/base-crud-service'

export class ResourceUpdateDto extends OmitType(Resource, [
  'id',
  'status',
  'type',
  'owner',
  'assigners',
  'permissions',
  'setId',
]) {}

export class PermissionUpdateDto extends PickType(Permission, [
  'userId',
  'permission',
]) {}

export class ResourceSearchQuery extends PagedDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isOwner?: boolean
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isAssigner?: boolean
}

export class ResourceSearchResDto implements Paged<Resource> {
  @ApiProperty() count: number
  @ApiProperty({ isArray: true, type: Resource }) data: Resource[]
}
