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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import type { IDType } from '@/lib/base-crud-service'

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
  @ApiProperty({ example: '9r8-1fn0Vk', description: '用户ID' })
  id: IDType = ''

  @Column({ unique: true })
  @ApiProperty({ example: 'admin', description: '用户名' })
  name: string

  @Column({ default: '' })
  @ApiProperty({ example: 'admin', description: '用户昵称' })
  nickname: string

  @Column({ nullable: true })
  @ApiPropertyOptional({
    example: 'https://example.com/avatar.png',
    description: '用户头像 url',
  })
  avatarUrl?: string

  @Column({ default: false })
  @ApiProperty({ example: false, description: '用户是否被禁用' })
  banned: boolean

  @ManyToMany(() => Role, (role) => role.users, { eager: true })
  @JoinTable()
  roles: Role[]

  @Column({ unique: true, nullable: true })
  @ApiPropertyOptional({
    example: 'admin@website.com',
    description: '邮箱',
  })
  email?: string

  @Column({ unique: true, nullable: true })
  @ApiPropertyOptional({
    example: 'o6_bmjrPTlm6_2sgVt7hMZOPfL2M',
    description: '用于微信登录的 unionId',
  })
  unionId?: string

  @Column({ default: '+86' })
  @ApiProperty({ example: '+86', description: '手机号码国家代码' })
  regionCode: string

  @Column({ unique: true, nullable: true })
  @ApiPropertyOptional({
    example: '13800138000',
    description: '手机号码',
  })
  phone?: string

  @Column({ select: false })
  password: string

  @Column({ select: false })
  salt: string

  @BeforeInsert()
  setId() {
    const nanoId = defaultIdOptions?.customAlphabet
      ? customAlphabet(defaultIdOptions.customAlphabet, defaultIdOptions.length)
      : nanoid
    this.id = nanoId(defaultIdOptions.length)
  }
}
