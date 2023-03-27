import { Column, ColumnOptions } from 'typeorm'
import { typeOrmModuleOptions } from '@/lib/data-source'
import { customAlphabet, nanoid } from 'nanoid'

export function JsonColumn(options?: ColumnOptions) {
  return function (object: object, propertyName: string) {
    const columnOptions: ColumnOptions = {
      type: typeOrmModuleOptions.type === 'sqlite' ? 'simple-json' : 'json',
      ...options,
    }
    Column(columnOptions)(object, propertyName)
  }
}

export function PointColumn(options?: ColumnOptions) {
  return function (object: object, propertyName: string) {
    const columnOptions: ColumnOptions = {
      type: typeOrmModuleOptions.type === 'sqlite' ? 'simple-json' : 'point',
      ...options,
    }
    Column(columnOptions)(object, propertyName)
  }
}

export function BooleanColumn(options?: ColumnOptions) {
  // typeorm use 'tinyint(4)' instead of 'boolean' type for mysql
  // we set to tinyint(1)
  // See also:
  // https://github.com/typeorm/typeorm/issues/3622
  // https://github.com/typeorm/typeorm/blob/0.3.12/src/driver/mysql/MysqlDriver.ts#L721
  const typeOptions: ColumnOptions =
    typeOrmModuleOptions.type === 'mysql' ? { type: 'tinyint', length: 1 } : {}
  return function (object: object, propertyName: string) {
    const columnOptions: ColumnOptions = {
      ...typeOptions,
      ...options,
    }
    Column(columnOptions)(object, propertyName)
  }
}

export class NanoIdColumnOptions implements ColumnOptions {
  length?: number
  customAlphabet?: string
}

export function PrimaryNanoIdColumn(options?: NanoIdColumnOptions) {
  return function (object: object, propertyName: string) {
    const nanoId = options?.customAlphabet
      ? customAlphabet(options.customAlphabet, options.length)
      : nanoid
    const length = options?.length ?? 10
    const columnOptions: ColumnOptions = {
      type: 'varchar',
      length,
      primary: true,
      transformer: {
        from: (value: string) => value,
        to: (value: string) => {
          if (!value) {
            return nanoId(length)
          }
          return value
        },
      },
      ...options,
    }
    return Column(columnOptions)(object, propertyName)
  }
}
