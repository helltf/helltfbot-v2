import 'dotenv/config'
import { TwitchBot } from './src/client/bot.js'
import { mainClient } from './src/client/main-bot.js'

globalThis.hb = new TwitchBot(mainClient)
;(async () => {
  await hb.init()
  hb.joinChannels()
  hb.startJobs()
  hb.initModules()
})()
