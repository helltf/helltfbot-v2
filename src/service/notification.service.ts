import { NotificationChannelEntity } from "../db/export-entities"
import { NotifyEventType, UserNotificationType } from "../modules/pubsub/types"

export class NotificationService {
  async cleanAllNotifications() {
    let notificationChannels: NotificationChannelEntity[] = []
    try {
      notificationChannels = await hb.db.notificationChannelRepo.find()
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
    await hb.db.notificationChannelRepo.update(
      {
        id: id
      },
      {
        [event]: false
      }
    )

    hb.pubSub.unlistenStreamerTopic(id, event)
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
      return { streamer, [e]: true }
    })

    return (
      (
        await hb.db.notificationRepo.find({
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