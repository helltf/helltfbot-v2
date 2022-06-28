import { BotResponse } from "@src/client/types";
import { Command, Context } from "@src/commands/types";
import { ChatPermissionLevel } from "@src/utilities/permission/types";

export class StatsCommand implements Command {
    name = 'stats';
    permissions: number = ChatPermissionLevel.USER;
    description: string = 'displays your stats';
    requiredParams: string[] = ['type'];
    optionalParams: string[] = ['user'];
    alias: string[] = ['statistics'];
    cooldown: number = 20000;
    execute = async (context: Context): Promise<BotResponse> => {
        return {
            response: '',
            success: true
        }
    }

}