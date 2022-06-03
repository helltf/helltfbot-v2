import { DataSource } from 'typeorm'

const clearDb = async (dataSource: DataSource) => {
  if (process.env.NODE_ENV === 'prod') return
  await dataSource.dropDatabase()
  await dataSource.synchronize()
}

export { clearDb }
