import { BotResponse } from "@src/client/types";
import { Command, CommandContext, CommandFlag } from "@src/commands/types";
import { GlobalPermissionLevel } from "@src/utilities/permission/types";

export class SetLevelCommand implements Command {
  name = 'setlevel'
  permissions = GlobalPermissionLevel.ADMIN
  description = 'sets the permissions of a given user'
  requiredParams = ['user', 'level']
  optionalParams = []
  alias = ['setlvl']
  flags = [CommandFlag.WHISPER, CommandFlag.LOWERCASE]
  cooldown = 5000
  execute = async ({
    user,
    message: [providedUser, providedLevel]
  }: CommandContext): Promise<BotResponse> => {
    const level =
      providedLevel?.toUpperCase() as keyof typeof GlobalPermissionLevel

    if (!providedUser)
      return {
        response: 'You need to define a user',
        success: false
      }
    if (user.username === providedUser) {
      return {
        response: 'Cannot change your own role',
        success: false
      }
    }

    if (!level || !(level in GlobalPermissionLevel))
      return {
        response: 'level is missing or not existing',
        success: false
      }
    const success = await this.methods.updateRole(
      providedUser,
      GlobalPermissionLevel[level]
    )

    return {
      response: success ? 'Succesfully updated permissions' : 'User not found',
      success: success
    }
  }
  methods = {
    updateRole: async (
      username: string,
      level: GlobalPermissionLevel
    ): Promise<boolean> => {
      const result = await hb.db.user.update(
        {
          name: username
        },
        {
          permission: level
        }
      )
      return result.affected !== 0
    }
  }
}