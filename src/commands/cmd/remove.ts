import { appendFileSync } from "fs"
import { TwitchUserState, BotResponse } from "../../client/types.js"
import { UpdateEventType } from "../../modules/pubsub/types.js"
import { Command } from "../export/types.js"

export const remove = new Command({
    name: 'remove',
    alias: ['rmn', 'removenotify', 'removeme', 'removenotification'],
    cooldown: 5000,
    description: 'removes your notification for the given streamer on the event',
    optionalParams: [],
    requiredParams: ['streamer', 'event'],
    permissions: 0,
    execute: async (
        channel: string,
        user: TwitchUserState,
        [streamer, event]: string[]
    ): Promise<BotResponse> => {
        const errorResponse = {
            success: false,
            channel,
            response: ''
        }

        if (!streamer) {
            errorResponse.response = 'No streamer specified'
            return errorResponse
        }

        errorResponse.response = `Event unknown. Valid events are ${Object.values(
            UpdateEventType
        ).join(' ')}`

        return errorResponse
    }
})
