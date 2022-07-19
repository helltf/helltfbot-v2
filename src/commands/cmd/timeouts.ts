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
    execute = async ({ user, channel }: CommandContext): Promise<BotResponse> => {
        const username = user.username!
        const banChannel = channel

        const response = this.methods.getTimeouts(username, banChannel)
        return response
    }

    methods = {
        getTimeouts: async (username: string, channel?: string): Promise<BotResponse> => {
            if (channel)
                return await this.methods.getTimeoutForChannel(username, channel)

            return this.methods.getTimeout(username)
        },

        getTimeout: async (username: string): Promise<BotResponse> => {
            return this.methods.getNotFoundResponse()
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