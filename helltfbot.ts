import 'dotenv/config'
import { updateGithubPipeline } from './jobs/github-pipeline.js'
import { TwitchBot } from './client/bot.js'
import { mainClient } from './client/main-bot.js'
import { watchClient } from './client/track-bot.js'
import { loadCommands } from './commands/export/export-commands.js'
import { dbClient } from './database/database-init.js'

const hb = await new TwitchBot(mainClient, watchClient, dbClient).init()
hb.setCommands(await loadCommands())

hb.client.join('helltf')

updateGithubPipeline()

startJobs()

function startJobs() {
	if (process.env.NODE_ENV === 'dev') return

	setInterval(updateGithubPipeline, 60000)
}

export { hb }
