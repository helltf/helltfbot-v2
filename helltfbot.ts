import 'dotenv/config'
import { updateGithubPipeline } from './jobs/github-pipeline.js'
import { TwitchBot } from './client/bot.js'
import { mainClient } from './client/main-bot.js'
import { watchClient } from './client/track-bot.js'

const hb = new TwitchBot(mainClient, watchClient)


updateGithubPipeline()
setInterval(updateGithubPipeline, 10000)
export{ hb }