import { ResourceError } from '@api/types';
import { BotResponse } from '@src/client/types';
import {  CommandContext } from '@src/commands/types'
import { ChatPermissionLevel } from '@src/utilities/permission/types'
import { BaseCommand } from '../base'

export class AddCommand extends BaseCommand {
  name = 'add'
  permissions = ChatPermissionLevel.USER
  description = 'adds an 7tv emote'
  requiredParams = ['emote_name'] as const
  optionalParams = [] as const
  alias = ['add7tv', 'addemote']
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

    return this.methods.addEmote(emote, channel)
  }

  methods = {
    addEmote: async (emote: string, channel: string): Promise<BotResponse> => {
      const result = await hb.api.seventv.gql.addEmote(emote, channel)

      if (result instanceof ResourceError) {
        return {
          response: result.error,
          success: false
        }
      }

      return {
        response: `Successfully added ${result.data.name}`,
        success: true
      }
    },

    addEmoteById: async (
      emoteId: string,
      channel: string
    ): Promise<BotResponse> => {
      const channelId = await hb.api.seventv.rest.getUserId(channel)

      if (channelId instanceof ResourceError) {
        return { response: channelId.error, success: false }
      }

      const response = await hb.api.seventv.gql.addEmoteById(
        emoteId,
        channelId.data
      )

      if (response instanceof ResourceError) {
        return { response: response.error, success: false }
      }

      return {
        response: `Succesfully added ${response.data.name}`,
        success: true
      }
    }
  }
}
