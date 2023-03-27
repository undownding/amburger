import {
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
import { ApiProperty } from '@nestjs/swagger'
import { BaseEntity } from '@/lib/base-entity'

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
  @ApiProperty({ enum: Permissions, description: '分配的权限' })
  permission: Permissions

  @ManyToOne(() => User)
  user: User

  @Column({ type: 'varchar', length: 10 })
  @ApiProperty({ example: '9r8-1fn0Vk', description: '用户ID' })
  userId: IDType

  @ManyToOne(() => Resource, (resource) => resource)
  resource: Resource

  @Column({ type: 'varchar', length: 26 })
  resourceId: IDType

  @BeforeInsert()
  @BeforeUpdate()
  async beforeSave() {
    this.userId = this.user.id
  }
}
