import 'dotenv/config'
import { setupDev } from './scripts/env-setup/dev';
import {LogType, logger} from '@src/logger/logger-export';
import { client } from '@src/client/main-client';
import { app } from '@src/webhook/actions'
import { config } from '@services/config.service'
import { initModules } from '@modules/export-modules'
import { initDeps } from 'deps'

{
  ;(async () => {
    await client.connect().catch((e: Error) => {
      throw new Error(`Could not connect to twitch servers: ${e}`)
    })
    logger.log(LogType.INFO, 'Client connected')

    await initDeps()

    commandsService.updateDb()

    app.listen(Number(process.env.WEBHOOK_PORT), () => {
      hb.log(
        LogType.WEBHOOK,
        `Webhook listening on port ${process.env.WEBHOOK_PORT}`
      )
    })

    if (process.env.NODE_ENV === 'dev') {
      await setupDev()
    }

    client.say(config.get('MAIN_USER')!, config.get('START_UP_MESSAGE')!)
    hb.startJobs()
    initModules()
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
