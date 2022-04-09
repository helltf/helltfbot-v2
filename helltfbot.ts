import 'dotenv/config'
import { TwitchBot } from './client/bot.js'
import { mainClient } from './client/main-bot.js'
import { watchClient } from './client/track-bot.js'
import commands from './commands/export/export-commands.js'
import { AppDataSource } from './db/export-orm.js'
import { repositories } from './db/export-repositories.js'


await AppDataSource.initialize()
const hb = await new TwitchBot(mainClient, watchClient).init()

hb.setCommands(commands)
hb.setRepositories(repositories)
hb.joinChannels()
hb.startJobs()
hb.initModules()

export { hb }
