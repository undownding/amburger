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

  @Column({ default: '' })
  nickname: string

  @Column({ nullable: true })
  avatarUrl?: string

  @Column({ default: false })
  banned: boolean

  @ManyToMany(() => Role, (role) => role.users, { eager: true })
  @JoinTable()
  roles: Role[]

  @Column({ unique: true, nullable: true })
  phoneCode?: string

  @Column({ unique: true, nullable: true, default: '' })
  email?: string

  @Column({ default: '86' })
  regionCode: string

  @Column()
  password: string

  @Column()
  salt: string
}
