import 'dotenv/config'
import { setupDev } from './scripts/env-setup/dev';
import {LogType, logger} from '@src/logger/logger-export';
import { client } from '@src/client/main-client';
import { app } from '@src/webhook/actions'
import { initModules } from '@modules/export-modules'
import { getDeps, initDeps } from 'deps'
import { initServices } from '@src/client/handlers/chat'
import { startJobs } from '@src/jobs/jobs-export'

{
  ;(async () => {
    await initDeps()
    await initServices()

    await client.connect().catch((e: Error) => {
      throw new Error(`Could not connect to twitch servers: ${e}`)
    })

    logger.log(LogType.INFO, 'Client connected')

    app.listen(Number(process.env.WEBHOOK_PORT), () => {
      logger.log(
        LogType.WEBHOOK,
        `Webhook listening on port ${process.env.WEBHOOK_PORT}`
      )
    })

    if (process.env.NODE_ENV === 'dev') {
      await setupDev()
    }

    await sendStartUpMessage(process.env.MAIN_USER, process.env.STARTUP_MESSAGE)
    await startJobs()
    await initModules()
  })()
}

async function sendStartUpMessage(channel?: string, message?: string) {
  if (!channel || !message) return
  await client.say(channel, message)
}

process.on('uncaughtException', async error => {
  const { db } = getDeps()
  const dbIsAlive = db.dataSource.isInitialized
  if (dbIsAlive) {
    await db.error.save({
      message: error.message,
      stack_trace: error.stack,
      timestamp: Date.now()
    })
  }
  console.error(error)

  process.exit(1)
})
