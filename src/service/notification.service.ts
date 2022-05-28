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

    async clean(streamer: string, event: StreamerEventType) {
        await hb.db.notificationChannelRepo.update({
            name: streamer
        }, {
            [event]: false
        })

        // hb.pubSub.unlistenStreamerTopic(streamer, event)
    }

    async cleanNotificationsForStreamer(streamer: string, event: StreamerEventType) {
        const updateEvents = this.mapEventTypeToUpdateType(event)

        const existingNotification = await this.isNotificationExisting(streamer, updateEvents)

        if (existingNotification) return

        await this.clean(streamer, event)

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