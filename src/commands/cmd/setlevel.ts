import { BotResponse } from "@src/client/types";
import {  CommandContext, CommandFlag } from "@src/commands/types";
import { GlobalPermissionLevel } from "@src/services/permissions.service";
import { BaseCommand } from '../base'

export class SetLevelCommand extends BaseCommand {
  name = 'setlevel'
  permissions = GlobalPermissionLevel.ADMIN
  description = 'sets the permissions of a given user'
  requiredParams = ['user', 'level'] as const
  optionalParams = [] as const
  alias = ['setlvl']
  flags = [CommandFlag.WHISPER, CommandFlag.LOWERCASE]
  cooldown = 5000
  async execute({
    user,
    params: { user: providedUser, level: providedLevel }
  }: CommandContext<SetLevelCommand>): Promise<BotResponse> {
    const level =
      providedLevel?.toUpperCase() as keyof typeof GlobalPermissionLevel

    if (user.username === providedUser) {
      return {
        response: 'Cannot change your own role',
        success: false
      }
    }

    if (!(level in GlobalPermissionLevel))
      return {
        response: 'permission level does not exist',
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
