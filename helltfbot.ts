import 'dotenv/config'
import { TwitchBot } from './src/client/bot.js'
import { client } from './src/client/main-bot.js'

globalThis.hb = new TwitchBot(client)
;(async () => {
  await hb.init()
  hb.startJobs()
  hb.initModules()
})()
