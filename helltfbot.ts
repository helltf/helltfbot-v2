import 'dotenv/config'
import { TwitchBot } from './src/client/bot.js'

globalThis.hb = new TwitchBot();
{
  ;(async () => {
    await hb.init()
    hb.startJobs()
    hb.initModules()
  })()
}
