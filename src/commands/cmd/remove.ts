import { BotResponse } from "@src/client/types";
import { Command, CommandContext, CommandFlag } from "@src/commands/types";
import {
  ChatPermissionLevel,
} from '@src/utilities/permission/types'

export class RemoveCommand implements Command {
  name = 'remove'
  permissions = ChatPermissionLevel.MOD
  description = 'removes a 7tv emote from channel'
  requiredParams = ['emote_name']
  optionalParams = []
  alias = ['removeemote']
  flags = []
  cooldown: 10000
  execute = async ({
    message: [emote],
    channel
  }: CommandContext): Promise<BotResponse> => {
    const { success, error } = await hb.api.seventv.removeEmote(emote, channel)

    return {
      response: success ? `Succesfully removed ${emote}` : `${error}`,
      success: success
    }
  }
}
