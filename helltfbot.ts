import 'dotenv/config'
import { updateGithubPipeline } from './jobs/github-pipeline.js'
import { TwitchBot } from './client/bot.js'
import { mainClient } from './client/main-bot.js'
import { watchClient } from './client/track-bot.js'

const hb = await new TwitchBot(mainClient, watchClient).init()

updateGithubPipeline()

setInterval(updateGithubPipeline, 60000)

export { hb }
