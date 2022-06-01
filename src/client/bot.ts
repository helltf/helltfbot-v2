import { Client } from 'tmi.js'
import { Cooldown } from '../commands/export/cooldown.js'
import commands from '../commands/export/export-commands.js'
import { DB } from '../db/export-repositories.js'
import { Command } from '../commands/export/types.js'
import { ApiService } from './types.js'
import jobs from '../jobs/jobs-export.js'
import { LogType } from '../logger/log-type.js'
import { customLogMessage } from '../logger/logger-export.js'
import { modules } from '../modules/export/export-modules.js'
import { PubSub } from '../modules/pubsub/pubsub.js'
import { CommandService } from '../commands/export/commands-service.js'
import { createClient, RedisClientType } from 'redis'
import { ConfigService } from '../service/config.service.js'
import { client } from './main-client.js'

export class TwitchBot {
  client: Client
  commands: CommandService
  cooldown: Cooldown
  db: DB
  api: ApiService
  pubSub: PubSub
  log: (type: LogType, ...args: any) => void
  cache: RedisClientType
  config: ConfigService

  constructor() {
    this.config = new ConfigService()
    this.log = customLogMessage
    this.client = client
    this.cooldown = new Cooldown()
    this.pubSub = new PubSub()
    this.db = new DB()
    this.commands = new CommandService(commands)
    this.api = new ApiService()
    this.cache = createClient({
      url: process.env.REDIS_URL
    })
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

    this.log(LogType.JOBS, `${jobs.length} have been initialized`)
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
