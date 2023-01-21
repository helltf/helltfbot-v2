import { DB } from '@src/db/export-repositories'

export const setupDatabase = async (db: DB) => {
  await db.initialize()
}
