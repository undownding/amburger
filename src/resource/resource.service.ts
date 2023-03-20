import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { BaseCrudService, IDType } from '@/lib/base-crud-service'
import { Resource } from './resource.entity'
import { Brackets, Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { UserService } from '@/user/user.service'
import { ResourceUpdateDto } from '@/resource/resource.dto'
import { Permission, Permissions } from '@/resource/permission.entity'

@Injectable()
export class ResourceService extends BaseCrudService<Resource> {
  // 查询 resource 时常用的表达式
  private readonly isOwnerBracket = new Brackets((qb) => {
    qb.where('owner.id = :userId')
  })
  private readonly isManager = new Brackets((qb) => {
    qb.where('permissions.userId = :userId').andWhere(
      'permissions.permission = :permission',
      { permission: Permissions.MANAGE },
    )
  })
  private readonly isAssigner = new Brackets((qb) => {
    qb.where('permissions.userId = :userId')
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
    @Inject(getRepositoryToken(Permission))
    private readonly permissionRepository: Repository<Permission>,
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
        qb.where(this.isOwnerBracket).orWhere(this.isWriteableAssigner),
      )
      .getCount()
      .then((count) => count > 0)
  }

  private async isOwner(id: IDType, userId: IDType): Promise<boolean> {
    return this.repository
      .createQueryBuilder('resource')
      .leftJoinAndSelect('resource.owner', 'owner')
      .leftJoinAndSelect('resource.permissions', 'permissions')
      .where('resource.id = :id', { id, userId })
      .andWhere(this.isOwnerBracket)
      .getCount()
      .then((count) => count > 0)
  }

  private async isOwnerOrManager(id: IDType, userId: IDType): Promise<boolean> {
    return this.repository
      .createQueryBuilder('resource')
      .leftJoinAndSelect('resource.owner', 'owner')
      .leftJoinAndSelect('resource.permissions', 'permissions')
      .where('resource.id = :id', { id, userId })
      .andWhere((qb) => qb.where(this.isOwnerBracket).orWhere(this.isManager))
      .getCount()
      .then((count) => count > 0)
  }

  override async getById(id: IDType): Promise<Resource> {
    return this.repository
      .createQueryBuilder('resource')
      .where('resource.id = :id', { id })
      .leftJoinAndSelect('resource.owner', 'owner')
      .leftJoinAndSelect('resource.permissions', 'permissions')
      .leftJoinAndSelect('resource.assigners', 'assigners')
      .getOne()
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
  ): Promise<Permission[]> {
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
    await this.permissionRepository.save(
      this.permissionRepository.create({
        permission,
        user,
        userId: user.id,
        resource,
        resourceId: resource.id,
      }),
    )
    resource.assigners.push(user)
    await this.repository.save(resource)
    return this.permissionRepository.find({ where: { resourceId: id } })
  }

  async removeAssigner(
    id: IDType,
    operatorId: IDType,
    userId: IDType,
  ): Promise<Permission[]> {
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
    await this.permissionRepository.delete({
      userId,
      resourceId: resource.id,
    })
    resource.assigners = resource.assigners.filter((u) => u.id !== userId)
    await this.repository.save(resource)
    return this.permissionRepository.find({ where: { resourceId: id } })
  }

  async updateAssigner(
    id: IDType,
    operatorId: IDType,
    userId: IDType,
    permission: Permissions,
  ): Promise<Permission[]> {
    const resource = await this.getById(id)
    if (!resource) {
      throw new NotFoundException('资源未找到')
    }
    if (resource.owner.id === userId) {
      throw new BadRequestException('不能修改资源的所有者')
    }
    const canBeUpdate = await (permission === Permissions.MANAGE
      ? this.isOwner(id, userId)
      : this.isOwnerOrManager(id, operatorId))
    if (!canBeUpdate) {
      throw new ForbiddenException('无权执行此操作')
    }
    await this.permissionRepository.update(
      { userId, resourceId: resource.id },
      { permission },
    )
    return this.permissionRepository.find({ where: { resourceId: id } })
  }
}
