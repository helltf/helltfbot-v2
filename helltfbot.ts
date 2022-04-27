import 'dotenv/config'
import {  TwitchBot } from './client/bot.js'
import { mainClient } from './client/main-bot.js'
import { watchClient } from './client/track-bot.js'
import commands from './commands/export/export-commands.js'
import { AppDataSource } from './db/export-orm.js'
import { repositories } from './db/export-repositories.js'

globalThis.hb =  new TwitchBot(mainClient, watchClient)
;(async () => {
	if (process.env.NODE_ENV === 'test') return
	hb.setCommands(commands)
	hb.setRepositories(repositories)
	await AppDataSource.initialize()
	await hb.init()
	hb.joinChannels()
	hb.startJobs()
	hb.initModules()
})()
