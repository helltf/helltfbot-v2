import 'dotenv/config'
import { setupDev } from './scripts/env-setup/dev';
import {LogType, logger} from '@src/logger/logger-export';
import { client } from '@src/client/main-client';
import { db } from '@src/db/export-repositories'
import { api } from '@src/services/api.service'
import { cache } from '@services/cache.service'

{
  ;(async () => {
    logger.log(LogType.INFO, 'Initializing...')

    await db.initialize()
    logger.log(LogType.INFO, 'DB connected')

    await client.client.connect().catch((e: Error) => {
      throw new Error(`Could not connect to twitch servers: ${e}`)
    })

    logger.log(LogType.INFO, 'Client connected')

    await api.init()
    await cache.connect()

    if (hb.config.isDev()) {
      await setupDev()
    }

    hb.startJobs()
    hb.initModules()
  })()
}

process.on('uncaughtException', async error => {
  const dbIsAlive = hb.db.dataSource.isInitialized
  if (dbIsAlive) {
    await hb.db.error.save({
      message: error.message,
      stack_trace: error.stack,
      timestamp: Date.now()
    })
  }
  console.error(error)

  process.exit(1)
})
