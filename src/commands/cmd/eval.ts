
import { BotResponse } from '../../client/types'
import { GlobalPermissionLevel } from '../../utilities/permission/types'
import { BaseCommand } from '../base'
import { CommandFlag, CommandContext } from '../types'

export class EvalCommand extends BaseCommand {
  name = 'eval'
  permissions = GlobalPermissionLevel.ADMIN
  description = 'evaluates the given input'
  requiredParams = ['code'] as const
  optionalParams = [] as const
  alias: string[] = []
  cooldown = 0
  flags: CommandFlag[] = [CommandFlag.WHISPER, CommandFlag.APPEND_PARAMS]
  async execute({
    params: { code }
  }: CommandContext<EvalCommand>): Promise<BotResponse> {
    try {
      const result = await eval('(async () => ' + code + ')()')
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
