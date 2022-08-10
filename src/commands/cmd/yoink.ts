import { ResourceError, ResourceSuccess } from "@api/types";
import { BotResponse } from "@src/client/types";
import { Command, CommandContext, CommandFlag } from "@src/commands/types";
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
    const emoteResult = await hb.api.seventv.yoink(emote, channel, yoinkChannel)

    if (emoteResult instanceof ResourceError) {
      return {
        response: emoteResult.error,
        success: false
      }
    }

    const [emoteId, emoteName] = emoteResult.data

    const aliasResult = await hb.api.seventv.setAlias(
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

    return {
      response: `Succesfully added ${emoteName} to your channel`,
      success: true
    }
  }
}