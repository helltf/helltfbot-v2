import { EmoteData } from "@api/7tv/seventv.gql";
import { ResourceError } from "@api/types";
import { BotResponse } from "@src/client/types";
import { Command, CommandContext } from '@src/commands/types'
import { GlobalPermissionLevel } from '@src/utilities/permission/types'

export class YoinkCommand implements Command {
  name = 'yoink'
  permissions = GlobalPermissionLevel.USER
  description = 'adds the given emote to you channel'
  requiredParams = ['emote']
  optionalParams = []
  alias = ['yoinkemote']
  flags = []
  cooldown = 10000
  execute = async ({
    message: [emote],
    user,
    channel
  }: CommandContext): Promise<BotResponse> => {
    if (!emote) return { response: 'no emote specified', success: false }
    const yoinkChannel = user.username!
    const emoteResult = await hb.api.seventv.gql.yoink(
      emote,
      channel,
      yoinkChannel
    )

    if (emoteResult instanceof ResourceError) {
      return {
        response: emoteResult.error,
        success: false
      }
    }

    return await this.methods.setAlias(emoteResult.data, yoinkChannel)
  }

  methods = {
    getSuccessResponse: (emote: string): BotResponse => {
      return {
        response: `Successfully added ${emote} to your channel`,
        success: true
      }
    },

    setAlias: async (
      { id: emoteId, name: emoteName }: EmoteData,
      channel: string
    ): Promise<BotResponse> => {
      const emoteData = await hb.api.seventv.rest.getEmoteById(emoteId)

      if (emoteData instanceof ResourceError) {
        return { response: 'could not fetch emote data', success: false }
      }

      const emoteDefaultName = emoteData.data.name

      if (emoteDefaultName !== emoteName) {
        const aliasResult = await hb.api.seventv.gql.setAlias(
          emoteId,
          emoteName,
          channel
        )

        if (aliasResult instanceof ResourceError) {
          return {
            response: `Successfully added ${emoteName} but could not set alias`,
            success: true
          }
        }
      }

      return this.methods.getSuccessResponse(emoteName)
    }
  }
}