import { BotResponse } from '../../client/response.js'
import { TwitchUserState } from '../../client/types.js'

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
    userstate: TwitchUserState,
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
    userstate: TwitchUserState,
    message: string[]
  ) => Promise<BotResponse>
}

export class Commands {
  commands: { activate: string[]; command: Command }[] = []

  constructor(commands: Command[]) {
    const usedNames = []

    for (const command of commands) {
      this.checkForError(usedNames, command)
      this.commands.push({
        activate: [command.name, ...command.alias],
        command: command
      })

      usedNames.push(...[command.name, ...command.alias])
    }
  }

  findCommand(input: string): Command {
    return this.commands.filter((v) => v.activate.includes(input))[0]?.command
  }

  checkForError(usedNames: string[], command: Command) {
    if (usedNames.includes(command.name)) {
      throw new Error('Command name is already in usage')
    }

    for (const alias of command.alias) {
      if (usedNames.includes(alias))
        throw new Error('alias is already in usage')
    }
  }
}
