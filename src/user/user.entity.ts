import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { BaseEntity } from '@/lib/base-entity'
import { Role } from '@/user/role/role.entity'

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number
  @Column({ unique: true })
  name: string

  @ManyToMany(() => Role, (role) => role.users, { eager: true })
  @JoinTable()
  roles: Role[]
}
