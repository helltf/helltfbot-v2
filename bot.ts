import { Client } from 'tmi.js'
import { Cooldown } from './src/service/cooldown.service'
import { DB } from './src/db/export-repositories'
import jobs from './src/jobs/jobs-export'
import { LogType } from './src/logger/log-type'
import { customLogMessage } from './src/logger/logger-export'
import { modules } from './src/modules/export/export-modules'
import { PubSub } from './src/modules/pubsub/pubsub'
import { CommandService } from './src/service/commands.service'
import { client } from './src/client/main-client'
import { ConfigService } from './src/service/config.service'
import { Command } from './src/commands/types'
import { GameService } from './src/service/game.service'
import { CacheService } from './src/service/cache.service'
import { Utility } from '@src/utilities/utility'
import commands from '@src/commands/export-commands'
import { ApiService } from '@src/service/api.service'

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
  utils: Utility

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
    this.utils = new Utility()
  }

  async init() {
    await this.db.initialize()
    await this.client.connect()
    await this.api.init()
    await this.cache.connect()
    this.startPubSub()
    this.log(LogType.TWITCHBOT, 'Successfully initialized')
    this.commands.updateDb()

    const startUpMessage = hb.config.get('START_UP_MESSAGE')

    hb.sendMessage(hb.config.get('MAIN_USER'), startUpMessage)
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

  async sendMessage(channel?: string, message?: string) {
    if (!message || !channel) return
    await this.client.say(channel, message)
  }

  getCommand(input: string): Command {
    return hb.commands.findCommand(input.toLowerCase())
  }
}
