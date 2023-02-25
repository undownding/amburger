// Require the following line for paths mapping in tsconfig.json to work
import 'tsconfig-paths/register'
import { DataSource } from 'typeorm'
import { createDataSourceOptions } from '@/lib/data-source'

export default async function initializeDatabase() {
  const options = createDataSourceOptions()

  const dataSource = new DataSource(options)
  await dataSource.initialize()
  await dataSource.synchronize()
}
