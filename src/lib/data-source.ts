import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import * as dotenv from 'dotenv'
import * as process from 'process'

import { AmburgerApi } from './rootdir'
import { DataSourceOptions } from 'typeorm'

export function createDataSourceOptions(): DataSourceOptions {
  dotenv.config({ path: '.env' })
  switch (process.env.NODE_ENV) {
    case 'production':
      return {
        type: 'mysql',
        database: process.env.MYSQL_DATABASE,
        host: process.env.MYSQL_HOST,
        port: parseInt(process.env.MYSQL_PORT),
        username: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        migrations: [AmburgerApi.root.join('src/migration/*.entity.ts')],
      }
    case 'test':
      return {
        type: 'sqlite',
        database: ':memory:',
        synchronize: true,
        logging: false,
        migrations: [AmburgerApi.root.join('src/migration/*.entity.ts')],
      }
    default:
      return {
        type: 'sqlite',
        database: 'dev.sqlite',
        synchronize: true,
        logging: true,
        migrations: [AmburgerApi.root.join('src/migration/*.entity.ts')],
      }
  }
}

export const typeOrmModuleOptions: TypeOrmModuleOptions = {
  ...createDataSourceOptions(),
  autoLoadEntities: true,
}
