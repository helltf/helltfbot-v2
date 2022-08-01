import { BotResponse } from "@src/client/types";
import { Command, CommandContext, CommandFlag } from "@src/commands/types";
import {
  ChatPermissionLevel,
  GlobalPermissionLevel
} from '@src/utilities/permission/types'

export class AcceptCommand implements Command {
  name = 'accept'
  permissions = GlobalPermissionLevel.ADMIN
  description = 'Accepts the given suggestion with a reason'
  requiredParams = ['id', 'reason']
  optionalParams = []
  alias = ['acceptsuggestion']
  flags = [CommandFlag.WHISPER]
  cooldown = 0
  execute = async (context: CommandContext): Promise<BotResponse> => {
    return {
      response: 'id missing',
      success: false
    }
  }
}
