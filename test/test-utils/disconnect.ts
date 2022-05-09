export const disconnectDatabase = async () => {
  await hb.db.dataSource.destroy()
}
