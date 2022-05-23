import 'dotenv/config'
import { TwitchBot } from './src/client/bot.js'
import { mainClient } from './src/client/main-bot.js'
import { watchClient } from './src/client/track-bot.js'

globalThis.hb = new TwitchBot(mainClient, watchClient)
;(async () => {
  await hb.init()
  hb.joinChannels()
  hb.startJobs()
  hb.initModules()
})()
