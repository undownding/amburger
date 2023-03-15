import { OmitType } from '@nestjs/swagger'
import { Resource } from './resource.entity'

export class ResourceUpdateDto extends OmitType(Resource, [
  'id',
  'status',
  'type',
  'owner',
  'assigners',
  'permissions',
  'setId',
]) {}
