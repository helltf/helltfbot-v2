import 'dotenv/config'
import { TwitchBot } from './client/bot.js'
import { mainClient } from './client/main-bot.js'
import { watchClient } from './client/track-bot.js'
import { loadCommands } from './commands/export/export-commands.js'
import jobs from './jobs/jobs-export.js'

const hb = await new TwitchBot(mainClient, watchClient).init()
hb.setCommands(await loadCommands())

hb.client.join('helltf')

startJobs()

function startJobs() {
	if (process.env.NODE_ENV === 'dev') return

	for (let {delay, execute} of jobs){
		execute()
		setInterval(execute, delay)
	}

}

export { hb }
