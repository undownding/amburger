import type { Point } from 'typeorm'
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm'
import { RESOURCE_DISPLAY_NAME, RESOURCE_NAME } from './resource.constant.js'
import { BaseEntity } from '@/lib/base-entity.js'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import type { IDType } from '@/lib/base-crud-service.js'
import { ulid } from 'ulidx'
import { BooleanColumn, JsonColumn, PointColumn } from '@/lib/typeorm-ext.js'
import { User } from '@/user/user.entity.js'
import { Assigner } from '@/resource/assigner/assigner.enitity.js'
import heredoc from '@/lib/tsheredoc.js'

@Entity({ name: RESOURCE_NAME, orderBy: { id: 'ASC' } })
export class Resource extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 26 })
  @ApiProperty({
    example: '01FJ0V986RA01G70YQ5Z0AM0E7',
    description: `${RESOURCE_DISPLAY_NAME} ID`,
  })
  id: IDType = ''

  @Column({ type: 'tinyint', default: 0 })
  @Index()
  @ApiProperty({
    example: 0,
    description: heredoc`
    如有多种${RESOURCE_DISPLAY_NAME}，则以该字段区分${RESOURCE_DISPLAY_NAME}的类型。默认为0。
    
    取值范围为 0-127。
    `,
  })
  type: number

  @Column({ type: 'smallint', default: 0 })
  @Index()
  @ApiProperty({
    example: 0,
    description: heredoc`
    如该${RESOURCE_DISPLAY_NAME}需要追踪状态，使用此字段来追踪。默认为0。

    取值范围为 0-32767
    `,
  })
  status: number

  /** 以下内容为资源内容 **/
  @Column({ type: 'varchar', length: 64, nullable: true })
  @ApiPropertyOptional({
    example: '默认标题',
    description: '标题，可能为空',
  })
  title?: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiPropertyOptional({
    example: '默认内容',
    description: '内容，可能为空',
  })
  content?: string

  @Column({ type: 'simple-array', nullable: true })
  @ApiPropertyOptional({
    description: `如该${RESOURCE_DISPLAY_NAME}存在预览图，使用该字段`,
  })
  previewImages?: string[]

  @Column({ type: 'simple-array', nullable: true })
  @ApiPropertyOptional({
    description: `如该${RESOURCE_DISPLAY_NAME}存在附件，使用该字段`,
  })
  attachments?: string[]

  @JsonColumn({ nullable: true })
  @ApiPropertyOptional({
    example: { foo: 'bar' },
    description: '其他额外数据，可能为空',
  })
  data?: object

  @PointColumn({ nullable: true })
  @ApiPropertyOptional({
    example: { type: 'Point', coordinates: [0, 0] },
    description: '坐标点，可能为空，其中数组内容为[long, lat]',
  })
  point?: Point
  /** 资源内容结束 **/

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @ApiProperty({
    description: `该${RESOURCE_DISPLAY_NAME}的持有人, 拥有对该资源的最大权限`,
  })
  @JoinColumn()
  owner: User

  @OneToMany(() => Assigner, (assigner) => assigner.resource, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @ApiPropertyOptional({
    description: `该${RESOURCE_DISPLAY_NAME}的协作者`,
  })
  @JoinTable()
  assigners: Assigner[]

  @BooleanColumn({ default: true })
  @ApiPropertyOptional({
    description: heredoc`
    该${RESOURCE_DISPLAY_NAME}是否公开，公开的${RESOURCE_DISPLAY_NAME}可以被任何人访问。

    默认为 true
    `,
    example: true,
  })
  isPublic: boolean

  @BeforeInsert()
  setId() {
    this.id = ulid()
  }
}
