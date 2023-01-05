
import { ResourceError, Resource, ResourceSuccess } from '../../api/types'
import { BotResponse } from '../../client/types'
import { GlobalPermissionLevel } from '../../utilities/permission/types'
import { BaseCommand } from '../base'
import { CommandContext } from '../types'

export class SetAliasCommand extends BaseCommand {
  name = 'setalias'
  permissions = GlobalPermissionLevel.USER
  description = 'sets a the given alias for the emote'
  requiredParams = ['emote', 'alias'] as const
  optionalParams = [] as const
  alias = ['emotealias', '7tvalias']
  flags = []
  cooldown = 10000
  async execute({
    channel,
    user,
    params: { emote, alias }
  }: CommandContext<SetAliasCommand>): Promise<BotResponse> {
    const isEditor = await this.methods.isEditor(user.username!, channel)

    if (isEditor instanceof ResourceError)
      return { response: isEditor.error, success: false }

    const emoteData = await hb.api.seventv.rest.getEmoteIdAndName(
      emote,
      channel
    )

    if (emoteData instanceof ResourceError)
      return { response: emoteData.error, success: false }

    const result = await hb.api.seventv.gql.setAlias(
      emoteData.data.id,
      alias,
      channel
    )

    if (result instanceof ResourceError)
      return { response: result.error, success: false }

    return {
      response: `Successfully set ${alias} as alias for ${emote}`,
      success: true
    }
  }

  methods = {
    isEditor: async (
      user: string,
      channel: string
    ): Promise<Resource<boolean>> => {
      const isEditor = await hb.api.seventv.isEditor(user, channel)

      if (isEditor instanceof ResourceError)
        return new ResourceError('could not fetch editors')

      if (!isEditor.data)
        return new ResourceError('You are not an editor of this channel :\\')

      return new ResourceSuccess(true)
    }
  }
}
