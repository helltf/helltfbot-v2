import 'dotenv/config'
import { TwitchBot } from './client/bot.js'
import { mainClient } from './client/main-bot.js'
import { watchClient } from './client/track-bot.js'
import commands from './commands/export/export-commands.js'
import { AppDataSource } from './db/export-orm.js'
import { repositories } from './db/export-repositories.js'


const hb = new TwitchBot(mainClient, watchClient)
hb.setCommands(commands)
hb.setRepositories(repositories);

(async() => {
	if(process.env.NODE_ENV === 'test') return;
	await AppDataSource.initialize()
	await hb.init()
	hb.joinChannels()
	hb.startJobs()
	hb.initModules()
})()


export { hb }
