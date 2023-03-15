import { ForbiddenException, Inject, Injectable } from '@nestjs/common'
import { BaseCrudService, IDType } from '@/lib/base-crud-service'
import { Resource } from './resource.entity'
import { Brackets, Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { UserService } from '@/user/user.service'
import { ResourceUpdateDto } from '@/resource/resource.dto'
import { Permissions } from '@/resource/permission.entity'

@Injectable()
export class ResourceService extends BaseCrudService<Resource> {
  // 查询 resource 时常用的表达式
  private readonly isOwner = new Brackets((qb) => {
    qb.where('owner.id = :user')
  })
  private readonly isAssigner = new Brackets((qb) => {
    qb.where('permissions.userId = :user')
  })
  private readonly isWriteableAssigner = new Brackets((qb) => {
    qb.where('permissions.userId = :userId').andWhere(
      'permissions.permission in :permissions',
      { permissions: [Permissions.MANAGE, Permissions.WRITEABLE] },
    )
  })

  constructor(
    @Inject(getRepositoryToken(Resource))
    private readonly repository: Repository<Resource>,
    private readonly userService: UserService,
  ) {
    super(repository)
  }

  private async canModify(id: IDType, userId: IDType): Promise<boolean> {
    return this.repository
      .createQueryBuilder('resource')
      .leftJoinAndSelect('resource.owner', 'owner')
      .leftJoinAndSelect('resource.permissions', 'permissions')
      .where('resource.id = :id', { id, userId })
      .andWhere((qb) =>
        qb.where(this.isOwner).orWhere(this.isWriteableAssigner),
      )
      .getCount()
      .then((count) => count > 0)
  }

  override async update(
    id: IDType,
    data: ResourceUpdateDto,
    userId?: IDType,
  ): Promise<Resource> {
    // 判断权限，没问题再调用 super

    const available = await this.canModify(id, userId)
    if (available) {
      return super.update(id, data)
    } else {
      throw new ForbiddenException('无权更改此资源')
    }
  }

  async delete(id: IDType, userId?: IDType): Promise<void> {
    // 判断权限，没问题再调用 super
    const canBeDelete = await this.canModify(id, userId)
    if (canBeDelete) {
      return super.delete(id)
    } else {
      throw new ForbiddenException('无权删除此资源')
    }
  }
}
