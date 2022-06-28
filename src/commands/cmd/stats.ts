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
    execute = async ({ message: [type, lookup], user }: Context): Promise<BotResponse> => {
        const username = lookup !== undefined ? lookup : user.username!

        if (!this.methods.isValidType(type))
            return {
                response: `Valid stats are ${Object.values(StatsType)}`,
                success: false
            }

        if (type === StatsType.EMOTEGAME)
            return await this.methods.getEmotegameStats(username)

        return {
            response: 'unknown error',
            success: false
        }
    }

    methods = {
        isValidType(type: string): boolean {
            return hb.utils.enumContains(StatsType, type)
        },

        getEmotegameStats: async (username: string): Promise<BotResponse> => {
            const stats = await hb.db.emoteStatsRepo.findOneBy({
                user: {
                    name: username
                }
            })

            if (!stats)
                return {
                    success: false,
                    response: `${username} has no stats recorded`
                }

            const { emotes_guessed,
                incorrect_guesses,
                letters_guessed } = stats

            return {
                response: [
                    `${username} guessed ${letters_guessed} letters`,
                    `${emotes_guessed} emotes`,
                    `${incorrect_guesses} times incorrect`
                ],
                success: true
            }
        }
    }
}

export enum StatsType {
    EMOTEGAME = 'emotegame      '
}