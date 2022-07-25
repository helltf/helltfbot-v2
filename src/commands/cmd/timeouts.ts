import { BotResponse } from "@src/client/types";
import { Command, CommandContext, CommandFlag } from "@src/commands/types";
import { ChatPermissionLevel, GlobalPermissionLevel } from "@src/utilities/permission/types";
import { time } from "console";

export class TimeoutsCommand implements Command {
    name = 'timeouts'
    permissions = GlobalPermissionLevel.USER
    description = 'returns latest timeout and amount of tracked timeouts'
    requiredParams = []
    optionalParams = ['user', 'channel']
    alias = ['timeoutcheck', 'timeoutstats', 'tms']
    flags = [CommandFlag.LOWERCASE, CommandFlag.WHISPER]
    cooldown = 30000
    execute = async ({ user, channel, message: [providedUser] }: CommandContext): Promise<BotResponse> => {
        const username = providedUser ?? user.username!
        const banChannel = !providedUser ? channel : undefined

        return this.methods.getTimeoutInfo(username, banChannel)
    }

    methods = {
        getTimeoutInfo: async (username: string, channel?: string): Promise<BotResponse> => {
            if (channel)
                return await this.methods.getTimeoutForChannel(username, channel)

            return this.methods.getAllTimeouts(username)
        },

        getAllTimeouts: async (username: string): Promise<BotResponse> => {
            const timeouts = await hb.db.ban.find({
                where: {
                    user: username
                },
                order: {
                    at: 'DESC'
                }
            })

            if (!timeouts.length)
                return this.methods.getNotFoundResponse()

            const [lastTimeout] = timeouts

            const channels = timeouts.reduce((countedChannels: string[], { channel }) => {
                if (!countedChannels.includes(channel))
                    countedChannels.push(channel)
                return countedChannels
            }, [] as string[])

            return {
                success: true,
                response: [
                    `${username} has been timeouted ${timeouts.length}`,
                    `${channels.length} different channels`,
                    `last timeout ${hb.utils.humanizeNow(lastTimeout.at)} ago in ${lastTimeout.channel}`
                ]
            }
        },

        getTimeoutForChannel: async (username: string, channel: string): Promise<BotResponse> => {
            const result = await hb.db.ban.find({
                where: {
                    channel: channel,
                    user: username
                },
                order: { at: 'DESC' }
            })

            if (!result.length)
                return this.methods.getNotFoundResponse()

            return {
                response: [
                    `${username} has been timeouted ${result.length} times in channel ${channel}`,
                    `Last ban: ${hb.utils.humanizeNow(result[0].at)} ago`
                ],
                success: true
            }
        },

        getNotFoundResponse: (): BotResponse => {
            return {
                response: 'No timeout found',
                success: true
            }
        }

    }
}