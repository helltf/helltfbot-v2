import { BotResponse } from "@src/client/types";
import { Command, CommandContext } from "@src/commands/types";
import { GlobalPermissionLevel } from "@src/utilities/permission/types";

export class EvalCommand implements Command {
  name = 'eval'
  permissions = GlobalPermissionLevel.ADMIN
  description = 'evaluates the given input'
  requiredParams = ['expression']
  optionalParams = []
  alias: string[] = []
  cooldown = 0
  flags: string[] = []
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