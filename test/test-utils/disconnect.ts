import { db } from "@src/db/export-repositories"
import { cache } from "@src/services/cache.service"

export const disconnectDatabase = async () => {
  await db.dataSource.destroy()
}

export const disconnectRedis = async () => {
  await cache.redis.disconnect()
}
