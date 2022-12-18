import { BotResponse } from "@src/client/types";
import {  CommandContext, CommandFlag } from "@src/commands/types";
import { GlobalPermissionLevel } from "@src/utilities/permission/types";
import { BaseCommand } from '../base'

export class EvalCommand extends BaseCommand {
  name = 'eval'
  permissions = GlobalPermissionLevel.ADMIN
  description = 'evaluates the given input'
  requiredParams = ['expression'] as const
  optionalParams = [] as const
  alias: string[] = []
  cooldown = 0
  flags: CommandFlag[] = [CommandFlag.WHISPER]
  execute = async ({
    message: [...code]
  }: CommandContext): Promise<BotResponse> => {
    try {
      const result = await eval('(async () => ' + code.join(' ') + ')()')
      const response =
        typeof result === 'object' ? JSON.stringify(result) : `${result}`
      return {
        response: response,
        success: true
      }
    } catch (e: any) {
      return {
        response: `${e}`,
        success: false
      }
    }
  }
}
