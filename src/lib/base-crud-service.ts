import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm'
import { DeepPartial } from 'typeorm/common/DeepPartial'
import { BaseEntity } from '@/lib/base-entity'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsInt, IsOptional, Min } from 'class-validator'

export type IDType = number | string

export interface Paged<T> {
  count: number
  data: T[]
}

export class PagedDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  page = 1

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  limit = 20

  get skip(): number {
    return (this.page - 1) * this.limit
  }
}

export class BaseCrudService<T extends BaseEntity> {
  private baseRepository: Repository<T>

  protected constructor(repository: Repository<T>) {
    this.baseRepository = repository
  }

  public async getById(id: IDType): Promise<T> {
    return this.baseRepository.findOneById(id)
  }

  public async listByIds(ids: IDType[]): Promise<T[]> {
    return this.baseRepository.findByIds(ids)
  }

  public async findOne(options?: FindOneOptions): Promise<T> {
    return this.baseRepository.findOne(options)
  }

  public async findAll(): Promise<T[]> {
    return this.baseRepository.find()
  }

  public async exists(options?: FindManyOptions): Promise<boolean> {
    return this.baseRepository.exist(options)
  }

  public async create(data: DeepPartial<T>): Promise<T> {
    return this.baseRepository.save(this.baseRepository.create(data))
  }

  public async search(
    where: FindOptionsWhere<T>,
    skip = 0,
    limit = 20,
  ): Promise<Paged<T>> {
    return this.baseRepository
      .findAndCount({ where, skip, take: limit })
      .then(([data, count]) => ({ data, count }))
  }

  public async update(id: IDType, data: object): Promise<T> {
    return this.baseRepository
      .update(id, data)
      .then((response) => response.raw[0])
  }

  public async count(where?: FindManyOptions<T>): Promise<number> {
    return this.baseRepository.count(where)
  }

  public async delete(criteria: FindOptionsWhere<T> | IDType): Promise<void> {
    await this.baseRepository.delete(criteria)
  }

  public async softDelete(
    criteria: FindOptionsWhere<T> | IDType,
  ): Promise<void> {
    await this.baseRepository.softDelete(criteria)
  }
}
