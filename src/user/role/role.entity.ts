import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntity } from '@/lib/base-entity'
import { User } from '@/user/user.entity'

@Entity()
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    unique: true,
    transformer: {
      from: (value: any) => value,
      to: (value: string) => value.toUpperCase(),
    },
  })
  name: string

  @ManyToMany(() => User, (user) => user.roles)
  users: User[]
}
