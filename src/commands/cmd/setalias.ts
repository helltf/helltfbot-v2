import { ResourceError } from "@api/types";
import { BotResponse } from "@src/client/types";
import { Command, CommandContext, CommandFlag } from "@src/commands/types";
import { GlobalPermissionLevel } from '@src/utilities/permission/types'

export class SetAliasCommand implements Command {
  name = 'setalias'
  permissions = GlobalPermissionLevel.USER
  description = 'sets a the given alias for the emote'
  requiredParams = ['emote', 'alias']
  optionalParams = []
  alias = ['emotealias', '7tvalias']
  flags = []
  cooldown = 10000
  execute = async ({
    message: [emote, alias],
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

    const emoteData = await hb.api.seventv.rest.getEmoteIdAndName(
      emote,
      channel
    )

    if (emoteData instanceof ResourceError) {
      return { response: emoteData.error, success: false }
    }

    const [emoteId] = emoteData.data

    const result = await hb.api.seventv.gql.setAlias(emoteId, alias, channel)

    if (result instanceof ResourceError) {
      return { response: result.error, success: false }
    }

    return {
      response: `Successfully set ${alias} as alias for ${emote}`,
      success: true
    }
  }
}