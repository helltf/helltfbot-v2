import 'dotenv/config'
import { setupDev } from './scripts/env-setup/dev';
import { TwitchBot } from './bot'
import {LogType} from '@src/logger/logger-export';

globalThis.hb = new TwitchBot()

{
  ;(async () => {
    hb.log(LogType.INFO, 'Initializing...')
    await hb.init()

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
