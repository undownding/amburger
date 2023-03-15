import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from '@/user/user.entity'
import { Resource } from '@/resource/resource.entity'
import { IDType } from '@/lib/base-crud-service'

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

  @Column({ type: 'varchar', length: 10 })
  userId: IDType

  @ManyToOne(() => Resource, (resource) => resource)
  resource: Resource

  @BeforeInsert()
  @BeforeUpdate()
  async beforeSave() {
    this.userId = this.user.id
  }
}
