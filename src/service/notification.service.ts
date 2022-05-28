import { StreamerEventType } from "../commands/cmd/notify.js"
import { UpdateEventType } from "../modules/pubsub/types.js"

export class NotificationService {
    async cleanAllNotifications() {
        const notificationChannels = await hb.db.notificationChannelRepo.find()

        for (const { id, name, status, setting } of notificationChannels) {
            if (setting) this.cleanNotificationsForStreamer(id, name, StreamerEventType.SETTING)
            if (status) this.cleanNotificationsForStreamer(id, name, StreamerEventType.STATUS)
        }
    }

    async clean(id: number, event: StreamerEventType) {
        await hb.db.notificationChannelRepo.update({
            id: id
        }, {
            [event]: false
        })

        hb.pubSub.unlistenStreamerTopic(id, event)
    }

    async cleanNotificationsForStreamer(id: number, name: string, event: StreamerEventType) {
        const updateEvents = this.mapEventTypeToUpdateType(event)

        const existingNotification = await this.isNotificationExisting(name, updateEvents)

        if (existingNotification) return

        await this.clean(id, event)

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