import { ResourceError } from "@api/types";
import { BotResponse } from "@src/client/types";
import { Command, CommandContext } from "@src/commands/types";
import { ChatPermissionLevel } from '@src/utilities/permission/types'

export class RemoveCommand implements Command {
  name = 'remove'
  permissions = ChatPermissionLevel.USER
  description = 'removes a 7tv emote from channel'
  requiredParams = ['emote_name']
  optionalParams = []
  alias = ['removeemote']
  flags = []
  cooldown = 10000
  execute = async ({
    message: [emote],
    channel,
    user
  }: CommandContext): Promise<BotResponse> => {
    if (!emote)
      return {
        response: 'emote as parameter is required',
        success: false
      }

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
    addEmoteByName: async (emote: string, channel: string): Promise<BotResponse> => {
      const result = await hb.api.seventv.gql.removeEmote(emote, channel)

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
    },

    addEmoteById: async (emote: string, channel: string): Promise<BotResponse> => {
      return { response: '', success: false }
    }
  }
}

