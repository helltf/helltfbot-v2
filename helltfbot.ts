import 'dotenv/config'
import { setupDev } from './scripts/env-setup/dev';
import { TwitchBot } from './src/client/bot'

globalThis.hb = new TwitchBot()
{
  ;(async () => {
    await hb.init()

    if (hb.config.isDev()) {
      await setupDev()
    }

    hb.startJobs()
    hb.initModules()
  })()
}

process.on('uncaughtException', async error => {
  await hb.db.errorRepo.save({
    message: error.message,
    stack_trace: error.stack,
    timestamp: Date.now()
  })
  console.error(error)

  process.exit(1)
})

