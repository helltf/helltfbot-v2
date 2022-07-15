import { BotResponse } from "@src/client/types";
import { Command, CommandContext, CommandFlag } from "@src/commands/types";
import { ChatPermissionLevel, GlobalPermissionLevel } from "@src/utilities/permission/types";
import { timeStamp } from "console";

export class SetLevelCommand implements Command {
    name = 'setlevel'
    permissions = GlobalPermissionLevel.ADMIN
    description = 'sets the permissions of a given user'
    requiredParams = ['user', 'level']
    optionalParams = []
    alias = ['setlvl']
    flags = [CommandFlag.WHISPER, CommandFlag.LOWERCASE];
    cooldown = 5000
    execute = async ({ user, message: [providedUser, level] }: CommandContext): Promise<BotResponse> => {

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

        if (!level || !(level.toUpperCase() in GlobalPermissionLevel))
            return {
                response: 'level is missing or not existing',
                success: false
            }
        await this.methods.updateRole(GlobalPermissionLevel[])

        return {
            response: '',
            success: false
        }
    }
    methods: {
        updateRole: (level: GlobalPermissionLevel) => {

        }
    }
}