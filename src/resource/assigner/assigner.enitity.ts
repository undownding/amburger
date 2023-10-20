import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { User } from '@/user/user.entity'
import { Resource } from '../resource.entity'
import { Permissions } from './permission.enum'
import { BaseEntity } from '@/lib/base-entity'
import { RESOURCE_NAME } from '@/resource/resource.constant'

@Entity({ name: `${RESOURCE_NAME}_assigner`, orderBy: { permission: 'DESC' } })
export class Assigner extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string = ''

  @Column({ type: 'tinyint', enum: Permissions })
  @ApiProperty({ enum: Permissions, description: '分配的权限' })
  permission: Permissions

  @ManyToOne(() => User, { eager: true })
  user: User

  @ManyToOne(() => Resource, (resource) => resource)
  resource: Resource

  async can(permission: Permissions): Promise<boolean> {
    return this.permission >= permission
  }

  async asObject(): Promise<Partial<Assigner>> {
    return {
      permission: this.permission,
      user: await this.user,
    }
  }
}
