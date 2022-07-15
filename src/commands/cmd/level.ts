import { TwitchUserState, BotResponse } from "@src/client/types";
import { Command, CommandContext, CommandFlag } from "@src/commands/types";
import {
  ChatPermissionLevel,
  GlobalPermissionLevel
} from '@src/utilities/permission/types'

export class LevelCommand implements Command {
  name = 'level'
  permissions = ChatPermissionLevel.USER
  description = 'Displays your current level'
  requiredParams = []
  optionalParams = []
  alias = ['lvl', 'permission', 'permissions']
  cooldown = 5000
  flags: CommandFlag[] = [CommandFlag.WHISPER]
  execute = async ({ user }: CommandContext): Promise<BotResponse> => {
    const dbPerm = await this.methods.getDatabasePermissions(
      Number(user['user-id'])
    )
    const userPerm = this.methods.getUserPermissions(user)

    return {
      success: true,
      response: `Permissions for ${
        user.username
      } are ${this.methods.mapToPermissionName(
        userPerm
      )} for this channel and ${this.methods.mapToPermissionName(
        dbPerm
      )} overall`
    }
  }
  methods = {
    getDatabasePermissions: async (id: number): Promise<number> => {
      const permissions = (
        await hb.db.user.findOneBy({
          id: id
        })
      )?.permission

      if (!permissions) return GlobalPermissionLevel.USER

      return permissions
    },

    getUserPermissions: ({ badges }: TwitchUserState): number => {
      return hb.utils.permission.getChatPermissions(badges!)
    },

    mapToPermissionName: (
      permissionslevel: GlobalPermissionLevel | ChatPermissionLevel
    ): string => {
      if (permissionslevel in GlobalPermissionLevel)
        return GlobalPermissionLevel[permissionslevel].toLowerCase()

      return ChatPermissionLevel[permissionslevel].toLowerCase()
    }
  }
}