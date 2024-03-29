import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { BaseCrudService, IDType } from '@/lib/base-crud-service'
import { Resource } from './resource.entity'
import { Brackets, In, Repository } from 'typeorm'
import { UserService } from '@/user/user.service'
import {
  ResourceSearchQuery,
  ResourceSearchResDto,
  ResourceUpdateDto,
} from '@/resource/resource.dto'
import { Permissions } from './assigner/permission.enum'
import { InjectRepository } from '@nestjs/typeorm'
import { AssignerService } from '@/resource/assigner/assigner.service'
import { Assigner } from '@/resource/assigner/assigner.enitity'

@Injectable()
export class ResourceService extends BaseCrudService<Resource> {
  // 查询 resource 时常用的表达式
  private readonly isOwnerBracket = new Brackets((qb) => {
    qb.where('owner.id = :userId')
  })
  private readonly isManager = new Brackets((qb) => {
    qb.where('assigners.userId = :userId').andWhere(
      'assigners.permission = :permission',
      { permission: Permissions.MANAGE },
    )
  })
  private readonly isAssigner = new Brackets((qb) => {
    qb.where('assigners.user.id = :userId')
  })
  private readonly isWriteableAssigner = new Brackets((qb) => {
    qb.where('assigners.user.id = :userId').andWhere(
      'assigners.permission in (:...permissions)',
      { permissions: [Permissions.MANAGE, Permissions.WRITEABLE] },
    )
  })
  private readonly isPublic = new Brackets((qb) => {
    qb.where('resource.isPublic = true')
  })

  constructor(
    @InjectRepository(Resource)
    private readonly repository: Repository<Resource>,
    private readonly assignerService: AssignerService,
    private readonly userService: UserService,
  ) {
    super(repository)
  }

  async create(data: Partial<Resource>, ownerId?: string): Promise<Resource> {
    const user = await this.userService.getById(ownerId)

    const resource = this.repository.create(data)
    resource.owner = user
    await this.repository.save(resource as Resource)
    return resource
  }

  override async getById(id: IDType, operatorId?: IDType): Promise<Resource> {
    const queryBuilder = this.repository
      .createQueryBuilder('resource')
      .where('resource.id = :id', { id, userId: operatorId })
      .leftJoinAndSelect('resource.owner', 'owner')
      .leftJoinAndSelect('resource.assigners', 'assigners')
      .leftJoinAndSelect('assigners.user', 'user')

    queryBuilder.andWhere(
      operatorId
        ? new Brackets((qb) => {
            qb.where(this.isOwnerBracket)
              .orWhere(this.isAssigner)
              .orWhere(this.isPublic)
          })
        : this.isPublic,
    )

    return queryBuilder.getOne()
  }

  override async update(
    id: IDType,
    data: ResourceUpdateDto,
    userId?: IDType,
  ): Promise<Resource> {
    // 判断权限，没问题再调用 super
    const available = await this.isOwner(id, userId)
    if (available) {
      await super.update(id, data)
      return this.getById(id, userId)
    } else {
      throw new ForbiddenException('无权更改此资源')
    }
  }

  async delete(id: IDType, userId?: IDType): Promise<void> {
    // 判断权限，没问题再调用 super
    const canBeDelete = await this.isOwner(id, userId)
    if (canBeDelete) {
      return super.delete(id)
    } else {
      throw new ForbiddenException('无权删除此资源')
    }
  }

  async addAssigner(
    id: IDType,
    operatorId: IDType,
    userId: IDType,
    permission: Permissions,
  ): Promise<Assigner[]> {
    const canBeInvite = await (permission === Permissions.MANAGE
      ? this.isOwner(id, operatorId)
      : this.isOwnerOrManager(id, operatorId))
    if (!canBeInvite) {
      throw new ForbiddenException('没有邀请的权限')
    }
    const [resource, user] = await Promise.all([
      this.getById(id),
      this.userService.getById(userId),
    ])
    if (!resource) {
      throw new NotFoundException('资源未找到')
    }
    if (!user) {
      throw new BadRequestException('请提供正确的用户 ID')
    }
    if (resource.assigners.map((u) => u.id).includes(userId)) {
      throw new BadRequestException('用户已经是资源的协作者')
    }
    const assigner = await this.assignerService.create({
      permission,
      user,
      resource,
    })
    resource.assigners.push(assigner)
    await this.repository.save(resource)
    return this.assignerService.find({ where: { resourceId: id } })
  }

