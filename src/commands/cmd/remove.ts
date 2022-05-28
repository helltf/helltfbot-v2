import { UpdateResult } from "typeorm"
import { TwitchUserState, BotResponse } from "../../client/types.js"
import { UserNotificationType } from "../../modules/pubsub/types.js"
import { NotificationService } from "../../service/notification.service.js"
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
        const eventType = event as UserNotificationType

        const errorResponse = {
            success: false,
            channel,
            response: ''
        }

        if (!streamer) {
            errorResponse.response = 'No streamer specified'
            return errorResponse
        }

        if (eventIsNotValid(eventType)) {
            errorResponse.response = `Event unknown. Valid events are ${Object.values(
                UserNotificationType
            ).join(' ')}`

            return errorResponse
        }

        const { affected } = await removeEventNotification(userId, streamer, eventType)

        if (!affected) {
            errorResponse.response = 'No matching notification found'
            return errorResponse
        }

        new NotificationService().cleanAllNotifications()

        return {
            success: true,
            channel: channel,
            response: 'Successfully removed your notification'
        }
    }
})

export async function removeEventNotification(userId: number, streamer: string, event: UserNotificationType): Promise<UpdateResult> {
    return await hb.db.notificationRepo.update({
        user: { id: userId },
        streamer: streamer
    }, {
        [event]: false
    })
}