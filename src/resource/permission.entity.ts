import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from '@/user/user.entity'
import { Resource } from '@/resource/resource.entity'

export enum Permissions {
  READ_ONLY = 'READ_ONLY',
  WRITEABLE = 'WRITEABLE',
  MANAGE = 'MANAGE',
}

@Entity({ orderBy: { createdAt: 'ASC' } })
export class Permission extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ enum: Permissions })
  permission: Permissions

  @ManyToOne(() => User)
  user: User

  @ManyToOne(() => Resource, (resource) => resource)
  resource: Resource
}
