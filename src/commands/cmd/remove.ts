import { ResourceError } from "@api/types";
import { BotResponse } from "@src/client/types";
import { Command, CommandContext } from "@src/commands/types";
import { ChatPermissionLevel } from '@src/utilities/permission/types'

export class RemoveCommand implements Command {
  name = 'remove'
  permissions = ChatPermissionLevel.MOD
  description = 'removes a 7tv emote from channel'
  requiredParams = ['emote_name']
  optionalParams = []
  alias = ['removeemote']
  flags = []
  cooldown = 10000
  execute = async ({
    message: [emote],
    channel
  }: CommandContext): Promise<BotResponse> => {
    const result = await hb.api.seventv.removeEmote(emote, channel)

    if (result instanceof ResourceError) {
      return {
        response: result.error,
        success: false
      }
    }

    return {
      response: `Succesfully removed ${result.data}`,
      success: true
    }
  }
}
