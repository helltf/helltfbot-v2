import { BanEntity } from "@db/entities";
import { BotResponse } from "@src/client/types";
import { ChatPermissionLevel, GlobalPermissionLevel } from "@src/utilities/permission/types";
import { Command, CommandContext, CommandFlag, MessageType } from '../types'

export class BanCheckCommand implements Command {
  name = 'bancheck'
  permissions = ChatPermissionLevel.USER
  description = 'check bans for a user in a channel'
  requiredParams = []
  optionalParams = ['channel', 'user']
  alias = ['bc', 'banc']
  flags = [CommandFlag.WHISPER, CommandFlag.LOWERCASE]
  cooldown = 15000
  execute = async ({
    type,
    channel,
    message: [givenChannel, givenUser]
  }: CommandContext): Promise<BotResponse> => {
    if (type === MessageType.WHISPER && !givenChannel)
      return {
        response: 'Channel is required in whisper context',
        success: false
      }

    return {
      response: '',
      success: false
    }
  }
  methods = {
    getBans: async (user: string, channel: string): Promise<BanEntity[]> => {
      return hb.db.ban.findBy({
        user,
        channel
      })
    }
  }
}
