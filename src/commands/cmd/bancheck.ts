import { BanEntity } from "@db/entities";
import { BotResponse } from "@src/client/types";
import { ChatPermissionLevel} from "@src/utilities/permission/types";
import { BaseCommand } from "../base";
import { CommandContext, CommandFlag, MessageType } from '../types'

export class BanCheckCommand extends BaseCommand {
  name = 'bancheck'
  permissions = ChatPermissionLevel.USER
  description = 'check bans for a user in a channel'
  requiredParams = [] as const
  optionalParams = ['user', 'channel'] as const
  alias = ['bc', 'banc']
  flags = [CommandFlag.WHISPER, CommandFlag.LOWERCASE]
  cooldown = 15000
  async execute({
    type,
    user,
    params: { user: givenUser, channel: givenChannel }
  }: CommandContext<BanCheckCommand>): Promise<BotResponse> {
    if (type === MessageType.WHISPER && !givenChannel)
      return {
        response: 'Channel is required in whisper context',
        success: false
      }
    const searchUser = givenUser ?? user.username!

    const bans = await this.methods.getBans(searchUser, givenChannel)

    const message = this.methods.getBanMessage(bans, searchUser, !!givenChannel)

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
      return hb.db.ban.find({
        where: {
          user,
          ...(channel && { channel })
        },
        order: { at: 'DESC' }
      })
    },
    getBanMessage: (
      bans: BanEntity[],
      username: string,
      isChannelBan: boolean
    ): string | string[] => {
      if (!bans.length) {
        return isChannelBan
          ? 'This user has never been banned in this channel'
          : 'No bans recorded'
      }

      return isChannelBan
        ? [
            `@${username} has been banned ${bans.length} ${hb.utils.plularizeIf(
              'time',
              bans.length
            )} in this channel`,
            `Last ban ${hb.utils.humanizeNow(bans[0].at)} ago`
          ]
        : [
            `@${username} has ${bans.length} ${hb.utils.plularizeIf(
              'ban',
              bans.length
            )} recorded`,
            `Last ban ${hb.utils.humanizeNow(bans[0].at)} ago in ${
              bans[0].channel
            }`
          ]
    }
  }
}
