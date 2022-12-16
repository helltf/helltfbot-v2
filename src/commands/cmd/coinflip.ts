import { BotResponse } from "@src/client/types";
import { ChatPermissionLevel, GlobalPermissionLevel } from "@src/utilities/permission/types";
import { Command, CommandContext, CommandFlag } from '../types'

export class CoinflipCommand implements Command {
  name: string
  permissions: ChatPermissionLevel | GlobalPermissionLevel
  description: string
  requiredParams: string[]
  optionalParams: string[]
  alias: string[]
  flags: CommandFlag[]
  cooldown: number
  methods?: { [key: string]: (...args: any) => any } | undefined
  execute: (context: CommandContext) => Promise<BotResponse>
  static?: { [key: string]: any } | undefined
}
