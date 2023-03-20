import { OmitType, PickType } from '@nestjs/swagger'
import { Resource } from './resource.entity'
import { Permission } from '@/resource/permission.entity'

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
