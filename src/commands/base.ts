import { BotResponse } from "@src/client/types"
import { ChatPermissionLevel, GlobalPermissionLevel } from "@src/utilities/permission/types"
import { Command, CommandContext, CommandFlag } from './types'

export abstract class BaseCommand implements Command {
  async execute<T extends BaseCommand>(
    /* eslint-disable */
    context: CommandContext<T>
  ): Promise<BotResponse> {
    return { response: 'No Implementation found', success: false }
  }
  name: string
  permissions: ChatPermissionLevel | GlobalPermissionLevel
  description: string
  readonly requiredParams: any
  readonly optionalParams: any
  alias: string[]
  flags: CommandFlag[]
  cooldown: number
  methods?: { [key: string]: (...args: any) => any } | undefined
  static?: { [key: string]: any } | undefined
  evaluate = () => {
    console.log(this.name)
  }
}
