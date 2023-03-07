import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
} from 'typeorm'
import { BaseEntity } from '@/lib/base-entity'
import { Role } from '@/user/role/role.entity'
import { customAlphabet, nanoid } from 'nanoid'

type IdOptions = {
  length?: number
  customAlphabet?: string
}

const defaultIdOptions: IdOptions = {
  length: 10,
}

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: defaultIdOptions.length })
  id: string
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
  email?: string

  @Column({ unique: true, nullable: true })
  unionId?: string

  @Column({ default: '+86' })
  regionCode: string

  @Column({ unique: true, nullable: true })
  phone?: string

  @Column()
  password: string

  @Column()
  salt: string

  @BeforeInsert()
  setId() {
    const nanoId = defaultIdOptions?.customAlphabet
      ? customAlphabet(defaultIdOptions.customAlphabet, defaultIdOptions.length)
      : nanoid
    this.id = nanoId(defaultIdOptions.length)
  }
}
