import { DB } from "@src/db/export-repositories"

export const disconnectDatabase = async (db: DB) => {
  await db.dataSource.destroy()
}

export const disconnectRedis = async () => {
  // await cache.redis.disconnect()
}
