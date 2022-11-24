import { BanEntity } from "@db/entities";
import { BotResponse } from "@src/client/types";
import { ChatPermissionLevel, GlobalPermissionLevel } from "@src/utilities/permission/types";
import { Command, CommandContext, CommandFlag } from '../types'

export class BanCheckCommand implements Command {
  name = 'bancheck'
  permissions = ChatPermissionLevel.USER
  description = 'check bans for a user in a channel'
  requiredParams = []
  optionalParams = ['user', 'channel']
  alias = ['bc', 'banc']
  flags = [CommandFlag.WHISPER, CommandFlag.LOWERCASE]
  cooldown = 15000
  execute: (context: CommandContext) => Promise<BotResponse>
  method = {
    getBans: async (user: string, channel: string): Promise<BanEntity[]> => {
      return hb.db.ban.findBy({
        user,
        channel
      })
    }
  }
}
