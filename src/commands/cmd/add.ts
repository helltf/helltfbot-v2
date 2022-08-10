import { ResourceError } from '@api/types';
import { BotResponse } from '@src/client/types';
import { Command, CommandContext } from '@src/commands/types'
import { ChatPermissionLevel } from '@src/utilities/permission/types'

export class AddCommand implements Command {
  name = 'add'
  permissions = ChatPermissionLevel.MOD
  description = 'adds an 7tv emote'
  requiredParams = ['emote_name']
  optionalParams = []
  alias = ['add7tv', 'addemote']
  flags = []
  cooldown = 10000
  execute = async ({
    message: [emote],
    channel
  }: CommandContext): Promise<BotResponse> => {
    const result = await hb.api.seventv.addEmote(emote, channel)

    if (result instanceof ResourceError) {
      return {
        response: result.error,
        success: false
      }
    }

    return {
      response: `Succesfully added ${result.data}`,
      success: true
    }
  }
}
