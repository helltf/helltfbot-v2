import { TwitchUserState, BotResponse } from "@src/client/types";
import { Command } from "@src/commands/types";

export class UidCommand implements Command {
    name: string = 'uid';
    permissions: number = 0;
    description: string = 'retrieves the user id';
    requiredParams: string[] = [];
    optionalParams: string[] = ['user'];
    alias: string[] = ['userid'];
    cooldown: number = 10000;
    execute = async (channel: string, userstate: TwitchUserState, [searchUser]: string[]): Promise<BotResponse> => {

        if (!searchUser)
            return {
                channel,
                response: this.methods.getResponse(userstate["user-id"], userstate.username),
                success: true
            }

        const id = await this.methods.getId(searchUser)

        if (!id)
            return {
                channel,
                response: 'Could not find user',
                success: false
            }

        return {
            channel,
            response: this.methods.getResponse(id, searchUser),
            success: true
        }
    }
    methods = {
        getResponse(id?: number | string, username?: string): string {
            return `${username}👉${id}`
        },
        getId(username: string): Promise<number | undefined> {
            return hb.api.twitch.getUserIdByName(username)
        }
    }
}