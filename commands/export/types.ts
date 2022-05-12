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
