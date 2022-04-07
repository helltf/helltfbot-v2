import 'dotenv/config'
import { TwitchBot } from './client/bot.js'
import { mainClient } from './client/main-bot.js'
import { watchClient } from './client/track-bot.js'
import { loadCommands } from './commands/export/export-commands.js'
import { AppDataSource } from './db/export-orm.js'
import jobs from './jobs/jobs-export.js'
import { repositories } from './db/export-repositories.js'
import { init } from './modules/color-tracking.js'

await AppDataSource.initialize()
const hb = await new TwitchBot(mainClient, watchClient).init()
hb.setCommands(await loadCommands())
hb.setRepositories(repositories)

await hb.client.join(process.env.MAIN_USER)
await hb.watchclient.join(process.env.MAIN_USER)

startJobs()
initModules()

function startJobs() {
	if (process.env.NODE_ENV === 'dev') return

	for (let { delay, execute } of jobs) {
		execute()
		setInterval(execute, delay)
	}
}

function initModules(){
	init()
}

export { hb }
