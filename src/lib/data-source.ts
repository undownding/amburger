import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import * as dotenv from 'dotenv'
import * as process from 'process'

import { AmburgerApi } from './rootdir'
import { DataSourceOptions } from 'typeorm'

export function createDataSourceOptions(): DataSourceOptions {
  dotenv.config({ path: '.env' })
  const defaultOptions: DataSourceOptions = {
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT),
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    migrations: [AmburgerApi.root.join('src/migration/*.entity.ts')],
  }
  switch (process.env.NODE_ENV) {
    case 'production':
      return {
        ...defaultOptions,
        database: process.env.MYSQL_DATABASE,
        synchronize: false,
        logging: false,
        migrations: [AmburgerApi.root.join('dist/migration/*.entity.js')],
      }
    case 'test':
      return {
        type: 'sqlite',
        database: ':memory:',
        synchronize: true,
        logging: false,
      }
    default:
      return {
        ...defaultOptions,
        database: 'nexus_development',
        synchronize: true,
        logging: true,
      }
  }
}

export const typeOrmModuleOptions: TypeOrmModuleOptions = {
  ...createDataSourceOptions(),
  autoLoadEntities: true,
}
