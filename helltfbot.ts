import 'dotenv/config'
import { setupDev } from './scripts/env-setup/dev.js';
import { TwitchBot } from './src/client/bot.js'
import { clearDb } from './test/test-utils/clear.js';

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
