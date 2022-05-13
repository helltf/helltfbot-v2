import { ChatUserstate } from 'tmi.js'
import { BotResponse } from '../../client/response.js'

export class Command {
  name: string
  permissions: number
  description: string
  requiredParams: string[]
  optionalParams: string[]
  alias: string[]
  cooldown: number
  execute: (
    channel: string,
    userstate: ChatUserstate,
    message: string[]
  ) => Promise<BotResponse>

  constructor({
    name,
    permissions,
    description,
    requiredParams,
    optionalParams,
    execute,
    cooldown,
    alias
  }: CommandInfo) {
    this.name = name
    this.permissions = permissions
    this.description = description
    this.requiredParams = requiredParams
    this.optionalParams = optionalParams
    this.execute = execute
    this.cooldown = cooldown
    this.alias = alias
  }
}

interface CommandInfo {
  name: string
  permissions: number
  description: string
  requiredParams: string[]
  optionalParams: string[]
  cooldown: number
  alias: string[]
  execute: (
    channel: string,
    userstate: ChatUserstate,
    message: string[]
  ) => Promise<BotResponse>
}

export class Commands {
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
