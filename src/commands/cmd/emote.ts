import { TwitchUserState, BotResponse } from "@src/client/types";
import { Command } from "@src/commands/types";
import { ChatPermissionLevel } from "@src/utilities/permission/types";

export class EmoteCommand implements Command {
    name: string = 'emote';
    permissions: number = ChatPermissionLevel.USER;
    description = 'sends all emote for the channel';
    requiredParams: string[] = [];
    optionalParams: string[] = ['type', 'channel'];
    alias: string[] = ['emotes'];
    cooldown: number = 20000;
    execute = async (channel: string, userstate: TwitchUserState, message: string[]): Promise<BotResponse> => {
        return {
            success: true,
            response: ''
        }
    }
}