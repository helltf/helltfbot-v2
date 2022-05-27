import { start } from "repl"
import { TwitchUserState, BotResponse } from "../../client/types.js"
import { UpdateEventType } from "../../modules/pubsub/types.js"
import { Command } from "../export/types.js"
import { eventIsNotValid } from "./notify.js"


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
        { 'user-id': unparsedUserId }: TwitchUserState,
        [streamer, event]: string[]
    ): Promise<BotResponse> => {
        const userId = Number(unparsedUserId)

        const errorResponse = {
            success: false,
            channel,
            response: ''
        }

        if (!streamer) {
            errorResponse.response = 'No streamer specified'
            return errorResponse
        }

        if (eventIsNotValid(event)) {
            errorResponse.response = `Event unknown. Valid events are ${Object.values(
                UpdateEventType
            ).join(' ')}`

            return errorResponse
        }

        const eventType = event as UpdateEventType

        if (await userNotificationIsNotExisting(userId, streamer, eventType)) {
            errorResponse.response = 'No matching notification found'
            return errorResponse
        }


        return {
            success: true,
            channel: channel,
            response: 'Successfully removed your notification'
        }
    }
})

export async function userNotificationIsNotExisting(userId: number, streamer: string, event: UpdateEventType): Promise<boolean> {
    return !(await hb.db.notificationRepo.findOneBy({
        user: {
            id: userId
        },
        streamer: streamer,
        [event]: true
    }))
}