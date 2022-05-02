import 'dotenv/config'
import { DataSource } from 'typeorm'
import { TwitchBot } from './client/bot.js'
import { mainClient } from './client/main-bot.js'
import { watchClient } from './client/track-bot.js'
import commands from './commands/export/export-commands.js'
import { DB } from './db/export-repositories.js'

globalThis.hb = new TwitchBot(mainClient, watchClient)
;(async () => {
	hb.setCommands(commands)
	hb.setRepositories(await new DB().initialize())
	await hb.init()
	console.log(await hb.db.userRepo.find())
	hb.joinChannels()
	hb.startJobs()
	hb.initModules()
})()
