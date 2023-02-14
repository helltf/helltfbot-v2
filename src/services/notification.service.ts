import { PubSub } from "@modules/pubsub/pubsub"
import { DB } from "@src/db/export-repositories"
import { NotificationChannelEntity } from "../db/export-entities"
import { NotifyEventType, UserNotificationType } from '../modules/pubsub/types'

export class NotificationService {
  db: DB
  pubSub: PubSub

  initialize(db: DB, pubSub: PubSub) {
    this.db = db
    this.pubSub = pubSub
  }

  async cleanAllNotifications() {
    let notificationChannels: NotificationChannelEntity[] = []
    try {
      notificationChannels = await this.db.notificationChannel.find()
    } catch (e) {
      console.log(e)
    }

    for (const { id, name, status, setting } of notificationChannels) {
      if (setting)
        await this.cleanNotificationsForStreamer(
          id,
          name,
          NotifyEventType.SETTING
        )
      if (status)
        await this.cleanNotificationsForStreamer(
          id,
          name,
          NotifyEventType.STATUS
        )
    }
  }

  async clean(id: number, event: NotifyEventType) {
    await this.db.notificationChannel.update(
      {
        id: id
      },
      {
        [event]: false
      }
    )

    this.pubSub.unlistenStreamerTopic(id, event)
  }

  async cleanNotificationsForStreamer(
    id: number,
    name: string,
    event: NotifyEventType
  ) {
    const updateEvents = this.mapEventTypeToUpdateType(event)

    const existingNotification = await this.isNotificationExisting(
      name,
      updateEvents
    )

    if (existingNotification) return

    await this.clean(id, event)
  }

  async isNotificationExisting(
    streamer: string,
    updateEvents: UserNotificationType[]
  ): Promise<boolean> {
    const queryParams = updateEvents.map(e => {
      return {
        streamer,
        [e]: true
      }
    })

    return (
      (
        await this.db.notification.find({
          where: queryParams
        })
      ).length !== 0
    )
  }

  mapEventTypeToUpdateType(event: NotifyEventType): UserNotificationType[] {
    if (event === NotifyEventType.SETTING)
      return [UserNotificationType.GAME, UserNotificationType.TITLE]
    return [UserNotificationType.OFFLINE, UserNotificationType.LIVE]
  }
}
