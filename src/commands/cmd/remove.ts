
import { ResourceError } from '../../api/types'
import { BotResponse } from '../../client/types'
import { ChatPermissionLevel } from '../../utilities/permission/types'
import { BaseCommand } from '../base'
import { CommandContext } from '../types'

export class RemoveCommand extends BaseCommand {
  name = 'remove'
  permissions = ChatPermissionLevel.USER
  description = 'removes a 7tv emote from channel'
  requiredParams = ['emote_name'] as const
  optionalParams = [] as const
  alias = ['removeemote']
  flags = []
  cooldown = 10000
  async execute({
    params: { emote_name: emote },
    channel,
    user
  }: CommandContext<RemoveCommand>): Promise<BotResponse> {
    const isEditor = await hb.api.seventv.isEditor(user.username!, channel)

    if (isEditor instanceof ResourceError) {
      return { response: 'could not fetch editors', success: false }
    }

    if (!isEditor.data)
      return {
        response: 'You are not an editor of this channel :\\',
        success: false
      }

    const idFromUrl = hb.api.seventv.getIdFromUrl(emote)

    if (idFromUrl) {
      return this.methods.addEmoteById(idFromUrl, channel)
    }

    return this.methods.addEmoteByName(emote, channel)
  }

  methods = {
    addEmoteByName: async (
      emote: string,
      channel: string
    ): Promise<BotResponse> => {
      const result = await hb.api.seventv.gql.removeEmote(emote, channel)

      if (result instanceof ResourceError) {
        return {
          response: result.error,
          success: false
        }
      }

      return {
        response: `Successfully removed ${result.data.name}`,
        success: true
      }
    },

    addEmoteById: async (
      emoteId: string,
      channel: string
    ): Promise<BotResponse> => {
      const channelId = await hb.api.seventv.rest.getUserId(channel)

      if (channelId instanceof ResourceError)
        return { response: channelId.error, success: false }

      const response = await hb.api.seventv.gql.removeEmoteById(
        emoteId,
        channelId.data
      )

      if (response instanceof ResourceError) {
        return { response: response.error, success: false }
      }

      return {
        response: `Successfully removed ${response.data.name}`,
        success: false
      }
    }
  }
}
