import { ResourceError } from "@api/types";
import { BotResponse } from "@src/client/types";
import { Command, CommandContext } from "@src/commands/types";
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

    const { id: emoteId, name: emoteName } = emoteResult.data

    const emoteData = await hb.api.seventv.rest.getEmoteById(emoteId)

    if (emoteData instanceof ResourceError) {
      return { response: 'unknown error' }
    }

    const emoteDefaultName = emoteData.data.name

    if (emoteDefaultName === emoteName) {
      return this.methods.getSuccessResponse(emoteName)
    }

    const aliasResult = await hb.api.seventv.gql.setAlias(
      emoteId,
      emoteName,
      yoinkChannel
    )

    if (aliasResult instanceof ResourceError) {
      return {
        response: `Succesfully added ${emoteName} but could not set alias`,
        success: true
      }
    }

    return this.methods.getSuccessResponse(emoteName)
  }

  methods = {
    getSuccessResponse: (emote: string): BotResponse => {
      return {
        response: `Succesfully added ${emote} to your channel`,
        success: true
      }
    }
  }
}