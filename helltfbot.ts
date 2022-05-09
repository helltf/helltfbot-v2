import 'dotenv/config'
import { TwitchBot } from './client/bot.js'
import { mainClient } from './client/main-bot.js'
import { watchClient } from './client/track-bot.js'

var a = 'a'
globalThis.hb = new TwitchBot(mainClient, watchClient)
;(async () => {
  await hb.init()
  hb.joinChannels()
  hb.startJobs()
  hb.initModules()
})()