  async removeAssigner(
    id: IDType,
    operatorId: IDType,
    userId: IDType,
  ): Promise<Assigner[]> {
    const resource = await this.getById(id)
    if (!resource) {
      throw new NotFoundException('资源未找到')
    }
    if (resource.owner.id === userId) {
      throw new BadRequestException('不能移除资源的所有者')
    }
    const canBeRemove = await this.isOwnerOrManager(id, operatorId)
    if (!canBeRemove || operatorId !== userId) {
      throw new ForbiddenException('无权执行此操作')
    }
    await this.assignerService.delete({
      user: { id: userId },
      resource: { id: resource.id },
    })
    resource.assigners = resource.assigners.filter((u) => u.id !== userId)
    await this.repository.save(resource)
    return this.assignerService.find({ where: { resourceId: id } })
  }

  async updateAssigner(
    resourceId: IDType,
    operatorId: IDType,
    userId: IDType,
    permission: Permissions,
  ): Promise<Assigner[]> {
    const resource = await this.getById(resourceId)
    if (!resource) {
      throw new NotFoundException('资源未找到')
    }
    if (resource.owner.id === userId) {
      throw new BadRequestException('不能修改资源的所有者')
    }
    const canBeUpdate = await (permission === Permissions.MANAGE
      ? this.isOwner(resourceId, userId)
      : this.isOwnerOrManager(resourceId, operatorId))
    if (!canBeUpdate) {
      throw new ForbiddenException('无权执行此操作')
    }
    await this.assignerService.update(
      { user: { id: userId }, resource: { id: resource.id } },
      { permission },
    )
    return this.assignerService.find({
      where: { resource: { id: resourceId } },
    })
  }

  async getByUser(
    query: ResourceSearchQuery,
    userId: IDType,
    operatorId: IDType,
  ): Promise<ResourceSearchResDto> {
    const { skip, limit } = query

    let ownerBrackets: Brackets

    if (query.isOwner && query.isAssigner) {
      ownerBrackets = new Brackets((qb) => {
        qb.where(this.isOwnerBracket).orWhere(this.isAssigner)
      })
    } else if (query.isOwner && query.isAssigner !== true) {
      ownerBrackets = this.isOwnerBracket
    } else if (query.isAssigner && query.isOwner !== true) {
      ownerBrackets = this.isAssigner
    } else {
      // 两个参数都没传，默认行为两个都查
      ownerBrackets = new Brackets((qb) => {
        qb.where(this.isOwnerBracket).orWhere(this.isAssigner)
      })
    }

    const operatorBrackets: Brackets = operatorId
      ? new Brackets((qb) =>
          qb
            .where(this.isPublic)
            .orWhere(new Brackets((qb) => qb.where('owner.id = :operatorId')))
            .orWhere(
              new Brackets((qb) => qb.where('assigners.user.id = :operatorId')),
            ),
        )
      : new Brackets((qb) => qb.where(this.isPublic))

    return this.repository
      .createQueryBuilder('resource')
      .leftJoinAndSelect('resource.owner', 'owner')
      .leftJoinAndSelect('resource.assigners', 'assigners')
      .leftJoinAndSelect('assigners.user', 'user')
      .where(ownerBrackets, { userId, operatorId })
      .orWhere(operatorBrackets)
      .skip(skip)
      .limit(limit)
      .getManyAndCount()
      .then(([data, count]) => ({
        count,
        data,
      }))
  }

  private async canModify(id: IDType, userId: IDType): Promise<boolean> {
    return this.repository
      .count({
        where: [
          {
            id,
            owner: { id: userId },
          },
          {
            id,
            assigners: {
              user: { id: userId },
              permission: In([Permissions.MANAGE, Permissions.WRITEABLE]),
            },
          },
        ],
      })
      .then((count) => count > 0)
  }

  private async isOwner(id: IDType, userId: IDType): Promise<boolean> {
    return this.repository
      .createQueryBuilder('resource')
      .leftJoinAndSelect('resource.owner', 'owner')
      .leftJoinAndSelect('resource.assigners', 'assigners')
      .leftJoinAndSelect('assigners.user', 'user')
      .where('resource.id = :id', { id, userId })
      .andWhere(this.isOwnerBracket)
      .getCount()
      .then((count) => count > 0)
  }

  private async isOwnerOrManager(id: IDType, userId: IDType): Promise<boolean> {
    return this.repository
      .createQueryBuilder('resource')
      .leftJoinAndSelect('resource.owner', 'owner')
      .leftJoinAndSelect('resource.assigners', 'assigners')
      .leftJoinAndSelect('assigners.user', 'user')
      .where('resource.id = :id', { id, userId })
      .andWhere((qb) => qb.where(this.isOwnerBracket).orWhere(this.isManager))
      .getCount()
      .then((count) => count > 0)
  }
}
