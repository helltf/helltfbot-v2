import { BanEntity } from "@db/entities";
import { BotResponse } from "@src/client/types";
import { ChatPermissionLevel} from "@src/utilities/permission/types";
import { Command, CommandContext, CommandFlag, MessageType } from '../types'

export class BanCheckCommand implements Command {
  name = 'bancheck'
  permissions = ChatPermissionLevel.USER
  description = 'check bans for a user in a channel'
  requiredParams = []
  optionalParams = ['user', 'channel']
  alias = ['bc', 'banc']
  flags = [CommandFlag.WHISPER, CommandFlag.LOWERCASE]
  cooldown = 15000
  execute = async ({
    type,
    user,
    message: [givenUser, givenChannel]
  }: CommandContext): Promise<BotResponse> => {
    if (type === MessageType.WHISPER && !givenChannel)
      return {
        response: 'Channel is required in whisper context',
        success: false
      }

    const bans = await this.methods.getBans(user.username!, givenChannel)
    const message =
      bans.length === 0
        ? 'No bans recorded'
        : [
            `@${user.username} has ${bans.length} ${hb.utils.plularizeIf(
              'ban',
              bans.length
            )} recorded`,
            `Last ban ${hb.utils.humanizeNow(bans[0].at)} ago in ${
              bans[0].channel
            }`
          ]

    return {
      response: message,
      success: true
    }
  }
  methods = {
    getBans: async (
      user: string,
      channel: string | undefined
    ): Promise<BanEntity[]> => {
      return hb.db.ban.findBy({
        user,
        ...(channel && { channel })
      })
    }
  }
}
