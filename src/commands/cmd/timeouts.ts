import { BotResponse } from "@src/client/types";
import { Command, CommandContext, CommandFlag } from "@src/commands/types";
import { ChatPermissionLevel, GlobalPermissionLevel } from "@src/utilities/permission/types";

export class TimeoutsCommand implements Command {
    name = 'timeouts'
    permissions = GlobalPermissionLevel.USER
    description = 'returns latest timeout and amount of tracked timeouts'
    requiredParams = []
    optionalParams = ['user', 'channel']
    alias = ['timeoutcheck', 'timeoutstats', 'tms']
    flags = [CommandFlag.LOWERCASE, CommandFlag.WHISPER]
    cooldown = 30000
    execute = async ({ }: CommandContext): Promise<BotResponse> => {
        return {
            response: 'No bans found',
            success: false
        }
    }
}