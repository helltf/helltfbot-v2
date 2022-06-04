import { DataSource } from 'typeorm'

export const clearDb = async (dataSource: DataSource) => {
  if (process.env.NODE_ENV === 'prod') return
  await dataSource.dropDatabase()
  await dataSource.synchronize()
}

export const clearRedis = async () => {
  await hb.cache.flushAll()
}
