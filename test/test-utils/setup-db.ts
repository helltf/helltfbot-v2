import { cache } from '@src/services/cache.service'
import { db } from '@src/db/export-repositories'

export const setupDatabase = async () => {
  await db.initialize()
  await cache.connect()
}
