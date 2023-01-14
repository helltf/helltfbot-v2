import {Cooldown} from './src/services/cooldown.service'
import {DB} from './src/db/export-repositories'
import jobs from './src/jobs/jobs-export'
import { logger, LogType } from '@src/logger/logger-export'
import { PubSub } from './src/modules/pubsub/pubsub'
import { CommandService } from './src/services/commands.service'
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
  commands: CommandService
  cooldown: Cooldown
  db: DB
  api: ApiService
  pubSub: PubSub
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
    logger.log(LogType.INFO, 'DB connected')
    await this.client.connect().catch((e: Error) => {
      throw new Error(`Could not connect to twitch servers: ${e}`)
    })
    logger.log(LogType.INFO, 'Client connected')
    await this.api.init()
    await this.cache.connect()
    this.startPubSub()
    logger.log(LogType.TWITCHBOT, 'Successfully initialized')
    this.commands.updateDb()

    const port = process.env.WEBHOOK_PORT
    this.webhook.listen(Number(port), () => {
      logger.log(LogType.WEBHOOK, `Webhook listening on port ${port}`)
    })

    const startUpMessage = this.config.get('STARTUP_MESSAGE')

    this.sendMessage(this.config.get('MAIN_USER'), startUpMessage)
  }

  startPubSub() {
    this.pubSub.connect()
  }

  startJobs() {
    if (this.config.isDev()) return

    for (const { delay, execute } of jobs) {
      execute()
      setInterval(execute, delay)
    }

    logger.log(LogType.JOBS, `Successfully innitialized ${jobs.length} job(s)`)
  }

  async initModules() {
    for (const module of modules) {
      await module.initialize()
      logger.log(LogType.MODULE, `${module.name} has been initialized`)
    }

    logger.log(
      LogType.MODULE,
      `Successfully initialized ${modules.length} modules`
    )
  }

  async sendMessage(channel?: string, message?: string) {
    if (!message || !channel) return
    await this.client.say(channel, message)
  }

  getCommand(input: string): BaseCommand {
    return this.commands.findCommand(input.toLowerCase())
  }
}
