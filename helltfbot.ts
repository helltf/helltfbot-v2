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
