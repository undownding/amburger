import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm'

export class BaseEntity {
  @CreateDateColumn({
    name: 'created_time',
    type: 'datetime',
    comment: '创建时间',
  })
  createdTime: string

  @UpdateDateColumn({
    name: 'updated_time',
    type: 'datetime',
    comment: '更新时间',
  })
  updatedTime: string

  @DeleteDateColumn({
    name: 'deleted_time',
    type: 'datetime',
    comment: '删除时间',
  })
  deletedTime: string
}
