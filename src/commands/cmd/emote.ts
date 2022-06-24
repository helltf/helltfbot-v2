import { BotResponse } from "@src/client/types";
import { Command, Context } from "@src/commands/types";
import { ChatPermissionLevel } from "@src/utilities/permission/types";

export class EmoteCommand implements Command {
    name: string = 'emote';
    permissions: number = ChatPermissionLevel.USER;
    description = 'sends all emote for the channel';
    requiredParams: string[] = [];
    optionalParams: string[] = ['type', 'channel'];
    alias: string[] = ['emotes'];
    cooldown: number = 20000;
    execute = async (
        { channel }: Context
    ): Promise<BotResponse> => {
        const emotes = await hb.api.fetchAllEmotes(channel)

        return {
            success: false,
            response: 'No emotes found'
        }
    }
}