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

process.on('uncaughtException', async (error, origin) => {
  await hb.db.errorRepo.save({
    stack_trace: error.message + error.stack,
    timestamp: Date.now()
  })
})