import { Client } from 'tmi.js'
import { Cooldown } from '../service/cooldown.service.js'
import commands from '../commands/export/export-commands.js'
import { DB } from '../db/export-repositories.js'
import jobs from '../jobs/jobs-export.js'
import { LogType } from '../logger/log-type.js'
import { customLogMessage } from '../logger/logger-export.js'
import { modules } from '../modules/export/export-modules.js'
import { PubSub } from '../modules/pubsub/pubsub.js'
import { CommandService } from '../service/commands.service.js'
import { client } from './main-client.js'
import { ConfigService } from '../service/config.service.js'
import { ApiService } from '../api/types.js'
import { Command } from '../commands/types.js'
import { GameService } from '../service/game.service.js'
import { CacheService } from '../service/cache.service.js'

export class TwitchBot {
  client: Client
  commands: CommandService
  cooldown: Cooldown
  db: DB
  api: ApiService
  pubSub: PubSub
  log: (type: LogType, ...args: any) => void
  cache: CacheService
  config: ConfigService
  games: GameService

  constructor() {
    this.config = new ConfigService()
    this.log = customLogMessage
    this.client = client
    this.cooldown = new Cooldown()
    this.pubSub = new PubSub()
    this.db = new DB()
    this.commands = new CommandService(commands)
    this.api = new ApiService()
    this.cache = new CacheService()
    this.games = new GameService()
  }

  async init() {
    await this.db.initialize()
    await this.client.connect()
    await this.api.init()
    await this.cache.connect()
    this.startPubSub()
    this.log(LogType.TWITCHBOT, 'Successfully initialized')
    this.commands.updateDb()
  }

  startPubSub() {
    this.pubSub.connect()
  }

  startJobs() {
    if (hb.config.isDev()) return

    for (const { delay, execute } of jobs) {
      execute()
      setInterval(execute, delay)
    }

    this.log(LogType.JOBS, `Successfully innitialized ${jobs.length} job(s)`)
  }

  async initModules() {
    for (const module of modules) {
      await module.initialize()
      this.log(LogType.MODULE, `${module.name} has been initialized`)
    }

    this.log(
      LogType.MODULE,
      `Successfully initialized ${modules.length} modules`
    )
  }

  sendMessage(channel?: string, message?: string) {
    if (!message || !channel) return
    this.client.say(channel, message)
  }

  getCommand(input: string): Command {
    return hb.commands.findCommand(input)
  }
}
