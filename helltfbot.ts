import 'dotenv/config'
import { getData } from './jobs/github-pipeline.js'
import { TwitchBot } from './client/bot.js'
import { mainClient } from './client/main-bot.js'
import { watchClient } from './client/track-bot.js'

const hb = new TwitchBot(mainClient, watchClient)


getData()
setInterval(getData, 60000)

export{ hb }