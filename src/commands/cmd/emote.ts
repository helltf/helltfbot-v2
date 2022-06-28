import { BotResponse } from "@src/client/types";
import { Command, Context } from "@src/commands/types";
import { ChatPermissionLevel } from "@src/utilities/permission/types";

export class EmoteCommand implements Command {
    name = 'emote';
    permissions = ChatPermissionLevel.USER;
    description = 'sends all emote for the channel';
    requiredParams: string[] = [];
    optionalParams: string[] = ['channel'];
    alias: string[] = ['emotes'];
    cooldown = 20000;
    execute = async (
        { channel, message: [channelParam] }: Context
    ): Promise<BotResponse> => {
        const emoteChannel = !channelParam ? channel : channelParam

        const { ffz, bttv, seventv } = await hb.api.fetchAllEmotes(emoteChannel)
        const ffzHasEmotes = !!ffz.length
        const bttvHasEmotes = !!bttv.length
        const seventvHasEmotes = !!seventv.length

        if (!ffzHasEmotes && !bttvHasEmotes && !seventvHasEmotes)
            return {
                success: false,
                response: 'No emotes found'
            }

        const responses = []

        if (ffzHasEmotes)
            responses.push(`FFZ: ${ffz.join(' ')}`)

        if (bttvHasEmotes)
            responses.push(`BTTV: ${bttv.join(' ')}`)

        if (seventvHasEmotes)
            responses.push(`7TV: ${seventv.join(' ')}`)

        return {
            success: true,
            response: responses
        }
    }
}