import { BotResponse } from "@src/client/types";
import { Command, Context } from "@src/commands/types";
import { ChatPermissionLevel } from "@src/utilities/permission/types";

export class HelpCommmand implements Command {
    name = 'help';
    permissions = ChatPermissionLevel.USER;
    description = 'replies with information about the given command'
    requiredParams = ['command'];
    optionalParams = [];
    alias = ['command', 'cmd', 'cmdinfo'];
    cooldown = 10000;
    execute = async ({ message: [command] }: Context): Promise<BotResponse> => {
        if (!command)
            return {
                response: 'You need to specify a command',
                success: false
            }

        const foundCommand = hb.getCommand(command)

        if (!foundCommand)
            return {
                success: false,
                response: 'This command does not exist'
            }

        return {
            success: true,
            response: ''
        }
    }

}