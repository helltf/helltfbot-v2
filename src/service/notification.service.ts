import { StreamerEventType } from "../commands/cmd/notify.js"
import { UpdateEventType } from "../modules/pubsub/types.js"

export class NotificationService {
    async cleanAllNotifications() {
        const notificationChannels = await hb.db.notificationChannelRepo.find()

        for (const { name, status, setting } of notificationChannels) {
            if (setting) this.cleanNotificationsForStreamer(name, StreamerEventType.SETTING)
            if (status) this.cleanNotificationsForStreamer(name, StreamerEventType.STATUS)
        }
    }

    async cleanNotificationsForStreamer(streamer: string, event: StreamerEventType) {
        const updateEvents = this.mapEventTypeToUpdateType(event)

        const efxistingNotification = await this.isNotificationExisting(streamer, updateEvents)

    }

    async isNotificationExisting(streamer: string, updateEvents: UpdateEventType[]): Promise<boolean> {
        const queryParams = updateEvents.map(e => { return { streamer, [e]: true } })

        return (await hb.db.notificationRepo.find({
            where: queryParams
        })).length !== 0
    }


    mapEventTypeToUpdateType(event: StreamerEventType): UpdateEventType[] {
        if (event === StreamerEventType.SETTING) return [UpdateEventType.GAME, UpdateEventType.TITLE]
        return [UpdateEventType.OFFLINE, UpdateEventType.LIVE]

    }
}