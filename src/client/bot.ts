import { Client } from 'tmi.js'
import { Cooldown } from '../commands/export/cooldown.js'
import { updateCommandsInDb } from '../commands/update-db.js'
import commands from '../commands/export/export-commands.js'
import { DB } from '../db/export-repositories.js'
import { Command, Commands } from '../commands/export/types.js'
import { ApiService } from './types.js'
import jobs from '../jobs/jobs-export.js'
import { LogType } from '../logger/log-type.js'
import { customLogMessage } from '../logger/logger-export.js'
import { modules } from '../modules/export/export-modules.js'
import { PubSub } from '../modules/pubsub/pubsub.js'

export class TwitchBot {
  client: Client
  commands: Commands
  cooldown: Cooldown
  db: DB
  api: ApiService
  log: (type: LogType, ...args: any) => void
  pubSub: PubSub
  NODE_ENV: 'prod' | 'dev' | 'test'

  constructor(client: Client) {
    this.NODE_ENV = process.env.NODE_ENV
    this.log = customLogMessage
    this.client = client
    this.cooldown = new Cooldown()
    this.pubSub = new PubSub()
    this.db = new DB()
    this.commands = new Commands(commands)
    this.api = new ApiService()
  }

  async init() {
    await this.client.connect()
    await this.db.initialize()
    await this.api.init()
    this.startPubSub()
    this.log(LogType.TWITCHBOT, 'Successfully initialized')
    updateCommandsInDb()
  }

  startPubSub() {
    this.pubSub.connect()
  }

  startJobs() {
    if (process.env.NODE_ENV === 'dev') return

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

  sendMessage(channel: string, message: string) {
    this.client.say(channel, message)
  }

  getCommand(input: string): Command {
    return hb.commands.findCommand(input)
  }
}
