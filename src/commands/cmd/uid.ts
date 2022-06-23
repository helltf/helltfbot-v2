import { TwitchUserState, BotResponse } from "../../client/types.js";
import { Command } from "../types.js";

export class UidCommand implements Command {
    name: string = 'uid';
    permissions: number = 0;
    description: string = 'retrieves the user id';
    requiredParams: string[] = [];
    optionalParams: string[] = ['user'];
    alias: string[] = ['userid'];
    cooldown: number = 10000;
    execute = (channel: string, userstate: TwitchUserState, message: string[]): Promise<BotResponse> => {

    }

}