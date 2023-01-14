import 'dotenv/config'
import { setupDev } from './scripts/env-setup/dev';
import {LogType, logger} from '@src/logger/logger-export';
import { client } from '@src/client/main-client';
import { db } from '@src/db/export-repositories'
import { api } from '@src/services/api.service'
import { cache } from '@services/cache.service'
import { pubsub } from '@modules/pubsub/pubsub'
import { commandsService } from '@services/commands.service'
import { app } from '@src/webhook/actions'

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
    pubsub.connect()
    logger.log(LogType.TWITCHBOT, 'Successfully initialized')

    commandsService.updateDb()

    app.listen(Number(process.env.WEBHOOK_PORT), () => {
      hb.log(
        LogType.WEBHOOK,
        `Webhook listening on port ${process.env.WEBHOOK_PORT}`
      )
    })

    if (hb.config.isDev()) {
      await setupDev()
    }

    const startUpMessage = config.get('START_UP_MESSAGE')
    hb.sendMessage(config.get('MAIN_USER'), startUpMessage)
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
