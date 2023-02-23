// Require the following line for paths mapping in tsconfig.json to work
import 'tsconfig-paths/register'
import { DataSource } from 'typeorm'
import { createDataSourceOptions } from '@/lib/data-source'

export default async function initializeDatabase() {
  // step 1.connect to default database
  // step 2.drop test database if exists
  // step 3.create database for test
  const options = createDataSourceOptions()
  const defaultConnection = new DataSource({
    type: 'postgres',
    ...options,
    database: 'postgres',
  })
  await defaultConnection.initialize()
  await defaultConnection.query(
    `DROP DATABASE IF EXISTS ${options.database} WITH (FORCE)`,
  )
  await defaultConnection.query(`CREATE DATABASE ${options.database}`)
  await defaultConnection.destroy()
  const dataSource = new DataSource(options)
  await dataSource.initialize()
  await dataSource.synchronize()
}
