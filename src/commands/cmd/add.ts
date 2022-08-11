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
    channel,
    user
  }: CommandContext): Promise<BotResponse> => {
    const isEditor = await hb.api.seventv.isEditor(user.username!, channel)

    if (isEditor instanceof ResourceError) {
      return { response: 'could not fetch editors', success: false }
    }

    if (!isEditor.data)
      return {
        response: 'You are not an editor of this channel :\\',
        success: false
      }

    const result = await hb.api.seventv.gql.addEmote(emote, channel)

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
