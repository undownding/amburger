import { Column, ColumnOptions } from 'typeorm'
import { typeOrmModuleOptions } from '@/lib/data-source'

export function JsonColumn(options?: ColumnOptions) {
  return function (object: object, propertyName: string) {
    const columnOptions: ColumnOptions = {
      type: typeOrmModuleOptions.type === 'sqlite' ? 'simple-json' : 'json',
      ...options,
    }
    Column(columnOptions)(object, propertyName)
  }
}
