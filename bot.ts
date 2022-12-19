import {Client} from 'tmi.js'
import {Cooldown} from './src/services/cooldown.service'
import {DB} from './src/db/export-repositories'
import jobs from './src/jobs/jobs-export'
import { customLogMessage, LogType } from '@src/logger/logger-export'
import { PubSub } from './src/modules/pubsub/pubsub'
import { CommandService } from './src/services/commands.service'
import { client } from './src/client/main-client'
import { ConfigService } from './src/services/config.service'
import { GameService } from './src/services/game.service'
import { CacheService } from './src/services/cache.service'
import { Utility } from '@src/utilities/utility'
import commands from '@src/commands/export-commands'
import { ApiService } from '@src/services/api.service'
import { modules } from '@modules/export-modules'
import { app } from '@src/webhook/actions'
import { Express } from 'express'
import { ReminderService } from '@src/services/reminder.service'
import { BaseCommand } from '@src/commands/base'

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
  webhook: Express
  debug: boolean
  reminder: ReminderService

  constructor() {
    this.debug = process.env.DEBUG === 'true'
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
    this.reminder = new ReminderService()
    this.webhook = app
  }

  async init() {
    await this.db.initialize()
    this.log(LogType.INFO, 'DB connected')
    await this.client.connect().catch(e => {
      throw new Error(`Could not connect to twitch servers: ${e}`)
    })
    this.log(LogType.INFO, 'Client connected')
    await this.api.init()
    await this.cache.connect()
    this.startPubSub()
    this.log(LogType.TWITCHBOT, 'Successfully initialized')
    this.commands.updateDb()

    const port = process.env.WEBHOOK_PORT
    this.webhook.listen(Number(port), () => {
      hb.log(LogType.WEBHOOK, `Webhook listening on port ${port}`)
    })

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

  getCommand(input: string): BaseCommand {
    return hb.commands.findCommand(input.toLowerCase())
  }
}
