export const disconnectDatabase = async () => {
  await hb.db.dataSource.destroy()
}

export const disconnectRedis = async () => {
  await hb.cache.redis.disconnect()
}
