import { TwitchUserState, BotResponse } from "@src/client/types";
import { Command } from "@src/commands/types";
import { PermissionLevel } from "@src/utilities/permission/types";

export class LevelCommand implements Command {
  name = 'level'
  permissions = 0
  description = 'Displays your current level'
  requiredParams = []
  optionalParams = []
  alias = ['lvl', 'permission', 'permissions']
  cooldown = 5000
  execute = async (
    channel: string,
    userstate: TwitchUserState,
    message: string[]
  ): Promise<BotResponse> => {
    const dbPerm = await this.methods.getDatabasePermissions(
      Number(userstate['user-id'])
    )
    const userPerm = this.methods.getUserPermissions(userstate)

    return {
      success: true,
      channel,
      response: `Permissions for ${
        userstate.username
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
        await hb.db.userRepo.findOneBy({
          id: id
        })
      )?.permission

      if (!permissions) return PermissionLevel.USER

      return permissions
    },
    getUserPermissions: ({ permission }: TwitchUserState): number => {
      if (!permission) return PermissionLevel.USER

      return permission
    },

    mapToPermissionName: (permissionslevel: PermissionLevel): string => {
      return PermissionLevel[permissionslevel].toLowerCase()
    }
  }
}