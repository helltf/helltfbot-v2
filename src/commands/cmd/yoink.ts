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

    const [emoteId, emoteName] = emoteResult.data

    if (emoteName.toLowerCase() === emote.toLowerCase())
      return {
        response: `Succesfully added ${emoteName} to your channel`,
        success: true
      }

    const success = await this.methods.setAlias(
      emoteId,
      emoteName,
      yoinkChannel
    )

    if (success) {
      return {
        response: `Succesfully added ${emoteName} to your channel`,
        success: true
      }
    }

    return {
      response: `Added emote but could not set alias`,
      success: true
    }
  }
  methods = {
    setAlias: async (
      emoteId: string,
      emoteName: string,
      yoinkChannel: string
    ): Promise<boolean> => {
      const aliasResult = await hb.api.seventv.gql.setAlias(
        emoteId,
        emoteName,
        yoinkChannel
      )

      if (aliasResult instanceof ResourceError) {
        return false
      }

      return true
    }
  }
}