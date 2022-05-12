import { customLogMessage } from '../logger/logger-export.js'
import { Client } from 'tmi.js'
import { Command } from '../commands/export/types'
import { Cooldown } from '../commands/export/cooldown.js'
import jobs from '../jobs/jobs-export.js'
import { mainJoinAllChannels } from './mainhandlers/join.js'
import { updateCommandsInDb } from '../commands/update-db.js'
import { modules } from '../modules/export/export-modules.js'
import { generateToken } from '../api/twitch/token.js'
import { LogType } from '../logger/log-type.js'
import { PubSub } from '../modules/pubsub/pubsub.js'
import { watchJoinAllChannels } from './watchhandlers/join.js'
import commands from '../commands/export/export-commands.js'
import { DB } from '../db/export-repositories.js'

export class TwitchBot {
  client: Client
  watchclient: Client
  commands: Commands
  cooldown: Cooldown
  db: DB
  twitchAT: string
  log: (type: LogType, ...args: any) => void
  pubSub: PubSub
  NODE_ENV: 'prod' | 'dev' | 'test'

  constructor(client: Client, watchclient: Client) {
    this.NODE_ENV = process.env.NODE_ENV
    this.log = customLogMessage
    this.client = client
    this.watchclient = watchclient
    this.cooldown = new Cooldown()
    this.pubSub = new PubSub()
    this.db = new DB()
    this.commands = new Commands(commands)
  }

  async init() {
    this.twitchAT = await generateToken()
    await this.client.connect()
    await this.watchclient.connect()
    await this.db.initialize()
    this.startPubSub()
    this.log(LogType.TWITCHBOT, 'Successfully initialize ')
    updateCommandsInDb()
  }

  startPubSub() {
    if (hb.NODE_ENV === 'dev') return
    this.pubSub.connect()
  }

  async joinChannels() {
    watchJoinAllChannels()
    await mainJoinAllChannels()
    const startUpMessage = process.env.START_UP_MESSAGE
    if (!startUpMessage) return
    hb.sendMessage(process.env.MAIN_USER, startUpMessage)
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

class Commands {
  commands: { activate: string[]; command: Command }[] = []

  constructor(commands: Command[]) {
    for (const command of commands) {
      this.commands.push({
        activate: [command.name, ...command.alias],
        command: command
      })
    }
  }

  findCommand(input: string): Command {
    return this.commands.filter((v) => v.activate.includes(input))[0]?.command
  }
}
